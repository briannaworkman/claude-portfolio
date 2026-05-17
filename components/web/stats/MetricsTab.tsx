import type { MonthData, Outcomes } from '@/data/stats';
import { CardHeader, FrictionCard, MiniBar, StatCard, TerminalBadge } from './components';
import { GREEN } from './constants';
import type { DeltaResult } from './utils';

type MetricsTabProps = {
  current: MonthData;
  maxBreakdown: number;
  dMessages: DeltaResult | null;
  dCommits: DeltaResult | null;
  dAgentCalls: DeltaResult | null;
  dGoalRate: DeltaResult | null;
  dFriction: DeltaResult | null;
};



const OUTCOME_SEGMENTS: { key: keyof Outcomes; label: string; color: string }[] = [
  { key: 'fully',       label: 'fully achieved',     color: '#00ff9d' },
  { key: 'mostly',      label: 'mostly achieved',    color: '#34d399' },
  { key: 'partially',   label: 'partially achieved', color: '#f59e0b' },
  { key: 'notAchieved', label: 'not achieved',        color: '#f43f5e' },
  { key: 'unclear',     label: 'unclear',             color: 'rgba(255,255,255,0.15)' },
];

function OutcomesBar({ outcomes }: { outcomes: Outcomes }) {
  const total = OUTCOME_SEGMENTS.reduce((sum, s) => sum + outcomes[s.key], 0);
  const visible = OUTCOME_SEGMENTS.filter((s) => outcomes[s.key] > 0);
  return (
    <div className="relative mt-3">
      <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
        {visible.map((s) => (
          <div key={s.key} style={{ width: `${(outcomes[s.key] / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div className="absolute inset-0 flex gap-px">
        {visible.map((s) => (
          <div
            key={s.key}
            className="group/seg relative cursor-default"
            style={{ width: `${(outcomes[s.key] / total) * 100}%` }}
          >
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-white/15 bg-[#111] px-2 py-1 font-mono text-xs text-white/60 opacity-0 transition-opacity duration-150 group-hover/seg:opacity-100">
              {s.label} · {outcomes[s.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricsTab({
  current,
  maxBreakdown,
  dMessages,
  dCommits,
  dAgentCalls,
  dGoalRate,
  dFriction,
}: MetricsTabProps) {
  const m = current.metrics;

  return (
    <div className="space-y-5 stats-fade-up">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="col-span-2 sm:col-span-1 border border-[#00ff9d]/20 bg-[#00ff9d]/5 rounded p-4">
          <CardHeader label="Goal Rate" delta={dGoalRate} labelClassName="text-[#00ff9d]/60" />
          <div className="text-4xl font-mono font-bold" style={{ color: GREEN }}>
            {m.goalRate}
            <span className="text-xl">%</span>
          </div>
          <div className="text-xs font-mono text-white/30 mt-1">across {m.sessions} sessions</div>
          {current.outcomes && <OutcomesBar outcomes={current.outcomes} />}
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
        <div className="text-xs font-mono text-white/20 mt-3">% of tracked sessions</div>
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
          <div className="text-2xl font-mono font-bold text-blue-400 mb-1">{m.taskCreates}</div>
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
  );
}
