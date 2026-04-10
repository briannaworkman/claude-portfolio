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
  goalRate: number;
  agentCalls: number;
  taskCreates: number;
  multiClaudingPct: number;
  msgsPerDay: number;
  frictionScore: number;
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
