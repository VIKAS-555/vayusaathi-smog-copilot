import { CitySmogContext, DiurnalHourPoint } from '../types';

export function calculateInversionRisk(
  pm25: number,
  aqi: number,
  mult: number
): 'Low' | 'Moderate' | 'High' | 'Severe' {
  // 1. Clean air condition: regardless of atmospheric layer, low particulate mass means low trapping hazard
  if (pm25 <= 35 || aqi <= 60) {
    return 'Low';
  }
  // 2. Satisfactory/Moderate air condition
  if (pm25 <= 60 || aqi <= 100) {
    return mult >= 1.30 ? 'Moderate' : 'Low';
  }
  // 3. Elevated/Poor air condition
  if (pm25 <= 120 || aqi <= 200) {
    if (mult >= 1.25) return 'High';
    if (mult <= 0.75) return 'Low';
    return 'Moderate';
  }
  // 4. High to Hazardous air condition (PM2.5 > 120 or AQI > 200)
  if (mult >= 1.25 || pm25 >= 250) {
    return 'Severe';
  }
  if (mult >= 1.10 || pm25 >= 180) {
    return 'High';
  }
  if (mult <= 0.75) {
    return 'Low';
  }
  return 'Moderate';
}

export function getHourlyGuidance(point: {
  hour: number;
  pm25: number;
  aqi: number;
  inversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  isSafeVentilationWindow: boolean;
}): {
  ventilation: string;
  outdoor: string;
  atmosphere: string;
} {
  // Clean air scenario (Low concentration / minimal smog)
  if (point.pm25 <= 35 || point.aqi <= 60) {
    return {
      ventilation: 'Safe to open windows anytime for natural fresh air renewal.',
      outdoor: 'Ideal conditions for morning jogs, runs, and outdoor activities.',
      atmosphere: 'Clean air layer with unobstructed natural dispersion.',
    };
  }

  // Active Safe Ventilation Window
  if (point.isSafeVentilationWindow) {
    return {
      ventilation: 'Optimal airing window. Open opposite windows for 30–45 min to flush indoor CO₂ and stale air.',
      outdoor: 'Safest time for outdoor errands, brisk walks, or school sports with lower surface PM2.5.',
      atmosphere: 'Solar heating warms the ground, breaking the nocturnal inversion cap and lifting pollutants.',
    };
  }

  // Severe Inversion
  if (point.inversionRisk === 'Severe') {
    return {
      ventilation: 'Keep all windows tightly shut. Run indoor HEPA purifier on continuous medium/high mode.',
      outdoor: 'Avoid intense outdoor cardio (running, cycling). If commuting, wear a snug N95 mask.',
      atmosphere: 'Dense cold surface layer traps vehicle exhaust and smoke right near breathing level.',
    };
  }

  // High Inversion
  if (point.inversionRisk === 'High') {
    return {
      ventilation: 'Keep windows and exterior doors closed to block smog ingress and vehicle soot.',
      outdoor: 'Limit prolonged outdoor workouts; sensitive groups, children, and seniors should stay indoors.',
      atmosphere: 'Surface cooling suppresses vertical mixing, concentrating particulate matter.',
    };
  }

  // Moderate
  return {
    ventilation: 'Brief 10–15 min cross-breeze is permissible if away from high-traffic roadways.',
    outdoor: 'Light outdoor walking is fine; avoid heavy exertion directly adjacent to busy rush-hour roads.',
    atmosphere: 'Moderate convective airflow; particulate levels fluctuate with traffic rush.',
  };
}

