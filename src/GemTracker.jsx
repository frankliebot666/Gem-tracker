import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Camera, Trash2, Search, ChevronLeft, Palette } from 'lucide-react';
import PaletteSwatch from './PaletteSwatch.jsx';
import { T, frame, arch, inputStyle, baseCss, pageBackground, FONT_BODY, Flourish, VineRule } from './nouveau.jsx';

const MOHS_REF = [
  { n: 1, name: 'Talc' }, { n: 2, name: 'Gypsum' }, { n: 3, name: 'Calcite' },
  { n: 4, name: 'Fluorite' }, { n: 5, name: 'Apatite' }, { n: 6, name: 'Orthoclase' },
  { n: 7, name: 'Quartz' }, { n: 8, name: 'Topaz' }, { n: 9, name: 'Corundum' }, { n: 10, name: 'Diamond' }
];

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

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

const WHEEL_SIZE = 180;

function ColorWheel({ h, s, onPick }) {
  const canvasRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const size = WHEEL_SIZE;
    const cx = size / 2, cy = size / 2, r = size / 2;
    const imgData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * size + x) * 4;
        if (dist <= r) {
          let angle = Math.atan2(dy, dx) * 180 / Math.PI;
          angle = (angle + 90 + 360) % 360;
          const sat = Math.min(100, (dist / r) * 100);
          const hex = hslToHex(angle, sat, 50);
          imgData.data[idx] = parseInt(hex.slice(1, 3), 16);
          imgData.data[idx + 1] = parseInt(hex.slice(3, 5), 16);
          imgData.data[idx + 2] = parseInt(hex.slice(5, 7), 16);
          imgData.data[idx + 3] = 255;
        } else {
          imgData.data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);

  function pickAt(clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top;
    const cx = WHEEL_SIZE / 2, cy = WHEEL_SIZE / 2, r = WHEEL_SIZE / 2;
    const dx = x - cx, dy = y - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), r);
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle = (angle + 90 + 360) % 360;
    const sat = (dist / r) * 100;
    onPick(Math.round(angle), Math.round(sat));
  }

  function handleDown(e) {
    dragging.current = true;
    const p = e.touches ? e.touches[0] : e;
    pickAt(p.clientX, p.clientY);
  }
  function handleMove(e) {
    if (!dragging.current) return;
    const p = e.touches ? e.touches[0] : e;
    pickAt(p.clientX, p.clientY);
  }
  function handleUp() { dragging.current = false; }

  const angleRad = (h - 90) * Math.PI / 180;
  const r = WHEEL_SIZE / 2;
  const dotDist = (s / 100) * r;
  const dotX = r + Math.cos(angleRad) * dotDist;
  const dotY = r + Math.sin(angleRad) * dotDist;

  return (
    <div
      className="relative mx-auto touch-none select-none"
      style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
    >
      <canvas
        ref={canvasRef}
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        className="rounded-full cursor-crosshair"
        style={{ border: `1px solid ${T.goldLine}` }}
      />
      <div
        className="absolute w-4 h-4 rounded-full pointer-events-none"
        style={{
          left: dotX - 8, top: dotY - 8,
          border: `2px solid ${T.bg}`,
          boxShadow: '0 0 0 1px rgba(51,64,47,0.7), 0 1px 4px rgba(51,64,47,0.4)',
        }}
      />
    </div>
  );
}

