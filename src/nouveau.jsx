import React from 'react';

// ————— Tourmaline palette ("Parlor Jewel" + chartreuse vein), drawn from the
// indicolite photo: near-black, olive-gold metalwork, deep teal, cream ink —————
export const T = {
  bg: '#100E0E',
  panel: '#1B1717',
  panelLight: 'rgba(191,212,203,0.06)',
  ink: '#BFD4CB',
  inkSoft: 'rgba(191,212,203,0.65)',
  inkFaint: 'rgba(191,212,203,0.40)',
  gold: '#8FA858',
  goldBright: '#B9CD7E',
  titleBlue: '#9CCEC4',
  tealLine: 'rgba(111,168,159,0.45)',
  tealSoft: 'rgba(111,168,159,0.22)',
  goldLine: 'rgba(143,168,88,0.5)',
  goldSoft: 'rgba(143,168,88,0.25)',
  goldFaint: 'rgba(143,168,88,0.10)',
  teal: '#2E6E6A',
  peacock: '#6FA89F',
  chartreuse: '#8FA858',
  red: '#D98873',
};

export const FONT_DISPLAY = '"Cinzel Decorative", "Cormorant Garamond", Georgia, serif';
export const FONT_BODY = '"Cormorant Garamond", Georgia, "Source Serif Pro", serif';

// Double-frame panel: gold hairline, charcoal reveal, inner gold echo
export const frame = {
  background: T.panel,
  border: `1px solid ${T.tealLine}`,
  boxShadow: `inset 0 0 0 3px ${T.bg}, inset 0 0 0 4px ${T.tealSoft}`,
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
  ::placeholder { color: rgba(242,237,228,0.35); opacity: 1; }
  ::selection { background: rgba(176,141,87,0.45); }
  .caption { font-family: ${FONT_BODY}; font-weight: 600; letter-spacing: 0.14em; }
  .display { font-family: ${FONT_DISPLAY}; font-weight: 400; letter-spacing: 0.05em; }
  input[type="range"] { -webkit-appearance: none; height: 5px; border-radius: 3px; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${T.ink}; cursor: pointer; border: 2px solid ${T.gold}; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

// Asymmetric whiplash flourish — a single vine sweeping left to right,
// budding at its origin, curling into a spiral at its end
export function Flourish({ width = 260 }) {
  return (
    <svg width={width} height="30" viewBox="0 0 260 30" fill="none" aria-hidden="true" style={{ maxWidth: '100%', display: 'inline-block' }}>
      <path d="M6 21 C 58 4, 118 27, 166 15 C 194 8, 214 5, 234 10" stroke={T.gold} strokeWidth="1.1" opacity="0.8" />
      <path d="M234 10 C 250 14, 252 26, 242 28 C 234 29.5, 230 22, 236 18" stroke={T.gold} strokeWidth="1" opacity="0.8" />
      <path d="M92 17 C 102 6, 117 2, 126 6 C 116 15, 101 20, 92 17 Z" fill={T.gold} opacity="0.28" />
      <path d="M92 17 C 102 6, 117 2, 126 6" stroke={T.gold} strokeWidth="0.9" opacity="0.6" />
      <path d="M40 13 C 48 7, 58 5, 64 8" stroke={T.gold} strokeWidth="0.8" opacity="0.45" />
      <circle cx="6" cy="21" r="2" fill={T.gold} opacity="0.7" />
    </svg>
  );
}

export function VineRule() {
  return (
    <svg width="100%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M0 12 C 60 -6, 120 22, 190 9 C 250 -2, 310 18, 400 7"
        stroke={T.gold} strokeWidth="1" opacity="0.35" />
      <path d="M310 12 C 320 6, 331 4, 338 7 C 330 13, 318 16, 310 12 Z" fill={T.gold} opacity="0.18" />
    </svg>
  );
}

// Halo, loosened: off-beat rings with whiplash tendrils trailing from its
// lower rim — meant to sit behind a centered title
export function Halo({ size = 360 }) {
  const c = size / 2;
  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true"
      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
    >
      <circle cx={c} cy={c} r={c - 30} stroke={T.gold} strokeWidth="1" opacity="0.30" />
      <circle cx={c - 4} cy={c + 3} r={c - 40} stroke={T.gold} strokeWidth="0.7" opacity="0.15" />
      <circle cx={c} cy={c} r={c - 34} stroke={T.gold} strokeWidth="5" opacity="0.10" strokeDasharray="1 9" />
      <path d={`M${c} ${23} C ${c + 9} ${29}, ${c + 5} ${40}, ${c - 3} ${38} C ${c - 9} ${36.5}, ${c - 8} ${28}, ${c} ${23} Z`}
        stroke={T.gold} strokeWidth="1" opacity="0.5" />
      <path d={`M${c - (c - 30) * 0.5} ${c + (c - 30) * 0.87} C ${c - (c - 30) * 0.9} ${c + (c - 30) * 1.05}, ${c - (c - 30) * 1.25} ${c + (c - 30) * 0.8}, ${c - (c - 30) * 1.05} ${c + (c - 30) * 0.62}`}
        stroke={T.gold} strokeWidth="0.9" opacity="0.35" />
      <path d={`M${c + (c - 30) * 0.64} ${c + (c - 30) * 0.77} C ${c + (c - 30) * 0.92} ${c + (c - 30) * 0.98}, ${c + (c - 30) * 1.12} ${c + (c - 30) * 0.86}, ${c + (c - 30) * 1.02} ${c + (c - 30) * 0.7} C ${c + (c - 30) * 0.96} ${c + (c - 30) * 0.6}, ${c + (c - 30) * 0.86} ${c + (c - 30) * 0.66}, ${c + (c - 30) * 0.9} ${c + (c - 30) * 0.76}`}
        stroke={T.gold} strokeWidth="0.9" opacity="0.35" />
    </svg>
  );
}

// A single vine curl with a leaf — placed asymmetrically (top-left and
// bottom-right only), the way nouveau framing actually behaves
function Curl({ style }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path d="M32 4 C 16 2, 4 10, 4 26" stroke={T.gold} strokeWidth="1" opacity="0.65" />
      <path d="M4 26 C 4 31, 9 33, 12 30 C 14.5 27.5, 12 23, 8 25" stroke={T.gold} strokeWidth="0.9" opacity="0.65" />
      <path d="M14 8 C 19 3, 26 2, 30 5 C 25 10, 18 12, 14 8 Z" fill={T.gold} opacity="0.22" />
    </svg>
  );
}

export function Corners() {
  return (
    <>
      <Curl style={{ top: 4, left: 4 }} />
      <Curl style={{ bottom: 4, right: 4, transform: 'rotate(180deg)' }} />
    </>
  );
}

export const pageBackground = `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(46,110,106,0.12), transparent 65%), ${T.bg}`;
