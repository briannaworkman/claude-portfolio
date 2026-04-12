# Stats Terminal Command — Design Spec

**Date:** 2026-04-12  
**Status:** Approved

## Overview

Add a `stats` command to the portfolio terminal that displays Claude Code usage metrics for a given month. The data mirrors what the `/stats` web page shows on the Metrics tab.

## Command Interface

```
stats              Show the latest month's stats (default)
stats <slug>       Show a specific month's stats (e.g. stats 2026-04)
```

**Error case:** If the slug is not found:
```
error: month '<slug>' not found. run stats to see available months.
```

## Output Format

```
Claude Code Stats — Mar 9 – Apr 9

  Goal Rate     96%   across 101 sessions
  Messages    1,328   55.3/day avg
  Commits       224
  Agent Calls   257   + 176 TaskCreate
  Friction        3

Lines of Code:
  +28,997 added  /  -2,922 removed  /  420 files

Work Breakdown:
  Frontend Dev        20 sessions
  PR Review           14 sessions
  Git / Branches      10 sessions
  Docs / Knowledge     6 sessions
  DevOps / Prod        5 sessions

  Multi-clauding: 10%  ·  TaskCreate: 176  ·  Sessions: 101
```

All values are plain text with column-aligned labels. No ASCII bars.

## Architecture

### New file: `lib/terminal/stats-formatter.ts`

Takes a `MonthData` object and returns `OutputLine[]`. All formatting logic lives here — number formatting, label alignment, section rendering. Isolated so it is independently testable.

### Modified: `lib/terminal/commands.ts`

Add a `stats` case to the `runCommand` switch:
1. Read optional slug from `args[0]`
2. If slug provided: find matching `MonthData` in `STATS_DATA` by `slug` field; return error if not found
3. If no slug: use last item in `STATS_DATA` as the current month
4. Delegate to `formatStats(month)` from the formatter module
5. Add `stats [month]` line to `HELP_TEXT`

### Modified: `lib/terminal/parser.ts`

No changes needed. Single-word commands with optional args are already handled by the default parse path.

### Modified: `components/terminal/TerminalInput.tsx`

Add `'stats'` to `BASE_COMMANDS` for tab completion.

### Modified: `e2e/terminal.spec.ts`

Add two tests:
- `stats` returns key metric values (goal rate, messages, commits)
- `stats <invalid-slug>` returns the not-found error message

## Data Source

`STATS_DATA` from `data/stats.ts` — statically imported client-side. No API route needed.

## Out of Scope

- Assessment tab data (strengths, rough edges) — not included
- Horizon / implemented items — not included
- Delta/comparison values between months — not included
