import React, { useState } from 'react';
import { DailyRoutineSlot, ActionItem } from '../types';
import { Clock, Wrench, Leaf, Sparkles, Building } from 'lucide-react';

interface ActionPlanTabsProps {
  routineSchedule: DailyRoutineSlot[];
  iaqHacks: ActionItem[];
  sustainableActions: ActionItem[];
  communityPointers: string[];
  adoptedActionIds: string[];
  onToggleAction: (actionId: string) => void;
  summaryVerdict: string;
}

export const ActionPlanTabs: React.FC<ActionPlanTabsProps> = ({
  routineSchedule,
  iaqHacks,
  sustainableActions,
  communityPointers,
  adoptedActionIds,
  onToggleAction,
  summaryVerdict,
}) => {
  const [activeTab, setActiveTab] = useState<'routine' | 'iaq' | 'sustainable'>('routine');

  const iaqAdoptedCount = adoptedActionIds.filter(id => id.startsWith('iaq-')).length;
  const sustainableAdoptedCount = adoptedActionIds.filter(id => id.startsWith('sustainable-')).length;

  return (
    <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-xs">
      {/* Editorial Diagnosis Callout */}
      <div className="rounded border border-stone-200 bg-stone-50/90 p-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="rounded bg-stone-200 p-1.5 text-ink shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              GenAI Clinical Smog Advisory
            </span>
            <p className="mt-1 text-sm text-ink leading-relaxed font-serif sm:font-sans">
              {summaryVerdict}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Single-Row Editorial Tab Navigation (No Circular Badges, Simple Underline) */}
      <div className="flex border-b border-stone-200 gap-6 sm:gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('routine')}
          className={`pb-3 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'routine'
              ? 'text-ink font-bold border-ink'
              : 'text-ink-muted hover:text-ink font-medium border-transparent'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Low-Emission Daily Routine</span>
        </button>

        <button
          onClick={() => setActiveTab('iaq')}
          className={`pb-3 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'iaq'
              ? 'text-ink font-bold border-ink'
              : 'text-ink-muted hover:text-ink font-medium border-transparent'
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Indoor Air Quality Hacks</span>
          <span className="font-mono text-[11px] text-ink-muted font-normal">
            ({iaqAdoptedCount}/{iaqHacks.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sustainable')}
          className={`pb-3 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'sustainable'
              ? 'text-ink font-bold border-ink'
              : 'text-ink-muted hover:text-ink font-medium border-transparent'
          }`}
        >
          <Leaf className="h-3.5 w-3.5" />
          <span>Sustainable Alternatives</span>
          <span className="font-mono text-[11px] text-ink-muted font-normal">
            ({sustainableAdoptedCount}/{sustainableActions.length})
          </span>
        </button>
      </div>

      {/* TAB 1: LOW-EMISSION DAILY ROUTINE */}
      {activeTab === 'routine' && (
        <div className="mt-5 space-y-3.5">
          <p className="text-xs text-ink-muted">
            Hour-by-hour operational timing aligned with local atmospheric temperature inversions to minimize personal particulate exposure during commutes and household activities.
          </p>

          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {routineSchedule.map((slot, index) => {
              const isVentilationAction = slot.windowAction.includes('Safe');
              const isSealAction = slot.windowAction.includes('Seal');
              return (
                <div key={index} className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-start">
                  {/* Time & Phase Badge */}
                  <div className="md:col-span-3">
                    <span className="font-mono text-sm font-bold text-ink block">
                      {slot.timeWindow}
                    </span>
                    <span
                      className={`inline-block mt-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        isVentilationAction
                          ? 'bg-sage-100 text-sage-800'
                          : isSealAction
                          ? 'bg-terracotta-100 text-terracotta-800'
                          : 'bg-stone-200 text-ink-muted'
                      }`}
                    >
                      {slot.phase}
                    </span>
                  </div>

                  {/* Operational Recommendations with Clean Alignment */}
                  <div className="md:col-span-6 space-y-2">
                    <p className="text-ink font-medium leading-relaxed">
                      {slot.recommendation}
                    </p>

                    <div className="flex flex-col sm:grid sm:grid-cols-[105px_1fr] gap-1 sm:gap-2 text-[11px] items-baseline">
                      <span className="font-semibold text-ink">Transit/Outdoor:</span>
                      <span className="text-ink-muted leading-relaxed">{slot.commuteOrOutdoorGuidance}</span>
                    </div>

                    {slot.vulnerableCareNote && (
                      <div className="flex flex-col sm:grid sm:grid-cols-[105px_1fr] gap-1 sm:gap-2 text-[11px] items-baseline rounded bg-stone-50 border border-stone-200 p-2.5">
                        <span className="font-semibold text-ink">Vulnerable Care:</span>
                        <span className="text-ink-muted leading-relaxed">{slot.vulnerableCareNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Window Guidance Action */}
                  <div className="md:col-span-3 flex md:justify-end items-start">
                    <span
                      className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isVentilationAction
                          ? 'border border-sage-300 bg-sage-50 text-sage-800'
                          : isSealAction
                          ? 'border border-terracotta-200 bg-terracotta-50 text-terracotta-800'
                          : 'border border-stone-200 bg-stone-100 text-ink-muted'
                      }`}
                    >
                      <span>{isVentilationAction ? '🪟' : isSealAction ? '🔒' : '🚪'}</span>
                      <span>{slot.windowAction}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INDOOR AIR QUALITY (IAQ) HACKS */}
      {activeTab === 'iaq' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <p>
              Evidence-based micro-environment interventions sorted by implementation cost. Toggle items to immediately recalculate your personal health dose.
            </p>
            <span className="font-mono text-ink font-semibold">
              {iaqAdoptedCount} of {iaqHacks.length} Adopted
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {iaqHacks.map((hack) => {
              const isAdopted = adoptedActionIds.includes(hack.id);
              return (
                <div
                  key={hack.id}
                  className={`rounded-lg border p-4 transition-all ${
                    isAdopted
                      ? 'border-sage-400 bg-sage-50/40 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                          {hack.tier}
                        </span>
                        <span className="font-mono text-xs font-semibold text-ink-muted">
                          {hack.costEstimateInr === 0 ? 'Zero-Cost' : `~₹${hack.costEstimateInr}`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink">
                        {hack.title}
                      </h4>
                    </div>

                    {/* True Tactile Interactive Toggle Switch */}
                    <div
                      onClick={() => onToggleAction(hack.id)}
                      className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-2 rounded hover:bg-stone-100/60 transition-colors"
                      role="switch"
                      aria-checked={isAdopted}
                      title={isAdopted ? 'Click to deactivate habit' : 'Click to adopt habit'}
                    >
                      <div className="text-right">
                        <span className={`block text-[11px] font-bold uppercase tracking-wider ${isAdopted ? 'text-sage-700' : 'text-ink-muted'}`}>
                          {isAdopted ? 'Active' : 'Off'}
                        </span>
                        <span className="block text-[10px] text-ink-muted">
                          {isAdopted ? 'Habit Adopted' : 'Click to Adopt'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAdopted ? 'bg-sage-600' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            isAdopted ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-ink leading-relaxed">
                    {hack.description}
                  </p>

                  <div className="mt-3 rounded border border-stone-200 bg-stone-50/70 p-2.5 text-xs">
                    <strong className="text-ink">Scientific Mechanism: </strong>
                    <span className="text-ink-muted">{hack.evidenceBasedReason}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-sage-700 font-bold">
                      ↓ -{hack.pm25ReductionPercent}% indoor particulate load
                    </span>
                    <span className="text-ink-muted">
                      Saves ~{hack.dailyExposureReductionUg} µg PM2.5/day
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SUSTAINABLE & COMMUNITY ACTIONS */}
      {activeTab === 'sustainable' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <p>
              High-impact commute, energy, and residential society policies that stop emissions at source.
            </p>
            <span className="font-mono text-ink font-semibold">
              {sustainableAdoptedCount} of {sustainableActions.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {sustainableActions.map((action) => {
              const isAdopted = adoptedActionIds.includes(action.id);
              return (
                <div
                  key={action.id}
                  className={`rounded-lg border p-4 transition-all ${
                    isAdopted
                      ? 'border-sage-400 bg-sage-50/40 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                          {action.tier}
                        </span>
                        <span className="text-xs font-mono text-ink-muted">
                          {action.timeSlot}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink">
                        {action.title}
                      </h4>
                    </div>

                    {/* True Tactile Interactive Toggle Switch */}
                    <div
                      onClick={() => onToggleAction(action.id)}
                      className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-2 rounded hover:bg-stone-100/60 transition-colors"
                      role="switch"
                      aria-checked={isAdopted}
                      title={isAdopted ? 'Click to deactivate policy' : 'Click to adopt policy'}
                    >
                      <div className="text-right">
                        <span className={`block text-[11px] font-bold uppercase tracking-wider ${isAdopted ? 'text-sage-700' : 'text-ink-muted'}`}>
                          {isAdopted ? 'Active' : 'Off'}
                        </span>
                        <span className="block text-[10px] text-ink-muted">
                          {isAdopted ? 'Policy Adopted' : 'Click to Adopt'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAdopted ? 'bg-sage-600' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            isAdopted ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-ink leading-relaxed">
                    {action.description}
                  </p>

                  <div className="mt-3 rounded border border-stone-200 bg-stone-50/70 p-2.5 text-xs">
                    <strong className="text-ink">Environmental Impact: </strong>
                    <span className="text-ink-muted">{action.evidenceBasedReason}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-sage-700 font-bold">
                      Avoids ~{action.co2SavedMonthlyKg} kg CO₂ / mo
                    </span>
                    <span className="text-ink font-semibold">
                      Prevents ~{action.pm25PreventedMonthlyG}g direct PM2.5 / mo
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Apartment Society Resolution Checklist */}
          <div className="mt-6 rounded border border-stone-200 bg-stone-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5 mb-2">
              <Building className="h-4 w-4 text-ink-muted" />
              <span>Recommended Society / RWA Resolutions for Smog Season</span>
            </h4>
            <ul className="space-y-2 text-xs text-ink">
              {communityPointers.map((pointer, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono text-ink-muted font-bold">0{i + 1}.</span>
                  <span>{pointer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
