import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CitySmogContext } from '../types';
import { getAQIStyle } from '../lib/aqiScale';

interface MetroCitiesGridProps {
  cities: CitySmogContext[];
  currentCityId: string;
  onSelectCity: (city: CitySmogContext) => void;
  locationMatchedCityId?: string | null;
}

// 8 Fine-Line Architectural Landmark SVGs crafted precisely for the metro cards
export const MetroLandmarkLineArt: React.FC<{ cityId: string; className?: string }> = ({ cityId, className = 'w-16 h-16' }) => {
  const id = (cityId || '').toLowerCase();

  // 1. Ahmedabad: Sidi Saiyyed Mosque carved jaali arches
  if (id.includes('ahmedabad')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Base ground line */}
        <line x1="6" y1="68" x2="74" y2="68" />
        {/* Plinth */}
        <rect x="10" y="64" width="60" height="4" />
        {/* Outer Mosque wall */}
        <rect x="14" y="32" width="52" height="32" />
        {/* Left arched jali */}
        <path d="M20 64 V44 C20 38 32 38 32 44 V64" />
        <path d="M26 44 V64" strokeDasharray="1.5 2" />
        <circle cx="26" cy="48" r="3" strokeDasharray="1 1.5" />
        {/* Right arched jali (Tree of Life) */}
        <path d="M48 64 V44 C48 38 60 38 60 44 V64" />
        <path d="M54 44 V64" strokeDasharray="1.5 2" />
        <circle cx="54" cy="48" r="3" strokeDasharray="1 1.5" />
        {/* Center Grand Arch Opening */}
        <path d="M34 64 V38 C34 32 46 32 46 38 V64" />
        {/* Parapet crenellations */}
        <path d="M14 32 H66 V28 H14 Z" />
        <path d="M18 28 V24 H22 V28 H26 V24 H30 V28" />
        <path d="M50 28 V24 H54 V28 H58 V24 H62 V28" />
        {/* Left Minaret Turret */}
        <rect x="8" y="24" width="6" height="40" />
        <path d="M7 24 C7 18 15 18 15 24" />
        <line x1="11" y1="18" x2="11" y2="13" />
        {/* Right Minaret Turret */}
        <rect x="66" y="24" width="6" height="40" />
        <path d="M65 24 C65 18 73 18 73 24" />
        <line x1="69" y1="18" x2="69" y2="13" />
        {/* Center Chhatri dome */}
        <path d="M36 28 C36 20 44 20 44 28" />
        <line x1="40" y1="20" x2="40" y2="15" />
      </svg>
    );
  }

  // 2. Bangalore / Bengaluru: Vidhana Soudha grand dome and colonnade
  if (id.includes('bengaluru') || id.includes('bangalore')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="68" x2="74" y2="68" />
        {/* Stepped Base Stairs */}
        <line x1="12" y1="65" x2="68" y2="65" />
        <line x1="16" y1="62" x2="64" y2="62" />
        <line x1="20" y1="59" x2="60" y2="59" />
        {/* Main facade */}
        <rect x="18" y="44" width="44" height="15" />
        {/* Pillars */}
        <line x1="24" y1="44" x2="24" y2="59" />
        <line x1="30" y1="44" x2="30" y2="59" />
        <line x1="36" y1="44" x2="36" y2="59" />
        <line x1="44" y1="44" x2="44" y2="59" />
        <line x1="50" y1="44" x2="50" y2="59" />
        <line x1="56" y1="44" x2="56" y2="59" />
        {/* Colonnaded Pediment */}
        <polygon points="32,44 40,36 48,44" />
        {/* Center Neo-Dravidian Grand Dome */}
        <rect x="34" y="30" width="12" height="6" />
        <path d="M33 30 C33 16 47 16 47 30" />
        <line x1="40" y1="16" x2="40" y2="10" />
        <circle cx="40" cy="9" r="1.5" />
        {/* Left Wing Small Dome */}
        <path d="M20 44 C20 36 28 36 28 44" />
        <line x1="24" y1="36" x2="24" y2="32" />
        {/* Right Wing Small Dome */}
        <path d="M52 44 C52 36 60 36 60 44" />
        <line x1="56" y1="36" x2="56" y2="32" />
      </svg>
    );
  }

  // 3. Chennai: Kapaleeshwarar Temple Gopuram (Dravidian stepped pyramidal tower)
  if (id.includes('chennai') || id.includes('madras')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="68" x2="70" y2="68" />
        {/* Stepped plinth */}
        <rect x="18" y="63" width="44" height="5" />
        <rect x="22" y="58" width="36" height="5" />
        {/* Gate opening */}
        <path d="M34 68 V52 C34 47 46 47 46 52 V68" />
        {/* Tier 1 */}
        <polygon points="24,58 27,48 53,48 56,58" />
        <line x1="27" y1="48" x2="53" y2="48" />
        <rect x="36" y="50" width="8" height="4" />
        {/* Tier 2 */}
        <polygon points="28,48 31,38 49,38 52,48" />
        <line x1="31" y1="38" x2="49" y2="38" />
        <rect x="37" y="40" width="6" height="4" />
        {/* Tier 3 */}
        <polygon points="32,38 34,30 46,30 48,38" />
        <line x1="34" y1="30" x2="46" y2="30" />
        {/* Tier 4 / Crown Sala Arch */}
        <path d="M33 30 C33 22 47 22 47 30" />
        {/* Kalasam Spires */}
        <line x1="36" y1="22" x2="36" y2="15" />
        <line x1="40" y1="20" x2="40" y2="12" />
        <line x1="44" y1="22" x2="44" y2="15" />
      </svg>
    );
  }

  // 4. Hyderabad: Charminar with four grand minarets and central arches
  if (id.includes('hyderabad')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="68" x2="72" y2="68" />
        {/* Base Block */}
        <rect x="22" y="44" width="36" height="24" />
        {/* Grand Arch Opening */}
        <path d="M28 68 V52 C28 42 52 42 52 52 V68" />
        {/* Upper double arcade gallery */}
        <rect x="20" y="38" width="40" height="6" />
        <rect x="24" y="32" width="32" height="6" />
        <line x1="28" y1="32" x2="28" y2="38" />
        <line x1="34" y1="32" x2="34" y2="38" />
        <line x1="40" y1="32" x2="40" y2="38" />
        <line x1="46" y1="32" x2="46" y2="38" />
        <line x1="52" y1="32" x2="52" y2="38" />
        {/* Left Outer Minaret */}
        <polygon points="14,68 18,18 23,18 26,68" />
        <line x1="16" y1="46" x2="24" y2="46" />
        <line x1="17" y1="32" x2="23" y2="32" />
        <path d="M18 18 C18 12 23 12 23 18" />
        <line x1="20.5" y1="12" x2="20.5" y2="7" />
        {/* Right Outer Minaret */}
        <polygon points="54,68 57,18 62,18 66,68" />
        <line x1="56" y1="46" x2="64" y2="46" />
        <line x1="57" y1="32" x2="63" y2="32" />
        <path d="M57 18 C57 12 62 12 62 18" />
        <line x1="59.5" y1="12" x2="59.5" y2="7" />
        {/* Center small dome */}
        <path d="M36 32 C36 26 44 26 44 32" />
        <line x1="40" y1="26" x2="40" y2="22" />
      </svg>
    );
  }

  // 5. Kolkata: Victoria Memorial dome and Howrah Bridge cantilever
  if (id.includes('kolkata') || id.includes('calcutta')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="68" x2="74" y2="68" />
        {/* Howrah Bridge backdrop trusses on left */}
        <path d="M8 68 L16 38 L24 68" strokeDasharray="1 1.5" opacity="0.6" />
        <line x1="16" y1="38" x2="2" y2="68" strokeDasharray="1 1.5" opacity="0.4" />
        {/* Victoria Memorial Base Steps */}
        <rect x="20" y="64" width="44" height="4" />
        <rect x="23" y="60" width="38" height="4" />
        {/* Main facade */}
        <rect x="25" y="46" width="34" height="14" />
        {/* Colonnade */}
        <line x1="36" y1="46" x2="36" y2="60" />
        <line x1="41" y1="46" x2="41" y2="60" />
        <line x1="46" y1="46" x2="46" y2="60" />
        {/* Pediment */}
        <polygon points="34,46 41,38 48,46" />
        {/* Grand Marble Dome Drum & Cupola */}
        <rect x="36" y="32" width="10" height="6" />
        <path d="M35 32 C35 18 47 18 47 32" />
        {/* Angel of Victory Spire */}
        <line x1="41" y1="18" x2="41" y2="10" />
        <path d="M38 10 Q41 7 44 10" />
        {/* Left Corner Cupola */}
        <path d="M26 46 C26 40 31 40 31 46" />
        <line x1="28.5" y1="40" x2="28.5" y2="36" />
        {/* Right Corner Cupola */}
        <path d="M51 46 C51 40 56 40 56 46" />
        <line x1="53.5" y1="40" x2="53.5" y2="36" />
      </svg>
    );
  }

  // 6. Mumbai: Gateway of India majestic basalt arch & turrets
  if (id.includes('mumbai') || id.includes('bombay')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="68" x2="72" y2="68" />
        {/* Stepped Plinth */}
        <rect x="14" y="64" width="52" height="4" />
        {/* Main Central Archway Block */}
        <rect x="20" y="34" width="40" height="30" />
        {/* Grand Arch Opening */}
        <path d="M28 64 V44 C28 34 52 34 52 44 V64" />
        {/* Cornice Parapet */}
        <rect x="18" y="30" width="44" height="4" />
        {/* Central Dome Rising Behind Parapet */}
        <path d="M32 30 C32 18 48 18 48 30" />
        <line x1="40" y1="18" x2="40" y2="12" />
        {/* Left Turret Pier */}
        <rect x="14" y="34" width="8" height="30" />
        <path d="M13 30 C13 22 23 22 23 30" />
        <line x1="18" y1="22" x2="18" y2="16" />
        {/* Right Turret Pier */}
        <rect x="58" y="34" width="8" height="30" />
        <path d="M57 30 C57 22 67 22 67 30" />
        <line x1="62" y1="22" x2="62" y2="16" />
      </svg>
    );
  }

  // 7. New Delhi: India Gate triumphal arch
  if (id.includes('delhi')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="68" x2="70" y2="68" />
        {/* Stepped Base */}
        <rect x="16" y="64" width="48" height="4" />
        <rect x="20" y="60" width="40" height="4" />
        {/* Left Pylon */}
        <rect x="22" y="32" width="10" height="28" />
        {/* Right Pylon */}
        <rect x="48" y="32" width="10" height="28" />
        {/* Grand Arch Opening */}
        <path d="M32 60 V42 C32 34 48 34 48 42 V60" />
        {/* Main Cornice Lintel */}
        <rect x="18" y="28" width="44" height="4" />
        {/* Inscription Attic Block */}
        <rect x="22" y="18" width="36" height="10" />
        {/* Top Stepped Pedestal */}
        <rect x="28" y="15" width="24" height="3" />
        <rect x="34" y="12" width="12" height="3" />
        {/* Ceremonial Urn */}
        <path d="M37 12 C37 8 43 8 43 12 Z" />
      </svg>
    );
  }

  // 8. Pune: Shaniwar Wada Delhi Gate fortified bastions
  if (id.includes('pune') || id.includes('poona')) {
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="68" x2="72" y2="68" />
        {/* Base stone plinth */}
        <rect x="12" y="64" width="56" height="4" />
        {/* Heavy central rampart */}
        <rect x="22" y="36" width="36" height="28" />
        {/* Arched Delhi Darwaja Opening */}
        <path d="M32 64 V48 C32 40 48 40 48 48 V64" />
        {/* Spiked gates lines */}
        <line x1="40" y1="46" x2="40" y2="64" />
        {/* Left Semi-Circular Bastion Tower */}
        <path d="M14 64 V36 C14 26 26 26 26 36 V64" />
        <line x1="14" y1="36" x2="26" y2="36" />
        {/* Right Semi-Circular Bastion Tower */}
        <path d="M54 64 V36 C54 26 66 26 66 36 V64" />
        <line x1="54" y1="36" x2="66" y2="36" />
        {/* Machicolations / Jharokha Parapet */}
        <rect x="20" y="30" width="40" height="6" />
        <polygon points="26,30 40,22 54,30" />
        <line x1="40" y1="22" x2="40" y2="14" />
        <circle cx="40" cy="13" r="1.5" />
      </svg>
    );
  }

  // Universal Fallback Monument
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="68" x2="72" y2="68" />
      <rect x="22" y="40" width="36" height="28" />
      <path d="M30 68 V48 C30 40 50 40 50 48 V68" />
      <polygon points="20,40 40,20 60,40" />
      <line x1="40" y1="20" x2="40" y2="12" />
    </svg>
  );
};

