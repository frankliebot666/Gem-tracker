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

// Whiplash rule: two long parallel S-lines terminating in tight spirals at
// both ends, circle-dot triad at center. Structural poster linework, no leaves.
export function Flourish({ width = 260 }) {
  return (
    <svg width={width} height="30" viewBox="0 0 260 30" fill="none" aria-hidden="true" style={{ maxWidth: '100%', display: 'inline-block' }}>
      <path d="M16 13 C 62 3, 96 26, 130 14 C 164 3, 198 26, 244 17" stroke={T.gold} strokeWidth="1.1" opacity="0.8" />
      <path d="M20 17 C 64 8, 98 29, 130 18 C 162 8, 196 29, 240 21" stroke={T.gold} strokeWidth="0.7" opacity="0.4" />
      <path d="M16 13 C 8 10, 4 15, 8 19 C 11 21.5, 15 19, 13.5 15.5 C 12.7 13.7, 10 14, 10.5 16" stroke={T.gold} strokeWidth="1" opacity="0.8" />
      <path d="M244 17 C 252 14, 256 19, 252 23 C 249 25.5, 245 23, 246.5 19.5 C 247.3 17.7, 250 18, 249.5 20" stroke={T.gold} strokeWidth="1" opacity="0.8" />
      <circle cx="126" cy="7" r="1.2" fill={T.gold} opacity="0.5" />
      <circle cx="130" cy="5" r="1.2" fill={T.gold} opacity="0.4" />
      <circle cx="134" cy="7" r="1.2" fill={T.gold} opacity="0.3" />
    </svg>
  );
}

export function VineRule() {
  return (
    <svg width="100%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M0 12 C 60 0, 130 20, 200 8 C 270 -2, 330 18, 388 8"
        stroke={T.gold} strokeWidth="1" opacity="0.35" />
      <path d="M0 15 C 60 4, 130 23, 200 12 C 270 2, 330 21, 384 12"
        stroke={T.gold} strokeWidth="0.6" opacity="0.18" />
      <path d="M388 8 C 396 5, 400 10, 396 14 C 393 16.5, 389.5 13.5, 391.5 11"
        stroke={T.gold} strokeWidth="0.9" opacity="0.4" />
    </svg>
  );
}

// Poster arch crowning the page title: double arc with fine dotted course,
// tight spiral terminals at the feet, lozenge crest
export function ArchCrown({ width = 560, height = 150 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 560 150" fill="none" aria-hidden="true"
      style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', pointerEvents: 'none', maxWidth: '100%' }}>
      <path d="M20 150 C 60 34, 500 34, 540 150" stroke={T.gold} strokeWidth="1.1" opacity="0.5" />
      <path d="M40 150 C 78 50, 482 50, 520 150" stroke={T.gold} strokeWidth="0.6" opacity="0.28" />
      <path d="M30 150 C 69 42, 491 42, 530 150" stroke={T.gold} strokeWidth="3.5" opacity="0.13" strokeDasharray="0.1 8" strokeLinecap="round" />
      <path d="M20 148 C 11 143, 4 148, 7 155 C 9 159.5, 15 158, 13.8 153 C 13.1 150.3, 9.8 150.8, 10.6 153.5" stroke={T.gold} strokeWidth="0.9" opacity="0.6" />
      <path d="M540 148 C 549 143, 556 148, 553 155 C 551 159.5, 545 158, 546.2 153 C 546.9 150.3, 550.2 150.8, 549.4 153.5" stroke={T.gold} strokeWidth="0.9" opacity="0.6" />
      <path d="M280 26 L 285.5 33 L 280 40 L 274.5 33 Z" stroke={T.gold} strokeWidth="1" opacity="0.6" />
      <circle cx="280" cy="33" r="1.3" fill={T.gold} opacity="0.7" />
    </svg>
  );
}

// Tight two-turn corner spiral with a companion hairline — Klimt, not elf
function Curl({ style }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path d="M30 4 C 14 4, 6 12, 6 24 C 6 30.5, 12 33, 16 29.5 C 19.3 26.6, 17.5 21, 13.5 21.8 C 11 22.3, 10.6 25.6, 12.8 26.2"
        stroke={T.gold} strokeWidth="1" opacity="0.6" />
      <path d="M30 9 C 18 9, 11 15, 10.5 23" stroke={T.gold} strokeWidth="0.6" opacity="0.3" />
      <circle cx="13.6" cy="24" r="1" fill={T.gold} opacity="0.6" />
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

// Border linework for a panel's vertical edge: parallel hairlines hugging
// the frame, flaring into a tight spiral terminal at the top, with a run of
// Klimt squares. Mucha border architecture, not a plant.
export function VineEdge({ side = 'left' }) {
  return (
    <svg
      width="26" height="100%" viewBox="0 0 26 220" preserveAspectRatio="none" fill="none" aria-hidden="true"
      style={{
        position: 'absolute', top: 0, bottom: 0, pointerEvents: 'none',
        ...(side === 'left' ? { left: 2 } : { right: 2, transform: 'scaleX(-1)' }),
      }}
    >
      <path d="M8 220 L 8 58 C 8 38, 10 26, 17 17 C 21.5 11.5, 21 4, 14.5 4.5 C 10 5, 9.5 11, 14 12 C 17 12.6, 18.5 9.8, 16.8 7.6"
        stroke={T.gold} strokeWidth="1" opacity="0.55" />
      <path d="M13 220 L 13 66 C 13 48, 14.5 36, 20 28" stroke={T.gold} strokeWidth="0.6" opacity="0.28" />
      <rect x="6.2" y="118" width="4" height="4" fill={T.gold} opacity="0.35" />
      <rect x="6.2" y="126" width="4" height="4" fill={T.gold} opacity="0.22" />
      <rect x="6.2" y="134" width="4" height="4" fill={T.gold} opacity="0.12" />
      <circle cx="8" cy="90" r="1.3" fill={T.gold} opacity="0.4" />
      <path d="M8 220 C 8 211, 2.5 209.5, 2 215" stroke={T.gold} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// Species/family line woven into the frame: paired whiplash hairlines reach
// in from both sides toward the text, spiral-dotted at their outer ends
export function SpeciesBand({ children }) {
  const tendril = (
    <svg width="44" height="12" viewBox="0 0 44 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M3 9 C 14 2, 27 9, 43 5" stroke={T.gold} strokeWidth="0.9" opacity="0.55" />
      <path d="M8 11 C 18 5.5, 29 11, 41 7.5" stroke={T.gold} strokeWidth="0.55" opacity="0.28" />
      <path d="M3 9 C 0.6 7.4, 1 4.4, 3.6 4.6 C 5.4 4.8, 5.4 7.4, 3.6 7.3" stroke={T.gold} strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, maxWidth: '100%' }}>
      {tendril}
      {children}
      <span style={{ display: 'inline-flex', transform: 'scaleX(-1)', flexShrink: 0 }}>{tendril}</span>
    </span>
  );
}

export const pageBackground = `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(46,110,106,0.12), transparent 65%), ${T.bg}`;
