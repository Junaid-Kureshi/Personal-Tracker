// components/TodayChecklist.tsx

'use client';

import { HABITS, DayEntry, HabitKey, calcProgress, today } from '@/types';
import ProgressBar from './ProgressBar';

interface TodayChecklistProps {
  entry: DayEntry | undefined;
  onToggle: (key: HabitKey) => void;
  onNotesChange: (notes: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDayOfYear(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export default function TodayChecklist({ entry, onToggle, onNotesChange }: TodayChecklistProps) {
  const todayStr = today();
  const dayOfYear = getDayOfYear(todayStr);
  const pct = entry ? calcProgress(entry) : 0;

  return (
    <div className="p-4">
      {/* Date header */}
      <h2 className="text-lg font-semibold text-zinc-100">
        {formatDate(todayStr)}
      </h2>
      <p className="text-xs text-zinc-600 mt-0.5">
        • Day {dayOfYear} of {new Date().getFullYear()}
      </p>

      {/* Habit list */}
      <div className="mt-4 space-y-1">
        {HABITS.sort((a, b) => a.priority - b.priority).map(habit => {
          const checked = entry?.habits[habit.key] ?? false;
          return (
            <button
              key={habit.key}
              onClick={() => onToggle(habit.key)}
              aria-label={habit.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors min-h-[44px] ${
                checked
                  ? 'text-zinc-100 bg-zinc-900/50'
                  : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/30'
              }`}
            >
              <span className={`flex-shrink-0 w-5 h-5 border rounded-sm flex items-center justify-center text-xs ${
                checked
                  ? 'bg-violet-500/20 border-violet-500 text-violet-400'
                  : 'border-zinc-700'
              }`}>
                {checked && '✓'}
              </span>
              <span className="text-base">{habit.emoji}</span>
              <span className={`text-sm font-medium ${checked ? 'text-zinc-100' : ''}`}>
                {habit.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 px-3">
        <ProgressBar pct={pct} />
      </div>

      {/* MSTC notes */}
      <div className="mt-4">
        <textarea
          placeholder="MSTC / GenAI log for today..."
          value={entry?.mstcNotes ?? ''}
          onChange={e => onNotesChange(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm resize-none h-20 w-full p-2 font-mono rounded focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>
    </div>
  );
}
