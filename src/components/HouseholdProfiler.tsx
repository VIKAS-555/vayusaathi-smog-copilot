import React from 'react';
import { HouseholdProfile, HouseholdMember, HomeType, PurifierStatus, CommuteMode } from '../types';
import { Users, Home, Wind, Car, Plus, Minus, Trash2, HeartPulse, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-xs">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink flex items-center gap-2">
          <Users className="h-4 w-4 text-ink-muted" />
          <span>Household & Lifestyle Profiler</span>
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Exposure calculation adapts to family age demographics, respiratory vulnerability, and building infiltration rates.
        </p>
      </div>

      {/* Household Members Manager */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-ink">
            Family Members ({profile.members.length})
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => addMember('Child')}
              className="rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              + Child
            </button>
            <button
              type="button"
              onClick={() => addMember('Senior')}
              className="rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              + Senior
            </button>
            <button
              type="button"
              onClick={() => addMember('Adult')}
              className="rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-medium text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              + Adult
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {profile.members.map((member, idx) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-800/60 p-2.5 sm:p-2 text-xs transition-colors hover:border-stone-300 dark:hover:border-stone-600"
            >
              {/* Row 1 on mobile: Member Role + Sensitivity Badge + Delete (on mobile) */}
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

                {/* Mobile-only trash icon aligned to right */}
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

      {/* Dwelling Type & Air Sealing */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5 text-ink-muted" />
          <span>Dwelling Type & Building Envelope</span>
        </label>
        <select
          value={profile.homeType}
          onChange={(e) => onChangeProfile({ ...profile, homeType: e.target.value as HomeType })}
          className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-ink focus:border-ink focus:outline-none"
        >
          <option value="high-rise-apartment">High-Rise Apartment (Floor 5+, lower ground dust)</option>
          <option value="low-rise-apartment">Low-Rise Apartment (Floors 1-4)</option>
          <option value="independent-house-street">Independent House (Street-facing, high dust infiltration)</option>
          <option value="independent-house-interior">Independent House (Interior lane / green buffer)</option>
        </select>

        {/* Weatherstripping Checkbox */}
        <div className="mt-2.5 flex items-center gap-2">
          <input
            type="checkbox"
            id="weatherstrip-toggle"
            checked={profile.hasWindowWeatherstripping}
            onChange={(e) => onChangeProfile({ ...profile, hasWindowWeatherstripping: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-stone-300 text-ink accent-ink"
          />
          <label htmlFor="weatherstrip-toggle" className="text-xs text-ink cursor-pointer">
            Windows fitted with rubber/foam sealing tape
          </label>
        </div>
      </div>

      {/* Air Purifier Equipment */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
          <Wind className="h-3.5 w-3.5 text-ink-muted" />
          <span>Purification Inventory</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'none', label: 'No Purifier' },
            { id: 'single-bedroom', label: '1 Bedroom' },
            { id: 'full-house', label: 'Multi-Room' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeProfile({ ...profile, purifierStatus: item.id as PurifierStatus })}
              className={`rounded border px-2 py-1.5 text-center text-xs font-medium transition-colors ${
                profile.purifierStatus === item.id
                  ? 'border-ink bg-ink text-white shadow-xs'
                  : 'border-stone-200 bg-stone-50 text-ink-muted hover:bg-stone-100 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Commute Mode & Distance */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5 text-ink-muted" />
          <span>Daily Commute Mode & Distance</span>
        </label>
        <select
          value={profile.commuteMode}
          onChange={(e) => onChangeProfile({ ...profile, commuteMode: e.target.value as CommuteMode })}
          className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-ink focus:border-ink focus:outline-none"
        >
          <option value="solo-petrol-car">Solo Petrol/Diesel Car (AC recirc)</option>
          <option value="two-wheeler">Two-Wheeler / Motorcycle (Direct exposure)</option>
          <option value="metro-public-transit">Metro Rail / Electric Bus (Filtered transit)</option>
          <option value="carpool-cab">Shared Cab / Carpool</option>
          <option value="work-from-home">Work From Home / Minimal transit</option>
        </select>

        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-ink-muted">Round-trip distance:</span>
          <span className="font-mono font-bold text-ink">{profile.dailyCommuteKm} km</span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          step="2"
          value={profile.dailyCommuteKm}
          onChange={(e) => onChangeProfile({ ...profile, dailyCommuteKm: Number(e.target.value) })}
          className="w-full mt-1 accent-ink"
        />
      </div>

      {/* Outdoor Exercise Schedule */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <label className="block text-xs font-bold text-ink mb-1.5">
          Outdoor Workout / Stroll Habit
        </label>
        <select
          value={profile.outdoorExerciseTime}
          onChange={(e) => onChangeProfile({ ...profile, outdoorExerciseTime: e.target.value as any })}
          className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-ink focus:border-ink focus:outline-none"
        >
          <option value="None / Indoors">None / Indoors Only (Safe)</option>
          <option value="Early Morning (05:00 - 08:00)">Early Morning 05:00-08:00 (High Inversion Risk!)</option>
          <option value="Midday (12:00 - 15:00)">Midday 12:00-15:00 (Lowest Inversion)</option>
          <option value="Evening (18:00 - 21:00)">Evening 18:00-21:00 (Re-inversion Trapping)</option>
        </select>
      </div>

      {/* Apartment / Society Scale Multiplier */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-ink">Apartment Complex Size</span>
          <span className="font-mono font-bold text-ink">{profile.societySizeFamilies} families</span>
        </div>
        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={profile.societySizeFamilies}
          onChange={(e) => onChangeProfile({ ...profile, societySizeFamilies: Number(e.target.value) })}
          className="w-full accent-ink"
        />
        <span className="block mt-1 text-[11px] text-ink-muted">
          Scales community-wide diesel generator reduction & collective emission savings.
        </span>
      </div>
    </div>
  );
};
