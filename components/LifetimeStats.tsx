// components/LifetimeStats.tsx

'use client';

import { HABITS, HabitKey } from '@/types';
import ProgressBar from './ProgressBar';

const HABIT_COLORS: Record<HabitKey, string> = {
  dsa: '#8b5cf6',
  oa: '#8b5cf6',
  project: '#0ea5e9',
  mstc: '#38bdf8',
  workout: '#10b981',
  water: '#60a5fa',
  no_doom: '#f87171',
  duolingo: '#fbbf24',
};

interface LifetimeStatsProps {
  stats: { [key in HabitKey]: number } & { total: number };
}

function SvgRing({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 12;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      aria-label={`${label}: ${pct}%`}
      className="flex-shrink-0"
    >
      <circle
        cx={16}
        cy={16}
        r={r}
        fill="none"
        stroke="#27272a"
        strokeWidth={3}
      />
      <circle
        cx={16}
        cy={16}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 16 16)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

export default function LifetimeStats({ stats }: LifetimeStatsProps) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-zinc-100 mb-3">
        Lifetime — all time
      </h3>

      <div className="space-y-2">
        {HABITS.sort((a, b) => a.priority - b.priority).map(habit => (
          <div key={habit.key} className="flex items-center gap-3">
            <SvgRing
              pct={stats[habit.key]}
              color={HABIT_COLORS[habit.key]}
              label={habit.label}
            />
            <span className="text-sm text-zinc-300 flex-1">
              {habit.emoji} {habit.label}
            </span>
            <span className="text-sm font-mono text-zinc-400">
              {stats[habit.key]}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-zinc-500">Total Progress (avg)</span>
        </div>
        <ProgressBar pct={stats.total} />
      </div>
    </div>
  );
}
