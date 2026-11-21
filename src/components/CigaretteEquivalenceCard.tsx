import React from 'react';
import { CitySmogContext, ImpactSimulationResults } from '../types';
import { getAQITier, getAQIStyle } from '../lib/aqiScale';
import { 
  Wind, 
  Car, 
  ShieldCheck, 
  Home, 
  Info, 
  HeartPulse, 
  Sparkles,
  AlertTriangle,
  CheckCircle2
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
  // 22 µg/m³ 24h PM2.5 ≈ 1 cigarette/day (≈ 220 µg inhaled daily dose at 10 m³ breathing volume)
  const aqiTier = getAQITier(currentCity.currentAQI, currentCity.aqiCategory);
  const aqiStyle = getAQIStyle(currentCity.currentAQI, isDarkMode, currentCity.aqiCategory);

  // Active daily cigarette equivalent calculated from the user's modeled inhaled dose
  const activeDailyCigs = Math.max(
    0.1,
    Number((impact.adoptedDailyInhaledDoseUg / 220).toFixed(1))
  );

  // Unmanaged baseline (if user had zero mitigation habits active)
  const baselineDailyCigs = Math.max(
    0.1,
    Number((impact.baselineDailyInhaledDoseUg / 220).toFixed(1))
  );

  // Daily cigarettes avoided thanks to user's adopted habits
  const avoidedDailyCigs = impact.passiveCigaretteEquivalentAvoidedDaily;
  const hasHabitSavings = avoidedDailyCigs >= 0.1 && adoptedActionCount > 0;

  // Multipliers for Weekly (× 7) and Monthly (× 30)
  const weeklyCigs = Math.round(activeDailyCigs * 7);
  const monthlyCigs = Math.round(activeDailyCigs * 30);
  const weeklyAvoidedCigs = Math.round(avoidedDailyCigs * 7);

  // 2. Derive Quick Actions based on AQI and PM2.5
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
      carTip = 'Internal AC recirc + HEPA filter';
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
      maskTip = 'Recommended for asthmatic / elderly';
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
      stayTip = 'Shift heavy cardio to afternoon or gym';
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

  // Helper for Urgency Badge styles
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
    <div className="rounded-2xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 sm:p-6 shadow-xs transition-colors">
      {/* Dynamic Keyframes for smooth rising smoke animation */}
      <style>{`
        @keyframes smokeRise1 {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          25% {
            opacity: 0.65;
          }
          65% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(-24px) scaleX(1.4) translateX(4px);
            opacity: 0;
          }
        }
        @keyframes smokeRise2 {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          30% {
            opacity: 0.55;
          }
          75% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(-30px) scaleX(1.6) translateX(-6px);
            opacity: 0;
          }
        }
        @keyframes emberPulse {
          0%, 100% {
            opacity: 0.85;
            filter: drop-shadow(0 0 2px #EF4444);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 6px #F59E0B);
          }
        }
        .animate-smoke-1 {
          animation: smokeRise1 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-smoke-2 {
          animation: smokeRise2 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.9s;
        }
        .animate-ember {
          animation: emberPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* 1. TOP HERO ROW: Bold Cigarettes per Day + Animated SVG Cigarette + Weekly/Monthly Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-stone-200 dark:border-stone-800">
        {/* Left: Cigarette Number & Label paired with Animated SVG Cigarette */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Main Number & Unit */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-stone-400 mb-0.5">
              <HeartPulse className="h-3.5 w-3.5 text-terracotta-600 dark:text-terracotta-400" />
              <span>Cigarette Equivalence</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span 
                className="font-mono text-4xl sm:text-5xl font-black tracking-tight tabular-nums"
                style={{ color: aqiStyle.text }}
              >
                ~{activeDailyCigs}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base text-ink dark:text-stone-100 leading-tight">
                  Cigarettes / day
                </span>
                <span className="text-[11px] font-mono text-ink-muted dark:text-stone-400">
                  PM2.5 Inhalation Equivalence
                </span>
              </div>
            </div>
          </div>

          {/* Clean Vector SVG Cigarette Illustration with Rising Smoke Animation */}
          <div 
            className="hidden xs:flex items-center justify-center shrink-0 pl-1 select-none pointer-events-none"
            aria-hidden="true"
          >
            <svg 
              viewBox="0 0 160 64" 
              className="w-28 sm:w-36 h-14 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rising Smoke Wisps from Burning Ember Tip (x=136, y=36) */}
              <g className="smoke-container">
                {/* Smoke Ribbon 1 */}
                <path
                  d="M136 36 C136 24, 142 16, 137 4"
                  fill="none"
                  stroke={isDarkMode ? 'rgba(226, 232, 240, 0.7)' : 'rgba(100, 116, 139, 0.65)'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-smoke-1"
                />
                {/* Smoke Ribbon 2 */}
                <path
                  d="M137 36 C141 26, 133 18, 143 2"
                  fill="none"
                  stroke={isDarkMode ? 'rgba(203, 213, 225, 0.5)' : 'rgba(148, 163, 184, 0.55)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-smoke-2"
                />
              </g>

              {/* Drop Shadow underneath cigarette cylinder */}
              <ellipse 
                cx="84" 
                cy="46" 
                rx="52" 
                ry="3.5" 
                fill={isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)'} 
              />

              {/* Main Cigarette Body Tube */}
              {/* 1. Filter Section (Cork / Tan) */}
              <rect 
                x="24" 
                y="32" 
                width="34" 
                height="12" 
                rx="2" 
                fill="#C68B59" 
                stroke={isDarkMode ? '#8A5830' : '#A06839'} 
                strokeWidth="0.8" 
              />
              {/* Filter Cork Fine Texture Lines */}
              <line x1="33" y1="33" x2="33" y2="43" stroke="#B27845" strokeWidth="0.6" strokeDasharray="1 1.5" />
              <line x1="42" y1="33" x2="42" y2="43" stroke="#B27845" strokeWidth="0.6" strokeDasharray="1 1.5" />
              <line x1="51" y1="33" x2="51" y2="43" stroke="#B27845" strokeWidth="0.6" strokeDasharray="1 1.5" />
              {/* Filter Golden Wrap Ring Line */}
              <line x1="57.5" y1="32" x2="57.5" y2="44" stroke="#D4AF37" strokeWidth="1" />

              {/* 2. White Paper Cigarette Column */}
              <rect 
                x="58" 
                y="32" 
                width="74" 
                height="12" 
                fill={isDarkMode ? '#E2E8F0' : '#FFFFFF'} 
                stroke={isDarkMode ? '#94A3B8' : '#CBD5E1'} 
                strokeWidth="0.8" 
              />
              {/* Paper cylinder shading highlight */}
              <rect 
                x="58" 
                y="33" 
                width="74" 
                height="2.5" 
                fill="rgba(255, 255, 255, 0.4)" 
              />
              {/* Fine paper ring banding lines */}
              <line x1="78" y1="33" x2="78" y2="43" stroke={isDarkMode ? '#CBD5E1' : '#E2E8F0'} strokeWidth="0.5" />
              <line x1="98" y1="33" x2="98" y2="43" stroke={isDarkMode ? '#CBD5E1' : '#E2E8F0'} strokeWidth="0.5" />
              <line x1="118" y1="33" x2="118" y2="43" stroke={isDarkMode ? '#CBD5E1' : '#E2E8F0'} strokeWidth="0.5" />

              {/* 3. Ash Cap & Burning Red/Orange Ember Tip */}
              <path 
                d="M132 32 L137 33 C138 34, 138 42, 137 43 L132 44 Z" 
                fill="#475569" 
              />
              {/* Glowing Fiery Ember Core */}
              <circle 
                cx="136" 
                cy="38" 
                r="3" 
                fill="#EF4444" 
                className="animate-ember" 
              />
              <circle 
                cx="136" 
                cy="38" 
                r="1.5" 
                fill="#F59E0B" 
              />
            </svg>
          </div>
        </div>

        {/* Right: Weekly (× 7) and Monthly (× 30) Aggregates */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Weekly Tile */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 px-3.5 py-2.5 flex flex-col items-center min-w-[90px] shadow-2xs">
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
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/60 px-3.5 py-2.5 flex flex-col items-center min-w-[95px] shadow-2xs">
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
                ? `In ${currentCity.name}, ambient PM2.5 (${currentCity.pm25} µg/m³) is within WHO annual guidance. Inhaled fine particulate load delivers minimal cardiovascular and pulmonary inflammatory strain.`
                : aqiTier === 'moderate'
                ? `In ${currentCity.name}, breathing ambient air with PM2.5 of ${currentCity.pm25} µg/m³ for 24 hours equates to smoking ~${activeDailyCigs} passive cigarettes per day.`
                : aqiTier === 'poor'
                ? `Elevated photochemical stagnation in ${currentCity.name}: 24-hour breathing exposure delivers toxic fine particulate load equivalent to ~${activeDailyCigs} cigarettes daily.`
                : aqiTier === 'unhealthy'
                ? `Unhealthy particulate blanket across ${currentCity.name} airshed: continuous 24-hour exposure equals smoking ~${activeDailyCigs} cigarettes daily.`
                : `Severe thermal smog trap in ${currentCity.name}: Dense cold-air capping delivers heavy toxic particulate load equivalent to smoking ~${activeDailyCigs} cigarettes daily.`}
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
            Source: <strong className="font-semibold text-ink dark:text-stone-300">Berkeley Earth Environmental Rule</strong> (Muller &amp; Rohde: 22 µg/m³ 24h PM2.5 ≈ 1 cigarette/day)
          </span>
          <span className="italic text-[10px]">
            Based on 24-hour continuous PM2.5 exposure at ~10 m³/day inhalation.
          </span>
        </div>
      </div>

      {/* 3. QUICK SOLUTIONS STRIP: 4 Action Tiles (Air Purifier, Car Filter, N95 Mask, Stay Indoor) */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-stone-100">
              Quick Protection Actions
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
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-ink dark:text-stone-200 shadow-2xs">
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

              <div className="text-[11px] text-ink-muted dark:text-stone-400 font-medium mt-2 pt-2 border-t border-stone-200/80 dark:border-stone-700/80 leading-snug">
                {tile.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
