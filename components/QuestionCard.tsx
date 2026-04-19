"use client";

import { useState, useEffect } from "react";
import { Question, Category } from "@/lib/questions";

type AnswerState = "idle" | "correct" | "wrong";

type Props = {
  question: Question;
  category: Category;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  maxTime: number;
  onAnswer: (index: number, correct: boolean) => void;
  streak: number;
};

export default function QuestionCard({
  question, category, questionIndex, totalQuestions,
  timeLeft, maxTime, onAnswer, streak,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [floatingScore, setFloatingScore] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
    setAnswerState("idle");
    setFloatingScore(null);
  }, [question.id]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    const correct = idx === question.correct;
    setSelected(idx);
    setAnswerState(correct ? "correct" : "wrong");

    if (correct) {
      const bonus = streak >= 3 ? ` +${streak}🔥` : "";
      setFloatingScore(`+20 XP${bonus}`);
      setTimeout(() => setFloatingScore(null), 800);
    }

    setTimeout(() => onAnswer(idx, correct), 900);
  };

  const timerPercent = (timeLeft / maxTime) * 100;
  const timerDanger = timeLeft <= 5;

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">
      {/* Progress + Timer */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Soru {questionIndex + 1}/{totalQuestions}</span>
            <span className="flex items-center gap-1">
              <span>{category.emoji}</span>
              <span style={{ color: category.color }}>{category.name}</span>
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((questionIndex) / totalQuestions) * 100}%`,
                background: `linear-gradient(90deg, ${category.color}, #6366f1)`,
              }}
            />
          </div>
        </div>

        {/* Timer */}
        <div
          className={`relative w-12 h-12 flex-shrink-0 ${timerDanger ? "animate-timer-danger" : ""}`}
        >
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke={timerDanger ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#6366f1"}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPercent / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-sm font-black ${timerDanger ? "text-red-400" : "text-white"}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Streak badge */}
      {streak >= 2 && (
        <div className="flex justify-center mb-3 animate-pop">
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", color: "#fb923c" }}>
            🔥 {streak} doğru seri!
          </span>
        </div>
      )}

      {/* Question */}
      <div className="relative mb-5 p-6 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 0 40px rgba(99,102,241,0.1)" }}>
        <p className="text-white text-lg font-bold leading-relaxed text-center">
          {question.question}
        </p>

        {/* Floating score */}
        {floatingScore && (
          <div className="absolute top-2 right-4 text-yellow-400 font-black text-sm animate-float pointer-events-none">
            {floatingScore}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correct;
          const showCorrect = selected !== null && isCorrect;
          const showWrong = selected !== null && isSelected && !isCorrect;

          let style: React.CSSProperties = {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          };

          let className = "w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-200 text-left cursor-pointer active:scale-98";

          if (showCorrect) {
            style = { background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.6)", boxShadow: "0 0 20px rgba(16,185,129,0.3)" };
            className += " animate-correct";
          } else if (showWrong) {
            style = { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.6)", boxShadow: "0 0 20px rgba(239,68,68,0.3)" };
            className += " animate-wrong";
          } else if (selected === null) {
            className += " hover:border-indigo-500/50 hover:bg-indigo-500/10";
          }

          return (
            <button key={idx} onClick={() => handleSelect(idx)} className={className} style={style} disabled={selected !== null}>
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{
                  background: showCorrect ? "rgba(16,185,129,0.4)" : showWrong ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.3)",
                  color: showCorrect ? "#34d399" : showWrong ? "#f87171" : "#a5b4fc",
                }}
              >
                {showCorrect ? "✓" : showWrong ? "✗" : optionLetters[idx]}
              </span>
              <span className={`font-medium ${showCorrect ? "text-emerald-300" : showWrong ? "text-red-300" : "text-white"}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {selected !== null && question.explanation && (
        <div className="mt-3 p-3 rounded-xl animate-fade-up" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p className="text-zinc-400 text-xs">💡 {question.explanation}</p>
        </div>
      )}
    </div>
  );
}