export function generateDiurnalCurve(
  basePm25: number,
  baseAqi: number,
  ventStart: number = 12,
  ventEnd: number = 15,
  isLowSmogCity: boolean = false
): DiurnalHourPoint[] {
  // If clean baseline or low smog city (e.g., Bengaluru or Mumbai):
  // Diurnal variation is mild, driven mainly by peak traffic rush rather than cold surface inversion trapping.
  const isCleanBaseline = isLowSmogCity || baseAqi <= 120 || basePm25 <= 45;

  if (isCleanBaseline) {
    const mildMultipliers = [
      0.85, 0.82, 0.80, 0.82, 0.88, // 00:00 - 04:00 (clean night baseline)
      0.95, 1.10, 1.18, 1.12, 1.00, // 05:00 - 09:00 (morning traffic peak)
      0.90, 0.85, 0.82, 0.80, 0.82, // 10:00 - 14:00 (daytime sun & convective dispersion)
      0.85, 0.92, 1.08, 1.15, 1.10, // 15:00 - 19:00 (evening traffic)
      1.00, 0.95, 0.90, 0.88        // 20:00 - 23:00 (dispersed)
    ];

    return mildMultipliers.map((mult, hour) => {
      const pm25 = Math.round(basePm25 * mult);
      const aqi = Math.min(500, Math.round(baseAqi * mult));
      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
      
      const inversionRisk = calculateInversionRisk(pm25, aqi, mult);
      const isSafeVentilationWindow = hour >= ventStart && hour <= ventEnd;

      let notes = undefined;
      if (hour === 8) notes = 'Mild morning commute traffic';
      if (hour === 13) notes = 'Active solar convective mixing';
      if (hour === 18) notes = 'Evening commute rush';

      return {
        hour,
        timeLabel,
        pm25,
        aqi,
        inversionRisk,
        isSafeVentilationWindow,
        notes,
      };
    });
  }

  // Models the severe winter temperature inversion curve (Indo-Gangetic Plain):
  // Peaks between 05:00 and 08:30 (cold ground surface layer traps pollutants)
  // Low dip between 12:00 and 15:30 (solar heating breaks inversion cap and enables dispersion)
  // Re-inversion rises sharply from 18:00 to 23:00 (cooling ground + evening traffic + biomass burning)
  const multipliers = [
    1.15, 1.20, 1.25, 1.30, 1.35, // 00:00 - 04:00 (heavy overnight inversion)
    1.42, 1.48, 1.45, 1.35, 1.20, // 05:00 - 09:00 (peak inversion + morning rush)
    1.00, 0.85, 0.72, 0.65, 0.68, // 10:00 - 14:00 (solar heating break, ventilation window)
    0.75, 0.88, 1.05, 1.22, 1.30, // 15:00 - 19:00 (evening cooling + rush hour)
    1.32, 1.28, 1.22, 1.18        // 20:00 - 23:00 (night inversion trapping)
  ];

  return multipliers.map((mult, hour) => {
    const pm25 = Math.round(basePm25 * mult);
    const aqi = Math.min(500, Math.round(baseAqi * mult));
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    
    // Calibrated: Inversion hazard is determined by BOTH atmospheric trapping multiplier and absolute particulate mass
    const inversionRisk = calculateInversionRisk(pm25, aqi, mult);
    const isSafeVentilationWindow = hour >= ventStart && hour <= ventEnd;

    let notes = undefined;
    if (hour === 6) {
      notes = pm25 <= 35 ? 'Cool morning air with clear dispersion' : 'Peak overnight cold pool & inversion ceiling';
    } else if (hour === 13) {
      notes = 'Optimal daytime solar dispersion window';
    } else if (hour === 20) {
      notes = pm25 <= 35 ? 'Pleasant evening with stable airflow' : 'Evening thermal re-inversion begins';
    }

    return {
      hour,
      timeLabel,
      pm25,
      aqi,
      inversionRisk,
      isSafeVentilationWindow,
      notes,
    };
  });
}

