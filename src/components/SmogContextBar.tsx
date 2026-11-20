import React, { useState } from 'react';
import { CitySmogContext } from '../types';
import { CITY_PRESETS } from '../data/cityPresets';
import { Wind, Thermometer, Droplets, ShieldAlert, Sliders } from 'lucide-react';

interface SmogContextBarProps {
  currentCity: CitySmogContext;
  onSelectCity: (city: CitySmogContext) => void;
  onCustomUpdate?: (updated: Partial<CitySmogContext>) => void;
}

export const SmogContextBar: React.FC<SmogContextBarProps> = ({
  currentCity,
  onSelectCity,
  onCustomUpdate,
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
      {/* City Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Regional Smog Station:
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

        <button
          onClick={() => setShowCustomInputs(!showCustomInputs)}
          className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink font-medium"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>{showCustomInputs ? 'Hide Custom Inputs' : 'Manual Overrides'}</span>
        </button>
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

      {/* Primary Meteorological Grid: Spacious 3x2 Layout (No Narrow Squeezing) */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {/* Card 1: CPCB AQI */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Index (CPCB AQI)
            </span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                currentCity.currentAQI >= 400
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : currentCity.currentAQI >= 300
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : currentCity.currentAQI >= 200
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {currentCity.aqiCategory}
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
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            Dominant pollutant: <strong className="text-ink font-semibold">{currentCity.dominantPollutant}</strong>
          </span>
        </div>

        {/* Card 2: PM2.5 Fine Ambient Particles */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            PM2.5 Ambient Concentration
          </span>
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
              ? 'Within WHO annual safe guideline'
              : `${(currentCity.pm25 / 15).toFixed(1)}x above WHO 24h limit (15 µg/m³)`}
          </span>
        </div>

        {/* Card 3: PM10 Coarse Particulates */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            PM10 Coarse Dust
          </span>
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
          <div className="my-2 flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-base font-bold text-ink">
              <Thermometer className="h-4 w-4 text-ink-muted" />
              <span>{currentCity.temperatureC}°C</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="flex items-center gap-1.5 font-mono text-base font-bold text-ink">
              <Droplets className="h-4 w-4 text-ink-muted" />
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
            <span className="text-xl font-bold text-ink tabular-nums">
              {currentCity.windSpeedKmh} km/h
            </span>
            <span className="rounded bg-stone-200 px-2 py-0.5 text-[11px] font-sans font-semibold text-ink">
              {currentCity.windDirection}
            </span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            {currentCity.windSpeedKmh < 5
              ? 'Calm wind speeds impede pollutant dispersion'
              : 'Moderate airflow assisting natural air renewal'}
          </span>
        </div>

        {/* Card 6: Atmospheric Inversion & Boundary */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/80 p-3.5 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Atmospheric Boundary Layer
          </span>
          <div
            className={`my-2 flex items-center gap-2 text-xs font-bold leading-snug ${
              currentCity.currentAQI > 200 ? 'text-terracotta-700' : 'text-sage-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{currentCity.inversionStatus}</span>
          </div>
          <span className="text-[11px] text-ink-muted border-t border-stone-200/80 pt-1.5">
            {currentCity.currentAQI > 200
              ? 'Thermal ceiling trapping surface emissions (< 250m)'
              : 'Deep boundary layer height · Clear solar convection'}
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

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-sage-600"></span>
              <span className="font-medium text-ink-muted">
                Safe Ventilation ({currentCity.safeVentilationWindows})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  currentCity.currentAQI > 200 ? 'bg-terracotta-500' : 'bg-stone-400'
                }`}
              ></span>
              <span className="font-medium text-ink-muted">
                {currentCity.currentAQI > 200 ? 'Inversion Danger (Seal Windows)' : 'Traffic Peak (Mild Haze)'}
              </span>
            </div>
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

          {/* Dynamic Hover Tooltip / Detail Callout */}
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
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      hoveredPoint.isSafeVentilationWindow
                        ? 'bg-sage-100 text-sage-800'
                        : 'bg-terracotta-100 text-terracotta-800'
                    }`}
                  >
                    {hoveredPoint.isSafeVentilationWindow ? 'Safe Ventilation Window' : `Inversion: ${hoveredPoint.inversionRisk}`}
                  </span>
                </div>
                {hoveredPoint.notes && (
                  <span className="text-xs text-ink-muted italic">
                    ℹ️ {hoveredPoint.notes}
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between w-full text-xs text-ink-muted">
                <span>
                  Hover over any hourly bar to inspect modeled micro-particulate concentration and inversion risk.
                </span>
                <span className="font-semibold text-sage-700">
                  Recommended Daily Ventilation: {currentCity.safeVentilationWindows}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
