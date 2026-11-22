import React from 'react';
import { CitySmogContext, ImpactSimulationResults } from '../types';
import { getAQITier, getAQIStyle } from '../lib/aqiScale';
import { 
  Wind, 
  Car, 
  ShieldCheck, 
  Home, 
  Info, 
  Sparkles,
  Flame
} from 'lucide-react';

interface CigaretteEquivalenceCardProps {
  currentCity: CitySmogContext;
  impact: ImpactSimulationResults;
  adoptedActionCount?: number;
  isDarkMode?: boolean;
}

type QuickActionUrgency = 'Optional' | 'Recommended' | 'Must';

interface QuickActionTileData {
  id: string;
  title: string;
  icon: React.ReactNode;
  urgency: QuickActionUrgency;
  tip: string;
}

export const CigaretteEquivalenceCard: React.FC<CigaretteEquivalenceCardProps> = ({
  currentCity,
  impact,
  adoptedActionCount = 0,
  isDarkMode = false,
}) => {
  // 1. Calculate Cigarette Equivalence dynamically from Berkeley Earth Rule:
  // 22 µg/m³ 24h ambient PM2.5 ≈ 1 cigarette/day (≈ 220 µg inhaled daily dose at standard respiration)
  const aqiTier = getAQITier(currentCity.currentAQI, currentCity.aqiCategory);
  const aqiStyle = getAQIStyle(currentCity.currentAQI, isDarkMode, currentCity.aqiCategory);

  // Active daily cigarette equivalent calculated from the user's modeled inhaled dose
  const activeDailyCigs = Math.max(
    0.1,
    Number((impact.adoptedDailyInhaledDoseUg / 220).toFixed(1))
  );

  // Daily cigarettes avoided thanks to user's adopted habits
  const avoidedDailyCigs = impact.passiveCigaretteEquivalentAvoidedDaily;
  const hasHabitSavings = avoidedDailyCigs >= 0.1 && adoptedActionCount > 0;

  // Multipliers for Weekly (× 7) and Monthly (× 30)
  const weeklyCigs = Math.round(activeDailyCigs * 7);
  const monthlyCigs = Math.round(activeDailyCigs * 30);
  const weeklyAvoidedCigs = Math.round(avoidedDailyCigs * 7);

  // 2. Derive Quick Actions for Current AQI
  const getActionTiles = (): QuickActionTileData[] => {
    const aqi = currentCity.currentAQI;

    // Air Purifier
    let purifierUrgency: QuickActionUrgency = 'Optional';
    let purifierTip = 'Fresh outdoor airing recommended';
    if (aqi > 200) {
      purifierUrgency = 'Must';
      purifierTip = 'Run continuous HEPA in bedrooms';
    } else if (aqi > 50) {
      purifierUrgency = 'Recommended';
      purifierTip = 'Run in closed sleeping rooms';
    }

    // Car Cabin Filter
    let carUrgency: QuickActionUrgency = 'Optional';
    let carTip = 'Standard cabin ventilation';
    if (aqi > 200) {
      carUrgency = 'Must';
      carTip = 'Internal AC recirc + clean cabin filter';
    } else if (aqi > 100) {
      carUrgency = 'Recommended';
      carTip = 'Switch AC to internal recirculation';
    }

    // N95 Mask
    let maskUrgency: QuickActionUrgency = 'Optional';
    let maskTip = 'Optional for general public';
    if (aqi > 200) {
      maskUrgency = 'Must';
      maskTip = 'Tight-fit N95 for all outdoor transit';
    } else if (aqi > 100) {
      maskUrgency = 'Recommended';
      maskTip = 'Wear during roadside walking / commute';
    } else if (aqi > 50) {
      maskTip = 'Advised for asthmatic & elderly';
    }

    // Stay Indoors
    let stayUrgency: QuickActionUrgency = 'Optional';
    let stayTip = 'Outdoor recreation & airing safe';
    if (aqi > 300) {
      stayUrgency = 'Must';
      stayTip = 'Smog emergency: seal envelope strictly';
    } else if (aqi > 200) {
      stayUrgency = 'Recommended';
      stayTip = 'Avoid morning runs & outdoor sports';
    } else if (aqi > 100) {
      stayTip = 'Shift heavy cardio to indoor gym';
    }

    return [
      {
        id: 'purifier',
        title: 'Air Purifier',
        icon: <Wind className="h-4 w-4" />,
        urgency: purifierUrgency,
        tip: purifierTip,
      },
      {
        id: 'car-filter',
        title: 'Car Filter',
        icon: <Car className="h-4 w-4" />,
        urgency: carUrgency,
        tip: carTip,
      },
      {
        id: 'n95-mask',
        title: 'N95 Mask',
        icon: <ShieldCheck className="h-4 w-4" />,
        urgency: maskUrgency,
        tip: maskTip,
      },
      {
        id: 'stay-indoor',
        title: 'Stay Indoor',
        icon: <Home className="h-4 w-4" />,
        urgency: stayUrgency,
        tip: stayTip,
      },
    ];
  };

  const actionTiles = getActionTiles();

  const getUrgencyBadgeStyle = (urgency: QuickActionUrgency) => {
    switch (urgency) {
      case 'Must':
        return isDarkMode
          ? 'bg-rose-950/80 text-rose-200 border-rose-800'
          : 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Recommended':
        return isDarkMode
          ? 'bg-amber-950/80 text-amber-200 border-amber-800'
          : 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'Optional':
      default:
        return isDarkMode
          ? 'bg-stone-800 text-stone-300 border-stone-700'
          : 'bg-stone-200/80 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="rounded-2xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-xs transition-colors">
      {/* Real CSS @keyframes for silky curling smoke wisps & warm breathing ember glow */}
      <style>{`
        @keyframes warmEmberBreath {
          0%, 100% {
            opacity: 0.82;
            transform: scale(0.96);
            filter: drop-shadow(0 0 2px #F97316) drop-shadow(0 0 5px #EA580C);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
            filter: drop-shadow(0 0 4.5px #F97316) drop-shadow(0 0 9px #EA580C);
          }
        }

        @keyframes smokeCurlingWisp1 {
          0% {
            transform: translate(0, 0) scale(0.6, 0.35) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.85;
          }
          35% {
            transform: translate(3px, -16px) scale(0.9, 0.75) rotate(2.5deg);
            opacity: 0.7;
          }
          65% {
            transform: translate(-4px, -35px) scale(1.35, 1.25) rotate(-3.5deg);
            opacity: 0.4;
          }
          85% {
            transform: translate(5px, -52px) scale(1.75, 1.65) rotate(4deg);
            opacity: 0.15;
          }
          100% {
            transform: translate(8px, -66px) scale(2.1, 2.0) rotate(2deg);
            opacity: 0;
          }
        }

        @keyframes smokeCurlingWisp2 {
          0% {
            transform: translate(0, 0) scale(0.55, 0.3) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          40% {
            transform: translate(-4px, -18px) scale(0.95, 0.85) rotate(-3deg);
            opacity: 0.65;
          }
          70% {
            transform: translate(4px, -38px) scale(1.4, 1.35) rotate(4deg);
            opacity: 0.35;
          }
          88% {
            transform: translate(-3px, -54px) scale(1.8, 1.7) rotate(-2deg);
            opacity: 0.12;
          }
          100% {
            transform: translate(-6px, -68px) scale(2.15, 2.05) rotate(-4.5deg);
            opacity: 0;
          }
        }

        @keyframes smokeCurlingWisp3 {
          0% {
            transform: translate(0, 0) scale(0.6, 0.4) rotate(0deg);
            opacity: 0;
          }
          18% {
            opacity: 0.75;
          }
          45% {
            transform: translate(2.5px, -20px) scale(1.05, 0.95) rotate(2deg);
            opacity: 0.55;
          }
          75% {
            transform: translate(-5px, -42px) scale(1.5, 1.45) rotate(-2.5deg);
            opacity: 0.25;
          }
          100% {
            transform: translate(4px, -62px) scale(1.95, 1.9) rotate(3deg);
            opacity: 0;
          }
        }

        @keyframes smokeAmbientPlume {
          0% {
            transform: translate(0, 0) scale(0.5, 0.35);
            opacity: 0;
          }
          20% {
            opacity: 0.45;
          }
          55% {
            transform: translate(2px, -22px) scale(1.3, 1.25);
            opacity: 0.28;
          }
          85% {
            transform: translate(-3px, -45px) scale(1.9, 1.8);
            opacity: 0.1;
          }
          100% {
            transform: translate(-5px, -60px) scale(2.3, 2.2);
            opacity: 0;
          }
        }

        .smoke-wisp-1 {
          animation: smokeCurlingWisp1 4.6s cubic-bezier(0.35, 0, 0.25, 1) infinite;
          transform-origin: 135.5px 39px;
        }
        .smoke-wisp-2 {
          animation: smokeCurlingWisp2 5.2s cubic-bezier(0.35, 0, 0.25, 1) infinite 1.3s;
          transform-origin: 135.5px 39px;
        }
        .smoke-wisp-3 {
          animation: smokeCurlingWisp3 5.8s cubic-bezier(0.35, 0, 0.25, 1) infinite 2.6s;
          transform-origin: 135.5px 39px;
        }
        .smoke-plume-ambient {
          animation: smokeAmbientPlume 4.4s cubic-bezier(0.35, 0, 0.25, 1) infinite 0.7s;
          transform-origin: 135.5px 39px;
        }
        .animate-warm-ember {
          animation: warmEmberBreath 2.4s ease-in-out infinite;
          transform-origin: 135.5px 39px;
        }
      `}</style>

      {/* 1. TOP HERO ROW: Left Stacked Number & Label -> Animated SVG Cigarette -> Right Weekly & Monthly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-stone-200 dark:border-[#2B3833]">
        
        {/* Left: Stacked Number & "Cigarettes per day" + SVG Cigarette right next to it */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
          {/* Stacked Daily Cigarette Number & Label */}
          <div className="flex flex-col shrink-0">
            <span 
              className="font-mono text-5xl sm:text-6xl font-black tracking-tight tabular-nums leading-none transition-colors duration-500"
              style={{ color: aqiStyle.accent }}
            >
              ~{activeDailyCigs}
            </span>
            <span className="font-bold text-xs sm:text-sm text-ink dark:text-stone-100 uppercase tracking-wider mt-1.5 whitespace-nowrap">
              Cigarettes per day
            </span>
          </div>

          {/* Clean Vector SVG Cigarette Illustration with Continuous Rising Smoke Puffs */}
          <div 
            className="flex items-center justify-center shrink-0 select-none pointer-events-none"
            aria-hidden="true"
          >
            <svg 
              viewBox="0 0 175 70" 
              className="w-32 sm:w-40 h-16 sm:h-18 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Multi-tier Gaussian Blur filters for silky organic smoke */}
                <filter id="silkySmokeBlur" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2.2" />
                </filter>
                <filter id="ambientPlumeBlur" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4.2" />
                </filter>
                <filter id="filamentSmokeBlur" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="1.3" />
                </filter>
                <filter id="emberGlowFilter" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>

                {/* Vertical Opacity Fade Gradient for linear vertical dissolution */}
                <linearGradient id="verticalSmokeFade" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Fade Mask applied to the entire smoke group */}
                <mask id="smokeVerticalFadeMask">
                  <rect x="70" y="-80" width="130" height="130" fill="url(#verticalSmokeFade)" />
                </mask>

                {/* Gradients for Smoke Ribbon Strokes */}
                <linearGradient id="smokeRibbonGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor={isDarkMode ? "rgba(251, 146, 60, 0.45)" : "rgba(249, 115, 22, 0.35)"} />
                  <stop offset="15%" stopColor={isDarkMode ? "rgba(226, 232, 240, 0.75)" : "rgba(100, 116, 139, 0.65)"} />
                  <stop offset="60%" stopColor={isDarkMode ? "rgba(203, 213, 225, 0.45)" : "rgba(148, 163, 184, 0.38)"} />
                  <stop offset="100%" stopColor={isDarkMode ? "rgba(148, 163, 184, 0.05)" : "rgba(203, 213, 225, 0.05)"} />
                </linearGradient>

                <linearGradient id="smokeRibbonGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor={isDarkMode ? "rgba(241, 245, 249, 0.8)" : "rgba(100, 116, 139, 0.7)"} />
                  <stop offset="40%" stopColor={isDarkMode ? "rgba(203, 213, 225, 0.5)" : "rgba(148, 163, 184, 0.4)"} />
                  <stop offset="85%" stopColor={isDarkMode ? "rgba(148, 163, 184, 0.15)" : "rgba(203, 213, 225, 0.12)"} />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>

                {/* Realistic Ember Glow Gradients */}
                <radialGradient id="emberRadialCore" cx="42%" cy="48%" r="58%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
                  <stop offset="35%" stopColor="#F97316" stopOpacity="1" />
                  <stop offset="75%" stopColor="#EA580C" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#991B1B" stopOpacity="0.8" />
                </radialGradient>

                <radialGradient id="emberHaloGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#EA580C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Continuous Silky Curling Smoke Wisps rising organically from tip (origin x=135.5, y=39) */}
              <g mask="url(#smokeVerticalFadeMask)" className="smoke-ribbons select-none pointer-events-none">
                {/* Layer 0: Ambient Plume Contour (Soft Atmospheric Volume) */}
                <path
                  d="M135.5 39 C133 30, 139 21, 134 12 C130 3, 139 -6, 134 -17 C130 -28, 138 -39, 134 -52"
                  fill="none"
                  stroke="url(#smokeRibbonGrad2)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  filter="url(#ambientPlumeBlur)"
                  className="smoke-plume-ambient"
                />

                {/* Layer 1: Primary Sinuous Curling Ribbon */}
                <path
                  d="M135.5 39 C135.5 32, 137.5 26, 135 19 C132 12, 138 5, 134 -3 C130 -12, 138 -22, 133 -34 C129 -44, 136 -54, 132 -64"
                  fill="none"
                  stroke="url(#smokeRibbonGrad1)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#silkySmokeBlur)"
                  className="smoke-wisp-1"
                />

                {/* Layer 2: Secondary Intertwining Counter-Curling Ribbon */}
                <path
                  d="M135.5 39 C134 31, 131.5 24, 134 17 C137 10, 132 2, 136 -7 C139 -17, 132 -27, 136 -38 C139 -48, 133 -58, 135 -68"
                  fill="none"
                  stroke="url(#smokeRibbonGrad2)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#silkySmokeBlur)"
                  className="smoke-wisp-2"
                />

                {/* Layer 3: Delicate Sinuous Filament Trail */}
                <path
                  d="M135.5 39 C136.5 33, 135 27, 137 20 C139 13, 134 6, 136 -2 C138 -10, 133 -19, 135 -29 C137 -39, 134 -49, 136 -59"
                  fill="none"
                  stroke="url(#smokeRibbonGrad1)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  filter="url(#filamentSmokeBlur)"
                  className="smoke-wisp-3"
                />
              </g>

              {/* Soft Ground Shadow underneath cigarette cylinder */}
              <ellipse 
                cx="82" 
                cy="48" 
                rx="54" 
                ry="3" 
                fill={isDarkMode ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.07)'} 
              />

              {/* 1. Filter Section (Cork / Tan) */}
              <rect 
                x="18" 
                y="33" 
                width="34" 
                height="12" 
                rx="2" 
                fill="#C68B59" 
                stroke={isDarkMode ? '#8A5830' : '#A06839'} 
                strokeWidth="0.8" 
              />
              <line x1="27" y1="34" x2="27" y2="44" stroke="#B27845" strokeWidth="0.6" strokeDasharray="1 1.5" />
              <line x1="36" y1="34" x2="36" y2="44" stroke="#B27845" strokeWidth="0.6" strokeDasharray="1 1.5" />
              <line x1="45" y1="34" x2="45" y2="44" stroke="#B27845" strokeWidth="0.6" strokeDasharray="1 1.5" />
              {/* Gold ring wrap band */}
              <line x1="51.5" y1="33" x2="51.5" y2="45" stroke="#D4AF37" strokeWidth="1.2" />

              {/* 2. White Paper Cigarette Column */}
              <rect 
                x="52" 
                y="33" 
                width="78" 
                height="12" 
                fill={isDarkMode ? '#E2E8F0' : '#FFFFFF'} 
                stroke={isDarkMode ? '#94A3B8' : '#CBD5E1'} 
                strokeWidth="0.8" 
              />
              {/* Paper Highlight */}
              <rect 
                x="52" 
                y="34" 
                width="78" 
                height="2.5" 
                fill="rgba(255, 255, 255, 0.45)" 
              />
              <line x1="74" y1="34" x2="74" y2="44" stroke={isDarkMode ? '#CBD5E1' : '#E2E8F0'} strokeWidth="0.5" />
              <line x1="96" y1="34" x2="96" y2="44" stroke={isDarkMode ? '#CBD5E1' : '#E2E8F0'} strokeWidth="0.5" />
              <line x1="118" y1="34" x2="118" y2="44" stroke={isDarkMode ? '#CBD5E1' : '#E2E8F0'} strokeWidth="0.5" />

              {/* 3. Ash Cap with Textured Organic Edge & Burning Ember Tip */}
              {/* Charred paper burn ring at seam x=129.5 - 130.5 */}
              <path 
                d="M129.5 33 C130.2 36, 129.8 40, 130 45" 
                stroke="#78350F" 
                strokeWidth="0.9" 
                strokeDasharray="1.5 1" 
                opacity="0.85" 
              />

              {/* Textured Ash Cap Body */}
              <path 
                d="M130 33 L134.5 33.3 C135.8 34.5, 136.2 36, 135.5 37.5 C136.5 39, 136.2 41, 135.2 42.5 C135.8 43.8, 134.5 44.8, 130 45 Z" 
                fill="#374151" 
                stroke="#1F2937" 
                strokeWidth="0.5" 
              />

              {/* Ash Edge Speckles & Texture */}
              <circle cx="131.8" cy="35" r="0.75" fill="#9CA3AF" opacity="0.9" />
              <circle cx="133.5" cy="42" r="0.7" fill="#6B7280" opacity="0.9" />
              <circle cx="131.2" cy="38.5" r="0.6" fill="#D1D5DB" opacity="0.85" />
              <circle cx="133.2" cy="36.5" r="0.5" fill="#111827" opacity="0.7" />
              <circle cx="132.8" cy="40.5" r="0.55" fill="#4B5563" opacity="0.8" />

              {/* Soft Warm Radial Ember Halo (Pulsing Glow) */}
              <circle 
                cx="135.5" 
                cy="39" 
                r="6.5" 
                fill="url(#emberHaloGlow)" 
                filter="url(#emberGlowFilter)" 
                className="animate-warm-ember" 
              />

              {/* Burning Ember Tip Body with Warm Orange/Vermilion Gradient */}
              <path 
                d="M134 35.5 C135.6 35, 137.6 36.6, 137 39 C137.6 41.4, 135.6 43, 134 42.5 C135.2 41, 135.3 37, 134 35.5 Z" 
                fill="url(#emberRadialCore)" 
                className="animate-warm-ember" 
              />

              {/* Hot Incandescent Filament Spark at Center of Ember */}
              <circle 
                cx="135.8" 
                cy="38.9" 
                r="1.2" 
                fill="#FFFBEB" 
                className="animate-warm-ember" 
              />
            </svg>
          </div>
        </div>

        {/* Right: Weekly (× 7) and Monthly (× 30) Aggregates */}
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          {/* Weekly Tile */}
          <div className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] px-3.5 py-2.5 flex flex-col items-center min-w-[90px] shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
              Weekly (× 7)
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-ink dark:text-stone-100 tabular-nums mt-0.5">
              ~{weeklyCigs}
            </div>
            <span className="text-[10px] text-ink-muted dark:text-stone-400">
              cigs / week
            </span>
          </div>

          {/* Monthly Tile */}
          <div className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] px-3.5 py-2.5 flex flex-col items-center min-w-[95px] shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400">
              Monthly (× 30)
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-ink dark:text-stone-100 tabular-nums mt-0.5">
              ~{monthlyCigs}
            </div>
            <span className="text-[10px] text-ink-muted dark:text-stone-400">
              cigs / month
            </span>
          </div>
        </div>
      </div>

      {/* 2. PLAIN-ENGLISH SUMMARY LINE & DYNAMIC HABIT SAVINGS NOTIFICATION */}
      <div className="my-4 space-y-2">
        <div className="flex items-start gap-2 text-xs sm:text-sm text-ink dark:text-stone-200 font-medium leading-relaxed">
          <Info className="h-4 w-4 text-ink-muted dark:text-stone-400 shrink-0 mt-0.5" />
          <div>
            <span>
              {aqiTier === 'good'
                ? `In ${currentCity.name}, ambient PM2.5 (${currentCity.pm25} µg/m³) is within safe baseline limits. Continuous fine particulate exposure delivers negligible toxic tobacco equivalence.`
                : aqiTier === 'moderate'
                ? `In ${currentCity.name}, breathing ambient air with PM2.5 of ${currentCity.pm25} µg/m³ for 24 hours equates to smoking ~${activeDailyCigs} passive cigarettes per day.`
                : aqiTier === 'poor'
                ? `Elevated fine dust in ${currentCity.name}: 24-hour breathing exposure delivers toxic particulate load equivalent to smoking ~${activeDailyCigs} cigarettes daily.`
                : aqiTier === 'unhealthy'
                ? `Unhealthy particulate blanket across ${currentCity.name}: continuous 24-hour exposure equals smoking ~${activeDailyCigs} cigarettes daily.`
                : `Severe thermal smog trap across ${currentCity.name}: Heavy nocturnal particulate trapping delivers toxic fine particle dose equivalent to smoking ~${activeDailyCigs} cigarettes daily.`}
            </span>

            {/* Dynamic Habit Savings Highlight */}
            {hasHabitSavings ? (
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-sage-300 dark:border-sage-800 bg-sage-50 dark:bg-sage-950/70 px-2.5 py-1 text-xs text-sage-800 dark:text-sage-200 font-semibold shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                <span>
                  Active Protection: Your {adoptedActionCount} adopted habits prevent ~{avoidedDailyCigs} cigarettes/day (~{weeklyAvoidedCigs} cigs/week avoided)!
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Credibility Reference Note & Disclaimer - Single Clean Line with Generous Spacing */}
        <div className="py-2.5 my-2 border-t border-stone-200/70 dark:border-[#2D3A34] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-ink-muted dark:text-stone-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span>Source:</span>
            <strong className="font-semibold text-ink dark:text-stone-200">Berkeley Earth</strong>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span>22 µg/m³ 24h PM2.5 ≈ 1 cigarette / day</span>
          </div>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 italic">
            Standardized 24-hour daily inhalation volume
          </span>
        </div>
      </div>

      {/* 3. SOLUTIONS FOR CURRENT AQI: Clean 2x2 Grid with Generous Width */}
      <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-stone-100 whitespace-nowrap">
              Solutions for Current AQI
            </span>
            <span className="font-mono text-xs font-bold text-ink-muted dark:text-stone-400 whitespace-nowrap">
              · {currentCity.currentAQI} {currentCity.aqiCategory.toUpperCase()}
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-ink-muted dark:text-stone-400 whitespace-nowrap shrink-0">
            <span>Protocol:</span>
            <strong className="text-ink dark:text-stone-200 font-semibold">
              {currentCity.currentAQI > 200 ? 'Active Defense' : currentCity.currentAQI > 100 ? 'Precautionary' : 'Safe Ventilation'}
            </strong>
          </span>
        </div>

        {/* Clean 2x2 Responsive Grid */}
        <div className="grid grid-cols-2 gap-3">
          {actionTiles.map((tile) => (
            <div
              key={tile.id}
              className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:border-stone-400 dark:hover:border-[#3E4F47] dark:hover:bg-[#28332E] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-[#1A221F] border border-stone-200 dark:border-[#2B3833] text-ink dark:text-stone-200 shadow-2xs">
                    {tile.icon}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider border shadow-2xs ${getUrgencyBadgeStyle(
                      tile.urgency
                    )}`}
                  >
                    {tile.urgency}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-ink dark:text-stone-100">
                  {tile.title}
                </div>
              </div>

              <div className="text-[11px] text-ink-muted dark:text-stone-400 font-medium mt-2 pt-2 border-t border-stone-200/80 dark:border-[#2D3A34] leading-snug">
                {tile.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
