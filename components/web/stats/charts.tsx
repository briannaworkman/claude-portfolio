'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import { AXIS_STYLE, GREEN, GRID_STYLE } from './constants';
import { fmt, trendData } from './utils';

function TrendChart({
  title,
  height = 185,
  children,
}: {
  title: string;
  height?: number;
  children: React.ReactElement;
}) {
  return (
    <div className="border border-white/8 bg-white/3 rounded p-5">
      <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-4">{title}</div>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/15 rounded px-3 py-2 font-mono text-xs shadow-xl">
      <div className="text-white/40 mb-1.5">{label}</div>
      {payload.map((p: Payload<ValueType, NameType>) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          <span style={{ color: p.color }}>▸</span>
          <span className="text-white/60">{p.name}:</span>
          <span style={{ color: p.color }} className="font-semibold">
            {p.value != null ? fmt(Number(p.value)) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrendsTab({ hasEnoughData }: { hasEnoughData: boolean }) {
  return (
    <div className="space-y-5 stats-fade-up">
      <p className="text-xs font-mono text-white/35 leading-relaxed">
        Month-over-month velocity across all tracked periods.
        {!hasEnoughData && (
          <span className="text-amber-400/60"> Charts fill in as months accumulate.</span>
        )}
      </p>

      <TrendChart title="Goal Rate & Daily Velocity" height={200}>
        <LineChart data={trendData} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="label" tick={AXIS_STYLE} />
          <YAxis yAxisId="left" tick={AXIS_STYLE} domain={[80, 100]} unit="%" />
          <YAxis yAxisId="right" orientation="right" tick={AXIS_STYLE} />
          <Tooltip content={(p) => <ChartTooltip {...p} />} />
          <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 11, color: '#ffffff45' }} />
          <ReferenceLine yAxisId="left" y={90} stroke="#ffffff08" strokeDasharray="4 4" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="goalRate"
            name="goal rate %"
            stroke={GREEN}
            strokeWidth={2}
            dot={{ fill: GREEN, r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="msgsPerDay"
            name="msgs / day"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ fill: '#7c3aed', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </TrendChart>

      <TrendChart title="Output Volume" height={190}>
        <LineChart data={trendData} margin={{ top: 4, right: 12, bottom: 0, left: -10 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="label" tick={AXIS_STYLE} />
          <YAxis tick={AXIS_STYLE} />
          <Tooltip content={(p) => <ChartTooltip {...p} />} />
          <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 11, color: '#ffffff45' }} />
          <Line
            type="monotone"
            dataKey="messages"
            name="messages"
            stroke={GREEN}
            strokeWidth={2}
            dot={{ fill: GREEN, r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="commits"
            name="commits"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </TrendChart>

      <TrendChart title="Agent Orchestration" height={180}>
        <BarChart data={trendData} margin={{ top: 4, right: 12, bottom: 0, left: -10 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="label" tick={AXIS_STYLE} />
          <YAxis tick={AXIS_STYLE} />
          <Tooltip content={(p) => <ChartTooltip {...p} />} />
          <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 11, color: '#ffffff45' }} />
          <Bar
            dataKey="agentCalls"
            name="agent calls"
            fill="#f59e0b"
            opacity={0.8}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </TrendChart>

      <TrendChart title="Lines Added per Month" height={170}>
        <BarChart data={trendData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="label" tick={AXIS_STYLE} />
          <YAxis tick={AXIS_STYLE} />
          <Tooltip content={(p) => <ChartTooltip {...p} />} />
          <Bar
            dataKey="linesAdded"
            name="lines added"
            fill={GREEN}
            opacity={0.7}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </TrendChart>
    </div>
  );
}