function ColorWheelPopover({ hex, onChange, onClose }) {
  const [h, s, l] = hexToHsl(hex);
  return (
    <div
      className="absolute z-20 rounded-xl p-4"
      style={{
        ...frame,
        boxShadow: `inset 0 0 0 3px ${T.bg}, inset 0 0 0 4px ${T.goldSoft}, 0 10px 28px rgba(51,64,47,0.28)`,
        top: '48px', left: 0,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="caption text-[10px] uppercase" style={{ color: T.inkSoft }}>{hex.toUpperCase()}</p>
        <button onClick={onClose} style={{ color: T.inkSoft }}>
          <X size={14} />
        </button>
      </div>
      <ColorWheel h={h} s={s} onPick={(nh, ns) => onChange(hslToHex(nh, ns, l))} />
      <div className="mt-4">
        <div className="flex justify-between text-[10px] uppercase mb-1 caption" style={{ color: T.inkSoft }}>
          <span>Lightness</span><span>{l}%</span>
        </div>
        <input
          type="range" min="2" max="98" value={l}
          onChange={e => onChange(hslToHex(h, s, +e.target.value))}
          className="w-full"
          style={{ background: `linear-gradient(to right, #000, ${hslToHex(h, s, 50)}, #fff)` }}
        />
      </div>
    </div>
  );
}

function SgTool() {
  const [dry, setDry] = useState('');
  const [water, setWater] = useState('');
  const sg = parseFloat(dry) / parseFloat(water);
  const valid = dry && water && !isNaN(sg) && isFinite(sg);
  const matches = valid ? nearestSgMatches(sg) : [];

  return (
    <div className="rounded-xl p-4 mb-8" style={frame}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
        <p className="caption text-[11px] uppercase" style={{ color: T.gold }}>Specific Gravity — quick check</p>
        <p className="caption text-[10px]" style={{ color: T.inkFaint }}>more gemology tools soon</p>
      </div>
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
          <p className="text-xl" style={{ color: valid ? T.gold : T.inkFaint, fontWeight: 600 }}>
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

function HardnessScale({ value, onChange, editable }) {
  return (
    <div className="flex items-center gap-[3px]">
      {MOHS_REF.map(m => (
        <button
          key={m.n}
          type="button"
          disabled={!editable}
          onClick={() => onChange && onChange(m.n)}
          title={`${m.n} — ${m.name}`}
          className={`h-4 flex-1 transition-colors ${editable ? 'cursor-pointer' : 'cursor-default'}`}
          style={{
            background: value && m.n <= value ? T.gold : T.goldFaint,
            border: `1px solid ${value && m.n <= value ? T.gold : T.goldSoft}`,
            borderRadius: m.n === 1 ? '99px 2px 2px 99px' : m.n === 10 ? '2px 99px 99px 2px' : '2px',
          }}
        />
      ))}
    </div>
  );
}

function ColorCircles({ colors, onChange }) {
  const [openIdx, setOpenIdx] = useState(null);

  function updateAt(i, hex) {
    onChange(colors.map((c, idx) => idx === i ? hex : c));
  }
  function addColor() {
    if (colors.length >= 6) return;
    onChange([...colors, '#B08D57']);
    setOpenIdx(colors.length);
  }
  function removeAt(i) {
    if (colors.length <= 1) return;
    onChange(colors.filter((_, idx) => idx !== i));
    setOpenIdx(null);
  }

  return (
    <div className="flex flex-wrap items-start gap-3" style={{ position: 'relative' }}>
      {colors.map((c, i) => (
        <div key={i} className="relative">
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-10 h-10 rounded-full"
            style={{
              background: c,
              border: openIdx === i ? `2px solid ${T.gold}` : `2px solid ${T.goldLine}`,
              boxShadow: `0 0 0 2px ${T.bg}, 0 0 0 3px ${T.goldSoft}`,
            }}
            title="Tap to change color"
          />
          {colors.length > 1 && (
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: T.bg, border: `1px solid ${T.goldLine}`, color: T.ink }}
            >
              <X size={9} />
            </button>
          )}
          {openIdx === i && (
            <ColorWheelPopover
              hex={c}
              onChange={hex => updateAt(i, hex)}
              onClose={() => setOpenIdx(null)}
            />
          )}
        </div>
      ))}
      {colors.length < 6 && (
        <button
          type="button"
          onClick={addColor}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ border: `1px dashed ${T.goldLine}`, color: T.inkSoft }}
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}

const emptyGem = () => ({
  id: 'gem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
  name: '',
  species: '',
  mohs: 7,
  colors: ['#3C6E8F'],
  cut: '',
  weightCt: '',
  dims: '',
  origin: '',
  acquired: '',
  notes: '',
  photos: [],
  createdAt: new Date().toISOString(),
});

export default function GemTracker() {
  const [gems, setGems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('grid'); // grid | detail | edit | palette
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gems');
      if (raw) setGems(JSON.parse(raw));
    } catch (e) {
      // no existing data yet — that's fine
    }
    setLoaded(true);
  }, []);

  async function persist(next) {
    setGems(next);
    try {
      localStorage.setItem('gems', JSON.stringify(next));
      setError('');
    } catch (e) {
      setError('Could not save — your browser storage may be full or restricted.');
    }
  }

  function startNew() {
    setDraft(emptyGem());
    setView('edit');
  }

  function startEdit(gem) {
    setDraft({ ...gem });
    setView('edit');
  }

  function openDetail(id) {
    setActiveId(id);
    setView('detail');
  }

  async function saveDraft() {
    if (!draft.name.trim()) { setError('Give it a name before saving.'); return; }
    const exists = gems.some(g => g.id === draft.id);
    const next = exists ? gems.map(g => g.id === draft.id ? draft : g) : [draft, ...gems];
    await persist(next);
    setActiveId(draft.id);
    setView('detail');
  }

  async function deleteGem(id) {
    const next = gems.filter(g => g.id !== id);
    await persist(next);
    setView('grid');
  }

  function handlePhoto(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    const oversized = files.some(f => f.size > 3.5 * 1024 * 1024);
    if (oversized) {
      setError('One or more photos too large — try smaller images.');
    }
    files.filter(f => f.size <= 3.5 * 1024 * 1024).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setDraft(d => ({ ...d, photos: [...(d.photos || []), reader.result] }));
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removePhotoAt(i) {
    setDraft(d => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }));
  }

  const activeGem = gems.find(g => g.id === activeId);
  const filtered = gems.filter(g => {
    const q = query.toLowerCase();
    if (!q) return true;
    return [g.name, g.species, g.origin, g.notes].join(' ').toLowerCase().includes(q);
  });

  const label = "caption block text-[11px] uppercase mb-1.5";
  const labelStyle = { color: T.gold };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: pageBackground,
        color: T.ink,
        fontFamily: FONT_BODY,
        fontSize: '17px',
      }}
    >
      <style>{baseCss}</style>

      {!loaded ? (
        <div className="p-8 text-center italic" style={{ color: T.inkSoft }}>unfurling the ledger…</div>
      ) : view === 'palette' ? (
        <PaletteSwatch onBack={() => setView('grid')} />
      ) : view === 'grid' ? (
        <div className="max-w-5xl mx-auto px-5 py-10">
          <header className="text-center mb-8">
            <p className="caption text-[11px] uppercase" style={{ color: T.gold }}>A Collection of Curious Stones</p>
            <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 6vw, 3rem)', lineHeight: 1.15, margin: '2px 0 4px' }}>
              Specimen Ledger
            </h1>
            <Flourish />
            <p className="caption text-[11px] uppercase mt-1" style={{ color: T.inkSoft }}>
              {gems.length} stone{gems.length === 1 ? '' : 's'} inscribed herein
            </p>
            <button
              onClick={() => setView('palette')}
              className="caption inline-flex items-center gap-1.5 text-[11px] uppercase mt-3 underline"
              style={{ color: T.peacock, textUnderlineOffset: 3 }}
            >
              <Palette size={13} /> Palette Swatch
            </button>
          </header>

          <div className="flex items-center gap-3 mb-6">
            {gems.length > 0 ? (
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.inkFaint }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name, species, origin…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm"
                  style={inputStyle}
                />
              </div>
            ) : <div className="flex-1" />}
            <button
              onClick={startNew}
              className="caption flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] uppercase shrink-0"
              style={{ background: T.gold, color: T.bg, border: `1px solid ${T.gold}`, boxShadow: `0 0 0 2px ${T.bg}, 0 0 0 3px ${T.goldSoft}` }}
            >
              <Plus size={15} /> New entry
            </button>
          </div>

          {error && <div className="mb-4 text-sm italic" style={{ color: T.red }}>{error}</div>}

          <SgTool />

          {gems.length === 0 ? (
            <div
              className="rounded-xl p-12 text-center mt-4"
              style={{ border: `1px dashed ${T.goldLine}` }}
            >
              <Flourish width={180} />
              <p className="italic my-4" style={{ color: T.inkSoft }}>No stones catalogued yet.</p>
              <button onClick={startNew} className="caption text-[12px] uppercase underline" style={{ color: T.gold }}>
                Log your first specimen
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="italic mt-8 text-center" style={{ color: T.inkSoft }}>No matches for “{query}”.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filtered.map(g => (
                <button
                  key={g.id}
                  onClick={() => openDetail(g.id)}
                  className="text-left rounded-xl group p-2"
                  style={frame}
                >
                  <div
                    className="h-32 flex items-center justify-center relative overflow-hidden"
                    style={{
                      ...arch,
                      border: `1px solid ${T.goldLine}`,
                      background: (g.photos && g.photos.length) ? '#141410' : T.goldFaint,
                    }}
                  >
                    {(g.photos && g.photos.length) ? (
                      <img src={g.photos[0]} alt={g.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="flex gap-1.5">
                        {(g.colors || ['#3C6E8F']).slice(0, 3).map((c, i) => (
                          <div key={i} className="w-6 h-6 rounded-full" style={{ background: c, border: `1px solid ${T.goldLine}` }} />
                        ))}
                      </div>
                    )}
                    {g.photos && g.photos.length > 1 && (
                      <span
                        className="caption absolute bottom-1.5 right-3 px-2 py-0.5 rounded-full text-[10px]"
                        style={{ background: 'rgba(51,64,47,0.65)', color: T.bg }}
                      >
                        {g.photos.length}
                      </span>
                    )}
                  </div>
                  <div className="px-2 pt-3 pb-2 text-center">
                    <p className="display truncate" style={{ fontSize: '18px' }}>{g.name || 'Untitled'}</p>
                    <p className="caption text-[10px] uppercase mt-0.5 truncate" style={{ color: T.inkSoft }}>{g.species || '—'}</p>
                    <div className="mt-2.5">
                      <HardnessScale value={g.mohs} editable={false} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-12"><VineRule /></div>
        </div>
      ) : view === 'detail' && activeGem ? (
        <div className="max-w-2xl mx-auto px-5 py-10">
          <button onClick={() => setView('grid')} className="caption flex items-center gap-1 text-[11px] uppercase mb-6" style={{ color: T.inkSoft }}>
            <ChevronLeft size={14} /> Ledger
          </button>

          {(activeGem.photos && activeGem.photos.length) ? (
            <div className="mb-6">
              <div className="overflow-hidden p-2 rounded-xl" style={frame}>
                <img src={activeGem.photos[0]} alt={activeGem.name} className="w-full h-64 object-cover" style={arch} />
              </div>
              {activeGem.photos.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {activeGem.photos.slice(1).map((p, i) => (
                    <img key={i} src={p} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" style={{ border: `1px solid ${T.goldLine}` }} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden mb-6 p-2" style={frame}>
              <div className="w-full h-40 flex items-center justify-center gap-2" style={{ ...arch, background: T.goldFaint, border: `1px solid ${T.goldLine}` }}>
                {(activeGem.colors || ['#3C6E8F']).map((c, i) => (
                  <div key={i} className="w-12 h-12 rounded-full" style={{ background: c, border: `1px solid ${T.goldLine}` }} />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-1">
            <h2 className="display" style={{ fontSize: '2.2rem', lineHeight: 1.15 }}>{activeGem.name || 'Untitled'}</h2>
            {activeGem.species && <p className="italic mt-1" style={{ color: T.inkSoft }}>{activeGem.species}</p>}
            <div className="flex justify-center -space-x-1.5 mt-3">
              {(activeGem.colors || ['#3C6E8F']).map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full" style={{ background: c, border: `1.5px solid ${T.bg}`, boxShadow: `0 0 0 1px ${T.goldLine}` }} />
              ))}
            </div>
            <div className="mt-2 flex justify-center"><Flourish width={200} /></div>
          </div>

          <div className="mb-6 mt-5">
            <p style={labelStyle} className={label}>Hardness</p>
            <HardnessScale value={activeGem.mohs} editable={false} />
            <p className="text-sm italic mt-1.5" style={{ color: T.inkSoft }}>{activeGem.mohs} — {MOHS_REF.find(m => m.n === activeGem.mohs)?.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {activeGem.cut && <div><p style={labelStyle} className={label}>Cut / Form</p><p className="text-base">{activeGem.cut}</p></div>}
            {activeGem.weightCt && <div><p style={labelStyle} className={label}>Weight</p><p className="text-base">{activeGem.weightCt} ct</p></div>}
            {activeGem.dims && <div><p style={labelStyle} className={label}>Measurements</p><p className="text-base">{activeGem.dims}</p></div>}
            {activeGem.origin && <div><p style={labelStyle} className={label}>Origin</p><p className="text-base">{activeGem.origin}</p></div>}
            {activeGem.acquired && <div><p style={labelStyle} className={label}>Acquired</p><p className="text-base">{activeGem.acquired}</p></div>}
          </div>

          {activeGem.notes && (
            <div className="mb-8">
              <p style={labelStyle} className={label}>Notes</p>
              <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(51,64,47,0.9)' }}>{activeGem.notes}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => startEdit(activeGem)}
              className="caption flex-1 py-2.5 rounded-full text-[12px] uppercase"
              style={{ background: T.goldFaint, border: `1px solid ${T.goldLine}`, color: T.ink }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteGem(activeGem.id)}
              className="caption px-5 py-2.5 rounded-full text-[12px] uppercase flex items-center gap-2"
              style={{ background: 'rgba(154,59,46,0.10)', color: T.red, border: '1px solid rgba(154,59,46,0.35)' }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ) : view === 'edit' && draft ? (
        <div className="max-w-2xl mx-auto px-5 py-10">
          <button
            onClick={() => setView(gems.some(g => g.id === draft.id) ? 'detail' : 'grid')}
            className="caption flex items-center gap-1 text-[11px] uppercase mb-6"
            style={{ color: T.inkSoft }}
          >
            <ChevronLeft size={14} /> Cancel
          </button>

          <h2 className="display mb-1" style={{ fontSize: '1.9rem' }}>{gems.some(g => g.id === draft.id) ? 'Edit specimen' : 'New specimen'}</h2>
          <div className="mb-6"><Flourish width={180} /></div>

          {error && <div className="mb-4 text-sm italic" style={{ color: T.red }}>{error}</div>}

          <div className="mb-5">
            <input
              type="file"
              id="gem-photo-input"
              accept="image/*"
              multiple
              onChange={handlePhoto}
              style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}
            />
            <div className="grid grid-cols-3 gap-2">
              {(draft.photos || []).map((p, i) => (
                <div key={i} className="relative overflow-hidden" style={{ aspectRatio: '1', ...arch, border: `1px solid ${T.goldLine}` }}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhotoAt(i)}
                    className="absolute top-2 right-1/2 translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(51,64,47,0.6)', color: T.bg }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <label
                htmlFor="gem-photo-input"
                className="flex flex-col items-center justify-center cursor-pointer"
                style={{ aspectRatio: '1', ...arch, background: T.goldFaint, border: `1px dashed ${T.goldLine}` }}
              >
                <Camera size={18} className="mb-1" style={{ color: T.inkSoft }} />
                <p className="caption text-[10px] uppercase" style={{ color: T.inkSoft }}>Add photo</p>
              </label>
            </div>
            {(draft.photos || []).length > 0 && (
              <p className="text-sm italic mt-2" style={{ color: T.inkFaint }}>{draft.photos.length} photo{draft.photos.length === 1 ? '' : 's'} — first one is used as the cover</p>
            )}
          </div>

          <div className="mb-4">
            <p style={labelStyle} className={label}>Name *</p>
            <input
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Blue Ceylon Sapphire"
              className="w-full px-3 py-2.5 rounded-lg text-base"
              style={inputStyle}
            />
          </div>

          <div className="mb-5">
            <p style={labelStyle} className={label}>Species / Variety</p>
            <input
              value={draft.species}
              onChange={e => setDraft(d => ({ ...d, species: e.target.value }))}
              placeholder="e.g. Corundum"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <div className="mb-5">
            <p style={labelStyle} className={label}>Mohs hardness — {draft.mohs} ({MOHS_REF.find(m => m.n === draft.mohs)?.name})</p>
            <HardnessScale value={draft.mohs} editable onChange={v => setDraft(d => ({ ...d, mohs: v }))} />
          </div>

          <div className="mb-5">
            <p style={labelStyle} className={label}>Color</p>
            <ColorCircles colors={draft.colors || ['#3C6E8F']} onChange={cs => setDraft(d => ({ ...d, colors: cs }))} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p style={labelStyle} className={label}>Cut / Form</p>
              <input value={draft.cut} onChange={e => setDraft(d => ({ ...d, cut: e.target.value }))}
                placeholder="Round brilliant" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div>
              <p style={labelStyle} className={label}>Weight (ct)</p>
              <input value={draft.weightCt} onChange={e => setDraft(d => ({ ...d, weightCt: e.target.value }))}
                placeholder="1.20" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="mb-5">
            <p style={labelStyle} className={label}>Measurements</p>
            <input value={draft.dims} onChange={e => setDraft(d => ({ ...d, dims: e.target.value }))}
              placeholder="6.5 x 4.8 x 3.1 mm" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p style={labelStyle} className={label}>Origin (believed)</p>
              <input value={draft.origin} onChange={e => setDraft(d => ({ ...d, origin: e.target.value }))}
                placeholder="Sri Lanka" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div>
              <p style={labelStyle} className={label}>Acquired</p>
              <input value={draft.acquired} onChange={e => setDraft(d => ({ ...d, acquired: e.target.value }))}
                placeholder="July 2026" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="mb-7">
            <p style={labelStyle} className={label}>Notes</p>
            <textarea
              value={draft.notes}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              placeholder="Inclusions, treatment, provenance, setting plans…"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg text-sm leading-relaxed"
              style={inputStyle}
            />
          </div>

          <button
            onClick={saveDraft}
            className="caption w-full py-3 rounded-full text-[13px] uppercase"
            style={{ background: T.gold, color: T.bg, boxShadow: `0 0 0 2px ${T.bg}, 0 0 0 3px ${T.goldSoft}` }}
          >
            Save specimen
          </button>
        </div>
      ) : null}
    </div>
  );
}
