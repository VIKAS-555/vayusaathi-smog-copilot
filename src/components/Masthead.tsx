import React from 'react';
import { Wind, ShieldAlert, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface MastheadProps {
  aqiCategory: string;
  isHazardous: boolean;
  onRefreshPlan: () => void;
  isLoading: boolean;
  onOpenExplainer: () => void;
  onOpenRwaModal: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  aqiCategory,
  isHazardous,
  onRefreshPlan,
  isLoading,
  onOpenExplainer,
  onOpenRwaModal,
}) => {
  return (
    <header className="border-b border-stone-300 bg-stone-50 px-4 py-3.5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-stone-300 bg-white shadow-xs">
            <Wind className="h-5 w-5 text-ink" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-ink">
                VayuSaathi <span className="font-normal text-ink-muted">· वायुसाथी</span>
              </h1>
              <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                v1.0 Civic Pilot
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Family & Community Winter Smog Co-Pilot · Field Advisory Platform
            </p>
          </div>
        </div>

        {/* Severity Badge & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`flex items-center gap-1.5 rounded border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              isHazardous
                ? 'border-terracotta-300 bg-terracotta-50 text-terracotta-700'
                : 'border-sage-300 bg-sage-50 text-sage-800'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Episode: {aqiCategory}</span>
          </div>

          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1.5 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-stone-100 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-ink-muted" />
            <span>Math Engine</span>
          </button>

          <button
            onClick={onOpenRwaModal}
            className="flex items-center gap-1.5 rounded border border-sage-600 bg-sage-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sage-700 transition-colors shadow-xs"
          >
            <span>RWA WhatsApp Bulletin</span>
          </button>

          <button
            onClick={onRefreshPlan}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-stone-100 disabled:opacity-50 transition-colors"
            title="Re-run GenAI reasoning with updated household settings"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-ink-muted ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing…' : 'Update Plan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
