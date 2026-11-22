'use client';

import React from 'react';
import Link from 'next/link';
import { BreathLineMark } from './BreathLineMark';
import { ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, FileText, Sun, Moon, Sparkles, MessageSquare, Sliders } from 'lucide-react';
import { getAQIStyle } from '../lib/aqiScale';
import { useBreathLine } from '@/context/BreathLineContext';

interface MastheadProps {
  aqiCategory?: string;
  isHazardous?: boolean;
  currentAQI?: number;
  onRefreshPlan?: () => void;
  isLoading?: boolean;
  onOpenExplainer?: () => void;
  onOpenRwaModal?: () => void;
  onOpenPlan?: () => void;
  onOpenOverrides?: () => void;
  adoptedCount?: number;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  activeRoute?: '/' | '/routine' | '/rwa-bulletin';
}

export const Masthead: React.FC<MastheadProps> = (props) => {
  // Context fallbacks
  let context: ReturnType<typeof useBreathLine> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    context = useBreathLine();
  } catch {
    // Graceful fallback if used outside provider
  }

  const effectiveAqiCategory = props.aqiCategory ?? context?.currentCity.aqiCategory ?? 'Moderate';
  const effectiveCurrentAQI = props.currentAQI ?? context?.currentCity.currentAQI ?? 80;
  const isHazardous = props.isHazardous ?? effectiveCurrentAQI >= 400;
  const isDark = props.isDarkMode ?? context?.isDarkMode ?? false;
  const isLoading = props.isLoading ?? context?.isLoadingPlan ?? false;
  const adoptedCount = props.adoptedCount ?? context?.adoptedActionIds.length ?? 0;

  const aqiStyle = getAQIStyle(effectiveCurrentAQI, isDark, effectiveAqiCategory);

  const StatusIcon = 
    aqiStyle.tierKey === 'good' || aqiStyle.tierKey === 'moderate'
      ? CheckCircle2
      : aqiStyle.tierKey === 'poor' || aqiStyle.tierKey === 'unhealthy'
      ? AlertTriangle
      : ShieldAlert;

  const handleRefresh = props.onRefreshPlan || context?.refreshPlan || (() => {});
  const handleToggleTheme = props.onToggleTheme || context?.toggleTheme;
  const handleOpenMath = props.onOpenExplainer || context?.openMathDrawer || (() => {});
  const handleOpenOverrides = props.onOpenOverrides || context?.openOverridesDrawer;

  return (
    <header className="border-b border-stone-300 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A] px-3.5 py-3 sm:px-6 lg:px-8 sticky top-0 z-40 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Brand & Editorial Title + Mobile Quick Status Row */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="flex h-9 w-12 sm:h-10 sm:w-14 items-center justify-center rounded border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#1A221F] shadow-xs p-1 sm:p-1.5 overflow-hidden shrink-0 group-hover:border-sage-500/50 transition-colors">
              <BreathLineMark className="h-full w-full text-ink dark:text-stone-100 transition-colors duration-200" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-stone-100 font-sans flex items-center leading-none">
              <span>Breath</span>
              <span className="font-light">Line</span>
            </h1>
          </Link>

          {/* Quick Badges visible on mobile top-right */}
          <div className="flex items-center gap-1.5 sm:hidden">
            {handleToggleTheme && (
              <button
                onClick={handleToggleTheme}
                className="flex items-center justify-center rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-2 text-ink dark:text-stone-200 hover:bg-stone-100 transition-colors shadow-xs"
                title={isDark ? 'Switch to Warm Stone Newsprint' : 'Switch to Charcoal Night Mode'}
                aria-label="Toggle Night/Day Mode"
              >
                {isDark ? (
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
              <span>{effectiveAqiCategory}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Responsive Toolbar */}
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
            <span>Episode: {effectiveAqiCategory}</span>
          </div>

          {/* Action buttons grid */}
          <div className="grid grid-cols-2 xs:grid-cols-4 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            {/* Dedicated /routine link */}
            {props.onOpenPlan ? (
              <button
                onClick={props.onOpenPlan}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded border ${
                  props.activeRoute === '/routine'
                    ? 'border-amber-600 bg-amber-500/25 text-amber-800 dark:text-amber-200'
                    : 'border-amber-600/40 bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                } px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-semibold transition-colors shadow-2xs min-h-[38px] text-center`}
                title="View Tailored AI Action Plan & Daily Routine"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
                <span className="truncate">AI Routine {adoptedCount > 0 ? `(${adoptedCount})` : ''}</span>
              </button>
            ) : (
              <Link
                href="/routine"
                className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded border ${
                  props.activeRoute === '/routine'
                    ? 'border-amber-600 bg-amber-500/25 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500'
                    : 'border-amber-600/40 bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                } px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-semibold transition-colors shadow-2xs min-h-[38px] text-center`}
                title="View Tailored AI Action Plan & Daily Routine"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
                <span className="truncate">AI Routine {adoptedCount > 0 ? `(${adoptedCount})` : ''}</span>
              </Link>
            )}

            {/* Dedicated /rwa-bulletin link */}
            {props.onOpenRwaModal ? (
              <button
                onClick={props.onOpenRwaModal}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded border ${
                  props.activeRoute === '/rwa-bulletin'
                    ? 'border-sage-700 bg-sage-700 text-white'
                    : 'border-sage-600 bg-sage-600 hover:bg-sage-700 text-white'
                } px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors shadow-xs min-h-[38px] text-center`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
                <span className="truncate">RWA Alert</span>
              </button>
            ) : (
              <Link
                href="/rwa-bulletin"
                className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded border ${
                  props.activeRoute === '/rwa-bulletin'
                    ? 'border-sage-700 bg-sage-700 text-white ring-1 ring-sage-400'
                    : 'border-sage-600 bg-sage-600 hover:bg-sage-700 text-white'
                } px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors shadow-xs min-h-[38px] text-center`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
                <span className="truncate">RWA Alert</span>
              </Link>
            )}

            {/* Math Engine Drawer Trigger */}
            <button
              onClick={handleOpenMath}
              className="flex items-center justify-center gap-1 sm:gap-1.5 rounded border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs min-h-[38px] text-center"
              title="Open Deterministic Environmental Math Drawer"
            >
              <FileText className="h-3.5 w-3.5 text-ink-muted shrink-0 hidden xs:inline" />
              <span className="truncate">Math Engine</span>
            </button>

            {/* Overrides Drawer Trigger (Desktop/Responsive) */}
            {handleOpenOverrides && (
              <button
                onClick={handleOpenOverrides}
                className="hidden md:flex items-center justify-center gap-1 sm:gap-1.5 rounded border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs min-h-[38px] text-center"
                title="Open Manual Telemetry Overrides Drawer"
              >
                <Sliders className="h-3.5 w-3.5 text-ink-muted shrink-0 hidden xs:inline" />
                <span className="truncate">Overrides</span>
              </button>
            )}

            {/* Re-run GenAI Update */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center justify-center gap-1 sm:gap-1.5 rounded border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] disabled:opacity-50 transition-colors min-h-[38px] text-center"
              title="Re-run GenAI reasoning with updated household settings"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-ink-muted shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="truncate">{isLoading ? 'Updating…' : 'Update Plan'}</span>
            </button>
          </div>

          {/* Desktop-only Editorial Day/Night Mode Toggle */}
          {handleToggleTheme && (
            <button
              onClick={handleToggleTheme}
              className="hidden sm:flex items-center gap-1.5 rounded border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] px-3 py-1.5 text-xs font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-xs"
              title={isDark ? 'Switch to Warm Stone Newsprint' : 'Switch to Charcoal Night Mode'}
              aria-label="Toggle Night/Day Mode"
            >
              {isDark ? (
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
