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
    accent: string;       // Bar & primary graphic fill
    activeAccent: string; // Active/selected bar fill
    text: string;         // High-contrast readable text
    bg: string;           // Badge soft background
    border: string;       // Badge border
    bannerBg: string;     // Gradient for header banner
    skyline: string;      // Skyline architectural tint
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
  };
}

export const AQI_TIERS: Record<AQITier, AQITierStyle> = {
  good: {
    key: 'good',
    label: 'Good',
    minAqi: 0,
    maxAqi: 50,
    summary: 'Minimal health impact · Clean ambient air',
    day: {
      accent: '#236B56',
      activeAccent: '#1B5443',
      text: '#1E5C4A',
      bg: '#EAF6F1',
      border: '#95D1BD',
      bannerBg: 'linear-gradient(135deg, rgba(234, 246, 241, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(228, 242, 235, 0.85) 100%)',
      skyline: '#236B56',
    },
    dark: {
      accent: '#3DA887',
      activeAccent: '#4EC5A0',
      text: '#4EBA97',
      bg: 'rgba(35, 107, 86, 0.28)',
      border: 'rgba(61, 168, 135, 0.45)',
      bannerBg: 'linear-gradient(135deg, rgba(20, 36, 30, 0.95) 0%, rgba(24, 32, 29, 0.92) 55%, rgba(18, 30, 26, 0.88) 100%)',
      skyline: '#3DA887',
    },
  },
  moderate: {
    key: 'moderate',
    label: 'Moderate',
    minAqi: 51,
    maxAqi: 100,
    summary: 'Minor breathing discomfort to sensitive people · Acceptable air',
    day: {
      accent: '#4A7C59',
      activeAccent: '#3B6447',
      text: '#2E5A36',
      bg: '#F0F6F1',
      border: '#B7D9BF',
      bannerBg: 'linear-gradient(135deg, rgba(240, 246, 241, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(235, 244, 236, 0.85) 100%)',
      skyline: '#4A7C59',
    },
    dark: {
      accent: '#68B684',
      activeAccent: '#7EC798',
      text: '#7BC896',
      bg: 'rgba(74, 124, 89, 0.28)',
      border: 'rgba(104, 182, 132, 0.45)',
      bannerBg: 'linear-gradient(135deg, rgba(22, 34, 26, 0.95) 0%, rgba(24, 32, 29, 0.92) 55%, rgba(20, 30, 24, 0.88) 100%)',
      skyline: '#68B684',
    },
  },
  poor: {
    key: 'poor',
    label: 'Poor',
    minAqi: 101,
    maxAqi: 200,
    summary: 'Breathing discomfort to asthmatics & heart patients · Haze building',
    day: {
      accent: '#D97706',
      activeAccent: '#B45309',
      text: '#B45309',
      bg: '#FEF7EB',
      border: '#FCD34D',
      bannerBg: 'linear-gradient(135deg, rgba(254, 247, 235, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(253, 240, 219, 0.85) 100%)',
      skyline: '#B45309',
    },
    dark: {
      accent: '#FBBF24',
      activeAccent: '#FCD34D',
      text: '#FCD34D',
      bg: 'rgba(217, 119, 6, 0.28)',
      border: 'rgba(251, 191, 36, 0.45)',
      bannerBg: 'linear-gradient(135deg, rgba(38, 31, 20, 0.95) 0%, rgba(28, 24, 18, 0.92) 55%, rgba(33, 26, 17, 0.88) 100%)',
      skyline: '#FBBF24',
    },
  },
  unhealthy: {
    key: 'unhealthy',
    label: 'Unhealthy',
    minAqi: 201,
    maxAqi: 300,
    summary: 'Respiratory illness on prolonged exposure · Thermal trap active',
    day: {
      accent: '#C4512C',
      activeAccent: '#9C3E20',
      text: '#9C3E20',
      bg: '#FDF2EE',
      border: '#F6D3C4',
      bannerBg: 'linear-gradient(135deg, rgba(253, 242, 238, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(250, 232, 226, 0.85) 100%)',
      skyline: '#C4512C',
    },
    dark: {
      accent: '#F27A55',
      activeAccent: '#FF9573',
      text: '#FF8F6B',
      bg: 'rgba(196, 81, 44, 0.28)',
      border: 'rgba(242, 122, 85, 0.45)',
      bannerBg: 'linear-gradient(135deg, rgba(38, 24, 20, 0.95) 0%, rgba(26, 20, 19, 0.92) 55%, rgba(34, 22, 19, 0.88) 100%)',
      skyline: '#F27A55',
    },
  },
  severe: {
    key: 'severe',
    label: 'Severe',
    minAqi: 301,
    maxAqi: 400,
    summary: 'Affects healthy people · Serious impact on vulnerable groups',
    day: {
      accent: '#B91C1C',
      activeAccent: '#991B1B',
      text: '#991B1B',
      bg: '#FEF2F2',
      border: '#FECACA',
      bannerBg: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(254, 226, 226, 0.85) 100%)',
      skyline: '#B91C1C',
    },
    dark: {
      accent: '#F87171',
      activeAccent: '#FCA5A5',
      text: '#FCA5A5',
      bg: 'rgba(185, 28, 28, 0.28)',
      border: 'rgba(248, 113, 113, 0.45)',
      bannerBg: 'linear-gradient(135deg, rgba(40, 18, 18, 0.95) 0%, rgba(28, 20, 20, 0.92) 55%, rgba(36, 18, 18, 0.88) 100%)',
      skyline: '#F87171',
    },
  },
  hazardous: {
    key: 'hazardous',
    label: 'Hazardous',
    minAqi: 401,
    maxAqi: 500,
    summary: 'Severe public health emergency · Whole population affected',
    day: {
      accent: '#701A75',
      activeAccent: '#581C87',
      text: '#581C87',
      bg: '#FAF5FF',
      border: '#E9D5FF',
      bannerBg: 'linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(246, 245, 240, 0.92) 55%, rgba(245, 235, 255, 0.85) 100%)',
      skyline: '#701A75',
    },
    dark: {
      accent: '#C084FC',
      activeAccent: '#D8B4FE',
      text: '#D8B4FE',
      bg: 'rgba(112, 26, 117, 0.3)',
      border: 'rgba(192, 132, 252, 0.45)',
      bannerBg: 'linear-gradient(135deg, rgba(34, 18, 36, 0.95) 0%, rgba(26, 19, 28, 0.92) 55%, rgba(32, 18, 34, 0.88) 100%)',
      skyline: '#C084FC',
    },
  },
};

