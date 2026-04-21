"use client";

import { useState } from "react";
import { saveUsername } from "@/lib/storage";

type Props = { onSave: (name: string) => void };

export default function UsernameModal({ onSave }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const t = name.trim();
    if (!t) return;
    saveUsername(t);
    onSave(t);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(2,8,23,0.95)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-sm animate-bounce-in">
        <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(145deg, #0d1526, #080f1e)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 60px rgba(99,102,241,0.15)" }}>
          <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-black text-white mb-2">Bilge&apos;ye Hoş Geldin!</h2>
            <p className="text-zinc-400 text-sm mb-6">Türkiye&apos;nin en zekice trivia oyunu</p>

            <div className="mb-6 p-4 rounded-2xl text-left space-y-2.5" style={{ background: "rgba(99,102,241,0.28)", border: "1px solid rgba(99,102,241,0.5)" }}>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-3">Nasıl Oynanır?</p>
              {[
                { icon: "📅", text: "Her gün yeni 10 soru seni bekliyor" },
                { icon: "♾️", text: "Sonsuz modda istediğin kategoride oyna" },
                { icon: "⏱️", text: "Her soruyu 20 saniyede yanıtla" },
                { icon: "⭐", text: "XP kazan, seviye atla, liderboard'a çık" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <span className="text-lg">{icon}</span>
                  <span className="text-zinc-300 text-sm">{text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kullanıcı adın..."
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl text-center text-base font-bold text-white placeholder:text-zinc-600 focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(99,102,241,0.5)" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.7)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(99,102,241,0.3)"}
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-4 rounded-2xl font-black text-base transition-all active:scale-95 disabled:opacity-40"
                style={{ background: name.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)", color: "white", boxShadow: name.trim() ? "0 4px 24px rgba(99,102,241,0.4)" : "none" }}
              >
                Oynamaya Başla →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
