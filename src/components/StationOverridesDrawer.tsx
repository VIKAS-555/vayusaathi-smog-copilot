'use client';

import React, { useEffect } from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles, Radio } from 'lucide-react';
import { useBreathLine } from '@/context/BreathLineContext';

export const StationOverridesDrawer: React.FC = () => {
  const {
    isOverridesDrawerOpen,
    closeOverridesDrawer,
    currentCity,
    customCityUpdate,
    resetToLiveStation,
    isFetchingLive,
  } = useBreathLine();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOverridesDrawerOpen) {
        closeOverridesDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverridesDrawerOpen, closeOverridesDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOverridesDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOverridesDrawerOpen]);

  if (!isOverridesDrawerOpen) return null;

  const isManual = currentCity.dataSource === 'manual';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" aria-labelledby="overrides-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={closeOverridesDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#1A221F] border-l border-stone-200 dark:border-[#2B3833] shadow-2xl flex flex-col text-ink dark:text-stone-100 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 id="overrides-drawer-title" className="text-base font-bold text-ink dark:text-stone-100">
                  Manual Telemetry Overrides
                </h3>
                <p className="text-xs text-ink-muted dark:text-stone-400">
                  Adjust {currentCity.name} parameters for scenario stress-testing
                </p>
              </div>
            </div>

            <button
              onClick={closeOverridesDrawer}
              className="p-1.5 rounded-lg text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Telemetry Status Strip */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-2.5 bg-stone-100/70 dark:bg-[#1F2723] border-b border-stone-200 dark:border-[#28352F] text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isManual ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-ink-muted dark:text-stone-300">
                Mode: <strong className="text-ink dark:text-stone-100">{isManual ? 'Manual Override Active' : 'Live Feeds / Synced'}</strong>
              </span>
            </div>

            {isManual && (
              <button
                onClick={resetToLiveStation}
                disabled={isFetchingLive}
                className="flex items-center gap-1 text-[11px] font-semibold text-sage-600 dark:text-sage-400 hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Preset/Live</span>
              </button>
            )}
          </div>

          {/* Sliders Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Custom AQI */}
            <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-ink dark:text-stone-200">Air Quality Index (AQI)</span>
                <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm bg-white dark:bg-[#1A221F] px-2 py-0.5 rounded border border-stone-200 dark:border-[#2D3A34]">
                  {currentCity.currentAQI}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                value={currentCity.currentAQI}
                onChange={(e) => customCityUpdate({ currentAQI: Number(e.target.value) })}
                className="editorial-slider w-full mt-2"
                style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.currentAQI - 20) / (500 - 20)) * 100))}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-muted dark:text-stone-400 mt-1">
                <span>20 (Pristine)</span>
                <span>200 (Poor)</span>
                <span>500 (Hazardous)</span>
              </div>
            </div>

            {/* PM2.5 Ambient */}
            <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-ink dark:text-stone-200">PM2.5 Concentration</span>
                <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm bg-white dark:bg-[#1A221F] px-2 py-0.5 rounded border border-stone-200 dark:border-[#2D3A34]">
                  {currentCity.pm25} µg/m³
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                value={currentCity.pm25}
                onChange={(e) => customCityUpdate({ pm25: Number(e.target.value) })}
                className="editorial-slider w-full mt-2"
                style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.pm25 - 10) / (350 - 10)) * 100))}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-muted dark:text-stone-400 mt-1">
                <span>10 µg/m³ (WHO Safe)</span>
                <span>120 µg/m³</span>
                <span>350 µg/m³ (Severe)</span>
              </div>
            </div>

            {/* PM10 Coarse */}
            <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-ink dark:text-stone-200">PM10 Coarse Dust</span>
                <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm bg-white dark:bg-[#1A221F] px-2 py-0.5 rounded border border-stone-200 dark:border-[#2D3A34]">
                  {currentCity.pm10} µg/m³
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                value={currentCity.pm10}
                onChange={(e) => customCityUpdate({ pm10: Number(e.target.value) })}
                className="editorial-slider w-full mt-2"
                style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.pm10 - 20) / (500 - 20)) * 100))}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-muted dark:text-stone-400 mt-1">
                <span>20 µg/m³</span>
                <span>250 µg/m³</span>
                <span>500 µg/m³</span>
              </div>
            </div>

            {/* Wind Speed & Airflow */}
            <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-ink dark:text-stone-200">Wind Speed (Dispersion)</span>
                <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm bg-white dark:bg-[#1A221F] px-2 py-0.5 rounded border border-stone-200 dark:border-[#2D3A34]">
                  {currentCity.windSpeedKmh || 4} km/h
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                value={currentCity.windSpeedKmh || 4}
                onChange={(e) => customCityUpdate({ windSpeedKmh: Number(e.target.value) })}
                className="editorial-slider w-full mt-2"
                style={{ "--slider-pct": `${Math.min(100, Math.max(0, (((currentCity.windSpeedKmh || 4) - 1) / (35 - 1)) * 100))}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-muted dark:text-stone-400 mt-1">
                <span>1 km/h (Calm / Inversion Trap)</span>
                <span>15 km/h (Moderate)</span>
                <span>35 km/h (High Dispersion)</span>
              </div>
            </div>

            {/* Quick Reset Callout */}
            <div className="p-4 rounded-2xl bg-sage-50/70 dark:bg-[#1F2723] border border-sage-200/60 dark:border-[#28352F] text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-ink dark:text-stone-200">Revert to Live Feed</span>
                <button
                  onClick={resetToLiveStation}
                  disabled={isFetchingLive}
                  className="px-3 py-1.5 rounded-lg border border-sage-400/40 bg-white dark:bg-[#222B27] font-semibold text-sage-700 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isFetchingLive ? 'animate-spin' : ''}`} />
                  <span>{isFetchingLive ? 'Syncing…' : 'Reset to Preset / Live'}</span>
                </button>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-stone-400">
                Instantly restore calibrated baseline or live CPCB CAAQMS sensor telemetry.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A] flex items-center justify-between">
            <button
              onClick={resetToLiveStation}
              disabled={isFetchingLive}
              className="text-xs text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-200 flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Values</span>
            </button>

            <button
              onClick={closeOverridesDrawer}
              className="px-5 py-2 rounded-xl bg-ink dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              Done &amp; Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
