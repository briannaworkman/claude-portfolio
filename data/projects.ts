export type ClaudeTag = 'built-with' | 'powered-by';

export type Project = {
  slug: string;
  title: string;
  description: string;
  url?: string;
  repo?: string;
  tags: string[];
  featured: boolean;
  claudeTag: ClaudeTag | null;
};

export const claudeTagLabel: Record<ClaudeTag, string> = {
  'built-with': 'Built with Claude',
  'powered-by': 'Powered by Claude',
};

export const projects: Project[] = [
  {
    slug: 'claude-portfolio',
    title: 'Claude Portfolio',
    description: 'This portfolio — built from scratch with Claude Code.',
    repo: 'https://github.com/briannaworkman/claude-portfolio',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    featured: true,
    claudeTag: 'built-with',
  },
];
