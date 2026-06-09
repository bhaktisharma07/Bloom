import React from 'react';

export const TodayIconSVG = ({ size = 20, strokeColor = 'currentColor', fill = 'none' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 11 12 14 17 9" />
  </svg>
);

export const DashboardIconSVG = ({ size = 20, strokeColor = 'currentColor', fill = 'none' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const ProgressIconSVG = ({ size = 20, strokeColor = 'currentColor', fill = 'none' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const BoltIconSVG = ({ size = 20, strokeColor = 'currentColor', fill = 'none' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const HeartSVG = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF7675" stroke="#5B5563" strokeWidth="1.5" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
