import React from 'react';

export type AQITier = 'good' | 'moderate' | 'poor' | 'unhealthy' | 'severe' | 'hazardous';

export interface AQITierStyle {
  key: AQITier;
  label: string;
  minAqi: number;
  maxAqi: number;
  summary: string;
  // Day Mode (Newsprint / Stone)
  day: {
    accent: string;       // Exact vibrant tier color
    activeAccent: string; // Active/selected bar fill
    text: string;         // High-contrast readable text
    bg: string;           // Badge soft background
    border: string;       // Badge border
    bannerBg: string;     // Atmospheric dusk/night gradient for hero banner
    skyline: string;      // Skyline architectural tint
    liveDot: string;      // Live AQI glowing dot
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  };
  // Night Mode (Editorial Charcoal)
  dark: {
    accent: string;
    activeAccent: string;
    text: string;
    bg: string;
    border: string;
    bannerBg: string;
    skyline: string;
    liveDot: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  };
}

/**
 * 6 Graded AQI Tiers adhering to strict physical thresholds:
 * Good (0-50)       -> Green (#10B981)
 * Moderate (51-100) -> Yellow (#EAB308)
 * Poor (101-200)    -> Orange (#F97316)
 * Unhealthy (201-300)-> Red (#EF4444)
 * Severe (301-400)  -> Purple (#A855F7)
 * Hazardous (401+)  -> Deep Maroon (#881337)
 */
