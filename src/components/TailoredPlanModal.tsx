'use client';

import React, { useEffect } from 'react';
import { DailyRoutineSlot, ActionItem } from '../types';
import { ActionPlanTabs } from './ActionPlanTabs';
import { X, Sparkles, RefreshCw, Printer, Shield, CheckCircle2 } from 'lucide-react';

interface TailoredPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineSchedule: DailyRoutineSlot[];
  iaqHacks: ActionItem[];
  sustainableActions: ActionItem[];
  communityPointers: string[];
  adoptedActionIds: string[];
  onToggleAction: (actionId: string) => void;
  summaryVerdict: string;
  cityName: string;
  percentageExposureDrop: number;
  onRefreshPlan?: () => void;
  isLoadingPlan?: boolean;
  isDarkMode?: boolean;
}

export const TailoredPlanModal: React.FC<TailoredPlanModalProps> = ({
  isOpen,
  onClose,
  routineSchedule,
  iaqHacks,
  sustainableActions,
  communityPointers,
  adoptedActionIds,
  onToggleAction,
  summaryVerdict,
  cityName,
  percentageExposureDrop,
  onRefreshPlan,
  isLoadingPlan = false,
  isDarkMode = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAdopted = adoptedActionIds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fade-in">
      {/* Dark backdrop overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] shadow-2xl overflow-hidden transition-all text-ink dark:text-stone-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tailored-plan-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-stone-200 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-sage-500/15 text-sage-600 dark:text-sage-400 border border-sage-500/25 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="tailored-plan-title" className="text-base sm:text-lg font-bold tracking-tight text-ink dark:text-stone-100">
                  Tailored AI Action Plan &amp; Daily Routine
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-sage-500/30 bg-sage-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sage-600 dark:text-sage-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{totalAdopted} Habits Active</span>
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-stone-400 mt-0.5">
                Clinical diurnal schedule &amp; exposure reduction protocols for <strong className="text-ink dark:text-stone-200">{cityName}</strong>
              </p>
            </div>
          </div>

          {/* Top Actions: Print & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] text-xs font-medium text-ink-muted dark:text-stone-300 hover:text-ink hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs"
              title="Print Action Plan"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Plan</span>
            </button>

            {onRefreshPlan && (
              <button
                onClick={onRefreshPlan}
                disabled={isLoadingPlan}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] text-xs font-medium text-ink-muted dark:text-stone-300 hover:text-ink hover:bg-stone-100 dark:hover:bg-[#28332E] disabled:opacity-50 transition-colors shadow-2xs"
                title="Re-run GenAI reasoning"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingPlan ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isLoadingPlan ? 'Updating…' : 'Recalculate'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-[#28332E] transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Live Exposure Drop Indicator Strip */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-2.5 bg-sage-50/70 dark:bg-[#1F2723] border-b border-sage-200/60 dark:border-[#28352F] text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sage-600 dark:text-sage-400 shrink-0" />
            <span className="text-ink dark:text-stone-200 font-medium">
              Modeled Pulmonary Exposure Drop:
            </span>
            <strong className="font-mono text-sage-700 dark:text-sage-300 font-bold text-sm">
              -{percentageExposureDrop}%
            </strong>
          </div>
          <span className="text-[11px] text-ink-muted dark:text-stone-400">
            Toggling habits recalculates dose live
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <ActionPlanTabs
            routineSchedule={routineSchedule}
            iaqHacks={iaqHacks}
            sustainableActions={sustainableActions}
            communityPointers={communityPointers}
            adoptedActionIds={adoptedActionIds}
            onToggleAction={onToggleAction}
            summaryVerdict={summaryVerdict}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-t border-stone-200 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A]">
          <span className="text-xs text-ink-muted dark:text-stone-400 font-mono">
            {totalAdopted} habit{totalAdopted === 1 ? '' : 's'} adopted in household profile
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-ink dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            Done &amp; Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
