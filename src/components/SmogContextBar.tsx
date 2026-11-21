import React, { useState, useEffect } from 'react';
import { CitySmogContext } from '../types';
import { CITY_PRESETS, getHourlyGuidance } from '../data/cityPresets';
import { CityLandmarkIllustration } from './CityLandmarkIllustration';
import { getAQIStyle, getAQITier, AQI_TIERS, AQITier } from '../lib/aqiScale';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  ShieldAlert, 
  Sliders, 
  Sun, 
  CloudFog, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Activity, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Lock,
  RefreshCw,
  Radio
} from 'lucide-react';

interface SmogContextBarProps {
  currentCity: CitySmogContext;
  onSelectCity: (city: CitySmogContext) => void;
  onCustomUpdate?: (updated: Partial<CitySmogContext>) => void;
  onRefreshLive?: () => void;
  isFetchingLive?: boolean;
  isDarkMode?: boolean;
}

// Calibrated 6-tier graded bar appearance adhering strictly to CPCB & international AQI scales
function getBarAppearance(
  point: { hour: number; pm25: number; aqi: number; inversionRisk: string; isSafeVentilationWindow: boolean },
  isActive: boolean,
  isDark: boolean
) {
  const tierStyle = getAQIStyle(point.aqi, isDark);
  return {
    bg: isActive ? tierStyle.activeAccent : tierStyle.accent,
    border: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    tier: tierStyle.tierKey,
  };
}

function getTrackAppearance(
  isSafe: boolean,
  isDark: boolean,
  isStart: boolean,
  isEnd: boolean
) {
  if (isSafe) {
    return {
      backgroundColor: isDark ? 'rgba(35, 107, 86, 0.35)' : 'rgba(220, 240, 232, 0.85)',
      borderTop: isDark ? '2px solid #3DA887' : '2px solid #236B56',
      borderLeft: isStart ? (isDark ? '2px solid #3DA887' : '2px solid #236B56') : undefined,
      borderRight: isEnd ? (isDark ? '2px solid #3DA887' : '2px solid #236B56') : undefined,
    };
  }
  return {
    backgroundColor: isDark ? '#1C2521' : '#E8E6DE',
    borderTop: isDark ? '1px solid #2D3A34' : '1px solid #D5D2C7',
    borderLeft: isDark ? '1px solid #242E29' : '1px solid #DFDCD3',
    borderRight: isDark ? '1px solid #242E29' : '1px solid #DFDCD3',
  };
}

export type AtmosphereState = 'clean' | 'moderate' | 'haze' | 'unhealthy' | 'smog' | 'hazardous' | 'humid';

export function getAtmosphereState(city: CitySmogContext): AtmosphereState {
  if (city.humidityPercent >= 80 && city.currentAQI <= 200) {
    return 'humid';
  }
  const tier = getAQITier(city.currentAQI, city.aqiCategory);
  if (tier === 'hazardous') return 'hazardous';
  if (tier === 'severe') return 'smog';
  if (tier === 'unhealthy') return 'unhealthy';
  if (tier === 'poor') return 'haze';
  if (tier === 'moderate') return 'moderate';
  return 'clean';
}

