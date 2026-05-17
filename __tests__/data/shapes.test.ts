import { describe, expect, it } from 'vitest';
import { about } from '@/data/about';
import { projects } from '@/data/projects';
import { social } from '@/data/social';

describe('data/projects', () => {
  it('every project has a lowercase slug', () => {
    for (const p of projects) {
      expect(p.slug).toBe(p.slug.toLowerCase());
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('every project has at least one tag', () => {
    for (const p of projects) {
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it('claudeTags contains only built-with or powered-by values', () => {
    const valid = new Set(['built-with', 'powered-by']);
    for (const p of projects) {
      for (const tag of p.claudeTags) {
        expect(valid.has(tag)).toBe(true);
      }
    }
  });
});

describe('data/about', () => {
  it('availability is a valid value', () => {
    const valid = new Set(['open', 'not-looking', 'freelance']);
    expect(valid.has(about.availability)).toBe(true);
  });

  it('experience entries have valid date format', () => {
    for (const exp of about.experience) {
      expect(exp.startDate).toMatch(/^\d{4}-\d{2}$/);
      if (exp.endDate !== 'present') {
        expect(exp.endDate).toMatch(/^\d{4}-\d{2}$/);
      }
    }
  });
});

describe('data/social', () => {
  it('non-null URLs start with https', () => {
    const urlFields: Array<keyof typeof social> = ['github', 'linkedin'];
    for (const key of urlFields) {
      const url = social[key];
      if (url !== null) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });
});

import { STATS_DATA } from '@/data/stats';

describe('data/stats', () => {
  it('STATS_DATA is ordered oldest-first by slug', () => {
    for (let i = 1; i < STATS_DATA.length; i++) {
      expect(STATS_DATA[i].slug >= STATS_DATA[i - 1].slug).toBe(true);
    }
  });

  it('outcomes values are non-negative when present', () => {
    for (const month of STATS_DATA) {
      if (!month.outcomes) continue;
      const { fully, mostly, partially, notAchieved, unclear } = month.outcomes;
      for (const val of [fully, mostly, partially, notAchieved, unclear]) {
        expect(val).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('outcomes total is positive when present', () => {
    for (const month of STATS_DATA) {
      if (!month.outcomes) continue;
      const { fully, mostly, partially, notAchieved, unclear } = month.outcomes;
      expect(fully + mostly + partially + notAchieved + unclear).toBeGreaterThan(0);
    }
  });
});
