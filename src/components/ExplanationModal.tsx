import React from 'react';
import { X, ShieldCheck, BookOpen, CheckCircle } from 'lucide-react';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-lg border border-stone-300 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sage-600" />
            <div>
              <h3 className="text-base font-bold text-ink">
                Deterministic Environmental Math Engine
              </h3>
              <p className="text-xs text-ink-muted">
                Zero-hallucination physics & clinical inhalation exposure calculations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:text-ink hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-ink leading-relaxed">
          <div className="rounded border border-stone-200 bg-stone-50 p-3.5">
            <h4 className="font-bold text-ink mb-1 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-sage-600" />
              <span>Why We Decouple Deterministic Physics from LLMs</span>
            </h4>
            <p className="text-ink-muted">
              Standard GenAI models hallucinate numbers, miscalculate unit conversions, and produce inconsistent answers when users toggle habits. In BreathLine, <strong>100% of numeric metrics are calculated deterministically in TypeScript (<code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">lib/environmentMath.ts</code>)</strong> based on peer-reviewed EPA and WHO standards. Gemini is used solely for natural language synthesis, customized schedule sequencing, and localized advice.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm mb-1.5">
              1. The Inhalation Dose Equation
            </h4>
            <div className="rounded bg-stone-100 p-3 font-mono text-[11px] text-ink overflow-x-auto">
              Daily Inhaled PM2.5 (µg) = Σ [ Exposure Hours_i × Ventilation Rate (m³/h) × Micro-environment PM2.5 (µg/m³) ]
            </div>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm mb-1.5">
              2. Respiratory Ventilation Rates (EPA Exposure Factors)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-stone-200 text-left">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="border border-stone-200 p-2 font-bold">Demographic</th>
                    <th className="border border-stone-200 p-2 font-bold">Resting / Sleep</th>
                    <th className="border border-stone-200 p-2 font-bold">Light Activity</th>
                    <th className="border border-stone-200 p-2 font-bold">Active Exercise</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <td className="border border-stone-200 p-2 font-sans font-medium">Adult</td>
                    <td className="border border-stone-200 p-2">0.45 m³/h</td>
                    <td className="border border-stone-200 p-2">0.90 m³/h</td>
                    <td className="border border-stone-200 p-2">1.80 m³/h</td>
                  </tr>
                  <tr>
                    <td className="border border-stone-200 p-2 font-sans font-medium">Child (high respiratory rate)</td>
                    <td className="border border-stone-200 p-2">0.35 m³/h</td>
                    <td className="border border-stone-200 p-2">0.70 m³/h</td>
                    <td className="border border-stone-200 p-2">1.40 m³/h</td>
                  </tr>
                  <tr>
                    <td className="border border-stone-200 p-2 font-sans font-medium">Senior</td>
                    <td className="border border-stone-200 p-2">0.40 m³/h</td>
                    <td className="border border-stone-200 p-2">0.65 m³/h</td>
                    <td className="border border-stone-200 p-2">1.20 m³/h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm mb-1.5">
              3. Indoor Infiltration Factors (F_inf)
            </h4>
            <p className="text-ink-muted">
              Without active HEPA purification, Indian urban apartments experience an infiltration factor of <strong>0.60 to 0.78</strong> (meaning 60% to 78% of outdoor particulate matter infiltrates inside through door sills, window tracks, and balcony gaps).
              Applying EPDM weatherstripping and door sill barricades cuts air changes per hour (ACH) by ~35%. Pairing this with timed midday cross-ventilation flushes stagnant CO₂ while keeping PM2.5 in check.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-ink text-sm mb-1.5">
              4. Berkeley Earth Cigarette Equivalence
            </h4>
            <p className="text-ink-muted">
              Calculated using the landmark Muller & Rohde (Berkeley Earth) environmental toxicology rule: Inhaling <strong>22 µg of PM2.5 per day</strong> is roughly equivalent in systemic cardiovascular and pulmonary inflammatory impact to <strong>1 passive cigarette</strong>.
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-stone-300 bg-stone-100 px-4 py-1.5 text-xs font-semibold text-ink hover:bg-stone-200"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
