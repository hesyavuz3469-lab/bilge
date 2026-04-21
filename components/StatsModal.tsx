"use client";

import { useEffect, useState } from "react";
import { getStats, getLevelTitle, getLevelColor, getLevel, getLevelProgress } from "@/lib/storage";
import { CATEGORIES } from "@/lib/questions";

type Props = { onClose: () => void };

export default function StatsModal({ onClose }: Props) {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => { setStats(getStats()); }, []);

  if (!stats) return null;

  const level = getLevel(stats.totalXP);
  const { percent, next } = getLevelProgress(stats.totalXP);
  const levelColor = getLevelColor(level);
  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(2,8,23,0.92)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-sm animate-bounce-in overflow-y-auto max-h-[90vh]">
        <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(145deg, #0d1526, #080f1e)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 60px rgba(99,102,241,0.12)" }}>
          <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />

          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-white">📊 İstatistikler</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>✕</button>
            </div>

            {/* Level card */}
            <div className="mb-5 p-4 rounded-2xl" style={{ background: `${levelColor}40`, border: `1px solid ${levelColor}70` }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-xs">Seviye {level}</p>
                  <p className="font-black text-lg" style={{ color: levelColor }}>{getLevelTitle(level)}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl" style={{ background: `linear-gradient(135deg, ${levelColor}44, ${levelColor}66)`, color: levelColor }}>
                  {level}
                </div>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${levelColor}, #8b5cf6)` }} />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-zinc-600 text-xs">{stats.totalXP} XP</p>
                <p className="text-zinc-600 text-xs">{next} XP&apos;e kadar</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: "Toplam Oyun", value: stats.totalGames, icon: "🎮", color: "#6366f1" },
                { label: "Doğruluk", value: `${accuracy}%`, icon: "🎯", color: "#10b981" },
                { label: "Mevcut Seri", value: `${stats.currentStreak} 🔥`, icon: "", color: "#f97316" },
                { label: "En Uzun Seri", value: stats.bestStreak, icon: "⚡", color: "#f59e0b" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="p-3 rounded-2xl text-center" style={{ background: `${color}38`, border: `1px solid ${color}65` }}>
                  <p className="text-lg">{icon}</p>
                  <p className="font-black text-lg text-white">{value}</p>
                  <p className="text-zinc-500 text-xs">{label}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            {Object.keys(stats.categoryStats).length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Kategori Performansı</p>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.filter((c) => stats.categoryStats[c.id]).map((cat) => {
                    const cs = stats.categoryStats[cat.id];
                    const pct = cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : 0;
                    return (
                      <div key={cat.id} className="flex items-center gap-2">
                        <span className="text-base">{cat.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-400">{cat.name}</span>
                            <span style={{ color: cat.color }}>{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
