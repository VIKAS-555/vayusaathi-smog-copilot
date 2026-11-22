'use client';

import React from 'react';
import Link from 'next/link';
import { useBreathLine } from '@/context/BreathLineContext';
import { Masthead } from '@/components/Masthead';
import { SmogContextBar } from '@/components/SmogContextBar';
import { CigaretteEquivalenceCard } from '@/components/CigaretteEquivalenceCard';
import { MetroCitiesGrid } from '@/components/MetroCitiesGrid';
import { HistoricAirQualityGraph } from '@/components/HistoricAirQualityGraph';
import { AirPollutantsForecastSection } from '@/components/AirPollutantsForecastSection';
import { HouseholdProfiler } from '@/components/HouseholdProfiler';
import { ImpactScorecard } from '@/components/ImpactScorecard';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function Home() {
  const {
    currentCity,
    displayCities,
    selectCity,
    customCityUpdate,
    fetchLiveStation,
    resetToLiveStation,
    isFetchingLive,
    isLocationMatched,
    matchedCityId,
    profile,
    updateProfile,
    adoptedActionIds,
    impact,
    plan,
    isDarkMode,
    openOverridesDrawer,
    openMathDrawer,
  } = useBreathLine();

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-[#121615] flex flex-col font-sans overflow-x-hidden text-ink dark:text-stone-100 transition-colors">
      {/* Top Masthead */}
      <Masthead activeRoute="/" />

      {/* Main Workstation Container */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 1. Full-Width Active Station Hero Card */}
        <SmogContextBar
          currentCity={currentCity}
          onSelectCity={selectCity}
          onCustomUpdate={customCityUpdate}
          onRefreshLive={() => fetchLiveStation(currentCity)}
          onOpenOverrides={openOverridesDrawer}
          isFetchingLive={isFetchingLive}
          isDarkMode={isDarkMode}
          isLocationMatched={isLocationMatched}
        />

        {/* 2. Animated Cigarette Equivalence Card (Full Width for Above-The-Fold Punch) */}
        <CigaretteEquivalenceCard
          currentCity={currentCity}
          impact={impact}
          adoptedActionCount={adoptedActionIds.length}
          isDarkMode={isDarkMode}
        />

        {/* 3. India's Metro Cities Air Quality Index (8 Major Hubs, 100% Synced) */}
        <MetroCitiesGrid
          cities={displayCities}
          currentCityId={currentCity.id}
          onSelectCity={selectCity}
          locationMatchedCityId={isLocationMatched ? matchedCityId : null}
        />

        {/* 4. 24-Hour Diurnal Inversion & Ventilation Curve */}
        <HistoricAirQualityGraph
          currentCity={currentCity}
          isDarkMode={isDarkMode}
        />

        {/* 5. 7-Day Air Quality Forecast & Air Pollutants Breakdown */}
        <AirPollutantsForecastSection
          currentCity={currentCity}
          isDarkMode={isDarkMode}
        />

        {/* 6. Analytical & Profiler Workstation: Symmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Household & Lifestyle Profiler (6 cols on lg) */}
          <aside className="lg:col-span-6 space-y-6">
            <HouseholdProfiler
              profile={profile}
              onChangeProfile={updateProfile}
            />
          </aside>

          {/* RIGHT COLUMN: Live Impact Scorecard + Dedicated Route Launchers (6 cols on lg) */}
          <section className="lg:col-span-6 space-y-6">
            <ImpactScorecard
              impact={impact}
              currentCity={currentCity}
              adoptedCount={adoptedActionIds.length}
              isDarkMode={isDarkMode}
              onOpenExplainer={openMathDrawer}
              societyFamilies={profile.societySizeFamilies}
              onUpdateSocietyFamilies={(count) =>
                updateProfile({ ...profile, societySizeFamilies: count })
              }
            />

            {/* Personalized Action Plan Launch Card -> Dedicated /routine route */}
            <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-sm transition-all hover:border-amber-500/50">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink dark:text-stone-100">
                      Tailored AI Routine &amp; IAQ Action Plan
                    </h3>
                    <p className="text-xs text-ink-muted dark:text-stone-400">
                      Diurnal schedule, indoor air hacks, and society-level mitigation
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-sage-500/30 bg-sage-500/10 px-2.5 py-1 text-xs font-semibold text-sage-600 dark:text-sage-400 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{adoptedActionIds.length} Active</span>
                </span>
              </div>

              <p className="text-xs text-ink-muted dark:text-stone-300 mb-4 leading-relaxed bg-stone-50 dark:bg-[#222B27] p-3 rounded-xl border border-stone-200 dark:border-[#2D3A34]">
                {plan.summaryVerdict}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 rounded-xl bg-sage-50 dark:bg-[#1F2723] border border-sage-200 dark:border-[#28352F]">
                  <span className="text-[11px] text-ink-muted dark:text-stone-400 block mb-0.5">Exposure Drop</span>
                  <strong className="font-mono text-base font-bold text-sage-700 dark:text-sage-300">
                    -{impact.percentExposureDrop}%
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
                  <span className="text-[11px] text-ink-muted dark:text-stone-400 block mb-0.5">Modeled Inhaled Dose</span>
                  <strong className="font-mono text-base font-bold text-ink dark:text-stone-100">
                    {impact.adoptedDailyInhaledDoseUg.toFixed(1)} µg/day
                  </strong>
                </div>
              </div>

              <Link
                href="/routine"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all group"
              >
                <span>Open Full AI Action Plan &amp; Daily Schedule</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* RWA WhatsApp Bulletin Launch Card -> Dedicated /rwa-bulletin route */}
            <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-sm transition-all hover:border-sage-500/50">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-500/15 text-sage-600 dark:text-sage-400 border border-sage-500/25 shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink dark:text-stone-100">
                      RWA &amp; Society Community Clean Air Bulletin
                    </h3>
                    <p className="text-xs text-ink-muted dark:text-stone-400">
                      Ready-to-broadcast community notices &amp; apartment complex multiplier
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] px-2.5 py-1 text-xs font-semibold text-ink-muted dark:text-stone-400 shrink-0">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{profile.societySizeFamilies} Families</span>
                </span>
              </div>

              <p className="text-xs text-ink-muted dark:text-stone-300 mb-4 leading-relaxed bg-stone-50 dark:bg-[#222B27] p-3 rounded-xl border border-stone-200 dark:border-[#2D3A34]">
                Broadcast the day&apos;s clean air or smog protocols to your apartment complex WhatsApp group with collective impact metrics.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 rounded-xl bg-sage-50 dark:bg-[#1F2723] border border-sage-200 dark:border-[#28352F]">
                  <span className="text-[11px] text-ink-muted dark:text-stone-400 block mb-0.5">Society PM2.5 Prevented</span>
                  <strong className="font-mono text-base font-bold text-sage-700 dark:text-sage-300">
                    {impact.communityMonthlyPmPreventedKg} kg/mo
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
                  <span className="text-[11px] text-ink-muted dark:text-stone-400 block mb-0.5">Society CO₂ Saved</span>
                  <strong className="font-mono text-base font-bold text-ink dark:text-stone-100">
                    {impact.communityMonthlyCo2SavedKg} kg/mo
                  </strong>
                </div>
              </div>

              <Link
                href="/rwa-bulletin"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all group"
              >
                <span>View Full RWA Bulletin &amp; WhatsApp Broadcast</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>
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
