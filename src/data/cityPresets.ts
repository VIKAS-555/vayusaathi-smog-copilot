import { CitySmogContext, DiurnalHourPoint } from '../types';

function generateDiurnalCurve(basePm25: number, baseAqi: number): DiurnalHourPoint[] {
  // Models the classic winter temperature inversion curve:
  // Peaks between 05:00 and 08:30 (cold ground surface layer traps pollutants)
  // Low dip between 12:30 and 15:30 (solar heating breaks inversion cap and enables dispersion)
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
    
    let inversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';
    if (mult >= 1.35) inversionRisk = 'Severe';
    else if (mult >= 1.15) inversionRisk = 'High';
    else if (mult <= 0.75) inversionRisk = 'Low';

    const isSafeVentilationWindow = hour >= 12 && hour <= 15;

    let notes = undefined;
    if (hour === 6) notes = 'Peak overnight cold pool & inversion ceiling';
    if (hour === 13) notes = 'Best daytime dispersion window';
    if (hour === 20) notes = 'Evening thermal re-inversion begins';

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
    name: 'Delhi NCR (Anand Vihar / Central)',
    state: 'Delhi',
    currentAQI: 438,
    aqiCategory: 'Hazardous',
    pm25: 320,
    pm10: 480,
    dominantPollutant: 'PM2.5',
    temperatureC: 14.5,
    humidityPercent: 78,
    windSpeedKmh: 3.8,
    windDirection: 'NW (Calm / Inverted)',
    inversionStatus: 'Active Ground Inversion',
    safeVentilationWindows: '12:30 PM – 03:15 PM',
    highRiskInversionHours: '05:00 AM – 09:30 AM & 08:00 PM – 02:00 AM',
    diurnalCurve: generateDiurnalCurve(320, 438),
  },
  {
    id: 'gurugram',
    name: 'Gurugram (Cyber City / Sec 51)',
    state: 'Haryana',
    currentAQI: 382,
    aqiCategory: 'Severe',
    pm25: 275,
    pm10: 395,
    dominantPollutant: 'PM2.5',
    temperatureC: 15.0,
    humidityPercent: 72,
    windSpeedKmh: 4.5,
    windDirection: 'WNW',
    inversionStatus: 'Active Ground Inversion',
    safeVentilationWindows: '12:00 PM – 03:30 PM',
    highRiskInversionHours: '05:30 AM – 09:00 AM & 08:30 PM – 01:30 AM',
    diurnalCurve: generateDiurnalCurve(275, 382),
  },
  {
    id: 'noida',
    name: 'Noida (Sector 62 / Expressway)',
    state: 'Uttar Pradesh',
    currentAQI: 412,
    aqiCategory: 'Severe',
    pm25: 298,
    pm10: 430,
    dominantPollutant: 'PM2.5',
    temperatureC: 14.8,
    humidityPercent: 76,
    windSpeedKmh: 3.2,
    windDirection: 'NW',
    inversionStatus: 'Active Ground Inversion',
    safeVentilationWindows: '12:30 PM – 03:00 PM',
    highRiskInversionHours: '05:00 AM – 09:30 AM & 08:00 PM – 02:30 AM',
    diurnalCurve: generateDiurnalCurve(298, 412),
  },
  {
    id: 'lucknow',
    name: 'Lucknow (Gomti Nagar / Talkatora)',
    state: 'Uttar Pradesh',
    currentAQI: 326,
    aqiCategory: 'Very Poor',
    pm25: 215,
    pm10: 310,
    dominantPollutant: 'PM2.5',
    temperatureC: 16.2,
    humidityPercent: 81,
    windSpeedKmh: 4.0,
    windDirection: 'W',
    inversionStatus: 'Developing Evening Trapping',
    safeVentilationWindows: '11:45 AM – 03:30 PM',
    highRiskInversionHours: '06:00 AM – 09:00 AM & 09:00 PM – 01:00 AM',
    diurnalCurve: generateDiurnalCurve(215, 326),
  },
  {
    id: 'kolkata',
    name: 'Kolkata (Jadavpur / Victoria)',
    state: 'West Bengal',
    currentAQI: 265,
    aqiCategory: 'Poor',
    pm25: 162,
    pm10: 240,
    dominantPollutant: 'PM2.5',
    temperatureC: 21.0,
    humidityPercent: 84,
    windSpeedKmh: 6.2,
    windDirection: 'NNE',
    inversionStatus: 'Weakening',
    safeVentilationWindows: '11:00 AM – 04:00 PM',
    highRiskInversionHours: '06:30 AM – 08:30 AM & 09:30 PM – 12:30 AM',
    diurnalCurve: generateDiurnalCurve(162, 265),
  },
  {
    id: 'mumbai',
    name: 'Mumbai (BKC / Chembur Coast)',
    state: 'Maharashtra',
    currentAQI: 178,
    aqiCategory: 'Moderate',
    pm25: 88,
    pm10: 165,
    dominantPollutant: 'PM10',
    temperatureC: 26.5,
    humidityPercent: 68,
    windSpeedKmh: 11.4,
    windDirection: 'SW (Sea Breeze)',
    inversionStatus: 'Dispersion Window',
    safeVentilationWindows: '10:00 AM – 05:00 PM',
    highRiskInversionHours: '07:00 AM – 08:30 AM (Rush hour haze)',
    diurnalCurve: generateDiurnalCurve(88, 178),
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru (BTM / Silk Board)',
    state: 'Karnataka',
    currentAQI: 94,
    aqiCategory: 'Good',
    pm25: 42,
    pm10: 86,
    dominantPollutant: 'PM2.5',
    temperatureC: 23.0,
    humidityPercent: 62,
    windSpeedKmh: 13.0,
    windDirection: 'E',
    inversionStatus: 'Dispersion Window',
    safeVentilationWindows: '08:00 AM – 06:00 PM (Clear Airflow)',
    highRiskInversionHours: '08:00 AM – 09:30 AM (Localized traffic peak)',
    diurnalCurve: generateDiurnalCurve(42, 94),
  },
];
