import React from 'react';

// ————— Tourmaline palette ("Parlor Jewel" + chartreuse vein), drawn from the
// indicolite photo: near-black, olive-gold metalwork, deep teal, cream ink —————
export const T = {
  bg: '#100E0E',
  panel: '#1B1717',
  panelLight: 'rgba(237,234,224,0.06)',
  ink: '#EDEAE0',
  inkSoft: 'rgba(237,234,224,0.65)',
  inkFaint: 'rgba(237,234,224,0.40)',
  gold: '#A79A5E',
  goldBright: '#C9BC7E',
  goldLine: 'rgba(167,154,94,0.5)',
  goldSoft: 'rgba(167,154,94,0.25)',
  goldFaint: 'rgba(167,154,94,0.10)',
  teal: '#2E6E6A',
  peacock: '#6FA89F',
  chartreuse: '#A8B060',
  red: '#D98873',
};

export const FONT_DISPLAY = '"Cinzel Decorative", "Cormorant Garamond", Georgia, serif';
export const FONT_BODY = '"Cormorant Garamond", Georgia, "Source Serif Pro", serif';

// Double-frame panel: gold hairline, charcoal reveal, inner gold echo
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
  ::placeholder { color: rgba(242,237,228,0.35); opacity: 1; }
  ::selection { background: rgba(176,141,87,0.45); }
  .caption { font-family: ${FONT_BODY}; font-weight: 600; letter-spacing: 0.14em; }
  .display { font-family: ${FONT_DISPLAY}; font-weight: 400; letter-spacing: 0.05em; }
  input[type="range"] { -webkit-appearance: none; height: 5px; border-radius: 3px; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${T.ink}; cursor: pointer; border: 2px solid ${T.gold}; }
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

// Mucha halo: concentric rings + beaded band + cardinal lozenges,
// meant to sit behind a centered title
export function Halo({ size = 360 }) {
  const c = size / 2;
  const lozenge = (x, y) =>
    `M${x} ${y - 7} L${x + 5} ${y} L${x} ${y + 7} L${x - 5} ${y} Z`;
  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true"
      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
    >
      <circle cx={c} cy={c} r={c - 30} stroke={T.gold} strokeWidth="1" opacity="0.30" />
      <circle cx={c} cy={c} r={c - 38} stroke={T.gold} strokeWidth="0.7" opacity="0.18" />
      <circle cx={c} cy={c} r={c - 58} stroke={T.gold} strokeWidth="1" opacity="0.12" />
      <circle cx={c} cy={c} r={c - 34} stroke={T.gold} strokeWidth="5" opacity="0.10" strokeDasharray="1 9" />
      <path d={lozenge(c, 30)} stroke={T.gold} strokeWidth="1" opacity="0.45" />
      <path d={lozenge(c, size - 30)} stroke={T.gold} strokeWidth="1" opacity="0.45" />
      <path d={lozenge(30, c)} stroke={T.gold} strokeWidth="1" opacity="0.45" />
      <path d={lozenge(size - 30, c)} stroke={T.gold} strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

// Spiral curls for the four corners of a panel — the panel must be position:relative
function Corner({ style }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path d="M24 3 C 12 3, 3 12, 3 24" stroke={T.gold} strokeWidth="1.1" opacity="0.7" />
      <path d="M17 6 C 10 7, 7 10, 6 17" stroke={T.gold} strokeWidth="0.8" opacity="0.4" />
      <circle cx="9" cy="9" r="1.4" fill={T.gold} opacity="0.7" />
    </svg>
  );
}

export function Corners() {
  return (
    <>
      <Corner style={{ top: 5, left: 5 }} />
      <Corner style={{ top: 5, right: 5, transform: 'rotate(90deg)' }} />
      <Corner style={{ bottom: 5, right: 5, transform: 'rotate(180deg)' }} />
      <Corner style={{ bottom: 5, left: 5, transform: 'rotate(270deg)' }} />
    </>
  );
}

export const pageBackground = `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(46,110,106,0.12), transparent 65%), ${T.bg}`;
