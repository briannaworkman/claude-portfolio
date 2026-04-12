# Terminal Stats Command Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `stats` terminal command that displays Claude Code usage metrics for the current (or a specified) month, mirroring the data shown on the /stats Metrics tab.

**Architecture:** A new `lib/terminal/stats-formatter.ts` module takes a `MonthData` object and returns `OutputLine[]`. The `commands.ts` switch handles slug resolution (defaulting to the latest month) and delegates all formatting to this module. Tab completion and help text are updated to expose the new command.

**Tech Stack:** TypeScript, Vitest (unit tests), Playwright (e2e tests), Next.js App Router

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/terminal/stats-formatter.ts` | Format `MonthData` → `OutputLine[]` |
| Create | `__tests__/lib/terminal/stats-formatter.test.ts` | Unit tests for the formatter |
| Modify | `lib/terminal/commands.ts` | Add `stats` case, import formatter + data |
| Modify | `components/terminal/TerminalInput.tsx` | Add `stats` to tab completion |
| Modify | `e2e/terminal.spec.ts` | Add two e2e tests for `stats` |

---

## Task 1: Write failing unit tests for `stats-formatter.ts`

**Files:**
- Create: `__tests__/lib/terminal/stats-formatter.test.ts`

- [ ] **Step 1: Create the test file**

```ts
// __tests__/lib/terminal/stats-formatter.test.ts
import { describe, expect, it } from 'vitest';
import { STATS_DATA } from '@/data/stats';
import { formatStats } from '@/lib/terminal/stats-formatter';