function getAtmosphereBannerStyle(city: CitySmogContext, isDark: boolean) {
  const state = getAtmosphereState(city);
  const aqiStyle = getAQIStyle(city.currentAQI, isDark, city.aqiCategory);

  if (state === 'humid') {
    return {
      background: isDark
        ? 'linear-gradient(135deg, rgba(22, 28, 36, 0.95) 0%, rgba(20, 24, 28, 0.92) 55%, rgba(18, 25, 32, 0.88) 100%)'
        : 'linear-gradient(135deg, rgba(238, 242, 246, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(230, 236, 242, 0.85) 100%)',
      borderColor: isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.3)',
      skylineColor: isDark ? '#94A3B8' : '#475569',
      badgeBg: isDark ? 'rgba(71, 85, 105, 0.3)' : '#F1F5F9',
      badgeBorder: isDark ? 'rgba(148, 163, 184, 0.4)' : '#CBD5E1',
      badgeColor: isDark ? '#CBD5E1' : '#334155',
      badgeLabel: 'Moist Maritime Mist · High Relative Humidity',
      tagline: 'High moisture promotes secondary chemical aerosol & fog condensation',
      icon: <Droplets className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 shrink-0" />,
    };
  }

  // Graded atmospheric banner corresponding to the 6 AQI tiers
  switch (state) {
    case 'clean':
      return {
        background: aqiStyle.bannerBg,
        borderColor: aqiStyle.border,
        skylineColor: aqiStyle.skyline,
        badgeBg: aqiStyle.bg,
        badgeBorder: aqiStyle.border,
        badgeColor: aqiStyle.text,
        badgeLabel: 'Good Air · Healthy Convective Mixing',
        tagline: 'Fresh ambient airflow across regional topography · Minimal trapping',
        icon: <Sun className="h-3.5 w-3.5 shrink-0" style={{ color: aqiStyle.text }} />,
      };
    case 'moderate':
      return {
        background: aqiStyle.bannerBg,
        borderColor: aqiStyle.border,
        skylineColor: aqiStyle.skyline,
        badgeBg: aqiStyle.bg,
        badgeBorder: aqiStyle.border,
        badgeColor: aqiStyle.text,
        badgeLabel: 'Moderate Air · Acceptable Dispersion',
        tagline: 'Daytime surface heating supporting regular atmospheric air renewal',
        icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: aqiStyle.text }} />,
      };
    case 'haze':
      return {
        background: aqiStyle.bannerBg,
        borderColor: aqiStyle.border,
        skylineColor: aqiStyle.skyline,
        badgeBg: aqiStyle.bg,
        badgeBorder: aqiStyle.border,
        badgeColor: aqiStyle.text,
        badgeLabel: 'Photochemical Haze · Ambient Particulate Accumulation',
        tagline: 'Moderate sunlight-driven aerosol stagnation · Boundary layer declining',
        icon: <CloudFog className="h-3.5 w-3.5 shrink-0" style={{ color: aqiStyle.text }} />,
      };
    case 'unhealthy':
      return {
        background: aqiStyle.bannerBg,
        borderColor: aqiStyle.border,
        skylineColor: aqiStyle.skyline,
        badgeBg: aqiStyle.bg,
        badgeBorder: aqiStyle.border,
        badgeColor: aqiStyle.text,
        badgeLabel: 'Unhealthy Stagnation · Boundary Layer Declining',
        tagline: 'Cool ground layer trapping vehicular and combustion particulates',
        icon: <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: aqiStyle.text }} />,
      };
    case 'smog':
      return {
        background: aqiStyle.bannerBg,
        borderColor: aqiStyle.border,
        skylineColor: aqiStyle.skyline,
        badgeBg: aqiStyle.bg,
        badgeBorder: aqiStyle.border,
        badgeColor: aqiStyle.text,
        badgeLabel: 'Severe Thermal Inversion · Dense Ground Particulate Trap',
        tagline: 'Dense particulate blanket trapped close to ground · Cold surface boundary',
        icon: <Flame className="h-3.5 w-3.5 shrink-0" style={{ color: aqiStyle.text }} />,
      };
    case 'hazardous':
    default:
      return {
        background: aqiStyle.bannerBg,
        borderColor: aqiStyle.border,
        skylineColor: aqiStyle.skyline,
        badgeBg: aqiStyle.bg,
        badgeBorder: aqiStyle.border,
        badgeColor: aqiStyle.text,
        badgeLabel: 'Hazardous Smog Emergency · Surface Thermal Blanket',
        tagline: 'Critical particulate trapping across regional airshed · Emergency episode',
        icon: <ShieldAlert className="h-3.5 w-3.5 shrink-0" style={{ color: aqiStyle.text }} />,
      };
  }
}

export function getCityLandmarkName(cityId: string): string {
  const id = (cityId || '').toLowerCase();
  if (id.includes('delhi')) return 'India Gate';
  if (id.includes('bengaluru') || id.includes('bangalore')) return 'Vidhana Soudha';
  if (id.includes('mumbai') || id.includes('bombay')) return 'Gateway of India';
  if (id.includes('kolkata') || id.includes('calcutta')) return 'Victoria Memorial';
  if (id.includes('lucknow')) return 'Rumi Darwaza';
  if (id.includes('gurugram') || id.includes('gurgaon')) return 'Cyber City Horizon';
  if (id.includes('noida')) return 'Express Towers & Stupa';
  return 'Regional Metro Horizon';
}

