"use client";

import { useEffect, useState } from "react";
import { getStats, getLevelTitle, getLevelColor, getLevel, getLevelProgress } from "@/lib/storage";
import { CATEGORIES } from "@/lib/questions";
import { getTodayKey } from "@/lib/questions";

type Props = {
  username: string;
  onStartDaily: () => void;
  onStartEndless: (categoryId: string) => void;
  onShowStats: () => void;
};

export default function HomeScreen({ username, onStartDaily, onStartEndless, onShowStats }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("random");
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  useEffect(() => {
    setStats(getStats());
  }, []);

  const level = stats ? getLevel(stats.totalXP) : 1;
  const { percent } = stats ? getLevelProgress(stats.totalXP) : { percent: 0 };
  const levelColor = getLevelColor(level);
  const dailyDone = stats?.dailyDate === getTodayKey();

  const handleEndless = () => {
    const cat = selectedCategory === "random"
      ? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id
      : selectedCategory;
    onStartEndless(cat);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #020c02 0%, #052e05 40%, #065f06 70%, #16a34a 100%)" }}>
      {/* Background glows - çok parlak */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(74,222,128,0.3), transparent)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(34,197,94,0.35)" }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(16,185,129,0.25)" }} />
        <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(74,222,128,0.2)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl" style={{ background: "rgba(163,230,53,0.25)" }} />
      </div>

      <div className="relative flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onShowStats} className="w-11 h-11 flex items-center justify-center rounded-2xl text-xl transition-all active:scale-90" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 16px rgba(99,102,241,0.2)" }}>
            📊
          </button>
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tighter" style={{ background: "linear-gradient(135deg, #c4b5fd, #f0abfc, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px rgba(192,132,252,0.7))" }}>
              Bilge
            </h1>
            <p className="text-purple-300/70 text-xs font-medium tracking-widest uppercase">Türkçe Trivia</p>
          </div>
          <div className="w-11 h-11 flex items-center justify-center rounded-2xl font-black text-sm" style={{ background: `linear-gradient(135deg, ${levelColor}33, ${levelColor}55)`, border: `1px solid ${levelColor}44`, color: levelColor, boxShadow: `0 0 16px ${levelColor}30` }}>
            {level}
          </div>
        </div>

        {/* Player card */}
        {stats && (
          <div className="mb-6 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 30px rgba(99,102,241,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-bold">{username}</p>
                <p className="text-xs" style={{ color: levelColor }}>Seviye {level} — {getLevelTitle(level)}</p>
              </div>
              <div className="flex items-center gap-3 text-right">
                {stats.currentStreak > 0 && (
                  <div className="text-center">
                    <p className="text-xl font-black text-orange-400">🔥{stats.currentStreak}</p>
                    <p className="text-zinc-500 text-xs">gün serisi</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xl font-black text-yellow-400">{stats.totalXP}</p>
                  <p className="text-zinc-500 text-xs">toplam XP</p>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${levelColor}, #8b5cf6)` }} />
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        <button
          onClick={onStartDaily}
          disabled={dailyDone}
          className="w-full p-5 rounded-2xl mb-4 text-left transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: dailyDone ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))", border: dailyDone ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(99,102,241,0.4)", boxShadow: dailyDone ? "none" : "0 0 30px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{dailyDone ? "✅" : "📅"}</span>
                <span className="text-white font-black text-lg">Günlük Meydan Okuma</span>
              </div>
              <p className="text-zinc-400 text-sm">10 soru · 8 kategori · Bir kez</p>
              {dailyDone && <p className="text-emerald-400 text-xs mt-1">✓ Bugün tamamlandı!</p>}
            </div>
            {!dailyDone && (
              <div className="text-right">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }}>
                  →
                </div>
              </div>
            )}
          </div>
        </button>

        {/* Endless Mode */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">♾️</span>
            <span className="text-white font-black text-lg">Sonsuz Mod</span>
          </div>
          <p className="text-zinc-500 text-sm mb-4">Kategori seç, istediğin kadar oyna</p>

          {/* Category grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory("random")}
              className="p-2.5 rounded-xl text-center transition-all active:scale-95"
              style={{ background: selectedCategory === "random" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)", border: selectedCategory === "random" ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.08)", boxShadow: selectedCategory === "random" ? "0 0 12px rgba(99,102,241,0.3)" : "none" }}
            >
              <p className="text-xl">🎲</p>
              <p className="text-xs text-zinc-300 font-bold mt-0.5">Rastgele</p>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="p-2.5 rounded-xl text-center transition-all active:scale-95"
                style={{
                  background: selectedCategory === cat.id ? `${cat.color}30` : "rgba(255,255,255,0.04)",
                  border: selectedCategory === cat.id ? `1px solid ${cat.color}70` : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: selectedCategory === cat.id ? `0 0 12px ${cat.color}40` : "none",
                }}
              >
                <p className="text-xl">{cat.emoji}</p>
                <p className="text-xs text-zinc-300 font-bold mt-0.5">{cat.name}</p>
              </button>
            ))}
          </div>

          <button onClick={handleEndless} className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #0891b2, #6366f1)", color: "white", boxShadow: "0 4px 20px rgba(6,182,212,0.25)" }}>
            Başla →
          </button>
        </div>

        {/* Quick stats */}
        {stats && stats.totalGames > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Oyun", value: stats.totalGames, icon: "🎮" },
              { label: "Doğru %", value: `${stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0}%`, icon: "🎯" },
              { label: "En uzun seri", value: stats.bestStreak, icon: "⚡" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-base">{icon}</p>
                <p className="text-white font-black text-base">{value}</p>
                <p className="text-zinc-600 text-xs">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
