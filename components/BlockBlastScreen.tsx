"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const G = 8;        // grid size
const C = 36;       // cell px
const P = 2;        // gap px
const S = C + P;    // step px

const PALETTE = [
  "#00d4ff", "#00e676", "#ffab00",
  "#ea40fb", "#ff3a5e", "#2979ff",
  "#69ff47", "#ff6d00",
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Grid  = (string | null)[][];
type Shape = boolean[][];
type Piece = { shape: Shape; color: string };

// ─── Shapes ───────────────────────────────────────────────────────────────────
const SHAPES: Shape[] = [
  [[true]],
  [[true,true]],
  [[true,true,true]],
  [[true,true,true,true]],
  [[true,true,true,true,true]],
  [[true],[true]],
  [[true],[true],[true]],
  [[true],[true],[true],[true]],
  [[true],[true],[true],[true],[true]],
  [[true,true],[true,true]],
  [[true,true,true],[true,true,true]],
  [[true,true,true],[true,true,true],[true,true,true]],
  [[true,false],[true,false],[true,true]],
  [[false,true],[false,true],[true,true]],
  [[true,true],[false,true],[false,true]],
  [[true,true],[true,false],[true,false]],
  [[true,true,true],[false,true,false]],
  [[false,true,false],[true,true,true]],
  [[true,false],[true,true],[true,false]],
  [[false,true],[true,true],[false,true]],
  [[false,true,true],[true,true,false]],
  [[true,true,false],[false,true,true]],
  [[false,true,false],[true,true,true],[false,true,false]],
  [[true,true],[true,false]],
  [[true,false],[true,true]],
  [[false,true],[true,true]],
  [[true,true],[false,true]],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mkGrid  = (): Grid => Array.from({length:G}, () => Array(G).fill(null));
const randPiece = (): Piece => ({
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
});
const mkTray = (): (Piece|null)[] => [randPiece(), randPiece(), randPiece()];

const shapeSize = (s: Shape) => ({ rows: s.length, cols: Math.max(...s.map(r => r.length)) });

const canPlace = (grid: Grid, shape: Shape, r: number, c: number): boolean => {
  for (let dr = 0; dr < shape.length; dr++)
    for (let dc = 0; dc < shape[dr].length; dc++) {
      if (!shape[dr][dc]) continue;
      const gr = r+dr, gc = c+dc;
      if (gr < 0 || gr >= G || gc < 0 || gc >= G || grid[gr][gc]) return false;
    }
  return true;
};

const doPlace = (grid: Grid, shape: Shape, r: number, c: number, color: string): Grid => {
  const g = grid.map(row => [...row]);
  for (let dr = 0; dr < shape.length; dr++)
    for (let dc = 0; dc < shape[dr].length; dc++)
      if (shape[dr][dc]) g[r+dr][c+dc] = color;
  return g;
};

const clearLines = (grid: Grid) => {
  const fullRows = [...Array(G).keys()].filter(r => grid[r].every(c => c !== null));
  const fullCols = [...Array(G).keys()].filter(c => grid.every(r => r[c] !== null));
  const cleared  = fullRows.length + fullCols.length;
  if (!cleared) return { grid, cleared: 0, fullRows: [], fullCols: [] };
  return {
    grid: grid.map((row, r) => row.map((cell, c) =>
      fullRows.includes(r) || fullCols.includes(c) ? null : cell
    )),
    cleared, fullRows, fullCols,
  };
};

const fitsAnywhere = (grid: Grid, piece: Piece): boolean => {
  for (let r = 0; r < G; r++)
    for (let c = 0; c < G; c++)
      if (canPlace(grid, piece.shape, r, c)) return true;
  return false;
};

// Lighten / darken a #rrggbb hex color
const lighten = (hex: string, amt = 55): string => {
  const r = Math.min(255, parseInt(hex.slice(1,3),16) + amt);
  const g = Math.min(255, parseInt(hex.slice(3,5),16) + amt);
  const b = Math.min(255, parseInt(hex.slice(5,7),16) + amt);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
};
const darken = (hex: string, amt = 40): string => lighten(hex, -amt);

// ─── Block Textures ───────────────────────────────────────────────────────────
type CellStyle = { background: string; border: string; boxShadow: string; borderRadius: number };

const TEXTURES: { name: string; emoji: string; apply: (c: string) => CellStyle }[] = [
  {
    name: "Kristal", emoji: "💎",
    apply: (c) => ({
      background: `linear-gradient(135deg, ${lighten(c,70)} 0%, ${c} 52%, ${darken(c,30)} 100%)`,
      border: `1.5px solid ${lighten(c,35)}`,
      boxShadow: `inset 0 2px 5px rgba(255,255,255,0.65), inset 0 -2px 3px rgba(0,0,0,0.3), 0 3px 14px ${c}66`,
      borderRadius: 7,
    }),
  },
  {
    name: "Metal", emoji: "⚙️",
    apply: (c) => ({
      background: `linear-gradient(180deg, ${lighten(c,75)} 0%, ${c} 38%, ${lighten(c,20)} 58%, ${darken(c,20)} 100%)`,
      border: `1.5px solid rgba(255,255,255,0.45)`,
      boxShadow: `inset 0 1px 4px rgba(255,255,255,0.75), inset 0 -2px 4px rgba(0,0,0,0.45), 0 2px 8px ${c}44`,
      borderRadius: 4,
    }),
  },
  {
    name: "Neon", emoji: "🌟",
    apply: (c) => ({
      background: `${c}28`,
      border: `2px solid ${c}`,
      boxShadow: `0 0 6px ${c}, 0 0 18px ${c}99, 0 0 32px ${c}44, inset 0 0 10px ${c}33`,
      borderRadius: 6,
    }),
  },
  {
    name: "Cam", emoji: "🪟",
    apply: (c) => ({
      background: `linear-gradient(135deg, rgba(255,255,255,0.42) 0%, ${c}66 45%, ${c}22 100%)`,
      border: `1.5px solid rgba(255,255,255,0.55)`,
      boxShadow: `inset 0 2px 8px rgba(255,255,255,0.45), inset 0 -1px 2px rgba(0,0,0,0.1), 0 4px 14px ${c}44`,
      borderRadius: 10,
    }),
  },
  {
    name: "Ateş", emoji: "🔥",
    apply: (c) => ({
      background: `linear-gradient(0deg, #c0392b 0%, ${c} 45%, #ffab00 100%)`,
      border: `1.5px solid #ff6d00`,
      boxShadow: `inset 0 1px 4px rgba(255,220,0,0.55), 0 0 16px #ff3a5e88, 0 4px 10px rgba(255,60,0,0.45)`,
      borderRadius: 6,
    }),
  },
  {
    name: "Buz", emoji: "❄️",
    apply: (c) => ({
      background: `linear-gradient(135deg, #e8f8ff 0%, ${c}aa 42%, #0077b6 100%)`,
      border: `2px solid rgba(180,240,255,0.75)`,
      boxShadow: `inset 0 2px 6px rgba(255,255,255,0.75), inset 0 -1px 3px rgba(0,100,180,0.3), 0 2px 12px #00d4ff77`,
      borderRadius: 8,
    }),
  },
  {
    name: "Altın", emoji: "✨",
    apply: (c) => ({
      background: `linear-gradient(135deg, #fffde7 0%, #ffca28 40%, ${c} 65%, #e65100 100%)`,
      border: `1.5px solid #ffd54f`,
      boxShadow: `inset 0 2px 5px rgba(255,255,255,0.65), 0 2px 14px rgba(255,171,0,0.75), 0 0 8px rgba(255,200,0,0.4)`,
      borderRadius: 5,
    }),
  },
  {
    name: "Taş", emoji: "🪨",
    apply: (c) => ({
      background: `linear-gradient(135deg, rgba(210,210,220,0.92) 0%, ${c}cc 50%, rgba(40,40,60,0.88) 100%)`,
      border: `2px solid rgba(180,180,205,0.5)`,
      boxShadow: `inset 0 2px 3px rgba(255,255,255,0.32), inset 0 -2px 5px rgba(0,0,0,0.55), 0 3px 8px rgba(0,0,0,0.55)`,
      borderRadius: 3,
    }),
  },
];

// ─── Mini piece renderer (tray) ───────────────────────────────────────────────
function MiniPiece({ piece, cellSize, textureIdx }: { piece: Piece; cellSize: number; textureIdx: number }) {
  const { rows, cols } = shapeSize(piece.shape);
  const tex = TEXTURES[textureIdx % TEXTURES.length];
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},${cellSize}px)`, gridTemplateRows:`repeat(${rows},${cellSize}px)`, gap:2 }}>
      {piece.shape.map((row, r) =>
        row.map((filled, c) => {
          const ts = filled ? tex.apply(piece.color) : null;
          return (
            <div key={`${r}-${c}`} style={{
              width: cellSize, height: cellSize,
              borderRadius: ts ? ts.borderRadius : 3,
              background: ts ? ts.background : "transparent",
              border: ts ? ts.border : "none",
              boxShadow: ts ? ts.boxShadow : "none",
            }}/>
          );
        })
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
type Props = { username: string; onHome: () => void };

export default function BlockBlastScreen({ onHome }: Props) {
  const [grid,     setGrid]     = useState<Grid>(mkGrid);
  const [tray,     setTray]     = useState<(Piece|null)[]>(mkTray);
  const [score,    setScore]    = useState(0);
  const [best,     setBest]     = useState(0);
  const [combo,      setCombo]      = useState(0);
  const [textureIdx, setTextureIdx] = useState(0);
  const [clearing,   setClearing]   = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [floatMsg, setFloatMsg] = useState<{ text:string; id:number }|null>(null);

  // Drag state
  const [drag,    setDrag]    = useState<{ idx:number; x:number; y:number }|null>(null);
  const [preview, setPreview] = useState<[number,number]|null>(null);

  const gridRef  = useRef<HTMLDivElement>(null);
  const floatId  = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("bb_best");
    if (saved) setBest(Number(saved));
  }, []);

  // Game-over check: fires whenever grid or tray changes (covers cases where
  // no placement attempt is ever made, e.g. fresh tray that can't fit anywhere)
  useEffect(() => {
    if (gameOver) return;
    const active = tray.filter((p): p is Piece => p !== null);
    if (active.length === 0) return;
    if (active.every(p => !fitsAnywhere(grid, p))) {
      const t = setTimeout(() => setGameOver(true), 600);
      return () => clearTimeout(t);
    }
  }, [grid, tray, gameOver]);

  const showFloat = (text: string) => {
    floatId.current++;
    setFloatMsg({ text, id: floatId.current });
    setTimeout(() => setFloatMsg(null), 1100);
  };

  // Calculate grid placement centered under pointer
  const getPlacement = useCallback((x: number, y: number, idx: number): [number,number]|null => {
    if (!gridRef.current) return null;
    const piece = tray[idx];
    if (!piece) return null;
    const { rows, cols } = shapeSize(piece.shape);
    const rect = gridRef.current.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    // Only show preview when near grid
    if (relX < -C*2 || relY < -C*2 || relX > rect.width + C*2 || relY > rect.height + C*2) return null;
    let row = Math.round(relY / S - rows / 2);
    let col = Math.round(relX / S - cols / 2);
    row = Math.max(0, Math.min(row, G - rows));
    col = Math.max(0, Math.min(col, G - cols));
    return [row, col];
  }, [tray]);

  // Place a piece on the grid
  const place = useCallback((idx: number, row: number, col: number) => {
    const piece = tray[idx];
    if (!piece || !canPlace(grid, piece.shape, row, col)) return;

    const placed   = piece.shape.flat().filter(Boolean).length;
    const newGrid  = doPlace(grid, piece.shape, row, col, piece.color);
    const { grid: cleared, cleared: nCleared, fullRows, fullCols } = clearLines(newGrid);

    const newCombo  = nCleared > 0 ? combo + 1 : 0;
    const lineScore = nCleared > 0 ? nCleared * G * Math.max(1, newCombo) : 0;
    const bonus     = nCleared > 1 ? nCleared * (nCleared - 1) * 8 : 0;
    const gained    = placed + lineScore + bonus;
    const newScore  = score + gained;
    const newBest   = Math.max(best, newScore);

    // Flash clearing cells
    if (nCleared > 0) {
      const flash = new Set<string>();
      fullRows.forEach(r => Array.from({length:G},(_,c) => flash.add(`${r}-${c}`)));
      fullCols.forEach(c => Array.from({length:G},(_,r) => flash.add(`${r}-${c}`)));
      setClearing(flash);
      setTimeout(() => setClearing(new Set()), 380);

      const nextTex = TEXTURES[(textureIdx + 1) % TEXTURES.length];
      setTextureIdx(t => t + 1);

      if      (newCombo >= 5) showFloat(`🔥🔥 MEGA COMBO x${newCombo}!`);
      else if (newCombo >= 3) showFloat(`🔥 COMBO x${newCombo}! +${gained}`);
      else if (nCleared >= 3) showFloat(`💥 TRIPLE! +${gained} ${nextTex.emoji}`);
      else if (nCleared === 2) showFloat(`⚡ ÇİFT HAT! +${gained} ${nextTex.emoji}`);
      else showFloat(`${nextTex.emoji} ${nextTex.name}! +${gained}`);
    }

    const newTray = [...tray] as (Piece|null)[];
    newTray[idx]  = null;
    const final   = newTray.every(p => p === null) ? mkTray() : newTray;

    if (newBest > best) localStorage.setItem("bb_best", String(newBest));

    setGrid(cleared);
    setScore(newScore);
    setBest(newBest);
    setCombo(newCombo);
    setTray(final);

    const active = final.filter((p): p is Piece => p !== null);
    if (active.length && active.every(p => !fitsAnywhere(cleared, p))) {
      setTimeout(() => setGameOver(true), 500);
    }
  }, [grid, tray, score, best, combo]);

  // ─── Pointer handlers (one set per tray slot) ─────────────────────────────
  const onDown = (e: React.PointerEvent, idx: number) => {
    if (!tray[idx]) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ idx, x: e.clientX, y: e.clientY });
    setPreview(getPlacement(e.clientX, e.clientY, idx));
  };
  const onMove = (e: React.PointerEvent, idx: number) => {
    if (!drag || drag.idx !== idx) return;
    setDrag({ idx, x: e.clientX, y: e.clientY });
    setPreview(getPlacement(e.clientX, e.clientY, idx));
  };
  const onUp = (e: React.PointerEvent, idx: number) => {
    if (!drag || drag.idx !== idx) return;
    const p = getPlacement(e.clientX, e.clientY, idx);
    const piece = tray[idx];
    if (p && piece && canPlace(grid, piece.shape, p[0], p[1])) place(idx, p[0], p[1]);
    setDrag(null);
    setPreview(null);
  };
  const onCancel = () => { setDrag(null); setPreview(null); };

  const restart = () => {
    setGrid(mkGrid()); setTray(mkTray());
    setScore(0); setCombo(0);
    setClearing(new Set()); setDrag(null); setPreview(null); setGameOver(false);
  };

  // ─── Preview cells ─────────────────────────────────────────────────────────
  const previewSet = new Set<string>();
  let previewOk = false;
  if (drag && preview) {
    const piece = tray[drag.idx];
    if (piece) {
      previewOk = canPlace(grid, piece.shape, preview[0], preview[1]);
      for (let dr = 0; dr < piece.shape.length; dr++)
        for (let dc = 0; dc < piece.shape[dr].length; dc++)
          if (piece.shape[dr][dc]) previewSet.add(`${preview[0]+dr}-${preview[1]+dc}`);
    }
  }

  // ─── Floating piece during drag ────────────────────────────────────────────
  const floatingPiece = (() => {
    if (!drag) return null;
    const piece = tray[drag.idx];
    if (!piece) return null;
    const { rows, cols } = shapeSize(piece.shape);
    const w = cols * C + (cols - 1) * P;
    const h = rows * C + (rows - 1) * P;
    const tex = TEXTURES[textureIdx % TEXTURES.length];
    return (
      <div style={{
        position:"fixed", pointerEvents:"none", zIndex:100,
        left: drag.x - w/2, top: drag.y - h/2,
        width:w, height:h,
        opacity:0.92, transform:"scale(1.12)",
        filter:`drop-shadow(0 0 14px ${piece.color}) drop-shadow(0 6px 20px rgba(0,0,0,0.7))`,
      }}>
        {piece.shape.map((row, r) =>
          row.map((filled, c) => {
            if (!filled) return null;
            const ts = tex.apply(piece.color);
            return (
              <div key={`${r}-${c}`} style={{
                position:"absolute",
                left: c*(C+P), top: r*(C+P),
                width:C, height:C,
                background:   ts.background,
                border:       ts.border,
                boxShadow:    ts.boxShadow,
                borderRadius: ts.borderRadius,
              }}/>
            );
          })
        )}
      </div>
    );
  })();

  // ─── Game Over ─────────────────────────────────────────────────────────────
  if (gameOver) {
    const xp = Math.floor(score / 3);
    const pct = best > 0 ? Math.min(score / best, 1) : 1;
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{background:"linear-gradient(160deg,#0a0020 0%,#130a2e 50%,#0a0020 100%)"}}>
        <div className="w-full max-w-sm">
          <div className="rounded-3xl overflow-hidden"
            style={{background:"linear-gradient(145deg,rgba(20,10,50,0.98),rgba(10,15,45,0.98))", border:"1px solid rgba(139,92,246,0.4)", boxShadow:"0 0 80px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.1)"}}>
            <div className="h-1.5" style={{background:"linear-gradient(90deg,#00d4ff,#6366f1,#ea40fb)"}}/>
            <div className="p-7">
              <div className="text-center mb-5">
                <div className="text-6xl mb-2">🧩</div>
                <h2 className="text-3xl font-black text-white mb-1">Oyun Bitti</h2>
                <p className="text-zinc-500 text-sm">Bilge Zeka — Blok Blast</p>
              </div>

              {/* Score ring */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9"/>
                    <circle cx="72" cy="72" r="60" fill="none"
                      stroke="url(#gr)" strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={`${2*Math.PI*60}`}
                      strokeDashoffset={`${2*Math.PI*60*(1-pct)}`}
                      style={{transition:"stroke-dashoffset 1.4s ease-out"}}
                    />
                    <defs>
                      <linearGradient id="gr" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00d4ff"/>
                        <stop offset="100%" stopColor="#ea40fb"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{score}</span>
                    <span className="text-zinc-500 text-xs">puan</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label:"En Yüksek", value:best, color:"#ffab00", icon:"🏆" },
                  { label:"XP Kazanıldı", value:`+${xp}`, color:"#00e676", icon:"⭐" },
                ].map(({label,value,color,icon}) => (
                  <div key={label} className="rounded-2xl p-4 text-center"
                    style={{background:`${color}18`, border:`1px solid ${color}40`}}>
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className="font-black text-xl text-white">{value}</p>
                    <p className="text-xs font-medium" style={{color}}>{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5">
                <button onClick={restart}
                  className="w-full py-4 rounded-2xl font-black text-base text-white"
                  style={{background:"linear-gradient(135deg,#00d4ff,#6366f1,#ea40fb)", boxShadow:"0 4px 24px rgba(99,102,241,0.45)"}}>
                  🔄 Tekrar Oyna
                </button>
                <button onClick={onHome}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm"
                  style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"#71717a"}}>
                  🏠 Ana Menü
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gridPx = G * C + (G-1) * P;

  // ─── Main Game ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col select-none"
      style={{background:"linear-gradient(160deg,#0a0020 0%,#130a2e 30%,#0c1a3a 60%,#0a0020 100%)", touchAction:"none"}}>

      {/* Floating piece */}
      {floatingPiece}

      {/* Background glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-30"
          style={{background:"radial-gradient(ellipse,#5b21b6,transparent)"}}/>
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{background:"radial-gradient(ellipse,#0e7490,transparent)"}}/>
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{background:"radial-gradient(ellipse,#7e22ce,transparent)"}}/>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{background:"radial-gradient(ellipse,#be185d,transparent)"}}/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{background:"radial-gradient(ellipse,#1d4ed8,transparent)"}}/>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{background:"radial-gradient(ellipse,#0f766e,transparent)"}}/>
      </div>

      {/* Float message */}
      {floatMsg && (
        <div key={floatMsg.id}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-float">
          <div className="px-5 py-2.5 rounded-2xl text-center"
            style={{background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)"}}>
            <span className="text-2xl font-black"
              style={{color:"#ffd700", textShadow:"0 0 20px rgba(255,215,0,0.8)"}}>
              {floatMsg.text}
            </span>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="relative flex items-center gap-3 px-4 pt-5 pb-3">
        <button onClick={onHome}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl"
          style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)"}}>
          <span className="text-white">←</span>
        </button>

        <div className="flex-1 flex items-center justify-between rounded-2xl px-4 py-3"
          style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(10px)"}}>
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Puan</p>
            <p className="text-white font-black text-2xl leading-none tabular-nums">{score}</p>
          </div>

          <div className="text-center">
            <p className="text-zinc-400 text-xs font-semibold">🧩 Blok Blast</p>
            {combo >= 2 ? (
              <p className="font-black text-sm mt-0.5"
                style={{color: combo >= 5 ? "#ff3a5e" : combo >= 3 ? "#ffab00" : "#00d4ff",
                        textShadow:`0 0 10px currentColor`}}>
                🔥 x{combo}
              </p>
            ) : (
              <p className="text-zinc-600 text-xs mt-0.5">Bilge Zeka</p>
            )}
          </div>

          <div className="text-right">
            <p className="text-zinc-500 text-xs uppercase tracking-widest">En İyi</p>
            <p className="font-black text-xl leading-none tabular-nums" style={{color:"#ffab00"}}>{best}</p>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div ref={gridRef} className="relative"
          style={{
            width: gridPx, height: gridPx,
            borderRadius: 18,
            background: "linear-gradient(145deg, rgba(30,10,70,0.95) 0%, rgba(10,20,60,0.95) 100%)",
            border: "1.5px solid rgba(139,92,246,0.35)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 10px 50px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}>

          {/* Grid lines */}
          <div className="absolute inset-0 rounded-[17px] overflow-hidden pointer-events-none"
            style={{
              backgroundImage:`linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)`,
              backgroundSize:`${S}px ${S}px`,
            }}/>

          {/* Cells */}
          {(() => {
            const tex = TEXTURES[textureIdx % TEXTURES.length];
            return grid.map((row, r) => row.map((cell, c) => {
              const key = `${r}-${c}`;
              const isFlash   = clearing.has(key);
              const isPrev    = previewSet.has(key);
              const dragColor = drag ? tray[drag.idx]?.color : undefined;
              const ts        = cell ? tex.apply(cell) : null;

              return (
                <div key={key} style={{
                  position:"absolute",
                  left: c*S, top: r*S,
                  width:C, height:C,
                  transition:"background 0.15s, box-shadow 0.15s",
                  zIndex: isFlash ? 5 : 1,
                  ...(isFlash ? {
                    background:"white",
                    boxShadow:"0 0 22px white, 0 0 45px rgba(255,255,255,0.6)",
                    transform:"scale(1.08)",
                    borderRadius: 7,
                  } : ts ? {
                    background:    ts.background,
                    border:        ts.border,
                    boxShadow:     ts.boxShadow,
                    borderRadius:  ts.borderRadius,
                  } : isPrev ? {
                    background: previewOk ? `${dragColor ?? "#fff"}44` : "rgba(255,50,50,0.18)",
                    border:`1.5px dashed ${previewOk ? (dragColor ?? "#fff") : "#ff3a5e"}88`,
                    boxShadow: previewOk ? `inset 0 0 8px ${dragColor ?? "#fff"}33` : "none",
                    borderRadius: 6,
                  } : {
                    background:"rgba(99,102,241,0.045)",
                    border:"1px solid rgba(139,92,246,0.1)",
                    borderRadius: 6,
                  })
                }}/>
              );
            }));
          })()}
        </div>
      </div>

      {/* ── Piece Tray ── */}
      <div className="px-4 pb-6 pt-1">
        <div className="flex gap-3 max-w-sm mx-auto">
          {tray.map((piece, i) => {
            const isDragging  = drag?.idx === i;
            const cantFit     = piece ? !fitsAnywhere(grid, piece) : false;

            if (!piece) {
              return (
                <div key={i} className="flex-1 flex items-center justify-center rounded-2xl"
                  style={{height:104, background:"rgba(255,255,255,0.025)", border:"1px dashed rgba(255,255,255,0.07)"}}>
                  <span style={{fontSize:24, opacity:0.25}}>✓</span>
                </div>
              );
            }

            const { rows, cols } = shapeSize(piece.shape);
            const tc = Math.min(20, Math.floor(72 / Math.max(rows, cols)));

            return (
              <div key={i}
                onPointerDown={e => onDown(e, i)}
                onPointerMove={e => onMove(e, i)}
                onPointerUp={e => onUp(e, i)}
                onPointerCancel={onCancel}
                className="flex-1 flex items-center justify-center rounded-2xl"
                style={{
                  height:104, cursor: cantFit ? "not-allowed" : "grab",
                  background: isDragging ? "rgba(255,255,255,0.02)" : cantFit ? "rgba(255,50,50,0.08)" : `${piece.color}16`,
                  border: isDragging ? "1px dashed rgba(255,255,255,0.09)" : cantFit ? "1.5px solid rgba(255,80,80,0.35)" : `1.5px solid ${piece.color}55`,
                  boxShadow: isDragging || cantFit ? "none" : `0 0 22px ${piece.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  opacity: isDragging ? 0.3 : cantFit ? 0.4 : 1,
                  transition:"opacity 0.2s, box-shadow 0.15s",
                  touchAction:"none", userSelect:"none",
                }}>
                <MiniPiece piece={piece} cellSize={tc} textureIdx={textureIdx}/>
              </div>
            );
          })}
        </div>

        <p className="text-center text-zinc-700 text-xs mt-2.5">
          Bloğu sürükleyip grida bırak
        </p>
      </div>
    </div>
  );
}
