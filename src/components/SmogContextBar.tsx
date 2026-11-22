import React, { useState, useEffect } from 'react';
import { CitySmogContext } from '../types';
import { CITY_PRESETS, getHourlyGuidance } from '../data/cityPresets';
import { CitySkylineBackdrop } from './CitySkylineBackdrop';
import { 
  getAQIStyle, 
  getAQITier, 
  getSharedAQITheme,
  getSpectrumPercentage, 
  AQI_TIERS, 
  AQITier,
  AQI_SPECTRUM_GRADIENT,
  AQI_SPECTRUM_TICKS
} from '../lib/aqiScale';
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
  Radio,
  ExternalLink,
  ArrowUpRight,
  MapPin
} from 'lucide-react';

interface SmogContextBarProps {
  currentCity: CitySmogContext;
  onSelectCity: (city: CitySmogContext) => void;
  onCustomUpdate?: (updated: Partial<CitySmogContext>) => void;
  onRefreshLive?: () => void;
  isFetchingLive?: boolean;
  isDarkMode?: boolean;
  isLocationMatched?: boolean;
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
  const theme = getSharedAQITheme(city.currentAQI, isDark, city.aqiCategory);

  let weatherLabel = 'Smog';
  let icon: React.ReactNode;

  switch (theme.tierKey) {
    case 'good':
      weatherLabel = 'Clear';
      icon = (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
      break;
    case 'moderate':
      weatherLabel = 'Fair Airflow';
      icon = (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
      break;
    case 'poor':
      weatherLabel = 'Photochemical Haze';
      icon = (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      );
      break;
    case 'unhealthy':
      weatherLabel = 'Smoky haze';
      icon = (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 16H9a6 6 0 1 1 5.75-7.75A4.5 4.5 0 0 1 17.5 16Z" fill="currentColor" fillOpacity="0.25" />
          <line x1="4" y1="19" x2="20" y2="19" strokeWidth="2" />
          <line x1="7" y1="22" x2="17" y2="22" strokeWidth="2" />
        </svg>
      );
      break;
    case 'severe':
      weatherLabel = 'Smog';
      icon = (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-purple-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 16H9a6 6 0 1 1 5.75-7.75A4.5 4.5 0 0 1 17.5 16Z" fill="currentColor" fillOpacity="0.3" />
          <line x1="4" y1="19" x2="20" y2="19" strokeWidth="2" />
          <line x1="7" y1="22" x2="17" y2="22" strokeWidth="2" />
        </svg>
      );
      break;
    case 'hazardous':
    default:
      weatherLabel = 'Severe Smog';
      icon = (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 16H9a6 6 0 1 1 5.75-7.75A4.5 4.5 0 0 1 17.5 16Z" fill="currentColor" fillOpacity="0.3" />
          <line x1="3" y1="19" x2="21" y2="19" strokeWidth="2" />
          <line x1="6" y1="22" x2="18" y2="22" strokeWidth="2" />
        </svg>
      );
      break;
  }

  return {
    tierKey: theme.tierKey,
    background: theme.bannerBg,
    borderColor: theme.border,
    accent: theme.accent,
    skylineColor: theme.skyline,
    liveDotColor: theme.liveDotColor,
    categoryBg: theme.badgeBg,
    categoryBorder: theme.badgeBorder,
    categoryText: theme.badgeText,
    categoryLabel: theme.label,
    weatherLabel,
    icon,
  };
}

export function getCityLandmarkName(cityId: string): string {
  const id = (cityId || '').toLowerCase();
  if (id.includes('delhi')) return 'India Gate';
  if (id.includes('gurugram') || id.includes('gurgaon')) return 'Cyber City';
  if (id.includes('noida')) return 'Noida Skyline';
  if (id.includes('bengaluru') || id.includes('bangalore')) return 'Vidhana Soudha';
  if (id.includes('mumbai') || id.includes('bombay')) return 'Gateway of India';
  if (id.includes('kolkata') || id.includes('calcutta')) return 'Victoria Memorial';
  if (id.includes('chennai') || id.includes('madras')) return 'Ripon Clock Tower';
  if (id.includes('hyderabad')) return 'Charminar';
  if (id.includes('pune')) return 'Shaniwar Wada';
  if (id.includes('ahmedabad')) return 'Sidi Saiyyed Arch';
  if (id.includes('lucknow')) return 'Rumi Darwaza';
  return 'City Horizon';
}

export const SmogContextBar: React.FC<SmogContextBarProps> = ({
  currentCity,
  onSelectCity,
  onCustomUpdate,
  onRefreshLive,
  isFetchingLive = false,
  isDarkMode = false,
  isLocationMatched = false,
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

  // Current hour of the day for the "Current Hour" marker
  const currentHour = new Date().getHours();
  const currentHourStr = `${currentHour.toString().padStart(2, '0')}:00`;

  // Dynamic reference hairlines (100, 200, 300) scaled to peak PM2.5
  const referenceHairlines = maxPm25 > 250 
    ? [100, 200, 300] 
    : maxPm25 > 120 
    ? [50, 100, 150] 
    : [25, 50, 75];

  const activeHour = hoveredHour !== null ? hoveredHour : selectedHour;
  const tooltipLeftPct = Math.min(92, Math.max(8, ((activeHour + 0.5) / 24) * 100));

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
    <div className="rounded-2xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-4 sm:p-5 shadow-xs transition-colors">
      {/* Atmospheric Station & Weather Hero Banner */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all duration-300 ease-in-out shadow-md mb-5"
        style={{
          background: bannerStyle.background,
          borderColor: bannerStyle.borderColor,
        }}
      >
        {/* Subtle dark protective radial vignette behind top-left AQI, PM2.5 & PM10 readouts */}
        <div 
          className="absolute -top-12 -left-12 w-[28rem] sm:w-[38rem] h-[28rem] sm:h-[38rem] rounded-full pointer-events-none z-0 select-none"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0) 75%)"
              : "radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.22) 45%, rgba(0, 0, 0, 0) 75%)",
          }}
          aria-hidden="true"
        />