/**
 * Maps numeric AQI or category label to one of the 6 graded AQI tiers.
 */
export function getAQITier(aqi: number, category?: string): AQITier {
  if (category) {
    const cat = category.toLowerCase().trim();
    if (cat === 'good') return 'good';
    if (cat === 'moderate' || cat === 'satisfactory') return 'moderate';
    if (cat === 'poor') return 'poor';
    if (cat === 'very poor' || cat === 'unhealthy') return 'unhealthy';
    if (cat === 'severe') return 'severe';
    if (cat === 'hazardous') return 'hazardous';
  }

  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'poor';
  if (aqi <= 300) return 'unhealthy';
  if (aqi <= 400) return 'severe';
  return 'hazardous';
}

/**
 * Returns complete styling configuration for a given AQI value and dark mode state.
 */
export function getAQIStyle(aqi: number, isDark: boolean, category?: string) {
  const tierKey = getAQITier(aqi, category);
  const tier = AQI_TIERS[tierKey];
  const mode = isDark ? tier.dark : tier.day;
  return {
    tierKey,
    label: tier.label,
    summary: tier.summary,
    accent: mode.accent,
    activeAccent: mode.activeAccent,
    text: mode.text,
    bg: mode.bg,
    border: mode.border,
    bannerBg: mode.bannerBg,
    skyline: mode.skyline,
  };
}
