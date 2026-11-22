import React from 'react';
import { getSharedAQITheme } from '../lib/aqiScale';

export interface CitySkylineBackdropProps {
  cityId: string;
  aqi?: number;
  aqiCategory?: string;
  skylineColor?: string;
  isDark?: boolean;
  className?: string;
}

export const CitySkylineBackdrop: React.FC<CitySkylineBackdropProps> = ({
  cityId,
  aqi,
  aqiCategory,
  skylineColor,
  isDark = false,
  className = 'w-full h-full',
}) => {
  const normalizedId = (cityId || '').toLowerCase();

  // Determine active dynamic severity accent color
  const fallbackColor = aqi !== undefined 
    ? getSharedAQITheme(aqi, isDark, aqiCategory).skyline 
    : (isDark ? '#A855F7' : '#9333EA');
  const strokeColor = skylineColor || fallbackColor;

  // Unique SVG element IDs per city to prevent gradient collision
  const uid = normalizedId.replace(/[^a-z0-9]/g, '') || 'default';
  const gradLandmarkId = `landmarkGrad-${uid}`;
  const gradMistId = `horizonMist-${uid}`;
  const gradAccentId = `landmarkAccent-${uid}`;

  // Common floating atmospheric clouds (upper sky)
  const atmosphericClouds = (
    <g className="transition-opacity duration-300 pointer-events-none select-none" style={{ color: strokeColor }}>
      {/* Cloud 1 (Upper Left-Center) */}
      <path
        d="M320 42 C320 32 332 24 345 24 C350 24 355 26 358 29 C364 21 374 16 386 16 C403 16 416 28 418 42 C428 44 436 52 436 62 C436 72 426 80 414 80 L328 80 C315 80 305 70 305 58 C305 48 312 42 320 42 Z"
        fill="currentColor"
        opacity={isDark ? '0.08' : '0.12'}
      />
      {/* Cloud 2 (Center-Right) */}
      <path
        d="M680 34 C680 26 690 19 702 19 C707 19 711 21 714 24 C720 18 729 14 740 14 C755 14 767 24 769 36 C778 38 786 45 786 54 C786 63 777 70 766 70 L688 70 C676 70 666 61 666 50 C666 41 672 34 680 34 Z"
        fill="currentColor"
        opacity={isDark ? '0.10' : '0.14'}
      />
      {/* Cloud 3 (Upper Far-Right) */}
      <path
        d="M960 46 C960 36 972 28 987 28 C993 28 998 30 1002 34 C1008 25 1021 19 1034 19 C1054 19 1070 32 1072 49 C1083 51 1092 61 1092 73 C1092 85 1080 95 1067 95 L970 95 C954 95 941 83 941 69 C941 57 949 48 960 46 Z"
        fill="currentColor"
        opacity={isDark ? '0.12' : '0.16'}
      />
    </g>
  );

  // Common SVG Gradients Definition
  const defs = (
    <defs>
      {/* Precision Landmark Translucent Fill (35% to 45% opacity) */}
      <linearGradient id={gradLandmarkId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.08" />
        <stop offset="65%" stopColor={strokeColor} stopOpacity="0.22" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity={isDark ? '0.42' : '0.36'} />
      </linearGradient>

      {/* Ground Horizon Mist Gradient */}
      <linearGradient id={gradMistId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity={isDark ? '0.25' : '0.18'} />
      </linearGradient>

      {/* Accent Horizon Lines Gradient */}
      <linearGradient id={gradAccentId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.02" />
        <stop offset="45%" stopColor={strokeColor} stopOpacity="0.18" />
        <stop offset="80%" stopColor={strokeColor} stopOpacity="0.28" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.04" />
      </linearGradient>
    </defs>
  );

  // Common Base Ground Mist Plane across all skylines
  const groundPlane = (
    <g className="transition-opacity duration-300">
      <rect x="0" y="200" width="1200" height="40" fill={`url(#${gradMistId})`} />
      <line x1="0" y1="234" x2="1200" y2="234" stroke={strokeColor} strokeWidth="1" opacity={isDark ? '0.35' : '0.45'} />
    </g>
  );

  // Render city-specific architectural vectors
  const renderCityVectors = () => {
    // 1. NEW DELHI / DELHI NCR: India Gate & Rajpath parapet
    if (normalizedId.includes('delhi')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer (opacity: 0.12) */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Rashtrapati Bhavan Dome and North/South Blocks */}
            <path d="M440 234 L440 165 L460 165 L460 152 C460 128 560 128 560 152 L560 165 L580 165 L580 234 Z" />
            <circle cx="510" cy="138" r="18" />
            <line x1="510" y1="120" x2="510" y2="110" />
            {/* Distant Qutub Minar Silhouette */}
            <path d="M340 234 L348 95 L354 95 L362 234 Z" />
            <line x1="346" y1="130" x2="356" y2="130" />
            <line x1="344" y1="165" x2="358" y2="165" />
            <line x1="342" y1="198" x2="360" y2="198" />
            {/* Distant Red Fort rampart battlements */}
            <path d="M1040 234 L1040 170 L1055 170 L1055 155 L1075 155 L1075 170 L1110 170 L1110 150 L1130 150 L1130 170 L1160 170 L1160 234 Z" />
            {/* Distant Horizon Grid Lines */}
            <line x1="200" y1="210" x2="600" y2="210" strokeDasharray="3 3" />
            <line x1="800" y1="215" x2="1180" y2="215" strokeDasharray="3 3" />
          </g>

          {/* Layer 2: Foreground Landmark Layer (strokeWidth="1.25", opacity: 0.40) */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* Rajpath Stone Parapet & Balustrade Walls */}
            <path d="M560 234 L560 216 L680 216 L680 234 Z" />
            <path d="M960 234 L960 216 L1080 216 L1080 234 Z" />
            <line x1="570" y1="222" x2="670" y2="222" strokeWidth="0.8" />
            <line x1="970" y1="222" x2="1070" y2="222" strokeWidth="0.8" />
            {/* Baluster posts */}
            <line x1="585" y1="222" x2="585" y2="234" strokeWidth="0.8" />
            <line x1="615" y1="222" x2="615" y2="234" strokeWidth="0.8" />
            <line x1="645" y1="222" x2="645" y2="234" strokeWidth="0.8" />
            <line x1="995" y1="222" x2="995" y2="234" strokeWidth="0.8" />
            <line x1="1025" y1="222" x2="1025" y2="234" strokeWidth="0.8" />
            <line x1="1055" y1="222" x2="1055" y2="234" strokeWidth="0.8" />

            {/* INDIA GATE - Stepped Plinth Foundation */}
            <path d="M684 234 L694 224 L946 224 L956 234 Z" />
            <rect x="702" y="214" width="236" height="10" />

            {/* Left Pylon Wing */}
            <rect x="712" y="68" width="58" height="146" />
            <line x1="724" y1="76" x2="724" y2="214" strokeWidth="0.8" />
            <line x1="741" y1="76" x2="741" y2="214" strokeWidth="0.8" />
            <line x1="758" y1="76" x2="758" y2="214" strokeWidth="0.8" />

            {/* Right Pylon Wing */}
            <rect x="870" y="68" width="58" height="146" />
            <line x1="882" y1="76" x2="882" y2="214" strokeWidth="0.8" />
            <line x1="899" y1="76" x2="899" y2="214" strokeWidth="0.8" />
            <line x1="916" y1="76" x2="916" y2="214" strokeWidth="0.8" />

            {/* Grand Triumphal Archway Vault */}
            <path d="M770 214 L770 145 C770 95, 870 95, 870 145 L870 214 Z" />
            {/* Inner Arch Accent Keystones */}
            <path d="M782 214 L782 152 C782 112, 858 112, 858 152 L858 214" fill="none" strokeWidth="0.9" />
            <circle cx="820" cy="116" r="4.5" fill={strokeColor} />

            {/* Main Architrave, Frieze & Inscription Panel */}
            <rect x="696" y="52" width="248" height="16" />
            <line x1="708" y1="60" x2="932" y2="60" strokeWidth="0.8" strokeDasharray="4 2" />

            {/* Upper Stepped Cornice & Attic */}
            <rect x="716" y="40" width="208" height="12" />
            <rect x="740" y="30" width="160" height="10" />

            {/* Top Imperial Urn / Shallow Dome Plinth */}
            <path d="M785 30 C785 22, 855 22, 855 30 Z" />
            <line x1="820" y1="22" x2="820" y2="16" strokeWidth="1.2" />
          </g>
        </>
      );
    }

    // 2. GURUGRAM: Cyber Hub glass towers & elevated Rapid Metro viaduct arches
    if (normalizedId.includes('gurugram') || normalizedId.includes('gurgaon')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Golf Course Road & Horizon Center Glass Towers */}
            <rect x="520" y="80" width="60" height="154" />
            <rect x="600" y="60" width="70" height="174" />
            <rect x="990" y="70" width="80" height="164" />
            <rect x="1090" y="90" width="60" height="144" />
            {/* Communication Spires */}
            <line x1="550" y1="80" x2="550" y2="50" />
            <line x1="635" y1="60" x2="635" y2="35" />
            <line x1="1030" y1="70" x2="1030" y2="40" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* Cyber Hub Chamfered Modern Glass Tower 1 */}
            <path d="M680 234 L680 62 L740 38 L770 55 L770 234 Z" />
            {/* Curtain wall grid lines */}
            <line x1="695" y1="68" x2="695" y2="234" strokeWidth="0.8" />
            <line x1="715" y1="60" x2="715" y2="234" strokeWidth="0.8" />
            <line x1="735" y1="52" x2="735" y2="234" strokeWidth="0.8" />
            <line x1="755" y1="62" x2="755" y2="234" strokeWidth="0.8" />
            <line x1="680" y1="100" x2="770" y2="100" strokeWidth="0.7" strokeDasharray="3 2" />
            <line x1="680" y1="140" x2="770" y2="140" strokeWidth="0.7" strokeDasharray="3 2" />

            {/* Twin Connected Cyber City Tech Tower 2 */}
            <path d="M785 234 L785 45 L885 45 L885 234 Z" />
            {/* Diagonal Structural Exoskeleton Bracing */}
            <line x1="785" y1="45" x2="885" y2="105" strokeWidth="0.9" opacity="0.7" />
            <line x1="885" y1="45" x2="785" y2="105" strokeWidth="0.9" opacity="0.7" />
            <line x1="785" y1="105" x2="885" y2="165" strokeWidth="0.9" opacity="0.7" />
            <line x1="885" y1="105" x2="785" y2="165" strokeWidth="0.9" opacity="0.7" />
            <line x1="785" y1="165" x2="885" y2="225" strokeWidth="0.9" opacity="0.7" />
            <line x1="885" y1="165" x2="785" y2="225" strokeWidth="0.9" opacity="0.7" />

            {/* Cyber Hub Cantilevered Aerodynamic Canopy */}
            <path d="M895 234 L895 75 L975 90 L975 234 Z" />
            <line x1="915" y1="80" x2="915" y2="234" strokeWidth="0.8" />
            <line x1="945" y1="85" x2="945" y2="234" strokeWidth="0.8" />

            {/* ELEVATED RAPID METRO VIADUCT & TRACK */}
            {/* Continuous Track Girders */}
            <rect x="540" y="180" width="600" height="12" rx="2" />
            <line x1="540" y1="184" x2="1140" y2="184" strokeWidth="0.9" />

            {/* Rapid Metro Viaduct Support Piers & Arches */}
            <path d="M620 234 L620 192 C620 186, 640 186, 640 192 L640 234 Z" />
            <path d="M720 234 L720 192 C720 186, 740 186, 740 192 L740 234 Z" />
            <path d="M820 234 L820 192 C820 186, 840 186, 840 192 L840 234 Z" />
            <path d="M920 234 L920 192 C920 186, 940 186, 940 192 L940 234 Z" />
            <path d="M1020 234 L1020 192 C1020 186, 1040 186, 1040 192 L1040 234 Z" />

            {/* Rapid Metro Train Car on Viaduct */}
            <rect x="745" y="166" width="95" height="14" rx="3" />
            <line x1="755" y1="172" x2="770" y2="172" strokeWidth="1" />
            <line x1="775" y1="172" x2="795" y2="172" strokeWidth="1" />
            <line x1="800" y1="172" x2="820" y2="172" strokeWidth="1" />
            <line x1="825" y1="172" x2="835" y2="172" strokeWidth="1" />
          </g>
        </>
      );
    }

    // 3. NOIDA: Sector skyline & Okhla Bird Sanctuary / expressway span
    if (normalizedId.includes('noida')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Sector High-Rise Towers & Okhla trees */}
            <rect x="500" y="90" width="55" height="144" />
            <rect x="580" y="70" width="65" height="164" />
            <rect x="980" y="80" width="75" height="154" />
            <rect x="1080" y="100" width="55" height="134" />
            {/* Okhla Sanctuary Soft Horizon Contours */}
            <path d="M460 234 Q490 205 520 234 Q550 210 580 234" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* Supernova Spira Iconic Landmark Tower */}
            <path d="M680 234 L710 40 L730 40 L760 234 Z" />
            <line x1="720" y1="40" x2="720" y2="18" strokeWidth="1.2" />
            <line x1="692" y1="90" x2="748" y2="90" strokeWidth="0.8" />
            <line x1="688" y1="135" x2="752" y2="135" strokeWidth="0.8" />
            <line x1="684" y1="180" x2="756" y2="180" strokeWidth="0.8" />

            {/* Buddh International Stupa / Heritage Observatory Dome */}
            <path d="M780 234 L780 180 C780 135, 870 135, 870 180 L870 234 Z" />
            {/* Stupa Harmika Square & Tiered Chhatras */}
            <rect x="812" y="118" width="26" height="14" />
            <path d="M816 118 L825 96 L834 118 Z" />
            <line x1="825" y1="96" x2="825" y2="82" strokeWidth="1.2" />
            <circle cx="825" cy="80" r="3" fill={strokeColor} />

            {/* NOIDA-GREATER NOIDA EXPRESSWAY CABLE-STAYED BRIDGE */}
            {/* Towering A-Frame Pylon */}
            <path d="M910 234 L945 65 L965 65 L1000 234 Z" />
            <line x1="955" y1="65" x2="955" y2="48" strokeWidth="1.2" />
            <line x1="930" y1="140" x2="980" y2="140" strokeWidth="1" />

            {/* Bridge Roadway Deck */}
            <rect x="880" y="195" width="240" height="10" rx="1.5" />

            {/* Radiating High-Tension Stay Cables */}
            <line x1="955" y1="80" x2="890" y2="195" strokeWidth="0.8" opacity="0.75" />
            <line x1="955" y1="95" x2="910" y2="195" strokeWidth="0.8" opacity="0.75" />
            <line x1="955" y1="110" x2="930" y2="195" strokeWidth="0.8" opacity="0.75" />
            <line x1="955" y1="80" x2="1030" y2="195" strokeWidth="0.8" opacity="0.75" />
            <line x1="955" y1="95" x2="1010" y2="195" strokeWidth="0.8" opacity="0.75" />
            <line x1="955" y1="110" x2="990" y2="195" strokeWidth="0.8" opacity="0.75" />
          </g>
        </>
      );
    }

    // 4. BENGALURU: Vidhana Soudha grand dome & classical colonnade
    if (normalizedId.includes('bengaluru') || normalizedId.includes('bangalore')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Bangalore Palace Tudor towers & High Court */}
            <path d="M480 234 L480 160 L500 140 L520 160 L520 234 Z" />
            <path d="M540 234 L540 150 L560 130 L580 150 L580 234 Z" />
            <rect x="990" y="85" width="60" height="149" />
            <rect x="1070" y="105" width="70" height="129" />
            <line x1="1020" y1="85" x2="1020" y2="50" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* VIDHANA SOUDHA - Neo-Dravidian Architectural Facade */}
            {/* Grand Stepped Foundation & Entrance Staircase */}
            <path d="M640 234 L660 216 L980 216 L1000 234 Z" />
            <path d="M720 216 L740 196 L900 196 L920 216 Z" />

            {/* Classical West Wing Colonnade */}
            <rect x="660" y="135" width="80" height="61" />
            <line x1="675" y1="135" x2="675" y2="196" strokeWidth="0.9" />
            <line x1="695" y1="135" x2="695" y2="196" strokeWidth="0.9" />
            <line x1="715" y1="135" x2="715" y2="196" strokeWidth="0.9" />
            {/* West Wing Chhatri Pavilion */}
            <path d="M685 135 L685 118 C685 106, 715 106, 715 118 L715 135 Z" />

            {/* Classical East Wing Colonnade */}
            <rect x="900" y="135" width="80" height="61" />
            <line x1="925" y1="135" x2="925" y2="196" strokeWidth="0.9" />
            <line x1="945" y1="135" x2="945" y2="196" strokeWidth="0.9" />
            <line x1="965" y1="135" x2="965" y2="196" strokeWidth="0.9" />
            {/* East Wing Chhatri Pavilion */}
            <path d="M925 135 L925 118 C925 106, 955 106, 955 118 L955 135 Z" />

            {/* Central Grand Portico Pillars */}
            <rect x="740" y="110" width="160" height="86" />
            <line x1="760" y1="110" x2="760" y2="196" strokeWidth="1.2" />
            <line x1="785" y1="110" x2="785" y2="196" strokeWidth="1.2" />
            <line x1="810" y1="110" x2="810" y2="196" strokeWidth="1.2" />
            <line x1="830" y1="110" x2="830" y2="196" strokeWidth="1.2" />
            <line x1="855" y1="110" x2="855" y2="196" strokeWidth="1.2" />
            <line x1="880" y1="110" x2="880" y2="196" strokeWidth="1.2" />

            {/* Central Triangular Pediment */}
            <path d="M740 110 L820 86 L900 110 Z" />

            {/* Grand Neo-Dravidian Central Dome */}
            <path d="M780 86 L780 65 C780 38, 860 38, 860 65 L860 86 Z" />
            <ellipse cx="820" cy="55" rx="36" ry="12" fill="none" strokeWidth="0.8" />

            {/* Ashoka Lion Stambh Finial */}
            <rect x="815" y="32" width="10" height="12" />
            <line x1="820" y1="32" x2="820" y2="18" strokeWidth="1.3" />
            <circle cx="820" cy="16" r="3" fill={strokeColor} />
          </g>
        </>
      );
    }

    // 5. MUMBAI: Gateway of India arch & Marine Drive promenade curve
    if (normalizedId.includes('mumbai') || normalizedId.includes('bombay')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Bandra-Worli Sea Link Cable Towers */}
            <path d="M460 234 L490 110 L505 110 L535 234 Z" />
            <line x1="497" y1="120" x2="430" y2="234" />
            <line x1="497" y1="140" x2="450" y2="234" />
            <line x1="497" y1="120" x2="570" y2="234" />
            <line x1="497" y1="140" x2="550" y2="234" />
            {/* Nariman Point & Marine Drive Art Deco Towers */}
            <rect x="990" y="65" width="55" height="169" />
            <rect x="1065" y="85" width="65" height="149" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* GATEWAY OF INDIA - Indo-Saracenic Basalt Triumphal Gateway */}
            {/* Base Plinth on the Apollo Bunder Seafront */}
            <path d="M680 234 L692 220 L908 220 L920 234 Z" />

            {/* Left Tower & Corner Spire */}
            <rect x="700" y="80" width="45" height="140" />
            <path d="M705 80 L705 60 C705 52, 740 52, 740 60 L740 80 Z" />
            <line x1="722" y1="52" x2="722" y2="40" strokeWidth="1.2" />
            {/* Left pierced latticework detail */}
            <rect x="712" y="105" width="20" height="35" rx="2" strokeWidth="0.9" />

            {/* Right Tower & Corner Spire */}
            <rect x="855" y="80" width="45" height="140" />
            <path d="M860 80 L860 60 C860 52, 895 52, 895 60 L895 80 Z" />
            <line x1="877" y1="52" x2="877" y2="40" strokeWidth="1.2" />
            {/* Right pierced latticework detail */}
            <rect x="868" y="105" width="20" height="35" rx="2" strokeWidth="0.9" />

            {/* Grand Pointed Central Gateway Arch */}
            <rect x="745" y="70" width="110" height="150" />
            <path d="M760 220 L760 145 C760 100, 840 100, 840 145 L840 220 Z" />
            {/* Inner Decorative Arch Contour */}
            <path d="M772 220 L772 152 C772 115, 828 115, 828 152 L828 220" fill="none" strokeWidth="0.8" />

            {/* Central Upper Dome & Intricate Cornice */}
            <rect x="735" y="60" width="130" height="10" />
            <path d="M775 60 L775 48 C775 36, 825 36, 825 48 L825 60 Z" />
            <line x1="800" y1="36" x2="800" y2="24" strokeWidth="1.2" />

            {/* Taj Mahal Palace Wing Silhouette */}
            <path d="M925 220 L925 125 L985 125 L985 220 Z" />
            <path d="M940 125 L940 105 C940 92, 970 92, 970 105 L970 125 Z" />

            {/* MARINE DRIVE PROMENADE CURVE (Queen's Necklace seawall arc) */}
            <path d="M540 234 C620 216, 780 216, 960 224 C1040 228, 1100 234, 1140 234" fill="none" strokeWidth="1.5" />
            {/* Art Deco Promenade Lamp Posts */}
            <line x1="580" y1="228" x2="580" y2="216" strokeWidth="1" />
            <circle cx="580" cy="215" r="2" fill={strokeColor} />
            <line x1="640" y1="222" x2="640" y2="210" strokeWidth="1" />
            <circle cx="640" cy="209" r="2" fill={strokeColor} />
            <line x1="970" y1="225" x2="970" y2="213" strokeWidth="1" />
            <circle cx="970" cy="212" r="2" fill={strokeColor} />
            <line x1="1040" y1="229" x2="1040" y2="217" strokeWidth="1" />
            <circle cx="1040" cy="216" r="2" fill={strokeColor} />
          </g>
        </>
      );
    }

    // 6. KOLKATA: Victoria Memorial central dome & Howrah Bridge cantilever truss
    if (normalizedId.includes('kolkata') || normalizedId.includes('calcutta')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Vidyasagar Setu Cable-Stayed Towers */}
            <path d="M480 234 L500 120 L515 120 L535 234 Z" />
            <line x1="507" y1="130" x2="450" y2="234" />
            <line x1="507" y1="130" x2="565" y2="234" />
            {/* Distant St. Paul's Cathedral Gothic Spire */}
            <path d="M580 234 L595 100 L610 234 Z" />
            <line x1="595" y1="100" x2="595" y2="75" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* VICTORIA MEMORIAL - White Marble Classical Monument */}
            {/* Stepped Podium Base */}
            <rect x="620" y="218" width="220" height="16" />

            {/* Left Classical Portico & Corner Chhatri Tower */}
            <rect x="640" y="150" width="55" height="68" />
            <path d="M648 150 L648 132 C648 122, 687 122, 687 132 L687 150 Z" />

            {/* Right Classical Portico & Corner Chhatri Tower */}
            <rect x="765" y="150" width="55" height="68" />
            <path d="M773 150 L773 132 C773 122, 812 122, 812 132 L812 150 Z" />

            {/* Central Colonnade Entrance & Pediment */}
            <rect x="695" y="130" width="70" height="88" />
            <line x1="710" y1="130" x2="710" y2="218" strokeWidth="1" />
            <line x1="730" y1="130" x2="730" y2="218" strokeWidth="1" />
            <line x1="750" y1="130" x2="750" y2="218" strokeWidth="1" />

            {/* Grand Italianate-Mughal High Central Dome */}
            <path d="M698 130 L698 90 C698 48, 762 48, 762 90 L762 130 Z" />
            <ellipse cx="730" cy="78" rx="28" ry="10" fill="none" strokeWidth="0.8" />

            {/* Angel of Victory Rotating Bronze Finial */}
            <line x1="730" y1="48" x2="730" y2="30" strokeWidth="1.3" />
            <path d="M725 30 Q730 25 735 30 Q730 20 725 30" fill={strokeColor} />

            {/* HOWRAH BRIDGE - Iconic Riveted Steel Cantilever Truss */}
            {/* Main Cantilever Tower Pylon */}
            <path d="M860 234 L895 55 L915 55 L950 234 Z" />
            <path d="M960 234 L995 55 L1015 55 L1050 234 Z" />

            {/* Upper Top Chord Truss Girder */}
            <line x1="895" y1="55" x2="1015" y2="55" strokeWidth="1.5" />

            {/* Cantilever Diamond Cross-Bracing Truss System */}
            <line x1="895" y1="55" x2="955" y2="125" strokeWidth="1" />
            <line x1="1015" y1="55" x2="955" y2="125" strokeWidth="1" />
            <line x1="895" y1="125" x2="955" y2="55" strokeWidth="1" />
            <line x1="1015" y1="125" x2="955" y2="55" strokeWidth="1" />
            <line x1="885" y1="125" x2="1025" y2="125" strokeWidth="1" />
            <line x1="880" y1="195" x2="955" y2="125" strokeWidth="1" />
            <line x1="1030" y1="195" x2="955" y2="125" strokeWidth="1" />

            {/* Suspended Hooghly Roadway Deck */}
            <rect x="840" y="195" width="230" height="12" rx="2" />
            <line x1="840" y1="200" x2="1070" y2="200" strokeWidth="0.8" />
          </g>
        </>
      );
    }

    // 7. CHENNAI: Chennai Central / Ripon Building clock tower & coastal horizon
    if (normalizedId.includes('chennai') || normalizedId.includes('madras')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Kapaleeshwarar Temple Dravidian Gopuram */}
            <path d="M480 234 L505 110 L525 110 L550 234 Z" />
            <line x1="495" y1="150" x2="535" y2="150" />
            <line x1="500" y1="185" x2="530" y2="185" />
            {/* Napier Bridge Arches on the Cooum */}
            <path d="M570 234 Q595 210 620 234 Q645 210 670 234" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* RIPON BUILDING & CHENNAI CENTRAL MONUMENTAL CLOCK TOWER */}
            {/* Base Foundation & Arcade Plinth */}
            <rect x="640" y="218" width="280" height="16" />

            {/* Left Classical Roman-Corinthian Palace Wing */}
            <rect x="650" y="130" width="95" height="88" />
            <line x1="665" y1="130" x2="665" y2="218" strokeWidth="0.9" />
            <line x1="685" y1="130" x2="685" y2="218" strokeWidth="0.9" />
            <line x1="705" y1="130" x2="705" y2="218" strokeWidth="0.9" />
            <line x1="725" y1="130" x2="725" y2="218" strokeWidth="0.9" />
            {/* Upper Balustrade Pediments */}
            <path d="M660 130 L675 115 L690 130 Z" />
            <path d="M700 130 L715 115 L730 130 Z" />

            {/* Right Classical Roman-Corinthian Palace Wing */}
            <rect x="815" y="130" width="95" height="88" />
            <line x1="835" y1="130" x2="835" y2="218" strokeWidth="0.9" />
            <line x1="855" y1="130" x2="855" y2="218" strokeWidth="0.9" />
            <line x1="875" y1="130" x2="875" y2="218" strokeWidth="0.9" />
            <line x1="895" y1="130" x2="895" y2="218" strokeWidth="0.9" />
            {/* Upper Balustrade Pediments */}
            <path d="M830 130 L845 115 L860 130 Z" />
            <path d="M870 130 L885 115 L900 130 Z" />

            {/* Towering 43-Meter Central Clock Tower */}
            <rect x="745" y="80" width="70" height="138" />
            {/* Grand Arched Entrance Porch */}
            <path d="M760 218 L760 175 C760 155, 800 155, 800 175 L800 218 Z" />

            {/* Circular Clock Face Section */}
            <rect x="740" y="60" width="80" height="35" rx="2" />
            <circle cx="780" cy="77" r="12" strokeWidth="1.2" fill={isDark ? '#1A221F' : '#FFFFFF'} />
            <line x1="780" y1="77" x2="780" y2="70" strokeWidth="1.3" />
            <line x1="780" y1="77" x2="785" y2="77" strokeWidth="1.3" />

            {/* Classical Tiered Pyramidal Spire Roof */}
            <path d="M745 60 L780 26 L815 60 Z" />
            <line x1="780" y1="26" x2="780" y2="14" strokeWidth="1.3" />
            <circle cx="780" cy="12" r="2.5" fill={strokeColor} />

            {/* MARINA COASTAL HORIZON & LIGHTHOUSE */}
            <line x1="940" y1="230" x2="1140" y2="230" strokeWidth="1" strokeDasharray="6 3" />
            {/* Madras Lighthouse Triangular Beacon Tower */}
            <path d="M980 234 L1000 95 L1015 95 L1035 234 Z" />
            <rect x="995" y="82" width="25" height="13" rx="2" />
            <line x1="1007" y1="82" x2="1007" y2="72" strokeWidth="1.2" />
            {/* Lighthouse Sweeping Beam Lines */}
            <line x1="1007" y1="72" x2="1120" y2="40" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            <line x1="1007" y1="72" x2="1140" y2="60" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          </g>
        </>
      );
    }

    // 8. HYDERABAD: Charminar's four minarets & grand central arch
    if (normalizedId.includes('hyderabad')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Golconda Fort hilltop ramparts & battlement walls */}
            <path d="M480 234 L520 170 L550 170 L570 190 L610 190 L630 234 Z" />
            {/* HITEC City Cyber Towers Spiral */}
            <rect x="990" y="80" width="60" height="154" />
            <line x1="1020" y1="80" x2="1020" y2="50" />
            <ellipse cx="1020" cy="110" rx="24" ry="8" fill="none" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* CHARMINAR - Qutb Shahi Masterpiece with 4 Minarets */}
            {/* Base Plinth */}
            <rect x="670" y="222" width="260" height="12" />

            {/* Minaret 1 (Far Left Fluted Minaret, 56m) */}
            <rect x="680" y="55" width="22" height="167" />
            {/* Lower & Upper Cantilevered Balconies */}
            <line x1="675" y1="125" x2="707" y2="125" strokeWidth="1.2" />
            <line x1="675" y1="75" x2="707" y2="75" strokeWidth="1.2" />
            <path d="M680 55 C680 40, 702 40, 702 55 Z" />
            <line x1="691" y1="40" x2="691" y2="28" strokeWidth="1.2" />

            {/* Minaret 2 (Inner Left Minaret) */}
            <rect x="714" y="65" width="20" height="157" />
            <line x1="710" y1="130" x2="738" y2="130" strokeWidth="1.2" />
            <line x1="710" y1="85" x2="738" y2="85" strokeWidth="1.2" />
            <path d="M714 65 C714 52, 734 52, 734 65 Z" />
            <line x1="724" y1="52" x2="724" y2="40" strokeWidth="1.2" />

            {/* Central Monument Body & Upper Mosque Gallery */}
            <rect x="734" y="90" width="132" height="132" />
            {/* Upper Double-Deck Arched Gallery Openings */}
            <rect x="738" y="95" width="124" height="20" strokeWidth="0.8" />
            <line x1="755" y1="95" x2="755" y2="115" strokeWidth="0.7" />
            <line x1="775" y1="95" x2="775" y2="115" strokeWidth="0.7" />
            <line x1="800" y1="95" x2="800" y2="115" strokeWidth="0.7" />
            <line x1="825" y1="95" x2="825" y2="115" strokeWidth="0.7" />
            <line x1="845" y1="95" x2="845" y2="115" strokeWidth="0.7" />

            {/* Grand Central Pointed Arch Opening */}
            <path d="M752 222 L752 160 C752 118, 848 118, 848 160 L848 222 Z" />
            <path d="M764 222 L764 165 C764 128, 836 128, 836 165 L836 222" fill="none" strokeWidth="0.8" />

            {/* Minaret 3 (Inner Right Minaret) */}
            <rect x="866" y="65" width="20" height="157" />
            <line x1="862" y1="130" x2="890" y2="130" strokeWidth="1.2" />
            <line x1="862" y1="85" x2="890" y2="85" strokeWidth="1.2" />
            <path d="M866 65 C866 52, 886 52, 886 65 Z" />
            <line x1="876" y1="52" x2="876" y2="40" strokeWidth="1.2" />

            {/* Minaret 4 (Far Right Fluted Minaret, 56m) */}
            <rect x="898" y="55" width="22" height="167" />
            {/* Lower & Upper Cantilevered Balconies */}
            <line x1="893" y1="125" x2="925" y2="125" strokeWidth="1.2" />
            <line x1="893" y1="75" x2="925" y2="75" strokeWidth="1.2" />
            <path d="M898 55 C898 40, 920 40, 920 55 Z" />
            <line x1="909" y1="40" x2="909" y2="28" strokeWidth="1.2" />
          </g>
        </>
      );
    }

    // 9. PUNE: Shaniwar Wada fortified bastions & Nagarkhana gate
    if (normalizedId.includes('pune')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Sinhagad Fort Hilltop Ridge Contour */}
            <path d="M460 234 Q540 160 620 200 Q700 170 760 234" />
            {/* Modern Pune IT Skyline Blocks */}
            <rect x="990" y="90" width="65" height="144" />
            <rect x="1075" y="110" width="55" height="124" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* SHANIWAR WADA - Fortified Peshwa Stone Citadel */}
            {/* Stately Rampart Foundation */}
            <rect x="640" y="218" width="300" height="16" />

            {/* Massive Left Semi-Circular Fortified Bastion */}
            <path d="M660 218 L660 135 C660 115, 735 115, 735 135 L735 218 Z" />
            {/* Gun loops & arrow slits */}
            <line x1="680" y1="145" x2="680" y2="160" strokeWidth="1.2" />
            <line x1="710" y1="145" x2="710" y2="160" strokeWidth="1.2" />
            <line x1="695" y1="175" x2="695" y2="190" strokeWidth="1.2" />
            {/* Bastion Stone Machicolations */}
            <line x1="660" y1="135" x2="735" y2="135" strokeWidth="1.5" />

            {/* Massive Right Semi-Circular Fortified Bastion */}
            <path d="M845 218 L845 135 C845 115, 920 115, 920 135 L920 218 Z" />
            {/* Gun loops & arrow slits */}
            <line x1="870" y1="145" x2="870" y2="160" strokeWidth="1.2" />
            <line x1="900" y1="145" x2="900" y2="160" strokeWidth="1.2" />
            <line x1="885" y1="175" x2="885" y2="190" strokeWidth="1.2" />
            {/* Bastion Stone Machicolations */}
            <line x1="845" y1="135" x2="920" y2="135" strokeWidth="1.5" />

            {/* Historic Delhi Darwaza Central Gateway Entrance */}
            <rect x="735" y="125" width="110" height="93" />
            <path d="M755 218 L755 160 C755 135, 825 135, 825 160 L825 218 Z" />
            {/* Gate wooden planks and defense spike rivets */}
            <line x1="790" y1="145" x2="790" y2="218" strokeWidth="1" />
            <circle cx="770" cy="175" r="1.5" fill={strokeColor} />
            <circle cx="810" cy="175" r="1.5" fill={strokeColor} />
            <circle cx="770" cy="195" r="1.5" fill={strokeColor} />
            <circle cx="810" cy="195" r="1.5" fill={strokeColor} />

            {/* Multi-Tiered Timber Nagarkhana (Music Gallery) Above Gate */}
            <rect x="725" y="85" width="130" height="40" />
            {/* Sloping Chhajja Overhang Roof */}
            <path d="M710 85 L790 58 L870 85 Z" />
            {/* Nagarkhana Ornate Wooden Windows */}
            <rect x="740" y="95" width="20" height="22" rx="2" strokeWidth="0.8" />
            <rect x="780" y="95" width="20" height="22" rx="2" strokeWidth="0.8" />
            <rect x="820" y="95" width="20" height="22" rx="2" strokeWidth="0.8" />

            {/* Saffron Maratha Pennant Flag */}
            <line x1="790" y1="58" x2="790" y2="35" strokeWidth="1.3" />
            <path d="M790 35 L815 42 L790 49 Z" fill={strokeColor} />
          </g>
        </>
      );
    }

    // 10. AHMEDABAD: Sidi Saiyyed lattice arch & Sabarmati riverfront
    if (normalizedId.includes('ahmedabad')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Sarkhej Roza Stone Pavilions & Domes */}
            <path d="M480 234 L480 170 C480 150, 520 150, 520 170 L520 234 Z" />
            <path d="M530 234 L530 160 C530 140, 580 140, 580 160 L580 234 Z" />
            {/* Modern Sabarmati Skyline */}
            <rect x="990" y="85" width="60" height="149" />
            <rect x="1070" y="105" width="65" height="129" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* SIDI SAIYYED MOSQUE - Famous "Tree of Life" Intricate Jali Screen */}
            {/* Sandstone Foundation Wall */}
            <rect x="650" y="218" width="240" height="16" />

            {/* Left Mihrab Carved Pilaster Column */}
            <rect x="660" y="70" width="28" height="148" />
            <line x1="674" y1="70" x2="674" y2="218" strokeWidth="0.8" />
            <path d="M660 70 L674 52 L688 70 Z" />

            {/* Right Mihrab Carved Pilaster Column */}
            <rect x="852" y="70" width="28" height="148" />
            <line x1="866" y1="70" x2="866" y2="218" strokeWidth="0.8" />
            <path d="M852 70 L866 52 L880 70 Z" />

            {/* Grand Pointed Semi-Circular Jali Archway */}
            <path d="M688 218 L688 135 C688 65, 852 65, 852 135 L852 218 Z" />

            {/* INTRICATE TREE OF LIFE JALI BRANCHES (Botanical Stone Lattice) */}
            {/* Central Trunk */}
            <path d="M770 218 C770 170, 765 145, 770 120" strokeWidth="1.5" fill="none" />
            {/* Radiating Sinuous Foliage Branches */}
            <path d="M770 145 C750 125, 715 130, 705 110" strokeWidth="1.1" fill="none" />
            <path d="M770 145 C790 125, 825 130, 835 110" strokeWidth="1.1" fill="none" />
            <path d="M770 120 C745 100, 725 90, 715 75" strokeWidth="1.1" fill="none" />
            <path d="M770 120 C795 100, 815 90, 825 75" strokeWidth="1.1" fill="none" />
            <path d="M770 100 Q770 75 770 65" strokeWidth="1.1" fill="none" />
            {/* Delicate Botanical Leaf Medallions */}
            <circle cx="705" cy="110" r="4.5" fill={strokeColor} />
            <circle cx="835" cy="110" r="4.5" fill={strokeColor} />
            <circle cx="715" cy="75" r="4" fill={strokeColor} />
            <circle cx="825" cy="75" r="4" fill={strokeColor} />
            <circle cx="770" cy="65" r="4" fill={strokeColor} />

            {/* SABARMATI RIVERFRONT PROMENADE & WATER STEPS */}
            <line x1="540" y1="228" x2="1140" y2="228" strokeWidth="1.2" />
            <line x1="560" y1="234" x2="1140" y2="234" strokeWidth="0.8" />

            {/* Modern Atal Pedestrian Bridge Tubular Truss Arch */}
            <path d="M920 228 C960 170, 1060 170, 1100 228" fill="none" strokeWidth="1.5" />
            <path d="M935 228 C965 185, 1055 185, 1085 228" fill="none" strokeWidth="0.9" />
            {/* Diagonal cable stays */}
            <line x1="965" y1="185" x2="980" y2="228" strokeWidth="0.7" />
            <line x1="1010" y1="175" x2="1010" y2="228" strokeWidth="0.7" />
            <line x1="1055" y1="185" x2="1040" y2="228" strokeWidth="0.7" />
          </g>
        </>
      );
    }

    // 11. LUCKNOW: Rumi Darwaza ornate gateway arch
    if (normalizedId.includes('lucknow')) {
      return (
        <>
          {/* Layer 1: Background Horizon Layer */}
          <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
            {/* Distant Asfi Mosque Twin Minarets and Bara Imambara Domes */}
            <path d="M480 234 L490 120 L505 120 L515 234 Z" />
            <path d="M525 234 L525 170 C525 150, 565 150, 565 170 L565 234 Z" />
            <path d="M575 234 L585 120 L600 120 L610 234 Z" />
            {/* Husainabad Victorian Clock Tower */}
            <rect x="990" y="60" width="40" height="174" />
            <path d="M990 60 L1010 32 L1030 60 Z" />
          </g>

          {/* Layer 2: Foreground Landmark Layer */}
          <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
            {/* RUMI DARWAZA - 60-Foot Awadhi Nawabi Turkish Gate */}
            {/* Base Plinth */}
            <rect x="660" y="218" width="280" height="16" />

            {/* Left Nawabi Flanking Wing with Arched Niches */}
            <rect x="670" y="115" width="60" height="103" />
            <path d="M685 218 L685 155 C685 140, 715 140, 715 155 L715 218 Z" strokeWidth="0.9" />
            {/* Upper Flanking Chhatri Minarets */}
            <path d="M680 115 L680 95 C680 88, 710 88, 710 95 L710 115 Z" />
            <line x1="695" y1="88" x2="695" y2="76" strokeWidth="1.2" />

            {/* Right Nawabi Flanking Wing with Arched Niches */}
            <rect x="870" y="115" width="60" height="103" />
            <path d="M885 218 L885 155 C885 140, 915 140, 915 155 L915 218 Z" strokeWidth="0.9" />
            {/* Upper Flanking Chhatri Minarets */}
            <path d="M880 115 L880 95 C880 88, 910 88, 910 95 L910 115 Z" />
            <line x1="895" y1="88" x2="895" y2="76" strokeWidth="1.2" />

            {/* Monumental Semi-Circular Central Archway */}
            <rect x="730" y="90" width="140" height="128" />
            <path d="M748 218 L748 140 C748 70, 852 70, 852 140 L852 218 Z" />

            {/* Scalloped / Petal Floral Fringe Contour along Arch */}
            <path d="M758 218 L758 148 C758 90, 842 90, 842 148 L842 218" fill="none" strokeWidth="0.9" />
            <circle cx="800" cy="98" r="4.5" fill={strokeColor} />

            {/* Crowning Octagonal Chhatri Pavilion at Apex */}
            <rect x="780" y="60" width="40" height="30" />
            <path d="M775 60 L800 36 L825 60 Z" />
            <line x1="800" y1="36" x2="800" y2="22" strokeWidth="1.3" />
            <circle cx="800" cy="20" r="2.5" fill={strokeColor} />

            {/* Gomti River Promenade at Base with Water Ripples */}
            <line x1="620" y1="230" x2="980" y2="230" strokeWidth="0.9" strokeDasharray="5 3" />
          </g>
        </>
      );
    }

    // 12. FALLBACK: Universal Pan-Indian Metro Horizon
    return (
      <>
        {/* Layer 1: Background Horizon Layer */}
        <g stroke={strokeColor} strokeWidth="0.8" fill={strokeColor} opacity="0.12" className="transition-all duration-300">
          <rect x="480" y="90" width="60" height="144" />
          <rect x="560" y="70" width="70" height="164" />
          <rect x="990" y="80" width="65" height="154" />
          <rect x="1075" y="100" width="60" height="134" />
          <line x1="595" y1="70" x2="595" y2="40" />
        </g>

        {/* Layer 2: Foreground Landmark Layer */}
        <g stroke={strokeColor} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradLandmarkId})`} opacity={isDark ? '0.44' : '0.38'} className="transition-all duration-300">
          {/* Universal Monument Gateway & Transit Horizon */}
          <path d="M680 234 L680 130 C680 85, 780 85, 780 130 L780 234 Z" />
          <rect x="670" y="222" width="120" height="12" />
          {/* Observatory Dome */}
          <path d="M800 234 L800 160 C800 120, 880 120, 880 160 L880 234 Z" />
          {/* Modern Transit Viaduct */}
          <rect x="880" y="180" width="220" height="10" rx="2" />
          <line x1="940" y1="190" x2="940" y2="234" strokeWidth="1.5" />
          <line x1="1020" y1="190" x2="1020" y2="234" strokeWidth="1.5" />
        </g>
      </>
    );
  };

  return (
    <svg
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYMax slice"
      className={`${className} transition-all duration-300 pointer-events-none select-none`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${cityId} architectural skyline silhouette`}
    >
      {defs}
      {atmosphericClouds}
      {renderCityVectors()}
      {groundPlane}
    </svg>
  );
};
