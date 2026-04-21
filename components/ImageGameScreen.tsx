"use client";

import { useCallback, useRef, useState } from "react";
import ImageQuestionCard, { Difficulty } from "./ImageQuestionCard";
import { ImageQuestion, IMAGE_CATEGORIES, getRandomImageQuestions, getImageCategory } from "@/lib/imageQuestions";
import { playCorrect, playWrong, playWin, playLose } from "@/lib/sounds";

const QUESTIONS_PER_GAME = 10;

const DIFFICULTIES: { id: Difficulty; label: string; emoji: string; desc: string; tool: string; color: string; border: string; glow: string }[] = [
  {
    id: "kolay",
    label: "Kolay",
    emoji: "🪟",
    desc: "Cam silecek • %5 alan açılır",
    tool: "Silecekle sil",
    color: "linear-gradient(135deg, rgba(14,165,233,0.35), rgba(56,189,248,0.2))",
    border: "rgba(56,189,248,0.6)",
    glow: "rgba(56,189,248,0.25)",
  },
  {
    id: "orta",
    label: "Orta",
    emoji: "🍃",
    desc: "Fan makinesi • %4 alan açılır",
    tool: "Yaprakları üfle",
    color: "linear-gradient(135deg, rgba(22,163,74,0.35), rgba(74,222,128,0.2))",
    border: "rgba(74,222,128,0.6)",
    glow: "rgba(74,222,128,0.25)",
  },
  {
    id: "zor",
    label: "Zor",
    emoji: "⛏️",
    desc: "Kum zemin • %3 alan açılır",
    tool: "Kürekle kaz",
    color: "linear-gradient(135deg, rgba(161,98,7,0.35), rgba(234,179,8,0.2))",
    border: "rgba(234,179,8,0.6)",
    glow: "rgba(234,179,8,0.25)",
  },
];

type Props = {
  categoryId: string;
  username: string;
  onHome: () => void;
};

