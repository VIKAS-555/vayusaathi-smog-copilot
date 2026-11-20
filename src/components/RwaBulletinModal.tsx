import React, { useState } from 'react';
import { CitySmogContext, ImpactSimulationResults, HouseholdProfile } from '../types';
import { X, Copy, Check, MessageSquare, Share2 } from 'lucide-react';

interface RwaBulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CitySmogContext;
  impact: ImpactSimulationResults;
  profile: HouseholdProfile;
}

export const RwaBulletinModal: React.FC<RwaBulletinModalProps> = ({
  isOpen,
  onClose,
  city,
  impact,
  profile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isSevere = city.currentAQI > 200;

  const bulletinText = isSevere
    ? `🚨 *RWA / APARTMENT WINTER SMOG ADVISORY*
📍 *Area:* ${city.name} | *Date:* ${todayStr}
📊 *Today's AQI:* ${city.currentAQI} (${city.aqiCategory.toUpperCase()})
💨 *PM2.5 Level:* ${city.pm25} µg/m³ (${(city.pm25 / 15).toFixed(1)}x WHO Safe Limit)

⚠️ *SMOG & COLD AIR WARNING:*
Cold winter air is trapping vehicle smoke and construction dust close to the ground. Smog levels are highest between *${city.highRiskInversionHours}*.

🪟 *VENTILATION PROTOCOL:*
• *Keep Windows Sealed:* Keep balcony doors and windows closed during early mornings (05:00-09:30 AM) and nights (08:00 PM-02:00 AM).
• *Safe Ventilation Window:* Air out your home only between *${city.safeVentilationWindows}* when daytime sunshine helps clear the air.

👥 *COMMUNITY ACTIONS FOR RESIDENTS:*
1. *No Open Burning:* Security staff and gardeners must not burn dry leaves or trash. Please use electric heaters at security gates.
2. *Turn Off Idling Engines:* Switch off car engines while waiting at basement gates or during school bus pickup.
3. *Protect Kids & Seniors:* Move morning walks and sports indoors; outdoor playtime is much safer after 11:30 AM.

🌱 *COLLECTIVE COMMUNITY IMPACT:*
When ${impact.communityFamiliesCount} families in our complex follow this protocol, our society avoids *${impact.communityMonthlyCo2SavedKg} kg CO₂* and prevents *${impact.communityMonthlyPmPreventedKg} kg PM2.5* this month!

— Shared via *VayuSaathi* (Household Air Co-Pilot)`
    : `🌱 *RWA / APARTMENT CLEAN AIR & HEALTH BULLETIN*
📍 *Area:* ${city.name} | *Date:* ${todayStr}
📊 *Today's AQI:* ${city.currentAQI} (${city.aqiCategory} · Clean Air)
💨 *PM2.5 Level:* ${city.pm25} µg/m³ (Well within comfortable limits)

☀️ *TODAY'S AIR & OUTDOOR UPDATE:*
Airflow is fresh and clear with steady breezes across our area. No smog or cold air trapping today—air quality is healthy and safe!

🪟 *VENTILATION & OUTDOOR ACTIVITIES:*
• *Open Windows for Fresh Air:* Safe for continuous natural cross-breeze throughout the day (${city.safeVentilationWindows}).
• *Great for Outdoor Exercise:* Ideal conditions for morning jogs, children's park play, and terrace walks.

👥 *EASY HABITS TO KEEP OUR AIR CLEAN:*
1. *Water Balcony Plants:* Potted greens help capture localized dust and keep balcony air fresh.
2. *Share Rides:* Carpool or use the metro when possible to help keep city roads light and low-emission.
3. *Compost Garden Leaves:* Deposit dry leaves into the society compost pit instead of disposal or burning.

🏆 *COLLECTIVE COMMUNITY IMPACT:*
When ${impact.communityFamiliesCount} families in our complex practice these easy habits, our society avoids *${impact.communityMonthlyCo2SavedKg} kg CO₂* and prevents *${impact.communityMonthlyPmPreventedKg} kg PM2.5* every month!

— Shared via *VayuSaathi* (Household Air Co-Pilot)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-lg border border-stone-300 bg-white p-6 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-sage-600" />
            <div>
              <h3 className="text-base font-bold text-ink">
                RWA / Society WhatsApp Advisory Bulletin
              </h3>
              <p className="text-xs text-ink-muted">
                Pre-formatted for your apartment society or neighborhood WhatsApp group.
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

        {/* Content Box */}
        <div className="mt-4 flex-1 overflow-y-auto rounded border border-stone-200 bg-stone-50 p-4 font-mono text-xs leading-relaxed text-ink whitespace-pre-wrap select-all">
          {bulletinText}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
          <span className="text-xs text-ink-muted">
            Formatted with WhatsApp bolding (*text*) and clear emojis.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-stone-100"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded border border-sage-600 bg-sage-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sage-700 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy WhatsApp Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
