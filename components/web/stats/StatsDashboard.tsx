'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import type { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import {
  STATS_DATA,
  ASSESSMENT,
  type MonthData,
  type MonthMetrics,
  type HorizonItem,
  type ImplementedItem,
} from '@/data/stats';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GREEN = '#00ff9d';

const EFFORT_COLORS = {
  low:    { bg: 'bg-emerald-900/40', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  medium: { bg: 'bg-amber-900/40',   border: 'border-amber-500/40',   text: 'text-amber-400'   },
  high:   { bg: 'bg-rose-900/40',    border: 'border-rose-500/40',    text: 'text-rose-400'    },
} as const;

const AXIS_STYLE = { fontFamily: 'monospace', fontSize: 10, fill: '#ffffff30' };
const GRID_STYLE = { stroke: '#ffffff08', strokeDasharray: '3 3' };

const TAB_LABELS: Record<string, string> = {
  metrics:     'metrics',
  trends:      'trends',
  assessment:  'assessment',
  horizon:     'on the horizon',
  implemented: 'implemented',
};

const TABS = ['metrics', 'trends', 'assessment', 'horizon', 'implemented'];

// ─── TREND DATA (derived once at module level) ────────────────────────────────
const trendData = STATS_DATA.map((d) => ({
  label:            d.slug,
  messages:         d.metrics.messages,
  commits:          d.metrics.commits,
  goalRate:         d.metrics.goalRate,
  agentCalls:       d.metrics.agentCalls,
  msgsPerDay:       d.metrics.msgsPerDay,
  linesAdded:       d.metrics.linesAdded,
  multiClaudingPct: d.metrics.multiClaudingPct,
  frictionScore:    d.metrics.frictionScore,
}));

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n: number | string): string {
  return typeof n === 'number' && n >= 1000 ? n.toLocaleString() : String(n);
}

type DeltaResult = { display: string; color: string };

function getDelta(
  current: MonthData,
  prev: MonthData | null,
  key: keyof MonthMetrics,
  invertGood = false,
): DeltaResult | null {
  if (!prev) return null;
  const diff = current.metrics[key] - prev.metrics[key];
  if (diff === 0) return null;
  const up = diff > 0;
  return {
    display: `${up ? '▲' : '▼'} ${Math.abs(diff)}`,
    color: (invertGood ? !up : up) ? GREEN : '#f43f5e',
  };
}

function getDeltaPct(
  current: MonthData,
  prev: MonthData | null,
  key: keyof MonthMetrics,
  invertGood = false,
): DeltaResult | null {
  if (!prev) return null;
  const diff = current.metrics[key] - prev.metrics[key];
  if (diff === 0) return null;
  const up = diff > 0;
  return {
    display: `${up ? '▲' : '▼'} ${Math.abs(diff)}%`,
    color: (invertGood ? !up : up) ? GREEN : '#f43f5e',
  };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.8) 2px,rgba(0,0,0,.8) 4px)',
      }}
    />
  );
}

