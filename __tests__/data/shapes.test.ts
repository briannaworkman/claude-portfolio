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

  it('claudeTag is null, built-with, or powered-by', () => {
    const valid = new Set([null, 'built-with', 'powered-by']);
    for (const p of projects) {
      expect(valid.has(p.claudeTag)).toBe(true);
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
