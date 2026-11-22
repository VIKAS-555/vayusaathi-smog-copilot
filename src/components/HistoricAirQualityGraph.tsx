'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CitySmogContext } from '@/types';
import { getAQIStyle, getAQITier } from '@/lib/aqiScale';
import { getHourlyGuidance } from '@/data/cityPresets';
import { 
  ChevronDown, 
  Check, 
  Sun, 
  CloudFog, 
  Wind, 
  Activity, 
  ShieldAlert 
} from 'lucide-react';

interface HistoricAirQualityGraphProps {
  currentCity: CitySmogContext;
  isDarkMode: boolean;
}

type TimeframeOption = 'Hourly' | 'Daily' | 'Monthly';
type MetricOption = 'AQI (CPCB)' | 'PM2.5 (µg/m³)' | 'PM10 (µg/m³)';

interface DataPoint {
  id: string;
  hour?: number;
  timeLabel: string;      // Short tick label, e.g. "20:30", "Nov 15", "Jan"
  fullRangeLabel: string; // Full hover label, e.g. "19:30–20:30 Nov 20", "Nov 15, 2026", "January 2026"
  aqi: number;
  pm25: number;
  pm10: number;
  isSafeAiringWindow?: boolean;
  inversionRisk?: 'Low' | 'Moderate' | 'High' | 'Severe';
}

// Generate 36 continuous hourly bars showing diurnal atmospheric cycles
function generateHourlyData(city: CitySmogContext): DataPoint[] {
  const points: DataPoint[] = [];
  const baseAqi = city.currentAQI;
  const basePm25 = city.pm25;
  const basePm10 = city.pm10;

  const now = new Date();

  // Create 36 hourly intervals (from 35 hours ago to now)
  for (let i = 35; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = d.getHours();
    const hourStr = `${hour.toString().padStart(2, '0')}:30`;
    const nextHourStr = `${((hour + 1) % 24).toString().padStart(2, '0')}:30`;
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Diurnal factor: peak in early morning (05:00-09:00), lowest in midday solar convection (12:00-15:30)
    let diurnalFactor = 1.0;
    let inversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';

    if (hour >= 5 && hour <= 9) {
      diurnalFactor = 1.18 + Math.sin(hour * 0.8) * 0.05;
      inversionRisk = baseAqi > 250 ? 'Severe' : 'High';
    } else if (hour >= 12 && hour <= 15) {
      diurnalFactor = 0.68 + Math.cos(hour * 0.5) * 0.04;
      inversionRisk = 'Low';
    } else if (hour >= 19 && hour <= 23) {
      diurnalFactor = 1.08 + Math.sin(hour * 0.4) * 0.04;
      inversionRisk = baseAqi > 250 ? 'High' : 'Moderate';
    } else {
      diurnalFactor = 0.92 + Math.sin(hour * 0.3) * 0.06;
      inversionRisk = 'Moderate';
    }

    // Add subtle multi-day weather wave so yesterday vs today has authentic continuity
    const waveOffset = Math.sin(i * 0.16) * 0.07;
    const finalFactor = Math.max(0.35, diurnalFactor + waveOffset);

    const aqi = Math.max(25, Math.round(baseAqi * finalFactor));
    const pm25 = Math.max(12, Math.round(basePm25 * finalFactor));
    const pm10 = Math.max(18, Math.round(basePm10 * finalFactor));

    const isSafeAiring = hour >= city.ventilationStartHour && hour <= city.ventilationEndHour;

    points.push({
      id: `h-${i}`,
      hour,
      timeLabel: hourStr,
      fullRangeLabel: `${hourStr}–${nextHourStr} ${dateStr}`,
      aqi,
      pm25,
      pm10,
      isSafeAiringWindow: isSafeAiring,
      inversionRisk,
    });
  }

  return points;
}

// Generate 30 daily bars showing past month
function generateDailyData(city: CitySmogContext): DataPoint[] {
  const points: DataPoint[] = [];
  const baseAqi = city.currentAQI;
  const basePm25 = city.pm25;
  const basePm10 = city.pm10;

  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fullDateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    // Weather fronts and episodic inversion waves across 30 days
    const wave = Math.sin((30 - i) * 0.35) * 0.22 + Math.cos((30 - i) * 0.18) * 0.12;
    // Gradual seasonal winter buildup towards late November
    const seasonalTrend = ((30 - i) / 30) * 0.18;
    const factor = Math.max(0.4, 0.85 + wave + seasonalTrend);

    const aqi = Math.max(30, Math.round(baseAqi * factor));
    const pm25 = Math.max(15, Math.round(basePm25 * factor));
    const pm10 = Math.max(22, Math.round(basePm10 * factor));

    points.push({
      id: `d-${i}`,
      timeLabel: dateStr,
      fullRangeLabel: fullDateStr,
      aqi,
      pm25,
      pm10,
    });
  }

  return points;
}

