export type ClaudeTag = 'built-with' | 'powered-by';

export type Project = {
  slug: string;
  title: string;
  description: string;
  url?: string;
  repo?: string;
  tags: string[];
  featured: boolean;
  claudeTags: ClaudeTag[];
};

export const claudeTagLabel: Record<ClaudeTag, string> = {
  'built-with': 'Built with Claude',
  'powered-by': 'Powered by Claude',
};

export const projects: Project[] = [
  {
    slug: 'luna',
    title: 'Luna',
    description:
      'Multi-agent lunar research co-pilot powered by Opus 4.7. Helps curious non-specialists reason across real NASA data.',
    url: 'https://luna-copilot.vercel.app/',
    repo: 'https://github.com/briannaworkman/luna',
    tags: ['Next.js', 'TypeScript', 'Anthropic SDK'],
    featured: true,
    claudeTags: ['built-with', 'powered-by'],
  },
  {
    slug: 'claude-portfolio',
    title: 'Claude Portfolio',
    description: 'This portfolio — built from scratch with Claude Code.',
    repo: 'https://github.com/briannaworkman/claude-portfolio',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    featured: true,
    claudeTags: ['built-with'],
  },
];