function TerminalBadge({ text, color = GREEN }: { text: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded border"
      style={{ color, borderColor: `${color}40`, background: `${color}10` }}
    >
      <span>▸</span>
      {text}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent = GREEN,
  sublabel,
  delta,
  suffix = '',
}: {
  label: string;
  value: number;
  accent?: string;
  sublabel?: string;
  delta?: DeltaResult | null;
  suffix?: string;
}) {
  return (
    <div className="relative group border border-white/8 bg-white/3 rounded p-4 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/5">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accent}10 0%, transparent 70%)` }}
      />
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs font-mono text-white/35 uppercase tracking-widest">{label}</div>
        {delta && (
          <span className="text-xs font-mono font-semibold" style={{ color: delta.color }}>
            {delta.display}
          </span>
        )}
      </div>
      <span className="text-2xl font-mono font-bold" style={{ color: accent }}>
        {fmt(value)}
        {suffix}
      </span>
      {sublabel && <div className="text-xs font-mono text-white/30 mt-0.5">{sublabel}</div>}
    </div>
  );
}

function FrictionCard({ value, delta }: { value: number; delta?: DeltaResult | null }) {
  return (
    <div className="relative group border border-rose-500/20 bg-rose-950/15 rounded p-4 overflow-hidden transition-all duration-300 hover:border-rose-500/35 hover:bg-rose-950/25">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, #f43f5e10 0%, transparent 70%)' }}
      />
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs font-mono text-rose-400/60 uppercase tracking-widest">Friction</div>
        {delta && (
          <span className="text-xs font-mono font-semibold" style={{ color: delta.color }}>
            {delta.display}
          </span>
        )}
      </div>
      <span className="text-2xl font-mono font-bold text-rose-400">{value}</span>
      <span className="text-sm font-mono text-white/30 ml-1">/ 10</span>
      <div className="text-xs font-mono text-rose-400/40 mt-0.5">want this at zero</div>
    </div>
  );
}

function MiniBar({
  label,
  value,
  max,
  color = GREEN,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs font-mono text-white/40 truncate shrink-0">{label}</div>
      <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }}
        />
      </div>
      <div className="w-6 text-xs font-mono text-white/50 text-right shrink-0">{value}</div>
    </div>
  );
}

function TrendChart({
  title,
  height = 185,
  children,
}: {
  title: string;
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/8 bg-white/3 rounded p-5">
      <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-4">{title}</div>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
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
            {fmt(p.value as number)}
          </span>
        </div>
      ))}
    </div>
  );
}

function HorizonCard({ item }: { item: HorizonItem }) {
  const c = EFFORT_COLORS[item.effort];
  return (
    <div
      className={`border ${c.border} ${c.bg} rounded p-4 transition-all duration-200 hover:brightness-110`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-mono text-sm text-white/90 font-semibold leading-snug">
          {item.title}
        </div>
        <span
          className={`shrink-0 text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${c.border} ${c.text} bg-black/20`}
        >
          {item.effort}
        </span>
      </div>
      <p className="text-xs font-mono text-white/50 leading-relaxed">{item.description}</p>
    </div>
  );
}

function ImplementedCard({ item }: { item: ImplementedItem }) {
  return (
    <div className="border border-white/10 bg-white/3 rounded p-4 hover:border-emerald-500/30 hover:bg-emerald-950/20 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 border-emerald-500 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-white/90 font-semibold mb-1">{item.title}</div>
          <p className="text-xs font-mono text-white/50 leading-relaxed mb-2">{item.description}</p>
          {item.outcome && (
            <div className="text-xs font-mono text-emerald-400/80 border-l-2 border-emerald-500/40 pl-2">
              {item.outcome}
            </div>
          )}
          {item.fromMonth && (
            <div className="text-xs font-mono text-white/20 mt-2">suggested {item.fromMonth}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function StatsDashboard() {
  const [activeMonth, setActiveMonth] = useState(STATS_DATA.length - 1);
  const [activeTab, setActiveTab] = useState('metrics');

  const current = STATS_DATA[activeMonth];
  const prev = activeMonth > 0 ? STATS_DATA[activeMonth - 1] : null;
  const m = current.metrics;
  const maxBreakdown = Math.max(...current.workBreakdown.map((w) => w.sessions));

  const dGoalRate   = getDeltaPct(current, prev, 'goalRate');
  const dMessages   = getDelta(current, prev, 'messages');
  const dCommits    = getDelta(current, prev, 'commits');
  const dAgentCalls = getDelta(current, prev, 'agentCalls');
  const dFriction   = getDeltaPct(current, prev, 'frictionScore', true);

  return (
    <div className="relative overflow-x-hidden">
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .stats-fade-up { animation: fadeUp .35s ease both; }
        .stats-cursor { animation: blink 1.1s step-end infinite; }
        .stats-glow-green { text-shadow: 0 0 14px #00ff9d55; }
      `}</style>

      <ScanLines />
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(ellipse,#00ff9d 0%,transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

        {/* ── HEADER ── */}
        <div className="mb-10 stats-fade-up">
          <div className="flex items-center gap-2 text-xs font-mono text-white/30 mb-4 uppercase tracking-widest">
            <span style={{ color: GREEN }}>⬡</span>
            brianna.dev <span className="text-white/15">/</span> stats
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-mono font-bold text-white mb-1 stats-glow-green">
                DEV_METRICS
                <span className="stats-cursor ml-1" style={{ color: GREEN }}>
                  _
                </span>
              </h1>
              <p className="text-sm font-mono text-white/40">
                rolling claude code insights · updated monthly
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {STATS_DATA.map((d, i) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setActiveMonth(i)}
                  className={`text-xs font-mono px-3 py-1.5 rounded border transition-all duration-150 ${
                    activeMonth === i
                      ? 'border-[#00ff9d]/60 text-[#00ff9d] bg-[#00ff9d]/8'
                      : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  {d.slug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── HEADLINE STATS ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 stats-fade-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="col-span-2 sm:col-span-1 border border-[#00ff9d]/20 bg-[#00ff9d]/5 rounded p-4">
            <div className="flex items-start justify-between mb-1">
              <div className="text-xs font-mono text-[#00ff9d]/60 uppercase tracking-widest">
                Goal Rate
              </div>
              {dGoalRate && (
                <span className="text-xs font-mono font-semibold" style={{ color: dGoalRate.color }}>
                  {dGoalRate.display}
                </span>
              )}
            </div>
            <div className="text-4xl font-mono font-bold" style={{ color: GREEN }}>
              {m.goalRate}
              <span className="text-xl">%</span>
            </div>
            <div className="text-xs font-mono text-white/30 mt-1">
              across {m.sessions} sessions
            </div>
          </div>

          <StatCard
            label="Messages"
            value={m.messages}
            sublabel={`${m.msgsPerDay}/day avg`}
            delta={dMessages}
          />
          <StatCard label="Commits" value={m.commits} accent="#7c3aed" delta={dCommits} />
          <StatCard
            label="Agent Calls"
            value={m.agentCalls}
            accent="#f59e0b"
            sublabel={`+ ${m.taskCreates} TaskCreate`}
            delta={dAgentCalls}
          />
          <FrictionCard value={m.frictionScore} delta={dFriction} />
        </div>

        {/* ── TABS ── */}
        <div
          className="flex items-center mb-6 border-b border-white/8 stats-fade-up overflow-x-auto"
          style={{ animationDelay: '0.1s' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 text-xs font-mono uppercase tracking-widest px-4 py-2.5 border-b-2 transition-all duration-150 -mb-px ${
                activeTab === tab
                  ? 'border-[#00ff9d] text-[#00ff9d]'
                  : 'border-transparent text-white/35 hover:text-white/60'
              }`}
            >
              {TAB_LABELS[tab]}
              {tab === 'implemented' && current.implemented.length > 0 && (
                <span className="ml-1.5 text-emerald-400">({current.implemented.length})</span>
              )}
              {tab === 'horizon' && (
                <span className="ml-1.5 text-amber-400">({current.horizon.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: METRICS ── */}
        {activeTab === 'metrics' && (
          <div className="space-y-5 stats-fade-up">
            <div className="border border-white/8 bg-white/3 rounded p-5">
              <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-4">
                Lines of Code
              </div>
              <div className="flex items-baseline gap-4 mb-4">
                <div>
                  <span className="text-3xl font-mono font-bold" style={{ color: GREEN }}>
                    +{m.linesAdded.toLocaleString()}
                  </span>
                  <span className="text-sm font-mono text-white/30 ml-2">added</span>
                </div>
                <div>
                  <span className="text-xl font-mono font-semibold text-rose-400">
                    -{m.linesRemoved.toLocaleString()}
                  </span>
                  <span className="text-sm font-mono text-white/30 ml-2">removed</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      width: `${(m.linesAdded / (m.linesAdded + m.linesRemoved)) * 100}%`,
                      background: GREEN,
                    }}
                  />
                  <div
                    className="h-full rounded-r-full"
                    style={{
                      width: `${(m.linesRemoved / (m.linesAdded + m.linesRemoved)) * 100}%`,
                      background: '#f43f5e',
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-white/30">{m.files} files</span>
              </div>
            </div>

            <div className="border border-white/8 bg-white/3 rounded p-5">
              <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-4">
                Work Breakdown
              </div>
              <div className="space-y-2.5">
                {current.workBreakdown.map((w) => (
                  <MiniBar
                    key={w.label}
                    label={w.label}
                    value={w.sessions}
                    max={maxBreakdown}
                    color={w.color}
                  />
                ))}
              </div>
              <div className="text-xs font-mono text-white/20 mt-3">sessions per area</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-white/8 bg-white/3 rounded p-4 text-center">
                <div className="text-2xl font-mono font-bold text-purple-400 mb-1">
                  {m.multiClaudingPct}%
                </div>
                <div className="text-xs font-mono text-white/35">multi-clauding</div>
                <div className="text-xs font-mono text-white/20 mt-1">parallel sessions</div>
              </div>
              <div className="border border-white/8 bg-white/3 rounded p-4 text-center">
                <div className="text-2xl font-mono font-bold text-blue-400 mb-1">
                  {m.taskCreates}
                </div>
                <div className="text-xs font-mono text-white/35">TaskCreate calls</div>
                <div className="text-xs font-mono text-white/20 mt-1">sub-agent spawns</div>
              </div>
              <div className="border border-white/8 bg-white/3 rounded p-4 text-center">
                <div className="text-2xl font-mono font-bold mb-1" style={{ color: GREEN }}>
                  {m.sessions}
                </div>
                <div className="text-xs font-mono text-white/35">total sessions</div>
                <div className="text-xs font-mono text-white/20 mt-1">{current.month}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <TerminalBadge text="TDD-driven workflow" />
              <TerminalBadge text="BFF + frontend" color="#7c3aed" />
              <TerminalBadge text="sub-agent orchestration" color="#f59e0b" />
              <TerminalBadge text="multi-repo PRs" color="#3b82f6" />
            </div>
          </div>
        )}

        {/* ── TAB: TRENDS ── */}
        {activeTab === 'trends' && (
          <div className="space-y-5 stats-fade-up">
            <p className="text-xs font-mono text-white/35 leading-relaxed">
              Month-over-month velocity across all tracked periods.
              {STATS_DATA.length < 4 && (
                <span className="text-amber-400/60">
                  {' '}Charts fill in as months accumulate.
                </span>
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
        )}

        {/* ── TAB: ASSESSMENT ── */}
        {activeTab === 'assessment' && (
          <div className="space-y-5 stats-fade-up">
            <div className="border border-white/8 bg-white/3 rounded p-5">
              <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-3">
                Summary
              </div>
              <p className="text-sm font-mono text-white/70 leading-relaxed">
                {ASSESSMENT.summary}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-3">
                Strengths
              </div>
              <div className="space-y-3">
                {ASSESSMENT.strengths.map((s) => (
                  <div
                    key={s.label}
                    className="border border-emerald-500/20 bg-emerald-950/15 rounded p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-mono text-sm text-white/90 font-semibold">{s.label}</div>
                      <span className="shrink-0 text-xs font-mono text-emerald-400/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-white/50 leading-relaxed">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-3">
                Rough Edges
              </div>
              <div className="space-y-3">
                {ASSESSMENT.roughEdges.map((r) => (
                  <div
                    key={r.label}
                    className="border border-rose-500/20 bg-rose-950/15 rounded p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-mono text-sm text-white/90 font-semibold">{r.label}</div>
                      <span className="shrink-0 text-xs font-mono text-rose-400/60 border border-rose-500/30 px-2 py-0.5 rounded">
                        {r.tag}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-white/50 leading-relaxed">{r.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: HORIZON ── */}
        {activeTab === 'horizon' && (
          <div className="space-y-3 stats-fade-up">
            {current.horizon.length === 0 ? (
              <p className="text-xs font-mono text-white/30">
                nothing on the horizon for this period.
              </p>
            ) : (
              current.horizon.map((item) => <HorizonCard key={item.id} item={item} />)
            )}
          </div>
        )}

        {/* ── TAB: IMPLEMENTED ── */}
        {activeTab === 'implemented' && (
          <div className="space-y-3 stats-fade-up">
            {current.implemented.length === 0 ? (
              <p className="text-xs font-mono text-white/30">
                no items implemented from previous horizons yet.
              </p>
            ) : (
              current.implemented.map((item) => (
                <ImplementedCard key={item.title} item={item} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