// Generate 12 monthly bars showing the annual seasonal inversion cycle
function generateMonthlyData(city: CitySmogContext): DataPoint[] {
  const months = [
    { name: 'Jan', factor: 1.15 },
    { name: 'Feb', factor: 0.90 },
    { name: 'Mar', factor: 0.70 },
    { name: 'Apr', factor: 0.58 },
    { name: 'May', factor: 0.52 },
    { name: 'Jun', factor: 0.38 }, // Monsoon onset
    { name: 'Jul', factor: 0.28 }, // Peak Monsoon clean air
    { name: 'Aug', factor: 0.32 },
    { name: 'Sep', factor: 0.48 },
    { name: 'Oct', factor: 0.80 }, // Post-monsoon inversion starts
    { name: 'Nov', factor: 1.20 }, // Severe inversion peak
    { name: 'Dec', factor: 1.25 },
  ];

  const baseAqi = city.currentAQI;
  const basePm25 = city.pm25;
  const basePm10 = city.pm10;

  return months.map((m, idx) => {
    const aqi = Math.max(25, Math.round(baseAqi * m.factor));
    const pm25 = Math.max(10, Math.round(basePm25 * m.factor));
    const pm10 = Math.max(15, Math.round(basePm10 * m.factor));

    return {
      id: `m-${idx}`,
      timeLabel: m.name,
      fullRangeLabel: `${m.name} 2026 (Monthly Average)`,
      aqi,
      pm25,
      pm10,
    };
  });
}

