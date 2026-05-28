// components/StreakWidget.tsx

'use client';

import { useState } from 'react';

interface StreakWidgetProps {
  autoStreak: number;
  manualStreak: number;
  onUpdateStreak: (n: number) => void;
}

export default function StreakWidget({ autoStreak, manualStreak, onUpdateStreak }: StreakWidgetProps) {
  const [showOverride, setShowOverride] = useState(false);
  const [inputVal, setInputVal] = useState(String(manualStreak));

  const displayStreak = autoStreak > 0 ? autoStreak : manualStreak;
  const isManual = autoStreak === 0 && manualStreak > 0;

  return (
    <div className="p-4">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl">🔥</span>
        <span className="text-sm text-zinc-400">Current Streak:</span>
        <span className="text-2xl font-bold text-amber-400 font-mono">{displayStreak}</span>
        <span className="text-sm text-zinc-400">days</span>
        {isManual && (
          <span className="text-xs text-zinc-600">(manual)</span>
        )}
      </div>

      {displayStreak >= 3 && (
        <p className="text-xs text-zinc-600 mt-1 ml-10">Keep going.</p>
      )}
      {displayStreak === 0 && (
        <p className="text-xs text-zinc-600 mt-1 ml-10">Start today.</p>
      )}

      <div className="mt-2 ml-10">
        {!showOverride ? (
          <button
            onClick={() => setShowOverride(true)}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            (override)
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm w-16 px-2 py-1 font-mono rounded focus:outline-none focus:border-zinc-600"
            />
            <button
              onClick={() => {
                const n = parseInt(inputVal, 10);
                if (!isNaN(n) && n >= 0) {
                  onUpdateStreak(n);
                  setShowOverride(false);
                }
              }}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Set
            </button>
            <button
              onClick={() => setShowOverride(false)}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
