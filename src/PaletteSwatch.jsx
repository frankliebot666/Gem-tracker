import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Shuffle, Plus, X, Pipette, Upload, ChevronLeft, Lock } from 'lucide-react';
import { T, frame, inputStyle, Flourish, VineRule } from './nouveau.jsx';

function extractPaletteFromImage(img, count) {
  const canvas = document.createElement('canvas');
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = {};
  const step = 24;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue;
    const r = Math.round(data[i] / step) * step;
    const g = Math.round(data[i + 1] / step) * step;
    const b = Math.round(data[i + 2] / step) * step;
    const key = `${r},${g},${b}`;
    if (!buckets[key]) buckets[key] = { r, g, b, count: 0 };
    buckets[key].count++;
  }

  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);

  // greedily pick visually distinct colors from the most frequent buckets
  const picked = [];
  const minDist = 40;
  for (const c of sorted) {
    if (picked.length >= count) break;
    const tooClose = picked.some(p => {
      const dr = p.r - c.r, dg = p.g - c.g, db = p.b - c.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < minDist;
    });
    if (!tooClose) picked.push(c);
  }
  while (picked.length < count && sorted.length > 0) {
    picked.push(sorted[picked.length % sorted.length]);
  }

  const toHex = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return picked.slice(0, count).map(c => `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`);
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

const START = ['#0B211F', '#1B4B4A', '#2E7D7A', '#3D5A6C', '#D8E8E0'];
const WHEEL_SIZE = 220;

function ColorWheel({ h, s, onPick }) {
  const canvasRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    const cv = canvasRef.current;
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
          border: `2px solid ${T.ink}`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}

