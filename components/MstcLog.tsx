// components/MstcLog.tsx

'use client';

import { AppData } from '@/types';

interface MstcLogProps {
  data: AppData;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function MstcLog({ data }: MstcLogProps) {
  const entries = Object.values(data.entries)
    .filter(e => e.mstcNotes && e.mstcNotes.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-zinc-100">
        🤖 MSTC Log
      </h3>
      <p className="text-xs text-zinc-600 mt-0.5">
        recent entries with notes
      </p>

      <div className="mt-3">
        {entries.length === 0 ? (
          <p className="text-xs text-zinc-600">
            No MSTC notes yet. Add one above.
          </p>
        ) : (
          <div className="space-y-0">
            {entries.map(entry => (
              <div
                key={entry.date}
                className="py-2 border-b border-zinc-800 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-mono">
                    {formatShortDate(entry.date)}
                  </span>
                  {entry.habits.mstc && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </div>
                <p className="text-sm text-zinc-300 mt-1 line-clamp-2">
                  {entry.mstcNotes}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
