// lib/stats.ts

import { AppData, DayEntry, HabitKey, HABITS, calcProgress } from '@/types';

export function getEntriesInRange(
  data: AppData,
  startDate: string,
  endDate: string
): DayEntry[] {
  const entries: DayEntry[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const [dateStr, entry] of Object.entries(data.entries)) {
    const d = new Date(dateStr);
    if (d >= start && d <= end) {
      entries.push(entry);
    }
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function getAutoStreak(data: AppData): number {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  // Check today first
  const todayStr = d.toISOString().split('T')[0];
  const todayEntry = data.entries[todayStr];
  const todayHasChecked = todayEntry
    ? HABITS.some(h => todayEntry.habits[h.key])
    : false;

  if (!todayHasChecked) {
    // Check yesterday
    const yesterday = new Date(d);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayEntry = data.entries[yesterdayStr];
    const yesterdayHasChecked = yesterdayEntry
      ? HABITS.some(h => yesterdayEntry.habits[h.key])
      : false;

    if (!yesterdayHasChecked) {
      return 0;
    }

    // Start counting from yesterday
    d.setDate(d.getDate() - 1);
  }

  // Count consecutive days
  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    const entry = data.entries[dateStr];
    const hasChecked = entry
      ? HABITS.some(h => entry.habits[h.key])
      : false;

    if (!hasChecked) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

export function getLifetimeStats(
  data: AppData
): { [key in HabitKey]: number } & { total: number } {
  const entries = Object.values(data.entries);
  const count = entries.length;

  if (count === 0) {
    const result = {} as { [key in HabitKey]: number } & { total: number };
    HABITS.forEach(h => {
      result[h.key] = 0;
    });
    result.total = 0;
    return result;
  }

  const result = {} as { [key in HabitKey]: number } & { total: number };
  HABITS.forEach(h => {
    const checked = entries.filter(e => e.habits[h.key]).length;
    result[h.key] = Math.round((checked / count) * 100);
  });

  const totalProgress = entries.reduce((sum, e) => sum + calcProgress(e), 0);
  result.total = Math.round(totalProgress / count);

  return result;
}

export function getWeeklyData(
  data: AppData
): { date: string; progress: number }[] {
  const result: { date: string; progress: number }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(d);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const entry = data.entries[dateStr];
    result.push({
      date: dateStr,
      progress: entry ? calcProgress(entry) : 0,
    });
  }

  return result;
}

export function getMonthlyData(
  data: AppData
): { date: string; progress: number }[] {
  const result: { date: string; progress: number }[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const entry = data.entries[dateStr];
    result.push({
      date: dateStr,
      progress: entry ? calcProgress(entry) : 0,
    });
  }

  return result;
}
