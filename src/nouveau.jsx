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
  red: '#C08A66',
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

// Climbing vine for a panel's vertical edge: winding stem, leaves turned
// different ways, a bud, a spiral foot, and a Klimt cluster of dots.
// Stretches to the panel's height (curves flex with it — they're vines).
export function VineEdge({ side = 'left' }) {
  return (
    <svg
      width="26" height="100%" viewBox="0 0 26 220" preserveAspectRatio="none" fill="none" aria-hidden="true"
      style={{
        position: 'absolute', top: 0, bottom: 0, pointerEvents: 'none',
        ...(side === 'left' ? { left: 2 } : { right: 2, transform: 'scaleX(-1)' }),
      }}
    >
      <path d="M13 0 C 4 28, 21 54, 10 84 C 2 108, 19 138, 9 168 C 4 188, 15 204, 12 220"
        stroke={T.gold} strokeWidth="1" opacity="0.5" />
      <path d="M11 50 C 16 41, 23 38, 26 42 C 21 49, 13 53, 11 50 Z" fill={T.gold} opacity="0.24" />
      <path d="M12 118 C 6 111, 5 103, 9 100 C 14 106, 14 114, 12 118 Z" fill={T.gold} opacity="0.19" />
      <path d="M10 172 C 15 164, 22 161, 25 165 C 20 171, 12 175, 10 172 Z" fill={T.gold} opacity="0.22" />
      <circle cx="9" cy="85" r="1.8" fill={T.gold} opacity="0.5" />
      <path d="M9 85 C 3 80, 2 73, 6 71" stroke={T.gold} strokeWidth="0.8" opacity="0.4" />
      <path d="M12 204 C 5 208, 5 216, 10 217 C 14 217.8, 15 212, 11 211"
        stroke={T.gold} strokeWidth="0.9" opacity="0.6" />
      <circle cx="17" cy="18" r="1.1" fill={T.gold} opacity="0.35" />
      <circle cx="20" cy="24" r="1.1" fill={T.gold} opacity="0.3" />
      <circle cx="15" cy="28" r="1.1" fill={T.gold} opacity="0.25" />
    </svg>
  );
}

// Species/family line woven into the frame: whiplash tendrils reach in
// from both sides toward the text
export function SpeciesBand({ children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, maxWidth: '100%' }}>
      <svg width="44" height="12" viewBox="0 0 44 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M1 9 C 12 2, 24 10, 43 6" stroke={T.gold} strokeWidth="0.9" opacity="0.55" />
        <path d="M20 7 C 25 3, 31 2, 34 4 C 30 8, 23 9.5, 20 7 Z" fill={T.gold} opacity="0.2" />
        <circle cx="1.6" cy="9" r="1.4" fill={T.gold} opacity="0.5" />
      </svg>
      {children}
      <svg width="44" height="12" viewBox="0 0 44 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, transform: 'scaleX(-1)' }}>
        <path d="M1 9 C 12 2, 24 10, 43 6" stroke={T.gold} strokeWidth="0.9" opacity="0.55" />
        <path d="M20 7 C 25 3, 31 2, 34 4 C 30 8, 23 9.5, 20 7 Z" fill={T.gold} opacity="0.2" />
        <circle cx="1.6" cy="9" r="1.4" fill={T.gold} opacity="0.5" />
      </svg>
    </span>
  );
}

// Tall vine spray for flanking the page header — long whiplash stem
// curling into a spiral crown, with leaves and a Klimt dot trail
export function VineSpray({ style, flip = false }) {
  return (
    <svg width="110" height="190" viewBox="0 0 110 190" fill="none" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', ...(flip ? { transform: 'scaleX(-1)' } : {}), ...style }}>
      <path d="M18 190 C 8 150, 30 122, 22 88 C 15 60, 38 34, 66 26 C 88 20, 100 30, 98 42 C 96 54, 82 56, 78 46 C 75 39, 82 33, 88 37"
        stroke={T.gold} strokeWidth="1" opacity="0.5" />
      <path d="M22 88 C 34 80, 48 79, 54 84 C 45 92, 30 94, 22 88 Z" fill={T.gold} opacity="0.2" />
      <path d="M20 140 C 10 132, 8 122, 13 118 C 20 125, 21 134, 20 140 Z" fill={T.gold} opacity="0.17" />
      <path d="M52 34 C 58 24, 68 20, 74 23 C 68 31, 57 36, 52 34 Z" fill={T.gold} opacity="0.22" />
      <circle cx="30" cy="62" r="1.9" fill={T.gold} opacity="0.45" />
      <path d="M30 62 C 24 56, 24 49, 29 47" stroke={T.gold} strokeWidth="0.8" opacity="0.38" />
      <circle cx="42" cy="110" r="1.1" fill={T.gold} opacity="0.32" />
      <circle cx="46" cy="117" r="1.1" fill={T.gold} opacity="0.27" />
      <circle cx="40" cy="121" r="1.1" fill={T.gold} opacity="0.22" />
    </svg>
  );
}

export const pageBackground = `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(46,110,106,0.12), transparent 65%), ${T.bg}`;
