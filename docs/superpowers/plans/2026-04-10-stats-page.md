# Stats Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/stats` page that displays month-over-month Claude Code metrics with interactive tabs, recharts trend visualizations, and a terminal-green aesthetic.

**Architecture:** Static data lives in `data/stats.ts` (types + monthly entries + assessment). A single `'use client'` component at `components/web/stats/StatsDashboard.tsx` handles all interactivity. `app/stats/page.tsx` is a thin server wrapper that sets metadata and renders the dashboard. Navbar gets one new entry.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, recharts, Vitest, Playwright

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Install | — | Add recharts dependency |
| Create | `data/stats.ts` | Types + monthly data + ASSESSMENT constant |
| Create | `__tests__/data/stats-shapes.test.ts` | Data invariant unit tests |
| Create | `components/web/stats/StatsDashboard.tsx` | Full interactive dashboard (client) |
| Create | `app/stats/page.tsx` | Server page: metadata + renders StatsDashboard |
| Modify | `components/layout/Navbar.tsx` | Add Stats to NAV_LINKS |
| Modify | `e2e/navigation.spec.ts` | Add /stats smoke tests |

---

## Task 1: Install recharts

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install recharts**

```bash
cd /Users/briannaworkman/Documents/GitHub/claude-portfolio
pnpm add recharts
```

If pnpm reports a peer dependency conflict with React 19, add this to `package.json` under a new `"pnpm"` key and re-run:

```json
"pnpm": {
  "peerDependencyRules": {
    "ignoreMissing": ["react", "react-dom"]
  }
}
```

- [ ] **Step 2: Verify TypeScript sees the types**

```bash
pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: no errors about `recharts` (there may be pre-existing errors from other files — that's fine as long as recharts isn't one of them).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add recharts dependency"
```

---

## Task 2: Create data/stats.ts

**Files:**
- Create: `data/stats.ts`

- [ ] **Step 1: Write the file**

