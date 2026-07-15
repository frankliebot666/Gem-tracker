import React from 'react';

// ————— Art Nouveau theme: aged parchment, moss ink, antique gold, peacock —————
export const T = {
  bg: '#F3ECD9',
  panel: '#EDE2C7',
  panelLight: 'rgba(255,252,242,0.72)',
  ink: '#33402F',
  inkSoft: 'rgba(51,64,47,0.62)',
  inkFaint: 'rgba(51,64,47,0.40)',
  gold: '#8C6A2F',
  goldBright: '#B08D57',
  goldLine: 'rgba(140,106,47,0.45)',
  goldSoft: 'rgba(140,106,47,0.22)',
  goldFaint: 'rgba(140,106,47,0.10)',
  peacock: '#1B4B4A',
  red: '#9A3B2E',
};

export const FONT_DISPLAY = '"Berkshire Swash", "Cormorant Garamond", Georgia, serif';
export const FONT_BODY = '"Cormorant Garamond", Georgia, "Source Serif Pro", serif';

// Double-frame panel: gold hairline, parchment reveal, inner gold echo
export const frame = {
  background: T.panel,
  border: `1px solid ${T.goldLine}`,
  boxShadow: `inset 0 0 0 3px ${T.bg}, inset 0 0 0 4px ${T.goldSoft}`,
};

// Arched "Tiffany window" top for photos and vignettes
export const arch = { borderRadius: '50% 50% 8px 8px / 42% 42% 8px 8px' };

export const inputStyle = {
  background: T.panelLight,
  border: `1px solid ${T.goldLine}`,
  color: T.ink,
};

export const baseCss = `
  input, textarea { outline: none; }
  input:focus, textarea:focus, button:focus-visible { box-shadow: 0 0 0 2px ${T.goldBright}; }
  ::placeholder { color: rgba(51,64,47,0.38); opacity: 1; }
  ::selection { background: rgba(176,141,87,0.35); }
  .caption { font-family: ${FONT_BODY}; font-weight: 600; letter-spacing: 0.14em; }
  .display { font-family: ${FONT_DISPLAY}; font-weight: 400; }
  input[type="range"] { -webkit-appearance: none; height: 5px; border-radius: 3px; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${T.bg}; cursor: pointer; border: 2px solid ${T.gold}; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

// Whiplash-curve flourish with a central lozenge, drawn inline
export function Flourish({ width = 260 }) {
  return (
    <svg width={width} height="26" viewBox="0 0 260 26" fill="none" aria-hidden="true" style={{ maxWidth: '100%', display: 'inline-block' }}>
      <path d="M6 13 C 46 -4, 88 30, 118 13" stroke={T.gold} strokeWidth="1.1" opacity="0.75" />
      <path d="M254 13 C 214 -4, 172 30, 142 13" stroke={T.gold} strokeWidth="1.1" opacity="0.75" />
      <path d="M6 13 C 40 26, 92 2, 118 13" stroke={T.gold} strokeWidth="0.8" opacity="0.4" />
      <path d="M254 13 C 220 26, 168 2, 142 13" stroke={T.gold} strokeWidth="0.8" opacity="0.4" />
      <path d="M130 5 L 137 13 L 130 21 L 123 13 Z" stroke={T.gold} strokeWidth="1.1" fill="none" opacity="0.9" />
      <circle cx="130" cy="13" r="1.6" fill={T.gold} opacity="0.9" />
      <circle cx="6" cy="13" r="1.6" fill={T.gold} opacity="0.6" />
      <circle cx="254" cy="13" r="1.6" fill={T.gold} opacity="0.6" />
    </svg>
  );
}

export function VineRule() {
  return (
    <svg width="100%" height="14" viewBox="0 0 400 14" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M0 7 C 50 -3, 100 17, 150 7 S 250 -3, 300 7 S 380 17, 400 7"
        stroke={T.gold} strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

export const pageBackground = `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(176,141,87,0.14), transparent 65%), ${T.bg}`;
