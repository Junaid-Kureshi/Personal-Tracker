// components/CalendarView.tsx

'use client';

import { useState } from 'react';
import { AppData, calcProgress, today } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  data: AppData;
}

function getProgressColor(pct: number): string {
  if (pct === 0) return 'bg-zinc-950';
  if (pct < 25) return 'bg-zinc-800';
  if (pct < 50) return 'bg-violet-950';
  if (pct < 75) return 'bg-violet-900';
  if (pct < 100) return 'bg-violet-800';
  return 'bg-violet-600';
}

export default function CalendarView({ data }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const todayStr = today();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get first day of month (0=Sun, adjust for Mon start)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon=0

  const monthName = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-sm font-semibold text-zinc-100">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center text-[10px] text-zinc-600 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = data.entries[dateStr];
          const pct = entry ? calcProgress(entry) : 0;
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              className={`aspect-square relative p-0.5 min-w-[36px] ${
                getProgressColor(pct)
              } ${isToday ? 'ring-1 ring-violet-400' : ''}`}
            >
              <span className="absolute top-0.5 right-1 text-[10px] text-zinc-500">
                {day}
              </span>
              {pct > 0 && (
                <span className="absolute bottom-0.5 left-1 text-[10px] font-mono text-zinc-400">
                  {pct}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
