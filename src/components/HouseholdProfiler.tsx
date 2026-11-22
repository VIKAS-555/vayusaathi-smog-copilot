import React from 'react';
import { HouseholdProfile, HouseholdMember, HomeType, PurifierStatus, CommuteMode } from '../types';
import { 
  Users, 
  Home, 
  Wind, 
  Car, 
  Plus, 
  Minus, 
  Trash2, 
  HeartPulse, 
  ShieldCheck,
  Building2,
  Building,
  Trees,
  Train,
  Bike,
  Laptop,
  Sunrise,
  Sunset,
  Sun,
  Check,
  Info
} from 'lucide-react';

interface HouseholdProfilerProps {
  profile: HouseholdProfile;
  onChangeProfile: (updated: HouseholdProfile) => void;
}

export const HouseholdProfiler: React.FC<HouseholdProfilerProps> = ({
  profile,
  onChangeProfile,
}) => {
  const addMember = (role: 'Adult' | 'Child' | 'Senior') => {
    const newMember: HouseholdMember = {
      id: `member-${Date.now()}`,
      role,
      hasRespiratorySensitivity: role === 'Child' || role === 'Senior',
      hoursOutdoorsPerDay: role === 'Child' ? 2 : role === 'Senior' ? 1 : 3,
    };
    onChangeProfile({
      ...profile,
      members: [...profile.members, newMember],
    });
  };

  const removeMember = (id: string) => {
    if (profile.members.length <= 1) return; // Keep at least one member
    onChangeProfile({
      ...profile,
      members: profile.members.filter(m => m.id !== id),
    });
  };

  const toggleMemberSensitivity = (id: string) => {
    onChangeProfile({
      ...profile,
      members: profile.members.map(m => 
        m.id === id ? { ...m, hasRespiratorySensitivity: !m.hasRespiratorySensitivity } : m
      ),
    });
  };

  const updateMemberOutdoorHours = (id: string, hours: number) => {
    onChangeProfile({
      ...profile,
      members: profile.members.map(m => 
        m.id === id ? { ...m, hoursOutdoorsPerDay: hours } : m
      ),
    });
  };

  const incrementMemberOutdoorHours = (id: string, current: number) => {
    updateMemberOutdoorHours(id, Math.min(12, current + 1));
  };

  const decrementMemberOutdoorHours = (id: string, current: number) => {
    updateMemberOutdoorHours(id, Math.max(0, current - 1));
  };

  // 1. Dwelling Type Options Definition
  const DWELLING_OPTIONS: {
    id: HomeType;
    title: string;
    sub: string;
    badge: string;
    badgeStyle: 'safe' | 'warning' | 'alert' | 'neutral';
    icon: React.ReactNode;
  }[] = [
    {
      id: 'high-rise-apartment',
      title: 'High-Rise Apt',
      sub: 'Floor 5+',
      badge: 'Lower ground dust',
      badgeStyle: 'safe',
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      id: 'low-rise-apartment',
      title: 'Low-Rise Apt',
      sub: 'Floors 1–4',
      badge: 'Moderate street dust',
      badgeStyle: 'warning',
      icon: <Building className="h-4 w-4" />,
    },
    {
      id: 'independent-house-street',
      title: 'Street House',
      sub: 'Road frontage',
      badge: 'High dust ingress',
      badgeStyle: 'alert',
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: 'independent-house-interior',
      title: 'Interior House',
      sub: 'Lane buffer',
      badge: 'Buffered microclimate',
      badgeStyle: 'neutral',
      icon: <Trees className="h-4 w-4" />,
    },
  ];

  // 2. Commute Mode Options Definition
  const COMMUTE_OPTIONS: {
    id: CommuteMode;
    label: string;
    sub: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'solo-petrol-car', label: 'Solo Car', sub: 'AC recirculation', icon: <Car className="h-4 w-4" /> },
    { id: 'metro-public-transit', label: 'Metro / Rail', sub: 'Filtered transit', icon: <Train className="h-4 w-4" /> },
    { id: 'two-wheeler', label: 'Two-Wheeler', sub: 'Direct road exposure', icon: <Bike className="h-4 w-4" /> },
    { id: 'carpool-cab', label: 'Shared Cab', sub: 'Carpool cabin', icon: <Users className="h-4 w-4" /> },
    { id: 'work-from-home', label: 'WFH / Walk', sub: 'Zero daily commute', icon: <Laptop className="h-4 w-4" /> },
  ];

  // Commute Exposure Profiles (PM2.5 filtration vs tailpipe intake)
  const getCommuteExposureDetails = (mode: CommuteMode) => {
    switch (mode) {
      case 'solo-petrol-car':
        return {
          title: 'Cabin Air Recirculation Model',
          badge: 'Moderate Shielding (-65% PM2.5)',
          badgeClasses: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          description: 'Cabin AC in recirc mode shields ~65% of roadway PM2.5 with a clean cabin filter, but tailpipe fumes and CO2 build up during stop-and-go traffic crawl.',
        };
      case 'metro-public-transit':
        return {
          title: 'Filtered Transit Corridor',
          badge: 'Optimal Defense (-85% PM2.5)',
          badgeClasses: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
          description: 'Air-conditioned metro cars with high-volume filtration offer the lowest particulate intake per commuter-km and produce zero direct roadway emissions.',
        };
      case 'two-wheeler':
        return {
          title: 'Open Roadway Exposure',
          badge: 'Direct Intake (3.2× Exposure)',
          badgeClasses: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          description: 'Open-air riders face direct tailpipe exhaust plumes and resuspended road dust at breathing height. Tight-fitting N95 respirator strongly advised.',
        };
      case 'carpool-cab':
        return {
          title: 'Shared Fleet & Recirc Ingress',
          badge: 'Shared Footprint (-60% PM2.5)',
          badgeClasses: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
          description: 'Shared vehicular footprint cuts citywide congestion emissions; keep cabin AC recirculating to prevent outside truck and bus exhaust ingress.',
        };
      case 'work-from-home':
        return {
          title: 'Zero Transit Corridor',
          badge: '100% Roadway Avoided',
          badgeClasses: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          description: 'Completely eliminates roadway toxic micro-environments and traffic exhaust spikes; indoor air quality depends on home envelope & filtration.',
        };
    }
  };

  // Quick Distance Preset Pills for Rapid Mobile Tapping
  const DISTANCE_PRESETS = [
    { km: 6, label: '6 km', tag: 'Local' },
    { km: 16, label: '16 km', tag: 'City Core' },
    { km: 24, label: '24 km', tag: 'Typical' },
    { km: 36, label: '36 km', tag: 'Suburban' },
    { km: 50, label: '50 km', tag: 'Cross-NCR' },
  ];

  // 3. Outdoor Workout / Stroll Habit Options Definition
  const EXERCISE_OPTIONS: {
    id: 'None / Indoors' | 'Early Morning (05:00 - 08:00)' | 'Midday (12:00 - 15:00)' | 'Evening (18:00 - 21:00)';
    label: string;
    time: string;
    badge: string;
    badgeStyle: 'alert' | 'safe' | 'warning' | 'neutral';
    icon: React.ReactNode;
  }[] = [
    {
      id: 'Early Morning (05:00 - 08:00)',
      label: 'Early Morning',
      time: '05–08h',
      badge: 'High Inversion',
      badgeStyle: 'alert',
      icon: <Sunrise className="h-3.5 w-3.5" />,
    },
    {
      id: 'Midday (12:00 - 15:00)',
      label: 'Midday',
      time: '12–15h',
      badge: 'Safe Window',
      badgeStyle: 'safe',
      icon: <Sun className="h-3.5 w-3.5" />,
    },
    {
      id: 'Evening (18:00 - 21:00)',
      label: 'Evening',
      time: '18–21h',
      badge: 'Re-Inversion',
      badgeStyle: 'warning',
      icon: <Sunset className="h-3.5 w-3.5" />,
    },
    {
      id: 'None / Indoors',
      label: 'Indoor Only',
      time: 'Home / Gym',
      badge: 'Zero Exposure',
      badgeStyle: 'neutral',
      icon: <Home className="h-3.5 w-3.5" />,
    },
  ];

  // Badge Style Helper
  const getBadgeClasses = (style: 'safe' | 'warning' | 'alert' | 'neutral', isSelected: boolean) => {
    if (isSelected) {
      switch (style) {
        case 'alert':
          return 'bg-white/20 text-white border-white/30 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700/80';
        case 'safe':
          return 'bg-white/20 text-white border-white/30 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700/80';
        case 'warning':
          return 'bg-white/20 text-white border-white/30 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700/80';
        case 'neutral':
        default:
          return 'bg-white/20 text-white border-white/30 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600';
      }
    }
    switch (style) {
      case 'alert':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'safe':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'neutral':
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    }
  };

  return (
    <div className="rounded-2xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-xs transition-colors">
      <div className="border-b border-stone-200 dark:border-[#2B3833] pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-stone-100 flex items-center gap-2">
          <Users className="h-4 w-4 text-ink-muted dark:text-stone-400" />
          <span>Household &amp; Lifestyle Profiler</span>
        </h2>
        <p className="mt-1 text-xs text-ink-muted dark:text-stone-400">
          Exposure calculation adapts to family age demographics, respiratory vulnerability, building envelope infiltration, and commute exposure.
        </p>
      </div>

      {/* 1. Household Members Manager */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-ink dark:text-stone-200">
            Family Members ({profile.members.length})
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => addMember('Child')}
              className="rounded border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] px-2 py-0.5 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors"
            >
              + Child
            </button>
            <button
              type="button"
              onClick={() => addMember('Senior')}
              className="rounded border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] px-2 py-0.5 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors"
            >
              + Senior
            </button>
            <button
              type="button"
              onClick={() => addMember('Adult')}
              className="rounded border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] px-2 py-0.5 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors"
            >
              + Adult
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {profile.members.map((member, idx) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-lg border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] p-2.5 sm:p-2 text-xs transition-colors hover:border-stone-400 dark:hover:border-[#3E4F47]"
            >
              {/* Row 1: Role + Sensitivity Badge */}
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink dark:text-stone-200">
                    #{idx + 1} {member.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleMemberSensitivity(member.id)}
                    className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-colors min-h-[26px] ${
                      member.hasRespiratorySensitivity
                        ? 'border border-terracotta-300 bg-terracotta-50 text-terracotta-700 dark:bg-terracotta-950/70 dark:text-terracotta-300 dark:border-terracotta-800 font-bold'
                        : 'border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-ink-muted dark:text-stone-400 hover:text-ink'
                    }`}
                    title="Toggle Asthma / Bronchitis / Allergy sensitivity"
                  >
                    <HeartPulse className="h-3 w-3 shrink-0" />
                    <span>{member.hasRespiratorySensitivity ? 'Sensitive' : 'Normal'}</span>
                  </button>
                </div>

                {profile.members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="sm:hidden text-stone-400 hover:text-terracotta-600 p-1 min-h-[30px] min-w-[30px] flex items-center justify-center transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Stepper Control for Daily Outdoor Time */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-1.5 sm:pt-0 border-t sm:border-0 border-stone-200/60 dark:border-stone-700/60">
                <span className="text-[11px] text-ink-muted dark:text-stone-400 font-mono">
                  Outdoors:
                </span>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => decrementMemberOutdoorHours(member.id, member.hoursOutdoorsPerDay)}
                      disabled={member.hoursOutdoorsPerDay <= 0}
                      aria-label={`Decrease outdoor hours for ${member.role}`}
                      className="flex items-center justify-center h-8 w-8 sm:h-7 sm:w-7 text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 active:bg-stone-200 dark:active:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-r border-stone-200 dark:border-stone-700 rounded-l-md"
                      title="Decrease 1 hour"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span 
                      className="w-10 sm:w-9 text-center font-mono font-bold text-xs sm:text-[11px] text-ink dark:text-stone-100 tabular-nums select-none"
                      title={`${member.hoursOutdoorsPerDay} hours outdoors per day`}
                    >
                      {member.hoursOutdoorsPerDay}h
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementMemberOutdoorHours(member.id, member.hoursOutdoorsPerDay)}
                      disabled={member.hoursOutdoorsPerDay >= 12}
                      aria-label={`Increase outdoor hours for ${member.role}`}
                      className="flex items-center justify-center h-8 w-8 sm:h-7 sm:w-7 text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 active:bg-stone-200 dark:active:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-stone-200 dark:border-stone-700 rounded-r-md"
                      title="Increase 1 hour"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {profile.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="hidden sm:inline-flex text-stone-400 hover:text-terracotta-600 p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DWELLING TYPE: Clean 2x2 Grid of Selectable Cards + Tactile Window-Sealing Toggle Row */}
      <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-ink dark:text-stone-200 flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
            <span>Dwelling Type &amp; Building Envelope</span>
          </label>
          <span className="text-[10px] font-mono text-ink-muted dark:text-stone-400">
            Affects ambient infiltration
          </span>
        </div>

        {/* 2x2 Grid of Dwelling Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DWELLING_OPTIONS.map((opt) => {
            const isSelected = profile.homeType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeProfile({ ...profile, homeType: opt.id })}
                className={`text-left rounded-xl p-2.5 sm:p-3 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-ink text-white dark:bg-[#242926] dark:text-stone-100 border-ink dark:border-[#E6E2D6] dark:ring-1 dark:ring-[#E6E2D6]/40 shadow-sm'
                    : 'bg-stone-50/80 dark:bg-[#222B27] text-ink dark:text-stone-200 border-stone-200 dark:border-[#2D3A34] hover:border-stone-400 dark:hover:border-[#3E4F47] dark:hover:bg-[#28332E]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white dark:bg-white/10 dark:text-stone-200 dark:border dark:border-white/20'
                        : 'bg-white dark:bg-[#1A221F] text-ink-muted dark:text-stone-400 border border-stone-200 dark:border-[#2D3A34]'
                    }`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-snug">
                        {opt.title}
                      </div>
                      <div className={`text-[10px] font-mono ${
                        isSelected ? 'text-stone-300 dark:text-stone-300' : 'text-ink-muted dark:text-stone-400'
                      }`}>
                        {opt.sub}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-white dark:text-stone-200" />
                  )}
                </div>

                <div className="mt-1">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${getBadgeClasses(
                    opt.badgeStyle,
                    isSelected
                  )}`}>
                    {opt.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Window Weatherstripping: Tactile Toggle Row */}
        <div 
          onClick={() => onChangeProfile({ ...profile, hasWindowWeatherstripping: !profile.hasWindowWeatherstripping })}
          className="mt-2.5 flex items-center justify-between rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] p-2.5 sm:p-3 cursor-pointer hover:border-stone-400 dark:hover:border-[#3E4F47] dark:hover:bg-[#28332E] transition-colors shadow-2xs"
          role="switch"
          aria-checked={profile.hasWindowWeatherstripping}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border ${
              profile.hasWindowWeatherstripping
                ? 'bg-sage-100 text-sage-800 border-sage-300 dark:bg-sage-950 dark:text-sage-200 dark:border-sage-800'
                : 'bg-white dark:bg-stone-900 text-ink-muted dark:text-stone-400 border-stone-200 dark:border-stone-700'
            }`}>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-ink dark:text-stone-100 flex items-center gap-1.5">
                <span>Window Weatherstripping Tape</span>
                <span className="font-mono text-[10px] text-sage-700 dark:text-sage-300 font-bold">
                  (-12% infiltration)
                </span>
              </div>
              <div className="text-[11px] text-ink-muted dark:text-stone-400 font-medium">
                Rubber / foam compression seals along windows &amp; exterior door cracks
              </div>
            </div>
          </div>

          {/* Smooth Sliding Toggle Switch */}
          <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ml-2 ${
            profile.hasWindowWeatherstripping 
              ? 'bg-sage-600 dark:bg-sage-500' 
              : 'bg-stone-300 dark:bg-stone-700'
          }`}>
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              profile.hasWindowWeatherstripping ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
        </div>
      </div>

      {/* 3. Purification Equipment: Compact 3-Segment Selector */}
      <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
        <label className="block text-xs font-bold text-ink dark:text-stone-200 mb-1.5 flex items-center gap-1.5">
          <Wind className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
          <span>Purification Inventory</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'none', label: 'No Purifier' },
            { id: 'single-bedroom', label: '1 Bedroom' },
            { id: 'full-house', label: 'Multi-Room' },
          ].map((item) => {
            const isSelected = profile.purifierStatus === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeProfile({ ...profile, purifierStatus: item.id as PurifierStatus })}
                className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-ink bg-ink text-white dark:bg-[#242926] dark:text-stone-100 dark:border-[#E6E2D6] dark:ring-1 dark:ring-[#E6E2D6]/40 shadow-xs'
                    : 'border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] text-ink-muted dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#28332E] hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DAILY COMMUTE MODE & DISTANCE: Tactile Option Tiles + Dynamic Exposure Note + Distance Presets */}
      <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-ink dark:text-stone-200 flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
            <span>Daily Commute Mode &amp; Distance</span>
          </label>
          <span className="text-[10px] font-mono text-ink-muted dark:text-stone-400">
            Roadway exposure model
          </span>
        </div>

        {/* Balanced 2-Column Grid of Horizontal Commute Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMUTE_OPTIONS.map((opt, idx) => {
            const isSelected = profile.commuteMode === opt.id;
            const isLast = idx === COMMUTE_OPTIONS.length - 1;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeProfile({ ...profile, commuteMode: opt.id })}
                className={`text-left rounded-xl p-2.5 sm:p-3 border transition-all flex items-center justify-between min-h-[52px] ${
                  isLast ? 'sm:col-span-2' : ''
                } ${
                  isSelected
                    ? 'bg-ink text-white dark:bg-[#242926] dark:text-stone-100 border-ink dark:border-[#E6E2D6] dark:ring-1 dark:ring-[#E6E2D6]/40 shadow-sm'
                    : 'bg-stone-50/80 dark:bg-[#222B27] text-ink dark:text-stone-200 border-stone-200 dark:border-[#2D3A34] hover:border-stone-400 dark:hover:border-[#3E4F47] dark:hover:bg-[#28332E]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-white/10 dark:text-stone-200 dark:border dark:border-white/20'
                      : 'bg-white dark:bg-[#1A221F] text-ink-muted dark:text-stone-400 border border-stone-200 dark:border-[#2D3A34]'
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs leading-snug truncate">
                      {opt.label}
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 truncate ${
                      isSelected ? 'text-stone-300 dark:text-stone-300' : 'text-ink-muted dark:text-stone-400'
                    }`}>
                      {opt.sub}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-white dark:text-stone-200 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Transit Air Exposure Profile Note */}
        {(() => {
          const exposure = getCommuteExposureDetails(profile.commuteMode);
          return (
            <div className="mt-2.5 rounded-xl border border-stone-200/90 dark:border-[#2D3A34] bg-white/70 dark:bg-[#222B27]/70 p-2.5 sm:p-3 flex items-start gap-2.5 transition-all">
              <div className="mt-0.5 shrink-0 rounded-md p-1 bg-stone-100 dark:bg-[#1A221F] text-ink-muted dark:text-stone-300">
                <Info className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-ink dark:text-stone-200">
                    {exposure.title}
                  </span>
                  <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-semibold border ${exposure.badgeClasses}`}>
                    {exposure.badge}
                  </span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-ink-muted dark:text-stone-400">
                  {exposure.description}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Round-Trip Commute Distance with Quick Presets, Steppers & Slider */}
        <div className="mt-3 rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] p-2.5 sm:p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-ink-muted dark:text-stone-400 font-medium">Round-trip distance:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeProfile({ ...profile, dailyCommuteKm: Math.max(0, profile.dailyCommuteKm - 5) })}
                disabled={profile.dailyCommuteKm <= 0}
                className="h-6 w-6 rounded bg-white dark:bg-[#1A221F] border border-stone-300 dark:border-[#2D3A34] text-ink dark:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#28332E] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-2xs"
                title="Decrease 5 km"
              >
                -5
              </button>
              <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm tabular-nums min-w-[50px] text-center">
                {profile.dailyCommuteKm} km
              </span>
              <button
                type="button"
                onClick={() => onChangeProfile({ ...profile, dailyCommuteKm: Math.min(80, profile.dailyCommuteKm + 5) })}
                disabled={profile.dailyCommuteKm >= 80}
                className="h-6 w-6 rounded bg-white dark:bg-[#1A221F] border border-stone-300 dark:border-[#2D3A34] text-ink dark:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#28332E] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-2xs"
                title="Increase 5 km"
              >
                +5
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="2"
            value={profile.dailyCommuteKm}
            onChange={(e) => onChangeProfile({ ...profile, dailyCommuteKm: Number(e.target.value) })}
            className="editorial-slider w-full"
            style={{ '--slider-pct': `${Math.min(100, Math.max(0, (profile.dailyCommuteKm / 80) * 100))}%` } as React.CSSProperties}
            title={`${profile.dailyCommuteKm} km round-trip distance`}
          />

          {/* Quick Distance Preset Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-stone-200/70 dark:border-[#2D3A34]">
            <span className="text-[10px] font-mono text-ink-muted dark:text-stone-400 mr-1">Presets:</span>
            {DISTANCE_PRESETS.map((p) => {
              const isActive = profile.dailyCommuteKm === p.km;
              return (
                <button
                  key={p.km}
                  type="button"
                  onClick={() => onChangeProfile({ ...profile, dailyCommuteKm: p.km })}
                  className={`text-[10.5px] px-2 py-0.5 rounded-lg border transition-all font-mono ${
                    isActive
                      ? 'bg-ink text-white dark:bg-[#242926] dark:text-stone-100 border-ink dark:border-[#E6E2D6] dark:ring-1 dark:ring-[#E6E2D6]/40 font-bold shadow-2xs'
                      : 'bg-white dark:bg-[#1A221F] text-ink-muted dark:text-stone-300 border-stone-200 dark:border-[#2D3A34] hover:border-stone-400 dark:hover:border-[#3E4F47] font-medium'
                  }`}
                >
                  {p.label} <span className="text-[9px] opacity-75">({p.tag})</span>
                </button>
              );
            })}
            {profile.commuteMode === 'work-from-home' && profile.dailyCommuteKm > 0 && (
              <button
                type="button"
                onClick={() => onChangeProfile({ ...profile, dailyCommuteKm: 0 })}
                className="text-[10px] px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono ml-auto hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                Set 0 km (WFH)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. OUTDOOR WORKOUT / STROLL HABIT: Visual Time-Window Cards with Risk Tags */}
      <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-ink dark:text-stone-200">
            Outdoor Workout / Stroll Habit
          </label>
          <span className="text-[10px] font-mono text-ink-muted dark:text-stone-400">
            Diurnal inversion exposure
          </span>
        </div>

        {/* 2x2 Grid of Time Window Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXERCISE_OPTIONS.map((opt) => {
            const isSelected = profile.outdoorExerciseTime === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeProfile({ ...profile, outdoorExerciseTime: opt.id })}
                className={`text-left rounded-xl p-2.5 sm:p-3 border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-ink text-white dark:bg-[#242926] dark:text-stone-100 border-ink dark:border-[#E6E2D6] dark:ring-1 dark:ring-[#E6E2D6]/40 shadow-sm'
                    : 'bg-stone-50/80 dark:bg-[#222B27] text-ink dark:text-stone-200 border-stone-200 dark:border-[#2D3A34] hover:border-stone-400 dark:hover:border-[#3E4F47] dark:hover:bg-[#28332E]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-white/10 dark:text-stone-200 dark:border dark:border-white/20'
                      : 'bg-white dark:bg-[#1A221F] text-ink-muted dark:text-stone-400 border border-stone-200 dark:border-[#2D3A34]'
                  }`}>
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-bold text-xs leading-snug">
                      {opt.label}
                    </div>
                    <div className={`text-[10px] font-mono ${
                      isSelected ? 'text-stone-300 dark:text-stone-300' : 'text-ink-muted dark:text-stone-400'
                    }`}>
                      {opt.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getBadgeClasses(
                    opt.badgeStyle,
                    isSelected
                  )}`}>
                    {opt.badge}
                  </span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-white dark:text-stone-200" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Apartment Complex / Society Multiplier */}
      <div className="mt-5 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-ink dark:text-stone-200">Apartment Complex Size</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeProfile({ ...profile, societySizeFamilies: Math.max(10, profile.societySizeFamilies - 10) })}
              disabled={profile.societySizeFamilies <= 10}
              className="h-6 w-6 rounded bg-white dark:bg-[#1A221F] border border-stone-300 dark:border-[#2D3A34] text-ink dark:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#28332E] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-2xs"
              title="Decrease 10 families"
            >
              -10
            </button>
            <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm tabular-nums min-w-[70px] text-center">
              {profile.societySizeFamilies} families
            </span>
            <button
              type="button"
              onClick={() => onChangeProfile({ ...profile, societySizeFamilies: Math.min(300, profile.societySizeFamilies + 10) })}
              disabled={profile.societySizeFamilies >= 300}
              className="h-6 w-6 rounded bg-white dark:bg-[#1A221F] border border-stone-300 dark:border-[#2D3A34] text-ink dark:text-stone-200 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-[#28332E] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-2xs"
              title="Increase 10 families"
            >
              +10
            </button>
          </div>
        </div>
        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={profile.societySizeFamilies}
          onChange={(e) => onChangeProfile({ ...profile, societySizeFamilies: Number(e.target.value) })}
          className="editorial-slider w-full mt-1"
          style={{ '--slider-pct': `${Math.min(100, Math.max(0, ((profile.societySizeFamilies - 10) / (300 - 10)) * 100))}%` } as React.CSSProperties}
          title={`${profile.societySizeFamilies} families in apartment complex`}
        />
        <span className="block mt-1.5 text-[11px] text-ink-muted dark:text-stone-400">
          Scales community-wide diesel generator reduction &amp; collective emission savings.
        </span>
      </div>
    </div>
  );
};
