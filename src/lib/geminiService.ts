import { GoogleGenerativeAI } from '@google/generative-ai';
import { HouseholdProfile, CitySmogContext, GenAIPlanResponse, ActionItem, DailyRoutineSlot } from '../types';

export function generateDeterministicPlan(
  profile: HouseholdProfile,
  city: CitySmogContext
): GenAIPlanResponse {
  const hasKids = profile.members.some(m => m.role === 'Child');
  const hasSeniors = profile.members.some(m => m.role === 'Senior');
  const hasRespiratory = profile.members.some(m => m.hasRespiratorySensitivity);
  const isSevere = city.currentAQI >= 300;
  const isHazardous = city.currentAQI >= 400;

  const riskRating = isHazardous 
    ? 'Hazardous Emergency' 
    : isSevere 
      ? 'Severe Winter Episode' 
      : 'Moderate Concern';

  const vulnerableLabels: string[] = [];
  if (hasKids) vulnerableLabels.push('school-age children');
  if (hasSeniors) vulnerableLabels.push('elderly family members');
  if (hasRespiratory) vulnerableLabels.push('respiratory/asthmatic sensitivity');
  const vulnString = vulnerableLabels.length > 0 ? vulnerableLabels.join(', ') : 'healthy adults';

  const summaryVerdict = `Tailored winter smog protocol for ${city.name} (AQI ${city.currentAQI} · ${city.aqiCategory}). Your household profile with ${vulnString} in a ${profile.homeType.replace(/-/g, ' ')} requires active morning sealing during the 05:00–09:30 inversion peak, utilizing the brief ${city.safeVentilationWindows} dispersion window for air exchange, and protecting morning commutes.`;

  const routineSchedule: DailyRoutineSlot[] = [
    {
      timeWindow: '05:30 – 08:30',
      phase: 'Morning Smog Peak',
      recommendation: 'Strict window lockdown. Cold air pool traps tailpipe and biomass emissions at ground level. Postpone outdoor jogging/strolls.',
      windowAction: 'Seal tightly',
      commuteOrOutdoorGuidance: profile.commuteMode === 'solo-petrol-car' 
        ? 'Pre-cool car cabin with AC in internal air-recirculation mode (never pull external air).' 
        : 'Equip certified N95/FFP2 mask before exiting the door; avoid walking near major arterial roads.',
      vulnerableCareNote: hasKids 
        ? 'Coordinate with school administration for indoor-only morning assemblies.' 
        : 'Seniors should postpone balcony walks until after 11:30 AM.'
    },
    {
      timeWindow: '08:30 – 12:00',
      phase: 'Morning Smog Peak',
      recommendation: 'Keep entry doors shut. Use door draft snakes or wet rolled towels at base of exterior doors to block dust infiltration.',
      windowAction: 'Keep closed',
      commuteOrOutdoorGuidance: 'Avoid idling engines in apartment parking lots; wear mask during building transit.',
      vulnerableCareNote: hasRespiratory ? 'Keep prescribed bronchodilator / inhaler within immediate arm reach.' : 'Maintain indoor hydration.'
    },
    {
      timeWindow: '12:15 – 15:15',
      phase: 'Midday Ventilation Window',
      recommendation: `Solar thermal heating temporarily breaks the ground inversion layer. Optimum window to flush stagnant indoor CO₂ for 30–40 minutes.`,
      windowAction: 'Safe to cross-ventilate (30-45m)',
      commuteOrOutdoorGuidance: 'Safest time of the day for essential outdoor errands, balcony drying, or dog walking.',
      vulnerableCareNote: 'Open opposite windows to create a brisk cross-breeze, then re-seal promptly at 3:30 PM before evening cooling starts.'
    },
    {
      timeWindow: '17:30 – 20:30',
      phase: 'Evening Re-Inversion',
      recommendation: 'Ground temperatures drop rapidly; industrial and evening rush hour emissions become trapped in the boundary layer.',
      windowAction: 'Seal tightly',
      commuteOrOutdoorGuidance: profile.commuteMode.includes('metro') 
        ? 'Metro stations provide filtered underground transit; avoid surface auto-rickshaws in slow traffic.' 
        : 'Keep vehicle windows closed and cabin fan on recirculation.',
      vulnerableCareNote: hasKids ? 'Children must complete play inside or in indoor clubhouses; zero strenuous outdoor sports.' : 'Limit evening outdoor exposure.'
    },
    {
      timeWindow: '21:00 – 06:00',
      phase: 'Night Sealing',
      recommendation: profile.purifierStatus === 'none'
        ? 'Run fan on low speed with DIY filter/wet barrier to circulate air; keep bedroom door closed to create a micro-clean sleeping sanctuary.'
        : 'Set bedroom purifier to Auto/Night mode 30 minutes before sleep. Ensure windows are latched.',
      windowAction: 'Seal tightly',
      commuteOrOutdoorGuidance: 'Zero night outdoor exposure.',
      vulnerableCareNote: 'Dry winter smog irritates mucous membranes; use a room humidifier or open bowl of water near radiator/heat source.'
    }
  ];

  const iaqHacks: ActionItem[] = [
    {
      id: 'iaq-zero-cost-door-seal',
      title: 'Wet-Towel Door Draft & Sill Barricade',
      tier: 'Zero-Cost Habit',
      category: 'iaq',
      timeSlot: 'Morning & Night Inversion',
      description: 'Roll up damp microfiber towels or old cotton bedsheets and place them tightly along the gap beneath the main entrance and street-facing balcony doors.',
      evidenceBasedReason: 'Blocks up to 40% of micro-particulate draft infiltration at floor level where particulate concentration is highest.',
      pm25ReductionPercent: 22,
      dailyExposureReductionUg: 38,
      co2SavedMonthlyKg: 0,
      pm25PreventedMonthlyG: 0,
      isAdopted: true,
      costEstimateInr: 0,
    },
    {
      id: 'iaq-zero-cost-cooking-exhaust',
      title: 'Kitchen Exhaust with Bedroom Door Barrier',
      tier: 'Zero-Cost Habit',
      category: 'iaq',
      timeSlot: 'Meal Prep Hours',
      description: 'Run kitchen exhaust fan during tadka/frying while keeping kitchen door shut to prevent fine cooking aerosol (PM2.5) from flooding bedrooms.',
      evidenceBasedReason: 'Unventilated frying spices generate indoor PM2.5 spikes exceeding 600 µg/m³ within 15 minutes.',
      pm25ReductionPercent: 18,
      dailyExposureReductionUg: 32,
      co2SavedMonthlyKg: 0,
      pm25PreventedMonthlyG: 0,
      isAdopted: true,
      costEstimateInr: 0,
    },
    {
      id: 'iaq-low-cost-weatherstrip',
      title: 'Self-Adhesive EPDM Rubber Weatherstripping',
      tier: 'Low-Cost DIY (< ₹1,500)',
      category: 'iaq',
      timeSlot: 'One-Time Setup',
      description: 'Line window sashes and balcony sliding glass tracks with 5mm self-adhesive EPDM D-profile foam tape (available on Amazon/local hardware for ~₹350).',
      evidenceBasedReason: 'Reduces passive air leakage exchange rate (ACH) from 1.2 to 0.45 air changes/hour, cutting indoor particulate load by nearly half.',
      pm25ReductionPercent: 35,
      dailyExposureReductionUg: 58,
      co2SavedMonthlyKg: 0,
      pm25PreventedMonthlyG: 0,
      isAdopted: profile.hasWindowWeatherstripping,
      costEstimateInr: 450,
    },
    {
      id: 'iaq-low-cost-diy-fan-filter',
      title: 'DIY MERV-13 / HEPA Box-Fan Filtration Hack',
      tier: 'Low-Cost DIY (< ₹1,500)',
      category: 'iaq',
      timeSlot: 'Continuous in Living Area',
      description: 'Affix a 16x16" MERV-13 HVAC filter (~₹900) or replacement HEPA sheet to the intake of a standard table/pedestal fan with bungee cords.',
      evidenceBasedReason: 'Tested by Harvard & EPA studies to deliver 150–220 m³/h Clean Air Delivery Rate (CADR) at 1/10th the cost of commercial purifiers.',
      pm25ReductionPercent: 42,
      dailyExposureReductionUg: 72,
      co2SavedMonthlyKg: 0,
      pm25PreventedMonthlyG: 0,
      isAdopted: false,
      costEstimateInr: 950,
    },
    {
      id: 'iaq-tech-purifier-optimization',
      title: 'CADR & Placement Optimization (Central Flow)',
      tier: 'Purifier & Tech Optimization',
      category: 'iaq',
      timeSlot: '24/7 Smart Cycling',
      description: 'Move purifier away from room corners (minimum 1.5 ft clearance on all sides). Clean the mesh pre-filter weekly under running water to prevent motor strain.',
      evidenceBasedReason: 'Corner obstruction cuts effective laminar circulation volume by 30%. A clean mesh pre-filter extends expensive True HEPA lifespan by 4 months.',
      pm25ReductionPercent: 28,
      dailyExposureReductionUg: 45,
      co2SavedMonthlyKg: 6.2,
      pm25PreventedMonthlyG: 0,
      isAdopted: profile.purifierStatus !== 'none',
      costEstimateInr: 0,
    },
  ];

  const sustainableActions: ActionItem[] = [
    {
      id: 'sustainable-commute-metro-shift',
      title: 'Shift 3 Days to Metro / Group Carpool',
      tier: 'Community Swap',
      category: 'sustainable',
      timeSlot: 'Weekdays',
      description: 'Replace solo petrol car driving with Metro rail or society carpooling for 3 workdays per week.',
      evidenceBasedReason: 'Every 20 km roundtrip avoided by metro prevents 2.8 kg CO2 and 0.5g direct toxic tailpipe PM2.5 in neighborhood breathing zones.',
      pm25ReductionPercent: 25,
      dailyExposureReductionUg: 40,
      co2SavedMonthlyKg: 34.0,
      pm25PreventedMonthlyG: 16.5,
      isAdopted: profile.commuteMode === 'metro-public-transit',
      costEstimateInr: -1200, // saves fuel money
    },
    {
      id: 'sustainable-waste-zero-burn',
      title: 'Society Wet-Leaf Composting & Zero Open Burning',
      tier: 'Community Swap',
      category: 'sustainable',
      timeSlot: 'Daily Society Protocol',
      description: 'Enforce ban on security guards and gardeners burning dried leaves/waste for evening warmth; install electric radiant infrared heaters at guard booths.',
      evidenceBasedReason: 'Single pile of garden leaf burning emits more carcinogenic polycyclic aromatic hydrocarbons (PAHs) than 100 idling diesel trucks.',
      pm25ReductionPercent: 15,
      dailyExposureReductionUg: 24,
      co2SavedMonthlyKg: 22.0,
      pm25PreventedMonthlyG: 28.0,
      isAdopted: true,
      costEstimateInr: 1200,
    },
    {
      id: 'sustainable-dg-genset-minimization',
      title: 'Apartment Diesel Generator Load Shedding',
      tier: 'Community Swap',
      category: 'sustainable',
      timeSlot: 'Winter Evening Peak',
      description: 'Pass RWA resolution to restrict non-essential diesel generator power backups (corridor decorative lights, luxury lifts) to reduce localized soot.',
      evidenceBasedReason: 'Unfiltered diesel exhaust is classified as Group 1 human carcinogen by IARC and spikes rooftop PM2.5 by 400 µg/m³.',
      pm25ReductionPercent: 20,
      dailyExposureReductionUg: 30,
      co2SavedMonthlyKg: 45.0,
      pm25PreventedMonthlyG: 35.0,
      isAdopted: false,
      costEstimateInr: 0,
    },
  ];

  const communityPointers: string[] = [
    `Mandate electric heaters for night security guards across all gates to prevent open wood/plastic burning.`,
    `Sync apartment school bus stops to minimize multiple idling vehicles within society premises between 07:00 and 08:00 AM.`,
    `Schedule mechanical wet-sweeping or misting of internal society roads at 11:00 AM before afternoon dry dust re-suspension.`,
    `Establish a community clean-air sanctuary in the society clubhouse equipped with high-capacity HEPA filtration for elderly residents.`,
  ];

  return {
    summaryVerdict,
    riskRating,
    routineSchedule,
    iaqHacks,
    sustainableActions,
    communityPointers,
  };
}