export default function ImageGameScreen({ categoryId, onHome }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<ImageQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [floatingText, setFloatingText] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());

  const category = getImageCategory(categoryId) ?? IMAGE_CATEGORIES[0];

  const init = useCallback((diff: Difficulty) => {
    let qs: ImageQuestion[] = [];
    if (categoryId === "random") {
      const shuffled = [...IMAGE_CATEGORIES].sort(() => Math.random() - 0.5);
      for (const cat of shuffled) {
        qs.push(...getRandomImageQuestions(cat.id, 2));
        if (qs.length >= QUESTIONS_PER_GAME) break;
      }
      qs = qs.slice(0, QUESTIONS_PER_GAME);
    } else {
      qs = getRandomImageQuestions(categoryId, QUESTIONS_PER_GAME);
    }
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setXpGained(0);
    setCorrectCount(0);
    setFinished(false);
    setDifficulty(diff);
    startTimeRef.current = Date.now();
  }, [categoryId]);

  const showFloat = (text: string) => {
    setFloatingText(text);
    setTimeout(() => setFloatingText(null), 900);
  };

  const handleAnswer = useCallback((correct: boolean, xp: number) => {
    if (correct) {
      playCorrect();
      showFloat(`+${xp} XP ⭐`);
      setCorrectCount((c) => c + 1);
      setScore((s) => s + xp);
      setXpGained((x) => x + xp);
    } else {
      playWrong();
      showFloat("❌ Bilemedik!");
    }

    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= QUESTIONS_PER_GAME) {
        const totalCorrect = correctCount + (correct ? 1 : 0);
        if (totalCorrect >= QUESTIONS_PER_GAME * 0.6) playWin(); else playLose();
        setTimeout(() => setFinished(true), 800);
      }
      return next;
    });
  }, [correctCount]);

  // — Zorluk seçim ekranı —
  if (!difficulty) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 60%, #020817 100%)" }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button onClick={onHome} className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-200" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>←</button>
          <div className="text-center">
            <p className="text-white font-black text-sm">{category.emoji} {category.name}</p>
            <p className="text-zinc-400 text-xs">Görsel Mod</p>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-8">
          <div className="text-center mb-8">
            <p className="text-5xl mb-3">🎮</p>
            <h2 className="text-2xl font-black text-white mb-1">Zorluk Seç</h2>
            <p className="text-zinc-400 text-sm">Ne kadar zor, o kadar çok XP!</p>
          </div>

          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                onClick={() => init(d.id)}
                className="w-full p-5 rounded-2xl text-left transition-all active:scale-95"
                style={{ background: d.color, border: `2px solid ${d.border}`, boxShadow: `0 0 24px ${d.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{d.emoji}</span>
                    <div>
                      <p className="text-white font-black text-lg leading-none mb-1">{d.label}</p>
                      <p className="text-xs font-medium" style={{ color: d.border }}>{d.desc}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{d.tool}</p>
                    </div>
                  </div>
                  <div className="text-2xl opacity-60">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // — Bitiş ekranı —
  if (finished) {
    const accuracy = QUESTIONS_PER_GAME > 0 ? Math.round((correctCount / QUESTIONS_PER_GAME) * 100) : 0;
    const timeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 50%, #020817 100%)" }}>
        <div className="w-full max-w-md">
          <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(15,20,40,0.95), rgba(10,15,35,0.98))", border: "1px solid rgba(99,102,241,0.4)", boxShadow: "0 0 60px rgba(99,102,241,0.2)" }}>
            <div className="h-1.5" style={{ background: accuracy >= 60 ? "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" : "linear-gradient(90deg, #f59e0b, #ef4444)" }} />
            <div className="p-7">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{accuracy === 100 ? "🏆" : accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👏" : "💪"}</div>
                <h2 className="text-3xl font-black mb-1" style={{ color: accuracy >= 80 ? "#10b981" : accuracy >= 60 ? "#6366f1" : "#f59e0b" }}>
                  {accuracy === 100 ? "Mükemmel!" : accuracy >= 80 ? "Harika!" : accuracy >= 60 ? "İyi!" : "Tekrar Dene"}
                </h2>
                <p className="text-zinc-400 text-sm">🖼️ Görsel Mod — {diff.emoji} {diff.label} — {category.emoji} {category.name}</p>
              </div>

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
                    <span className="text-zinc-400 text-xs">{correctCount}/{QUESTIONS_PER_GAME}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Puan", value: score, color: "#6366f1" },
                  { label: "XP", value: `+${xpGained}`, color: "#f59e0b" },
                  { label: "Süre", value: `${timeSeconds}s`, color: "#06b6d4" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl p-3 text-center" style={{ background: `${color}28`, border: `1px solid ${color}50` }}>
                    <p className="font-black text-lg text-white">{value}</p>
                    <p className="text-zinc-400 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5">
                <button onClick={() => init(difficulty)} className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
                  🔄 Tekrar Oyna
                </button>
                <button onClick={() => setDifficulty(null)} className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}>
                  🎮 Zorluk Değiştir
                </button>
                <button onClick={onHome} className="w-full py-3.5 rounded-2xl font-bold text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#71717a" }}>
                  🏠 Ana Menü
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || currentIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 60%, #020817 100%)" }}>
      {floatingText && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-float">
          <span className="text-2xl font-black px-4 py-2 rounded-2xl text-yellow-400">{floatingText}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onHome} className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-200" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>←</button>
        <div className="text-center">
          <p className="text-white font-black text-sm">{category.emoji} {category.name}</p>
          <p className="text-xs" style={{ color: diff.border }}>{diff.emoji} {diff.label}</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(99,102,241,0.35)", border: "1px solid rgba(99,102,241,0.55)" }}>
          <span className="text-indigo-300 font-black text-sm">{score}</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col justify-center px-4 pb-6">
        <ImageQuestionCard
          key={currentQ.id}
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          difficulty={difficulty}
          onAnswer={handleAnswer}
        />
      </main>
    </div>
  );
}
