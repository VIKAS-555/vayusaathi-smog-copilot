import React, { useState, useEffect } from 'react';
import { CitySmogContext } from '../types';
import { CITY_PRESETS, getHourlyGuidance } from '../data/cityPresets';
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

// Calibrated high-contrast bar styling that guarantees 100% visibility in both Day and Night mode
function getBarAppearance(
  point: { hour: number; pm25: number; aqi: number; inversionRisk: string; isSafeVentilationWindow: boolean },
  isActive: boolean,
  isDark: boolean
) {
  if (point.isSafeVentilationWindow) {
    return {
      bg: isDark ? (isActive ? '#4EBA97' : '#3DA887') : (isActive ? '#1B5645' : '#236B56'),
      border: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    };
  }
  if (point.inversionRisk === 'Severe') {
    return {
      bg: isDark ? (isActive ? '#FF8F6B' : '#F27A55') : (isActive ? '#A83B19' : '#C4512C'),
      border: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    };
  }
  if (point.inversionRisk === 'High') {
    return {
      bg: isDark ? (isActive ? '#FCD34D' : '#FBBF24') : (isActive ? '#B45309' : '#D97706'),
      border: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    };
  }
  if (point.inversionRisk === 'Low' || point.pm25 <= 35) {
    return {
      bg: isDark ? (isActive ? '#5EEAD4' : '#2DD4BF') : (isActive ? '#0F766E' : '#0D9488'),
      border: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    };
  }
  // Moderate: High-contrast slate/silver so it's always clearly visible!
  return {
    bg: isDark ? (isActive ? '#CBD5E1' : '#94A3B8') : (isActive ? '#57534E' : '#64748B'),
    border: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
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

  return (
    <div className="rounded-lg border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 sm:p-5 shadow-xs">
      {/* City Presets & Live Telemetry Bar */}
      <div className="flex flex-col gap-3 border-b border-stone-200 dark:border-stone-800 pb-3.5">
        {/* Horizontally scrollable chip strip on mobile, flex-wrap on tablet/desktop */}
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
                      : 'bg-stone-100 dark:bg-stone-800 text-ink-muted dark:text-stone-300 hover:bg-stone-200 hover:text-ink'
                  }`}
                >
                  {preset.name.split(' (')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Source Provenance & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full pt-0.5">
          {/* Status Badge */}
          {currentCity.dataSource === 'live' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-300 dark:border-sage-800 bg-sage-50 dark:bg-sage-950/80 px-2.5 py-1 text-[11px] font-medium text-sage-800 dark:text-sage-200 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-600 animate-pulse shrink-0" />
              <span>Live Station Feed</span>
              <span className="font-mono text-ink-muted dark:text-stone-400 font-normal">· {currentCity.lastUpdatedText || 'Live'}</span>
            </span>
          ) : currentCity.dataSource === 'manual' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:text-amber-200 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" />
              <span>Manual Overrides Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-ink-muted dark:text-stone-300 shadow-2xs">
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
                className="flex items-center gap-1 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 disabled:opacity-50 transition-colors shadow-2xs min-h-[30px]"
                title="Poll live WMO / CPCB satellite & station telemetry"
              >
                <RefreshCw className={`h-3 w-3 text-ink-muted dark:text-stone-400 ${isFetchingLive ? 'animate-spin text-ink' : ''}`} />
                <span>{isFetchingLive ? 'Syncing…' : 'Sync Live'}</span>
              </button>
            )}

            <button
              onClick={() => setShowCustomInputs(!showCustomInputs)}
              className="flex items-center gap-1 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-ink-muted dark:text-stone-300 hover:text-ink hover:bg-stone-100 transition-colors min-h-[30px]"
            >
              <Sliders className="h-3 w-3" />
              <span>{showCustomInputs ? 'Hide Overrides' : 'Overrides'}</span>
            </button>
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
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Index (CPCB AQI)
            </span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 whitespace-nowrap ${
                currentCity.currentAQI >= 400
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : currentCity.currentAQI >= 300
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : currentCity.currentAQI >= 200
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <Activity className="h-3 w-3 shrink-0" />
              <span>{currentCity.aqiCategory}</span>
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-ink tabular-nums">
              {currentCity.currentAQI}
            </span>
            <span className="text-xs text-ink-muted">
              {currentCity.currentAQI <= 100 ? 'Minimal health risk' : 'Active air alert'}
            </span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5 flex items-center justify-between">
            <span>Dominant: <strong className="text-ink font-semibold">{currentCity.dominantPollutant}</strong></span>
            <span className="font-mono text-[10px] text-ink-muted">
              {currentCity.dataSource === 'live' ? 'Live Telemetry' : currentCity.dataSource === 'manual' ? 'Manual Value' : 'Station Preset'}
            </span>
          </span>
        </div>

        {/* Card 2: PM2.5 Fine Ambient Particles with Quiet Condition Badge */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              PM2.5 Ambient
            </span>
            {currentCity.pm25 > 250 ? (
              <span className="inline-flex items-center gap-1 rounded bg-terracotta-50 border border-terracotta-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-terracotta-700 whitespace-nowrap">
                <Flame className="h-3 w-3 shrink-0" /> Extreme Fine Load
              </span>
            ) : currentCity.pm25 > 100 ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 whitespace-nowrap">
                <AlertTriangle className="h-3 w-3 shrink-0" /> Elevated Exposure
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded bg-sage-50 border border-sage-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-sage-700 whitespace-nowrap">
                <CheckCircle2 className="h-3 w-3 shrink-0" /> Baseline Safe
              </span>
            )}
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span
              className={`font-mono text-3xl font-extrabold tabular-nums ${
                currentCity.currentAQI > 200 ? 'text-terracotta-700' : 'text-sage-700'
              }`}
            >
              {currentCity.pm25}
            </span>
            <span className="text-xs font-mono font-medium text-ink-muted">µg/m³</span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            {currentCity.pm25 <= 15
              ? 'Within WHO annual guideline (5 µg/m³)'
              : `${(currentCity.pm25 / 15).toFixed(1)}x above WHO 24h limit (15 µg/m³)`}
          </span>
        </div>

        {/* Card 3: PM10 Coarse Particulates */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              PM10 Coarse Dust
            </span>
            <span className="text-[10px] font-mono text-ink-muted whitespace-nowrap">Aerodynamic &lt; 10µm</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-ink tabular-nums">
              {currentCity.pm10}
            </span>
            <span className="text-xs font-mono font-medium text-ink-muted">µg/m³</span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            Inhalable road dust, crustal soil & soot
          </span>
        </div>

        {/* Card 4: Weather State & Moisture */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Weather & Moisture
          </span>
          <div className="my-2 flex flex-wrap items-center gap-2.5 font-mono">
            <span className="flex items-center gap-1.5 text-base font-bold text-ink whitespace-nowrap">
              <Thermometer className="h-4 w-4 text-ink-muted shrink-0" />
              <span>{currentCity.temperatureC}°C</span>
            </span>
            <span className="text-stone-300">·</span>
            <span className="flex items-center gap-1.5 text-base font-bold text-ink whitespace-nowrap">
              <Droplets className="h-4 w-4 text-ink-muted shrink-0" />
              <span>{currentCity.humidityPercent}% RH</span>
            </span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            {currentCity.humidityPercent >= 75
              ? 'High moisture promotes secondary chemical smog'
              : 'Moderate humidity · Low mist condensation'}
          </span>
        </div>

        {/* Card 5: Dispersion Wind */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Dispersion Surface Wind
          </span>
          <div className="my-2 flex items-center gap-2 font-mono">
            <Wind className="h-4 w-4 text-ink-muted shrink-0" />
            <span className="text-xl font-bold text-ink tabular-nums whitespace-nowrap">
              {currentCity.windSpeedKmh} km/h
            </span>
            <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[11px] font-sans font-semibold text-ink whitespace-nowrap">
              {currentCity.windDirection}
            </span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            {currentCity.windSpeedKmh < 5
              ? 'Calm wind speeds impede pollutant dispersion'
              : 'Moderate airflow assisting natural air renewal'}
          </span>
        </div>

        {/* Card 6: Atmospheric Inversion & Boundary with Quiet Line Badge */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Atmospheric Boundary
            </span>
            {currentCity.currentAQI > 200 ? (
              <span className="inline-flex items-center gap-1 rounded bg-terracotta-50 border border-terracotta-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-terracotta-700 whitespace-nowrap">
                <ArrowDownToLine className="h-3 w-3 shrink-0" /> Cold Air Trap Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded bg-sage-50 border border-sage-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-sage-700 whitespace-nowrap">
                <ArrowUpFromLine className="h-3 w-3 shrink-0" /> Clear Airflow Active
              </span>
            )}
          </div>
          <div
            className={`my-2 flex items-center gap-2 text-xs font-bold leading-snug ${
              currentCity.currentAQI > 200 ? 'text-terracotta-700' : 'text-sage-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="break-words">{currentCity.inversionStatus}</span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            {currentCity.currentAQI > 200
              ? 'Cold air trapping surface smoke & dust below 250m'
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

          {/* Quiet Status Badges in Diurnal Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-md border border-sage-300 dark:border-sage-800 bg-sage-50 dark:bg-sage-950/80 px-2.5 py-1 text-sage-800 dark:text-sage-200 font-medium">
              <Sun className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
              <span>Safe Ventilation ({currentCity.safeVentilationWindows})</span>
            </div>

            {currentCity.currentAQI > 200 ? (
              <div className="flex items-center gap-1.5 rounded-md border border-terracotta-200 dark:border-terracotta-800 bg-terracotta-50 dark:bg-terracotta-950/80 px-2.5 py-1 text-terracotta-800 dark:text-terracotta-200 font-medium">
                <CloudFog className="h-3.5 w-3.5 text-terracotta-600 dark:text-terracotta-400 shrink-0" />
                <span>Cold Trap Window</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-ink-muted dark:text-stone-300 font-medium">
                <Activity className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                <span>Natural Airflow Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Color Swatch Key: Explains all 24 hours at a glance */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-[11px] font-mono text-ink-muted dark:text-stone-300 border-t border-stone-200/80 dark:border-stone-800 pt-2 mb-2">
          <span className="font-semibold text-ink dark:text-stone-100">Curve Profile:</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? '#3DA887' : '#236B56' }} />
            <span>Safe Window</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? '#F27A55' : '#C4512C' }} />
            <span>Severe Trap</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? '#FBBF24' : '#D97706' }} />
            <span>High Inversion</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? '#94A3B8' : '#64748B' }} />
            <span>Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-2xs shrink-0" style={{ backgroundColor: isDarkMode ? '#2DD4BF' : '#0D9488' }} />
            <span>Clean Baseline</span>
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
          <div className="mt-3.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 p-3 sm:p-3.5 shadow-xs">
            <div className="border-b border-stone-200/80 dark:border-stone-700 pb-2.5 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
              {/* Row 1 on mobile: Time + Condition Badge */}
              <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                <span className="font-mono text-base font-bold text-ink dark:text-stone-100">
                  {activePoint.timeLabel}
                </span>

                {/* Mobile condition badge */}
                <div className="sm:hidden">
                  {activePoint.isSafeVentilationWindow ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-sage-100 text-sage-800 border border-sage-300 dark:bg-sage-950/80 dark:text-sage-200 dark:border-sage-700">
                      <Sun className="h-3 w-3 shrink-0" />
                      <span>Safe Ventilation</span>
                    </span>
                  ) : activePoint.inversionRisk === 'Low' ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      <span>Clean Air</span>
                    </span>
                  ) : activePoint.inversionRisk === 'Moderate' ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800">
                      <Activity className="h-3 w-3 shrink-0" />
                      <span>Moderate</span>
                    </span>
                  ) : activePoint.inversionRisk === 'High' ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800">
                      <CloudFog className="h-3 w-3 shrink-0" />
                      <span>High Inversion</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-terracotta-50 text-terracotta-800 border border-terracotta-200 dark:bg-terracotta-950/60 dark:text-terracotta-200 dark:border-terracotta-800">
                      <Lock className="h-3 w-3 shrink-0" />
                      <span>Severe Smog Trap</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2 on mobile: Metrics + Desktop Badge + Hint */}
              <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:inline text-stone-300 dark:text-stone-600">·</span>
                  <span className="font-semibold text-ink dark:text-stone-200">
                    PM2.5: {activePoint.pm25} µg/m³
                  </span>
                  <span className="text-ink-muted dark:text-stone-400">
                    (AQI ~{activePoint.aqi})
                  </span>
                </div>

                {/* Desktop-only condition badge */}
                <div className="hidden sm:inline-flex">
                  {activePoint.isSafeVentilationWindow ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-sage-100 text-sage-800 border border-sage-300 dark:bg-sage-950/80 dark:text-sage-200 dark:border-sage-700">
                      <Sun className="h-3 w-3 shrink-0" />
                      <span>Safe Ventilation Window</span>
                    </span>
                  ) : activePoint.inversionRisk === 'Low' ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      <span>Low Trapping · Clean Air</span>
                    </span>
                  ) : activePoint.inversionRisk === 'Moderate' ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800">
                      <Activity className="h-3 w-3 shrink-0" />
                      <span>Inversion: Moderate</span>
                    </span>
                  ) : activePoint.inversionRisk === 'High' ? (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800">
                      <CloudFog className="h-3 w-3 shrink-0" />
                      <span>Inversion: High Trapping</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-terracotta-50 text-terracotta-800 border border-terracotta-200 dark:bg-terracotta-950/60 dark:text-terracotta-200 dark:border-terracotta-800">
                      <Lock className="h-3 w-3 shrink-0" />
                      <span>Inversion: Severe Smog Trap</span>
                    </span>
                  )}
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
        </div>
      </div>
    </div>
  );
};