export function HistoricAirQualityGraph({
  currentCity,
  isDarkMode,
}: HistoricAirQualityGraphProps) {
  // 1. Timeframe state ('Hourly' | 'Daily' | 'Monthly')
  const [timeframe, setTimeframe] = useState<TimeframeOption>('Hourly');

  // 2. Metric selector state
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>('AQI (CPCB)');
  const [showMetricMenu, setShowMetricMenu] = useState<boolean>(false);
  const metricMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (metricMenuRef.current && !metricMenuRef.current.contains(e.target as Node)) {
        setShowMetricMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Hovered or selected bar index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 4. Compute data series for the active timeframe
  const dataset = useMemo(() => {
    switch (timeframe) {
      case 'Hourly':
        return generateHourlyData(currentCity);
      case 'Daily':
        return generateDailyData(currentCity);
      case 'Monthly':
        return generateMonthlyData(currentCity);
    }
  }, [timeframe, currentCity]);

  // Default active point: latest or hovered
  const activeIndex = hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < dataset.length
    ? hoveredIndex
    : dataset.length - 1; // latest by default
  const activePoint = dataset[activeIndex] || dataset[0];

  // Helper to get metric value
  const getMetricValue = (item: DataPoint): number => {
    if (selectedMetric === 'PM2.5 (µg/m³)') return item.pm25;
    if (selectedMetric === 'PM10 (µg/m³)') return item.pm10;
    return item.aqi;
  };

  const activeValue = getMetricValue(activePoint);
  const activeStyle = getAQIStyle(activePoint.aqi, isDarkMode);

  // 5. Compute dynamic Y-axis max value and tick steps
  const { maxVal, yTicks } = useMemo(() => {
    const rawMax = Math.max(...dataset.map(getMetricValue));

    // Choose clean stepped ceiling
    let ceiling = 210;
    let step = 30;

    if (rawMax <= 150) {
      ceiling = 180;
      step = 30;
    } else if (rawMax <= 210) {
      ceiling = 210;
      step = 30;
    } else if (rawMax <= 300) {
      ceiling = 300;
      step = 50;
    } else if (rawMax <= 420) {
      ceiling = 420;
      step = 60;
    } else {
      ceiling = 500;
      step = 100;
    }

    const ticks: number[] = [];
    for (let v = 0; v <= ceiling; v += step) {
      ticks.push(v);
    }

    return { maxVal: ceiling, yTicks: ticks };
  }, [dataset, selectedMetric]);

  // Determine tick visibility intervals along X-axis
  const shouldShowXTick = (idx: number, total: number): boolean => {
    if (timeframe === 'Hourly') {
      return idx % 6 === 0 || idx === total - 1;
    }
    if (timeframe === 'Daily') {
      return idx % 7 === 0 || idx === total - 1;
    }
    return idx % 2 === 0 || idx === total - 1;
  };

  // Plain-English Guidance Takeaway for Hourly Mode
  const activeGuidance = useMemo(() => {
    if (timeframe !== 'Hourly' || activePoint.hour === undefined) {
      return null;
    }
    return getHourlyGuidance({
      hour: activePoint.hour,
      pm25: activePoint.pm25,
      aqi: activePoint.aqi,
      inversionRisk: activePoint.inversionRisk || 'Moderate',
      isSafeVentilationWindow: activePoint.isSafeAiringWindow || false,
    });
  }, [timeframe, activePoint]);

  return (
    <div className="space-y-2.5" aria-label={`Historic air quality near ${currentCity.name}`}>
      {/* Outside Section Title matching the uploaded design */}
      <h2 className="text-base sm:text-lg font-bold text-ink dark:text-stone-100 tracking-tight">
        Historic air quality near {currentCity.name}
      </h2>

      {/* Main Card Container */}
      <div className="rounded-2xl border border-stone-300 dark:border-[#2B3833] bg-white dark:bg-[#1A221F] p-5 sm:p-6 shadow-xs transition-colors">
        
        {/* Top Header Row: Left Title & Dynamic Highlight, Right Controls */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-[#26312C]">
          
          {/* Left: History title + Dynamic Hover/Selected Readout */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-ink dark:text-stone-100">
              History
            </h3>
            <p className="text-xs text-ink-muted dark:text-stone-400 mt-0.5">
              Historic air quality graph for {currentCity.name}
            </p>

            {/* Metric Highlight (Dot + AQI Number + Category) */}
            <div className="mt-3 flex items-center gap-2">
              <span 
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm transition-colors duration-300"
                style={{ backgroundColor: activeStyle.accent }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-ink dark:text-stone-100 tracking-tight tabular-nums">
                  {activeValue} {selectedMetric.startsWith('AQI') ? 'AQI (CPCB)' : selectedMetric.split(' ')[0]}
                </span>
                <span 
                  className="text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors"
                  style={{ color: activeStyle.accent }}
                >
                  {activeStyle.label}
                </span>

                {/* Safe Airing corridor pill */}
                {timeframe === 'Hourly' && activePoint.isSafeAiringWindow && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-2xs">
                    <Sun className="h-3 w-3 text-emerald-500 shrink-0" />
                    <span>Safe Airing Corridor</span>
                  </span>
                )}
              </div>
            </div>

            {/* Timestamp underneath */}
            <div className="text-xs font-mono text-ink-muted dark:text-stone-400 mt-0.5">
              {activePoint.fullRangeLabel}
            </div>
          </div>

          {/* Right: Timeframe Segmented Control + Metric Dropdown */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* 1. Timeframe Pills (Hourly | Daily | Monthly) */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#222B27] p-1 rounded-lg border border-stone-200 dark:border-[#2D3A34] text-xs font-medium">
              {(['Hourly', 'Daily', 'Monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setTimeframe(tab);
                    setHoveredIndex(null);
                  }}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === tab
                      ? 'bg-white dark:bg-[#2C3832] font-bold text-ink dark:text-stone-100 shadow-2xs border border-stone-200/60 dark:border-[#384840]'
                      : 'text-ink-muted dark:text-stone-400 hover:text-ink dark:hover:text-stone-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 2. Metric Selector Dropdown Pill */}
            <div className="relative" ref={metricMenuRef}>
              <button
                onClick={() => setShowMetricMenu(!showMetricMenu)}
                className="flex items-center gap-1.5 rounded-lg border border-stone-300 dark:border-[#2D3A34] bg-stone-50 dark:bg-[#222B27] px-3 py-1.5 text-xs font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28332E] transition-all shadow-2xs"
                aria-expanded={showMetricMenu}
              >
                <span>{selectedMetric}</span>
                <ChevronDown className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400" />
              </button>

              {/* Dropdown Menu */}
              {showMetricMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-stone-300 dark:border-[#2D3A34] bg-white dark:bg-[#1A221F] p-1 shadow-lg z-30 divide-y divide-stone-100 dark:divide-[#242F2A]">
                  {(['AQI (CPCB)', 'PM2.5 (µg/m³)', 'PM10 (µg/m³)'] as MetricOption[]).map((metric) => (
                    <button
                      key={metric}
                      onClick={() => {
                        setSelectedMetric(metric);
                        setShowMetricMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-ink dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#222B27] rounded-lg transition-colors text-left"
                    >
                      <span>{metric}</span>
                      {selectedMetric === metric && (
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative pt-6 pb-2">
          
          {/* Top-Right Y-Axis Title Label */}
          <div className="absolute right-0 top-1 text-[10px] sm:text-[11px] font-mono font-semibold text-stone-400 dark:text-stone-500">
            {selectedMetric.startsWith('AQI') ? 'AQI (CPCB)' : selectedMetric.split(' ')[0]}
          </div>

          {/* Main Plot Area (Bars + Right-aligned Y Hairlines) */}
          <div className="relative h-44 sm:h-52 w-full pr-10 sm:pr-12">
            
            {/* Horizontal Hairlines across the chart with Y-Axis Tick Labels on the right */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {yTicks.map((tickVal) => {
                const bottomPct = (tickVal / maxVal) * 100;
                return (
                  <div
                    key={tickVal}
                    className="absolute inset-x-0 flex items-center border-b border-dashed border-stone-200 dark:border-[#26312C]"
                    style={{ bottom: `${bottomPct}%` }}
                  >
                    {/* Tick label positioned in the right margin */}
                    <span className="absolute -right-10 sm:-right-12 font-mono text-[10px] text-stone-400 dark:text-stone-500 select-none text-right w-8 sm:w-10 tabular-nums">
                      {tickVal}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bars Container */}
            <div className="relative z-10 flex items-end h-full w-full gap-1 sm:gap-1.5">
              {dataset.map((item, idx) => {
                const val = getMetricValue(item);
                const heightPct = Math.max(8, Math.min(100, Math.round((val / maxVal) * 100)));
                const isSelected = idx === activeIndex;
                const barTheme = getAQIStyle(item.aqi, isDarkMode);

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex(idx)}
                    className="relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer group select-none"
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.fullRangeLabel}: ${val} ${selectedMetric}`}
                  >
                    {/* Vertical Bar with severity color matching CPCB tier */}
                    <div className="relative w-full flex items-end justify-center h-full">
                      <div
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: barTheme.accent,
                        }}
                        className={`w-full max-w-[12px] rounded-t-sm sm:rounded-t-md transition-all duration-150 ${
                          isSelected
                            ? 'ring-2 ring-ink dark:ring-stone-100 ring-offset-1 ring-offset-white dark:ring-offset-[#1A221F] scale-y-[1.04] shadow-md opacity-100'
                            : 'opacity-85 hover:opacity-100 hover:scale-y-[1.02]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* X-Axis Ticks & Labels underneath */}
          <div className="relative w-full pr-10 sm:pr-12 mt-1.5 border-t border-stone-200 dark:border-[#26312C]">
            <div className="flex justify-between items-start pt-1">
              {dataset.map((item, idx) => {
                const showTick = shouldShowXTick(idx, dataset.length);
                if (!showTick) {
                  return <div key={item.id} className="flex-1" />;
                }

                return (
                  <div
                    key={item.id}
                    className="flex-1 flex flex-col items-center text-center -mt-1"
                  >
                    {/* Small vertical tick notch */}
                    <div className="w-px h-1.5 bg-stone-300 dark:bg-[#34423C]" />
                    {/* Tick label */}
                    <span className="font-mono text-[9px] sm:text-[10px] text-ink-muted dark:text-stone-400 mt-0.5 whitespace-nowrap">
                      {item.timeLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Dynamic Plain-English Guidance Takeaway (in Hourly Mode) */}
        {activeGuidance && (
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-[#26312C]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Card 1: Windows & Airing */}
              <div className="rounded-xl border border-stone-200/80 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-2.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                  <Wind className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                  <span>Windows & Airing</span>
                </div>
                <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                  {activeGuidance.ventilation}
                </p>
              </div>

              {/* Card 2: Outdoor & Exercise */}
              <div className="rounded-xl border border-stone-200/80 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-2.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                  <Activity className="h-3.5 w-3.5 text-terracotta-600 dark:text-terracotta-400 shrink-0" />
                  <span>Outdoor & Exercise</span>
                </div>
                <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                  {activeGuidance.outdoor}
                </p>
              </div>

              {/* Card 3: Atmospheric Inversion Context */}
              <div className="rounded-xl border border-stone-200/80 dark:border-[#2D3A34] bg-stone-50/70 dark:bg-[#222B27] p-2.5 sm:col-span-2 lg:col-span-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-stone-200 mb-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-ink-muted dark:text-stone-400 shrink-0" />
                  <span>Atmospheric Inversion</span>
                </div>
                <p className="text-xs text-ink-muted dark:text-stone-300 leading-relaxed">
                  {activeGuidance.atmosphere}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
