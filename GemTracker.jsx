import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Camera, Trash2, Search, ChevronLeft, Image as ImageIcon } from 'lucide-react';

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
        style={{ border: '1px solid rgba(242,237,228,0.15)' }}
      />
      <div
        className="absolute w-4 h-4 rounded-full pointer-events-none"
        style={{
          left: dotX - 8, top: dotY - 8,
          border: '2px solid #F2EDE4',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}

function ColorWheelPopover({ hex, onChange, onClose }) {
  const [h, s, l] = hexToHsl(hex);
  return (
    <div
      className="absolute z-20 rounded-lg p-4"
      style={{ background: '#1C1B1A', border: '1px solid rgba(176,141,87,0.4)', top: '48px', left: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="mono text-[10px] uppercase tracking-wide opacity-60">{hex.toUpperCase()}</p>
        <button onClick={onClose} className="mono text-[10px] opacity-60">
          <X size={14} />
        </button>
      </div>
      <ColorWheel h={h} s={s} onPick={(nh, ns) => onChange(hslToHex(nh, ns, l))} />
      <div className="mt-4">
        <div className="flex justify-between text-[10px] uppercase tracking-wide opacity-50 mb-1 mono">
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
    <div className="rounded-lg p-4 mb-6" style={{ background: 'rgba(176,141,87,0.06)', border: '1px solid rgba(176,141,87,0.25)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="mono text-[11px] uppercase tracking-wider" style={{ color: '#B08D57' }}>Specific Gravity — quick check</p>
        <p className="mono text-[10px] opacity-40">more gemology tools soon</p>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <p className="mono text-[10px] opacity-50 mb-1">Dry weight (g)</p>
          <input
            value={dry}
            onChange={e => setDry(e.target.value)}
            placeholder="3.48"
            inputMode="decimal"
            className="w-full px-3 py-2 rounded text-sm mono"
            style={{ background: 'rgba(242,237,228,0.06)', border: '1px solid rgba(242,237,228,0.15)', color: '#F2EDE4' }}
          />
        </div>
        <p className="mono text-sm opacity-40 pb-2">÷</p>
        <div className="flex-1">
          <p className="mono text-[10px] opacity-50 mb-1">Water displacement (g)</p>
          <input
            value={water}
            onChange={e => setWater(e.target.value)}
            placeholder="0.49"
            inputMode="decimal"
            className="w-full px-3 py-2 rounded text-sm mono"
            style={{ background: 'rgba(242,237,228,0.06)', border: '1px solid rgba(242,237,228,0.15)', color: '#F2EDE4' }}
          />
        </div>
        <div className="pb-2 mono text-sm opacity-40">=</div>
        <div className="pb-1 min-w-[60px]">
          <p className="mono text-lg" style={{ color: valid ? '#B08D57' : 'rgba(242,237,228,0.3)' }}>
            {valid ? sg.toFixed(2) : '—'}
          </p>
        </div>
      </div>
      {valid && matches.length > 0 && (
        <p className="mono text-xs opacity-60 mt-3">
          Close to: {matches.map(m => `${m.name} (${m.sg})`).join(', ')}
        </p>
      )}
      {valid && matches.length === 0 && (
        <p className="mono text-xs opacity-40 mt-3">No close match in the reference table — worth double-checking the reading.</p>
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
          className={`h-4 flex-1 rounded-[2px] transition-colors ${editable ? 'cursor-pointer' : 'cursor-default'}`}
          style={{
            background: value && m.n <= value ? '#B08D57' : 'rgba(242,237,228,0.12)',
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
            style={{ background: c, border: openIdx === i ? '2px solid #B08D57' : '2px solid rgba(242,237,228,0.25)' }}
            title="Tap to change color"
          />
          {colors.length > 1 && (
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: '#1C1B1A', border: '1px solid rgba(242,237,228,0.3)' }}
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
          style={{ border: '1px dashed rgba(242,237,228,0.3)' }}
        >
          <Plus size={16} className="opacity-60" />
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
  const [view, setView] = useState('grid'); // grid | detail | edit
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

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

  const label = "block text-[11px] uppercase tracking-wider mb-1.5";
  const labelStyle = { color: '#B08D57', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em' };
  const inputStyle = {
    background: 'rgba(242,237,228,0.06)',
    border: '1px solid rgba(242,237,228,0.15)',
    color: '#F2EDE4',
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: '#1C1B1A', color: '#F2EDE4', fontFamily: 'Georgia, "Source Serif Pro", serif' }}
    >
      <style>{`
        input, textarea { outline: none; }
        input:focus, textarea:focus, button:focus-visible { box-shadow: 0 0 0 2px #B08D57; }
        ::placeholder { color: rgba(242,237,228,0.35); }
        .mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {!loaded ? (
        <div className="p-8 text-center opacity-60 mono text-sm">loading specimens…</div>
      ) : view === 'grid' ? (
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl" style={{ letterSpacing: '0.01em' }}>Specimen Ledger</h1>
              <p className="mono text-xs mt-1 opacity-50">{gems.length} stone{gems.length === 1 ? '' : 's'} logged</p>
            </div>
            <button
              onClick={startNew}
              className="flex items-center gap-2 px-4 py-2.5 rounded mono text-sm shrink-0"
              style={{ background: '#B08D57', color: '#1C1B1A' }}
            >
              <Plus size={16} /> New entry
            </button>
          </div>

          {gems.length > 0 && (
            <div className="relative mb-6">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, species, origin…"
                className="w-full pl-9 pr-3 py-2.5 rounded text-sm mono"
                style={inputStyle}
              />
            </div>
          )}

          {error && <div className="mb-4 text-xs mono" style={{ color: '#C0392B' }}>{error}</div>}

          <SgTool />

          {gems.length === 0 ? (
            <div
              className="rounded-lg p-12 text-center mt-4"
              style={{ border: '1px dashed rgba(242,237,228,0.2)' }}
            >
              <p className="opacity-60 mb-4">No stones catalogued yet.</p>
              <button onClick={startNew} className="mono text-sm underline" style={{ color: '#B08D57' }}>
                Log your first specimen
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="opacity-50 text-sm mono mt-8">No matches for "{query}".</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map(g => (
                <button
                  key={g.id}
                  onClick={() => openDetail(g.id)}
                  className="text-left rounded-lg overflow-hidden group"
                  style={{ background: 'rgba(242,237,228,0.04)', border: '1px solid rgba(242,237,228,0.1)' }}
                >
                  <div
                    className="h-28 flex items-center justify-center relative overflow-hidden"
                    style={{ background: (g.photos && g.photos.length) ? '#000' : 'rgba(242,237,228,0.03)' }}
                  >
                    {(g.photos && g.photos.length) ? (
                      <img src={g.photos[0]} alt={g.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="flex gap-1">
                        {(g.colors || ['#3C6E8F']).slice(0, 3).map((c, i) => (
                          <div key={i} className="w-6 h-6 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                    )}
                    {g.photos && g.photos.length > 1 && (
                      <span
                        className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded mono text-[10px]"
                        style={{ background: 'rgba(0,0,0,0.6)', color: '#F2EDE4' }}
                      >
                        {g.photos.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate" style={{ fontSize: '15px' }}>{g.name || 'Untitled'}</p>
                    <p className="mono text-[10px] opacity-50 mt-0.5 truncate">{g.species || '—'}</p>
                    <div className="mt-2">
                      <HardnessScale value={g.mohs} editable={false} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : view === 'detail' && activeGem ? (
        <div className="max-w-2xl mx-auto px-5 py-8">
          <button onClick={() => setView('grid')} className="flex items-center gap-1 mono text-xs opacity-60 mb-6">
            <ChevronLeft size={14} /> Ledger
          </button>

          {(activeGem.photos && activeGem.photos.length) ? (
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(242,237,228,0.1)' }}>
                <img src={activeGem.photos[0]} alt={activeGem.name} className="w-full h-64 object-cover" />
              </div>
              {activeGem.photos.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {activeGem.photos.slice(1).map((p, i) => (
                    <img key={i} src={p} alt="" className="w-16 h-16 object-cover rounded shrink-0" style={{ border: '1px solid rgba(242,237,228,0.15)' }} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden mb-6" style={{ border: '1px solid rgba(242,237,228,0.1)' }}>
              <div className="w-full h-40 flex items-center justify-center gap-2" style={{ background: 'rgba(242,237,228,0.03)' }}>
                {(activeGem.colors || ['#3C6E8F']).map((c, i) => (
                  <div key={i} className="w-12 h-12 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start justify-between mb-1">
            <h2 className="text-3xl">{activeGem.name || 'Untitled'}</h2>
            <div className="flex -space-x-1.5 shrink-0 mt-2">
              {(activeGem.colors || ['#3C6E8F']).map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full" style={{ background: c, border: '1px solid rgba(242,237,228,0.3)' }} />
              ))}
            </div>
          </div>
          {activeGem.species && <p className="mono text-sm opacity-50 italic mb-5">{activeGem.species}</p>}

          <div className="mb-6">
            <p style={labelStyle} className={label}>Hardness</p>
            <HardnessScale value={activeGem.mohs} editable={false} />
            <p className="mono text-xs opacity-50 mt-1.5">{activeGem.mohs} — {MOHS_REF.find(m => m.n === activeGem.mohs)?.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {activeGem.cut && <div><p style={labelStyle} className={label}>Cut / Form</p><p className="text-sm">{activeGem.cut}</p></div>}
            {activeGem.weightCt && <div><p style={labelStyle} className={label}>Weight</p><p className="text-sm mono">{activeGem.weightCt} ct</p></div>}
            {activeGem.dims && <div><p style={labelStyle} className={label}>Measurements</p><p className="text-sm mono">{activeGem.dims}</p></div>}
            {activeGem.origin && <div><p style={labelStyle} className={label}>Origin</p><p className="text-sm">{activeGem.origin}</p></div>}
            {activeGem.acquired && <div><p style={labelStyle} className={label}>Acquired</p><p className="text-sm mono">{activeGem.acquired}</p></div>}
          </div>

          {activeGem.notes && (
            <div className="mb-8">
              <p style={labelStyle} className={label}>Notes</p>
              <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">{activeGem.notes}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => startEdit(activeGem)}
              className="flex-1 py-2.5 rounded mono text-sm"
              style={{ background: 'rgba(242,237,228,0.08)', border: '1px solid rgba(242,237,228,0.2)' }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteGem(activeGem.id)}
              className="px-4 py-2.5 rounded mono text-sm flex items-center gap-2"
              style={{ background: 'rgba(192,57,43,0.15)', color: '#E08A7D', border: '1px solid rgba(192,57,43,0.3)' }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ) : view === 'edit' && draft ? (
        <div className="max-w-2xl mx-auto px-5 py-8">
          <button
            onClick={() => setView(gems.some(g => g.id === draft.id) ? 'detail' : 'grid')}
            className="flex items-center gap-1 mono text-xs opacity-60 mb-6"
          >
            <ChevronLeft size={14} /> Cancel
          </button>

          <h2 className="text-2xl mb-6">{gems.some(g => g.id === draft.id) ? 'Edit specimen' : 'New specimen'}</h2>

          {error && <div className="mb-4 text-xs mono" style={{ color: '#C0392B' }}>{error}</div>}

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
                <div key={i} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '1', border: '1px solid rgba(242,237,228,0.15)' }}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhotoAt(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.55)', color: '#F2EDE4' }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <label
                htmlFor="gem-photo-input"
                className="rounded-lg flex flex-col items-center justify-center cursor-pointer"
                style={{ aspectRatio: '1', background: 'rgba(242,237,228,0.04)', border: '1px dashed rgba(242,237,228,0.25)' }}
              >
                <Camera size={18} className="opacity-50 mb-1" />
                <p className="mono text-[10px] opacity-50">Add photo</p>
              </label>
            </div>
            {(draft.photos || []).length > 0 && (
              <p className="mono text-[10px] opacity-40 mt-2">{draft.photos.length} photo{draft.photos.length === 1 ? '' : 's'} — first one is used as the cover</p>
            )}
          </div>

          <div className="mb-4">
            <p style={labelStyle} className={label}>Name *</p>
            <input
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Blue Ceylon Sapphire"
              className="w-full px-3 py-2.5 rounded text-base"
              style={inputStyle}
            />
          </div>

          <div className="mb-5">
            <p style={labelStyle} className={label}>Species / Variety</p>
            <input
              value={draft.species}
              onChange={e => setDraft(d => ({ ...d, species: e.target.value }))}
              placeholder="e.g. Corundum"
              className="w-full px-3 py-2.5 rounded text-sm"
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
                placeholder="Round brilliant" className="w-full px-3 py-2.5 rounded text-sm" style={inputStyle} />
            </div>
            <div>
              <p style={labelStyle} className={label}>Weight (ct)</p>
              <input value={draft.weightCt} onChange={e => setDraft(d => ({ ...d, weightCt: e.target.value }))}
                placeholder="1.20" className="w-full px-3 py-2.5 rounded text-sm mono" style={inputStyle} />
            </div>
          </div>

          <div className="mb-5">
            <p style={labelStyle} className={label}>Measurements</p>
            <input value={draft.dims} onChange={e => setDraft(d => ({ ...d, dims: e.target.value }))}
              placeholder="6.5 x 4.8 x 3.1 mm" className="w-full px-3 py-2.5 rounded text-sm mono" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p style={labelStyle} className={label}>Origin (believed)</p>
              <input value={draft.origin} onChange={e => setDraft(d => ({ ...d, origin: e.target.value }))}
                placeholder="Sri Lanka" className="w-full px-3 py-2.5 rounded text-sm" style={inputStyle} />
            </div>
            <div>
              <p style={labelStyle} className={label}>Acquired</p>
              <input value={draft.acquired} onChange={e => setDraft(d => ({ ...d, acquired: e.target.value }))}
                placeholder="July 2026" className="w-full px-3 py-2.5 rounded text-sm mono" style={inputStyle} />
            </div>
          </div>

          <div className="mb-7">
            <p style={labelStyle} className={label}>Notes</p>
            <textarea
              value={draft.notes}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              placeholder="Inclusions, treatment, provenance, setting plans…"
              rows={4}
              className="w-full px-3 py-2.5 rounded text-sm leading-relaxed"
              style={inputStyle}
            />
          </div>

          <button
            onClick={saveDraft}
            className="w-full py-3 rounded mono text-sm"
            style={{ background: '#B08D57', color: '#1C1B1A' }}
          >
            Save specimen
          </button>
        </div>
      ) : null}
    </div>
  );
}
