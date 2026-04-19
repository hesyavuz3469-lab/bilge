import { PlayerStats } from "./storage";

export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  unlocked: boolean;
};

export function getBadges(stats: PlayerStats): Badge[] {
  return [
    {
      id: "first_game",
      name: "İlk Adım",
      description: "İlk oyununu tamamla",
      emoji: "🎮",
      color: "#6366f1",
      unlocked: stats.totalGames >= 1,
    },
    {
      id: "perfect_score",
      name: "Kusursuz",
      description: "Bir oyunda tüm soruları doğru yanıtla",
      emoji: "🏆",
      color: "#fbbf24",
      unlocked: stats.totalQuestions >= 10 && stats.totalCorrect === stats.totalQuestions,
    },
    {
      id: "streak_3",
      name: "Azimli",
      description: "3 günlük seri yap",
      emoji: "🔥",
      color: "#f97316",
      unlocked: stats.bestStreak >= 3,
    },
    {
      id: "streak_7",
      name: "Haftanın Bilgesi",
      description: "7 günlük seri yap",
      emoji: "⚡",
      color: "#f59e0b",
      unlocked: stats.bestStreak >= 7,
    },
    {
      id: "streak_30",
      name: "Efsane Seri",
      description: "30 günlük seri yap",
      emoji: "👑",
      color: "#ec4899",
      unlocked: stats.bestStreak >= 30,
    },
    {
      id: "games_10",
      name: "Düzenli",
      description: "10 oyun oyna",
      emoji: "📅",
      color: "#10b981",
      unlocked: stats.totalGames >= 10,
    },
    {
      id: "games_50",
      name: "Bağımlı",
      description: "50 oyun oyna",
      emoji: "🎯",
      color: "#06b6d4",
      unlocked: stats.totalGames >= 50,
    },
    {
      id: "accuracy_80",
      name: "Keskin Zeka",
      description: "%80 doğruluk oranına ulaş",
      emoji: "🧠",
      color: "#8b5cf6",
      unlocked: stats.totalQuestions >= 20 && (stats.totalCorrect / stats.totalQuestions) >= 0.8,
    },
    {
      id: "level_5",
      name: "Yükselen Yıldız",
      description: "Seviye 5'e ulaş",
      emoji: "⭐",
      color: "#f59e0b",
      unlocked: stats.level >= 5,
    },
    {
      id: "level_10",
      name: "Gerçek Bilge",
      description: "Seviye 10'a ulaş",
      emoji: "🌟",
      color: "#fbbf24",
      unlocked: stats.level >= 10,
    },
    {
      id: "xp_1000",
      name: "XP Avcısı",
      description: "1000 XP kazan",
      emoji: "💎",
      color: "#06b6d4",
      unlocked: stats.totalXP >= 1000,
    },
    {
      id: "xp_5000",
      name: "XP Ustası",
      description: "5000 XP kazan",
      emoji: "💫",
      color: "#8b5cf6",
      unlocked: stats.totalXP >= 5000,
    },
  ];
}
