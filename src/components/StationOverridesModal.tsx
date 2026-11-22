'use client';

import React, { useEffect } from 'react';
import { CitySmogContext } from '../types';
import { X, Sliders, RotateCcw, Check } from 'lucide-react';

interface StationOverridesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CitySmogContext;
  onCustomUpdate: (updated: Partial<CitySmogContext>) => void;
  onResetLive?: () => void;
  isDarkMode?: boolean;
}

export const StationOverridesModal: React.FC<StationOverridesModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onCustomUpdate,
  onResetLive,
  isDarkMode = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div 
        className="relative z-10 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] shadow-2xl overflow-hidden transition-all text-ink dark:text-stone-100 p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overrides-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#2B3833]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 id="overrides-title" className="text-base font-bold text-ink dark:text-stone-100">
                Manual Telemetry Overrides
              </h3>
              <p className="text-xs text-ink-muted dark:text-stone-400 mt-0.5">
                Adjust {currentCity.name} metrics for simulation testing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#28332E]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sliders Body */}
        <div className="space-y-4 py-4">
          {/* Custom AQI */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-ink-muted dark:text-stone-300">Air Quality Index (AQI)</span>
              <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm">{currentCity.currentAQI}</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              value={currentCity.currentAQI}
              onChange={(e) => onCustomUpdate({ currentAQI: Number(e.target.value) })}
              className="editorial-slider w-full mt-1"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.currentAQI - 20) / (500 - 20)) * 100))}%` } as React.CSSProperties}
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
              <span>20 (Good)</span>
              <span>200 (Poor)</span>
              <span>500 (Hazardous)</span>
            </div>
          </div>

          {/* PM2.5 */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-ink-muted dark:text-stone-300">PM2.5 Ambient Concentration</span>
              <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm">{currentCity.pm25} µg/m³</span>
            </div>
            <input
              type="range"
              min="10"
              max="450"
              value={currentCity.pm25}
              onChange={(e) => onCustomUpdate({ pm25: Number(e.target.value) })}
              className="editorial-slider w-full mt-1"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.pm25 - 10) / (450 - 10)) * 100))}%` } as React.CSSProperties}
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
              <span>10 µg/m³</span>
              <span>120 µg/m³</span>
              <span>450 µg/m³</span>
            </div>
          </div>

          {/* PM10 */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-ink-muted dark:text-stone-300">PM10 Coarse Particulates</span>
              <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm">{currentCity.pm10} µg/m³</span>
            </div>
            <input
              type="range"
              min="10"
              max="600"
              value={currentCity.pm10}
              onChange={(e) => onCustomUpdate({ pm10: Number(e.target.value) })}
              className="editorial-slider w-full mt-1"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.pm10 - 10) / (600 - 10)) * 100))}%` } as React.CSSProperties}
            />
          </div>

          {/* Wind Speed */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-ink-muted dark:text-stone-300">Wind Speed &amp; Dispersion</span>
              <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm">{currentCity.windSpeedKmh} km/h</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="0.5"
              value={currentCity.windSpeedKmh}
              onChange={(e) => onCustomUpdate({ windSpeedKmh: Number(e.target.value) })}
              className="editorial-slider w-full mt-1"
              style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((currentCity.windSpeedKmh - 1) / (35 - 1)) * 100))}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-[#2B3833]">
          {onResetLive && (
            <button
              onClick={() => {
                onResetLive();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2D3A34] text-xs font-medium text-ink-muted dark:text-stone-300 hover:text-ink hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Live Feed</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity ml-auto shadow-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Apply Overrides</span>
          </button>
        </div>
      </div>
    </div>
  );
};