describe('formatStats', () => {
  const month = STATS_DATA[STATS_DATA.length - 1];

  it('returns a non-empty OutputLine array', () => {
    const lines = formatStats(month);
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('first line is header containing month label', () => {
    const lines = formatStats(month);
    expect(lines[0].text).toContain('Claude Code Stats');
    expect(lines[0].text).toContain(month.month);
  });

  it('includes goal rate percentage', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(`${month.metrics.goalRate}%`);
  });

  it('includes formatted message count', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(month.metrics.messages.toLocaleString());
  });

  it('includes commit count', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(String(month.metrics.commits));
  });

  it('includes agent call count', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(String(month.metrics.agentCalls));
  });

  it('includes friction score', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(String(month.metrics.frictionScore));
  });

  it('includes lines added', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(month.metrics.linesAdded.toLocaleString());
  });

  it('includes lines removed', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(month.metrics.linesRemoved.toLocaleString());
  });

  it('includes file count', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(String(month.metrics.files));
  });

  it('includes all work breakdown labels', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    for (const w of month.workBreakdown) {
      expect(body).toContain(w.label);
    }
  });

  it('includes multi-clauding percentage', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(`${month.metrics.multiClaudingPct}%`);
  });

  it('includes TaskCreate count in footer', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(`TaskCreate: ${month.metrics.taskCreates}`);
  });

  it('includes session count in footer', () => {
    const lines = formatStats(month);
    const body = lines.map((l) => l.text).join('\n');
    expect(body).toContain(`Sessions: ${month.metrics.sessions}`);
  });

  it('all lines have type output', () => {
    const lines = formatStats(month);
    for (const l of lines) {
      expect(l.type).toBe('output');
    }
  });

  it('all lines have unique ids', () => {
    const lines = formatStats(month);
    const ids = lines.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail (module not yet created)**

```bash
pnpm test __tests__/lib/terminal/stats-formatter.test.ts
```

Expected: All tests FAIL with "Cannot find module '@/lib/terminal/stats-formatter'"

---

## Task 2: Implement `stats-formatter.ts` and make tests pass

**Files:**
- Create: `lib/terminal/stats-formatter.ts`

- [ ] **Step 1: Create the formatter**

```ts
// lib/terminal/stats-formatter.ts
import type { OutputLine } from '@/components/terminal/TerminalOutput';
import type { MonthData } from '@/data/stats';

function line(text: string): OutputLine {
  return { id: crypto.randomUUID(), type: 'output', text };
}

export function formatStats(month: MonthData): OutputLine[] {
  const m = month.metrics;

  // Metrics section — right-align values, left-align labels
  const rows = [
    { label: 'Goal Rate', value: `${m.goalRate}%`, note: `across ${m.sessions} sessions` },
    { label: 'Messages', value: m.messages.toLocaleString(), note: `${m.msgsPerDay}/day avg` },
    { label: 'Commits', value: String(m.commits), note: '' },
    { label: 'Agent Calls', value: String(m.agentCalls), note: `+ ${m.taskCreates} TaskCreate` },
    { label: 'Friction', value: String(m.frictionScore), note: '' },
  ];

  const labelWidth = Math.max(...rows.map((r) => r.label.length));
  const valueWidth = Math.max(...rows.map((r) => r.value.length));

  const metricLines = rows.map((r) => {
    const label = r.label.padEnd(labelWidth);
    const value = r.value.padStart(valueWidth);
    const note = r.note ? `   ${r.note}` : '';
    return line(`  ${label}  ${value}${note}`);
  });

  // Work breakdown section
  const labelW = Math.max(...month.workBreakdown.map((w) => w.label.length));
  const sessionW = Math.max(...month.workBreakdown.map((w) => String(w.sessions).length));

  const workLines = month.workBreakdown.map((w) => {
    const label = w.label.padEnd(labelW);
    const sessions = String(w.sessions).padStart(sessionW);
    return line(`  ${label}  ${sessions} sessions`);
  });

  return [
    line(`Claude Code Stats — ${month.month}`),
    line(''),
    ...metricLines,
    line(''),
    line('Lines of Code:'),
    line(
      `  +${m.linesAdded.toLocaleString()} added  /  -${m.linesRemoved.toLocaleString()} removed  /  ${m.files} files`,
    ),
    line(''),
    line('Work Breakdown:'),
    ...workLines,
    line(''),
    line(`  Multi-clauding: ${m.multiClaudingPct}%  ·  TaskCreate: ${m.taskCreates}  ·  Sessions: ${m.sessions}`),
  ];
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
pnpm test __tests__/lib/terminal/stats-formatter.test.ts
```

Expected: All 16 tests PASS

- [ ] **Step 3: Commit**

```bash
git add lib/terminal/stats-formatter.ts __tests__/lib/terminal/stats-formatter.test.ts
git commit -m "feat: add stats-formatter module with unit tests"
```

---

## Task 3: Wire the `stats` command into `commands.ts`

**Files:**
- Modify: `lib/terminal/commands.ts`

- [ ] **Step 1: Add imports at the top of `commands.ts`**

Find the existing import block and add two new imports:

```ts
import { STATS_DATA } from '@/data/stats';
import { formatStats } from '@/lib/terminal/stats-formatter';
```

The full import block should look like:

```ts
import type { OutputLine } from '@/components/terminal/TerminalOutput';
import { type Availability, about } from '@/data/about';
import { claudeTagLabel, projects } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { social } from '@/data/social';
import { STATS_DATA } from '@/data/stats';
import { usesCategories } from '@/data/uses';
import type { PostMeta } from '@/lib/mdx';
import { parseCommand } from '@/lib/terminal/parser';
import { formatStats } from '@/lib/terminal/stats-formatter';
```

- [ ] **Step 2: Add `stats [month]` to `HELP_TEXT`**

In `HELP_TEXT`, add the stats line after `resume`:

```
  stats [month]   Claude Code usage metrics (e.g. stats 2026-04)
```

The updated section of HELP_TEXT (around resume/education):

```ts
const HELP_TEXT = `
Available commands:

  whoami          About me
  experience      Work history
  skills          Tech stack overview
  ls projects     List all projects
  cat <slug>      Project details (e.g. cat claude-portfolio)
  blog            Blog posts
  uses            Tools and setup
  contact         How to reach me
  availability    Current status
  open github     Open GitHub profile
  open linkedin   Open LinkedIn profile
  resume          Download my resume
  education       Academic background
  interests       What I geek out on
  stats [month]   Claude Code usage metrics (e.g. stats 2026-04)
  ask <question>  Ask me anything (Claude-powered)
  clear           Clear the terminal

Tip: Press Tab to autocomplete · ↑↓ for history
`.trim();
```

- [ ] **Step 3: Add the `stats` case to the `runCommand` switch**

Add this case before the `case 'ask':` line:

```ts
case 'stats': {
  const slug = args[0];
  if (slug) {
    const month = STATS_DATA.find((d) => d.slug === slug);
    if (!month) {
      const available = STATS_DATA.map((d) => d.slug).join(', ');
      return [
        line(
          `error: month '${slug}' not found. available months: ${available}`,
          'error',
        ),
      ];
    }
    return formatStats(month);
  }
  return formatStats(STATS_DATA[STATS_DATA.length - 1]);
}
```

- [ ] **Step 4: Run the full test suite to confirm no regressions**

```bash
pnpm test
```

Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/terminal/commands.ts
git commit -m "feat: add stats command to terminal"
```

---

## Task 4: Add `stats` to tab completion

**Files:**
- Modify: `components/terminal/TerminalInput.tsx`

- [ ] **Step 1: Add `'stats'` to `BASE_COMMANDS`**

In `TerminalInput.tsx`, find the `BASE_COMMANDS` array and add `'stats'`:

```ts
const BASE_COMMANDS = [
  'help',
  'whoami',
  'experience',
  'skills',
  'ls projects',
  'blog',
  'uses',
  'contact',
  'availability',
  'open github',
  'open linkedin',
  'resume',
  'education',
  'interests',
  'stats',
  'clear',
];
```

- [ ] **Step 2: Commit**

```bash
git add components/terminal/TerminalInput.tsx
git commit -m "feat: add stats to terminal tab completion"
```

---

## Task 5: Add e2e tests for the `stats` command

**Files:**
- Modify: `e2e/terminal.spec.ts`

- [ ] **Step 1: Add two new tests at the end of the `Terminal mode` describe block**

```ts
test('stats command shows Claude Code metrics', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("terminal")');
  await page.getByTestId('terminal').locator('input').fill('stats');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('terminal')).toContainText('Claude Code Stats');
  await expect(page.getByTestId('terminal')).toContainText('Goal Rate');
  await expect(page.getByTestId('terminal')).toContainText('Messages');
  await expect(page.getByTestId('terminal')).toContainText('Work Breakdown');
});

test('stats with invalid slug shows error', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("terminal")');
  await page.getByTestId('terminal').locator('input').fill('stats bad-slug');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('terminal')).toContainText('not found');
});
```

- [ ] **Step 2: Run e2e tests**

```bash
pnpm test:e2e e2e/terminal.spec.ts
```

Expected: All terminal tests PASS including the two new ones

- [ ] **Step 3: Commit**

```bash
git add e2e/terminal.spec.ts
git commit -m "test: add e2e tests for stats terminal command"
```
