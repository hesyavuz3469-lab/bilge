"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QuestionCard from "./QuestionCard";
import ResultScreen from "./ResultScreen";
import { Question, Category, CATEGORIES, getRandomQuestions, getDailyQuestions, getTodayKey } from "@/lib/questions";
import { GameMode, updateStats, saveToLeaderboard, getStats, saveDailyState, loadDailyState } from "@/lib/storage";

const TIME_PER_QUESTION = 20;
const QUESTIONS_PER_GAME = 10;
const MAX_LIVES = 3;

const COMBO_MULTIPLIERS: Record<number, number> = { 3: 1.5, 5: 2, 7: 3 };

type FlashType = "correct" | "wrong" | "combo" | null;

type Props = {
  mode: GameMode;
  categoryId?: string;
  username: string;
  onHome: () => void;
};

export default function GameScreen({ mode, categoryId, username, onHome }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(1);
  const [flash, setFlash] = useState<FlashType>(null);
  const [floatingText, setFloatingText] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [finalStreak, setFinalStreak] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerFlash = (type: FlashType, text?: string) => {
    setFlash(type);
    if (text) { setFloatingText(text); setTimeout(() => setFloatingText(null), 900); }
    setTimeout(() => setFlash(null), 400);
  };

  const getComboMultiplier = (s: number): number => {
    let mult = 1;
    for (const [threshold, m] of Object.entries(COMBO_MULTIPLIERS)) {
      if (s >= Number(threshold)) mult = m;
    }
    return mult;
  };

  const init = useCallback(() => {
    let qs: Question[] = [];
    let cats: Category[] = [];

    if (mode === "daily") {
      const saved = loadDailyState();
      if (saved?.finished) {
        const { questions: dq } = getDailyQuestions(QUESTIONS_PER_GAME);
        qs = dq;
        cats = qs.map((q) => CATEGORIES.find((c) => c.questions.some((cq) => cq.id === q.id)) ?? CATEGORIES[0]);
        setQuestions(qs); setCategories(cats);
        setAnswers(saved.answers); setCurrentIndex(saved.currentIndex);
        setScore(saved.score); setFinished(true);
        return;
      }
      const { questions: dq } = getDailyQuestions(QUESTIONS_PER_GAME);
      qs = dq;
    } else {
      const cat = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
      qs = getRandomQuestions(cat.id, QUESTIONS_PER_GAME);
    }

    cats = qs.map((q) => CATEGORIES.find((c) => c.questions.some((cq) => cq.id === q.id)) ?? CATEGORIES[0]);
    setQuestions(qs); setCategories(cats);
    setAnswers(Array(qs.length).fill(null));
    setCurrentIndex(0); setScore(0); setStreak(0);
    setLives(MAX_LIVES); setCombo(1); setFinished(false);
    startTimeRef.current = Date.now();
  }, [mode, categoryId]);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (finished || questions.length === 0) return;
    setTimeLeft(TIME_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleAnswer(-1, false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, finished, questions.length]);

  const handleAnswer = useCallback((answerIdx: number, correct: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const newAnswers = answers.map((a, i) => i === currentIndex ? answerIdx : a);
    setAnswers(newAnswers);

    let newStreak = streak;
    let newLives = lives;
    let newCombo = combo;
    let addedScore = 0;

    if (correct) {
      newStreak = streak + 1;
      newCombo = getComboMultiplier(newStreak);
      const timeBonus = Math.max(0, timeLeft - 5) * 2;
      addedScore = Math.round((100 + timeBonus) * newCombo);

      if (newCombo > combo) {
        triggerFlash("combo", `🔥 x${newCombo} COMBO!`);
      } else {
        triggerFlash("correct", `+${addedScore}`);
      }
    } else {
      newStreak = 0;
      newCombo = 1;
      newLives = lives - 1;
      triggerFlash("wrong", answerIdx === -1 ? "⏰ Süre doldu!" : "✗ Yanlış!");
    }

    setStreak(newStreak);
    setCombo(newCombo);
    setLives(newLives);
    setScore((s) => s + addedScore);

    const next = currentIndex + 1;
    const gameOver = newLives <= 0;

    if (next >= questions.length || gameOver) {
      const totalCorrect = newAnswers.filter((a, i) => a === questions[i]?.correct).length;
      const timeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const prevStats = getStats();
      const newStats = updateStats(totalCorrect, questions.length, mode, timeSeconds, categoryId);
      setXpGained(newStats.totalXP - prevStats.totalXP);
      setFinalStreak(newStats.currentStreak);
      setFinished(true);

      if (mode === "daily") {
        saveDailyState({ answers: newAnswers, currentIndex: next, score: score + addedScore, finished: true, startTime: startTimeRef.current, dateKey: getTodayKey() });
      }
      saveToLeaderboard({ name: username, score: score + addedScore, correct: totalCorrect, total: questions.length, time: timeSeconds, mode, date: getTodayKey() });
    } else {
      setTimeout(() => setCurrentIndex(next), 900);
    }
  }, [currentIndex, questions, answers, streak, lives, combo, timeLeft, score, mode, categoryId, username]);

  if (finished && questions.length > 0) {
    const correct = answers.filter((a, i) => a === questions[i]?.correct).length;
    const timeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return <ResultScreen correct={correct} total={questions.length} score={score} timeSeconds={timeSeconds} mode={mode} xpGained={xpGained} streak={finalStreak} onPlayAgain={init} onHome={onHome} />;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentCat = categories[currentIndex] ?? CATEGORIES[0];
  const correctSoFar = answers.slice(0, currentIndex).filter((a, i) => a === questions[i]?.correct).length;

  const flashBg = flash === "correct" ? "rgba(16,185,129,0.08)" : flash === "wrong" ? "rgba(239,68,68,0.08)" : flash === "combo" ? "rgba(251,191,36,0.1)" : "transparent";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200" style={{ background: `linear-gradient(160deg, #020817 0%, #0d1526 60%, #020817 100%)` }}>
      {/* Flash overlay */}
      <div className="fixed inset-0 pointer-events-none z-20 transition-all duration-200" style={{ background: flashBg }} />

      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-64 rounded-full blur-3xl transition-all duration-500" style={{ background: `radial-gradient(ellipse, ${currentCat.color}18, transparent)` }} />
      </div>

      {/* Floating text */}
      {floatingText && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-float">
          <span className={`text-2xl font-black px-4 py-2 rounded-2xl ${flash === "combo" ? "text-yellow-400" : flash === "correct" ? "text-emerald-400" : "text-red-400"}`}>
            {floatingText}
          </span>
        </div>
      )}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onHome} className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>←</button>

        <div className="flex items-center gap-2">
          {/* Lives */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`text-base transition-all ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}>❤️</span>
            ))}
          </div>

          {/* Combo */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl animate-pop" style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)" }}>
              <span className="text-yellow-400 font-black text-sm">x{combo}</span>
              <span className="text-yellow-600 text-xs">COMBO</span>
            </div>
          )}

          {/* Score */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <span className="text-indigo-300 font-black text-sm">{score}</span>
          </div>
        </div>

        <div className="text-zinc-500 text-sm font-mono">{correctSoFar}/{currentIndex}</div>
      </div>

      {/* Game */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 pb-6">
        {currentQ && (
          <QuestionCard
            key={currentQ.id}
            question={currentQ}
            category={currentCat}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            timeLeft={timeLeft}
            maxTime={TIME_PER_QUESTION}
            onAnswer={handleAnswer}
            streak={streak}
          />
        )}
      </main>
    </div>
  );
}