export const MetroCitiesGrid: React.FC<MetroCitiesGridProps> = ({
  cities,
  currentCityId,
  onSelectCity,
  locationMatchedCityId,
}) => {
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);

  // Target the 8 metro cities from the reference screenshot
  const targetIds = [
    'ahmedabad',
    'bengaluru',
    'chennai',
    'hyderabad',
    'kolkata',
    'mumbai',
    'delhi-ncr',
    'pune',
  ];

  // Map each target to its preset
  const metroCities = targetIds
    .map((targetId) => cities.find((c) => c.id === targetId || c.id.includes(targetId)))
    .filter((c): c is CitySmogContext => c !== undefined);

  // Clean city name helper
  const getDisplayName = (city: CitySmogContext) => {
    if (city.id.includes('delhi')) return 'New Delhi';
    if (city.id.includes('bengaluru') || city.id.includes('bangalore')) return 'Bangalore';
    return city.name.split(' (')[0];
  };

  return (
    <section className="w-full rounded-2xl bg-white dark:bg-[#1A221F] border border-stone-300 dark:border-[#2B3833] p-4 sm:p-5 shadow-xs transition-colors">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-4 pb-3 border-b border-stone-200 dark:border-[#2B3833]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink dark:text-stone-100 tracking-tight flex items-center gap-2">
            <span>India&apos;s Metro Cities</span>
          </h2>
          <p className="text-xs font-semibold text-sage-600 dark:text-sage-400 tracking-wide mt-0.5">
            Air Quality Index
          </p>
        </div>
        <span className="text-[11px] font-mono text-ink-muted dark:text-stone-400">
          Tap a city card to update active station, live feeds &amp; exposure engine
        </span>
      </div>

      {/* 8-Card Responsive Grid (4 columns on lg, 2 on md, 1 on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {metroCities.map((city) => {
          const isActive = city.id === currentCityId;
          const aqiStyle = getAQIStyle(city.currentAQI, true, city.aqiCategory);
          const isHovered = hoveredCityId === city.id;
          const displayName = getDisplayName(city);
          const isNearYou = !!locationMatchedCityId && (
            city.id === locationMatchedCityId || 
            city.id.includes(locationMatchedCityId) ||
            locationMatchedCityId.includes(city.id)
          );

          return (
            <div
              key={city.id}
              onClick={() => onSelectCity(city)}
              onMouseEnter={() => setHoveredCityId(city.id)}
              onMouseLeave={() => setHoveredCityId(null)}
              className={`group relative flex items-center justify-between rounded-xl p-3.5 sm:p-4 cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                isActive
                  ? 'bg-stone-100 dark:bg-[#26312C] border-2 border-sage-600 dark:border-sage-400 shadow-md ring-1 ring-sage-600/30 dark:ring-sage-400/30 scale-[1.01]'
                  : 'bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34] hover:border-stone-400 hover:bg-stone-100 dark:hover:bg-[#28332E] dark:hover:border-[#3E4F47] shadow-2xs'
              }`}
            >
              {/* Left Side: Fine-Line Architectural Landmark Illustration */}
              <div className="relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center text-stone-400 dark:text-stone-400 group-hover:text-ink dark:group-hover:text-stone-200 transition-colors">
                <MetroLandmarkLineArt cityId={city.id} className="w-full h-full" />
              </div>

              {/* Right Side: City Name + Colored AQI + Weather Sub-readouts */}
              <div className="flex-1 pl-3.5 flex flex-col justify-between h-full min-w-0">
                {/* Top: City Name + Near You badge + Arrow Up Right icon */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-ink dark:text-stone-100 truncate tracking-tight group-hover:text-ink-light dark:group-hover:text-white">
                      {displayName}
                    </h3>
                    {isNearYou && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                        Near You
                      </span>
                    )}
                  </div>
                  <div className="p-1 rounded-full bg-stone-200/60 dark:bg-white/5 text-ink-muted dark:text-stone-400 group-hover:text-ink dark:group-hover:text-white group-hover:bg-stone-200 dark:group-hover:bg-white/10 transition-all shrink-0">
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>

                {/* Middle: Bold Colored AQI Number */}
                <div className="my-0.5">
                  <span
                    className="font-mono text-2xl sm:text-3xl font-black tracking-tight tabular-nums"
                    style={{ color: aqiStyle.accent }}
                  >
                    {city.currentAQI}
                  </span>
                </div>

                {/* Bottom: Temp & Humidity */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-ink-muted dark:text-stone-400">
                  <span>
                    Temp. <strong className="text-ink dark:text-stone-300 font-semibold">{Math.round(city.temperatureC)}°C</strong>
                  </span>
                  <span>
                    Hum. <strong className="text-ink dark:text-stone-300 font-semibold">{city.humidityPercent}%</strong>
                  </span>
                </div>
              </div>

              {/* Hover Tooltip / Active Status Pill */}
              {isHovered && !isActive && (
                <div className="absolute inset-x-0 bottom-0 bg-stone-100/95 dark:bg-[#161D1A]/95 border-t border-sage-500/30 py-1 text-center text-[10px] font-mono text-sage-700 dark:text-sage-300 backdrop-blur-xs tracking-wide">
                  Visit {displayName} details page ↗
                </div>
              )}
              {isActive && (
                <div className="absolute top-1.5 right-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-600 dark:bg-sage-400" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
