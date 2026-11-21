export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Poor' 
  | 'Unhealthy'
  | 'Very Poor' 
  | 'Severe' 
  | 'Hazardous';

export interface DiurnalHourPoint {
  hour: number; // 0 to 23
  timeLabel: string; // e.g. "06:00"
  pm25: number; // µg/m³
  aqi: number;
  inversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  isSafeVentilationWindow: boolean;
  notes?: string;
}

export interface CitySmogContext {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  currentAQI: number;
  aqiCategory: AQICategory;
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2';
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirection: string;
  inversionStatus: 
    | 'Severe Ground Smog Trap' 
    | 'Smog Trap Clearing' 
    | 'Fresh Coastal Breeze' 
    | 'Evening Smog Trap Building' 
    | 'Clear Natural Airflow' 
    | string;
  safeVentilationWindows: string; // e.g. "12:30 PM - 03:30 PM"
  ventilationStartHour: number; // e.g. 12
  ventilationEndHour: number; // e.g. 15
  highRiskInversionHours: string; // e.g. "05:00 AM - 09:30 AM & 08:00 PM - 02:00 AM"
  diurnalCurve: DiurnalHourPoint[];
  dataSource?: 'live' | 'preset' | 'manual';
  lastUpdatedText?: string;
}

export interface HouseholdMember {
  id: string;
  role: 'Adult' | 'Child' | 'Senior';
  hasRespiratorySensitivity: boolean; // Asthma, bronchitis, COPD
  hoursOutdoorsPerDay: number;
}

export type HomeType = 
  | 'high-rise-apartment' 
  | 'low-rise-apartment' 
  | 'independent-house-street' 
  | 'independent-house-interior';

export type PurifierStatus = 
  | 'none' 
  | 'single-bedroom' 
  | 'full-house';

export type CommuteMode = 
  | 'metro-public-transit' 
  | 'solo-petrol-car' 
  | 'carpool-cab' 
  | 'two-wheeler' 
  | 'work-from-home';

export interface HouseholdProfile {
  members: HouseholdMember[];
  homeType: HomeType;
  purifierStatus: PurifierStatus;
  hasWindowWeatherstripping: boolean;
  commuteMode: CommuteMode;
  dailyCommuteKm: number;
  outdoorExerciseTime: 'None / Indoors' | 'Early Morning (05:00 - 08:00)' | 'Midday (12:00 - 15:00)' | 'Evening (18:00 - 21:00)';
  cookingFuel: 'LPG / Induction' | 'Mixed / Occasional Solid Fuel';
  societySizeFamilies: number; // e.g. 50 families in apartment complex
}

export interface ActionItem {
  id: string;
  title: string;
  tier: 'Zero-Cost Habit' | 'Low-Cost DIY (< ₹1,500)' | 'Purifier & Tech Optimization' | 'Community Swap';
  category: 'routine' | 'iaq' | 'sustainable' | 'community';
  timeSlot?: string;
  description: string;
  evidenceBasedReason: string;
  pm25ReductionPercent: number; // estimated local micro-environment exposure reduction %
  dailyExposureReductionUg: number; // estimated µg avoided for average member
  co2SavedMonthlyKg: number; // estimated monthly kg CO2 saved
  pm25PreventedMonthlyG: number; // emissions prevented
  isAdopted: boolean;
  costEstimateInr: number;
}

export interface DailyRoutineSlot {
  timeWindow: string; // e.g. "06:00 - 08:30"
  phase: 'Morning Smog Peak' | 'Midday Ventilation Window' | 'Afternoon Low Inversion' | 'Evening Re-Inversion' | 'Night Sealing';
  recommendation: string;
  windowAction: 'Seal tightly' | 'Safe to cross-ventilate (30-45m)' | 'Keep closed';
  commuteOrOutdoorGuidance: string;
  vulnerableCareNote: string;
}

export interface GenAIPlanResponse {
  summaryVerdict: string;
  riskRating: 'Moderate Concern' | 'Severe Winter Episode' | 'Hazardous Emergency';
  routineSchedule: DailyRoutineSlot[];
  iaqHacks: ActionItem[];
  sustainableActions: ActionItem[];
  communityPointers: string[];
}

export interface ImpactSimulationResults {
  baselineDailyInhaledDoseUg: number; // per household average
  adoptedDailyInhaledDoseUg: number;
  totalUgAvoidedDaily: number;
  percentExposureDrop: number;
  passiveCigaretteEquivalentAvoidedDaily: number;
  householdMonthlyCo2SavedKg: number;
  householdMonthlyPmPreventedG: number;
  // Community scaled
  communityFamiliesCount: number;
  communityMonthlyCo2SavedKg: number;
  communityMonthlyPmPreventedKg: number;
}