```ts
// data/stats.ts

export type Effort = 'low' | 'medium' | 'high';

export type WorkItem = {
  label: string;
  sessions: number;
  color: string;
};

export type HorizonItem = {
  id: string;
  title: string;
  effort: Effort;
  description: string;
};

export type ImplementedItem = {
  title: string;
  fromMonth: string;
  description: string;
  outcome?: string;
};

export type MonthMetrics = {
  messages: number;
  sessions: number;
  files: number;
  linesAdded: number;
  linesRemoved: number;
  commits: number;
  goalRate: number;       // 0–100
  agentCalls: number;
  taskCreates: number;
  multiClaudingPct: number;
  msgsPerDay: number;
  frictionScore: number;  // 0–10
};

export type MonthData = {
  month: string;
  slug: string;
  metrics: MonthMetrics;
  workBreakdown: WorkItem[];
  horizon: HorizonItem[];
  implemented: ImplementedItem[];
};

export type AssessmentStrength = {
  label: string;
  tag: string;
  detail: string;
};

export type AssessmentRoughEdge = {
  label: string;
  tag: string;
  detail: string;
};

export type Assessment = {
  summary: string;
  strengths: AssessmentStrength[];
  roughEdges: AssessmentRoughEdge[];
};

export const ASSESSMENT: Assessment = {
  summary:
    'Highly prolific developer running a mature, shipping-oriented AI workflow. Operates more like a tech lead than a solo coder — delegating parallel subtasks, coordinating agents, and driving multi-file changes to completion across BFF and frontend layers.',
  strengths: [
    {
      label: 'Tech lead mindset',
      tag: 'highlighted by claude',
      detail:
        'With 257 Agent calls and 176 TaskCreate invocations in a single month, the workflow has shifted from pair programming to orchestration — delegating parallel subtasks, synthesizing results, and coordinating across layers.',
    },
    {
      label: 'Mature TDD discipline',
      tag: 'highlighted by claude',
      detail:
        'Consistently drives features from spec through test-first implementation to draft PR — committing incrementally across BFF and frontend with a shipping-oriented cadence.',
    },
    {
      label: '96% goal achievement rate',
      tag: 'highlighted by claude',
      detail:
        'Across 101 sessions over 24 working days. Goes into sessions expecting a lot and almost always gets it.',
    },
    {
      label: 'Strong version control fluency',
      tag: 'highlighted by claude',
      detail:
        'Juggles concurrent PRs, stacked feature branches, and merge conflict resolution within single sessions while keeping commits clean.',
    },
    {
      label: 'Heavy sub-agent user',
      tag: 'highlighted by claude',
      detail:
        'One of the heavier sub-agent adopters — running parallel workflows across branches and repos while most developers are still using AI as a linear autocomplete.',
    },
  ],
  roughEdges: [
    {
      label: 'Under-briefing on branch context',
      tag: '// known issue',
      detail:
        'Claude frequently ended up on the wrong branch or the wrong PR because session-opening branch state was not being declared explicitly. Root cause: me, not the model.',
    },
    {
      label: 'Relying on Claude to infer conventions',
      tag: '// known issue',
      detail:
        'Enum patterns, string placeholder format, design token choices — Claude was expected to pick these up from context. It cannot reliably do that without CLAUDE.md documentation.',
    },
    {
      label: 'UI iteration cycles',
      tag: '// known issue',
      detail:
        'Styling changes averaged 3+ rounds because Claude was guessing at available tokens instead of being pointed at the theme file first. Fixable with one line at session start.',
    },
  ],
};

export const STATS_DATA: MonthData[] = [
  {
    month: 'Jan 9 – Feb 9',
    slug: '2026-02',
    metrics: {
      messages: 842,
      sessions: 67,
      files: 218,
      linesAdded: 14320,
      linesRemoved: 1840,
      commits: 138,
      goalRate: 88,
      agentCalls: 94,
      taskCreates: 71,
      multiClaudingPct: 4,
      msgsPerDay: 35.1,
      frictionScore: 8,
    },
    workBreakdown: [
      { label: 'Frontend Dev',     sessions: 18, color: '#00ff9d' },
      { label: 'PR Review',        sessions: 10, color: '#7c3aed' },
      { label: 'Git / Branches',   sessions: 7,  color: '#3b82f6' },
      { label: 'Docs / Knowledge', sessions: 4,  color: '#f59e0b' },
      { label: 'DevOps / Prod',    sessions: 3,  color: '#f43f5e' },
    ],
    horizon: [
      {
        id: 'h1',
        title: 'CLAUDE.md Convention Docs',
        effort: 'low',
        description:
          'Document enum patterns, string placeholders, and branch naming in CLAUDE.md so Claude stops guessing at codebase conventions.',
      },
      {
        id: 'h2',
        title: 'Branch State at Session Start',
        effort: 'low',
        description:
          'Explicitly declare the target branch at the start of every commit-related session to eliminate wrong-branch errors.',
      },
      {
        id: 'h3',
        title: 'Design Token Grounding',
        effort: 'low',
        description:
          'Have Claude read the theme file and enumerate available tokens before any UI work begins.',
      },
    ],
    implemented: [],
  },
  {
    month: 'Feb 9 – Mar 9',
    slug: '2026-03',
    metrics: {
      messages: 1104,
      sessions: 88,
      files: 341,
      linesAdded: 22100,
      linesRemoved: 2310,
      commits: 187,
      goalRate: 92,
      agentCalls: 178,
      taskCreates: 129,
      multiClaudingPct: 7,
      msgsPerDay: 46.8,
      frictionScore: 5,
    },
    workBreakdown: [
      { label: 'Frontend Dev',     sessions: 22, color: '#00ff9d' },
      { label: 'PR Review',        sessions: 12, color: '#7c3aed' },
      { label: 'Git / Branches',   sessions: 9,  color: '#3b82f6' },
      { label: 'Docs / Knowledge', sessions: 5,  color: '#f59e0b' },
      { label: 'DevOps / Prod',    sessions: 4,  color: '#f43f5e' },
    ],
    horizon: [
      {
        id: 'h1',
        title: 'Sub-Agent Task Orchestration',
        effort: 'medium',
        description:
          'Leverage TaskCreate to parallelize independent subtasks like component implementations and production investigations.',
      },
      {
        id: 'h2',
        title: 'GitHub MCP Server',
        effort: 'low',
        description:
          'Connect Claude Code to GitHub natively so it can read PR diffs and comments without manual copy-paste.',
      },
    ],
    implemented: [
      {
        title: 'CLAUDE.md Convention Docs',
        fromMonth: 'Jan 9 – Feb 9',
        description: 'Documented enum patterns, string placeholder format, and branch naming conventions.',
        outcome:
          'Wrong-pattern reverts dropped significantly. Claude now picks up isValidEnumValue middleware and {0} placeholders consistently.',
      },
      {
        title: 'Branch State at Session Start',
        fromMonth: 'Jan 9 – Feb 9',
        description: 'Added explicit branch declaration as a session-opening habit for all commit-related work.',
        outcome: 'Wrong-branch commits went from ~3/month to near zero.',
      },
      {
        title: 'Design Token Grounding',
        fromMonth: 'Jan 9 – Feb 9',
        description: 'Now point Claude at the theme file before any styling work begins.',
        outcome: 'UI iteration cycles dropped from 3+ rounds to 1–2 on average.',
      },
    ],
  },
  {
    month: 'Mar 9 – Apr 9',
    slug: '2026-04',
    metrics: {
      messages: 1328,
      sessions: 101,
      files: 420,
      linesAdded: 28997,
      linesRemoved: 2922,
      commits: 224,
      goalRate: 96,
      agentCalls: 257,
      taskCreates: 176,
      multiClaudingPct: 10,
      msgsPerDay: 55.3,
      frictionScore: 3,
    },
    workBreakdown: [
      { label: 'Frontend Dev',     sessions: 20, color: '#00ff9d' },
      { label: 'PR Review',        sessions: 14, color: '#7c3aed' },
      { label: 'Git / Branches',   sessions: 10, color: '#3b82f6' },
      { label: 'Docs / Knowledge', sessions: 6,  color: '#f59e0b' },
      { label: 'DevOps / Prod',    sessions: 5,  color: '#f43f5e' },
    ],
    horizon: [
      {
        id: 'h1',
        title: 'Autonomous TDD Pipelines',
        effort: 'high',
        description:
          'Kick off a feature ticket and have Claude autonomously write failing tests, implement, iterate to green, lint, and open a draft PR without manual shepherding.',
      },
      {
        id: 'h2',
        title: 'Parallel Multi-Repo Agents',
        effort: 'high',
        description:
          'Two sub-agents per worktree coordinating from a shared spec, producing aligned BFF + frontend PRs simultaneously instead of sequential branch-switching.',
      },
      {
        id: 'h3',
        title: 'Self-Healing PR Review Loops',
        effort: 'medium',
        description:
          'Claude fetches PR review comments via GitHub CLI, categorizes them, applies fixes, verifies tests pass, and pushes — turning a 30-min feedback cycle into 2 minutes.',
      },
      {
        id: 'h4',
        title: 'GitHub MCP Server',
        effort: 'low',
        description:
          'Connect Claude Code to GitHub natively so it can read PR diffs and comments without manual copy-paste.',
      },
    ],
    implemented: [
      {
        title: 'Sub-Agent Task Orchestration',
        fromMonth: 'Feb 9 – Mar 9',
        description:
          'Now actively using TaskCreate to parallelize independent subtasks — Banner variants, production investigations, multi-file changes.',
        outcome:
          '257 Agent calls and 176 TaskCreate invocations this month. Operating more like a tech lead than a solo coder.',
      },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add data/stats.ts
git commit -m "feat: add stats data file with types and monthly entries"
```

