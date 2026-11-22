'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBreathLine } from '@/context/BreathLineContext';
import { Masthead } from '@/components/Masthead';
import { 
  ArrowLeft, 
  MessageSquare, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Building2, 
  Sparkles, 
  Leaf, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { getAQIStyle } from '@/lib/aqiScale';

export default function RwaBulletinPage() {
  const {
    currentCity,
    profile,
    updateProfile,
    impact,
    isDarkMode,
  } = useBreathLine();

  const [copied, setCopied] = useState(false);
  const cityAqiStyle = getAQIStyle(currentCity.currentAQI, isDarkMode, currentCity.aqiCategory);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isSevere = currentCity.currentAQI > 200;

  const bulletinText = isSevere
    ? `🚨 *RWA / APARTMENT WINTER SMOG ADVISORY*
📍 *Area:* ${currentCity.name} | *Date:* ${todayStr}
📊 *Today's AQI:* ${currentCity.currentAQI} (${currentCity.aqiCategory.toUpperCase()})
💨 *PM2.5 Level:* ${currentCity.pm25} µg/m³ (${(currentCity.pm25 / 15).toFixed(1)}x WHO Safe Limit)

⚠️ *SMOG & COLD AIR WARNING:*
Cold winter air is trapping vehicle smoke and construction dust close to the ground. Smog levels are highest between *${currentCity.highRiskInversionHours}*.

🪟 *VENTILATION PROTOCOL:*
• *Keep Windows Sealed:* Keep balcony doors and windows closed during early mornings (05:00-09:30 AM) and nights (08:00 PM-02:00 AM).
• *Safe Ventilation Window:* Air out your home only between *${currentCity.safeVentilationWindows}* when daytime sunshine clears surface air.

👥 *COMMUNITY ACTIONS FOR RESIDENTS:*
1. *No Open Burning:* Security staff and gardeners must not burn dry leaves or trash. Please use electric heaters at security gates.
2. *Turn Off Idling Engines:* Switch off car engines while waiting at basement gates or during school bus pickup.
3. *Protect Kids & Seniors:* Move morning walks and sports indoors; outdoor playtime is much safer after 11:30 AM.

🌱 *COLLECTIVE COMMUNITY IMPACT:*
When ${impact.communityFamiliesCount} families in our complex follow this protocol, our society avoids *${impact.communityMonthlyCo2SavedKg} kg CO₂* and prevents *${impact.communityMonthlyPmPreventedKg} kg PM2.5* this month!

— Shared via *BreathLine* (Winter Air & Routine Guide)`
    : `🌱 *RWA / APARTMENT CLEAN AIR & HEALTH BULLETIN*
📍 *Area:* ${currentCity.name} | *Date:* ${todayStr}
📊 *Today's AQI:* ${currentCity.currentAQI} (${currentCity.aqiCategory} · Clean Air)
💨 *PM2.5 Level:* ${currentCity.pm25} µg/m³ (Well within comfortable limits)

☀️ *TODAY'S AIR & OUTDOOR UPDATE:*
Airflow is fresh and clear with steady breezes across our area. No smog or cold air trapping today—air quality is healthy and safe!

🪟 *VENTILATION & OUTDOOR ACTIVITIES:*
• *Open Windows for Fresh Air:* Safe for continuous natural cross-breeze throughout the day (${currentCity.safeVentilationWindows}).
• *Great for Outdoor Exercise:* Ideal conditions for morning jogs, children's park play, and terrace walks.

👥 *EASY HABITS TO KEEP OUR AIR CLEAN:*
1. *Water Balcony Plants:* Potted greens help capture localized dust and keep balcony air fresh.
2. *Share Rides:* Carpool or use the metro when possible to help keep city roads light and low-emission.
3. *Compost Garden Leaves:* Deposit dry leaves into the society compost pit instead of disposal or burning.

🏆 *COLLECTIVE COMMUNITY IMPACT:*
When ${impact.communityFamiliesCount} families in our complex practice these easy habits, our society avoids *${impact.communityMonthlyCo2SavedKg} kg CO₂* and prevents *${impact.communityMonthlyPmPreventedKg} kg PM2.5* every month!

— Shared via *BreathLine* (Winter Air & Routine Guide)`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(bulletinText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(bulletinText);
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-[#121615] flex flex-col font-sans overflow-x-hidden text-ink dark:text-stone-100 transition-colors">
      {/* Top Masthead */}
      <Masthead activeRoute="/rwa-bulletin" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100 transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-[#1F2723]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Back to Dashboard</span>
          </Link>

          {/* Active Station Tag */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#1A221F] shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
              <strong className="text-ink dark:text-stone-200">{currentCity.name}</strong>
              <span
                className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: cityAqiStyle.bg,
                  color: cityAqiStyle.text,
                }}
              >
                {currentCity.currentAQI} AQI
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#1A221F] text-ink-muted dark:text-stone-400 shadow-2xs">
              <Building2 className="h-3.5 w-3.5" />
              <span>{profile.societySizeFamilies} Families Complex</span>
            </span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-7 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200 dark:border-[#2B3833]">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-sage-500/15 text-sage-600 dark:text-sage-400 border border-sage-500/25 shrink-0 shadow-xs">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-ink dark:text-stone-100">
                    RWA &amp; Society Community Clean Air Bulletin
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-sage-500/30 bg-sage-500/10 px-2.5 py-0.5 text-xs font-semibold text-sage-600 dark:text-sage-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>WhatsApp Ready</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-stone-300 mt-1">
                  Ready-to-broadcast community notices, complex scale multipliers, and one-click WhatsApp export for resident groups.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] text-xs font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Key Community Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5">
            <div className="p-3.5 rounded-2xl bg-sage-50 dark:bg-[#1F2723] border border-sage-200 dark:border-[#28352F]">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-stone-400 block mb-0.5">
                Monthly Society PM2.5 Prevented
              </span>
              <strong className="font-mono text-xl font-bold text-sage-700 dark:text-sage-300">
                {impact.communityMonthlyPmPreventedKg} kg PM2.5
              </strong>
              <span className="text-[10px] text-ink-muted dark:text-stone-400 block mt-0.5">
                Zero-burn &amp; carpooling adoption
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-stone-400 block mb-0.5">
                Monthly Society CO₂ Saved
              </span>
              <strong className="font-mono text-xl font-bold text-ink dark:text-stone-100">
                {impact.communityMonthlyCo2SavedKg} kg CO₂
              </strong>
              <span className="text-[10px] text-ink-muted dark:text-stone-400 block mt-0.5">
                Equivalent to 34 urban tree-months
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-stone-400 block mb-0.5">
                Active Society Size
              </span>
              <strong className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                {profile.societySizeFamilies} Families
              </strong>
              <span className="text-[10px] text-ink-muted dark:text-stone-400 block mt-0.5">
                Adjust multiplier slider below
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Workstation: Left Scale Multiplier & Guidelines, Right WhatsApp Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Community Scale Multiplier & Society Guidance (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Multiplier Slider Card */}
            <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-ink dark:text-stone-100 uppercase tracking-wider">
                  Apartment Complex Multiplier
                </span>
                <span className="font-mono font-bold text-xs bg-sage-50 dark:bg-[#1F2723] text-sage-700 dark:text-sage-300 px-2 py-0.5 rounded border border-sage-200 dark:border-[#28352F]">
                  {profile.societySizeFamilies} Families
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-stone-400 mb-3">
                Drag to simulate cumulative community health and emission impact across your housing society:
              </p>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={profile.societySizeFamilies}
                onChange={(e) =>
                  updateProfile({ ...profile, societySizeFamilies: Number(e.target.value) })
                }
                className="editorial-slider w-full"
                style={{ "--slider-pct": `${Math.min(100, Math.max(0, ((profile.societySizeFamilies - 10) / (500 - 10)) * 100))}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-muted dark:text-stone-400 mt-2">
                <span>10 (Small block)</span>
                <span>100 (Medium society)</span>
                <span>500 (Gated township)</span>
              </div>
            </div>

            {/* Society Best Practice Checklist */}
            <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink dark:text-stone-100 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-sage-600 dark:text-sage-400" />
                <span>RWA Action Protocols for Winter Smog</span>
              </h3>

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
                  <span className="text-amber-500 font-bold shrink-0">1.</span>
                  <div>
                    <strong className="text-ink dark:text-stone-200 block">Strict Biomass &amp; Leaf Burning Ban</strong>
                    <span className="text-ink-muted dark:text-stone-400">
                      Provide electric radiant heaters to security staff at entry gates to prevent late-night wood/plastic fires.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
                  <span className="text-amber-500 font-bold shrink-0">2.</span>
                  <div>
                    <strong className="text-ink dark:text-stone-200 block">Diesel Generator (DG) Curfew</strong>
                    <span className="text-ink-muted dark:text-stone-400">
                      Restrict testing of standby diesel generators during severe inversion hours (06:00–09:30 AM).
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
                  <span className="text-amber-500 font-bold shrink-0">3.</span>
                  <div>
                    <strong className="text-ink dark:text-stone-200 block">Basement Anti-Idling Policy</strong>
                    <span className="text-ink-muted dark:text-stone-400">
                      Request drivers and car owners shut off idling vehicle engines while waiting inside underground basements.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#222B27] border border-stone-200 dark:border-[#2D3A34]">
                  <span className="text-amber-500 font-bold shrink-0">4.</span>
                  <div>
                    <strong className="text-ink dark:text-stone-200 block">School Bus &amp; Office Carpooling</strong>
                    <span className="text-ink-muted dark:text-stone-400">
                      Coordinate society WhatsApp threads for shared school transit, removing up to 40 individual cars from morning traffic.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: WhatsApp Preview Card & Direct Share (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] shadow-md overflow-hidden">
              {/* WhatsApp Mock Header */}
              <div className="px-5 py-3.5 bg-[#075E54] dark:bg-[#064e46] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    RWA
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">
                      {currentCity.name} Clean Air Advisory
                    </h3>
                    <p className="text-[11px] text-white/80">
                      Broadcast via BreathLine · {todayStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chat Bubble Body */}
              <div className="p-4 sm:p-6 bg-[#EFEAE2] dark:bg-[#111B15] font-sans">
                <div className="rounded-2xl bg-white dark:bg-[#202C23] p-4 sm:p-5 shadow-sm border border-stone-200/60 dark:border-[#2D3A34] text-xs leading-relaxed text-ink dark:text-stone-200 whitespace-pre-line font-mono sm:font-sans">
                  {bulletinText}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 sm:p-5 bg-stone-50 dark:bg-[#161D1A] border-t border-stone-200 dark:border-[#2B3833] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-ink-muted dark:text-stone-400">
                  Formatted with WhatsApp markdown (*bold*, _italic_)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#222B27] text-xs font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Full Message'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Open in WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-[#2B3833]">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Main Environmental Dashboard</span>
          </Link>

          <Link
            href="/routine"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700"
          >
            <span>View Tailored AI Action Plan &amp; Daily Routine</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-300 dark:border-[#2B3833] bg-stone-50 dark:bg-[#161D1A] py-4 text-center text-xs text-ink-muted dark:text-stone-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>BreathLine</strong> · Winter Air &amp; Routine Guide · Household Exposure Co-Pilot
          </span>
          <span className="font-mono text-[11px]">
            EPA &amp; WHO Inhalation Dose Modeling · Tabular Strict Physics Engine
          </span>
        </div>
      </footer>
    </main>
  );
}
