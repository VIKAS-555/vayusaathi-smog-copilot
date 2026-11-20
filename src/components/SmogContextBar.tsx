import React, { useState } from 'react';
import { CitySmogContext } from '../types';
import { CITY_PRESETS } from '../data/cityPresets';
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
}

export const SmogContextBar: React.FC<SmogContextBarProps> = ({
  currentCity,
  onSelectCity,
  onCustomUpdate,
  onRefreshLive,
  isFetchingLive = false,
}) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);

  // Maximum PM2.5 in diurnal curve for relative bar heights
  const maxPm25 = Math.max(...currentCity.diurnalCurve.map(p => p.pm25), 350);

  const hoveredPoint = hoveredHour !== null 
    ? currentCity.diurnalCurve.find(p => p.hour === hoveredHour) 
    : null;

  return (
    <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-xs">
      {/* City Presets & Live Telemetry Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Station:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CITY_PRESETS.map((preset) => {
              const isActive = preset.id === currentCity.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectCity(preset)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-ink text-white shadow-xs'
                      : 'bg-stone-100 text-ink-muted hover:bg-stone-200 hover:text-ink'
                  }`}
                >
                  {preset.name.split(' (')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Source Badge & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          {currentCity.dataSource === 'live' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-300 bg-sage-50 px-2.5 py-0.5 text-[11px] font-medium text-sage-800 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-600 animate-pulse shrink-0" />
              <span>Live Station Feed</span>
              <span className="font-mono text-ink-muted font-normal">· {currentCity.lastUpdatedText || 'Live'}</span>
            </span>
          ) : currentCity.dataSource === 'manual' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" />
              <span>Manual Overrides Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-muted shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400 shrink-0" />
              <span>Station Baseline Snapshot</span>
            </span>
          )}

          {/* Live Sync Button */}
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isFetchingLive}
              className="flex items-center gap-1 rounded border border-stone-300 bg-stone-50 px-2 py-1 text-[11px] font-medium text-ink hover:bg-stone-100 disabled:opacity-50 transition-colors shadow-2xs"
              title="Poll live WMO / CPCB satellite & station telemetry"
            >
              <RefreshCw className={`h-3 w-3 text-ink-muted ${isFetchingLive ? 'animate-spin text-ink' : ''}`} />
              <span>{isFetchingLive ? 'Syncing…' : 'Sync Live'}</span>
            </button>
          )}

          <button
            onClick={() => setShowCustomInputs(!showCustomInputs)}
            className="flex items-center gap-1 rounded border border-stone-300 bg-stone-50 px-2 py-1 text-[11px] font-medium text-ink-muted hover:text-ink hover:bg-stone-100 transition-colors"
          >
            <Sliders className="h-3 w-3" />
            <span>{showCustomInputs ? 'Hide Overrides' : 'Manual Overrides'}</span>
          </button>
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
              className="w-full accent-ink"
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
              className="w-full accent-ink"
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
              className="w-full accent-ink"
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
      <div className="mt-5 rounded border border-stone-200 bg-stone-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <span>24-Hour Diurnal Inversion & Ventilation Curve</span>
              <span className="font-mono text-xs font-normal text-ink-muted">· Hourly PM2.5 Trapping Profile</span>
            </h3>
            <p className="text-xs text-ink-muted">
              {currentCity.currentAQI > 200
                ? 'Cold surface air traps pollutants early morning and late night. Midday solar heating triggers convection and temporary dilution.'
                : 'Steady convective mixing and airflow maintain healthy dispersion throughout daytime hours.'}
            </p>
          </div>

          {/* Quiet Status Badges in Diurnal Legend */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 rounded border border-sage-200 bg-sage-50/90 px-2.5 py-1 text-sage-800 font-medium">
              <Sun className="h-3.5 w-3.5 text-sage-700 shrink-0" />
              <span>Safe Ventilation ({currentCity.safeVentilationWindows})</span>
            </div>

            {currentCity.currentAQI > 200 ? (
              <div className="flex items-center gap-1.5 rounded border border-terracotta-200 bg-terracotta-50/90 px-2.5 py-1 text-terracotta-800 font-medium">
                <CloudFog className="h-3.5 w-3.5 text-terracotta-700 shrink-0" />
                <span>Inversion Boundary Peak</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded border border-stone-200 bg-stone-100 px-2.5 py-1 text-ink-muted font-medium">
                <Activity className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                <span>Normal Convective Mixing</span>
              </div>
            )}
          </div>
        </div>

        {/* Diurnal Bar Visualization */}
        <div className="pt-2 pb-1">
          <div className="flex items-end gap-1 h-32 w-full">
            {currentCity.diurnalCurve.map((point) => {
              const heightPercent = Math.max(12, Math.round((point.pm25 / maxPm25) * 100));
              const isHovered = hoveredHour === point.hour;

              let barBg = 'bg-stone-300';
              if (point.isSafeVentilationWindow) {
                barBg = isHovered ? 'bg-sage-700' : 'bg-sage-600';
              } else if (point.inversionRisk === 'Severe') {
                barBg = isHovered ? 'bg-terracotta-700' : 'bg-terracotta-500';
              } else if (point.inversionRisk === 'High') {
                barBg = isHovered ? 'bg-terracotta-600' : 'bg-terracotta-400';
              }

              return (
                <div
                  key={point.hour}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  onMouseEnter={() => setHoveredHour(point.hour)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t transition-all duration-150 ${barBg} ${
                      isHovered ? 'ring-2 ring-ink ring-offset-1 scale-y-105' : ''
                    }`}
                  />
                  <span className="mt-1.5 text-[9px] font-mono text-ink-muted">
                    {point.hour % 3 === 0 ? point.timeLabel.split(':')[0] : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic Hover Tooltip / Detail Callout with Crisp Line Icons */}
          <div className="mt-3 min-h-[38px] rounded border border-stone-200 bg-white px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
            {hoveredPoint ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-ink text-sm">
                    {hoveredPoint.timeLabel}
                  </span>
                  <span className="font-mono text-ink font-semibold">
                    PM2.5: {hoveredPoint.pm25} µg/m³
                  </span>
                  <span className="font-mono text-ink-muted">
                    (AQI ~{hoveredPoint.aqi})
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase flex items-center gap-1 ${
                      hoveredPoint.isSafeVentilationWindow
                        ? 'bg-sage-100 text-sage-800'
                        : 'bg-terracotta-100 text-terracotta-800'
                    }`}
                  >
                    {hoveredPoint.isSafeVentilationWindow ? (
                      <>
                        <Sun className="h-3 w-3" />
                        <span>Safe Ventilation</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>Inversion: {hoveredPoint.inversionRisk}</span>
                      </>
                    )}
                  </span>
                </div>
                {hoveredPoint.notes && (
                  <span className="text-xs text-ink-muted flex items-center gap-1">
                    <Activity className="h-3 w-3 text-ink-muted shrink-0" />
                    <span>{hoveredPoint.notes}</span>
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between w-full text-xs text-ink-muted gap-2">
                <span className="leading-relaxed">
                  Hover over any hourly bar to inspect modeled micro-particulate concentration and inversion risk.
                </span>
                <span className="font-semibold text-sage-700 flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Sun className="h-3.5 w-3.5 text-sage-600" />
                  <span>Recommended Daily Ventilation: {currentCity.safeVentilationWindows}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
