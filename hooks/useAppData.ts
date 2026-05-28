// hooks/useAppData.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppData, DayEntry, HabitKey, HABITS, today } from '@/types';

const STORAGE_KEY = 'placement_tracker_v1';

function createBlankEntry(date: string): DayEntry {
  const habits = {} as Record<HabitKey, boolean>;
  HABITS.forEach(h => {
    habits[h.key] = false;
  });
  return {
    date,
    habits,
    mstcNotes: '',
    createdAt: new Date().toISOString(),
  };
}

function loadData(): AppData {
  if (typeof window === 'undefined') {
    return { entries: {}, manualStreak: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AppData;
    }
  } catch {
    // corrupted data
  }
  return { entries: {}, manualStreak: 0 };
}

function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function useAppData() {
  const [data, setData] = useState<AppData>({ entries: {}, manualStreak: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadData();
    const todayStr = today();

    // Auto-create today's entry if missing
    if (!loaded.entries[todayStr]) {
      loaded.entries[todayStr] = createBlankEntry(todayStr);
      saveData(loaded);
    }

    setData(loaded);
    setIsLoaded(true);
  }, []);

  const getEntry = useCallback(
    (date: string): DayEntry | undefined => {
      return data.entries[date];
    },
    [data]
  );

  const upsertEntry = useCallback(
    (entry: DayEntry) => {
      setData(prev => {
        const next = {
          ...prev,
          entries: {
            ...prev.entries,
            [entry.date]: entry,
          },
        };
        saveData(next);
        return next;
      });
    },
    []
  );

  const updateStreak = useCallback(
    (n: number) => {
      setData(prev => {
        const next = { ...prev, manualStreak: n };
        saveData(next);
        return next;
      });
    },
    []
  );

  return { data, getEntry, upsertEntry, updateStreak, isLoaded };
}
