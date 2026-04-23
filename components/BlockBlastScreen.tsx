"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const GRID = 8;
const CELL = 38; // px per cell
const GAP = 2;   // px gap between cells

const COLORS = [
  "#06b6d4", "#10b981", "#f59e0b",
  "#8b5cf6", "#f43f5e", "#3b82f6",
  "#84cc16", "#ec4899",
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Cell = string | null;
type Shape = boolean[][];
type Piece = { shape: Shape; color: string };

// ─── Shapes ───────────────────────────────────────────────────────────────────
const SHAPES: Shape[] = [
  [[true]],
  [[true, true]],
  [[true, true, true]],
  [[true, true, true, true]],
  [[true, true, true, true, true]],
  [[true], [true]],
  [[true], [true], [true]],
  [[true], [true], [true], [true]],
  [[true], [true], [true], [true], [true]],
  [[true, true], [true, true]],
  [[true, true, true], [true, true, true]],
  [[true, true, true], [true, true, true], [true, true, true]],
  [[true, false], [true, false], [true, true]],
  [[false, true], [false, true], [true, true]],
  [[true, true], [false, true], [false, true]],
  [[true, true], [true, false], [true, false]],
  [[true, true, true], [false, true, false]],
  [[false, true, false], [true, true, true]],
  [[false, true, true], [true, true, false]],
  [[true, true, false], [false, true, true]],
  [[false, true, false], [true, true, true], [false, true, false]],
  [[true, true], [true, false]],
  [[true, false], [true, true]],
  [[false, true], [true, true]],
  [[true, true], [false, true]],
  [[true, true, true], [true, false, false]],
  [[true, true, true], [false, false, true]],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mkGrid = (): Cell[][] =>
  Array.from({ length: GRID }, () => Array(GRID).fill(null));

const randPiece = (): Piece => ({
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

const canPlace = (grid: Cell[][], shape: Shape, row: number, col: number): boolean => {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const gr = row + r, gc = col + c;
      if (gr < 0 || gr >= GRID || gc < 0 || gc >= GRID || grid[gr][gc]) return false;
    }
  return true;
};

const doPlace = (grid: Cell[][], shape: Shape, row: number, col: number, color: string): Cell[][] => {
  const g = grid.map(r => [...r]);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) g[row + r][col + c] = color;
  return g;
};

const clearLines = (grid: Cell[][]): { grid: Cell[][], cleared: number } => {
  const fullRows = [...Array(GRID).keys()].filter(r => grid[r].every(c => c !== null));
  const fullCols = [...Array(GRID).keys()].filter(c => grid.every(r => r[c] !== null));
  const cleared = fullRows.length + fullCols.length;
  if (!cleared) return { grid, cleared: 0 };
  const newGrid = grid.map((row, r) =>
    row.map((cell, c) => (fullRows.includes(r) || fullCols.includes(c) ? null : cell))
  );
  return { grid: newGrid, cleared };
};

const fitsAnywhere = (grid: Cell[][], piece: Piece): boolean => {
  for (let r = 0; r < GRID; r++)
    for (let c = 0; c < GRID; c++)
      if (canPlace(grid, piece.shape, r, c)) return true;
  return false;
};

const mkPieces = (): (Piece | null)[] => [randPiece(), randPiece(), randPiece()];

// ─── Component ────────────────────────────────────────────────────────────────
type Props = { username: string; onHome: () => void };

export default function BlockBlastScreen({ onHome }: Props) {
  const [grid, setGrid] = useState<Cell[][]>(mkGrid);
  const [pieces, setPieces] = useState<(Piece | null)[]>(mkPieces);
  const [selected, setSelected] = useState<number | null>(null);
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [floatMsg, setFloatMsg] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem("blockblast_best");
    if (saved) setBest(Number(saved));
  }, []);

  const showFloat = (msg: string) => {
    setFloatMsg(msg);
    setTimeout(() => setFloatMsg(null), 900);
  };

  const getCellAt = useCallback((clientX: number, clientY: number): [number, number] | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const col = Math.floor((clientX - rect.left) / (CELL + GAP));
    const row = Math.floor((clientY - rect.top) / (CELL + GAP));
    if (col < 0 || col >= GRID || row < 0 || row >= GRID) return null;
    return [row, col];
  }, []);

  const handleGridMove = useCallback((e: React.PointerEvent) => {
    if (selected === null) return;
    setHoverCell(getCellAt(e.clientX, e.clientY));
  }, [selected, getCellAt]);

  const handleGridLeave = useCallback(() => setHoverCell(null), []);

  const handleGridDown = useCallback((e: React.PointerEvent) => {
    if (selected === null) return;
    const cell = getCellAt(e.clientX, e.clientY);
    if (!cell) return;
    const piece = pieces[selected];
    if (!piece) return;
    const [row, col] = cell;
    if (!canPlace(grid, piece.shape, row, col)) return;

    // Place
    let newGrid = doPlace(grid, piece.shape, row, col, piece.color);
    const placed = piece.shape.flat().filter(Boolean).length;
    const { grid: clearedGrid, cleared } = clearLines(newGrid);

    // Scoring
    const newCombo = cleared > 0 ? combo + 1 : 0;
    const lineScore = cleared * GRID * (1 + Math.floor(newCombo / 2));
    const addScore = placed + lineScore;
    const newScore = score + addScore;

    if (cleared > 0) {
      // Flash animation
      const keys = new Set<string>();
      for (let r = 0; r < GRID; r++)
        for (let c = 0; c < GRID; c++)
          keys.add(`${r}-${c}`);
      setFlash(keys);
      setTimeout(() => setFlash(new Set()), 200);

      if (newCombo >= 2) showFloat(`🔥 Kombo x${newCombo}!`);
      else if (cleared >= 2) showFloat(`💥 ${cleared} Hat!`);
      else showFloat(`+${addScore}`);
    }

    const newPieces = [...pieces] as (Piece | null)[];
    newPieces[selected] = null;
    const allUsed = newPieces.every(p => p === null);
    const finalPieces: (Piece | null)[] = allUsed ? mkPieces() : newPieces;

    const newBest = Math.max(best, newScore);
    if (newScore > best) {
      setBest(newBest);
      localStorage.setItem("blockblast_best", String(newBest));
    }

    setGrid(clearedGrid);
    setScore(newScore);
    setCombo(newCombo);
    setPieces(finalPieces);
    setSelected(null);
    setHoverCell(null);

    // Game over check
    const active = finalPieces.filter((p): p is Piece => p !== null);
    if (active.length > 0 && active.every(p => !fitsAnywhere(clearedGrid, p))) {
      setTimeout(() => setGameOver(true), 300);
    }
  }, [selected, pieces, grid, score, combo, best, getCellAt]);

  const restart = () => {
    setGrid(mkGrid());
    setPieces(mkPieces());
    setSelected(null);
    setHoverCell(null);
    setScore(0);
    setCombo(0);
    setFlash(new Set());
    setGameOver(false);
  };

  // Build preview cells
  const previewCells = new Set<string>();
  const previewValid = (() => {
    if (selected === null || !hoverCell) return false;
    const piece = pieces[selected];
    if (!piece) return false;
    const [row, col] = hoverCell;
    if (!canPlace(grid, piece.shape, row, col)) return false;
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c]) previewCells.add(`${row + r}-${col + c}`);
    return true;
  })();

  // ── Game Over Screen ──
  if (gameOver) {
    const xpEarned = Math.floor(score / 3);
    const pct = best > 0 ? Math.round((score / best) * 100) : 100;
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 50%, #020817 100%)" }}>
        <div className="w-full max-w-sm">
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "rgba(15,20,40,0.97)", border: "1px solid rgba(99,102,241,0.4)", boxShadow: "0 0 60px rgba(99,102,241,0.2)" }}>
            <div className="h-1.5" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">🎮</div>
                <h2 className="text-2xl font-black text-white mb-1">Oyun Bitti!</h2>
                <p className="text-zinc-400 text-sm">Blok Blast — Bilge Zeka</p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                    <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    <circle cx="56" cy="56" r="48" fill="none"
                      stroke="#6366f1" strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - Math.min(pct, 100) / 100)}`}
                      style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{score}</span>
                    <span className="text-zinc-400 text-xs">puan</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Puan", value: score, color: "#6366f1" },
                  { label: "En iyi", value: best, color: "#f59e0b" },
                  { label: "XP", value: `+${xpEarned}`, color: "#10b981" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl p-3 text-center"
                    style={{ background: `${color}28`, border: `1px solid ${color}50` }}>
                    <p className="font-black text-lg text-white">{value}</p>
                    <p className="text-zinc-400 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={restart}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>
                  🔄 Tekrar Oyna
                </button>
                <button onClick={onHome}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#71717a" }}>
                  🏠 Ana Menü
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Game ──
  const gridPx = GRID * CELL + (GRID - 1) * GAP;

  return (
    <div className="min-h-screen flex flex-col select-none"
      style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 60%, #020817 100%)" }}>

      {/* Float message */}
      {floatMsg && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-float">
          <span className="text-2xl font-black px-4 py-2 rounded-2xl text-yellow-400">{floatMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onHome}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-200"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>←</button>
        <div className="text-center">
          <p className="text-white font-black text-sm">🧩 Blok Blast</p>
          <p className="text-zinc-400 text-xs">Bilge Zeka</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-sm">{score}</p>
          <p className="text-zinc-500 text-xs">en iyi {best}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 pb-4">
        <div
          ref={gridRef}
          className="relative"
          style={{ width: gridPx, height: gridPx, cursor: selected !== null ? "crosshair" : "default" }}
          onPointerMove={handleGridMove}
          onPointerLeave={handleGridLeave}
          onPointerDown={handleGridDown}
        >
          {/* Grid background lines */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }} />

          {/* Cells */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`;
              const isPreview = previewCells.has(key);
              const isFlash = flash.has(key);
              const left = c * (CELL + GAP);
              const top = r * (CELL + GAP);

              return (
                <div
                  key={key}
                  style={{
                    position: "absolute",
                    left, top,
                    width: CELL, height: CELL,
                    borderRadius: 6,
                    background: isFlash
                      ? "rgba(255,255,255,0.9)"
                      : cell
                        ? cell
                        : isPreview
                          ? (previewValid ? `${pieces[selected!]!.color}66` : "rgba(239,68,68,0.3)")
                          : "rgba(255,255,255,0.04)",
                    border: isPreview
                      ? `2px dashed ${previewValid ? pieces[selected!]!.color : "#ef4444"}`
                      : cell
                        ? `1px solid ${cell}88`
                        : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: cell && !isFlash ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px ${cell}55` : undefined,
                    transition: "background 0.1s, border 0.1s",
                  }}
                />
              );
            })
          )}
        </div>

        {/* Piece tray */}
        <div className="flex items-center justify-center gap-4 px-4 w-full max-w-sm">
          {pieces.map((piece, i) => {
            if (!piece) {
              return (
                <div key={i} className="flex-1 flex items-center justify-center rounded-2xl"
                  style={{ height: 100, background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <span className="text-zinc-700 text-xl">✓</span>
                </div>
              );
            }

            const isSelected = selected === i;
            const rows = piece.shape.length;
            const cols = Math.max(...piece.shape.map(r => r.length));
            const tCell = Math.min(18, Math.floor(80 / Math.max(rows, cols)));

            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className="flex-1 flex items-center justify-center rounded-2xl transition-all active:scale-95"
                style={{
                  height: 100,
                  background: isSelected ? `${piece.color}33` : "rgba(255,255,255,0.06)",
                  border: isSelected ? `2px solid ${piece.color}` : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: isSelected ? `0 0 20px ${piece.color}55` : "none",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, ${tCell}px)`,
                  gridTemplateRows: `repeat(${rows}, ${tCell}px)`,
                  gap: 2,
                }}>
                  {piece.shape.map((row, r) =>
                    row.map((filled, c) => (
                      <div key={`${r}-${c}`} style={{
                        width: tCell, height: tCell,
                        borderRadius: 3,
                        background: filled ? piece.color : "transparent",
                        boxShadow: filled ? `0 1px 4px ${piece.color}88, inset 0 1px 0 rgba(255,255,255,0.3)` : undefined,
                      }} />
                    ))
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-zinc-600 text-xs text-center">
          {selected !== null ? "Grid üzerine dokun → yerleştir" : "Bir blok seç"}
        </p>
      </div>
    </div>
  );
}