export default function PaletteSwatch({ onBack }) {
  const [colors, setColors] = useState(START);
  const [copied, setCopied] = useState(null);
  const [locked, setLocked] = useState({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [sourceImage, setSourceImage] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [currentPaletteId, setCurrentPaletteId] = useState(null);
  const nativeRefs = useRef({});
  const photoInputRef = useRef(null);
  const eyedropperSupported = typeof window !== 'undefined' && !!window.EyeDropper;

  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedPalettes');
      if (raw) setSavedPalettes(JSON.parse(raw));
    } catch (e) {
      // no saved palettes yet
    }
  }, []);

  function persistPalettes(next) {
    setSavedPalettes(next);
    try {
      localStorage.setItem('savedPalettes', JSON.stringify(next));
    } catch (e) {
      // storage unavailable — fails silently, palette still usable this session
    }
  }

  function saveCurrentPalette() {
    const name = saveName.trim() || `Palette ${savedPalettes.length + 1}`;
    if (currentPaletteId) {
      const next = savedPalettes.map(p => p.id === currentPaletteId ? { ...p, name, colors } : p);
      persistPalettes(next);
    } else {
      const id = 'pal_' + Date.now();
      const next = [...savedPalettes, { id, name, colors }];
      persistPalettes(next);
      setCurrentPaletteId(id);
    }
    setSaveName('');
    setShowSaveInput(false);
  }

  function loadPalette(p) {
    setColors(p.colors);
    setCurrentPaletteId(p.id);
    setActiveIdx(0);
    setLocked({});
  }

  function deletePalette(id) {
    persistPalettes(savedPalettes.filter(p => p.id !== id));
    if (currentPaletteId === id) setCurrentPaletteId(null);
  }

  function startNewPalette() {
    setCurrentPaletteId(null);
    setSaveName('');
  }

  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSourceImage(reader.result);
      setExtracting(true);
      const img = new Image();
      img.onload = () => {
        const extracted = extractPaletteFromImage(img, colors.length);
        setColors(cs => cs.map((c, i) => locked[i] ? c : (extracted[i] || c)));
        setExtracting(false);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const activeHex = colors[activeIdx] || colors[0];
  const [h, s, l] = hexToHsl(activeHex);

  function setColorAt(i, newHex) {
    setColors(cs => cs.map((c, idx) => idx === i ? newHex : c));
  }

  function setActiveColor(newHex) {
    setColorAt(activeIdx, newHex);
  }

  async function useEyedropperAt(i) {
    if (!window.EyeDropper) {
      nativeRefs.current[i] && nativeRefs.current[i].click();
      return;
    }
    try {
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      if (result && result.sRGBHex) setColorAt(i, result.sRGBHex);
    } catch (e) {
      // user cancelled — no-op
    }
  }

  function updateFromWheel(newH, newS) {
    setActiveColor(hslToHex(newH, newS, l));
  }

  function updateLightness(newL) {
    setActiveColor(hslToHex(h, s, newL));
  }

  function randomize() {
    setColors(cs => cs.map((c, i) => {
      if (locked[i]) return c;
      const rh = Math.floor(Math.random() * 360);
      const rs = 35 + Math.floor(Math.random() * 45);
      const rl = 20 + Math.floor(Math.random() * 45);
      return hslToHex(rh, rs, rl);
    }));
  }

  function copyHex(hex, i) {
    if (navigator.clipboard) navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 1200);
  }

  function addSwatch() {
    if (colors.length >= 8) return;
    setColors(cs => [...cs, '#888888']);
  }

  function removeSwatch(i) {
    if (colors.length <= 2) return;
    setColors(cs => cs.filter((_, idx) => idx !== i));
    setActiveIdx(idx => idx >= colors.length - 1 ? 0 : idx);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      {onBack && (
        <button onClick={onBack} className="caption flex items-center gap-1 text-[11px] uppercase mb-6" style={{ color: T.inkSoft }}>
          <ChevronLeft size={14} /> Ledger
        </button>
      )}

      <header className="text-center mb-6">
        <h1 className="masthead" style={{ fontSize: 'clamp(2.1rem, 5.5vw, 2.7rem)', lineHeight: 1.12 }}>Palette Swatch</h1>
        <Flourish width={200} />
        <p className="text-sm italic mt-1" style={{ color: T.inkSoft }}>
          tap a color below to select it · use the wheel + slider to dial it in
        </p>
      </header>

      <div className="flex justify-end mb-4">
        <button
          onClick={randomize}
          className="caption flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase"
          style={{ background: T.gold, color: T.bg, boxShadow: `0 0 0 2px ${T.bg}, 0 0 0 3px ${T.goldSoft}` }}
        >
          <Shuffle size={13} /> Shuffle
        </button>
      </div>

      <div className="rounded-xl p-5 mb-6" style={frame}>
        <div className="flex items-center justify-between mb-3">
          <p className="caption text-[11px] uppercase" style={{ color: T.gold }}>
            {currentPaletteId ? `Editing: ${savedPalettes.find(p => p.id === currentPaletteId)?.name || 'saved palette'}` : 'Unsaved palette'}
          </p>
          <div className="flex items-center gap-2">
            {currentPaletteId && (
              <button onClick={startNewPalette} className="caption text-[11px] uppercase" style={{ color: T.inkSoft }}>
                + new
              </button>
            )}
            <button
              onClick={() => setShowSaveInput(s => !s)}
              className="caption px-3 py-1.5 rounded-full text-[11px] uppercase"
              style={{ background: T.gold, color: T.bg }}
            >
              {currentPaletteId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
        {showSaveInput && (
          <div className="flex gap-2 mb-3">
            <input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder={currentPaletteId ? (savedPalettes.find(p => p.id === currentPaletteId)?.name || 'Palette name') : 'Name this palette'}
              className="flex-1 px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
            <button
              onClick={saveCurrentPalette}
              className="caption px-4 py-2 rounded-full text-[11px] uppercase"
              style={{ background: T.gold, color: T.bg }}
            >
              {currentPaletteId ? 'Update' : 'Save'}
            </button>
          </div>
        )}
        {savedPalettes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {savedPalettes.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1"
                style={{
                  background: p.id === currentPaletteId ? T.goldSoft : T.goldFaint,
                  border: p.id === currentPaletteId ? `1px solid ${T.goldLine}` : `1px solid ${T.goldSoft}`,
                }}
              >
                <button onClick={() => loadPalette(p)} className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {p.colors.slice(0, 4).map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ background: c, border: `1px solid ${T.bg}` }} />
                    ))}
                  </div>
                  <span className="caption text-[11px]">{p.name}</span>
                </button>
                <button onClick={() => deletePalette(p.id)} style={{ color: T.inkSoft }}>
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl p-5 mb-6" style={frame}>
        <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" />
        <div className="flex items-center gap-4">
          {sourceImage ? (
            <img src={sourceImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" style={{ border: `1px solid ${T.goldLine}` }} />
          ) : (
            <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0" style={{ border: `1px dashed ${T.goldLine}` }}>
              <Upload size={18} style={{ color: T.inkFaint }} />
            </div>
          )}
          <div className="flex-1">
            <p className="text-base mb-1">Pull a palette from a photo</p>
            <p className="text-sm italic mb-2" style={{ color: T.inkSoft }}>
              {extracting ? 'extracting colors…' : 'locked colors below are kept as-is'}
            </p>
            <button
              onClick={() => photoInputRef.current && photoInputRef.current.click()}
              className="caption px-3 py-1.5 rounded-full text-[11px] uppercase"
              style={{ background: T.goldFaint, border: `1px solid ${T.goldLine}`, color: T.ink }}
            >
              {sourceImage ? 'Choose different photo' : 'Upload photo'}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6" style={frame}>
        <p className="caption text-[11px] uppercase mb-4 text-center" style={{ color: T.gold }}>
          editing color {activeIdx + 1} — {activeHex.toUpperCase()}
        </p>

        <ColorWheel h={h} s={s} onPick={updateFromWheel} />

        <div className="mt-6 max-w-xs mx-auto">
          <div className="flex justify-between text-[10px] uppercase mb-1 caption" style={{ color: T.inkSoft }}>
            <span>Lightness</span><span>{l}%</span>
          </div>
          <input
            type="range" min="2" max="98" value={l}
            onChange={e => updateLightness(+e.target.value)}
            className="w-full"
            style={{ background: `linear-gradient(to right, #000, ${hslToHex(h, s, 50)}, #fff)` }}
          />
        </div>

        <div className="caption flex justify-center gap-6 mt-5 text-[11px]" style={{ color: T.inkSoft }}>
          <span>H {h}°</span>
          <span>S {s}%</span>
          <span>L {l}%</span>
        </div>
      </div>

      <div className="rounded-xl p-5" style={frame}>
        <div className="flex items-center justify-between mb-3">
          <p className="caption text-[11px] uppercase" style={{ color: T.gold }}>Preview together</p>
          {colors.length < 8 && (
            <button onClick={addSwatch} className="caption flex items-center gap-1 text-[11px] uppercase" style={{ color: T.inkSoft }}>
              <Plus size={12} /> add
            </button>
          )}
        </div>
        <div className="flex rounded-lg overflow-hidden h-20 gap-[1px]" style={{ border: `1px solid ${T.goldLine}` }}>
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="relative flex-1 group"
              style={{ background: c, outline: i === activeIdx ? `2px solid ${T.goldBright}` : 'none', outlineOffset: '-2px' }}
            >
              <span
                onClick={e => { e.stopPropagation(); useEyedropperAt(i); }}
                className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                style={{ background: 'rgba(0,0,0,0.5)', color: T.ink, transition: 'opacity 0.15s' }}
                title={eyedropperSupported ? "Pick color from screen or photo" : "Pick directly"}
              >
                <Pipette size={12} />
              </span>
              <input
                type="color"
                ref={el => (nativeRefs.current[i] = el)}
                value={c}
                onChange={e => setColorAt(i, e.target.value)}
                onClick={e => e.stopPropagation()}
                className="absolute w-0 h-0 opacity-0"
                tabIndex={-1}
              />
              <span
                onClick={e => { e.stopPropagation(); setLocked(l => ({ ...l, [i]: !l[i] })); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: locked[i] ? T.gold : 'rgba(0,0,0,0.5)', color: locked[i] ? T.bg : T.ink, opacity: locked[i] ? 1 : 0 }}
              >
                <Lock size={11} />
              </span>
              {colors.length > 2 && (
                <span
                  onClick={e => { e.stopPropagation(); removeSwatch(i); }}
                  className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{ background: 'rgba(0,0,0,0.5)', color: T.ink, transition: 'opacity 0.15s' }}
                >
                  <X size={12} />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => copyHex(c, i)}
              className="caption text-[11px] flex items-center gap-1"
              style={{ color: T.inkSoft }}
            >
              {copied === i ? <Check size={11} /> : <Copy size={11} />}
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12"><VineRule /></div>
    </div>
  );
}
