import { GoogleGenerativeAI } from '@google/generative-ai';
import { HouseholdProfile, CitySmogContext, GenAIPlanResponse, ActionItem, DailyRoutineSlot } from '../types';

export function generateDeterministicPlan(
  profile: HouseholdProfile,
  city: CitySmogContext
): GenAIPlanResponse {
  const hasKids = profile.members.some(m => m.role === 'Child');
  const hasSeniors = profile.members.some(m => m.role === 'Senior');
  const hasRespiratory = profile.members.some(m => m.hasRespiratorySensitivity);

  const aqi = city.currentAQI;
  const isGood = aqi <= 100;
  const isModerate = aqi > 100 && aqi <= 200;
  const isPoorOrVeryPoor = aqi > 200 && aqi <= 350;
  const isSevereOrHazardous = aqi > 350;

  const riskRating = isSevereOrHazardous 
    ? (aqi >= 400 ? 'Hazardous Emergency' : 'Severe Winter Episode')
    : (isPoorOrVeryPoor ? 'Severe Winter Episode' : 'Moderate Concern');

  const vulnerableLabels: string[] = [];
  if (hasKids) vulnerableLabels.push('school-age children');
  if (hasSeniors) vulnerableLabels.push('elderly family members');
  if (hasRespiratory) vulnerableLabels.push('respiratory/asthmatic sensitivity');
  const vulnString = vulnerableLabels.length > 0 ? vulnerableLabels.join(', ') : 'healthy adults';

  // 1. DYNAMIC SUMMARY VERDICT BASED ON AQI TIER
  let summaryVerdict = '';
  if (isGood) {
    summaryVerdict = `Fresh, clean air across ${city.name} today (AQI ${city.currentAQI} · ${city.aqiCategory}). Airflow is steady and clear with no trapped smog. For your household with ${vulnString}, it's a great day to open windows for natural cross-breeze (${city.safeVentilationWindows}) and enjoy outdoor walks and school sports.`;
  } else if (isModerate) {
    summaryVerdict = `Comfortable air quality in ${city.name} today (AQI ${city.currentAQI} · ${city.aqiCategory}). Steady breezes keep the air moving nicely. For ${vulnString}, it is safe to enjoy outdoor time throughout the day, opening windows freely between ${city.safeVentilationWindows}. Take simple precautions only near heavy rush-hour traffic.`;
  } else if (isPoorOrVeryPoor) {
    summaryVerdict = `Elevated smog conditions in ${city.name} (AQI ${city.currentAQI} · ${city.aqiCategory}). Cold air is trapping smoke and dust close to the ground during early mornings and evenings. For ${vulnString}, keep windows closed in the early morning and ventilate during the midday sun (${city.safeVentilationWindows}).`;
  } else {
    summaryVerdict = `Severe winter smog alert for ${city.name} (AQI ${city.currentAQI} · ${city.aqiCategory}). Cold winter air has trapped heavy smoke and dust (PM2.5 > ${city.pm25} µg/m³) at street level. Your family with ${vulnString} should keep windows and balcony doors sealed tight during peak smog hours (${city.highRiskInversionHours}) and avoid strenuous outdoor exercise.`;
  }

  // 2. DYNAMIC ROUTINE SCHEDULE BASED ON AQI TIER
  let routineSchedule: DailyRoutineSlot[] = [];

  if (isGood) {
    routineSchedule = [
      {
        timeWindow: '06:00 – 08:30',
        phase: 'Midday Ventilation Window',
        recommendation: 'Clean morning airflow. Great time for morning jogs, yoga on the balcony, and natural cross-ventilation.',
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Active commute (walking, cycling) is safe and encouraged. Minimal background particulate pollution.',
        vulnerableCareNote: hasKids ? 'Safe for normal outdoor school sports and morning playtime.' : 'Enjoy morning natural sunlight.'
      },
      {
        timeWindow: '08:30 – 12:00',
        phase: 'Midday Ventilation Window',
        recommendation: 'Mild localized traffic increase near major junctions. Keep windows open for fresh air exchange away from main roads.',
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Public transit or carpool recommended to keep regional emissions low.',
        vulnerableCareNote: hasRespiratory ? 'No special respiratory restrictions under current AQI levels.' : 'Maintain regular indoor hydration.'
      },
      {
        timeWindow: '12:00 – 16:30',
        phase: 'Afternoon Low Inversion',
        recommendation: `Warm midday sunshine and gentle breezes clear out indoor air naturally (${city.safeVentilationWindows}). Perfect window to open up the house.`,
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Full outdoor mobility with zero atmospheric risk.',
        vulnerableCareNote: 'Sunlight and airflow keep indoor CO₂ levels low without purifier strain.'
      },
      {
        timeWindow: '17:30 – 20:30',
        phase: 'Afternoon Low Inversion',
        recommendation: 'Evening commute traffic peak. Close street-facing windows only if dwelling directly overlooks major traffic junctions.',
        windowAction: profile.homeType === 'independent-house-street' ? 'Keep closed' : 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Standard evening commute.',
        vulnerableCareNote: 'Park visits and outdoor exercise safe for all ages.'
      },
      {
        timeWindow: '21:00 – 06:00',
        phase: 'Night Sealing',
        recommendation: 'Cool, pleasant night air. Natural cross-ventilation or fan circulation is comfortable and safe.',
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Zero ambient hazard.',
        vulnerableCareNote: 'Normal restful sleep; purifiers optional.'
      }
    ];
  } else if (isModerate) {
    routineSchedule = [
      {
        timeWindow: '06:00 – 08:30',
        phase: 'Morning Smog Peak',
        recommendation: 'Mild early haze mixed with humidity. Sensitive individuals should avoid jogging immediately adjacent to heavy traffic arteries.',
        windowAction: 'Keep closed',
        commuteOrOutdoorGuidance: 'Use AC recirc mode in cars during peak traffic; two-wheeler riders may use a basic dust mask.',
        vulnerableCareNote: hasRespiratory ? 'Asthmatics should do gentle warm-ups before heading outdoors.' : 'Safe for general population.'
      },
      {
        timeWindow: '08:30 – 12:00',
        phase: 'Midday Ventilation Window',
        recommendation: 'Solar radiation burns off morning moisture. Steady wind dispersion begins.',
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Standard transit; avoid idling vehicles in basement parking.',
        vulnerableCareNote: 'Good time for elderly balcony strolls.'
      },
      {
        timeWindow: '12:00 – 16:30',
        phase: 'Midday Ventilation Window',
        recommendation: `Prime ventilation window (${city.safeVentilationWindows}). Good sea breeze or thermal mixing.`,
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Safest outdoor window of the day for errands and sports.',
        vulnerableCareNote: 'Open opposite windows to flush indoor cooking aerosol and CO₂.'
      },
      {
        timeWindow: '17:30 – 20:30',
        phase: 'Evening Re-Inversion',
        recommendation: 'Evening traffic accumulation. Keep windows closed on road-facing sides.',
        windowAction: 'Keep closed',
        commuteOrOutdoorGuidance: 'Metro rail or carpool helps prevent traffic-clogged exhaust pockets.',
        vulnerableCareNote: 'Children outdoor play is fine in green community parks.'
      },
      {
        timeWindow: '21:00 – 06:00',
        phase: 'Night Sealing',
        recommendation: 'Night settling. Purifiers on low or auto speed in bedrooms.',
        windowAction: 'Keep closed',
        commuteOrOutdoorGuidance: 'Minimal outdoor precautions needed.',
        vulnerableCareNote: 'Ensure bedroom doors are slightly ajar for air circulation if not using purifier.'
      }
    ];
  } else {
    // Severe / Hazardous (Delhi, Gurugram, Noida, etc.)
    routineSchedule = [
      {
        timeWindow: '05:30 – 08:30',
        phase: 'Morning Smog Peak',
        recommendation: 'Strict window lockdown. Shallow cold boundary layer (<150m) traps heavy toxic particulates and vehicle exhaust.',
        windowAction: 'Seal tightly',
        commuteOrOutdoorGuidance: profile.commuteMode === 'solo-petrol-car'
          ? 'Pre-cool car cabin with AC set strictly to internal air recirculation.'
          : 'Equip certified N95 mask before leaving home; avoid walking near arterial roads.',
        vulnerableCareNote: hasKids
          ? 'Coordinate with school administration for indoor-only morning activities.'
          : 'Seniors & asthmatics must postpone outdoor walks until after 11:30 AM.'
      },
      {
        timeWindow: '08:30 – 12:00',
        phase: 'Morning Smog Peak',
        recommendation: 'Keep all exterior doors sealed. Place door draft snakes or damp towels at entrance sills to prevent particulate entry.',
        windowAction: 'Keep closed',
        commuteOrOutdoorGuidance: 'Avoid idling engines in apartment parking basements; wear mask during transit.',
        vulnerableCareNote: hasRespiratory ? 'Keep emergency inhaler/bronchodilator in immediate reach.' : 'Maintain indoor hydration.'
      },
      {
        timeWindow: city.safeVentilationWindows,
        phase: 'Midday Ventilation Window',
        recommendation: `Thermal solar heating temporarily pierces the cold inversion ceiling. Optimum 30–45 min window to flush indoor CO₂.`,
        windowAction: 'Safe to cross-ventilate (30-45m)',
        commuteOrOutdoorGuidance: 'Safest daytime window for essential outdoor grocery runs or pet walks.',
        vulnerableCareNote: 'Open opposite windows for brisk airflow, then re-seal promptly before 3:30 PM.'
      },
      {
        timeWindow: '17:30 – 20:30',
        phase: 'Evening Re-Inversion',
        recommendation: 'Surface cooling triggers rapid re-inversion. Biomass smoke and rush-hour emissions get trapped.',
        windowAction: 'Seal tightly',
        commuteOrOutdoorGuidance: profile.commuteMode.includes('metro')
          ? 'Metro rail provides filtered underground transit; avoid open two-wheelers in traffic jams.'
          : 'Keep vehicle windows rolled up and fan on recirculation.',
        vulnerableCareNote: hasKids ? 'Children must remain strictly indoors; zero strenuous outdoor sports.' : 'Limit evening outdoor exposure.'
      },
      {
        timeWindow: '21:00 – 06:00',
        phase: 'Night Sealing',
        recommendation: profile.purifierStatus === 'none'
          ? 'Keep bedroom sealed to create a micro-clean sleeping sanctuary; use fan with DIY filter to circulate air.'
          : 'Set bedroom purifier to Auto/Night mode 30 minutes before sleep. Ensure windows are tightly latched.',
        windowAction: 'Seal tightly',
        commuteOrOutdoorGuidance: 'Zero non-essential night outdoor exposure.',
        vulnerableCareNote: 'Dry toxic smog irritates airways; keep an open water bowl or humidifier near sleeping area.'
      }
    ];
  }

  // 3. IAQ HACKS TAILORED TO AMBIENT SMOG SEVERITY
  const iaqHacks: ActionItem[] = [
    {
      id: 'iaq-zero-cost-door-seal',
      title: 'Wet-Towel Door Draft & Sill Barricade',
      tier: 'Zero-Cost Habit',
      category: 'iaq',
      timeSlot: 'Morning & Night Inversion',
      description: 'Roll up damp microfiber towels or old cotton bedsheets and place them tightly along the gap beneath the main entrance and street-facing balcony doors.',
      evidenceBasedReason: 'Blocks up to 40% of micro-particulate draft infiltration at floor level where ground-inversion particulate density is highest.',
      pm25ReductionPercent: isGood ? 10 : 22,
      dailyExposureReductionUg: isGood ? 12 : 38,
      co2SavedMonthlyKg: 0,
      pm25PreventedMonthlyG: 0,
      isAdopted: !isGood,
      costEstimateInr: 0,
    },
    {
      id: 'iaq-zero-cost-cooking-exhaust',
      title: 'Kitchen Exhaust with Bedroom Door Barrier',
      tier: 'Zero-Cost Habit',
      category: 'iaq',
      timeSlot: 'Meal Prep Hours',
      description: 'Run kitchen exhaust fan during tadka/frying while keeping kitchen door shut to prevent fine cooking aerosol (PM2.5) from flooding bedrooms.',
      evidenceBasedReason: 'Unventilated frying spices generate indoor PM2.5 spikes exceeding 600 µg/m³ within 15 minutes, degrading clean indoor rooms.',
      pm25ReductionPercent: 18,
      dailyExposureReductionUg: isGood ? 15 : 32,
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
      pm25ReductionPercent: isGood ? 15 : 35,
      dailyExposureReductionUg: isGood ? 20 : 58,
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
      pm25ReductionPercent: isGood ? 20 : 42,
      dailyExposureReductionUg: isGood ? 24 : 72,
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
      pm25ReductionPercent: isGood ? 12 : 28,
      dailyExposureReductionUg: isGood ? 16 : 45,
      co2SavedMonthlyKg: 6.2,
      pm25PreventedMonthlyG: 0,
      isAdopted: profile.purifierStatus !== 'none',
      costEstimateInr: 0,
    },
  ];

  // 4. SUSTAINABLE ACTIONS
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
      dailyExposureReductionUg: isGood ? 14 : 40,
      co2SavedMonthlyKg: 34.0,
      pm25PreventedMonthlyG: 16.5,
      isAdopted: profile.commuteMode === 'metro-public-transit',
      costEstimateInr: -1200,
    },
    {
      id: 'sustainable-waste-zero-burn',
      title: 'Society Wet-Leaf Composting & Zero Open Burning',
      tier: 'Community Swap',
      category: 'sustainable',
      timeSlot: 'Daily Society Protocol',
      description: 'Enforce ban on security guards and gardeners burning dried leaves/waste for evening warmth; install electric radiant infrared heaters at guard booths.',
      evidenceBasedReason: 'Single pile of garden leaf burning emits more carcinogenic polycyclic aromatic hydrocarbons (PAHs) than 100 idling diesel trucks.',
      pm25ReductionPercent: isGood ? 8 : 15,
      dailyExposureReductionUg: isGood ? 10 : 24,
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
      pm25ReductionPercent: isGood ? 10 : 20,
      dailyExposureReductionUg: isGood ? 12 : 30,
      co2SavedMonthlyKg: 45.0,
      pm25PreventedMonthlyG: 35.0,
      isAdopted: false,
      costEstimateInr: 0,
    },
  ];

  const communityPointers: string[] = isGood
    ? [
        `Maintain green tree canopy and balcony potted buffers (Areca palm, Snake plant) to absorb localized road dust.`,
        `Promote active carpooling and electric shuttle links for school and office commutes to maintain green city status.`,
        `Enforce decentralized society wet-waste composting to eliminate plastic/leaf burning permanently.`,
        `Keep society solar water heaters and rooftop solar panels free of construction dust for peak winter efficiency.`,
      ]
    : [
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

    const prompt = `You are BreathLine, an elite public health environmental scientist and winter smog routine guide for Indian urban families.
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

IMPORTANT LOGIC RULE:
If AQI is Good (<=100) or Moderate (<=200), advice MUST NOT prescribe severe smog emergency window lockdowns or high-risk warnings! Instead, encourage healthy outdoor activities and daytime ventilation.
If AQI is Severe or Hazardous (>350), prescribe strict morning window sealing, N95 usage, and emergency protocols.

Return ONLY valid JSON matching this exact structure:
{
  "summaryVerdict": "string (2-3 sentences concise civic environmental diagnosis tailored to AQI level)",
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
    
    const cleanedJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleanedJson) as GenAIPlanResponse;
    return parsed;
  } catch (error) {
    console.warn('Gemini API call failed or timed out, using calibrated deterministic engine:', error);
    return generateDeterministicPlan(profile, city);
  }
}
