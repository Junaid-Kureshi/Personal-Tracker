// types/index.ts

export type HabitKey =
  | 'dsa'
  | 'oa'
  | 'project'
  | 'mstc'
  | 'workout'
  | 'water'
  | 'no_doom'
  | 'duolingo';

export interface HabitMeta {
  key: HabitKey;
  label: string;
  emoji: string;
  priority: number;
}

export const HABITS: HabitMeta[] = [
  { key: 'dsa',      label: 'DSA',              emoji: '💻', priority: 1 },
  { key: 'oa',       label: 'OA Practice',      emoji: '🧠', priority: 2 },
  { key: 'project',  label: 'Project Work',     emoji: '🚀', priority: 3 },
  { key: 'mstc',     label: 'MSTC AI/GenAI',    emoji: '🤖', priority: 4 },
  { key: 'workout',  label: 'Pushups/Workout',  emoji: '💪', priority: 5 },
  { key: 'water',    label: 'Water',            emoji: '💧', priority: 6 },
  { key: 'no_doom',  label: 'No Doomscrolling', emoji: '📵', priority: 7 },
  { key: 'duolingo', label: 'Duolingo',         emoji: '📱', priority: 8 },
];

export interface DayEntry {
  date: string;           // 'YYYY-MM-DD' — the primary key
  habits: Record<HabitKey, boolean>;
  mstcNotes: string;      // Optional freetext log
  createdAt: string;      // ISO timestamp
}

export interface AppData {
  entries: Record<string, DayEntry>; // keyed by date string
  manualStreak: number;              // user-editable fallback
}

export function calcProgress(entry: DayEntry): number {
  const checked = HABITS.filter(h => entry.habits[h.key]).length;
  return Math.round((checked / HABITS.length) * 100);
}

export function progressBar(pct: number, width = 21): string {
  const filled = Math.floor((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled) + ` ${pct}%`;
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}
