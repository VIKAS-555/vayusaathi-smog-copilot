import { CitySmogContext, AQICategory } from '../types';
import { generateDiurnalCurve } from '../data/cityPresets';

// Convert wind direction degrees to 8-point compass notation
export function degreesToCompass(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg % 360) / 45)) % 8;
  return directions[index];
}

// Official Indian CPCB Sub-Index Breakpoint Calculation
function calculateCpcbSubIndex(
  val: number,
  breakpoints: [number, number, number, number][]
): number {
  for (const [clo, chi, ilo, ihi] of breakpoints) {
    if (val <= chi) {
      return Math.round(((ihi - ilo) / (chi - clo)) * (val - clo) + ilo);
    }
  }
  return 500;
}

// CPCB Breakpoints for PM2.5 and PM10
const PM25_BREAKPOINTS: [number, number, number, number][] = [
  [0, 30, 0, 50],
  [30.1, 60, 51, 100],
  [60.1, 90, 101, 200],
  [90.1, 120, 201, 300],
  [120.1, 250, 301, 400],
  [250.1, 500, 401, 500],
];

const PM10_BREAKPOINTS: [number, number, number, number][] = [
  [0, 50, 0, 50],
  [50.1, 100, 51, 100],
  [100.1, 250, 101, 200],
  [250.1, 350, 201, 300],
  [350.1, 430, 301, 400],
  [430.1, 600, 401, 500],
];

export function calculateCpcbAqi(pm25: number, pm10: number): {
  aqi: number;
  category: AQICategory;
  dominant: 'PM2.5' | 'PM10';
} {
  const subPm25 = calculateCpcbSubIndex(pm25, PM25_BREAKPOINTS);
  const subPm10 = calculateCpcbSubIndex(pm10, PM10_BREAKPOINTS);

  const aqi = Math.max(subPm25, subPm10);
  const dominant = subPm25 >= subPm10 ? 'PM2.5' : 'PM10';

  let category: AQICategory = 'Good';
  if (aqi > 400) category = 'Hazardous';
  else if (aqi > 300) category = 'Severe';
  else if (aqi > 200) category = 'Very Poor';
  else if (aqi > 100) category = 'Poor';
  else if (aqi > 50) category = aqi > 90 ? 'Moderate' : 'Good';
  else category = 'Good';

  return { aqi, category, dominant };
}

/**
 * Fetches live atmospheric telemetry for a given station preset.
 * Priority 1: Render-hosted Server-Side Live API (/api/live-aqi) with CPCB/AQI.in integration and caching.
 * Priority 2: Client-side Direct Open Telemetry Fallback (for static GitHub Pages hosting).
 * Priority 3: Calibrated Station Preset Baseline (for offline/emergency mode).
 */