export async function fetchGenAIPlan(
  profile: HouseholdProfile,
  city: CitySmogContext
): Promise<GenAIPlanResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // Graceful deterministic fallback
    return generateDeterministicPlan(profile, city);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are VayuSaathi, an elite public health environmental scientist and winter smog co-pilot for Indian urban families.
Analyze the following environmental and household context:

City Context:
- Name: ${city.name} (${city.state})
- Current AQI: ${city.currentAQI} (${city.aqiCategory})
- PM2.5: ${city.pm25} µg/m³, PM10: ${city.pm10} µg/m³, Dominant: ${city.dominantPollutant}
- Temperature Inversion Status: ${city.inversionStatus}
- Safe Ventilation Windows: ${city.safeVentilationWindows}
- High-Risk Inversion Hours: ${city.highRiskInversionHours}

Household Profile:
- Members: ${JSON.stringify(profile.members)}
- Home Type: ${profile.homeType}
- Air Purifier Status: ${profile.purifierStatus}
- Weatherstripping installed: ${profile.hasWindowWeatherstripping}
- Daily Commute: ${profile.commuteMode} (${profile.dailyCommuteKm} km)
- Outdoor Exercise Habit: ${profile.outdoorExerciseTime}
- Cooking Fuel: ${profile.cookingFuel}
- Society / Apartment Size: ${profile.societySizeFamilies} families

