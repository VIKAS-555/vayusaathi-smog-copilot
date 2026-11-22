'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CITY_PRESETS } from '@/data/cityPresets';
import { CitySmogContext, HouseholdProfile, GenAIPlanResponse, ImpactSimulationResults } from '@/types';
import { calculateInhaledDose } from '@/lib/environmentMath';
import { generateDeterministicPlan } from '@/lib/geminiService';
import { fetchLiveCityData } from '@/lib/liveAirQualityService';

// Haversine formula to compute distance in km
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

export interface BreathLineContextType {
  // City & Station state
  currentCity: CitySmogContext;
  setCurrentCity: React.Dispatch<React.SetStateAction<CitySmogContext>>;
  displayCities: CitySmogContext[];
  selectCity: (city: CitySmogContext) => void;
  customCityUpdate: (updated: Partial<CitySmogContext>) => void;
  resetToLiveStation: () => void;
  fetchLiveStation: (preset: CitySmogContext) => Promise<void>;
  isFetchingLive: boolean;
  isLocationMatched: boolean;
  matchedCityId: string | null;

  // Household Profile state
  profile: HouseholdProfile;
  setProfile: React.Dispatch<React.SetStateAction<HouseholdProfile>>;
  updateProfile: (updated: HouseholdProfile) => void;

  // Adopted Actions state
  adoptedActionIds: string[];
  setAdoptedActionIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleAction: (actionId: string) => void;

  // Impact & Plan calculations
  impact: ImpactSimulationResults;
  plan: GenAIPlanResponse;
  isLoadingPlan: boolean;
  refreshPlan: () => Promise<void>;

  // Theme state
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Drawers state
  isMathDrawerOpen: boolean;
  setIsMathDrawerOpen: (open: boolean) => void;
  openMathDrawer: () => void;
  closeMathDrawer: () => void;

  isOverridesDrawerOpen: boolean;
  setIsOverridesDrawerOpen: (open: boolean) => void;
  openOverridesDrawer: () => void;
  closeOverridesDrawer: () => void;
}

const BreathLineContext = createContext<BreathLineContextType | null>(null);