---

## Task 3: Unit tests for stats data

**Files:**
- Create: `__tests__/data/stats-shapes.test.ts`

- [ ] **Step 1: Write the tests**

```ts
// __tests__/data/stats-shapes.test.ts
import { describe, expect, it } from 'vitest';
import { STATS_DATA, ASSESSMENT } from '@/data/stats';

describe('data/stats — STATS_DATA', () => {
  it('has at least one entry', () => {
    expect(STATS_DATA.length).toBeGreaterThan(0);
  });

  it('every entry has a unique slug', () => {
    const slugs = STATS_DATA.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('slugs match YYYY-MM format', () => {
    for (const d of STATS_DATA) {
      expect(d.slug).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('goalRate is between 0 and 100', () => {
    for (const d of STATS_DATA) {
      expect(d.metrics.goalRate).toBeGreaterThanOrEqual(0);
      expect(d.metrics.goalRate).toBeLessThanOrEqual(100);
    }
  });

  it('frictionScore is between 0 and 10', () => {
    for (const d of STATS_DATA) {
      expect(d.metrics.frictionScore).toBeGreaterThanOrEqual(0);
      expect(d.metrics.frictionScore).toBeLessThanOrEqual(10);
    }
  });

  it('all numeric metrics are positive', () => {
    const positiveKeys = [
      'messages', 'sessions', 'files', 'linesAdded',
      'commits', 'agentCalls', 'taskCreates',
    ] as const;
    for (const d of STATS_DATA) {
      for (const key of positiveKeys) {
        expect(d.metrics[key]).toBeGreaterThan(0);
      }
    }
  });

  it('workBreakdown colors are valid hex strings', () => {
    for (const d of STATS_DATA) {
      for (const w of d.workBreakdown) {
        expect(w.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it('horizon effort values are low | medium | high', () => {
    const valid = new Set(['low', 'medium', 'high']);
    for (const d of STATS_DATA) {
      for (const h of d.horizon) {
        expect(valid.has(h.effort)).toBe(true);
      }
    }
  });

  it('horizon items have unique ids within each month', () => {
    for (const d of STATS_DATA) {
      const ids = d.horizon.map((h) => h.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('data/stats — ASSESSMENT', () => {
  it('has a non-empty summary', () => {
    expect(ASSESSMENT.summary.length).toBeGreaterThan(0);
  });

  it('has at least one strength', () => {
    expect(ASSESSMENT.strengths.length).toBeGreaterThan(0);
  });

  it('has at least one rough edge', () => {
    expect(ASSESSMENT.roughEdges.length).toBeGreaterThan(0);
  });

  it('every strength has label, tag, and detail', () => {
    for (const s of ASSESSMENT.strengths) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.tag.length).toBeGreaterThan(0);
      expect(s.detail.length).toBeGreaterThan(0);
    }
  });

  it('every rough edge has label, tag, and detail', () => {
    for (const r of ASSESSMENT.roughEdges) {
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.tag.length).toBeGreaterThan(0);
      expect(r.detail.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
pnpm test -- --reporter=verbose 2>&1 | grep -A 30 "stats-shapes"
```

