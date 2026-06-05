import React from 'react';

export const ButterflySVG = ({ color1 = '#FFD6E7', color2 = '#E8D9FF' }) => (
  <svg viewBox="0 0 30 30" width="100%" height="100%">
    {/* Left wings */}
    <path d="M15 15 C8 8, 2 10, 5 15 C2 20, 8 22, 15 15" fill={color1} opacity="0.9" />
    <path d="M15 15 C10 12, 5 13, 7 15 C5 17, 10 18, 15 15" fill={color2} opacity="0.8" />
    {/* Right wings */}
    <path d="M15 15 C22 8, 28 10, 25 15 C28 20, 22 22, 15 15" fill={color1} opacity="0.9" />
    <path d="M15 15 C20 12, 25 13, 23 15 C25 17, 20 18, 15 15" fill={color2} opacity="0.8" />
    {/* Body */}
    <line x1="15" y1="8" x2="15" y2="22" stroke="#5B5563" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SproutSVG = () => (
  <svg viewBox="0 0 80 120" width="100%" height="100%">
    <path d="M40 120 Q40 90, 42 70" stroke="#78B98A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M42 70 C28 65, 20 78, 42 70" fill="#91D1A1" stroke="#5B5563" strokeWidth="2" strokeLinejoin="round" />
    <path d="M42 70 C56 62, 62 74, 42 70" fill="#A3E2B6" stroke="#5B5563" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const DaisySVG = () => (
  <svg viewBox="0 0 80 120" width="100%" height="100%">
    <path d="M40 120 Q40 65, 40 50" stroke="#78B98A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M40 95 Q25 90, 22 80 Q32 80, 40 90" fill="#91D1A1" stroke="#5B5563" strokeWidth="2" />
    <g stroke="#5B5563" strokeWidth="2" fill="#FFFFFF">
      <circle cx="40" cy="28" r="8" />
      <circle cx="40" cy="62" r="8" />
      <circle cx="23" cy="45" r="8" />
      <circle cx="57" cy="45" r="8" />
      <circle cx="28" cy="33" r="8" />
      <circle cx="52" cy="57" r="8" />
      <circle cx="28" cy="57" r="8" />
      <circle cx="52" cy="33" r="8" />
    </g>
    <circle cx="40" cy="45" r="10" fill="#FFEAA7" stroke="#5B5563" strokeWidth="2.5" />
    <circle cx="37" cy="43" r="1" fill="#5B5563" />
    <circle cx="43" cy="43" r="1" fill="#5B5563" />
    <path d="M38 47 Q40 49, 42 47" stroke="#5B5563" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

export const TulipSVG = () => (
  <svg viewBox="0 0 80 120" width="100%" height="100%">
    <path d="M40 120 Q38 70, 40 55" stroke="#78B98A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M40 100 C58 90, 60 70, 40 85" fill="#91D1A1" stroke="#5B5563" strokeWidth="2" />
    <path d="M40 55 C22 55, 22 25, 40 25 C58 25, 58 55, 40 55 Z" fill="#FFA5C9" stroke="#5B5563" strokeWidth="2" />
    <path d="M40 55 C30 55, 28 30, 40 22 C52 30, 50 55, 40 55 Z" fill="#FFB7D5" stroke="#5B5563" strokeWidth="2.5" />
  </svg>
);

export const LavenderSVG = () => (
  <svg viewBox="0 0 80 120" width="100%" height="100%">
    <path d="M40 120 V40" stroke="#78B98A" strokeWidth="4.5" fill="none" />
    <ellipse cx="32" cy="75" rx="7" ry="5" fill="#C56CF0" stroke="#5B5563" strokeWidth="2" />
    <ellipse cx="48" cy="75" rx="7" ry="5" fill="#C56CF0" stroke="#5B5563" strokeWidth="2" />
    <circle cx="40" cy="72" r="5" fill="#D6A2E8" stroke="#5B5563" strokeWidth="1.5" />
    <ellipse cx="30" cy="60" rx="7" ry="5" fill="#BE2EDD" stroke="#5B5563" strokeWidth="2" />
    <ellipse cx="50" cy="60" rx="7" ry="5" fill="#BE2EDD" stroke="#5B5563" strokeWidth="2" />
    <circle cx="40" cy="57" r="5" fill="#D6A2E8" stroke="#5B5563" strokeWidth="1.5" />
    <ellipse cx="32" cy="45" rx="6" ry="4.5" fill="#C56CF0" stroke="#5B5563" strokeWidth="2" />
    <ellipse cx="48" cy="45" rx="6" ry="4.5" fill="#C56CF0" stroke="#5B5563" strokeWidth="2" />
    <circle cx="40" cy="42" r="5" fill="#E8D9FF" stroke="#5B5563" strokeWidth="1.5" />
    <circle cx="40" cy="30" r="5" fill="#E8D9FF" stroke="#5B5563" strokeWidth="2" />
  </svg>
);

export const RoseSVG = () => (
  <svg viewBox="0 0 80 120" width="100%" height="100%">
    <path d="M40 120 Q39 65, 40 50" stroke="#78B98A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M40 85 C25 80, 25 70, 40 78" fill="#91D1A1" stroke="#5B5563" strokeWidth="1.8" />
    <path d="M30 52 L40 58 L50 52 L40 45 Z" fill="#78B98A" stroke="#5B5563" strokeWidth="1.8" />
    <circle cx="40" cy="38" r="16" fill="#FF5252" stroke="#5B5563" strokeWidth="2" />
    <path d="M26 38 C26 22, 54 22, 54 38 Z" fill="#FF7675" stroke="#5B5563" strokeWidth="2" />
    <circle cx="40" cy="38" r="10" fill="none" stroke="#5B5563" strokeWidth="2.2" />
  </svg>
);

// Cozy central hero illustration: A cute flowerpot growing leaves with stars/clouds
export const HeroIllustrationSVG = () => (
  <svg viewBox="0 0 240 200" width="100%" height="100%">
    {/* Cute Cloud */}
    <path d="M40 50 C40 30, 70 30, 80 40 C90 30, 120 30, 125 50 C135 50, 140 60, 135 70 C135 80, 50 80, 40 70 C30 70, 30 55, 40 50 Z" fill="#FFFFFF" opacity="0.9" />
    
    {/* Stem growing from pot */}
    <path d="M120 150 Q110 110, 118 80" stroke="#78B98A" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    {/* Big leaf 1 */}
    <path d="M118 80 C80 70, 75 95, 118 80" fill="#91D1A1" stroke="#5B5563" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Big leaf 2 */}
    <path d="M118 80 C150 65, 155 90, 118 80" fill="#A3E2B6" stroke="#5B5563" strokeWidth="2.5" strokeLinejoin="round" />
    
    {/* A flower bud at center */}
    <circle cx="118" cy="76" r="6" fill="#FFD6E7" stroke="#5B5563" strokeWidth="2" />
    
    {/* Cozy Flowerpot */}
    <path d="M90 145 L150 145 L142 185 L98 185 Z" fill="#FFF3E6" stroke="#5B5563" strokeWidth="3" strokeLinejoin="round" />
    <rect x="85" y="138" width="70" height="8" rx="4" fill="#FFEAA7" stroke="#5B5563" strokeWidth="2.5" />
    
    {/* Pot Face */}
    <circle cx="112" cy="162" r="2" fill="#5B5563" />
    <circle cx="128" cy="162" r="2" fill="#5B5563" />
    <path d="M117 169 Q120 172, 123 169" stroke="#5B5563" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Sparkles around */}
    <text x="50" y="110" fill="#FFB7D5" fontSize="16">✨</text>
    <text x="180" y="130" fill="#E8D9FF" fontSize="18">✨</text>
    <text x="170" y="60" fill="#FFEAA7" fontSize="14">✨</text>
  </svg>
);
export const SparkleSVG = () => (
  <span style={{ color: '#FFEAA7', display: 'inline-block' }}>✨</span>
);
export const FlowerLogoSVG = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFB7D5" stroke="#5B5563" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="4" fill="#FFEAA7" />
    <circle cx="12" cy="6" r="3.5" />
    <circle cx="12" cy="18" r="3.5" />
    <circle cx="6" cy="12" r="3.5" />
    <circle cx="18" cy="12" r="3.5" />
  </svg>
);
export const HeartSVG = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF7675" stroke="#5B5563" strokeWidth="1.5" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
