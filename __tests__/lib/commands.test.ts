import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { findProjectBySlug } from '@/lib/terminal/commands';

describe('findProjectBySlug', () => {
  const firstSlug = projects[0]?.slug ?? 'claude-portfolio';

  it('finds a project by exact slug', () => {
    const result = findProjectBySlug(firstSlug);
    expect(result).toBeDefined();
    expect(result?.slug).toBe(firstSlug);
  });

  it('matches case-insensitively', () => {
    const result = findProjectBySlug(firstSlug.toUpperCase());
    expect(result?.slug).toBe(firstSlug);
  });

  it('returns undefined for unknown slug', () => {
    expect(findProjectBySlug('not-a-real-slug-xyz')).toBeUndefined();
  });
});