Expected: all tests PASS (data was written in Task 2 to satisfy these invariants).

- [ ] **Step 3: Commit**

```bash
git add __tests__/data/stats-shapes.test.ts
git commit -m "test: add data shape tests for stats"
```

---

## Task 4: Create StatsDashboard component

**Files:**
- Create: `components/web/stats/StatsDashboard.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/web/stats/StatsDashboard.tsx
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
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
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
  label:           d.slug,
  messages:        d.metrics.messages,
  commits:         d.metrics.commits,
  goalRate:        d.metrics.goalRate,
  agentCalls:      d.metrics.agentCalls,
  msgsPerDay:      d.metrics.msgsPerDay,
  linesAdded:      d.metrics.linesAdded,
  multiClaudingPct:d.metrics.multiClaudingPct,
  frictionScore:   d.metrics.frictionScore,
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

function ChartTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/15 rounded px-3 py-2 font-mono text-xs shadow-xl">
      <div className="text-white/40 mb-1.5">{label}</div>
      {payload.map((p) => (
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
          {/* Goal rate — featured card */}
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
            {/* Lines of code */}
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

            {/* Work breakdown */}
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

            {/* Usage patterns */}
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

            {/* Tags */}
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/briannaworkman/Documents/GitHub/claude-portfolio
pnpm exec tsc --noEmit 2>&1 | grep -i "stats"
```

Expected: no errors containing "stats".

