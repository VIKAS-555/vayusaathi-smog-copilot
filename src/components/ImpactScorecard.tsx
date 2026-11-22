import React from 'react';
import { ImpactSimulationResults, CitySmogContext } from '../types';
import { ShieldCheck, HeartPulse, Sparkles, Building2, Leaf, ArrowDownRight, Info } from 'lucide-react';

interface ImpactScorecardProps {
  impact: ImpactSimulationResults;
  currentCity?: CitySmogContext;
  adoptedCount?: number;
  onOpenExplainer: () => void;
  societyFamilies: number;
  onUpdateSocietyFamilies: (count: number) => void;
  isDarkMode?: boolean;
}

export const ImpactScorecard: React.FC<ImpactScorecardProps> = ({
  impact,
  currentCity,
  adoptedCount = 0,
  onOpenExplainer,
  societyFamilies,
  onUpdateSocietyFamilies,
  isDarkMode = false,
}) => {
  const cityName = currentCity ? currentCity.name.split(' (')[0] : 'Active City';
  const aqi = currentCity?.currentAQI || 150;
  const unmanagedCigs = Number(((impact.baselineDailyInhaledDoseUg || 1) / 220).toFixed(1));

  return (
    <div className="rounded-2xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-xs transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2B3833] pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="h-4 w-4 text-sage-600 dark:text-sage-400 shrink-0" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-stone-100 truncate">
              Live Impact Scorecard
            </h2>
            {currentCity && (
              <span className="hidden sm:inline font-mono text-[11px] text-ink-muted dark:text-stone-400 truncate">
                · {cityName}
              </span>
            )}
          </div>
          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1 text-[11px] font-medium text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-200 transition-colors shrink-0 ml-2"
            title="Inspect EPA / WHO calculation formulas"
          >
            <Info className="h-3 w-3" />
            <span>Formula Breakdown</span>
          </button>
        </div>

        {/* Primary Exposure Drop Banner */}
        <div className="mt-4 rounded-xl border border-sage-200 dark:border-sage-800/80 bg-sage-50/70 dark:bg-sage-950/40 p-4 transition-colors">
          <div className="flex items-baseline justify-between flex-wrap gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-800 dark:text-sage-300">
              Personal Exposure Drop
            </span>
            <span className="font-mono text-xs font-bold text-sage-700 dark:text-sage-400">
              {impact.totalUgAvoidedDaily > 0 ? `-${impact.totalUgAvoidedDaily} µg / day avoided` : '0 µg / day avoided'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-4xl sm:text-5xl font-black text-sage-700 dark:text-sage-400 tabular-nums">
              {impact.percentExposureDrop > 0 ? `-${impact.percentExposureDrop}%` : '0%'}
            </span>
            <span className="text-xs text-ink-muted dark:text-stone-400 font-medium">
              {impact.percentExposureDrop > 0
                ? 'inhalation reduction vs unmanaged baseline'
                : 'inhalation reduction · adopt habits below to activate'}
            </span>
          </div>

          {/* Inhaled Dose Comparison */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-sage-200/80 dark:border-sage-800/70 pt-2.5">
            <div>
              <span className="text-ink-muted dark:text-stone-400 block text-[11px]">Unmanaged Inhaled Dose:</span>
              <span className="font-mono font-bold text-terracotta-700 dark:text-rose-400 tabular-nums text-sm">
                {impact.baselineDailyInhaledDoseUg} µg/day
              </span>
            </div>
            <div>
              <span className="text-ink-muted dark:text-stone-400 block text-[11px]">With Adopted Habits:</span>
              <span className="font-mono font-bold text-sage-700 dark:text-sage-300 tabular-nums text-sm">
                {impact.adoptedDailyInhaledDoseUg} µg/day
              </span>
            </div>
          </div>

          {/* Berkeley Earth Relatable Equivalence */}
          <div className="mt-3 rounded-lg bg-stone-50/90 dark:bg-[#222B27] p-2.5 border border-sage-200 dark:border-[#2D3A34] text-xs flex items-center gap-2.5 transition-colors">
            <div className="rounded-full bg-sage-100 dark:bg-sage-900/80 p-1.5 text-sage-700 dark:text-sage-300 shrink-0">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div className="leading-relaxed">
              <span className="font-semibold text-ink dark:text-stone-200">
                Health Equivalence:{' '}
              </span>
              <span className="text-ink-muted dark:text-stone-300">
                {impact.passiveCigaretteEquivalentAvoidedDaily >= 0.1 ? (
                  <>
                    Equivalent to avoiding{' '}
                    <strong className="font-mono font-bold text-ink dark:text-stone-100">
                      ~{impact.passiveCigaretteEquivalentAvoidedDaily} passive cigarettes
                    </strong>{' '}
                    worth of toxic fine particulates daily per person in {cityName}.
                  </>
                ) : aqi > 100 ? (
                  <>
                    Unmanaged ambient air in {cityName} delivers an inhaled dose equivalent to smoking{' '}
                    <strong className="font-mono font-bold text-terracotta-700 dark:text-rose-400">
                      ~{unmanagedCigs} cigarettes/day
                    </strong>. Toggle habits below to cut your intake.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-sage-700 dark:text-sage-400">Clean baseline air:</strong> Inhaled fine particulate load in {cityName} is within safe physiological limits.
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Household Climate & Emission Reductions */}
        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-[#2B3833]">
          <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-stone-200 block mb-2">
            Household Monthly Footprint Avoided
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] p-2.5 shadow-2xs">
              <span className="text-[11px] font-medium text-ink-muted dark:text-stone-400 flex items-center gap-1">
                <Leaf className="h-3 w-3 text-sage-600 dark:text-sage-400" />
                <span>CO₂ Emissions</span>
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-xl font-bold text-ink dark:text-stone-100 tabular-nums">
                  {impact.householdMonthlyCo2SavedKg}
                </span>
                <span className="text-xs font-mono text-ink-muted dark:text-stone-400">kg / mo</span>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] p-2.5 shadow-2xs">
              <span className="text-[11px] font-medium text-ink-muted dark:text-stone-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-sage-600 dark:text-sage-400" />
                <span>Toxic Particulates</span>
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-xl font-bold text-ink dark:text-stone-100 tabular-nums">
                  {impact.householdMonthlyPmPreventedG}
                </span>
                <span className="text-xs font-mono text-ink-muted dark:text-stone-400">g PM / mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Multiplier (Standout Feature) */}
      <div className="mt-4 rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50/80 dark:bg-[#222B27] p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-ink dark:text-stone-200 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
            <span>Community Multiplier</span>
          </span>
          <span className="font-mono text-xs font-bold text-ink dark:text-stone-100">
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
          className="editorial-slider w-full mt-2"
          style={{ '--slider-pct': `${Math.min(100, Math.max(0, ((societyFamilies - 10) / (300 - 10)) * 100))}%` } as React.CSSProperties}
          title={`${societyFamilies} families in complex`}
        />

        <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-white dark:bg-[#1E2824] p-2 border border-stone-200 dark:border-[#2D3A34]">
            <span className="text-[10px] text-ink-muted dark:text-stone-400 block uppercase font-medium">
              Complex CO₂ Saved
            </span>
            <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm tabular-nums">
              {impact.communityMonthlyCo2SavedKg} kg / mo
            </span>
          </div>

          <div className="rounded-lg bg-white dark:bg-[#1E2824] p-2 border border-stone-200 dark:border-[#2D3A34]">
            <span className="text-[10px] text-ink-muted dark:text-stone-400 block uppercase font-medium">
              Complex PM Prevented
            </span>
            <span className="font-mono font-bold text-ink dark:text-stone-100 text-sm tabular-nums">
              {impact.communityMonthlyPmPreventedKg} kg / mo
            </span>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-ink-muted dark:text-stone-400">
          Scaled if your residential society enforces shared transit, DG generator curbs, and zero open-waste burning in {cityName}.
        </p>
      </div>
    </div>
  );
};
