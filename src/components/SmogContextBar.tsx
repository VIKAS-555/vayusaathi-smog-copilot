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
  MapPin,
  Upload,
  Download
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
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);

  const cityAqiStyle = getAQIStyle(currentCity.currentAQI, isDarkMode, currentCity.aqiCategory);
  const CityStatusIcon = 
    cityAqiStyle.tierKey === 'good' || cityAqiStyle.tierKey === 'moderate'
      ? CheckCircle2
      : cityAqiStyle.tierKey === 'poor' || cityAqiStyle.tierKey === 'unhealthy'
      ? AlertTriangle
      : ShieldAlert;

  const bannerStyle = getAtmosphereBannerStyle(currentCity, isDarkMode);

  return (
    <div className="w-full mb-6">
      {/* Atmospheric Station & Weather Hero Banner matching reference design */}
      <div 
        className="relative overflow-hidden rounded-3xl sm:rounded-[32px] border p-5 sm:p-7 transition-all duration-300 ease-in-out shadow-2xl"
        style={{
          background: bannerStyle.background,
          borderColor: 'rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Soft dark protective radial scrim behind top-left AQI, PM2.5 & PM10 readouts */}
        <div 
          className="absolute -top-16 -left-16 w-[34rem] sm:w-[46rem] h-[34rem] sm:h-[46rem] rounded-full pointer-events-none z-0 select-none"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle at 22% 22%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.52) 50%, rgba(0, 0, 0, 0) 80%)"
              : "radial-gradient(circle at 22% 22%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0) 80%)",
          }}
          aria-hidden="true"
        />

        {/* Ambient atmospheric radial spotlight illuminating the central architectural landmark from above */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[38rem] sm:w-[52rem] h-[26rem] sm:h-[34rem] rounded-full pointer-events-none z-0 select-none transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 65% 55% at 50% 25%, ${bannerStyle.accent}45 0%, ${bannerStyle.accent}1E 45%, transparent 75%)`,
          }}
          aria-hidden="true"
        />

        {/* Full-width Architectural Outlined Skyline & Coordinate Grid Backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
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
          {/* Top Header Row matching reference design */}
          <div className="flex items-center justify-between gap-3 pb-1">
            {/* Active Station Identity */}
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 truncate">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {currentCity.name}
              </h3>
              <span className="font-mono text-xs sm:text-sm text-stone-300/80">
                · {currentCity.state}
              </span>
              {isLocationMatched && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 backdrop-blur-xs shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Near You</span>
                </span>
              )}
            </div>

            {/* Quick Share & Download Action Buttons matching reference design */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {onRefreshLive && (
                <button
                  onClick={onRefreshLive}
                  disabled={isFetchingLive}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-xs border border-white/10 transition-all shadow-2xs"
                  title="Poll live WMO / CPCB satellite & station telemetry"
                  aria-label="Sync Live"
                >
                  <RefreshCw className={`h-4 w-4 ${isFetchingLive ? "animate-spin text-white" : ""}`} />
                </button>
              )}

              <button
                onClick={() => setShowCustomInputs(!showCustomInputs)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-xs border border-white/10 transition-all shadow-2xs"
                title="Manual Telemetry Overrides"
                aria-label="Overrides"
              >
                <Sliders className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: `${currentCity.name} AQI: ${currentCity.currentAQI}`,
                      text: `Current air quality in ${currentCity.name} is ${currentCity.currentAQI} AQI (${currentCity.aqiCategory}). Dominant pollutant: ${currentCity.dominantPollutant}.`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xs border border-white/15 transition-all shadow-xs"
                title="Share Station Report"
                aria-label="Share"
              >
                <Upload className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xs border border-white/15 transition-all shadow-xs"
                title="Download Air Quality Snapshot"
                aria-label="Download"
              >
                <Download className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            </div>
          </div>

          {/* Main Hero Grid: Left AQI + Rainbow Spectrum Gauge, Right Frosted Weather Card */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
            {/* Left Column: Live AQI readout + continuous rainbow spectrum gauge */}
            <div className="sm:col-span-7 flex flex-col justify-center">
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
                    <span>{cityAqiStyle.label}</span>
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

              {/* Core PM2.5 and PM10 Metrics Readouts */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 my-2 text-xs sm:text-sm font-mono text-stone-200">
                <div>
                  <span className="text-stone-400 font-normal">PM2.5 : </span>
                  <strong className="text-white font-bold">{currentCity.pm25} µg/m³</strong>
                </div>
                <div>
                  <span className="text-stone-400 font-normal">PM10 : </span>
                  <strong className="text-white font-bold">{currentCity.pm10} µg/m³</strong>
                </div>
                <span className="text-[11px] font-mono text-stone-400">
                  Dominant: <strong className="text-stone-200 font-semibold">{currentCity.dominantPollutant}</strong>
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

                {/* Active Category Range Badge beneath Pin Thumb matching reference design */}
                <div className="relative w-full h-6 mt-1 overflow-visible">
                  <div
                    className="absolute top-0 -translate-x-1/2 transition-all duration-700 pointer-events-none"
                    style={{ left: `${getSpectrumPercentage(currentCity.currentAQI)}%` }}
                  >
                    <span 
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold border backdrop-blur-md shadow-xs whitespace-nowrap"
                      style={{
                        backgroundColor: bannerStyle.categoryBg,
                        borderColor: bannerStyle.categoryBorder,
                        color: bannerStyle.categoryText,
                      }}
                    >
                      {cityAqiStyle.label} ({cityAqiStyle.minAqi}–{cityAqiStyle.maxAqi})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Frosted Glass Weather Card */}
            <div className="sm:col-span-5 flex justify-end w-full">
              <div className="w-full max-w-sm sm:max-w-[340px] ml-auto rounded-2xl border border-white/20 bg-white/10 dark:bg-black/30 backdrop-blur-md p-4 sm:p-5 shadow-xl flex flex-col justify-between text-white transition-all">
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

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 text-xs font-mono shadow-2xs backdrop-blur-xs transition-colors">
                    <span>{getCityLandmarkName(currentCity.id)}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-stone-300" />
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

    </div>
  );
};
