'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CITY_PRESETS } from '@/data/cityPresets';
import { CitySmogContext, HouseholdProfile, GenAIPlanResponse } from '@/types';
import { calculateInhaledDose } from '@/lib/environmentMath';
import { generateDeterministicPlan } from '@/lib/geminiService';
import { fetchLiveCityData } from '@/lib/liveAirQualityService';
import { Masthead } from '@/components/Masthead';
import { SmogContextBar } from '@/components/SmogContextBar';
import { HouseholdProfiler } from '@/components/HouseholdProfiler';
import { ImpactScorecard } from '@/components/ImpactScorecard';
import { CigaretteEquivalenceCard } from '@/components/CigaretteEquivalenceCard';
import { ActionPlanTabs } from '@/components/ActionPlanTabs';
import { RwaBulletinModal } from '@/components/RwaBulletinModal';
import { ExplanationModal } from '@/components/ExplanationModal';

export default function Home() {
  // 1. Initial State Setup
  const [currentCity, setCurrentCity] = useState<CitySmogContext>(CITY_PRESETS[0]); // Delhi NCR

  const [profile, setProfile] = useState<HouseholdProfile>({
    members: [
      { id: 'm-1', role: 'Adult', hasRespiratorySensitivity: false, hoursOutdoorsPerDay: 3 },
      { id: 'm-2', role: 'Child', hasRespiratorySensitivity: false, hoursOutdoorsPerDay: 2 },
      { id: 'm-3', role: 'Senior', hasRespiratorySensitivity: true, hoursOutdoorsPerDay: 1 },
    ],
    homeType: 'high-rise-apartment',
    purifierStatus: 'single-bedroom',
    hasWindowWeatherstripping: false,
    commuteMode: 'solo-petrol-car',
    dailyCommuteKm: 24,
    outdoorExerciseTime: 'Early Morning (05:00 - 08:00)',
    cookingFuel: 'LPG / Induction',
    societySizeFamilies: 50,
  });

  // 2. Initial Plan Generation (instant zero-latency client bootstrap)
  const initialPlan = useMemo(
    () => generateDeterministicPlan(profile, currentCity),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [plan, setPlan] = useState<GenAIPlanResponse>(initialPlan);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);

  // 3. Adopted Action IDs (User toggles to recalculate impact in real time)
  const [adoptedActionIds, setAdoptedActionIds] = useState<string[]>([
    'iaq-zero-cost-door-seal',
    'iaq-zero-cost-cooking-exhaust',
    'sustainable-waste-zero-burn',
  ]);

  // 4. Modals State
  const [isRwaModalOpen, setIsRwaModalOpen] = useState<boolean>(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);

  // 4b. Dark Mode / Theme State with localStorage & OS sync
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('breathline-theme') || localStorage.getItem('vayusaathi-theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch {
      // Ignore in SSR / private browsing
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        try { localStorage.setItem('breathline-theme', 'dark'); } catch {}
      } else {
        document.documentElement.classList.remove('dark');
        try { localStorage.setItem('breathline-theme', 'light'); } catch {}
      }
      return next;
    });
  };

  // 5. Calculate Deterministic Inhaled Dose & Climate Metrics
  const impact = useMemo(() => {
    return calculateInhaledDose(profile, currentCity, adoptedActionIds);
  }, [profile, currentCity, adoptedActionIds]);

  // 6. Action Toggle Handler
  const handleToggleAction = (actionId: string) => {
    setAdoptedActionIds((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  // 7. Update Plan when City or Profile changes significantly
  const handleRefreshPlan = useCallback(async () => {
    setIsLoadingPlan(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, city: currentCity }),
      });

      if (!response.ok) {
        throw new Error('API response was not ok');
      }

      const newPlan: GenAIPlanResponse = await response.json();
      setPlan(newPlan);
    } catch (err) {
      console.warn('API fetch failed, generating client-side fallback plan:', err);
      setPlan(generateDeterministicPlan(profile, currentCity));
    } finally {
      setIsLoadingPlan(false);
    }
  }, [profile, currentCity]);

  // 8. Live Meteorological Station Feeds
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  const fetchLiveStation = useCallback(async (preset: CitySmogContext) => {
    setIsFetchingLive(true);
    try {
      const liveCity = await fetchLiveCityData(preset);
      setCurrentCity(liveCity);
      setPlan(generateDeterministicPlan(profile, liveCity));
    } catch (err) {
      console.warn('Live station fetch failed, using baseline snapshot:', err);
    } finally {
      setIsFetchingLive(false);
    }
  }, [profile]);

  // Initial live telemetry poll on mount
  useEffect(() => {
    fetchLiveStation(CITY_PRESETS[0]);
  }, [fetchLiveStation]);

  // When city changes: 0ms instant preset switch, then background poll live feed
  const handleSelectCity = (newCity: CitySmogContext) => {
    setCurrentCity(newCity);
    setPlan(generateDeterministicPlan(profile, newCity));
    fetchLiveStation(newCity);
  };

  const handleCustomCityUpdate = (updated: Partial<CitySmogContext>) => {
    setCurrentCity((prev) => {
      const merged: CitySmogContext = { 
        ...prev, 
        ...updated,
        dataSource: 'manual',
        lastUpdatedText: 'Manual Override',
      };
      setPlan(generateDeterministicPlan(profile, merged));
      return merged;
    });
  };

  const handleProfileChange = (updated: HouseholdProfile) => {
    setProfile(updated);
    setPlan(generateDeterministicPlan(updated, currentCity));
  };

  const isHazardous = currentCity.currentAQI >= 400;

  return (
    <main className="min-h-screen bg-stone-100 flex flex-col font-sans overflow-x-hidden">
      {/* Top Masthead */}
      <Masthead
        aqiCategory={currentCity.aqiCategory}
        isHazardous={isHazardous}
        currentAQI={currentCity.currentAQI}
        onRefreshPlan={handleRefreshPlan}
        isLoading={isLoadingPlan}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        onOpenRwaModal={() => setIsRwaModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Two-Column Workstation Container */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Sticky Household Profiler & Live Impact Scorecard (5 cols on lg) */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
            {/* Live Impact Scorecard */}
            <ImpactScorecard
              impact={impact}
              onOpenExplainer={() => setIsExplainerOpen(true)}
              societyFamilies={profile.societySizeFamilies}
              onUpdateSocietyFamilies={(count) =>
                setProfile((prev) => ({ ...prev, societySizeFamilies: count }))
              }
            />

            {/* Household & Lifestyle Profiler */}
            <HouseholdProfiler
              profile={profile}
              onChangeProfile={handleProfileChange}
            />
          </aside>

          {/* RIGHT COLUMN: Smog Context Bar, 24h Curve, & 3-Tab Action Plan (7 cols on lg) */}
          <section className="lg:col-span-7 space-y-6">
            {/* Hyper-Local Smog & Inversion Context Bar with 24h Curve */}
            <SmogContextBar
              currentCity={currentCity}
              onSelectCity={handleSelectCity}
              onCustomUpdate={handleCustomCityUpdate}
              onRefreshLive={() => fetchLiveStation(currentCity)}
              isFetchingLive={isFetchingLive}
              isDarkMode={isDarkMode}
            />

            {/* Dedicated Cigarette Equivalence & Quick Protection Card */}
            <CigaretteEquivalenceCard
              currentCity={currentCity}
              impact={impact}
              adoptedActionCount={adoptedActionIds.length}
              isDarkMode={isDarkMode}
            />

            {/* GenAI Tailored Action Engine (3 Focused Tabs) */}
            <ActionPlanTabs
              routineSchedule={plan.routineSchedule}
              iaqHacks={plan.iaqHacks}
              sustainableActions={plan.sustainableActions}
              communityPointers={plan.communityPointers}
              adoptedActionIds={adoptedActionIds}
              onToggleAction={handleToggleAction}
              summaryVerdict={plan.summaryVerdict}
            />
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-300 bg-stone-50 py-4 text-center text-xs text-ink-muted">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>BreathLine</strong> · Winter Air &amp; Routine Guide · Household Exposure Co-Pilot
          </span>
          <span className="font-mono text-[11px]">
            EPA &amp; WHO Inhalation Dose Modeling · Tabular Strict Physics Engine
          </span>
        </div>
      </footer>

      {/* RWA WhatsApp Bulletin Modal */}
      <RwaBulletinModal
        isOpen={isRwaModalOpen}
        onClose={() => setIsRwaModalOpen(false)}
        city={currentCity}
        impact={impact}
        profile={profile}
      />

      {/* Math Engine Explainer Modal */}
      <ExplanationModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </main>
  );
}
