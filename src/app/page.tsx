'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CITY_PRESETS } from '@/data/cityPresets';
import { CitySmogContext, HouseholdProfile, GenAIPlanResponse } from '@/types';
import { calculateInhaledDose } from '@/lib/environmentMath';
import { generateDeterministicPlan } from '@/lib/geminiService';
import { fetchLiveCityData } from '@/lib/liveAirQualityService';
import { Masthead } from '@/components/Masthead';
import { SmogContextBar } from '@/components/SmogContextBar';
import { HistoricAirQualityGraph } from '@/components/HistoricAirQualityGraph';
import { AirPollutantsForecastSection } from '@/components/AirPollutantsForecastSection';
import { HouseholdProfiler } from '@/components/HouseholdProfiler';
import { ImpactScorecard } from '@/components/ImpactScorecard';
import { CigaretteEquivalenceCard } from '@/components/CigaretteEquivalenceCard';
import { MetroCitiesGrid } from '@/components/MetroCitiesGrid';
import { RwaBulletinModal } from '@/components/RwaBulletinModal';
import { ExplanationModal } from '@/components/ExplanationModal';
import { TailoredPlanModal } from '@/components/TailoredPlanModal';
import { StationOverridesModal } from '@/components/StationOverridesModal';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

// Haversine formula to compute great-circle distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Locate nearest station from user's coordinates among our calibrated presets
function findNearestStation(lat: number, lon: number): CitySmogContext {
  let closest = CITY_PRESETS[0];
  let minDistance = Infinity;

  for (const city of CITY_PRESETS) {
    if (city.latitude !== undefined && city.longitude !== undefined) {
      const dist = getDistanceKm(lat, lon, city.latitude, city.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = city;
      }
    }
  }

  return closest;
}

export default function Home() {
  // 1. Initial State Setup
  const [currentCity, setCurrentCity] = useState<CitySmogContext>(CITY_PRESETS[0]); // Delhi NCR
  const [isLocationMatched, setIsLocationMatched] = useState<boolean>(false);
  const [matchedCityId, setMatchedCityId] = useState<string | null>(null);
  const userManualSelectionRef = useRef<boolean>(false);

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
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [isOverridesModalOpen, setIsOverridesModalOpen] = useState<boolean>(false);

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

  // Synchronize active city live telemetry / overrides with the Metro Cities grid
  const displayCities = useMemo(() => {
    return CITY_PRESETS.map((c) => (c.id === currentCity.id ? currentCity : c));
  }, [currentCity]);

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

  // Auto-detect user location on first load with short timeout (silent fallback)
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If the user has already manually clicked a city or adjusted overrides, do not overwrite
          if (userManualSelectionRef.current) return;

          const { latitude, longitude } = position.coords;
          if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            const nearestCity = findNearestStation(latitude, longitude);
            if (nearestCity) {
              setIsLocationMatched(true);
              setMatchedCityId(nearestCity.id);
              setCurrentCity(nearestCity);
              setPlan(generateDeterministicPlan(profile, nearestCity));
              fetchLiveStation(nearestCity);
            }
          }
        },
        (error) => {
          // Silent fallback on permission denied, timeout, or location unavailable
          console.debug('Geolocation auto-detection skipped or timed out:', error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 4500,
          maximumAge: 600000, // 10 minutes cache
        }
      );
    } catch (err) {
      console.debug('Geolocation request error:', err);
    }
  }, [profile, fetchLiveStation]);

  // When city changes: 0ms instant preset switch, then background poll live feed
  const handleSelectCity = (newCity: CitySmogContext) => {
    userManualSelectionRef.current = true;
    setIsLocationMatched(false);
    setCurrentCity(newCity);
    setPlan(generateDeterministicPlan(profile, newCity));
    fetchLiveStation(newCity);
  };

  const handleCustomCityUpdate = (updated: Partial<CitySmogContext>) => {
    userManualSelectionRef.current = true;
    setIsLocationMatched(false);
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
        onOpenPlan={() => setIsPlanModalOpen(true)}
        adoptedCount={adoptedActionIds.length}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workstation Container */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 1. Full-Width Active Station Hero Card */}
        <SmogContextBar
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
          onCustomUpdate={handleCustomCityUpdate}
          onRefreshLive={() => fetchLiveStation(currentCity)}
          onOpenOverrides={() => setIsOverridesModalOpen(true)}
          isFetchingLive={isFetchingLive}
          isDarkMode={isDarkMode}
          isLocationMatched={isLocationMatched}
        />

        {/* 2. Animated Cigarette Equivalence Card (Full Width for Above-the-Fold Punch) */}
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
          onSelectCity={handleSelectCity}
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
              onChangeProfile={handleProfileChange}
            />
          </aside>

          {/* RIGHT COLUMN: Live Impact Scorecard + Full AI Plan Launcher (6 cols on lg) */}
          <section className="lg:col-span-6 space-y-6">
            <ImpactScorecard
              impact={impact}
              currentCity={currentCity}
              adoptedCount={adoptedActionIds.length}
              isDarkMode={isDarkMode}
              onOpenExplainer={() => setIsExplainerOpen(true)}
              societyFamilies={profile.societySizeFamilies}
              onUpdateSocietyFamilies={(count) =>
                setProfile((prev) => ({ ...prev, societySizeFamilies: count }))
              }
            />

            {/* Personalized Action Plan Launch Card */}
            <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-sm transition-all hover:border-sage-500/50">
              <div className="flex items-start justify-between gap-3 mb-4">
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

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all group"
              >
                <span>Open Full AI Action Plan &amp; Daily Schedule</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
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

      {/* Tailored AI Action Plan & Daily Schedule Modal */}
      <TailoredPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        routineSchedule={plan.routineSchedule}
        iaqHacks={plan.iaqHacks}
        sustainableActions={plan.sustainableActions}
        communityPointers={plan.communityPointers}
        adoptedActionIds={adoptedActionIds}
        onToggleAction={handleToggleAction}
        summaryVerdict={plan.summaryVerdict}
        cityName={currentCity.name}
        percentageExposureDrop={impact.percentExposureDrop}
        onRefreshPlan={handleRefreshPlan}
        isLoadingPlan={isLoadingPlan}
        isDarkMode={isDarkMode}
      />

      {/* Station Overrides Modal */}
      <StationOverridesModal
        isOpen={isOverridesModalOpen}
        onClose={() => setIsOverridesModalOpen(false)}
        currentCity={currentCity}
        onCustomUpdate={handleCustomCityUpdate}
        onResetLive={() => fetchLiveStation(currentCity)}
        isDarkMode={isDarkMode}
      />

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
