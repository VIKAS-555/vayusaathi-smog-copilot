import React, { useState } from 'react';
import { DailyRoutineSlot, ActionItem } from '../types';
import { 
  Clock, 
  Wrench, 
  Leaf, 
  Sparkles, 
  Building, 
  Wind, 
  Lock, 
  Shield, 
  Sun, 
  CloudFog, 
  ArrowDownToLine, 
  Activity, 
  Layers, 
  Filter, 
  CheckCircle2 
} from 'lucide-react';

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
    <div className="rounded-2xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-xs transition-colors">
      {/* Editorial Diagnosis Callout */}
      <div className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/90 dark:bg-[#222B27] p-4 mb-5 shadow-2xs">
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

      {/* Responsive Tab Navigation: Clean 3-Segmented Bar on Mobile, Underline on Desktop */}
      {/* Mobile Segmented Control (<sm) */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 dark:bg-stone-800/90 rounded-lg text-center sm:hidden mb-4">
        <button
          onClick={() => setActiveTab('routine')}
          className={`py-2 px-1 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all flex flex-col items-center justify-center gap-0.5 min-h-[42px] ${
            activeTab === 'routine'
              ? 'bg-white dark:bg-stone-900 text-ink dark:text-stone-100 shadow-2xs'
              : 'text-ink-muted dark:text-stone-400 hover:text-ink'
          }`}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Routine</span>
        </button>

        <button
          onClick={() => setActiveTab('iaq')}
          className={`py-2 px-1 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all flex flex-col items-center justify-center gap-0.5 min-h-[42px] ${
            activeTab === 'iaq'
              ? 'bg-white dark:bg-stone-900 text-ink dark:text-stone-100 shadow-2xs'
              : 'text-ink-muted dark:text-stone-400 hover:text-ink'
          }`}
        >
          <Wrench className="h-3.5 w-3.5 shrink-0" />
          <span>Hacks ({iaqAdoptedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('sustainable')}
          className={`py-2 px-1 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all flex flex-col items-center justify-center gap-0.5 min-h-[42px] ${
            activeTab === 'sustainable'
              ? 'bg-white dark:bg-stone-900 text-ink dark:text-stone-100 shadow-2xs'
              : 'text-ink-muted dark:text-stone-400 hover:text-ink'
          }`}
        >
          <Leaf className="h-3.5 w-3.5 shrink-0" />
          <span>Swaps ({sustainableAdoptedCount})</span>
        </button>
      </div>

      {/* Desktop Single-Row Editorial Tabs (>=sm) */}
      <div className="hidden sm:flex border-b border-stone-200 dark:border-stone-800 gap-6 sm:gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('routine')}
          className={`pb-3 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'routine'
              ? 'text-ink dark:text-stone-100 font-bold border-ink dark:border-stone-100'
              : 'text-ink-muted dark:text-stone-400 hover:text-ink font-medium border-transparent'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Low-Emission Daily Routine</span>
        </button>

        <button
          onClick={() => setActiveTab('iaq')}
          className={`pb-3 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'iaq'
              ? 'text-ink dark:text-stone-100 font-bold border-ink dark:border-stone-100'
              : 'text-ink-muted dark:text-stone-400 hover:text-ink font-medium border-transparent'
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Indoor Air Quality Hacks</span>
          <span className="font-mono text-[11px] text-ink-muted dark:text-stone-400 font-normal">
            ({iaqAdoptedCount}/{iaqHacks.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sustainable')}
          className={`pb-3 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'sustainable'
              ? 'text-ink dark:text-stone-100 font-bold border-ink dark:border-stone-100'
              : 'text-ink-muted dark:text-stone-400 hover:text-ink font-medium border-transparent'
          }`}
        >
          <Leaf className="h-3.5 w-3.5" />
          <span>Sustainable Alternatives</span>
          <span className="font-mono text-[11px] text-ink-muted dark:text-stone-400 font-normal">
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
                  {/* Time & Phase Badge with Quiet Line Icons */}
                  <div className="md:col-span-3">
                    <div className="flex items-center justify-between md:block">
                      <span className="font-mono text-sm font-bold text-ink dark:text-stone-100 block">
                        {slot.timeWindow}
                      </span>

                      {/* Mobile Window Guidance Badge (shows right beside time on phone screens) */}
                      <span
                        className={`md:hidden rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          isVentilationAction
                            ? 'border border-sage-300 bg-sage-50 text-sage-800 dark:bg-sage-950/80 dark:text-sage-200 dark:border-sage-700'
                            : isSealAction
                            ? 'border border-terracotta-200 bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/80 dark:text-terracotta-200 dark:border-terracotta-800'
                            : 'border border-stone-200 bg-stone-100 text-ink-muted dark:bg-stone-800 dark:text-stone-300'
                        }`}
                      >
                        {isVentilationAction ? (
                          <Wind className="h-3 w-3 text-sage-700 shrink-0" />
                        ) : isSealAction ? (
                          <Lock className="h-3 w-3 text-terracotta-700 shrink-0" />
                        ) : (
                          <Shield className="h-3 w-3 text-stone-500 shrink-0" />
                        )}
                        <span>{slot.windowAction}</span>
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 mt-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        isVentilationAction
                          ? 'bg-sage-100 text-sage-800 dark:bg-sage-950/60 dark:text-sage-300'
                          : isSealAction
                          ? 'bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-950/60 dark:text-terracotta-300'
                          : 'bg-stone-200 text-ink-muted dark:bg-stone-800 dark:text-stone-400'
                      }`}
                    >
                      {slot.phase.includes('Smog Peak') ? (
                        <CloudFog className="h-3 w-3 shrink-0" />
                      ) : slot.phase.includes('Ventilation') ? (
                        <Sun className="h-3 w-3 shrink-0" />
                      ) : slot.phase.includes('Re-Inversion') ? (
                        <ArrowDownToLine className="h-3 w-3 shrink-0" />
                      ) : slot.phase.includes('Night') ? (
                        <Shield className="h-3 w-3 shrink-0" />
                      ) : (
                        <Activity className="h-3 w-3 shrink-0" />
                      )}
                      <span>{slot.phase}</span>
                    </span>
                  </div>

                  {/* Operational Recommendations with Clean Alignment */}
                  <div className="md:col-span-6 space-y-2">
                    <p className="text-ink dark:text-stone-200 font-medium leading-relaxed">
                      {slot.recommendation}
                    </p>

                    <div className="flex flex-col sm:grid sm:grid-cols-[105px_1fr] gap-1 sm:gap-2 text-[11px] items-baseline">
                      <span className="font-semibold text-ink dark:text-stone-300">Transit/Outdoor:</span>
                      <span className="text-ink-muted dark:text-stone-400 leading-relaxed">{slot.commuteOrOutdoorGuidance}</span>
                    </div>

                    {slot.vulnerableCareNote && (
                      <div className="flex flex-col sm:grid sm:grid-cols-[105px_1fr] gap-1 sm:gap-2 text-[11px] items-baseline rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 p-2.5">
                        <span className="font-semibold text-ink dark:text-stone-300">Vulnerable Care:</span>
                        <span className="text-ink-muted dark:text-stone-400 leading-relaxed">{slot.vulnerableCareNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Window Guidance Action: Desktop Only (Rendered Beside Time on Mobile) */}
                  <div className="hidden md:flex md:col-span-3 md:justify-end items-start">
                    <span
                      className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isVentilationAction
                          ? 'border border-sage-300 bg-sage-50 text-sage-800 dark:bg-sage-950/80 dark:text-sage-200 dark:border-sage-700'
                          : isSealAction
                          ? 'border border-terracotta-200 bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/80 dark:text-terracotta-200 dark:border-terracotta-800'
                          : 'border border-stone-200 bg-stone-100 text-ink-muted dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {isVentilationAction ? (
                        <Wind className="h-3.5 w-3.5 text-sage-700 shrink-0" />
                      ) : isSealAction ? (
                        <Lock className="h-3.5 w-3.5 text-terracotta-700 shrink-0" />
                      ) : (
                        <Shield className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                      )}
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
                  className={`rounded-xl border p-4 transition-all ${
                    isAdopted
                      ? 'border-sage-400 bg-sage-50/40 dark:bg-sage-950/30 dark:border-sage-800 shadow-xs'
                      : 'border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] hover:border-stone-400 dark:hover:border-[#3E4F47] shadow-2xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                          {hack.tier}
                        </span>

                        {/* Quiet Category Classification Badges */}
                        {hack.id.includes('seal') || hack.id.includes('towel') ? (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Shield className="h-3 w-3 text-stone-500" /> Infiltration Barrier
                          </span>
                        ) : hack.id.includes('fan') || hack.id.includes('filter') ? (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Filter className="h-3 w-3 text-stone-500" /> Particulate Trap
                          </span>
                        ) : hack.id.includes('purifier') ? (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Wind className="h-3 w-3 text-stone-500" /> CADR Optimization
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Layers className="h-3 w-3 text-stone-500" /> Aerosol Buffer
                          </span>
                        )}

                        <span className="font-mono text-xs font-semibold text-ink-muted">
                          {hack.costEstimateInr === 0 ? 'Zero-Cost' : `~₹${hack.costEstimateInr}`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink">
                        {hack.title}
                      </h4>
                    </div>

                    {/* True Tactile Interactive Toggle Switch: Full-Width Mobile Touch Row, Inline on Desktop */}
                    <div
                      onClick={() => onToggleAction(hack.id)}
                      className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 cursor-pointer select-none py-2 px-3 sm:py-1 sm:px-2 rounded-lg bg-stone-100/70 dark:bg-stone-800/60 sm:bg-transparent mt-2.5 sm:mt-0 min-h-[44px] transition-colors"
                      role="switch"
                      aria-checked={isAdopted}
                      title={isAdopted ? 'Click to deactivate habit' : 'Click to adopt habit'}
                    >
                      <div className="text-left sm:text-right">
                        <span className={`block text-[11px] font-bold uppercase tracking-wider ${isAdopted ? 'text-sage-700 dark:text-sage-400' : 'text-ink-muted dark:text-stone-400'}`}>
                          {isAdopted ? 'Active' : 'Off'}
                        </span>
                        <span className="block text-[10px] text-ink-muted dark:text-stone-400">
                          {isAdopted ? 'Habit Adopted' : 'Tap to Adopt'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAdopted ? 'bg-sage-600 dark:bg-sage-500' : 'bg-stone-300 dark:bg-stone-600'
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
                    <span className="text-sage-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>↓ -{hack.pm25ReductionPercent}% indoor particulate load</span>
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
                  className={`rounded-xl border p-4 transition-all ${
                    isAdopted
                      ? 'border-sage-400 bg-sage-50/40 dark:bg-sage-950/30 dark:border-sage-800 shadow-xs'
                      : 'border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] hover:border-stone-400 dark:hover:border-[#3E4F47] shadow-2xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                          {action.tier}
                        </span>

                        {/* Quiet Category Classification Badges */}
                        {action.id.includes('metro') || action.id.includes('commute') ? (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Activity className="h-3 w-3 text-stone-500" /> Commute Shift
                          </span>
                        ) : action.id.includes('burn') || action.id.includes('waste') ? (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Shield className="h-3 w-3 text-stone-500" /> Zero-Burn Enforcement
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                            <Building className="h-3 w-3 text-stone-500" /> Diesel Soot Abatement
                          </span>
                        )}

                        <span className="text-xs font-mono text-ink-muted">
                          {action.timeSlot}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink">
                        {action.title}
                      </h4>
                    </div>

                    {/* True Tactile Interactive Toggle Switch: Full-Width Mobile Touch Row, Inline on Desktop */}
                    <div
                      onClick={() => onToggleAction(action.id)}
                      className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 cursor-pointer select-none py-2 px-3 sm:py-1 sm:px-2 rounded-lg bg-stone-100/70 dark:bg-stone-800/60 sm:bg-transparent mt-2.5 sm:mt-0 min-h-[44px] transition-colors"
                      role="switch"
                      aria-checked={isAdopted}
                      title={isAdopted ? 'Click to deactivate policy' : 'Click to adopt policy'}
                    >
                      <div className="text-left sm:text-right">
                        <span className={`block text-[11px] font-bold uppercase tracking-wider ${isAdopted ? 'text-sage-700 dark:text-sage-400' : 'text-ink-muted dark:text-stone-400'}`}>
                          {isAdopted ? 'Active' : 'Off'}
                        </span>
                        <span className="block text-[10px] text-ink-muted dark:text-stone-400">
                          {isAdopted ? 'Policy Adopted' : 'Tap to Adopt'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAdopted ? 'bg-sage-600 dark:bg-sage-500' : 'bg-stone-300 dark:bg-stone-600'
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
          <div className="mt-6 rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] p-4 shadow-2xs">
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
