import React from 'react';
import { HouseholdProfile, HouseholdMember, HomeType, PurifierStatus, CommuteMode } from '../types';
import { Users, Home, Wind, Car, Plus, Trash2, HeartPulse, ShieldCheck } from 'lucide-react';

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
              className="rounded border border-stone-300 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-ink hover:bg-stone-100"
            >
              + Child
            </button>
            <button
              type="button"
              onClick={() => addMember('Senior')}
              className="rounded border border-stone-300 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-ink hover:bg-stone-100"
            >
              + Senior
            </button>
            <button
              type="button"
              onClick={() => addMember('Adult')}
              className="rounded border border-stone-300 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-ink hover:bg-stone-100"
            >
              + Adult
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {profile.members.map((member, idx) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-2 rounded border border-stone-200 bg-stone-50/70 p-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">
                  #{idx + 1} {member.role}
                </span>
                <button
                  type="button"
                  onClick={() => toggleMemberSensitivity(member.id)}
                  className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                    member.hasRespiratorySensitivity
                      ? 'border border-terracotta-300 bg-terracotta-50 text-terracotta-700 font-bold'
                      : 'border border-stone-200 bg-white text-ink-muted hover:text-ink'
                  }`}
                  title="Toggle Asthma / Bronchitis / Allergy sensitivity"
                >
                  <HeartPulse className="h-3 w-3" />
                  <span>{member.hasRespiratorySensitivity ? 'Respiratory Sensitivity' : 'Normal'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ink-muted">
                  {member.hoursOutdoorsPerDay}h out
                </span>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={member.hoursOutdoorsPerDay}
                  onChange={(e) => updateMemberOutdoorHours(member.id, Number(e.target.value))}
                  className="w-14 accent-ink"
                  title="Hours outdoors per day"
                />
                {profile.members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="text-stone-400 hover:text-terracotta-600 p-0.5"
                    title="Remove member"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
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
