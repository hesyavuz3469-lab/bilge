import { getTodayKey } from "./questions";

export type GameMode = "daily" | "endless";

export type PlayerStats = {
  totalGames: number;
  totalWins: number;
  totalCorrect: number;
  totalQuestions: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;
  totalXP: number;
  level: number;
  dailyCompleted: boolean;
  dailyDate: string;
  categoryStats: Record<string, { correct: number; total: number }>;
};

export type LeaderboardEntry = {
  name: string;
  score: number;
  correct: number;
  total: number;
  time: number;
  mode: GameMode;
  date: string;
};

export type SavedDailyState = {
  answers: (number | null)[];
  currentIndex: number;
  score: number;
  finished: boolean;
  startTime: number;
  dateKey: string;
};

const STATS_KEY = "bilge_stats";
const LEADERBOARD_KEY = "bilge_leaderboard";
const USERNAME_KEY = "bilge_username";
const DAILY_KEY = "bilge_daily";

// ─── XP / Level ───────────────────────────────────────────────────────────────

export const LEVEL_THRESHOLDS = [0, 150, 350, 650, 1100, 1700, 2500, 3600, 5000, 7000, 10000];

export function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getLevelProgress(xp: number): { percent: number; next: number } {
  const level = getLevel(xp);
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const percent = next === current ? 100 : Math.round(((xp - current) / (next - current)) * 100);
  return { percent, next };
}

export function getLevelTitle(level: number): string {
  const titles = ["", "Meraklı", "Öğrenci", "Araştırmacı", "Bilgili", "Zeki", "Usta", "Uzman", "Deha", "Efsane", "Bilge"];
  return titles[Math.min(level, titles.length - 1)] ?? "Efsane";
}

export function getLevelColor(level: number): string {
  const colors = ["", "#6b7280", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#f97316", "#fbbf24"];
  return colors[Math.min(level, colors.length - 1)] ?? "#fbbf24";
}

export function calculateXP(correct: number, total: number, streak: number, mode: GameMode, timeSeconds: number): number {
  const accuracy = correct / total;
  const base = correct * 20;
  const accuracyBonus = accuracy === 1 ? 100 : accuracy >= 0.8 ? 50 : 0;
  const streakBonus = Math.min(streak * 10, 100);
  const speedBonus = mode === "daily" ? Math.max(0, Math.floor((300 - timeSeconds) / 10)) : 0;
  const modeBonus = mode === "endless" ? 30 : 50;
  return base + accuracyBonus + streakBonus + speedBonus + modeBonus;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function defaultStats(): PlayerStats {
  return {
    totalGames: 0, totalWins: 0, totalCorrect: 0, totalQuestions: 0,
    currentStreak: 0, bestStreak: 0, lastPlayedDate: "",
    totalXP: 0, level: 1, dailyCompleted: false, dailyDate: "",
    categoryStats: {},
  };
}

export function getStats(): PlayerStats {
  if (typeof window === "undefined") return defaultStats();
  try { return { ...defaultStats(), ...JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}") }; }
  catch { return defaultStats(); }
}

export function updateStats(correct: number, total: number, mode: GameMode, timeSeconds: number, categoryId?: string): PlayerStats {
  const stats = getStats();
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  const won = correct / total >= 0.6;

  if (mode === "daily") {
    if (stats.lastPlayedDate === yesterday) stats.currentStreak += 1;
    else if (stats.lastPlayedDate !== today) stats.currentStreak = 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    stats.lastPlayedDate = today;
    stats.dailyCompleted = true;
    stats.dailyDate = today;
  }

  stats.totalGames += 1;
  if (won) stats.totalWins += 1;
  stats.totalCorrect += correct;
  stats.totalQuestions += total;

  const earned = calculateXP(correct, total, stats.currentStreak, mode, timeSeconds);
  stats.totalXP += earned;
  stats.level = getLevel(stats.totalXP);

  if (categoryId) {
    if (!stats.categoryStats[categoryId]) stats.categoryStats[categoryId] = { correct: 0, total: 0 };
    stats.categoryStats[categoryId].correct += correct;
    stats.categoryStats[categoryId].total += total;
  }

  if (typeof window !== "undefined") localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ─── Daily ────────────────────────────────────────────────────────────────────

export function saveDailyState(state: SavedDailyState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
}

export function loadDailyState(): SavedDailyState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DAILY_KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as SavedDailyState;
    return s.dateKey === getTodayKey() ? s : null;
  } catch { return null; }
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function saveToLeaderboard(entry: LeaderboardEntry): void {
  if (typeof window === "undefined") return;
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board.slice(0, 50)));
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) ?? "[]"); } catch { return []; }
}

// ─── User ─────────────────────────────────────────────────────────────────────

export function getUsername(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(USERNAME_KEY) ?? "";
}

export function saveUsername(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERNAME_KEY, name);
}

export function buildShareText(correct: number, total: number, mode: GameMode): string {
  const filled = "🟩".repeat(correct) + "⬛".repeat(total - correct);
  return `Bilge ${mode === "daily" ? "Günlük" : "Sonsuz"} Mod\n${correct}/${total} doğru\n\n${filled}\n\nbilge.vercel.app`;
}
