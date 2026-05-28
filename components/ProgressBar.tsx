// components/ProgressBar.tsx

'use client';

interface ProgressBarProps {
  pct: number;
  width?: number;
  color?: string;
}

export default function ProgressBar({ pct, width = 21, color }: ProgressBarProps) {
  const filled = Math.floor((pct / 100) * width);
  const empty = width - filled;

  return (
    <span className="font-mono text-sm whitespace-pre">
      <span className={color || 'text-emerald-400'}>{'█'.repeat(filled)}</span>
      <span className="text-zinc-700">{'░'.repeat(empty)}</span>
      <span className="text-zinc-400"> {pct}%</span>
    </span>
  );
}