- [ ] **Step 3: Commit**

```bash
git add components/web/stats/StatsDashboard.tsx
git commit -m "feat: add StatsDashboard client component"
```

---

## Task 5: Create app/stats/page.tsx

**Files:**
- Create: `app/stats/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
// app/stats/page.tsx
import type { Metadata } from 'next';
import { StatsDashboard } from '@/components/web/stats/StatsDashboard';

export const metadata: Metadata = {
  title: 'Stats — Bri Workman',
};

export default function StatsPage() {
  return <StatsDashboard />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit 2>&1 | grep -i "stats"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/stats/page.tsx
git commit -m "feat: add /stats page"
```

---

## Task 6: Update Navbar

**Files:**
- Modify: `components/layout/Navbar.tsx:7-12`

- [ ] **Step 1: Add Stats to NAV_LINKS**

In `components/layout/Navbar.tsx`, find the `NAV_LINKS` array (line 7) and add the Stats entry between Blog and Uses:

Old:
```ts
const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/uses', label: 'Uses' },
  { href: '/contact', label: 'Contact' },
];
```

New:
```ts
const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/stats', label: 'Stats' },
  { href: '/uses', label: 'Uses' },
  { href: '/contact', label: 'Contact' },
];
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: add Stats link to navbar"
```

---

## Task 7: E2e tests

**Files:**
- Modify: `e2e/navigation.spec.ts`

- [ ] **Step 1: Add stats page tests to navigation.spec.ts**

Append the following `test.describe` block to `e2e/navigation.spec.ts`:

```ts
test.describe('Stats page', () => {
  test('stats page renders with heading', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.locator('h1')).toContainText('DEV_METRICS');
  });

  test('stats page has correct title', async ({ page }) => {
    await page.goto('/stats');
    await expect(page).toHaveTitle(/Bri Workman/);
  });

  test('Stats link appears in navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/stats"]')).toBeVisible();
  });

  test('stats tabs are all present', async ({ page }) => {
    await page.goto('/stats');
    for (const label of ['metrics', 'trends', 'assessment']) {
      await expect(page.locator(`button:has-text("${label}")`).first()).toBeVisible();
    }
  });

  test('clicking trends tab shows charts', async ({ page }) => {
    await page.goto('/stats');
    await page.locator('button:has-text("trends")').click();
    // Chart container appears
    await expect(page.locator('.recharts-responsive-container').first()).toBeVisible();
  });

  test('month selector buttons switch active month', async ({ page }) => {
    await page.goto('/stats');
    // Click the first month button
    const firstMonthBtn = page.locator('button:has-text("2026-02")');
    await firstMonthBtn.click();
    await expect(firstMonthBtn).toHaveClass(/text-\[#00ff9d\]/);
  });
});
```

- [ ] **Step 2: Run e2e tests (requires dev server)**

In one terminal:
```bash
pnpm dev
```

In another:
```bash
pnpm test:e2e 2>&1 | tail -20
```

Expected: all stats tests pass.

- [ ] **Step 3: Commit**

```bash
git add e2e/navigation.spec.ts
git commit -m "test: add e2e tests for /stats page"
```

---

## Self-Review

**Spec coverage check:**
- [x] `/stats` page at correct route — Task 5
- [x] Stats link in navbar between Blog and Uses — Task 6
- [x] Separate data file (`data/stats.ts`) — Task 2
- [x] "Assessment" tab (not "Byte's Assessment") — Task 4
- [x] recharts for trend charts — Tasks 1 + 4
- [x] Month selector with delta indicators — Task 4
- [x] All 5 tabs: metrics, trends, assessment, horizon, implemented — Task 4
- [x] Unit tests for data invariants — Task 3
- [x] E2e tests for page render + tabs — Task 7

**Placeholder scan:** None — all steps contain actual code.

**Type consistency:**
- `MonthData`, `MonthMetrics`, `HorizonItem`, `ImplementedItem` defined in Task 2, used by exact same names in Task 4
- `DeltaResult` defined and used only in Task 4 (internal to component)
- `StatsDashboard` exported in Task 4, imported by exact name in Task 5
