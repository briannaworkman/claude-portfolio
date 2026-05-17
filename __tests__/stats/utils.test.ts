import { describe, expect, it } from 'vitest';
import { fmt, getDelta, getDeltaPct } from '@/components/web/stats/utils';

const makeMonth = (overrides: Partial<{ [k: string]: number }> = {}) => ({
  month: 'Mar 9 – Apr 9',
  slug: '2026-04',
  metrics: {
    messages: 1000,
    sessions: 50,
    files: 100,
    linesAdded: 5000,
    linesRemoved: 500,
    commits: 100,
    goalRate: 90,
    agentCalls: 100,
    taskCreates: 50,
    multiClaudingPct: 10,
    msgsPerDay: 40,
    frictionScore: 3,
    ...overrides,
  },
  workBreakdown: [],
  horizon: [],
  implemented: [],
});

// ─── fmt ──────────────────────────────────────────────────────────────────────

describe('fmt', () => {
  it('returns numbers under 1000 as plain strings', () => {
    expect(fmt(0)).toBe('0');
    expect(fmt(999)).toBe('999');
  });

  it('formats numbers >= 1000 with locale commas', () => {
    expect(fmt(1000)).toBe('1,000');
    expect(fmt(28997)).toBe('28,997');
  });

  it('passes strings through unchanged', () => {
    expect(fmt('hello')).toBe('hello');
    expect(fmt('1,234')).toBe('1,234');
  });
});

// ─── getDelta ─────────────────────────────────────────────────────────────────

describe('getDelta', () => {
  it('returns null when there is no previous month', () => {
    const current = makeMonth({ messages: 1200 });
    expect(getDelta(current, null, 'messages')).toBeNull();
  });

  it('returns null when the value has not changed', () => {
    const current = makeMonth({ messages: 1000 });
    const prev = makeMonth({ messages: 1000 });
    expect(getDelta(current, prev, 'messages')).toBeNull();
  });

  it('returns green up-arrow for a positive change', () => {
    const current = makeMonth({ messages: 1200 });
    const prev = makeMonth({ messages: 1000 });
    const result = getDelta(current, prev, 'messages');
    expect(result).not.toBeNull();
    expect(result?.display).toBe('▲ 200');
    expect(result?.color).toBe('#00ff9d');
  });

  it('returns red down-arrow for a negative change', () => {
    const current = makeMonth({ messages: 800 });
    const prev = makeMonth({ messages: 1000 });
    const result = getDelta(current, prev, 'messages');
    expect(result).not.toBeNull();
    expect(result?.display).toBe('▼ 200');
    expect(result?.color).toBe('#f43f5e');
  });

  it('inverts color logic when invertGood is true (lower is better)', () => {
    const current = makeMonth({ frictionScore: 2 });
    const prev = makeMonth({ frictionScore: 5 });
    const result = getDelta(current, prev, 'frictionScore', true);
    expect(result).not.toBeNull();
    // went down — normally red, but invertGood means this is good → green
    expect(result?.display).toBe('▼ 3');
    expect(result?.color).toBe('#00ff9d');
  });

  it('marks an increase as bad when invertGood is true', () => {
    const current = makeMonth({ frictionScore: 7 });
    const prev = makeMonth({ frictionScore: 3 });
    const result = getDelta(current, prev, 'frictionScore', true);
    expect(result).not.toBeNull();
    expect(result?.display).toBe('▲ 4');
    expect(result?.color).toBe('#f43f5e');
  });
});

// ─── getDeltaPct ──────────────────────────────────────────────────────────────

describe('getDeltaPct', () => {
  it('returns null when there is no previous month', () => {
    const current = makeMonth({ goalRate: 96 });
    expect(getDeltaPct(current, null, 'goalRate')).toBeNull();
  });

  it('returns null when the value has not changed', () => {
    const current = makeMonth({ goalRate: 90 });
    const prev = makeMonth({ goalRate: 90 });
    expect(getDeltaPct(current, prev, 'goalRate')).toBeNull();
  });

  it('appends a % to the display value', () => {
    const current = makeMonth({ goalRate: 96 });
    const prev = makeMonth({ goalRate: 90 });
    const result = getDeltaPct(current, prev, 'goalRate');
    expect(result).not.toBeNull();
    expect(result?.display).toBe('▲ 6%');
    expect(result?.color).toBe('#00ff9d');
  });

  it('shows a red down-arrow for a decrease', () => {
    const current = makeMonth({ goalRate: 85 });
    const prev = makeMonth({ goalRate: 90 });
    const result = getDeltaPct(current, prev, 'goalRate');
    expect(result).not.toBeNull();
    expect(result?.display).toBe('▼ 5%');
    expect(result?.color).toBe('#f43f5e');
  });

  it('inverts color logic when invertGood is true', () => {
    const current = makeMonth({ frictionScore: 1 });
    const prev = makeMonth({ frictionScore: 3 });
    const result = getDeltaPct(current, prev, 'frictionScore', true);
    expect(result).not.toBeNull();
    expect(result?.display).toBe('▼ 2%');
    expect(result?.color).toBe('#00ff9d');
  });
});