        {/* Full-width Architectural Outlined Skyline Backdrop with Depth */}
        <div 
          className="absolute inset-x-0 bottom-0 pointer-events-none select-none overflow-hidden h-36 sm:h-48 md:h-56 z-0 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
          }}
        >
          <CitySkylineBackdrop 
            cityId={currentCity.id} 
            aqi={currentCity.currentAQI}
            aqiCategory={currentCity.aqiCategory}
            skylineColor={bannerStyle.skylineColor} 
            isDark={isDarkMode} 
          />
        </div>

        {/* Content Layer (relative z-10) */}
        <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
          {/* Top Control Bar: Station Switcher Chips + Provenance Badge + Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
            {/* Active Station Identity Header */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-white/10 border border-white/20 text-white shrink-0 shadow-2xs">
                <MapPin className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 truncate">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {currentCity.name}
                </h3>
                <span className="font-mono text-[11px] sm:text-xs text-stone-300/80">
                  · {currentCity.state}
                </span>
                {isLocationMatched && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 backdrop-blur-xs shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Near You</span>
                  </span>
                )}
              </div>
            </div>

            {/* Live Provenance Badge & Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              {currentCity.dataSource === "live" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-400/40 dark:border-sage-700/50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-sage-800 dark:text-sage-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Live Station Feed</span>
                  <span className="font-mono text-ink-muted dark:text-stone-400 font-normal">· {currentCity.lastUpdatedText || "Live"}</span>
                </span>
              ) : currentCity.dataSource === "manual" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 dark:border-amber-700/50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Manual Overrides</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-ink-muted dark:text-stone-300 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-stone-400 shrink-0" />
                  <span>Station Snapshot</span>
                </span>
              )}

              <div className="flex items-center gap-1.5">
                {onRefreshLive && (
                  <button
                    onClick={onRefreshLive}
                    disabled={isFetchingLive}
                    className="flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-stone-800/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-ink dark:text-stone-200 hover:bg-white dark:hover:bg-stone-700 disabled:opacity-50 transition-all shadow-2xs min-h-[30px]"
                    title="Poll live WMO / CPCB satellite & station telemetry"
                  >
                    <RefreshCw className={`h-3 w-3 text-ink-muted dark:text-stone-400 ${isFetchingLive ? "animate-spin text-ink" : ""}`} />
                    <span>{isFetchingLive ? "Syncing…" : "Sync Live"}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowCustomInputs(!showCustomInputs)}
                  className="flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-stone-800/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-ink-muted dark:text-stone-300 hover:text-ink hover:bg-white dark:hover:bg-stone-700 transition-all min-h-[30px]"
                >
                  <Sliders className="h-3 w-3" />
                  <span>{showCustomInputs ? "Hide Overrides" : "Overrides"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Hero Grid: Left AQI + Rainbow Spectrum Gauge, Right Frosted Weather Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left Column: Live AQI readout + continuous rainbow spectrum gauge */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Top Row: Live AQI tag + "Air Quality is" + Category Pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs mb-1">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-200">
                  <span 
                    className="h-2.5 w-2.5 rounded-full animate-pulse shrink-0 shadow-sm transition-colors duration-500" 
                    style={{ 
                      backgroundColor: bannerStyle.liveDotColor,
                      boxShadow: `0 0 10px ${bannerStyle.liveDotColor}`
                    }}
                  />
                  <span>Live AQI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-300 font-medium">Air Quality is</span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border backdrop-blur-md shadow-xs transition-colors"
                    style={{
                      backgroundColor: bannerStyle.categoryBg,
                      borderColor: bannerStyle.categoryBorder,
                      color: bannerStyle.categoryText,
                    }}
                  >
                    <span>{currentCity.aqiCategory}</span>
                  </span>
                </div>
              </div>

              {/* AQI Number + CPCB Tag */}
              <div className="flex items-baseline gap-2 my-1">
                <span 
                  className="font-mono text-5xl sm:text-6xl font-black tracking-tight drop-shadow-md tabular-nums transition-colors duration-500"
                  style={{ color: bannerStyle.accent }}
                >
                  {currentCity.currentAQI}
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-stone-300/80">
                  AQI (CPCB)
                </span>
              </div>

              {/* Continuous Graded Horizontal Rainbow Spectrum Gauge Bar */}
              <div className="w-full max-w-xl mt-3 pt-1">
                {/* Spectrum Tier Labels */}
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono font-medium text-stone-300 mb-1 px-0.5">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Poor</span>
                  <span>Unhealthy</span>
                  <span>Severe</span>
                  <span>Hazardous</span>
                </div>

                {/* The Continuous Color Bar with Indicator Thumb Pin */}
                <div className="relative w-full h-3 sm:h-3.5 rounded-full overflow-visible shadow-xs p-0.5 bg-black/40 border border-white/15">
                  {/* Gradient Track */}
                  <div 
                    className="w-full h-full rounded-full"
                    style={{ background: AQI_SPECTRUM_GRADIENT }}
                  />

                  {/* Active Pin Thumb positioned precisely at current AQI percentage */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none"
                    style={{ left: `${getSpectrumPercentage(currentCity.currentAQI)}%` }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div 
                        className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white dark:bg-stone-900 border-2 shadow-md flex items-center justify-center animate-pulse"
                        style={{ borderColor: bannerStyle.accent }}
                      >
                        <div 
                          className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full transition-colors duration-500" 
                          style={{ backgroundColor: bannerStyle.accent }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scale Ticks Below Bar */}
                <div className="flex justify-between items-center text-[10px] font-mono font-medium text-stone-400 mt-1 px-1">
                  {AQI_SPECTRUM_TICKS.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Frosted Glass Weather Card */}
            <div className="lg:col-span-5 flex justify-end w-full">
              <div className="w-full rounded-2xl border border-white/20 bg-white/10 dark:bg-black/30 backdrop-blur-md p-4 sm:p-5 shadow-xl flex flex-col justify-between text-white transition-all">
                {/* Weather Header: Icon + Temp + Condition + Top-Right Arrow */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 shadow-xs">
                      {bannerStyle.icon}
                    </div>
                    <div>
                      <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                        {Math.round(currentCity.temperatureC)}°C
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white/90">
                        {bannerStyle.weatherLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-1 rounded-md bg-white/10 border border-white/15 text-stone-200 text-right">
                      <span>{getCityLandmarkName(currentCity.id)}</span>
                    </span>
                    <div className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                {/* Atmospheric Sub-Metrics (Humidity, Wind Speed, UV Index) */}
                <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-stone-300">
                      <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Humidity</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-white mt-0.5">
                      {currentCity.humidityPercent} %
                    </div>
                  </div>

                  <div className="flex flex-col items-center border-x border-white/15 px-1">
                    <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-stone-300">
                      <Wind className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Wind Speed</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-white mt-0.5">
                      {currentCity.windSpeedKmh} <span className="text-[10px] font-sans font-normal">km/h</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-stone-300">
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span>UV Index</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-white mt-0.5">
                      0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Input Slider Panel (When Toggled) */}
      {showCustomInputs && (
        <div className="mb-5 rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-xs">
          <div>
            <label className="block font-medium text-ink-muted dark:text-stone-300 mb-1">
              Custom AQI: <span className="font-mono font-bold text-ink dark:text-stone-100">{currentCity.currentAQI}</span>
            </label>
            <input
              type="range"
              min="30"
              max="500"
              value={currentCity.currentAQI}
              onChange={(e) => onCustomUpdate?.({ currentAQI: Number(e.target.value) })}
              className="editorial-slider w-full mt-1.5"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.currentAQI - 30) / (500 - 30)) * 100))}%` } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block font-medium text-ink-muted dark:text-stone-300 mb-1">
              PM2.5 (µg/m³): <span className="font-mono font-bold text-ink dark:text-stone-100">{currentCity.pm25}</span>
            </label>
            <input
              type="range"
              min="15"
              max="450"
              value={currentCity.pm25}
              onChange={(e) => onCustomUpdate?.({ pm25: Number(e.target.value) })}
              className="editorial-slider w-full mt-1.5"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.pm25 - 15) / (450 - 15)) * 100))}%` } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block font-medium text-ink-muted dark:text-stone-300 mb-1">
              Wind Speed (km/h): <span className="font-mono font-bold text-ink dark:text-stone-100">{currentCity.windSpeedKmh}</span>
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={currentCity.windSpeedKmh}
              onChange={(e) => onCustomUpdate?.({ windSpeedKmh: Number(e.target.value) })}
              className="editorial-slider w-full mt-1.5"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.windSpeedKmh - 1) / (25 - 1)) * 100))}%` } as React.CSSProperties}
            />
          </div>
        </div>
      )}

      {/* 24-Hour Diurnal Smog & Ventilation Curve */}
      <div className="mt-5 rounded-2xl border border-stone-200 dark:border-[#2B3833] bg-stone-50/70 dark:bg-[#1A221F] p-4 sm:p-5 shadow-xs transition-colors">
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

          {/* Streamlined Legend Strip: Highlights Safe Airing Corridor, Trapping Hours, and Current Hour */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* 1. Safe Airing Corridor */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/90 dark:bg-emerald-950/60 px-2.5 py-1 text-emerald-800 dark:text-emerald-200 font-medium shadow-2xs">
              <span className="h-2.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Safe Airing Corridor ({currentCity.safeVentilationWindows})</span>
            </div>

            {/* 2. Trapping Hours */}
            <div className="flex items-center gap-1.5 rounded-full border border-amber-300/80 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/40 px-2.5 py-1 text-amber-800 dark:text-amber-300 font-medium shadow-2xs">
              <span className="h-2.5 w-1.5 rounded-full bg-amber-500/80 dark:bg-amber-400/80 shrink-0" />
              <span>Trapping Hours</span>
            </div>

            {/* 3. Current Hour */}
            <div className="flex items-center gap-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/90 px-2.5 py-1 text-ink dark:text-stone-200 font-semibold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Current Hour ({currentHourStr})</span>
            </div>
          </div>
        </div>

        {/* Mobile Quick Hour Stepper: Easy Thumb Scrubbing on Touchscreens */}
        <div className="flex sm:hidden items-center justify-between bg-stone-100 dark:bg-[#222B27] rounded-lg p-1.5 mb-2 text-xs font-mono border border-stone-200 dark:border-[#2D3A34]">
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
              (AQI ~{activePoint.aqi})
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

        {/* Diurnal Bar Visualization: Sleek, Shorter Capsule Bars with Reference Hairlines & Floating Tooltip */}
        <div className="pt-8 pb-1">
          <div className="relative w-full overflow-x-auto no-scrollbar sm:overflow-visible pb-1">
            {/* Interactive Floating Hour Tooltip */}
            <div
              className="absolute -top-7 z-30 pointer-events-none transition-all duration-150 ease-out -translate-x-1/2 flex flex-col items-center select-none"
              style={{ left: `${tooltipLeftPct}%` }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-stone-300 dark:border-[#2D3A34] bg-white/95 dark:bg-[#1A221F]/95 px-2.5 py-1 text-xs shadow-lg backdrop-blur-md whitespace-nowrap">
                <span className="font-mono font-bold text-ink dark:text-stone-100">
                  {activePoint.timeLabel}
                </span>
                <span className="h-3 w-px bg-stone-200 dark:bg-stone-700" />
                <span 
                  className="font-mono font-bold tabular-nums"
                  style={{ color: getAQIStyle(activePoint.aqi, isDarkMode).accent }}
                >
                  AQI {activePoint.aqi}
                </span>
                <span className="h-3 w-px bg-stone-200 dark:bg-stone-700" />
                <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                  activePoint.isSafeVentilationWindow 
                    ? 'text-emerald-700 dark:text-emerald-300' 
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {activePoint.isSafeVentilationWindow ? (
                    <>
                      <Sun className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>Safe Ventilation Window</span>
                    </>
                  ) : (
                    <>
                      <CloudFog className="h-3 w-3 text-amber-500 shrink-0" />
                      <span>Inversion Trapping</span>
                    </>
                  )}
                </span>
              </div>
              {/* Tooltip caret pointer */}
              <div className="w-2 h-2 rotate-45 -mt-1 bg-white dark:bg-[#1A221F] border-r border-b border-stone-300 dark:border-[#2D3A34]" />
            </div>

            {/* Chart Area with Horizontal Reference Hairlines (100, 200, 300) */}
            <div className="relative h-[84px] sm:h-[90px] min-w-[500px] sm:min-w-0 sm:w-full">
              {/* Reference Hairlines */}
              <div className="absolute inset-x-0 top-0 bottom-6 pointer-events-none z-0">
                {referenceHairlines.map((val) => {
                  const bottomPct = Math.round((val / maxPm25) * 100);
                  if (bottomPct < 10 || bottomPct > 90) return null;
                  return (
                    <div
                      key={val}
                      className="absolute inset-x-0 flex items-center border-b border-dashed border-stone-300/60 dark:border-stone-700/60"
                      style={{ bottom: `${bottomPct}%` }}
                    >
                      <span className="absolute right-0 -top-2.5 font-mono text-[9px] text-stone-400 dark:text-stone-500 select-none bg-stone-50/90 dark:bg-[#1A221F]/90 px-1 rounded">
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 24 Hourly Capsule Slots */}
              <div className="relative z-10 flex items-end h-full w-full">
                {currentCity.diurnalCurve.map((point) => {
                  const heightPercent = Math.max(16, Math.min(100, Math.round((point.pm25 / maxPm25) * 100)));
                  const isHovered = hoveredHour === point.hour;
                  const isSelected = selectedHour === point.hour;
                  const isActive = isHovered || isSelected;
                  const isCurrent = point.hour === currentHour;

                  const isWindowStart = point.hour === currentCity.ventilationStartHour;
                  const isWindowEnd = point.hour === currentCity.ventilationEndHour;

                  const barStyle = getBarAppearance(point, isActive, isDarkMode);

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
                      aria-label={`${point.timeLabel}: PM2.5 ${point.pm25} µg/m³, AQI ${point.aqi}, ${
                        point.isSafeVentilationWindow ? 'Safe Ventilation Window' : `Inversion ${point.inversionRisk}`
                      }`}
                    >
                      {/* Safe Airing Corridor Column Slot Background */}
                      {point.isSafeVentilationWindow && (
                        <div
                          className={`absolute inset-x-0 top-0 bottom-6 transition-colors pointer-events-none ${
                            isDarkMode ? 'bg-emerald-500/[0.09]' : 'bg-emerald-500/[0.07]'
                          } border-t-2 border-emerald-500/60 dark:border-emerald-400/60 ${
                            isWindowStart ? 'rounded-tl-md border-l border-emerald-500/30' : ''
                          } ${
                            isWindowEnd ? 'rounded-tr-md border-r border-emerald-500/30' : ''
                          }`}
                        />
                      )}

                      {/* Capsule Bar: Slender (6px-8px), rounded capsule centered in slot */}
                      <div className="relative z-10 w-full flex items-end justify-center h-full pb-5">
                        <div
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: point.isSafeVentilationWindow 
                              ? (isDarkMode ? '#34D399' : '#10B981')
                              : barStyle.bg,
                          }}
                          className={`w-1.5 sm:w-2 rounded-full transition-all duration-200 ${
                            isActive
                              ? 'ring-2 ring-ink dark:ring-stone-100 ring-offset-2 ring-offset-stone-50 dark:ring-offset-[#1A221F] scale-110 shadow-md opacity-100'
                              : point.isSafeVentilationWindow
                              ? 'opacity-95 hover:opacity-100 hover:scale-105'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          } ${isCurrent && !isActive ? 'ring-1 ring-emerald-500/80 ring-offset-1 ring-offset-stone-50 dark:ring-offset-[#1A221F]' : ''}`}
                        />
                      </div>

                      {/* Marker Pin / Indicator below bar */}
                      <div className="h-2 flex items-center justify-center">
                        {isSelected ? (
                          <div className="w-1.5 h-1.5 rotate-45 bg-ink dark:bg-stone-100 shadow-2xs" />
                        ) : isCurrent ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        ) : null}
                      </div>

                      {/* Hour Axis Label (00, 03, 06, 09, 12, 15, 18, 21, 23) */}
                      <span
                        className={`h-3 text-[10px] font-mono leading-none transition-colors ${
                          isActive
                            ? 'font-bold text-ink dark:text-stone-100 scale-105'
                            : isCurrent
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
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
                  <div className="rounded-xl border border-stone-200/80 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-2.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                      <Wind className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                      <span>Windows & Airing</span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                      {activeGuidance.ventilation}
                    </p>
                  </div>

                  {/* Card 2: Outdoor & Exercise */}
                  <div className="rounded-xl border border-stone-200/80 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-2.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                      <Activity className="h-3.5 w-3.5 text-terracotta-600 dark:text-terracotta-400 shrink-0" />
                      <span>Outdoor & Exercise</span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                      {activeGuidance.outdoor}
                    </p>
                  </div>

                  {/* Card 3: Atmospheric Inversion Context */}
                  <div className="rounded-xl border border-stone-200/80 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-2.5 sm:col-span-2 lg:col-span-1 shadow-2xs">
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
