'use client';

import React, { useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Calculator, BookOpen } from 'lucide-react';
import { useBreathLine } from '@/context/BreathLineContext';

export const MathEngineDrawer: React.FC = () => {
  const { isMathDrawerOpen, closeMathDrawer } = useBreathLine();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMathDrawerOpen) {
        closeMathDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMathDrawerOpen, closeMathDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMathDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMathDrawerOpen]);

  if (!isMathDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" aria-labelledby="math-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={closeMathDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#1A221F] border-l border-stone-200 dark:border-[#2B3833] shadow-2xl flex flex-col text-ink dark:text-stone-100 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sage-500/15 text-sage-600 dark:text-sage-400 border border-sage-500/25 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 id="math-drawer-title" className="text-base font-bold text-ink dark:text-stone-100">
                  Deterministic Math Engine
                </h3>
                <p className="text-xs text-ink-muted dark:text-stone-400">
                  EPA &amp; WHO Clinical Inhalation Dose Formulas
                </p>
              </div>
            </div>

            <button
              onClick={closeMathDrawer}
              className="p-1.5 rounded-lg text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs leading-relaxed">
            {/* Decoupling Rationale */}
            <div className="rounded-xl border border-stone-200 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] p-4">
              <h4 className="font-bold text-ink dark:text-stone-100 mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-sage-600 dark:text-sage-400 shrink-0" />
                <span>Zero-Hallucination Environmental Physics</span>
              </h4>
              <p className="text-ink-muted dark:text-stone-300">
                Standard LLMs frequently hallucinate numbers, make unit errors, and produce contradictory numbers across sessions. In BreathLine, <strong>100% of numerical calculations are performed deterministically in TypeScript (<code className="bg-stone-200 dark:bg-[#1A221F] px-1 py-0.5 rounded text-[11px] font-mono">lib/environmentMath.ts</code>)</strong> based on peer-reviewed EPA and WHO standards. Gemini is used strictly for natural language schedule structuring.
              </p>
            </div>

            {/* Formula 1 */}
            <div>
              <h4 className="font-bold text-ink dark:text-stone-100 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-amber-500" />
                <span>1. The Inhalation Dose Equation</span>
              </h4>
              <div className="rounded-xl bg-stone-100 dark:bg-[#222B27] p-3.5 font-mono text-[11px] text-ink dark:text-stone-200 border border-stone-200 dark:border-[#2D3A34] overflow-x-auto">
                Dose (µg/day) = Σ [ T_i × V_E × C_i × (1 - η_i) ]
              </div>
              <ul className="mt-2 space-y-1 text-ink-muted dark:text-stone-400 pl-4 list-disc">
                <li><strong className="text-ink dark:text-stone-200">T_i:</strong> Hours spent in micro-environment <em>i</em> (Outdoor, In-Transit, Indoor).</li>
                <li><strong className="text-ink dark:text-stone-200">V_E:</strong> Minute ventilation volume (m³/h) by demographic &amp; exertion.</li>
                <li><strong className="text-ink dark:text-stone-200">C_i:</strong> Effective particulate concentration (µg/m³).</li>
                <li><strong className="text-ink dark:text-stone-200">η_i:</strong> Filtration efficiency (HEPA, N95, or vehicle cabin filter).</li>
              </ul>
            </div>

            {/* Table of Ventilation Rates */}
            <div>
              <h4 className="font-bold text-ink dark:text-stone-100 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400" />
                <span>2. EPA Standard Ventilation Rates (m³/h)</span>
              </h4>
              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-[#2D3A34]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-stone-100 dark:bg-[#222B27] border-b border-stone-200 dark:border-[#2D3A34] text-ink dark:text-stone-200 font-semibold">
                    <tr>
                      <th className="p-2.5">Cohort</th>
                      <th className="p-2.5">Rest / Sleep</th>
                      <th className="p-2.5">Light Activity</th>
                      <th className="p-2.5">Outdoor Exercise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-[#2D3A34] text-ink-muted dark:text-stone-300 font-mono">
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-ink dark:text-stone-200">Adult (18–60)</td>
                      <td className="p-2.5">0.45 m³/h</td>
                      <td className="p-2.5">0.80 m³/h</td>
                      <td className="p-2.5">2.10 m³/h</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-ink dark:text-stone-200">Child (0–12)</td>
                      <td className="p-2.5">0.32 m³/h</td>
                      <td className="p-2.5">0.65 m³/h</td>
                      <td className="p-2.5">1.60 m³/h</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-medium text-ink dark:text-stone-200">Senior (60+)</td>
                      <td className="p-2.5">0.40 m³/h</td>
                      <td className="p-2.5">0.70 m³/h</td>
                      <td className="p-2.5">1.50 m³/h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formula 3: Cigarette Equivalence */}
            <div>
              <h4 className="font-bold text-ink dark:text-stone-100 text-xs sm:text-sm mb-1.5">
                3. Berkeley Earth Cigarette Equivalence
              </h4>
              <p className="text-ink-muted dark:text-stone-300 mb-2">
                According to toxicological research from <em>Berkeley Earth (Muller &amp; Rohde)</em>:
              </p>
              <div className="rounded-xl bg-stone-100 dark:bg-[#222B27] p-3 font-mono text-[11px] text-ink dark:text-stone-200 border border-stone-200 dark:border-[#2D3A34]">
                1 Passive Cigarette ≈ 22 µg/m³ PM2.5 (24-hr breathing volume) ≈ 220 µg PM2.5 inhaled
              </div>
            </div>

            {/* Formula 4: Community Multiplier */}
            <div>
              <h4 className="font-bold text-ink dark:text-stone-100 text-xs sm:text-sm mb-1.5">
                4. Apartment Complex Multiplier
              </h4>
              <p className="text-ink-muted dark:text-stone-300 mb-2">
                When scaled across <em>N</em> families adopting zero-burn waste practices and carpooling:
              </p>
              <div className="rounded-xl bg-stone-100 dark:bg-[#222B27] p-3 font-mono text-[11px] text-ink dark:text-stone-200 border border-stone-200 dark:border-[#2D3A34]">
                ΔCO₂ = N × (Car Commute Saved + Waste Avoided)<br />
                ΔPM = N × (DG Curfew + Leaf Compost Avoidance)
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A] flex justify-end">
            <button
              onClick={closeMathDrawer}
              className="px-4 py-2 rounded-xl bg-ink dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              Done &amp; Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