export const SmogContextBar: React.FC<SmogContextBarProps> = ({
  currentCity,
  onSelectCity,
  onCustomUpdate,
  onRefreshLive,
  isFetchingLive = false,
  isDarkMode = false,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(() => {
    const midVent = Math.round((currentCity.ventilationStartHour + currentCity.ventilationEndHour) / 2);
    return Number.isFinite(midVent) ? midVent : 13;
  });
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);

  // Sync selectedHour when switching cities so it targets the new city's safe window
  useEffect(() => {
    const midVent = Math.round((currentCity.ventilationStartHour + currentCity.ventilationEndHour) / 2);
    setSelectedHour(Number.isFinite(midVent) ? midVent : 13);
  }, [currentCity.id, currentCity.ventilationStartHour, currentCity.ventilationEndHour]);

  // Dynamic PM2.5 peak scaling: uses a proportional ceiling so clean cities (e.g. Bengaluru, PM2.5 42)
  // render legible, dynamic bar trajectories rather than collapsing into flat slivers.
  const peakPm25InCurve = Math.max(...currentCity.diurnalCurve.map(p => p.pm25), 10);
  const maxPm25 = Math.max(peakPm25InCurve * 1.15, 60);

  const activeHour = hoveredHour !== null ? hoveredHour : selectedHour;
  const activePoint = currentCity.diurnalCurve.find(p => p.hour === activeHour) 
    || currentCity.diurnalCurve[0]
    || {
      hour: 12,
      timeLabel: '12:00',
      pm25: currentCity.pm25,
      aqi: currentCity.currentAQI,
      inversionRisk: 'Low' as const,
      isSafeVentilationWindow: true,
    };

  const activeGuidance = getHourlyGuidance(activePoint);
  const cityAqiStyle = getAQIStyle(currentCity.currentAQI, isDarkMode, currentCity.aqiCategory);
  const CityStatusIcon = 
    cityAqiStyle.tierKey === 'good' || cityAqiStyle.tierKey === 'moderate'
      ? CheckCircle2
      : cityAqiStyle.tierKey === 'poor' || cityAqiStyle.tierKey === 'unhealthy'
      ? AlertTriangle
      : ShieldAlert;

  const bannerStyle = getAtmosphereBannerStyle(currentCity, isDarkMode);

  return (
    <div className="rounded-lg border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 sm:p-5 shadow-xs">
      {/* Atmospheric Station & Weather Horizon Banner */}
      <div 
        className="relative overflow-hidden rounded-xl border p-4 sm:p-5 transition-all duration-700 ease-in-out shadow-xs mb-4"
        style={{
          background: bannerStyle.background,
          borderColor: bannerStyle.borderColor,
        }}
      >
        {/* Subtle Architectural Skyline Silhouette at Horizon */}
        <div 
          className="absolute inset-x-0 bottom-0 pointer-events-none select-none overflow-hidden h-20 sm:h-24"
          aria-hidden="true"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
            color: bannerStyle.skylineColor,
          }}
        >
          <svg 
            viewBox="0 0 1200 100" 
            fill="currentColor" 
            className="w-full h-full opacity-80" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Distant background skyline (subtle depth) */}
            <path 
              opacity="0.3"
              d="M0 100 L0 55 L35 55 L35 42 L65 42 L65 55 L110 55 L110 32 L130 32 L130 20 L135 20 L135 32 L160 32 L160 55 L210 55 L210 40 L235 40 L235 55 L290 55 L290 28 L320 28 L320 55 L370 55 L370 48 L440 48 L440 55 L510 55 L510 36 L545 36 L545 55 L610 55 L610 44 L660 44 L660 55 L720 55 L720 25 L755 25 L755 55 L820 55 L820 38 L865 38 L865 55 L930 55 L930 18 L945 18 L945 8 L950 8 L950 18 L980 18 L980 55 L1040 55 L1040 34 L1080 34 L1080 55 L1130 55 L1130 45 L1200 45 L1200 100 Z" 
            />
            {/* Foreground architectural civic skyline (monuments, metro viaduct, contemporary buildings) */}
            <path 
              opacity="0.85"
              d="M0 100 L0 68 L25 68 L25 50 L55 50 L55 68 L80 68 L80 38 L92 38 L92 24 L96 24 L96 38 L120 38 L120 68 L145 68 C155 62 170 62 180 68 L195 68 L195 44 L225 44 L225 30 L245 30 L245 44 L265 44 L265 68 L290 68 C295 64 305 64 310 68 L330 68 L345 68 L345 35 L355 35 L355 30 L395 30 L395 35 L405 35 L405 68 L390 68 L390 48 C390 42 360 42 360 48 L360 68 L345 68 L420 68 C430 60 445 60 455 68 L470 68 L470 42 L500 42 L500 68 L520 68 L520 56 L530 56 L530 68 L540 68 L540 52 L680 52 L680 68 L670 68 L670 56 L660 56 L660 68 L610 68 L610 56 L600 56 L600 68 L550 68 L550 56 L540 56 L540 68 L695 68 L695 28 L725 28 L725 68 L740 68 C750 62 765 62 775 68 L790 68 L790 48 C790 35 830 35 830 48 L830 68 L845 68 L845 36 L875 36 L875 68 L890 68 L890 22 L895 22 L895 6 L897 6 L897 22 L915 22 L915 68 L935 68 C945 60 960 60 970 68 L985 68 L985 40 L1015 40 L1015 26 L1035 26 L1035 40 L1055 40 L1055 68 L1075 68 C1085 63 1095 63 1105 68 L1120 68 L1120 48 L1160 48 L1160 68 L1200 68 L1200 100 Z" 
            />
          </svg>
        </div>

        {/* Selected City's Distinct Architectural Landmark Line Art (Watermark Backdrop) */}
        <div 
          className="absolute right-1 sm:right-6 bottom-0 sm:bottom-0 pointer-events-none select-none overflow-hidden h-24 sm:h-32 w-32 sm:w-44 z-0 transition-all duration-700 opacity-20 sm:opacity-25"
          aria-hidden="true"
          style={{
            color: bannerStyle.skylineColor,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.3) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.3) 100%)',
          }}
        >
          <CityLandmarkIllustration 
            cityId={currentCity.id} 
            strokeColor={bannerStyle.skylineColor}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content Layer with z-10 */}
        <div className="relative z-10 flex flex-col gap-3">
          {/* Station Selection Chips Strip */}
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400 shrink-0">
              Station:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              {CITY_PRESETS.map((preset) => {
                const isActive = preset.id === currentCity.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectCity(preset)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0 min-h-[32px] flex items-center ${
                      isActive
                        ? 'bg-ink text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                        : 'bg-white/80 dark:bg-stone-800/90 text-ink-muted dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 hover:text-ink border border-stone-200/80 dark:border-stone-700/80'
                    }`}
                  >
                    {preset.name.split(' (')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Station Identity & Weather Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1 border-t border-stone-300/40 dark:border-stone-700/40">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold tracking-tight text-ink dark:text-stone-100 flex items-center gap-1.5">
                  <span>{currentCity.name}</span>
                </h2>
                <span className="font-mono text-[11px] text-ink-muted dark:text-stone-400">
                  {currentCity.latitude.toFixed(2)}°N, {currentCity.longitude.toFixed(2)}°E
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink-muted dark:text-stone-400 whitespace-nowrap">
                  <span>{getCityLandmarkName(currentCity.id)}</span>
                </span>
                <span className="text-stone-300 dark:text-stone-600 hidden sm:inline">·</span>
                <span className="font-mono text-[11px] text-ink dark:text-stone-300 font-semibold hidden sm:inline">
                  {currentCity.temperatureC}°C · {currentCity.humidityPercent}% RH · {currentCity.windSpeedKmh} km/h {currentCity.windDirection}
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-stone-400 font-medium mt-0.5">
                {bannerStyle.tagline}
              </p>
            </div>

            {/* Weather / AQI Condition Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span 
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border shadow-2xs whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: bannerStyle.badgeBg,
                  borderColor: bannerStyle.badgeBorder,
                  color: bannerStyle.badgeColor,
                }}
              >
                {bannerStyle.icon}
                <span>{bannerStyle.badgeLabel}</span>
              </span>
            </div>
          </div>

          {/* Data Source Provenance & Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 w-full pt-1 border-t border-stone-300/40 dark:border-stone-700/40">
            {/* Status Badge */}
            {currentCity.dataSource === 'live' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-300 dark:border-sage-800 bg-white/90 dark:bg-stone-900/90 px-2.5 py-1 text-[11px] font-medium text-sage-800 dark:text-sage-200 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-600 animate-pulse shrink-0" />
                <span>Live Station Feed</span>
                <span className="font-mono text-ink-muted dark:text-stone-400 font-normal">· {currentCity.lastUpdatedText || 'Live'}</span>
              </span>
            ) : currentCity.dataSource === 'manual' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 dark:border-amber-800 bg-white/90 dark:bg-stone-900/90 px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:text-amber-200 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" />
                <span>Manual Overrides Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white/90 dark:bg-stone-900/90 px-2.5 py-1 text-[11px] font-medium text-ink-muted dark:text-stone-300 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 shrink-0" />
                <span>Station Baseline Snapshot</span>
              </span>
            )}

            <div className="flex items-center gap-1.5">
              {/* Live Sync Button */}
              {onRefreshLive && (
                <button
                  onClick={onRefreshLive}
                  disabled={isFetchingLive}
                  className="flex items-center gap-1 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 disabled:opacity-50 transition-colors shadow-2xs min-h-[30px]"
                  title="Poll live WMO / CPCB satellite & station telemetry"
                >
                  <RefreshCw className={`h-3 w-3 text-ink-muted dark:text-stone-400 ${isFetchingLive ? 'animate-spin text-ink' : ''}`} />
                  <span>{isFetchingLive ? 'Syncing…' : 'Sync Live'}</span>
                </button>
              )}

              <button
                onClick={() => setShowCustomInputs(!showCustomInputs)}
                className="flex items-center gap-1 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-ink-muted dark:text-stone-300 hover:text-ink hover:bg-stone-100 transition-colors min-h-[30px]"
              >
                <Sliders className="h-3 w-3" />
                <span>{showCustomInputs ? 'Hide Overrides' : 'Overrides'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Input Slider Panel (When Toggled) */}
      {showCustomInputs && (
        <div className="mt-3.5 rounded border border-stone-200 bg-stone-50 p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-ink-muted mb-1">
              Custom AQI: <span className="font-mono font-bold text-ink">{currentCity.currentAQI}</span>
            </label>
            <input
              type="range"
              min="30"
              max="500"
              value={currentCity.currentAQI}
              onChange={(e) => onCustomUpdate?.({ currentAQI: Number(e.target.value) })}
              className="editorial-slider w-full mt-1.5"
              style={{ '--slider-pct': `${Math.min(100, Math.max(0, ((currentCity.currentAQI - 30) / (500 - 30)) * 100))}%` } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block font-medium text-ink-muted mb-1">
              PM2.5 (µg/m³): <span className="font-mono font-bold text-ink">{currentCity.pm25}</span>
            </label>
            <input
              type="range"
              min="15"
              max="450"
              value={currentCity.pm25}
              onChange={(e) => onCustomUpdate?.({ pm25: Number(e.target.value) })}
              className="editorial-slider w-full mt-1.5"
              style={{ '--slider-pct': `${Math.min(100, Math.max(0, ((currentCity.pm25 - 15) / (450 - 15)) * 100))}%` } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block font-medium text-ink-muted mb-1">
              Wind Speed (km/h): <span className="font-mono font-bold text-ink">{currentCity.windSpeedKmh}</span>
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={currentCity.windSpeedKmh}
              onChange={(e) => onCustomUpdate?.({ windSpeedKmh: Number(e.target.value) })}
              className="editorial-slider w-full mt-1.5"
              style={{ '--slider-pct': `${Math.min(100, Math.max(0, ((currentCity.windSpeedKmh - 1) / (25 - 1)) * 100))}%` } as React.CSSProperties}
            />
          </div>
        </div>
      )}

      {/* Primary Meteorological Grid: Responsive Spacious Grid (2 cols on compact desktop lg, 3 cols on xl) */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {/* Card 1: CPCB AQI */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
              Index (CPCB AQI)
            </span>
            <span
              className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 whitespace-nowrap shadow-2xs transition-colors"
              style={{
                backgroundColor: cityAqiStyle.bg,
                borderColor: cityAqiStyle.border,
                color: cityAqiStyle.text,
              }}
            >
              <CityStatusIcon className="h-3 w-3 shrink-0" />
              <span>{currentCity.aqiCategory}</span>
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span 
              className="font-mono text-3xl font-extrabold tabular-nums"
              style={{ color: cityAqiStyle.text }}
            >
              {currentCity.currentAQI}
            </span>
            <span className="text-xs text-ink-muted dark:text-stone-400">
              {cityAqiStyle.summary.split(' · ')[0]}
            </span>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-700/80 pt-1.5 flex items-center justify-between">
            <span>Dominant: <strong className="text-ink dark:text-stone-200 font-semibold">{currentCity.dominantPollutant}</strong></span>
            <span className="font-mono text-[10px] text-ink-muted dark:text-stone-400">
              {currentCity.dataSource === 'live' ? 'Live Telemetry' : currentCity.dataSource === 'manual' ? 'Manual Value' : 'Station Preset'}
            </span>
          </span>
        </div>

        {/* Card 2: PM2.5 Fine Ambient Particles with Graded Multi-Tier Badge */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
              PM2.5 Ambient
            </span>
            <span
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap border shadow-2xs transition-colors"
              style={{
                backgroundColor: cityAqiStyle.bg,
                borderColor: cityAqiStyle.border,
                color: cityAqiStyle.text,
              }}
            >
              {currentCity.pm25 > 250 ? (
                <>
                  <Flame className="h-3 w-3 shrink-0" />
                  <span>Extreme Fine Load</span>
                </>
              ) : currentCity.pm25 > 120 ? (
                <>
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Heavy Fine Load</span>
                </>
              ) : currentCity.pm25 > 60 ? (
                <>
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Elevated Exposure</span>
                </>
              ) : currentCity.pm25 > 30 ? (
                <>
                  <Activity className="h-3 w-3 shrink-0" />
                  <span>Moderate Exposure</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  <span>Baseline Safe</span>
                </>
              )}
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span
              className="font-mono text-3xl font-extrabold tabular-nums"
              style={{ color: cityAqiStyle.text }}
            >
              {currentCity.pm25}
            </span>
            <span className="text-xs font-mono font-medium text-ink-muted dark:text-stone-400">µg/m³</span>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-700/80 pt-1.5">
            {currentCity.pm25 <= 15
              ? 'Within WHO annual guideline (5 µg/m³)'
              : `${(currentCity.pm25 / 15).toFixed(1)}x above WHO 24h limit (15 µg/m³)`}
          </span>
        </div>

        {/* Card 3: PM10 Coarse Particulates */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
              PM10 Coarse Dust
            </span>
            <span className="text-[10px] font-mono text-ink-muted dark:text-stone-400 whitespace-nowrap">Aerodynamic &lt; 10µm</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-ink dark:text-stone-100 tabular-nums">
              {currentCity.pm10}
            </span>
            <span className="text-xs font-mono font-medium text-ink-muted dark:text-stone-400">µg/m³</span>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-700/80 pt-1.5">
            Inhalable road dust, crustal soil & soot
          </span>
        </div>

        {/* Card 4: Weather State & Moisture */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
            Weather & Moisture
          </span>
          <div className="my-2 flex flex-wrap items-center gap-2.5 font-mono">
            <span className="flex items-center gap-1.5 text-base font-bold text-ink dark:text-stone-100 whitespace-nowrap">
              <Thermometer className="h-4 w-4 text-ink-muted dark:text-stone-400 shrink-0" />
              <span>{currentCity.temperatureC}°C</span>
            </span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span className="flex items-center gap-1.5 text-base font-bold text-ink dark:text-stone-100 whitespace-nowrap">
              <Droplets className="h-4 w-4 text-ink-muted dark:text-stone-400 shrink-0" />
              <span>{currentCity.humidityPercent}% RH</span>
            </span>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-700/80 pt-1.5">
            {currentCity.humidityPercent >= 75
              ? 'High moisture promotes secondary chemical smog'
              : 'Moderate humidity · Low mist condensation'}
          </span>
        </div>

        {/* Card 5: Dispersion Wind */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
            Dispersion Surface Wind
          </span>
          <div className="my-2 flex items-center gap-2 font-mono">
            <Wind className="h-4 w-4 text-ink-muted dark:text-stone-400 shrink-0" />
            <span className="text-xl font-bold text-ink dark:text-stone-100 tabular-nums whitespace-nowrap">
              {currentCity.windSpeedKmh} km/h
            </span>
            <span className="rounded bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 text-[11px] font-sans font-semibold text-ink dark:text-stone-200 whitespace-nowrap">
              {currentCity.windDirection}
            </span>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-700/80 pt-1.5">
            {currentCity.windSpeedKmh < 5
              ? 'Calm wind speeds impede pollutant dispersion'
              : 'Moderate airflow assisting natural air renewal'}
          </span>
        </div>

        {/* Card 6: Atmospheric Inversion & Boundary with Quiet Line Badge */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
              Atmospheric Boundary
            </span>
            <span
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap border shadow-2xs transition-colors"
              style={{
                backgroundColor: cityAqiStyle.bg,
                borderColor: cityAqiStyle.border,
                color: cityAqiStyle.text,
              }}
            >
              {currentCity.currentAQI > 200 ? (
                <>
                  <ArrowDownToLine className="h-3 w-3 shrink-0" />
                  <span>{currentCity.currentAQI >= 350 ? 'Severe Inversion Trap' : 'Thermal Trap Active'}</span>
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="h-3 w-3 shrink-0" />
                  <span>Clear Airflow Active</span>
                </>
              )}
            </span>
          </div>
          <div
            className="my-2 flex items-center gap-2 text-xs font-bold leading-snug"
            style={{ color: cityAqiStyle.text }}
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="break-words">{currentCity.inversionStatus}</span>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-700/80 pt-1.5">
            {currentCity.currentAQI > 300
              ? 'Cold air trapping surface smoke & dust below 200m'
              : currentCity.currentAQI > 200
              ? 'Nighttime thermal cooling slowing atmospheric dispersion'
              : 'Warm sun and steady airflow naturally dispersing dust'}
          </span>
        </div>
      </div>

      {/* 24-Hour Diurnal Smog & Ventilation Curve */}
      <div className="mt-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-stone-100 flex items-center gap-1.5">
              <span>24-Hour Diurnal Inversion & Ventilation Curve</span>
              <span className="font-mono text-xs font-normal text-ink-muted dark:text-stone-400">· Hourly Trapping & Airing Timeline</span>
            </h3>
            <p className="text-xs text-ink-muted dark:text-stone-400 mt-0.5">
              {currentCity.currentAQI > 200
                ? 'Surface thermal cooling traps pollutants overnight and early morning. Midday solar heating triggers convection and temporary dilution.'
                : 'Healthy atmospheric convection and steady wind maintain continuous natural air renewal throughout daytime hours.'}
            </p>
          </div>

          {/* Graded Status Badges in Diurnal Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-md border border-sage-300 dark:border-sage-800 bg-sage-50 dark:bg-sage-950/80 px-2.5 py-1 text-sage-800 dark:text-sage-200 font-medium shadow-2xs">
              <Sun className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
              <span>Safe Ventilation ({currentCity.safeVentilationWindows})</span>
            </div>

            <div 
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-medium shadow-2xs transition-colors"
              style={{
                backgroundColor: cityAqiStyle.bg,
                borderColor: cityAqiStyle.border,
                color: cityAqiStyle.text,
              }}
            >
              <CityStatusIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{cityAqiStyle.label} Episode Trapping</span>
            </div>
          </div>
        </div>

        {/* Visual Color Swatch Key: Explains all 6 AQI tiers + safe airing corridor */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono text-ink-muted dark:text-stone-300 border-t border-stone-200/80 dark:border-stone-800 pt-2 mb-2">
          <span className="font-semibold text-ink dark:text-stone-100">AQI Scale:</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? AQI_TIERS.good.dark.accent : AQI_TIERS.good.day.accent }} />
            <span>Good (0–50)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? AQI_TIERS.moderate.dark.accent : AQI_TIERS.moderate.day.accent }} />
            <span>Moderate (51–100)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? AQI_TIERS.poor.dark.accent : AQI_TIERS.poor.day.accent }} />
            <span>Poor (101–200)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? AQI_TIERS.unhealthy.dark.accent : AQI_TIERS.unhealthy.day.accent }} />
            <span>Unhealthy (201–300)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? AQI_TIERS.severe.dark.accent : AQI_TIERS.severe.day.accent }} />
            <span>Severe (301–400)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? AQI_TIERS.hazardous.dark.accent : AQI_TIERS.hazardous.day.accent }} />
            <span>Hazardous (401+)</span>
          </span>
          <span className="flex items-center gap-1.5 border-l border-stone-300 dark:border-stone-700 pl-2">
            <span className="h-2.5 w-3 rounded-2xs shrink-0 border border-sage-600 dark:border-sage-400 bg-sage-100 dark:bg-sage-950/60" />
            <span className="text-sage-700 dark:text-sage-300 font-semibold">Safe Airing Corridor</span>
          </span>
        </div>

        {/* Timeline Corridor Highlight Indicator */}
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-1.5">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            00:00 Midnight
          </span>
          <span className="flex items-center gap-1 font-semibold text-sage-700 dark:text-sage-300">
            <Sun className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400" />
            <span className="hidden xs:inline">Airing Corridor:</span> {currentCity.safeVentilationWindows}
          </span>
          <span className="flex items-center gap-1">
            23:00 Night
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
          </span>
        </div>

        {/* Mobile Quick Hour Stepper: Easy Thumb Scrubbing on Touchscreens */}
        <div className="flex sm:hidden items-center justify-between bg-stone-100 dark:bg-stone-800 rounded-md p-1.5 mb-2 text-xs font-mono">
          <button
            onClick={() => setSelectedHour((prev) => (prev - 1 + 24) % 24)}
            className="flex items-center gap-1 rounded bg-white dark:bg-stone-700 px-2.5 py-1 text-xs font-semibold text-ink dark:text-stone-100 shadow-2xs border border-stone-200 dark:border-stone-600 min-h-[30px]"
            aria-label="Previous hour"
          >
            ← Prev
          </button>
          <span className="font-bold text-ink dark:text-stone-100 flex items-center gap-1.5">
            <span>{activePoint.timeLabel}</span>
            <span className="text-[10px] text-ink-muted dark:text-stone-400 font-normal">
              ({activePoint.pm25} µg/m³)
            </span>
          </span>
          <button
            onClick={() => setSelectedHour((prev) => (prev + 1) % 24)}
            className="flex items-center gap-1 rounded bg-white dark:bg-stone-700 px-2.5 py-1 text-xs font-semibold text-ink dark:text-stone-100 shadow-2xs border border-stone-200 dark:border-stone-600 min-h-[30px]"
            aria-label="Next hour"
          >
            Next →
          </button>
        </div>

        {/* Diurnal Bar Visualization: All 24 Hours (00 through 23) - Guaranteed 100% Visibility at All Times */}
        <div className="pt-1 pb-1">
          <div className="w-full overflow-x-auto no-scrollbar sm:overflow-visible pb-1">
            <div className="flex items-end gap-1 sm:gap-1.5 h-36 min-w-[540px] sm:min-w-0 sm:w-full">
              {currentCity.diurnalCurve.map((point) => {
                const heightPercent = Math.max(26, Math.min(100, Math.round((point.pm25 / maxPm25) * 100)));
                const isHovered = hoveredHour === point.hour;
                const isSelected = selectedHour === point.hour;
                const isActive = isHovered || isSelected;

                const isWindowStart = point.hour === currentCity.ventilationStartHour;
                const isWindowEnd = point.hour === currentCity.ventilationEndHour;

                const barStyle = getBarAppearance(point, isActive, isDarkMode);
                const trackStyle = getTrackAppearance(point.isSafeVentilationWindow, isDarkMode, isWindowStart, isWindowEnd);

                return (
                  <div
                    key={point.hour}
                    onClick={() => setSelectedHour(point.hour)}
                    onMouseEnter={() => setHoveredHour(point.hour)}
                    onMouseLeave={() => setHoveredHour(null)}
                    className="relative flex-1 flex flex-col items-center h-full justify-end cursor-pointer group select-none"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedHour(point.hour);
                      }
                    }}
                    aria-label={`${point.timeLabel}: PM2.5 ${point.pm25} µg/m³, ${point.isSafeVentilationWindow ? 'Safe Ventilation Window' : `Inversion ${point.inversionRisk}`}`}
                  >
                    {/* Slot Track Background: Gives every hour (00-23) distinct structural baseline and highlights the ventilation corridor */}
                    <div
                      style={trackStyle}
                      className={`absolute inset-x-0 top-0 bottom-6 rounded-t transition-colors ${
                        isActive ? 'ring-1 ring-ink/30 dark:ring-white/40' : ''
                      }`}
                    />

                    {/* Filled Bar: High-contrast vibrant colors that are 100% visible at all times */}
                    <div
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: barStyle.bg,
                        borderColor: barStyle.border,
                      }}
                      className={`relative z-1 w-full rounded-t border-t border-x transition-all duration-150 ${
                        isActive
                          ? 'ring-2 ring-ink dark:ring-white ring-offset-1 scale-y-105 shadow-sm'
                          : 'opacity-95 hover:opacity-100'
                      }`}
                    />

                    {/* Selection Pin Indicator below bar */}
                    {isSelected && (
                      <div className="absolute bottom-6 z-2 -mb-1 w-1.5 h-1.5 rotate-45 bg-ink dark:bg-stone-100" />
                    )}

                    {/* Hour Axis Label: Clearly marked intervals + 23 at the far right boundary */}
                    <span
                      className={`mt-1.5 text-[10px] font-mono leading-none transition-colors ${
                        isActive
                          ? 'font-bold text-ink dark:text-stone-100 scale-110'
                          : 'text-ink-muted dark:text-stone-400'
                      }`}
                    >
                      {point.hour === 0 ? '00' :
                       point.hour === 3 ? '03' :
                       point.hour === 6 ? '06' :
                       point.hour === 9 ? '09' :
                       point.hour === 12 ? '12' :
                       point.hour === 15 ? '15' :
                       point.hour === 18 ? '18' :
                       point.hour === 21 ? '21' :
                       point.hour === 23 ? '23' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Detail Card with Plain-English Takeaway for Selected/Hovered Hour */}
          {(() => {
            const activeHourStyle = getAQIStyle(activePoint.aqi, isDarkMode);
            const ActiveHourIcon = activePoint.isSafeVentilationWindow
              ? Sun
              : activeHourStyle.tierKey === 'good' || activeHourStyle.tierKey === 'moderate'
              ? CheckCircle2
              : activeHourStyle.tierKey === 'poor' || activeHourStyle.tierKey === 'unhealthy'
              ? AlertTriangle
              : ShieldAlert;

            return (
              <div className="mt-3.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 p-3 sm:p-3.5 shadow-xs">
                <div className="border-b border-stone-200/80 dark:border-stone-700 pb-2.5 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
                  {/* Row 1 on mobile: Time + Condition Badge */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                    <span className="font-mono text-base font-bold text-ink dark:text-stone-100">
                      {activePoint.timeLabel}
                    </span>

                    {/* Mobile condition badge */}
                    <div className="sm:hidden">
                      <span
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide border shadow-2xs whitespace-nowrap transition-colors"
                        style={{
                          backgroundColor: activePoint.isSafeVentilationWindow
                            ? (isDarkMode ? 'rgba(35, 107, 86, 0.4)' : '#EAF6F1')
                            : activeHourStyle.bg,
                          borderColor: activePoint.isSafeVentilationWindow
                            ? (isDarkMode ? 'rgba(61, 168, 135, 0.6)' : '#95D1BD')
                            : activeHourStyle.border,
                          color: activePoint.isSafeVentilationWindow
                            ? (isDarkMode ? '#4EBA97' : '#1E5C4A')
                            : activeHourStyle.text,
                        }}
                      >
                        <ActiveHourIcon className="h-3 w-3 shrink-0" />
                        <span>
                          {activePoint.isSafeVentilationWindow
                            ? `Safe Airing · ${activeHourStyle.label}`
                            : `${activeHourStyle.label} Trapping`}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Row 2 on mobile: Metrics + Desktop Badge + Hint */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="hidden sm:inline text-stone-300 dark:text-stone-600">·</span>
                      <span 
                        className="font-bold tabular-nums"
                        style={{ color: activeHourStyle.text }}
                      >
                        PM2.5: {activePoint.pm25} µg/m³
                      </span>
                      <span className="text-ink-muted dark:text-stone-400">
                        (AQI ~{activePoint.aqi})
                      </span>
                    </div>

                    {/* Desktop-only condition badge */}
                    <div className="hidden sm:inline-flex">
                      <span
                        className="inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide border shadow-2xs whitespace-nowrap transition-colors"
                        style={{
                          backgroundColor: activePoint.isSafeVentilationWindow
                            ? (isDarkMode ? 'rgba(35, 107, 86, 0.4)' : '#EAF6F1')
                            : activeHourStyle.bg,
                          borderColor: activePoint.isSafeVentilationWindow
                            ? (isDarkMode ? 'rgba(61, 168, 135, 0.6)' : '#95D1BD')
                            : activeHourStyle.border,
                          color: activePoint.isSafeVentilationWindow
                            ? (isDarkMode ? '#4EBA97' : '#1E5C4A')
                            : activeHourStyle.text,
                        }}
                      >
                        <ActiveHourIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {activePoint.isSafeVentilationWindow
                            ? `Safe Ventilation Window · ${activeHourStyle.label}`
                            : `Inversion: ${activeHourStyle.label} Trapping`}
                        </span>
                      </span>
                    </div>

                    <span className="text-[10px] sm:text-[11px] text-ink-muted dark:text-stone-400">
                      {hoveredHour !== null ? 'Previewing hover' : 'Tap bar / arrows'}
                    </span>
                  </div>
                </div>

                {/* 3 Structured Plain-English Action Guidance Cards */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Card 1: Windows & Ventilation */}
                  <div className="rounded border border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                      <Wind className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                      <span>Windows & Airing</span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                      {activeGuidance.ventilation}
                    </p>
                  </div>

                  {/* Card 2: Outdoor & Exercise */}
                  <div className="rounded border border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                      <Activity className="h-3.5 w-3.5 text-terracotta-600 dark:text-terracotta-400 shrink-0" />
                      <span>Outdoor & Exercise</span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                      {activeGuidance.outdoor}
                    </p>
                  </div>

                  {/* Card 3: Atmospheric Inversion Context */}
                  <div className="rounded border border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/40 p-2.5 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400 shrink-0" />
                      <span>Atmospheric Context</span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                      {activeGuidance.atmosphere}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
