import React from 'react';

interface CityLandmarkIllustrationProps {
  cityId: string;
  className?: string;
  strokeColor?: string;
}

export const CityLandmarkIllustration: React.FC<CityLandmarkIllustrationProps> = ({
  cityId,
  className = 'w-full h-full',
  strokeColor,
}) => {
  const normalizedId = (cityId || '').toLowerCase();

  // Common SVG properties for authentic architectural line drawing
  const svgProps = {
    viewBox: '0 0 160 120',
    fill: 'none',
    stroke: strokeColor || 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `${className} transition-all duration-700 select-none pointer-events-none`,
  };

  // 1. Delhi NCR: India Gate (Memorial Triumphal Archway)
  if (normalizedId.includes('delhi')) {
    return (
      <svg {...svgProps} aria-label="India Gate architectural line art">
        {/* Sky atmospheric accents (subtle flight of birds as in reference) */}
        <path d="M16 24 Q20 20 24 24 Q28 20 32 24" strokeWidth="1" opacity="0.6" />
        <path d="M130 18 Q133 15 136 18 Q139 15 142 18" strokeWidth="0.8" opacity="0.5" />
        
        {/* Ground & stepped base plinth */}
        <line x1="8" y1="114" x2="152" y2="114" strokeWidth="1.2" opacity="0.5" />
        <line x1="22" y1="111" x2="138" y2="111" strokeWidth="1.2" />
        <line x1="26" y1="108" x2="134" y2="108" strokeWidth="1.2" />
        <line x1="30" y1="105" x2="130" y2="105" strokeWidth="1.2" />

        {/* Pylons (left & right wings) */}
        <rect x="34" y="38" width="28" height="67" strokeWidth="1.5" />
        <rect x="98" y="38" width="28" height="67" strokeWidth="1.5" />

        {/* Pylon vertical architectural groove relief lines */}
        <line x1="42" y1="42" x2="42" y2="105" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="42" x2="50" y2="105" strokeWidth="1" opacity="0.6" />
        <line x1="110" y1="42" x2="110" y2="105" strokeWidth="1" opacity="0.6" />
        <line x1="118" y1="42" x2="118" y2="105" strokeWidth="1" opacity="0.6" />

        {/* Grand Central Triumphal Arch */}
        <path d="M62 105 L62 64 C62 43 98 43 98 64 L98 105" strokeWidth="1.5" />
        {/* Inner concentric arch molding */}
        <path d="M66 105 L66 65 C66 47 94 47 94 65 L94 105" strokeWidth="1" opacity="0.7" />

        {/* Lower & upper cornice lintels */}
        <line x1="28" y1="38" x2="132" y2="38" strokeWidth="1.5" />
        <line x1="24" y1="34" x2="136" y2="34" strokeWidth="1.5" />

        {/* Inscription attic terrace */}
        <rect x="34" y="20" width="92" height="14" strokeWidth="1.5" />
        <rect x="42" y="23" width="76" height="8" strokeWidth="0.9" opacity="0.6" strokeDasharray="2 2" />

        {/* Upper stepped pedestal */}
        <line x1="38" y1="16" x2="122" y2="16" strokeWidth="1.2" />
        <line x1="46" y1="12" x2="114" y2="12" strokeWidth="1.2" />
        <rect x="48" y="12" width="64" height="4" strokeWidth="1" />

        {/* Ceremonial top shallow bowl / urn */}
        <path d="M68 12 C68 7 92 7 92 12 Z" strokeWidth="1.2" />
      </svg>
    );
  }

  // 2. Bengaluru: Vidhana Soudha (Neo-Dravidian Legislative Palace)
  if (normalizedId.includes('bengaluru') || normalizedId.includes('bangalore')) {
    return (
      <svg {...svgProps} aria-label="Vidhana Soudha architectural line art">
        {/* Ambient birds */}
        <path d="M18 20 Q21 17 24 20 Q27 17 30 20" strokeWidth="0.9" opacity="0.5" />
        <path d="M132 26 Q135 23 138 26 Q141 23 144 26" strokeWidth="0.8" opacity="0.5" />

        {/* Ground baseline & grand flight of entrance stairs */}
        <line x1="6" y1="115" x2="154" y2="115" strokeWidth="1" opacity="0.5" />
        <line x1="16" y1="112" x2="144" y2="112" strokeWidth="1.2" />
        <line x1="22" y1="109" x2="138" y2="109" strokeWidth="1.2" />
        <line x1="28" y1="106" x2="132" y2="106" strokeWidth="1.2" />
        <line x1="34" y1="103" x2="126" y2="103" strokeWidth="1.2" />

        {/* Main facade block */}
        <rect x="28" y="65" width="104" height="38" strokeWidth="1.5" />

        {/* Grand colonnade portico (columns in center) */}
        <line x1="56" y1="103" x2="56" y2="70" strokeWidth="1.2" />
        <line x1="64" y1="103" x2="64" y2="70" strokeWidth="1.2" />
        <line x1="72" y1="103" x2="72" y2="70" strokeWidth="1.2" />
        <line x1="80" y1="103" x2="80" y2="70" strokeWidth="1.2" />
        <line x1="88" y1="103" x2="88" y2="70" strokeWidth="1.2" />
        <line x1="96" y1="103" x2="96" y2="70" strokeWidth="1.2" />
        <line x1="104" y1="103" x2="104" y2="70" strokeWidth="1.2" />

        {/* Portico pediment */}
        <polygon points="50,70 80,56 110,70" strokeWidth="1.3" />

        {/* Central Neo-Dravidian dome drum */}
        <rect x="66" y="44" width="28" height="12" strokeWidth="1.3" />
        <line x1="66" y1="50" x2="94" y2="50" strokeWidth="0.8" opacity="0.6" />
        {/* Dome */}
        <path d="M66 44 C66 22 94 22 94 44 Z" strokeWidth="1.5" />
        {/* Ashok Stambha / Lion Capital finial */}
        <line x1="80" y1="22" x2="80" y2="10" strokeWidth="1.3" />
        <rect x="76" y="10" width="8" height="4" strokeWidth="1" />
        <line x1="80" y1="10" x2="80" y2="6" strokeWidth="1" />

        {/* Left wing dome */}
        <rect x="34" y="55" width="16" height="10" strokeWidth="1.1" />
        <path d="M34 55 C34 43 50 43 50 55 Z" strokeWidth="1.2" />
        <line x1="42" y1="43" x2="42" y2="37" strokeWidth="1" />

        {/* Right wing dome */}
        <rect x="110" y="55" width="16" height="10" strokeWidth="1.1" />
        <path d="M110 55 C110 43 126 43 126 55 Z" strokeWidth="1.2" />
        <line x1="118" y1="43" x2="118" y2="37" strokeWidth="1" />

        {/* Balustrade railings */}
        <line x1="30" y1="65" x2="130" y2="65" strokeWidth="1.2" />
        <line x1="30" y1="62" x2="130" y2="62" strokeWidth="0.8" opacity="0.6" />
      </svg>
    );
  }

  // 3. Mumbai: Gateway of India (Waterfront Indo-Saracenic Basalt Arch)
  if (normalizedId.includes('mumbai') || normalizedId.includes('bombay')) {
    return (
      <svg {...svgProps} aria-label="Gateway of India architectural line art">
        {/* Maritime birds */}
        <path d="M14 20 Q18 16 22 20 Q26 16 30 20" strokeWidth="1" opacity="0.6" />
        <path d="M136 22 Q139 19 142 22 Q145 19 148 22" strokeWidth="0.8" opacity="0.5" />

        {/* Waterfront sea plinth & sea wall balustrade */}
        <line x1="6" y1="115" x2="154" y2="115" strokeWidth="1" opacity="0.5" />
        <line x1="16" y1="112" x2="144" y2="112" strokeWidth="1.2" />
        <line x1="22" y1="108" x2="138" y2="108" strokeWidth="1.2" />

        {/* Left outer turret */}
        <rect x="25" y="44" width="12" height="64" strokeWidth="1.4" />
        <path d="M22 44 L40 44 L40 36 C40 30 22 30 22 36 Z" strokeWidth="1.2" />
        <line x1="31" y1="30" x2="31" y2="24" strokeWidth="1" />

        {/* Right outer turret */}
        <rect x="123" y="44" width="12" height="64" strokeWidth="1.4" />
        <path d="M120 44 L138 44 L138 36 C138 30 120 30 120 36 Z" strokeWidth="1.2" />
        <line x1="129" y1="30" x2="129" y2="24" strokeWidth="1" />

        {/* Left side arch */}
        <rect x="37" y="44" width="22" height="64" strokeWidth="1.3" />
        <path d="M41 108 L41 72 C41 62 55 62 55 72 L55 108" strokeWidth="1.2" />

        {/* Right side arch */}
        <rect x="101" y="44" width="22" height="64" strokeWidth="1.3" />
        <path d="M105 108 L105 72 C105 62 119 62 119 72 L119 108" strokeWidth="1.2" />

        {/* Central grand archway */}
        <rect x="59" y="38" width="42" height="70" strokeWidth="1.5" />
        <path d="M65 108 L65 58 C65 34 95 34 95 58 L95 108" strokeWidth="1.5" />
        {/* Inner pierced jali transom screen */}
        <path d="M68 62 C68 40 92 40 92 62 Z" strokeWidth="0.9" opacity="0.6" strokeDasharray="3 2" />

        {/* Upper ornamental cornice & Islamic stepped crenellations */}
        <line x1="22" y1="44" x2="138" y2="44" strokeWidth="1.3" />
        <line x1="28" y1="40" x2="132" y2="40" strokeWidth="1.1" />
        <line x1="36" y1="36" x2="124" y2="36" strokeWidth="1.2" />

        {/* Central main dome (rising behind parapet) */}
        <path d="M68 36 C68 18 92 18 92 36" strokeWidth="1.4" />
        <line x1="80" y1="18" x2="80" y2="12" strokeWidth="1.2" />

        {/* Sea waves along base */}
        <path d="M35 117 C45 116 50 118 60 117 C70 116 75 118 85 117 C95 116 100 118 110 117" strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }

  // 4. Kolkata: Victoria Memorial (Grand Marble Dome & Neoclassical Portico)
  if (normalizedId.includes('kolkata') || normalizedId.includes('calcutta')) {
    return (
      <svg {...svgProps} aria-label="Victoria Memorial architectural line art">
        {/* Flying birds */}
        <path d="M22 22 Q25 19 28 22 Q31 19 34 22" strokeWidth="0.9" opacity="0.5" />
        <path d="M128 20 Q131 17 134 20 Q137 17 140 20" strokeWidth="0.8" opacity="0.5" />

        {/* Reflecting pool ground line & steps */}
        <line x1="6" y1="115" x2="154" y2="115" strokeWidth="1" opacity="0.5" />
        <line x1="16" y1="111" x2="144" y2="111" strokeWidth="1.2" />
        <line x1="24" y1="107" x2="136" y2="107" strokeWidth="1.2" />

        {/* Main facade */}
        <rect x="28" y="74" width="104" height="33" strokeWidth="1.4" />

        {/* Colonnaded central portico with pediment */}
        <polygon points="56,74 80,60 104,74" strokeWidth="1.4" />
        <line x1="64" y1="107" x2="64" y2="74" strokeWidth="1.1" />
        <line x1="72" y1="107" x2="72" y2="74" strokeWidth="1.1" />
        <line x1="80" y1="107" x2="80" y2="74" strokeWidth="1.1" />
        <line x1="88" y1="107" x2="88" y2="74" strokeWidth="1.1" />
        <line x1="96" y1="107" x2="96" y2="74" strokeWidth="1.1" />

        {/* Central monumental dome drum */}
        <rect x="66" y="44" width="28" height="16" strokeWidth="1.2" />
        <line x1="66" y1="52" x2="94" y2="52" strokeWidth="0.8" opacity="0.6" />
        {/* Grand dome */}
        <path d="M66 44 C66 18 94 18 94 44 Z" strokeWidth="1.5" />

        {/* Lantern & Angel of Victory */}
        <rect x="76" y="16" width="8" height="4" strokeWidth="1" />
        <line x1="80" y1="16" x2="80" y2="8" strokeWidth="1.2" />
        {/* Angel with outstretched wings */}
        <path d="M74 8 Q80 5 86 8 Q80 11 74 8 Z" strokeWidth="1" fill="currentColor" fillOpacity="0.2" />

        {/* Left Renaissance corner dome */}
        <rect x="32" y="64" width="16" height="10" strokeWidth="1" />
        <path d="M32 64 C32 52 48 52 48 64 Z" strokeWidth="1.2" />
        <line x1="40" y1="52" x2="40" y2="46" strokeWidth="1" />

        {/* Right Renaissance corner dome */}
        <rect x="112" y="64" width="16" height="10" strokeWidth="1" />
        <path d="M112 64 C112 52 128 52 128 64 Z" strokeWidth="1.2" />
        <line x1="120" y1="52" x2="120" y2="46" strokeWidth="1" />

        {/* Subtle pool water ripples */}
        <line x1="40" y1="117" x2="68" y2="117" strokeWidth="0.8" opacity="0.4" />
        <line x1="92" y1="117" x2="120" y2="117" strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }

  // 5. Lucknow: Rumi Darwaza (Awadhi Monumental Cusped Archway)
  if (normalizedId.includes('lucknow')) {
    return (
      <svg {...svgProps} aria-label="Rumi Darwaza architectural line art">
        {/* Ambient birds */}
        <path d="M16 26 Q19 23 22 26 Q25 23 28 26" strokeWidth="0.8" opacity="0.5" />
        <path d="M134 22 Q137 19 140 22 Q143 19 146 22" strokeWidth="0.8" opacity="0.5" />

        {/* Base ground line & plinth */}
        <line x1="8" y1="115" x2="152" y2="115" strokeWidth="1" opacity="0.5" />
        <line x1="18" y1="111" x2="142" y2="111" strokeWidth="1.2" />

        {/* Left octagonal minaret turret */}
        <rect x="24" y="38" width="12" height="73" strokeWidth="1.4" />
        <path d="M22 38 L38 38 L38 30 C38 24 22 24 22 30 Z" strokeWidth="1.2" />
        <line x1="30" y1="24" x2="30" y2="18" strokeWidth="1" />

        {/* Right octagonal minaret turret */}
        <rect x="124" y="38" width="12" height="73" strokeWidth="1.4" />
        <path d="M122 38 L138 38 L138 30 C138 24 122 24 122 30 Z" strokeWidth="1.2" />
        <line x1="130" y1="24" x2="130" y2="18" strokeWidth="1" />

        {/* Grand 60-ft Awadhi Parabolic Archway */}
        <path 
          d="M36 111 L36 70 C36 28 80 18 80 18 C80 18 124 28 124 70 L124 111" 
          strokeWidth="1.6" 
        />
        {/* Inner cusped arch with traditional Awadhi petal scallops */}
        <path 
          d="M48 111 L48 76 C48 42 80 34 80 34 C80 34 112 42 112 76 L112 111" 
          strokeWidth="1.2" 
        />
        {/* Recessed innermost gate portal */}
        <path 
          d="M60 111 L60 82 C60 56 80 50 80 50 C80 50 100 56 100 82 L100 111" 
          strokeWidth="1" 
          opacity="0.7"
        />

        {/* Decorative stepped crenellations & floral cusps along rim */}
        <path 
          d="M40 50 Q46 46 52 50 Q58 46 64 50 Q72 44 80 44 Q88 44 96 50 Q102 46 108 50 Q114 46 120 50" 
          strokeWidth="0.8" 
          opacity="0.6"
        />

        {/* Apex crown chhatri kiosk atop Rumi Darwaza */}
        <rect x="74" y="18" width="12" height="6" strokeWidth="1" />
        <path d="M72 18 C72 10 88 10 88 18 Z" strokeWidth="1.2" />
        <line x1="80" y1="10" x2="80" y2="4" strokeWidth="1" />
      </svg>
    );
  }

  // 6. Gurugram: Cyber Hub & Contemporary Geometric Skyline
  if (normalizedId.includes('gurugram') || normalizedId.includes('gurgaon')) {
    return (
      <svg {...svgProps} aria-label="Gurugram Cyber City architectural line art">
        {/* Ground baseline */}
        <line x1="8" y1="115" x2="152" y2="115" strokeWidth="1" opacity="0.5" />

        {/* Rapid Metro Elevated Viaduct & Piers */}
        <line x1="12" y1="94" x2="148" y2="94" strokeWidth="1.4" />
        <line x1="12" y1="97" x2="148" y2="97" strokeWidth="1" opacity="0.6" />
        {/* Viaduct support pillars */}
        <line x1="32" y1="97" x2="32" y2="115" strokeWidth="1.4" />
        <line x1="68" y1="97" x2="68" y2="115" strokeWidth="1.4" />
        <line x1="104" y1="97" x2="104" y2="115" strokeWidth="1.4" />
        <line x1="136" y1="97" x2="136" y2="115" strokeWidth="1.4" />

        {/* Tower 1 (Horizon Center): Crystalline Angled Crown */}
        <polygon points="26,94 26,30 48,16 64,28 64,94" strokeWidth="1.4" />
        {/* Modernist diagrid structural pattern */}
        <line x1="26" y1="46" x2="64" y2="76" strokeWidth="0.8" opacity="0.6" />
        <line x1="64" y1="46" x2="26" y2="76" strokeWidth="0.8" opacity="0.6" />

        {/* Tower 2 (Building 10 / Cyber Hub Commercial Tower) */}
        <rect x="72" y="34" width="30" height="60" strokeWidth="1.4" />
        {/* Spire atop Tower 2 */}
        <line x1="87" y1="34" x2="87" y2="14" strokeWidth="1.4" />
        {/* Horizontal curtain-wall mullions */}
        <line x1="72" y1="46" x2="102" y2="46" strokeWidth="0.7" opacity="0.5" />
        <line x1="72" y1="58" x2="102" y2="58" strokeWidth="0.7" opacity="0.5" />
        <line x1="72" y1="70" x2="102" y2="70" strokeWidth="0.7" opacity="0.5" />

        {/* Skywalk bridge connecting Tower 1 & Tower 2 */}
        <line x1="64" y1="62" x2="72" y2="62" strokeWidth="1.2" />
        <line x1="64" y1="66" x2="72" y2="66" strokeWidth="1.2" />

        {/* Tower 3 (One Horizon Center High-Rise) */}
        <polygon points="110,94 110,42 132,32 142,42 142,94" strokeWidth="1.3" />
        <line x1="110" y1="54" x2="142" y2="54" strokeWidth="0.7" opacity="0.5" />
        <line x1="110" y1="68" x2="142" y2="68" strokeWidth="0.7" opacity="0.5" />
        <line x1="126" y1="32" x2="126" y2="20" strokeWidth="1.1" />
      </svg>
    );
  }

  // 7. Noida: Express High-Rises & Civic Buddh Stupa
  if (normalizedId.includes('noida')) {
    return (
      <svg {...svgProps} aria-label="Noida Express towers and civic stupa line art">
        {/* Ground line */}
        <line x1="8" y1="115" x2="152" y2="115" strokeWidth="1" opacity="0.5" />

        {/* Tower 1 (Noida Supernova High-Rise with aerodynamic crown) */}
        <path d="M22 115 L22 26 Q34 14 46 26 L46 115" strokeWidth="1.4" />
        {/* Architectural floor grid lines */}
        <line x1="22" y1="42" x2="46" y2="42" strokeWidth="0.8" opacity="0.6" />
        <line x1="22" y1="58" x2="46" y2="58" strokeWidth="0.8" opacity="0.6" />
        <line x1="22" y1="74" x2="46" y2="74" strokeWidth="0.8" opacity="0.6" />
        <line x1="22" y1="90" x2="46" y2="90" strokeWidth="0.8" opacity="0.6" />

        {/* Tower 2 (Spira Tower with telecommunication mast) */}
        <rect x="52" y="36" width="22" height="79" strokeWidth="1.3" />
        <line x1="63" y1="36" x2="63" y2="12" strokeWidth="1.4" />
        <circle cx="63" cy="12" r="1.5" strokeWidth="1" />

        {/* Grand Buddh Civic Stupa Monument */}
        {/* Stepped circular terrace plinths */}
        <line x1="82" y1="115" x2="146" y2="115" strokeWidth="1.2" />
        <line x1="86" y1="110" x2="142" y2="110" strokeWidth="1.2" />
        <line x1="90" y1="105" x2="138" y2="105" strokeWidth="1.2" />
        {/* Semi-hemispherical Anda (dome) */}
        <path d="M92 105 C92 72 136 72 136 105 Z" strokeWidth="1.5" />
        {/* Harmika square box */}
        <rect x="108" y="66" width="12" height="6" strokeWidth="1.2" />
        {/* Chhatravali 3-tier honorary umbrellas */}
        <line x1="104" y1="61" x2="124" y2="61" strokeWidth="1.2" />
        <line x1="107" y1="57" x2="121" y2="57" strokeWidth="1.1" />
        <line x1="110" y1="53" x2="118" y2="53" strokeWidth="1" />
        <line x1="114" y1="66" x2="114" y2="46" strokeWidth="1.3" />
      </svg>
    );
  }

  // 8. Fallback / Generic Indian Metro Horizon Skyline
  return (
    <svg {...svgProps} aria-label="Indian metro architectural horizon line art">
      {/* Distant atmospheric birds */}
      <path d="M18 22 Q21 19 24 22 Q27 19 30 22" strokeWidth="0.8" opacity="0.5" />
      <path d="M132 20 Q135 17 138 20 Q141 17 144 20" strokeWidth="0.8" opacity="0.5" />

      {/* Ground line */}
      <line x1="8" y1="115" x2="152" y2="115" strokeWidth="1" opacity="0.5" />

      {/* Modern High-Rise Block 1 */}
      <rect x="18" y="46" width="18" height="69" strokeWidth="1.2" />
      <line x1="18" y1="60" x2="36" y2="60" strokeWidth="0.7" opacity="0.5" />
      <line x1="18" y1="74" x2="36" y2="74" strokeWidth="0.7" opacity="0.5" />

      {/* Heritage Dome Pavilion */}
      <rect x="42" y="68" width="24" height="47" strokeWidth="1.2" />
      <path d="M42 68 C42 50 66 50 66 68 Z" strokeWidth="1.3" />
      <line x1="54" y1="50" x2="54" y2="42" strokeWidth="1.1" />

      {/* Central Monumental Archway */}
      <rect x="74" y="42" width="34" height="73" strokeWidth="1.4" />
      <path d="M80 115 L80 68 C80 52 102 52 102 68 L102 115" strokeWidth="1.4" />
      <line x1="72" y1="42" x2="110" y2="42" strokeWidth="1.2" />
      <line x1="76" y1="38" x2="106" y2="38" strokeWidth="1.1" />

      {/* Contemporary Spire Tower */}
      <polygon points="116,115 116,40 134,30 142,40 142,115" strokeWidth="1.3" />
      <line x1="128" y1="30" x2="128" y2="16" strokeWidth="1.2" />
    </svg>
  );
};
