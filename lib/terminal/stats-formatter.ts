import type { OutputLine } from '@/components/terminal/TerminalOutput';
import type { MonthData } from '@/data/stats';

function line(text: string): OutputLine {
  return { id: crypto.randomUUID(), type: 'output', text };
}

export function formatStats(month: MonthData): OutputLine[] {
  const m = month.metrics;

  const rows = [
    { label: 'Goal Rate', value: `${m.goalRate}%`, note: `across ${m.sessions} sessions` },
    { label: 'Messages', value: m.messages.toLocaleString(), note: `${m.msgsPerDay}/day avg` },
    { label: 'Commits', value: m.commits.toLocaleString(), note: '' },
    { label: 'Agent Calls', value: m.agentCalls.toLocaleString(), note: `+ ${m.taskCreates} TaskCreate` },
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

  const labelW = Math.max(0, ...month.workBreakdown.map((w) => w.label.length));
  const sessionW = Math.max(0, ...month.workBreakdown.map((w) => String(w.sessions).length));

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
