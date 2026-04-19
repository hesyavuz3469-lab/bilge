"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QuestionCard from "./QuestionCard";
import ResultScreen from "./ResultScreen";
import { Question, Category, CATEGORIES, getRandomQuestions, getDailyQuestions, getTodayKey } from "@/lib/questions";
import { GameMode, updateStats, saveToLeaderboard, calculateXP, getStats, saveDailyState, loadDailyState } from "@/lib/storage";

const TIME_PER_QUESTION = 20;
const QUESTIONS_PER_GAME = 10;

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
  const [finished, setFinished] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [finalStreak, setFinalStreak] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const init = useCallback(() => {
    let qs: Question[] = [];
    let cats: Category[] = [];

    if (mode === "daily") {
      const saved = loadDailyState();
      if (saved?.finished) {
        const { questions: dq } = getDailyQuestions(QUESTIONS_PER_GAME);
        qs = dq;
        cats = qs.map((q) => {
          const cat = CATEGORIES.find((c) => c.questions.some((cq) => cq.id === q.id));
          return cat ?? CATEGORIES[0];
        });
        setQuestions(qs);
        setCategories(cats);
        setAnswers(saved.answers);
        setCurrentIndex(saved.currentIndex);
        setScore(saved.score);
        setFinished(true);
        return;
      }
      const { questions: dq } = getDailyQuestions(QUESTIONS_PER_GAME);
      qs = dq;
    } else {
      const cat = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
      qs = getRandomQuestions(cat.id, QUESTIONS_PER_GAME);
    }

    cats = qs.map((q) => {
      const cat = CATEGORIES.find((c) => c.questions.some((cq) => cq.id === q.id));
      return cat ?? CATEGORIES[0];
    });

    setQuestions(qs);
    setCategories(cats);
    setAnswers(Array(qs.length).fill(null));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFinished(false);
    startTimeRef.current = Date.now();
  }, [mode, categoryId]);

  useEffect(() => { init(); }, [init]);

  // Timer
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

    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = answerIdx;
      return next;
    });

    if (correct) {
      const timeBonus = Math.max(0, timeLeft - 5) * 2;
      const streakBonus = streak >= 2 ? streak * 5 : 0;
      setScore((s) => s + 100 + timeBonus + streakBonus);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    const next = currentIndex + 1;
    if (next >= questions.length) {
      const totalCorrect = answers.filter((a, i) => i < currentIndex && a === questions[i]?.correct).length + (correct ? 1 : 0);
      const timeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const prevStats = getStats();
      const newStats = updateStats(totalCorrect, questions.length, mode, timeSeconds, categoryId);
      const earned = newStats.totalXP - prevStats.totalXP;
      setXpGained(earned);
      setFinalStreak(newStats.currentStreak);
      setFinished(true);

      if (mode === "daily") {
        saveDailyState({ answers: answers.map((a, i) => i === currentIndex ? answerIdx : a), currentIndex: next, score: score + (correct ? 100 : 0), finished: true, startTime: startTimeRef.current, dateKey: getTodayKey() });
      }

      saveToLeaderboard({ name: username, score: score + (correct ? 100 : 0), correct: totalCorrect, total: questions.length, time: timeSeconds, mode, date: getTodayKey() });
    } else {
      setTimeout(() => setCurrentIndex(next), 50);
    }
  }, [currentIndex, questions, answers, streak, timeLeft, score, mode, categoryId, username]);

  if (finished && questions.length > 0) {
    const correct = answers.filter((a, i) => a === questions[i]?.correct).length;
    const timeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return (
      <ResultScreen
        correct={correct}
        total={questions.length}
        score={score}
        timeSeconds={timeSeconds}
        mode={mode}
        xpGained={xpGained}
        streak={finalStreak}
        onPlayAgain={init}
        onHome={onHome}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-400">Sorular yükleniyor...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentCat = categories[currentIndex] ?? CATEGORIES[0];
  const correctSoFar = answers.slice(0, currentIndex).filter((a, i) => a === questions[i]?.correct).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #020817 0%, #0d1526 60%, #020817 100%)" }}>
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-64 rounded-full blur-3xl" style={{ background: `radial-gradient(ellipse, ${currentCat.color}18, transparent)` }} />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onHome} className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          ←
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <span className="text-yellow-400 font-black text-sm">{score}</span>
            <span className="text-zinc-500 text-xs">puan</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span className="text-emerald-400 font-black text-sm">{correctSoFar}</span>
            <span className="text-zinc-500 text-xs">doğru</span>
          </div>
        </div>
        <div className="text-zinc-500 text-sm font-mono">{currentIndex + 1}/{questions.length}</div>
      </div>

      {/* Game */}
      <main className="flex-1 flex flex-col justify-center px-4 pb-6">
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
