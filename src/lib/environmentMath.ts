import { HouseholdProfile, CitySmogContext, ActionItem, ImpactSimulationResults } from '../types';

/**
 * Deterministic Environmental Exposure & Inhalation Dose Engine
 * Based on EPA Exposure Factors Handbook, WHO IAQ Guidelines & Berkeley Earth equivalence metrics.
 */

// Inhalation volume rates (m³/hour)
const VENTILATION_RATES = {
  Adult: { resting: 0.45, active: 0.90, exercise: 1.80 },
  Child: { resting: 0.35, active: 0.70, exercise: 1.40 },
  Senior: { resting: 0.40, active: 0.65, exercise: 1.20 },
};

export function calculateInhaledDose(
  profile: HouseholdProfile,
  cityContext: CitySmogContext,
  adoptedActionIds: string[]
): ImpactSimulationResults {
  const ambientPm25 = cityContext.pm25;

  // Check which interventions are adopted
  const isPurifierOptimized = adoptedActionIds.some(id => id.includes('purifier') || id.includes('hepa'));
  const isWeatherstrippingActive = profile.hasWindowWeatherstripping || adoptedActionIds.some(id => id.includes('seal') || id.includes('weatherstrip'));
  const isVentilationTimed = adoptedActionIds.some(id => id.includes('ventilate') || id.includes('window'));
  const isCommuteShifted = adoptedActionIds.some(id => id.includes('metro') || id.includes('carpool') || id.includes('transit'));
  const isExerciseShifted = adoptedActionIds.some(id => id.includes('exercise') || id.includes('gym') || id.includes('indoor'));
  const isMaskUsed = adoptedActionIds.some(id => id.includes('mask') || id.includes('n95'));

  // 1. Calculate Baseline Indoor Infiltration Factor
  let baselineInfiltration = 0.65; // standard unsealed urban home
  if (profile.homeType === 'independent-house-street') baselineInfiltration = 0.78;
  if (profile.homeType === 'high-rise-apartment') baselineInfiltration = 0.60;
  if (profile.purifierStatus === 'single-bedroom') baselineInfiltration -= 0.18;
  if (profile.purifierStatus === 'full-house') baselineInfiltration -= 0.38;
  if (profile.hasWindowWeatherstripping) baselineInfiltration -= 0.12;
  baselineInfiltration = Math.max(0.18, baselineInfiltration);

  // Adopted Infiltration Factor
  let adoptedInfiltration = baselineInfiltration;
  if (isWeatherstrippingActive && !profile.hasWindowWeatherstripping) adoptedInfiltration -= 0.15;
  if (isPurifierOptimized && profile.purifierStatus === 'none') adoptedInfiltration -= 0.25;
  else if (isPurifierOptimized) adoptedInfiltration -= 0.12;
  if (isVentilationTimed) adoptedInfiltration -= 0.08;
  adoptedInfiltration = Math.max(0.12, adoptedInfiltration);

  // Micro-environment PM2.5 concentrations (µg/m³)
  const baselineIndoorPm25 = ambientPm25 * baselineInfiltration;
  const adoptedIndoorPm25 = ambientPm25 * adoptedInfiltration;

  // Outdoor Exposure PM2.5 with/without N95 and timing
  let baselineOutdoorPm25 = ambientPm25;
  if (profile.outdoorExerciseTime === 'Early Morning (05:00 - 08:00)') {
    baselineOutdoorPm25 *= 1.40; // peak inversion trapping
  }

  let adoptedOutdoorPm25 = baselineOutdoorPm25;
  if (isExerciseShifted) {
    adoptedOutdoorPm25 = ambientPm25 * 0.75; // moved to midday or indoor filtered
  }
  if (isMaskUsed) {
    adoptedOutdoorPm25 *= 0.15; // N95 achieves ~85% reduction during transit
  }

  // Calculate baseline & adopted daily inhalation doses for each member
  let totalBaselineUg = 0;
  let totalAdoptedUg = 0;

  profile.members.forEach((member) => {
    const rates = VENTILATION_RATES[member.role] || VENTILATION_RATES.Adult;
    const outdoorHours = Math.max(1, member.hoursOutdoorsPerDay);
    const indoorHours = 24 - outdoorHours;

    // Baseline calculation
    // Indoor: 8h resting (sleep), rest active
    const sleepHours = 8;
    const indoorActiveHours = Math.max(0, indoorHours - sleepHours);
    const baselineDailyAirM3 = (sleepHours * rates.resting) + (indoorActiveHours * rates.active) + (outdoorHours * (member.role === 'Child' ? rates.exercise : rates.active));

    const baselineDose = (
      (sleepHours * rates.resting * baselineIndoorPm25) +
      (indoorActiveHours * rates.active * baselineIndoorPm25) +
      (outdoorHours * rates.active * baselineOutdoorPm25)
    );

    // Adopted calculation
    const adoptedDose = (
      (sleepHours * rates.resting * adoptedIndoorPm25) +
      (indoorActiveHours * rates.active * adoptedIndoorPm25) +
      (outdoorHours * rates.active * adoptedOutdoorPm25)
    );

    totalBaselineUg += baselineDose;
    totalAdoptedUg += adoptedDose;
  });

  const memberCount = Math.max(1, profile.members.length);
  const baselineAvgUg = Math.round(totalBaselineUg / memberCount);
  const adoptedAvgUg = Math.round(totalAdoptedUg / memberCount);
  const totalUgAvoidedDaily = Math.max(0, baselineAvgUg - adoptedAvgUg);
  const percentExposureDrop = baselineAvgUg > 0 ? Math.round((totalUgAvoidedDaily / baselineAvgUg) * 100) : 0;

  // 1 passive cigarette equivalence ≈ 22 µg PM2.5 inhaled
  const passiveCigaretteEquivalentAvoidedDaily = Number((totalUgAvoidedDaily / 22).toFixed(1));

  // 2. Commute & Household Emission Reductions (CO2 & PM2.5)
  // Petrol car: 140g CO2/km, 0.025g PM2.5/km
  // Metro: 25g CO2/km, 0.002g PM2.5/km
  let monthlyCo2SavedKg = 0;
  let monthlyPmPreventedG = 0;

  const workdaysPerMonth = 22;
  const roundTripKm = profile.dailyCommuteKm;

  if (isCommuteShifted && (profile.commuteMode === 'solo-petrol-car' || profile.commuteMode === 'carpool-cab')) {
    const dailyCo2GramsSaved = roundTripKm * (140 - 25);
    const dailyPmGramsSaved = roundTripKm * (0.025 - 0.002);
    monthlyCo2SavedKg += (dailyCo2GramsSaved * workdaysPerMonth) / 1000;
    monthlyPmPreventedG += dailyPmGramsSaved * workdaysPerMonth;
  }

  // Energy & waste swaps (LED, heating optimization, waste segregation preventing local burning)
  if (adoptedActionIds.some(id => id.includes('waste') || id.includes('compost'))) {
    monthlyCo2SavedKg += 18.5;
    monthlyPmPreventedG += 12.0; // prevents open localized burning
  }

  if (adoptedActionIds.some(id => id.includes('boiler') || id.includes('solar') || id.includes('appliance'))) {
    monthlyCo2SavedKg += 28.0;
    monthlyPmPreventedG += 4.5;
  }

  // Round values
  const householdMonthlyCo2SavedKg = Math.round(monthlyCo2SavedKg * 10) / 10;
  const householdMonthlyPmPreventedG = Math.round(monthlyPmPreventedG * 10) / 10;

  // Community multiplier
  const communityFamiliesCount = profile.societySizeFamilies || 50;
  const communityMonthlyCo2SavedKg = Math.round(householdMonthlyCo2SavedKg * communityFamiliesCount);
  const communityMonthlyPmPreventedKg = Math.round(((householdMonthlyPmPreventedG * communityFamiliesCount) / 1000) * 10) / 10;

  return {
    baselineDailyInhaledDoseUg: baselineAvgUg,
    adoptedDailyInhaledDoseUg: adoptedAvgUg,
    totalUgAvoidedDaily,
    percentExposureDrop,
    passiveCigaretteEquivalentAvoidedDaily,
    householdMonthlyCo2SavedKg,
    householdMonthlyPmPreventedG,
    communityFamiliesCount,
    communityMonthlyCo2SavedKg,
    communityMonthlyPmPreventedKg,
  };
}
