import React from 'react';
import { ImpactSimulationResults } from '../types';
import { ShieldCheck, HeartPulse, Sparkles, Building2, Leaf, ArrowDownRight, Info } from 'lucide-react';

interface ImpactScorecardProps {
  impact: ImpactSimulationResults;
  onOpenExplainer: () => void;
  societyFamilies: number;
  onUpdateSocietyFamilies: (count: number) => void;
}

export const ImpactScorecard: React.FC<ImpactScorecardProps> = ({
  impact,
  onOpenExplainer,
  societyFamilies,
  onUpdateSocietyFamilies,
}) => {
  return (
    <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sage-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Live Impact Scorecard
          </h2>
        </div>
        <button
          onClick={onOpenExplainer}
          className="flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-ink"
          title="Inspect EPA / WHO calculation formulas"
        >
          <Info className="h-3 w-3" />
          <span>Formula Breakdown</span>
        </button>
      </div>

      {/* Primary Exposure Drop Banner */}
      <div className="mt-4 rounded border border-sage-200 bg-sage-50/60 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-sage-800">
            Personal Exposure Drop
          </span>
          <span className="font-mono text-xs font-bold text-sage-700">
            -{impact.totalUgAvoidedDaily} µg / day avoided
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-extrabold text-sage-700 tabular-nums">
            -{impact.percentExposureDrop}%
          </span>
          <span className="text-xs text-ink-muted">
            inhalation reduction vs baseline
          </span>
        </div>

        {/* Inhaled Dose Comparison */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-sage-200/80 pt-2.5">
          <div>
            <span className="text-ink-muted block text-[11px]">Unmanaged Inhaled Dose:</span>
            <span className="font-mono font-bold text-terracotta-700 tabular-nums text-sm">
              {impact.baselineDailyInhaledDoseUg} µg/day
            </span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">With Adopted Habits:</span>
            <span className="font-mono font-bold text-sage-700 tabular-nums text-sm">
              {impact.adoptedDailyInhaledDoseUg} µg/day
            </span>
          </div>
        </div>

        {/* Berkeley Earth Relatable Equivalence */}
        <div className="mt-3 rounded bg-white p-2.5 border border-sage-200 text-xs flex items-center gap-2.5">
          <div className="rounded-full bg-sage-100 p-1.5 text-sage-700 shrink-0">
            <HeartPulse className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-ink">
              Health Equivalence:{' '}
            </span>
            <span className="text-ink-muted">
              Equivalent to avoiding{' '}
              <strong className="font-mono font-bold text-ink">
                ~{impact.passiveCigaretteEquivalentAvoidedDaily} passive cigarettes
              </strong>{' '}
              worth of fine particulate inhalation daily per person.
            </span>
          </div>
        </div>
      </div>

      {/* Household Climate & Emission Reductions */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-ink block mb-2">
          Household Monthly Footprint Avoided
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-stone-200 bg-stone-50 p-2.5">
            <span className="text-[11px] font-medium text-ink-muted flex items-center gap-1">
              <Leaf className="h-3 w-3 text-sage-600" />
              <span>CO₂ Emissions</span>
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-ink tabular-nums">
                {impact.householdMonthlyCo2SavedKg}
              </span>
              <span className="text-xs font-mono text-ink-muted">kg / mo</span>
            </div>
          </div>

          <div className="rounded border border-stone-200 bg-stone-50 p-2.5">
            <span className="text-[11px] font-medium text-ink-muted flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-sage-600" />
              <span>Toxic Particulates</span>
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-ink tabular-nums">
                {impact.householdMonthlyPmPreventedG}
              </span>
              <span className="text-xs font-mono text-ink-muted">g PM / mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Multiplier (Standout Feature) */}
      <div className="mt-4 rounded border border-stone-200 bg-stone-50/70 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-ink-muted" />
            <span>Community Multiplier</span>
          </span>
          <span className="font-mono text-xs font-bold text-ink">
            {societyFamilies} families in complex
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={societyFamilies}
          onChange={(e) => onUpdateSocietyFamilies(Number(e.target.value))}
          className="w-full mt-2 accent-ink"
        />

        <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-white p-2 border border-stone-200">
            <span className="text-[10px] text-ink-muted block uppercase font-medium">
              Complex CO₂ Saved
            </span>
            <span className="font-mono font-bold text-ink text-sm tabular-nums">
              {impact.communityMonthlyCo2SavedKg} kg / mo
            </span>
          </div>

          <div className="rounded bg-white p-2 border border-stone-200">
            <span className="text-[10px] text-ink-muted block uppercase font-medium">
              Complex PM Prevented
            </span>
            <span className="font-mono font-bold text-ink text-sm tabular-nums">
              {impact.communityMonthlyPmPreventedKg} kg / mo
            </span>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-ink-muted">
          Scaled if your residential society enforces shared carpooling, DG generator curbs, and zero open-leaf burning.
        </p>
      </div>
    </div>
  );
};