export const BreathLineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Station State
  const [currentCity, setCurrentCity] = useState<CitySmogContext>(CITY_PRESETS[0]); // Delhi NCR baseline
  const [isLocationMatched, setIsLocationMatched] = useState<boolean>(false);
  const [matchedCityId, setMatchedCityId] = useState<string | null>(null);
  const userManualSelectionRef = useRef<boolean>(false);

  // 2. Household Profile State
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

  // 3. Adopted Habits State
  const [adoptedActionIds, setAdoptedActionIds] = useState<string[]>([
    'iaq-zero-cost-door-seal',
    'iaq-zero-cost-cooking-exhaust',
    'sustainable-waste-zero-burn',
  ]);

  // 4. Drawers State
  const [isMathDrawerOpen, setIsMathDrawerOpen] = useState<boolean>(false);
  const [isOverridesDrawerOpen, setIsOverridesDrawerOpen] = useState<boolean>(false);

  // 5. Theme State
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
      // Ignore SSR
    }
  }, []);

  const toggleTheme = useCallback(() => {
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
  }, []);

  // 6. Action Toggle Handler
  const toggleAction = useCallback((actionId: string) => {
    setAdoptedActionIds((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  }, []);

  // 7. Update Profile
  const updateProfile = useCallback((updated: HouseholdProfile) => {
    setProfile(updated);
  }, []);

  // 8. Initial Plan Generation
  const initialPlan = useMemo(
    () => generateDeterministicPlan(profile, currentCity),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [plan, setPlan] = useState<GenAIPlanResponse>(initialPlan);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);

  // Keep plan updated when city or profile updates if not custom fetched
  useEffect(() => {
    setPlan(generateDeterministicPlan(profile, currentCity));
  }, [profile, currentCity]);

  // 9. Re-run GenAI reasoning with updated household settings
  const refreshPlan = useCallback(async () => {
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

  // 10. Live Meteorological Station Feeds
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  const fetchLiveStation = useCallback(async (preset: CitySmogContext) => {
    setIsFetchingLive(true);
    try {
      const liveCity = await fetchLiveCityData(preset);
      setCurrentCity(liveCity);
    } catch (err) {
      console.warn('Live station fetch failed, using baseline snapshot:', err);
    } finally {
      setIsFetchingLive(false);
    }
  }, []);

  // Initial live telemetry poll on mount
  useEffect(() => {
    fetchLiveStation(CITY_PRESETS[0]);
  }, [fetchLiveStation]);

  // Auto-detect user location on first load with short timeout
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (userManualSelectionRef.current) return;

          const { latitude, longitude } = position.coords;
          if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            const nearestCity = findNearestStation(latitude, longitude);
            if (nearestCity) {
              setIsLocationMatched(true);
              setMatchedCityId(nearestCity.id);
              setCurrentCity(nearestCity);
              fetchLiveStation(nearestCity);
            }
          }
        },
        (error) => {
          console.debug('Geolocation auto-detection skipped or timed out:', error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 4500,
          maximumAge: 600000,
        }
      );
    } catch (err) {
      console.debug('Geolocation request error:', err);
    }
  }, [fetchLiveStation]);

  // Select City handler
  const selectCity = useCallback((newCity: CitySmogContext) => {
    userManualSelectionRef.current = true;
    setIsLocationMatched(false);
    setCurrentCity(newCity);
    fetchLiveStation(newCity);
  }, [fetchLiveStation]);

  // Custom city overrides
  const customCityUpdate = useCallback((updated: Partial<CitySmogContext>) => {
    userManualSelectionRef.current = true;
    setIsLocationMatched(false);
    setCurrentCity((prev) => ({
      ...prev,
      ...updated,
      dataSource: 'manual',
      lastUpdatedText: 'Manual Override',
    }));
  }, []);

  // Reset to live station / original preset
  const resetToLiveStation = useCallback(() => {
    userManualSelectionRef.current = false;
    const originalPreset = CITY_PRESETS.find((c) => c.id === currentCity.id) || CITY_PRESETS[0];
    setCurrentCity(originalPreset);
    fetchLiveStation(originalPreset);
  }, [currentCity.id, fetchLiveStation]);

  // Synchronize active city live telemetry / overrides with the Metro Cities grid
  const displayCities = useMemo(() => {
    return CITY_PRESETS.map((c) => (c.id === currentCity.id ? currentCity : c));
  }, [currentCity]);

  // 11. Calculate Deterministic Inhaled Dose & Climate Metrics
  const impact = useMemo(() => {
    return calculateInhaledDose(profile, currentCity, adoptedActionIds);
  }, [profile, currentCity, adoptedActionIds]);

  // Drawer helpers
  const openMathDrawer = useCallback(() => setIsMathDrawerOpen(true), []);
  const closeMathDrawer = useCallback(() => setIsMathDrawerOpen(false), []);
  const openOverridesDrawer = useCallback(() => setIsOverridesDrawerOpen(true), []);
  const closeOverridesDrawer = useCallback(() => setIsOverridesDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      currentCity,
      setCurrentCity,
      displayCities,
      selectCity,
      customCityUpdate,
      resetToLiveStation,
      fetchLiveStation,
      isFetchingLive,
      isLocationMatched,
      matchedCityId,
      profile,
      setProfile,
      updateProfile,
      adoptedActionIds,
      setAdoptedActionIds,
      toggleAction,
      impact,
      plan,
      isLoadingPlan,
      refreshPlan,
      isDarkMode,
      toggleTheme,
      isMathDrawerOpen,
      setIsMathDrawerOpen,
      openMathDrawer,
      closeMathDrawer,
      isOverridesDrawerOpen,
      setIsOverridesDrawerOpen,
      openOverridesDrawer,
      closeOverridesDrawer,
    }),
    [
      currentCity,
      displayCities,
      selectCity,
      customCityUpdate,
      resetToLiveStation,
      fetchLiveStation,
      isFetchingLive,
      isLocationMatched,
      matchedCityId,
      profile,
      updateProfile,
      adoptedActionIds,
      toggleAction,
      impact,
      plan,
      isLoadingPlan,
      refreshPlan,
      isDarkMode,
      toggleTheme,
      isMathDrawerOpen,
      openMathDrawer,
      closeMathDrawer,
      isOverridesDrawerOpen,
      openOverridesDrawer,
      closeOverridesDrawer,
    ]
  );

  return <BreathLineContext.Provider value={value}>{children}</BreathLineContext.Provider>;
};

export function useBreathLine(): BreathLineContextType {
  const context = useContext(BreathLineContext);
  if (!context) {
    throw new Error('useBreathLine must be used within a BreathLineProvider');
  }
  return context;
}