export async function fetchLiveCityData(
  preset: CitySmogContext
): Promise<CitySmogContext> {
  const lat = preset.latitude;
  const lon = preset.longitude;

  if (!lat || !lon) {
    return { ...preset, dataSource: 'preset', lastUpdatedText: 'Preset Baseline' };
  }

  const isCoastal = preset.id === 'mumbai';
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // 1. Try Render server-side API endpoint (/api/live-aqi) first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiRes = await fetch('/api/live-aqi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: preset.id, lat, lon }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const liveJson = await apiRes.json();
      if (liveJson.success) {
        const livePm25 = Math.round(Number(liveJson.pm25 ?? preset.pm25));
        const livePm10 = Math.round(Number(liveJson.pm10 ?? preset.pm10));
        const liveAqi = Math.round(Number(liveJson.aqi ?? preset.currentAQI));
        const category = (liveJson.category as AQICategory) || preset.aqiCategory;
        const dominant = (liveJson.dominantPollutant as 'PM2.5' | 'PM10' | 'NO2') || preset.dominantPollutant;

        const isLowSmog = preset.id === 'mumbai' || preset.id === 'bengaluru' || liveAqi <= 120 || livePm25 <= 45;

        const liveDiurnalCurve = generateDiurnalCurve(
          livePm25,
          liveAqi,
          preset.ventilationStartHour,
          preset.ventilationEndHour,
          isLowSmog
        );

        return {
          ...preset,
          currentAQI: liveAqi,
          aqiCategory: category,
          pm25: livePm25,
          pm10: livePm10,
          dominantPollutant: dominant,
          temperatureC: Number(liveJson.temperatureC ?? preset.temperatureC),
          humidityPercent: Number(liveJson.humidityPercent ?? preset.humidityPercent),
          windSpeedKmh: Number(liveJson.windSpeedKmh ?? preset.windSpeedKmh),
          windDirection: liveJson.windDirection || preset.windDirection,
          inversionStatus: liveJson.inversionStatus || preset.inversionStatus,
          diurnalCurve: liveDiurnalCurve,
          dataSource: 'live',
          lastUpdatedText: `${timeStr}`,
        };
      }
    }
  } catch (renderApiErr) {
    // If running in static export mode or backend unreachable, fall through to client gateway
    console.debug('[Live Telemetry] Render live API bypassed or offline, falling back to direct client stream:', renderApiErr);
  }

  // 2. Client-side direct telemetry gateway fallback (Open-Meteo / CPCB coordinates)
  const fallbackController = new AbortController();
  const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 4500);

  try {
    const [airQualityRes, weatherRes] = await Promise.all([
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,us_aqi,european_aqi`,
        { signal: fallbackController.signal }
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`,
        { signal: fallbackController.signal }
      ),
    ]);

    clearTimeout(fallbackTimeoutId);

    if (!airQualityRes.ok || !weatherRes.ok) {
      throw new Error(`Direct telemetry gateway returned status: ${airQualityRes.status} / ${weatherRes.status}`);
    }

    const [aqData, weatherData] = await Promise.all([
      airQualityRes.json(),
      weatherRes.json(),
    ]);

    const livePm25 = Math.round(Number(aqData?.current?.pm2_5 ?? preset.pm25));
    const livePm10 = Math.round(Number(aqData?.current?.pm10 ?? preset.pm10));

    const { aqi: calculatedAqi, category, dominant } = calculateCpcbAqi(livePm25, livePm10);

    const liveTemp = Number(weatherData?.current?.temperature_2m ?? preset.temperatureC);
    const liveHumidity = Math.round(Number(weatherData?.current?.relative_humidity_2m ?? preset.humidityPercent));
    const liveWindSpeed = Math.round(Number(weatherData?.current?.wind_speed_10m ?? preset.windSpeedKmh) * 10) / 10;
    const windDeg = Number(weatherData?.current?.wind_direction_10m ?? 0);
    const liveWindDir = degreesToCompass(windDeg);

    const isLowSmog = preset.id === 'mumbai' || preset.id === 'bengaluru' || calculatedAqi <= 120 || livePm25 <= 45;

    // Inversion status dynamic classification
    let liveInversionStatus = preset.inversionStatus;
    if (calculatedAqi >= 380 && liveWindSpeed < 5) {
      liveInversionStatus = 'Severe Ground Smog Trap';
    } else if (calculatedAqi >= 250) {
      liveInversionStatus = 'Evening Smog Trap Building';
    } else if (calculatedAqi > 100) {
      liveInversionStatus = isCoastal ? 'Fresh Coastal Breeze' : 'Smog Trap Clearing';
    } else {
      liveInversionStatus = 'Clear Natural Airflow';
    }

    // Recompute 24h diurnal curve with live baseline
    const liveDiurnalCurve = generateDiurnalCurve(
      livePm25,
      calculatedAqi,
      preset.ventilationStartHour,
      preset.ventilationEndHour,
      isLowSmog
    );

    return {
      ...preset,
      currentAQI: calculatedAqi,
      aqiCategory: category,
      pm25: livePm25,
      pm10: livePm10,
      dominantPollutant: dominant,
      temperatureC: liveTemp,
      humidityPercent: liveHumidity,
      windSpeedKmh: liveWindSpeed,
      windDirection: liveWindDir,
      inversionStatus: liveInversionStatus,
      diurnalCurve: liveDiurnalCurve,
      dataSource: 'live',
      lastUpdatedText: `${timeStr}`,
    };
  } catch (err) {
    console.warn(`[Live Air Feed] Could not reach live station API for ${preset.name}, falling back to preset baseline:`, err);
    return {
      ...preset,
      dataSource: 'preset',
      lastUpdatedText: 'Preset Baseline (Offline)',
    };
  }
}
