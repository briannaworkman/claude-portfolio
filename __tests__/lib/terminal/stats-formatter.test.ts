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
