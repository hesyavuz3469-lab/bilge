"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { GameMode, buildShareText, getStats, getLevelTitle, getLevelColor, getLevel, getLevelProgress } from "@/lib/storage";

type Props = {
  correct: number;
  total: number;
  score: number;
  timeSeconds: number;
  mode: GameMode;
  xpGained: number;
  streak: number;
  onPlayAgain: () => void;
  onHome: () => void;
};

export default function ResultScreen({ correct, total, score, timeSeconds, mode, xpGained, streak, onPlayAgain, onHome }: Props) {
  const [copied, setCopied] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const accuracy = Math.round((correct / total) * 100);
  const stats = typeof window !== "undefined" ? getStats() : null;
  const level = stats ? getLevel(stats.totalXP) : 1;
  const { percent } = stats ? getLevelProgress(stats.totalXP) : { percent: 0 };
  const levelColor = getLevelColor(level);

  useEffect(() => {
    if (accuracy >= 60) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"] });
      setTimeout(() => confetti({ particleCount: 50, spread: 120, angle: 60, origin: { y: 0.4 }, colors: ["#a5b4fc", "#f472b6"] }), 400);
      setTimeout(() => confetti({ particleCount: 50, spread: 120, angle: 120, origin: { y: 0.4 }, colors: ["#34d399", "#fbbf24"] }), 700);
    }
    setTimeout(() => setShowXP(true), 600);
  }, [accuracy]);

  const getPerformanceLabel = () => {
    if (accuracy === 100) return { label: "Mükemmel! 🏆", color: "#fbbf24" };
    if (accuracy >= 80) return { label: "Harika! 🎉", color: "#10b981" };
    if (accuracy >= 60) return { label: "İyi! 👏", color: "#6366f1" };
    return { label: "Tekrar Dene 💪", color: "#f59e0b" };
  };

  const perf = getPerformanceLabel();

  const handleShare = async () => {
    const text = buildShareText(correct, total, mode);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Bilge – Trivia Oyunu", text, url: "https://bilge-ewat.vercel.app" });
        return;
      } catch {}
    }
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { alert(text); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 50%, #020817 100%)" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(99,102,241,0.12)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(168,85,247,0.1)" }} />
      </div>

      <div className="relative w-full max-w-md animate-bounce-in">
        {/* Main card */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(15,20,40,0.95), rgba(10,15,35,0.98))", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 60px rgba(99,102,241,0.15), 0 25px 50px rgba(0,0,0,0.5)" }}>
          {/* Top gradient bar */}
          <div className="h-1.5" style={{ background: accuracy >= 60 ? "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" : "linear-gradient(90deg, #f59e0b, #ef4444)" }} />

          <div className="p-7">
            {/* Performance */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{accuracy === 100 ? "🏆" : accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👏" : "💪"}</div>
              <h2 className="text-3xl font-black mb-1" style={{ color: perf.color }}>{perf.label}</h2>
              <p className="text-zinc-400 text-sm">{mode === "daily" ? "Günlük Meydan Okuma" : "Sonsuz Mod"}</p>
            </div>

            {/* Score ring */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="64" cy="64" r="56" fill="none"
                    stroke={accuracy >= 80 ? "#10b981" : accuracy >= 60 ? "#6366f1" : "#f59e0b"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - accuracy / 100)}`}
                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{accuracy}%</span>
                  <span className="text-zinc-400 text-xs">{correct}/{total} doğru</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Puan", value: score, icon: "🎯", color: "#6366f1" },
                { label: "Süre", value: `${timeSeconds}s`, icon: "⏱️", color: "#06b6d4" },
                { label: "Seri", value: `${streak}🔥`, icon: "", color: "#f97316" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="rounded-2xl p-3 text-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <p className="text-xl mb-0.5">{icon}</p>
                  <p className="font-black text-lg text-white leading-none">{value}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* XP Gained */}
            {showXP && xpGained > 0 && (
              <div className="mb-5 p-3 rounded-2xl text-center animate-pop" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(99,102,241,0.4)" }}>
                <p className="text-yellow-400 font-black text-lg">⭐ +{xpGained} XP kazandın!</p>
                {streak >= 3 && <p className="text-orange-400 text-xs mt-0.5">🔥 Seri bonusu dahil!</p>}
                {/* Level bar */}
                {stats && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: levelColor }}>
                      <span>Seviye {level} — {getLevelTitle(level)}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${levelColor}, #8b5cf6)` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Answer breakdown */}
            <div className="flex gap-1 mb-5 justify-center">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="w-6 h-2 rounded-full" style={{ background: i < correct ? "#10b981" : "#ef4444" }} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5">
              <button onClick={handleShare} className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #059669, #0891b2)", color: "white", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" }}>
                {copied ? "✓ Kopyalandı!" : "📋 Sonucu Paylaş"}
              </button>
              {mode === "endless" && (
                <button onClick={onPlayAgain} className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
                  🔄 Tekrar Oyna
                </button>
              )}
              <button onClick={onHome} className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}>
                🏠 Ana Menü
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
