// components/ChartWeek.tsx

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartWeekProps {
  data: { date: string; progress: number }[];
}

function formatTick(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export default function ChartWeek({ data }: ChartWeekProps) {
  const hasData = data.some(d => d.progress > 0);

  return (
    <div className="relative">
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-sm text-zinc-600">No data yet</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatTick}
            tick={{ fill: '#71717a', fontSize: 12 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={{ stroke: '#27272a' }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => v + '%'}
            tick={{ fill: '#71717a', fontSize: 12 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={{ stroke: '#27272a' }}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#27272a',
              borderColor: '#3f3f46',
              color: '#f4f4f5',
              borderRadius: '4px',
              fontSize: '13px',
            }}
            labelStyle={{ color: '#a1a1aa' }}
            labelFormatter={formatTick}
            formatter={(v: number) => [v + '%', 'Progress']}
          />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ fill: '#09090b', stroke: '#34d399', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#34d399', stroke: '#34d399', strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
