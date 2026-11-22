'use client';

import React from 'react';
import Link from 'next/link';
import { useBreathLine } from '@/context/BreathLineContext';
import { Masthead } from '@/components/Masthead';
import { ActionPlanTabs } from '@/components/ActionPlanTabs';
import { 
  ArrowLeft, 
  Sparkles, 
  Printer, 
  RefreshCw, 
  Shield, 
  CheckCircle2, 
  MapPin, 
  Users, 
  ArrowRight,
  Home as HomeIcon
} from 'lucide-react';
import { getAQIStyle } from '@/lib/aqiScale';

export default function RoutinePage() {
  const {
    currentCity,
    profile,
    plan,
    isLoadingPlan,
    refreshPlan,
    adoptedActionIds,
    toggleAction,
    impact,
    isDarkMode,
  } = useBreathLine();

  const cityAqiStyle = getAQIStyle(currentCity.currentAQI, isDarkMode, currentCity.aqiCategory);
  const sensitiveMembersCount = profile.members.filter((m) => m.hasRespiratorySensitivity).length;

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-[#121615] flex flex-col font-sans overflow-x-hidden text-ink dark:text-stone-100 transition-colors">
      {/* Top Masthead */}
      <Masthead activeRoute="/routine" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-[#1F2723]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Back to Dashboard</span>
          </Link>

          {/* Active Station Provenance Tag */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#1A221F] shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
              <strong className="text-ink dark:text-stone-200">{currentCity.name}</strong>
              <span
                className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: cityAqiStyle.bg,
                  color: cityAqiStyle.text,
                }}
              >
                {currentCity.currentAQI} AQI
              </span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#1A221F] text-ink-muted dark:text-stone-400 shadow-2xs">
              <Users className="h-3.5 w-3.5" />
              <span>{profile.members.length} Members ({sensitiveMembersCount} Sensitive)</span>
            </span>
          </div>
        </div>

        {/* Page Hero Header Card */}
        <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-7 shadow-sm transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 dark:border-[#2B3833]">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0 shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-ink dark:text-stone-100">
                    GenAI Tailored Routine &amp; IAQ Action Plan
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-sage-500/30 bg-sage-500/10 px-2.5 py-0.5 text-xs font-semibold text-sage-600 dark:text-sage-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{adoptedActionIds.length} Habits Active</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-stone-300 mt-1">
                  Hour-by-hour diurnal ventilation timing, indoor air purification hacks, and low-emission swaps calibrated for <strong className="text-ink dark:text-stone-100">{currentCity.name}</strong>.
                </p>
              </div>
            </div>

            {/* Quick Actions: Print & Recalculate */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] text-xs font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs"
                title="Print this Action Plan"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Plan</span>
              </button>

              <button
                onClick={refreshPlan}
                disabled={isLoadingPlan}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-xs"
                title="Re-run GenAI reasoning with updated household settings"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingPlan ? 'animate-spin' : ''}`} />
                <span>{isLoadingPlan ? 'Updating…' : 'Recalculate AI Plan'}</span>
              </button>
            </div>
          </div>

          {/* Live Exposure Reduction Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5">
            <div className="p-3.5 rounded-2xl bg-sage-50 dark:bg-[#1F2723] border border-sage-200 dark:border-[#28352F]">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-stone-400 block mb-0.5">
                Modeled Exposure Drop
              </span>
              <strong className="font-mono text-xl font-bold text-sage-700 dark:text-sage-300">
                -{impact.percentExposureDrop}%
              </strong>
              <span className="text-[10px] text-ink-muted dark:text-stone-400 block mt-0.5">
                Live across household members
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-stone-400 block mb-0.5">
                Daily Inhaled PM2.5 Dose
              </span>
              <strong className="font-mono text-xl font-bold text-ink dark:text-stone-100">
                {impact.adoptedDailyInhaledDoseUg.toFixed(1)} µg/day
              </strong>
              <span className="text-[10px] text-ink-muted dark:text-stone-400 block mt-0.5">
                vs {impact.baselineDailyInhaledDoseUg.toFixed(1)} µg baseline
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-stone-400 block mb-0.5">
                Passive Cigarettes Avoided
              </span>
              <strong className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                ~{impact.passiveCigaretteEquivalentAvoidedDaily.toFixed(1)} cigs/day
              </strong>
              <span className="text-[10px] text-ink-muted dark:text-stone-400 block mt-0.5">
                Berkeley Earth toxicology equivalence
              </span>
            </div>
          </div>
        </div>

        {/* Action Plan Tabs Engine */}
        <section className="space-y-4">
          <ActionPlanTabs
            routineSchedule={plan.routineSchedule}
            iaqHacks={plan.iaqHacks}
            sustainableActions={plan.sustainableActions}
            communityPointers={plan.communityPointers}
            adoptedActionIds={adoptedActionIds}
            onToggleAction={toggleAction}
            summaryVerdict={plan.summaryVerdict}
          />
        </section>

        {/* Bottom Navigation Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Main Environmental Dashboard</span>
          </Link>

          <Link
            href="/rwa-bulletin"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-sage-600 dark:text-sage-400 hover:text-sage-700"
          >
            <span>View Society RWA Community Bulletin</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-300 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A] py-4 text-center text-xs text-ink-muted dark:text-stone-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>BreathLine</strong> · Winter Air &amp; Routine Guide · Household Exposure Co-Pilot
          </span>
          <span className="font-mono text-[11px]">
            EPA &amp; WHO Inhalation Dose Modeling · Tabular Strict Physics Engine
          </span>
        </div>
      </footer>
    </main>
  );
}
