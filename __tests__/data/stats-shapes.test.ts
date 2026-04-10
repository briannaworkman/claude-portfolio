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

  it('horizon item IDs are unique across all months', () => {
    const allIds = STATS_DATA.flatMap((d) => d.horizon.map((h) => h.id));
    expect(new Set(allIds).size).toBe(allIds.length);
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