export const AQI_TIERS: Record<AQITier, AQITierStyle> = {
  good: {
    key: 'good',
    label: 'Good',
    minAqi: 0,
    maxAqi: 50,
    summary: 'Minimal health impact · Clean ambient air',
    day: {
      accent: '#10B981',
      activeAccent: '#059669',
      text: '#047857',
      bg: '#EAF6F1',
      border: '#95D1BD',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #0A4335 0%, #062820 35%, #031511 70%, #010806 100%)',
      skyline: '#10B981',
      liveDot: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.22)',
      badgeBorder: 'rgba(52, 211, 153, 0.45)',
      badgeText: '#6EE7B7',
    },
    dark: {
      accent: '#34D399',
      activeAccent: '#10B981',
      text: '#6EE7B7',
      bg: 'rgba(16, 185, 129, 0.25)',
      border: 'rgba(52, 211, 153, 0.45)',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #0A4335 0%, #062820 35%, #031511 70%, #010806 100%)',
      skyline: '#10B981',
      liveDot: '#34D399',
      badgeBg: 'rgba(16, 185, 129, 0.25)',
      badgeBorder: 'rgba(52, 211, 153, 0.45)',
      badgeText: '#6EE7B7',
    },
  },
  moderate: {
    key: 'moderate',
    label: 'Moderate',
    minAqi: 51,
    maxAqi: 100,
    summary: 'Minor breathing discomfort to sensitive people · Acceptable air',
    day: {
      accent: '#EAB308',
      activeAccent: '#CA8A04',
      text: '#A16207',
      bg: '#FEFCE8',
      border: '#FDE047',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #5C4505 0%, #3B2B02 35%, #1C1401 70%, #080805 100%)',
      skyline: '#EAB308',
      liveDot: '#EAB308',
      badgeBg: 'rgba(234, 179, 8, 0.22)',
      badgeBorder: 'rgba(250, 204, 21, 0.45)',
      badgeText: '#FEF08A',
    },
    dark: {
      accent: '#FACC15',
      activeAccent: '#EAB308',
      text: '#FEF08A',
      bg: 'rgba(234, 179, 8, 0.25)',
      border: 'rgba(250, 204, 21, 0.45)',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #5C4505 0%, #3B2B02 35%, #1C1401 70%, #080805 100%)',
      skyline: '#EAB308',
      liveDot: '#FACC15',
      badgeBg: 'rgba(234, 179, 8, 0.25)',
      badgeBorder: 'rgba(250, 204, 21, 0.45)',
      badgeText: '#FEF08A',
    },
  },
  poor: {
    key: 'poor',
    label: 'Poor',
    minAqi: 101,
    maxAqi: 200,
    summary: 'Breathing discomfort to asthmatics & heart patients · Haze building',
    day: {
      accent: '#F97316',
      activeAccent: '#EA580C',
      text: '#C2410C',
      bg: '#FFF7ED',
      border: '#FDBA74',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #5E2C07 0%, #3D1A03 35%, #1F0C01 70%, #0A0503 100%)',
      skyline: '#F97316',
      liveDot: '#F97316',
      badgeBg: 'rgba(249, 115, 22, 0.22)',
      badgeBorder: 'rgba(251, 146, 60, 0.45)',
      badgeText: '#FDBA74',
    },
    dark: {
      accent: '#FB923C',
      activeAccent: '#F97316',
      text: '#FDBA74',
      bg: 'rgba(249, 115, 22, 0.25)',
      border: 'rgba(251, 146, 60, 0.45)',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #5E2C07 0%, #3D1A03 35%, #1F0C01 70%, #0A0503 100%)',
      skyline: '#F97316',
      liveDot: '#FB923C',
      badgeBg: 'rgba(249, 115, 22, 0.25)',
      badgeBorder: 'rgba(251, 146, 60, 0.45)',
      badgeText: '#FDBA74',
    },
  },
  unhealthy: {
    key: 'unhealthy',
    label: 'Unhealthy',
    minAqi: 201,
    maxAqi: 300,
    summary: 'Respiratory illness on prolonged exposure · Thermal trap active',
    day: {
      accent: '#EF4444',
      activeAccent: '#DC2626',
      text: '#B91C1C',
      bg: '#FEF2F2',
      border: '#FCA5A5',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #5C1217 0%, #3B0A0D 35%, #1F0407 70%, #0A0203 100%)',
      skyline: '#EF4444',
      liveDot: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.25)',
      badgeBorder: 'rgba(248, 113, 113, 0.45)',
      badgeText: '#FDA4AF',
    },
    dark: {
      accent: '#F87171',
      activeAccent: '#EF4444',
      text: '#FCA5A5',
      bg: 'rgba(239, 68, 68, 0.28)',
      border: 'rgba(248, 113, 113, 0.45)',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #5C1217 0%, #3B0A0D 35%, #1F0407 70%, #0A0203 100%)',
      skyline: '#EF4444',
      liveDot: '#F87171',
      badgeBg: 'rgba(239, 68, 68, 0.28)',
      badgeBorder: 'rgba(248, 113, 113, 0.45)',
      badgeText: '#FDA4AF',
    },
  },
  severe: {
    key: 'severe',
    label: 'Severe',
    minAqi: 301,
    maxAqi: 400,
    summary: 'Affects healthy people · Serious impact on vulnerable groups',
    day: {
      accent: '#A855F7',
      activeAccent: '#9333EA',
      text: '#7E22CE',
      bg: '#FAF5FF',
      border: '#D8B4FE',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #4A1A72 0%, #2D0E47 35%, #170624 70%, #090210 100%)',
      skyline: '#A855F7',
      liveDot: '#A855F7',
      badgeBg: 'rgba(168, 85, 247, 0.25)',
      badgeBorder: 'rgba(192, 132, 252, 0.45)',
      badgeText: '#D8B4FE',
    },
    dark: {
      accent: '#C084FC',
      activeAccent: '#A855F7',
      text: '#D8B4FE',
      bg: 'rgba(168, 85, 247, 0.28)',
      border: 'rgba(192, 132, 252, 0.45)',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #4A1A72 0%, #2D0E47 35%, #170624 70%, #090210 100%)',
      skyline: '#A855F7',
      liveDot: '#C084FC',
      badgeBg: 'rgba(168, 85, 247, 0.28)',
      badgeBorder: 'rgba(192, 132, 252, 0.45)',
      badgeText: '#D8B4FE',
    },
  },
  hazardous: {
    key: 'hazardous',
    label: 'Hazardous',
    minAqi: 401,
    maxAqi: 500,
    summary: 'Severe public health emergency · Whole population affected',
    day: {
      accent: '#881337',
      activeAccent: '#701A75',
      text: '#7F1D1D',
      bg: '#FFF1F2',
      border: '#FECDD3',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #4A0418 0%, #2D020D 35%, #170106 70%, #090003 100%)',
      skyline: '#881337',
      liveDot: '#881337',
      badgeBg: 'rgba(136, 19, 55, 0.35)',
      badgeBorder: 'rgba(244, 63, 94, 0.45)',
      badgeText: '#FECDD3',
    },
    dark: {
      accent: '#BE123C',
      activeAccent: '#881337',
      text: '#FCA5A5',
      bg: 'rgba(136, 19, 55, 0.4)',
      border: 'rgba(244, 63, 94, 0.5)',
      bannerBg: 'radial-gradient(ellipse 85% 65% at 50% 12%, #4A0418 0%, #2D020D 35%, #170106 70%, #090003 100%)',
      skyline: '#BE123C',
      liveDot: '#BE123C',
      badgeBg: 'rgba(136, 19, 55, 0.4)',
      badgeBorder: 'rgba(244, 63, 94, 0.5)',
      badgeText: '#FECDD3',
    },
  },
};

