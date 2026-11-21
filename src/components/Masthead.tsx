import React from 'react';
import { BreathLineMark } from './BreathLineMark';
import { ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, FileText, Sun, Moon } from 'lucide-react';
import { getAQIStyle } from '../lib/aqiScale';

interface MastheadProps {
  aqiCategory: string;
  isHazardous?: boolean;
  currentAQI?: number;
  onRefreshPlan: () => void;
  isLoading: boolean;
  onOpenExplainer: () => void;
  onOpenRwaModal: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  aqiCategory,
  isHazardous = false,
  currentAQI,
  onRefreshPlan,
  isLoading,
  onOpenExplainer,
  onOpenRwaModal,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const effectiveAQI = currentAQI ?? (isHazardous ? 450 : 80);
  const aqiStyle = getAQIStyle(effectiveAQI, isDarkMode, aqiCategory);

  const StatusIcon = 
    aqiStyle.tierKey === 'good' || aqiStyle.tierKey === 'moderate'
      ? CheckCircle2
      : aqiStyle.tierKey === 'poor' || aqiStyle.tierKey === 'unhealthy'
      ? AlertTriangle
      : ShieldAlert;

  return (
    <header className="border-b border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 px-3.5 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Brand & Editorial Title + Mobile Quick Status Row */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-12 sm:h-11 sm:w-14 items-center justify-center rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-xs p-1 sm:p-1.5 overflow-hidden shrink-0">
              <BreathLineMark className="h-full w-full text-ink dark:text-stone-100 transition-colors duration-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-ink dark:text-stone-100 font-sans flex items-center">
                  <span>Breath</span>
                  <span className="font-light">Line</span>
                </h1>
                <span className="rounded bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-ink-muted dark:text-stone-400">
                  v1.0 Civic Pilot
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-ink-muted dark:text-stone-400 font-medium">
                Winter Air &amp; Routine Guide · Household Co-Pilot
              </p>
            </div>
          </div>

          {/* Quick Badges visible on mobile top-right */}
          <div className="flex items-center gap-1.5 sm:hidden">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="flex items-center justify-center rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-2 text-ink dark:text-stone-200 hover:bg-stone-100 transition-colors shadow-xs"
                title={isDarkMode ? 'Switch to Warm Stone Newsprint' : 'Switch to Charcoal Night Mode'}
                aria-label="Toggle Night/Day Mode"
              >
                {isDarkMode ? (
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-ink-muted" />
                )}
              </button>
            )}

            <div
              className="flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap shadow-2xs transition-colors"
              style={{
                backgroundColor: aqiStyle.bg,
                borderColor: aqiStyle.border,
                color: aqiStyle.text,
              }}
            >
              <StatusIcon className="h-3 w-3 shrink-0" />
              <span>{aqiCategory}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Responsive Toolbar (3-column grid on mobile, inline flex on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Desktop-only Episode status badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-2xs transition-colors"
            style={{
              backgroundColor: aqiStyle.bg,
              borderColor: aqiStyle.border,
              color: aqiStyle.text,
            }}
          >
            <StatusIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Episode: {aqiCategory}</span>
          </div>

          {/* Action buttons grid */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenExplainer}
              className="flex items-center justify-center gap-1 sm:gap-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-ink dark:text-stone-200 hover:bg-stone-100 transition-colors shadow-2xs min-h-[38px] text-center"
            >
              <FileText className="h-3.5 w-3.5 text-ink-muted shrink-0 hidden xs:inline" />
              <span className="truncate">Math Engine</span>
            </button>

            <button
              onClick={onOpenRwaModal}
              className="flex items-center justify-center gap-1 sm:gap-1.5 rounded border border-sage-600 bg-sage-600 px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-white hover:bg-sage-700 transition-colors shadow-xs min-h-[38px] text-center"
            >
              <span className="truncate">WhatsApp Alert</span>
            </button>

            <button
              onClick={onRefreshPlan}
              disabled={isLoading}
              className="flex items-center justify-center gap-1 sm:gap-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-ink dark:text-stone-200 hover:bg-stone-100 disabled:opacity-50 transition-colors min-h-[38px] text-center"
              title="Re-run GenAI reasoning with updated household settings"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-ink-muted shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="truncate">{isLoading ? 'Updating…' : 'Update Plan'}</span>
            </button>
          </div>

          {/* Desktop-only Editorial Day/Night Mode Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="hidden sm:flex items-center gap-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5 text-xs font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 transition-colors shadow-xs"
              title={isDarkMode ? 'Switch to Warm Stone Newsprint' : 'Switch to Charcoal Night Mode'}
              aria-label="Toggle Night/Day Mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span>Day Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-ink-muted" />
                  <span>Night Mode</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
