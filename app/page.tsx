// app/page.tsx

'use client';

import { useMemo, useCallback } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { today, HabitKey, DayEntry, HABITS } from '@/types';
import { getAutoStreak, getLifetimeStats, getWeeklyData, getMonthlyData } from '@/lib/stats';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import TodayChecklist from '@/components/TodayChecklist';
import StreakWidget from '@/components/StreakWidget';
import LifetimeStats from '@/components/LifetimeStats';
import MstcLog from '@/components/MstcLog';
import TabPanel from '@/components/TabPanel';
import ChartWeek from '@/components/ChartWeek';
import ChartMonth from '@/components/ChartMonth';
import CalendarView from '@/components/CalendarView';

function DashboardContent() {
  const { data, getEntry, upsertEntry, updateStreak, isLoaded } = useAppData();

  const todayStr = today();
  const todayEntry = getEntry(todayStr);

  const handleToggle = useCallback(
    (key: HabitKey) => {
      const entry = data.entries[todayStr] || {
        date: todayStr,
        habits: HABITS.reduce((acc, h) => ({ ...acc, [h.key]: false }), {} as Record<HabitKey, boolean>),
        mstcNotes: '',
        createdAt: new Date().toISOString(),
      };

      const updated: DayEntry = {
        ...entry,
        habits: {
          ...entry.habits,
          [key]: !entry.habits[key],
        },
      };
      upsertEntry(updated);
    },
    [data.entries, todayStr, upsertEntry]
  );

  const handleNotesChange = useCallback(
    (notes: string) => {
      const entry = data.entries[todayStr] || {
        date: todayStr,
        habits: HABITS.reduce((acc, h) => ({ ...acc, [h.key]: false }), {} as Record<HabitKey, boolean>),
        mstcNotes: '',
        createdAt: new Date().toISOString(),
      };

      const updated: DayEntry = {
        ...entry,
        mstcNotes: notes,
      };
      upsertEntry(updated);
    },
    [data.entries, todayStr, upsertEntry]
  );

  const autoStreak = useMemo(() => getAutoStreak(data), [data]);
  const lifetimeStats = useMemo(() => getLifetimeStats(data), [data]);
  const weeklyData = useMemo(() => getWeeklyData(data), [data]);
  const monthlyData = useMemo(() => getMonthlyData(data), [data]);

  // Loading skeleton
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="p-4">
            <div className="h-6 w-48 bg-zinc-900 rounded animate-pulse" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 bg-zinc-900 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'week',
      label: 'This Week',
      content: <ChartWeek data={weeklyData} />,
    },
    {
      id: 'month',
      label: 'This Month',
      content: <ChartMonth data={monthlyData} />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      content: <CalendarView data={data} />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-baseline gap-3">
          <h1 className="text-base font-semibold text-zinc-100">
            Placement Prep
          </h1>
          <span className="text-xs text-zinc-600 font-mono">
            discipline dashboard
          </span>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex">
          {/* Left column */}
          <div className="lg:w-[35%] lg:border-r border-zinc-800 lg:min-h-[calc(100vh-49px)]">
            <TodayChecklist
              entry={todayEntry}
              onToggle={handleToggle}
              onNotesChange={handleNotesChange}
            />

            <div className="border-t border-zinc-800">
              <StreakWidget
                autoStreak={autoStreak}
                manualStreak={data.manualStreak}
                onUpdateStreak={updateStreak}
              />
            </div>

            <div className="border-t border-zinc-800">
              <LifetimeStats stats={lifetimeStats} />
            </div>

            <div className="border-t border-zinc-800">
              <MstcLog data={data} />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:w-[65%]">
            <TabPanel tabs={tabs} defaultTab="week" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
