import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { T, frame, inputStyle, Flourish, VineRule, Corners } from './nouveau.jsx';

const SG_REF = [
  { name: 'Opal', sg: 2.15 }, { name: 'Amber', sg: 1.08 }, { name: 'Quartz', sg: 2.65 },
  { name: 'Feldspar (Moonstone)', sg: 2.56 }, { name: 'Beryl (Emerald/Aquamarine)', sg: 2.72 },
  { name: 'Tourmaline', sg: 3.06 }, { name: 'Spodumene (Kunzite)', sg: 3.18 }, { name: 'Peridot', sg: 3.34 },
  { name: 'Diamond', sg: 3.52 }, { name: 'Spinel', sg: 3.60 }, { name: 'Topaz', sg: 3.55 },
  { name: 'Garnet', sg: 3.80 }, { name: 'Corundum (Ruby/Sapphire)', sg: 4.00 },
  { name: 'Zircon', sg: 4.65 }, { name: 'Hematite', sg: 5.15 }, { name: 'Cassiterite', sg: 6.95 },
  { name: 'Cerussite', sg: 6.55 }, { name: 'Silver (native)', sg: 10.5 }, { name: 'Gold (native)', sg: 19.3 },
];

function nearestSgMatches(sg) {
  if (!sg || isNaN(sg)) return [];
  return SG_REF
    .map(r => ({ ...r, diff: Math.abs(r.sg - sg) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)
    .filter(r => r.diff < 0.6);
}

// Typical longwave (365 nm) fluorescence responses — starting points,
// not guarantees; individual specimens vary widely
const UV_LW_REF = [
  { name: 'Ruby', response: 'Strong red (chromium glow)' },
  { name: 'Red Spinel', response: 'Red, often strong' },
  { name: 'Diamond', response: 'Variable — blue in roughly a third of stones' },
  { name: 'Fluorite', response: 'Strong blue-violet (the namesake)' },
  { name: 'Kunzite', response: 'Orange-pink' },
  { name: 'Sapphire (some Sri Lankan)', response: 'Orange to apricot' },
  { name: 'Amber', response: 'Blue-white to yellow-green' },
  { name: 'Opal (hyalite)', response: 'Green (uranyl)' },
  { name: 'Sodalite (hackmanite)', response: 'Orange, often tenebrescent' },
  { name: 'Scheelite', response: 'Blue-white (stronger under shortwave)' },
  { name: 'Calcite (manganoan)', response: 'Red to pink' },
  { name: 'Emerald', response: 'Usually inert; occasionally weak red' },
];

function SgTool() {
  const [dry, setDry] = useState('');
  const [water, setWater] = useState('');
  const sg = parseFloat(dry) / parseFloat(water);
  const valid = dry && water && !isNaN(sg) && isFinite(sg);
  const matches = valid ? nearestSgMatches(sg) : [];

  return (
    <div className="relative rounded-xl p-5 mb-6" style={frame}>
      <Corners />
      <p className="caption text-[11px] uppercase mb-3" style={{ color: T.gold }}>Specific Gravity — quick check</p>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <p className="caption text-[10px]" style={{ color: T.inkSoft, marginBottom: 4 }}>Dry weight (g)</p>
          <input
            value={dry}
            onChange={e => setDry(e.target.value)}
            placeholder="3.48"
            inputMode="decimal"
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={inputStyle}
          />
        </div>
        <p className="text-sm pb-2" style={{ color: T.inkFaint }}>÷</p>
        <div className="flex-1">
          <p className="caption text-[10px]" style={{ color: T.inkSoft, marginBottom: 4 }}>Water displacement (g)</p>
          <input
            value={water}
            onChange={e => setWater(e.target.value)}
            placeholder="0.49"
            inputMode="decimal"
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={inputStyle}
          />
        </div>
        <div className="pb-2 text-sm" style={{ color: T.inkFaint }}>=</div>
        <div className="pb-1 min-w-[60px]">
          <p className="text-xl" style={{ color: valid ? T.goldBright : T.inkFaint, fontWeight: 600 }}>
            {valid ? sg.toFixed(2) : '—'}
          </p>
        </div>
      </div>
      {valid && matches.length > 0 && (
        <p className="text-sm italic mt-3" style={{ color: T.inkSoft }}>
          Close to: {matches.map(m => `${m.name} (${m.sg})`).join(', ')}
        </p>
      )}
      {valid && matches.length === 0 && (
        <p className="text-sm italic mt-3" style={{ color: T.inkFaint }}>No close match in the reference table — worth double-checking the reading.</p>
      )}
    </div>
  );
}

function UvLongwavePanel() {
  return (
    <div className="relative rounded-xl p-5" style={frame}>
      <Corners />
      <p className="caption text-[11px] uppercase mb-1" style={{ color: T.gold }}>
        UV Fluorescence — Longwave (365 nm)
      </p>
      <p className="text-sm italic mb-4" style={{ color: T.inkSoft }}>
        Work in a dark room, hold the lamp a few inches from the stone, and never look into the beam.
        Typical responses below are starting points — individual specimens vary widely.
      </p>
      <div className="grid sm:grid-cols-2 gap-x-6">
        {UV_LW_REF.map(r => (
          <div key={r.name} className="flex items-baseline justify-between gap-3 py-1.5" style={{ borderBottom: `1px solid ${T.goldFaint}` }}>
            <span className="text-base shrink-0">{r.name}</span>
            <span className="text-sm italic text-right" style={{ color: T.inkSoft }}>{r.response}</span>
          </div>
        ))}
      </div>
      <p className="text-sm italic mt-4" style={{ color: T.inkFaint }}>
        Record what each of your stones actually does on its own page — Edit → UV Fluorescence.
        An inert result is data too: note it.
      </p>
    </div>
  );
}

export default function Gemology({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      {onBack && (
        <button onClick={onBack} className="caption flex items-center gap-1 text-[11px] uppercase mb-6" style={{ color: T.inkSoft }}>
          <ChevronLeft size={14} /> Ledger
        </button>
      )}

      <header className="text-center mb-8">
        <h1 className="masthead" style={{ fontSize: 'clamp(2.1rem, 5.5vw, 2.7rem)', lineHeight: 1.12 }}>Gemology Bench</h1>
        <Flourish width={200} />
        <p className="caption text-[11px] uppercase mt-1" style={{ color: T.inkSoft }}>tools of the trade — more soon</p>
      </header>

      <SgTool />
      <UvLongwavePanel />

      <div className="mt-12"><VineRule /></div>
    </div>
  );
}
