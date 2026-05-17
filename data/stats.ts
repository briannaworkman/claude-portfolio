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

export type Outcomes = {
  fully: number;
  mostly: number;
  partially: number;
  notAchieved: number;
  unclear: number;
};

export type MonthData = {
  month: string;
  slug: string;
  metrics: MonthMetrics;
  outcomes?: Outcomes;
  workBreakdown: WorkItem[];
  horizon: HorizonItem[];
  implemented: ImplementedItem[];
};

export type AssessmentItem = {
  label: string;
  tag: string;
  detail: string;
  month?: string;
};

export type Assessment = {
  summary: string[];
  strengths: AssessmentItem[];
  roughEdges: AssessmentItem[];
};

export const ASSESSMENT: Assessment = {
  summary: [
    'Operates Claude Code as a high-throughput engineering pipeline — running worktree-per-ticket flows end-to-end from TDD through draft PR, review response, and cleanup in single coherent sessions. Workflow has matured into full orchestration with a growing library of custom skills (panel-review, support-investigate) that compound in value over time.',
    'Highly prolific developer running a mature, shipping-oriented AI workflow. Operates more like a tech lead than a solo coder — delegating parallel subtasks, coordinating agents, and driving multi-file changes to completion across BFF and frontend layers.',
  ],
  strengths: [
    {
      label: 'Full delivery pipeline execution',
      tag: 'highlighted by claude',
      month: 'Apr–May',
      detail:
        'Drives Linear tickets from worktree creation through TDD implementation, draft PR, review response, and cleanup in single coherent sessions — treating Claude as a full delivery partner, not just a code generator.',
    },
    {
      label: 'Parallel agent orchestration',
      tag: 'highlighted by claude',
      month: 'Apr–May',
      detail:
        'With 324 Agent calls and 257 TaskCreate invocations in a single month, dispatches parallel implementation agents across isolated worktrees — producing multiple draft PRs from one decomposed ticket simultaneously.',
    },
    {
      label: '80% goal achievement rate',
      tag: 'highlighted by claude',
      month: 'Apr–May',
      detail:
        'Across 114 sessions over 23 working days — 58% fully achieved, 22% mostly achieved. Only 3 not-achieved outcomes, two of which were external usage-limit blocks rather than Claude failures.',
    },
    {
      label: 'Custom skill library investment',
      tag: 'highlighted by claude',
      month: 'Apr–May',
      detail:
        'Iterates on the tools as much as using them — panel-review, support-investigate, and brainstorming skills appear repeatedly with strong outcomes, then get refined based on what each session reveals.',
    },
    {
      label: 'High-velocity course correction',
      tag: 'highlighted by claude',
      month: 'Apr–May',
      detail:
        'Catches and redirects first-attempt misdirection within a turn or two rather than letting Claude run deep on a wrong assumption — keeping sessions tight despite lean upfront specs.',
    },
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
      label: 'First-attempt target misdirection',
      tag: '// known issue',
      month: 'Apr–May',
      detail:
        'Claude frequently jumps to the wrong PR, component, enum, or team on the first attempt — investigated #3382 instead of #3427, assumed CodeRabbit when the comment was from Wiz. Fixable by providing explicit IDs and links upfront.',
    },
    {
      label: 'Buggy first-pass implementations',
      tag: '// known issue',
      month: 'Apr–May',
      detail:
        'Initial code often contains subtle errors — Rules of Hooks violations, wrong enum types (frontend display vs BFF generated), missed call sites — that surface only during review. Asking Claude to enumerate call sites before coding would reduce rework loops.',
    },
    {
      label: 'Environment and auth friction',
      tag: '// known issue',
      month: 'Apr–May',
      detail:
        'Private registry auth failures, usage limit interruptions mid-session, and pre-commit hook auto-staging surprises repeatedly stall otherwise smooth workflows. Setting up auth proactively and documenting hook behavior in CLAUDE.md would prevent most of these.',
    },
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
      { label: 'Frontend Dev', sessions: 20, color: '#00ff9d' },
      { label: 'PR Review', sessions: 14, color: '#7c3aed' },
      { label: 'Git / Branches', sessions: 10, color: '#3b82f6' },
      { label: 'Docs / Knowledge', sessions: 6, color: '#f59e0b' },
      { label: 'DevOps / Prod', sessions: 5, color: '#f43f5e' },
    ],
    horizon: [
      {
        id: '2026-04-h1',
        title: 'Autonomous TDD Pipelines',
        effort: 'high',
        description:
          'Kick off a feature ticket and have Claude autonomously write failing tests, implement, iterate to green, lint, and open a draft PR without manual shepherding.',
      },
      {
        id: '2026-04-h2',
        title: 'Parallel Multi-Repo Agents',
        effort: 'high',
        description:
          'Two sub-agents per worktree coordinating from a shared spec, producing aligned BFF + frontend PRs simultaneously instead of sequential branch-switching.',
      },
      {
        id: '2026-04-h3',
        title: 'Self-Healing PR Review Loops',
        effort: 'medium',
        description:
          'Claude fetches PR review comments via GitHub CLI, categorizes them, applies fixes, verifies tests pass, and pushes — turning a 30-min feedback cycle into 2 minutes.',
      },
      {
        id: '2026-04-h4',
        title: 'GitHub MCP Server',
        effort: 'low',
        description:
          'Connect Claude Code to GitHub natively so it can read PR diffs and comments without manual copy-paste.',
      },
    ],
    implemented: [],
  },
  {
    month: 'Apr 10 – May 12',
    slug: '2026-05',
    metrics: {
      messages: 1583,
      sessions: 114,
      files: 414,
      linesAdded: 37799,
      linesRemoved: 2523,
      commits: 210,
      goalRate: 80,
      agentCalls: 324,
      taskCreates: 257,
      multiClaudingPct: 19,
      msgsPerDay: 68.8,
      frictionScore: 4,
    },
    outcomes: {
      fully: 39,
      mostly: 15,
      partially: 8,
      notAchieved: 3,
      unclear: 2,
    },
    workBreakdown: [
      { label: 'Feature Dev', sessions: 18, color: '#00ff9d' },
      { label: 'Bug Investigation', sessions: 15, color: '#f43f5e' },
      { label: 'PR Review', sessions: 10, color: '#7c3aed' },
      { label: 'Skills / Tooling', sessions: 8, color: '#f59e0b' },
      { label: 'QA / Support', sessions: 7, color: '#3b82f6' },
    ],
    horizon: [
      {
        id: '2026-05-h1',
        title: 'Autonomous Linear-to-PR Ticket Swarm',
        effort: 'high',
        description:
          'Point a supervisor agent at the Linear backlog to triage, decompose, and dispatch parallel implementation agents across isolated worktrees — each running TDD, opening draft PRs, and self-reviewing with the panel-review skill. Wake up to ready-to-merge work instead of tickets to plan.',
      },
      {
        id: '2026-05-h2',
        title: 'Self-Healing CI and Review-Response Loop',
        effort: 'high',
        description:
          'An agent watches open PRs, fetches CodeRabbit/Wiz/human review comments as they land, classifies them, implements fixes with tests, and pushes commits — only escalating genuine judgment calls. Turns overnight review cycles into automated cleanup.',
      },
      {
        id: '2026-05-h3',
        title: 'Test-Driven Bug Reproduction Agent',
        effort: 'medium',
        description:
          'Drop a Slack support thread or production error into an agent that reproduces the bug as a failing test, bisects to the causal commit, drafts the fix, and ships a PR with the regression test included.',
      },
    ],
    implemented: [
      {
        title: 'Parallel Multi-Repo Agents',
        fromMonth: '2026-04',
        description:
          'Decomposing tickets into subtasks and dispatching parallel implementation agents across isolated worktrees, producing multiple draft PRs from one decomposed ticket simultaneously.',
        outcome:
          'Confirmed as a recurring big win — shipped two similar Linear tickets as simultaneous PRs and produced three draft PRs from one decomposed ticket in a single session.',
      },
    ],
  },

];
