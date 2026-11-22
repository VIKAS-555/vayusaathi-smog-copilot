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
      {/* Real CSS @keyframes for continuous soft rising smoke puffs & ember pulse */}
      <style>{`
        @keyframes smokePuffRise1 {
          0% {
            transform: translate(0, 0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.75;
          }
          55% {
            transform: translate(6px, -18px) scale(1.4);
            opacity: 0.45;
          }
          85% {
            transform: translate(12px, -36px) scale(2.1);
            opacity: 0.15;
          }
          100% {
            transform: translate(16px, -46px) scale(2.6);
            opacity: 0;
          }
        }

        @keyframes smokePuffRise2 {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          60% {
            transform: translate(-5px, -20px) scale(1.5);
            opacity: 0.4;
          }
          85% {
            transform: translate(-10px, -40px) scale(2.3);
            opacity: 0.12;
          }
          100% {
            transform: translate(-14px, -52px) scale(2.8);
            opacity: 0;
          }
        }

        @keyframes smokePuffRise3 {
          0% {
            transform: translate(0, 0) scale(0.7);
            opacity: 0;
          }
          25% {
            opacity: 0.65;
          }
          65% {
            transform: translate(8px, -22px) scale(1.6);
            opacity: 0.35;
          }
          100% {
            transform: translate(14px, -48px) scale(2.5);
            opacity: 0;
          }
        }

        @keyframes smokePuffRise4 {
          0% {
            transform: translate(0, 0) scale(0.55);
            opacity: 0;
          }
          18% {
            opacity: 0.6;
          }
          60% {
            transform: translate(-7px, -24px) scale(1.7);
            opacity: 0.3;
          }
          100% {
            transform: translate(-16px, -54px) scale(2.9);
            opacity: 0;
          }
        }

        @keyframes smokeFilamentWaft1 {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          25% {
            opacity: 0.6;
          }
          70% {
            transform: translateY(-22px) scaleX(1.3) translateX(4px);
            opacity: 0.25;
          }
          100% {
            transform: translateY(-38px) scaleX(1.6) translateX(8px);
            opacity: 0;
          }
        }

        @keyframes smokeFilamentWaft2 {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          30% {
            opacity: 0.55;
          }
          75% {
            transform: translateY(-26px) scaleX(1.4) translateX(-5px);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-42px) scaleX(1.8) translateX(-9px);
            opacity: 0;
          }
        }

        @keyframes emberPulseGlow {
          0%, 100% {
            opacity: 0.85;
            filter: drop-shadow(0 0 2px #EF4444);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 7px #F59E0B);
          }
        }

        .smoke-puff-1 {
          animation: smokePuffRise1 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }
        .smoke-puff-2 {
          animation: smokePuffRise2 3.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 0.8s;
        }
        .smoke-puff-3 {
          animation: smokePuffRise3 4.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 1.6s;
        }
        .smoke-puff-4 {
          animation: smokePuffRise4 3.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 2.4s;
        }
        .smoke-filament-1 {
          animation: smokeFilamentWaft1 2.8s ease-out infinite;
        }
        .smoke-filament-2 {
          animation: smokeFilamentWaft2 3.4s ease-out infinite 0.9s;
        }
        .animate-ember-glow {
          animation: emberPulseGlow 2s ease-in-out infinite;
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
                {/* Soft blur filter for realistic atmospheric smoke puffs */}
                <filter id="softSmokeBlur" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
                <filter id="subtleSmokeBlur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="1.5" />
                </filter>

                {/* Radial gradient for soft organic smoke puffs */}
                <radialGradient id="smokePuffGrad" cx="45%" cy="45%" r="55%">
                  <stop offset="0%" stopColor={isDarkMode ? "rgba(241, 245, 249, 0.75)" : "rgba(100, 116, 139, 0.65)"} />
                  <stop offset="50%" stopColor={isDarkMode ? "rgba(203, 213, 225, 0.4)" : "rgba(148, 163, 184, 0.35)"} />
                  <stop offset="85%" stopColor={isDarkMode ? "rgba(148, 163, 184, 0.15)" : "rgba(203, 213, 225, 0.12)"} />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Multiple Soft Smoke Puffs Rising from Glowing Ember Tip (origin at x=135.5, y=39) */}
              <g className="smoke-puffs" style={{ transformOrigin: '135.5px 39px' }}>
                {/* Puff 1 */}
                <circle
                  cx="135.5"
                  cy="39"
                  r="7"
                  fill="url(#smokePuffGrad)"
                  filter="url(#softSmokeBlur)"
                  className="smoke-puff-1"
                  style={{ transformOrigin: '135.5px 39px' }}
                />
                {/* Puff 2 */}
                <circle
                  cx="135.5"
                  cy="39"
                  r="8.5"
                  fill="url(#smokePuffGrad)"
                  filter="url(#softSmokeBlur)"
                  className="smoke-puff-2"
                  style={{ transformOrigin: '135.5px 39px' }}
                />
                {/* Puff 3 */}
                <ellipse
                  cx="135.5"
                  cy="39"
                  rx="9"
                  ry="7"
                  fill="url(#smokePuffGrad)"
                  filter="url(#softSmokeBlur)"
                  className="smoke-puff-3"
                  style={{ transformOrigin: '135.5px 39px' }}
                />
                {/* Puff 4 */}
                <circle
                  cx="135.5"
                  cy="39"
                  r="10"
                  fill="url(#smokePuffGrad)"
                  filter="url(#softSmokeBlur)"
                  className="smoke-puff-4"
                  style={{ transformOrigin: '135.5px 39px' }}
                />

                {/* Wispy Rising Smoke Filaments from tip */}
                <path
                  d="M135.5 39 C137 28, 133 20, 137 10 C140 2, 134 -6, 136 -16"
                  fill="none"
                  stroke={isDarkMode ? 'rgba(226, 232, 240, 0.5)' : 'rgba(100, 116, 139, 0.45)'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  filter="url(#subtleSmokeBlur)"
                  className="smoke-filament-1"
                />
                <path
                  d="M135.5 39 C134 26, 140 18, 135 8 C132 0, 138 -8, 134 -18"
                  fill="none"
                  stroke={isDarkMode ? 'rgba(203, 213, 225, 0.4)' : 'rgba(148, 163, 184, 0.35)'}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  filter="url(#subtleSmokeBlur)"
                  className="smoke-filament-2"
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

              {/* 3. Ash Cap & Burning Red/Orange Ember Tip */}
              <path 
                d="M130 33 L136 34 C137 35, 137 43, 136 44 L130 45 Z" 
                fill="#475569" 
              />
              {/* Glowing Fiery Ember Core */}
              <circle 
                cx="135.5" 
                cy="39" 
                r="3.2" 
                fill="#EF4444" 
                className="animate-ember-glow" 
              />
              <circle 
                cx="135.5" 
                cy="39" 
                r="1.6" 
                fill="#F59E0B" 
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

        {/* Credibility Reference Note & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-ink-muted dark:text-stone-400 font-mono pt-1">
          <span>
            Source: <strong className="font-semibold text-ink dark:text-stone-300">Berkeley Earth</strong> (22 µg/m³ 24h PM2.5 ≈ 1 cigarette/day)
          </span>
          <span className="italic text-[10px]">
            Based on 24-hour continuous PM2.5 exposure and EPA/WHO standardized daily inhalation volume.
          </span>
        </div>
      </div>

      {/* 3. SOLUTIONS FOR CURRENT AQI: 4 Action Tiles (Air Purifier, Car Filter, N95 Mask, Stay Indoor) */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-stone-100">
              Solutions for Current AQI
            </span>
            <span className="text-[11px] font-mono text-ink-muted dark:text-stone-400">
              · Calibrated to AQI {currentCity.currentAQI} ({currentCity.aqiCategory})
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-ink-muted dark:text-stone-400">
            <span>Protocol:</span>
            <strong className="text-ink dark:text-stone-200">
              {currentCity.currentAQI > 200 ? 'Active Smog Defense' : currentCity.currentAQI > 100 ? 'Precautionary Shield' : 'Healthy Ventilation'}
            </strong>
          </span>
        </div>

        {/* 4 Responsive Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
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