export const CITY_PRESETS: CitySmogContext[] = [
  {
    id: 'delhi-ncr',
    name: 'New Delhi (Anand Vihar / Central)',
    state: 'Delhi',
    latitude: 28.61,
    longitude: 77.23,
    currentAQI: 355,
    aqiCategory: 'Severe',
    pm25: 245,
    pm10: 360,
    dominantPollutant: 'PM2.5',
    temperatureC: 22.0,
    humidityPercent: 56,
    windSpeedKmh: 3.6,
    windDirection: 'NW (Smoky Haze)',
    inversionStatus: 'Severe Ground Smog Trap',
    safeVentilationWindows: '12:00 PM – 03:30 PM',
    ventilationStartHour: 12,
    ventilationEndHour: 15,
    highRiskInversionHours: '05:00 AM – 09:30 AM & 08:00 PM – 02:00 AM',
    diurnalCurve: generateDiurnalCurve(245, 355, 12, 15, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'gurugram',
    name: 'Gurugram (Cyber City / Sec 51)',
    state: 'Haryana',
    latitude: 28.43,
    longitude: 77.07,
    currentAQI: 340,
    aqiCategory: 'Severe',
    pm25: 230,
    pm10: 345,
    dominantPollutant: 'PM2.5',
    temperatureC: 22.5,
    humidityPercent: 54,
    windSpeedKmh: 4.2,
    windDirection: 'WNW',
    inversionStatus: 'Severe Ground Smog Trap',
    safeVentilationWindows: '12:00 PM – 03:30 PM',
    ventilationStartHour: 12,
    ventilationEndHour: 15,
    highRiskInversionHours: '05:30 AM – 09:00 AM & 08:30 PM – 01:30 AM',
    diurnalCurve: generateDiurnalCurve(230, 340, 12, 15, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'noida',
    name: 'Noida (Sector 62 / Expressway)',
    state: 'Uttar Pradesh',
    latitude: 28.62,
    longitude: 77.36,
    currentAQI: 365,
    aqiCategory: 'Severe',
    pm25: 255,
    pm10: 375,
    dominantPollutant: 'PM2.5',
    temperatureC: 21.8,
    humidityPercent: 58,
    windSpeedKmh: 3.2,
    windDirection: 'NW',
    inversionStatus: 'Severe Ground Smog Trap',
    safeVentilationWindows: '12:00 PM – 03:00 PM',
    ventilationStartHour: 12,
    ventilationEndHour: 15,
    highRiskInversionHours: '05:00 AM – 09:30 AM & 08:00 PM – 02:30 AM',
    diurnalCurve: generateDiurnalCurve(255, 365, 12, 15, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'bengaluru',
    name: 'Bangalore (BTM / Silk Board)',
    state: 'Karnataka',
    latitude: 12.97,
    longitude: 77.59,
    currentAQI: 94,
    aqiCategory: 'Moderate',
    pm25: 42,
    pm10: 86,
    dominantPollutant: 'PM2.5',
    temperatureC: 24.0,
    humidityPercent: 49,
    windSpeedKmh: 11.2,
    windDirection: 'E (Fair Airflow)',
    inversionStatus: 'Clear Natural Airflow',
    safeVentilationWindows: '08:00 AM – 06:00 PM',
    ventilationStartHour: 8,
    ventilationEndHour: 18,
    highRiskInversionHours: '08:00 AM – 09:30 AM (Rush hour only)',
    diurnalCurve: generateDiurnalCurve(42, 94, 8, 18, true),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'mumbai',
    name: 'Mumbai (BKC / Chembur Coast)',
    state: 'Maharashtra',
    latitude: 19.07,
    longitude: 72.87,
    currentAQI: 180,
    aqiCategory: 'Poor',
    pm25: 98,
    pm10: 170,
    dominantPollutant: 'PM10',
    temperatureC: 27.0,
    humidityPercent: 50,
    windSpeedKmh: 10.5,
    windDirection: 'SW (Sea Breeze)',
    inversionStatus: 'Fresh Coastal Breeze',
    safeVentilationWindows: '10:00 AM – 05:00 PM',
    ventilationStartHour: 10,
    ventilationEndHour: 17,
    highRiskInversionHours: '07:30 AM – 09:00 AM (Traffic peak)',
    diurnalCurve: generateDiurnalCurve(98, 180, 10, 17, true),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'chennai',
    name: 'Chennai (Alandur / Marina)',
    state: 'Tamil Nadu',
    latitude: 13.08,
    longitude: 80.27,
    currentAQI: 71,
    aqiCategory: 'Moderate',
    pm25: 42,
    pm10: 50,
    dominantPollutant: 'PM2.5',
    temperatureC: 30.0,
    humidityPercent: 48,
    windSpeedKmh: 14.3,
    windDirection: 'NE (Fair Airflow)',
    inversionStatus: 'Fair Airflow',
    safeVentilationWindows: '09:00 AM – 05:00 PM',
    ventilationStartHour: 9,
    ventilationEndHour: 17,
    highRiskInversionHours: 'None (Clean Airflow)',
    diurnalCurve: generateDiurnalCurve(42, 71, 9, 17, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad (Charminar / Sanathnagar)',
    state: 'Telangana',
    latitude: 17.38,
    longitude: 78.48,
    currentAQI: 147,
    aqiCategory: 'Poor',
    pm25: 64,
    pm10: 118,
    dominantPollutant: 'PM2.5',
    temperatureC: 26.0,
    humidityPercent: 41,
    windSpeedKmh: 5.8,
    windDirection: 'E',
    inversionStatus: 'Moderate Thermal Layer',
    safeVentilationWindows: '10:00 AM – 05:00 PM',
    ventilationStartHour: 10,
    ventilationEndHour: 17,
    highRiskInversionHours: '07:00 AM – 09:00 AM & 09:00 PM – 11:00 PM',
    diurnalCurve: generateDiurnalCurve(64, 147, 10, 17, true),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'kolkata',
    name: 'Kolkata (Victoria / Jadavpur)',
    state: 'West Bengal',
    latitude: 22.57,
    longitude: 88.36,
    currentAQI: 115,
    aqiCategory: 'Poor',
    pm25: 52,
    pm10: 104,
    dominantPollutant: 'PM2.5',
    temperatureC: 24.0,
    humidityPercent: 93,
    windSpeedKmh: 4.8,
    windDirection: 'NNE (High Humidity)',
    inversionStatus: 'Humid Haze Layer',
    safeVentilationWindows: '11:00 AM – 04:00 PM',
    ventilationStartHour: 11,
    ventilationEndHour: 16,
    highRiskInversionHours: '06:30 AM – 08:30 AM & 09:30 PM – 12:30 AM',
    diurnalCurve: generateDiurnalCurve(52, 115, 11, 16, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad (Sabarmati / Maninagar)',
    state: 'Gujarat',
    latitude: 23.02,
    longitude: 72.57,
    currentAQI: 170,
    aqiCategory: 'Poor',
    pm25: 92,
    pm10: 154,
    dominantPollutant: 'PM2.5',
    temperatureC: 26.0,
    humidityPercent: 30,
    windSpeedKmh: 4.8,
    windDirection: 'NE',
    inversionStatus: 'Dry Aerosol Stagnation',
    safeVentilationWindows: '11:00 AM – 04:00 PM',
    ventilationStartHour: 11,
    ventilationEndHour: 16,
    highRiskInversionHours: '06:30 AM – 09:00 AM & 08:30 PM – 11:30 PM',
    diurnalCurve: generateDiurnalCurve(92, 170, 11, 16, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'pune',
    name: 'Pune (Shivajinagar / Kothrud)',
    state: 'Maharashtra',
    latitude: 18.52,
    longitude: 73.85,
    currentAQI: 135,
    aqiCategory: 'Poor',
    pm25: 58,
    pm10: 112,
    dominantPollutant: 'PM2.5',
    temperatureC: 23.0,
    humidityPercent: 36,
    windSpeedKmh: 5.2,
    windDirection: 'WNW',
    inversionStatus: 'Valley Air Trapping',
    safeVentilationWindows: '10:00 AM – 05:00 PM',
    ventilationStartHour: 10,
    ventilationEndHour: 17,
    highRiskInversionHours: '07:00 AM – 09:00 AM & 09:00 PM – 11:30 PM',
    diurnalCurve: generateDiurnalCurve(58, 135, 10, 17, true),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
  {
    id: 'lucknow',
    name: 'Lucknow (Gomti Nagar / Talkatora)',
    state: 'Uttar Pradesh',
    latitude: 26.85,
    longitude: 80.99,
    currentAQI: 326,
    aqiCategory: 'Severe',
    pm25: 215,
    pm10: 310,
    dominantPollutant: 'PM2.5',
    temperatureC: 16.2,
    humidityPercent: 81,
    windSpeedKmh: 4.0,
    windDirection: 'W',
    inversionStatus: 'Evening Smog Trap Building',
    safeVentilationWindows: '11:30 AM – 03:30 PM',
    ventilationStartHour: 11,
    ventilationEndHour: 15,
    highRiskInversionHours: '06:00 AM – 09:00 AM & 09:00 PM – 01:00 AM',
    diurnalCurve: generateDiurnalCurve(215, 326, 11, 15, false),
    dataSource: 'preset',
    lastUpdatedText: 'Preset Baseline',
  },
];