Requirements:
Return ONLY valid JSON matching this exact structure (no markdown formatting, no backticks, just raw JSON):
{
  "summaryVerdict": "string (2-3 sentences concise civic environmental diagnosis)",
  "riskRating": "Moderate Concern" | "Severe Winter Episode" | "Hazardous Emergency",
  "routineSchedule": [
    {
      "timeWindow": "string (e.g. '05:30 – 08:30')",
      "phase": "Morning Smog Peak" | "Midday Ventilation Window" | "Afternoon Low Inversion" | "Evening Re-Inversion" | "Night Sealing",
      "recommendation": "string",
      "windowAction": "Seal tightly" | "Safe to cross-ventilate (30-45m)" | "Keep closed",
      "commuteOrOutdoorGuidance": "string",
      "vulnerableCareNote": "string"
    }
  ],
  "iaqHacks": [
    {
      "id": "string",
      "title": "string",
      "tier": "Zero-Cost Habit" | "Low-Cost DIY (< ₹1,500)" | "Purifier & Tech Optimization" | "Community Swap",
      "category": "iaq",
      "timeSlot": "string",
      "description": "string",
      "evidenceBasedReason": "string",
      "pm25ReductionPercent": number,
      "dailyExposureReductionUg": number,
      "co2SavedMonthlyKg": number,
      "pm25PreventedMonthlyG": number,
      "isAdopted": boolean,
      "costEstimateInr": number
    }
  ],
  "sustainableActions": [
    {
      "id": "string",
      "title": "string",
      "tier": "Zero-Cost Habit" | "Low-Cost DIY (< ₹1,500)" | "Purifier & Tech Optimization" | "Community Swap",
      "category": "sustainable",
      "timeSlot": "string",
      "description": "string",
      "evidenceBasedReason": "string",
      "pm25ReductionPercent": number,
      "dailyExposureReductionUg": number,
      "co2SavedMonthlyKg": number,
      "pm25PreventedMonthlyG": number,
      "isAdopted": boolean,
      "costEstimateInr": number
    }
  ],
  "communityPointers": ["string", "string", "string", "string"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Clean potential markdown wrap
    const cleanedJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleanedJson) as GenAIPlanResponse;
    return parsed;
  } catch (error) {
    console.warn('Gemini API call failed or timed out, using calibrated deterministic engine:', error);
    return generateDeterministicPlan(profile, city);
  }
}