/**
 * Maps numeric AQI or category label strictly to one of the 6 graded AQI tiers:
 * 0-50: good
 * 51-100: moderate
 * 101-200: poor
 * 201-300: unhealthy
 * 301-400: severe (e.g. 355 is SEVERE, PURPLE)
 * 401+: hazardous (DEEP MAROON)
 */
export function getAQITier(aqi: number, category?: string): AQITier {
  if (typeof aqi === 'number' && !isNaN(aqi)) {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 200) return 'poor';
    if (aqi <= 300) return 'unhealthy';
    if (aqi <= 400) return 'severe';
    return 'hazardous';
  }

  if (category) {
    const cat = category.toLowerCase().trim();
    if (cat === 'good') return 'good';
    if (cat === 'moderate' || cat === 'satisfactory') return 'moderate';
    if (cat === 'poor') return 'poor';
    if (cat === 'unhealthy' || cat === 'very poor') return 'unhealthy';
    if (cat === 'severe') return 'severe';
    if (cat === 'hazardous') return 'hazardous';
  }

  return 'severe';
}

/**
 * Unified Shared AQI Theme Mapper:
 * Returns the exact synchronized accent color, dark hero gradient, skyline tint,
 * live indicator dot, and card/badge accents across the entire application.
 */
export function getSharedAQITheme(aqi: number, isDark: boolean = false, category?: string) {
  const tierKey = getAQITier(aqi, category);
  const tier = AQI_TIERS[tierKey];
  const mode = isDark ? tier.dark : tier.day;

  return {
    tierKey,
    label: tier.label,
    minAqi: tier.minAqi,
    maxAqi: tier.maxAqi,
    summary: tier.summary,
    accent: mode.accent,
    activeAccent: mode.activeAccent,
    text: mode.text,
    bg: mode.bg,
    border: mode.border,
    bannerBg: mode.bannerBg,
    skyline: mode.skyline,
    liveDotColor: mode.liveDot,
    badgeBg: mode.badgeBg,
    badgeBorder: mode.badgeBorder,
    badgeText: mode.badgeText,
  };
}

/**
 * Backward-compatible wrapper for getSharedAQITheme
 */
export function getAQIStyle(aqi: number, isDark: boolean, category?: string) {
  return getSharedAQITheme(aqi, isDark, category);
}

/**
 * Continuous 6-segment rainbow track gradient matching the exact tier cutoffs:
 * Good (0-16.67%) -> Moderate (16.67-33.33%) -> Poor (33.33-50%) ->
 * Unhealthy (50-66.67%) -> Severe (66.67-83.33%) -> Hazardous (83.33-100%)
 */
export const AQI_SPECTRUM_GRADIENT =
  'linear-gradient(to right, #10B981 0%, #10B981 16.67%, #EAB308 16.67%, #EAB308 33.33%, #F97316 33.33%, #F97316 50%, #EF4444 50%, #EF4444 66.67%, #A855F7 66.67%, #A855F7 83.33%, #881337 83.33%, #881337 100%)';

export const AQI_SPECTRUM_TICKS = ['0', '50', '100', '200', '300', '400', '500+'];

/**
 * Calculates continuous position (0% - 100%) along the 6-tier AQI spectrum bar.
 * At 355 AQI, it lands precisely at ~75.8% (within the 66.67%–83.33% PURPLE Severe segment).
 */
export function getSpectrumPercentage(aqi: number): number {
  if (aqi <= 0) return 2;
  if (aqi <= 50) return Math.max(2, (aqi / 50) * 16.67);
  if (aqi <= 100) return 16.67 + ((aqi - 50) / 50) * 16.66;
  if (aqi <= 200) return 33.33 + ((aqi - 100) / 100) * 16.67;
  if (aqi <= 300) return 50.00 + ((aqi - 200) / 100) * 16.67;
  if (aqi <= 400) return 66.67 + ((aqi - 300) / 100) * 16.66;
  return Math.min(98, 83.33 + ((aqi - 400) / 100) * 14.67);
}
