export type UsesCategory = {
  name: string;
  items: Array<{ name: string; description: string }>;
};

export const usesCategories: UsesCategory[] = [
  {
    name: 'Editor',
    items: [
      { name: 'Cursor', description: 'AI-native editor — my daily driver.' },
      { name: 'Claude Code', description: 'For bigger refactors and feature work.' },
    ],
  },
  {
    name: 'Terminal',
    items: [{ name: 'iTerm2', description: 'With Zsh and Oh My Zsh.' }],
  },
  {
    name: 'AI Tools',
    items: [
      { name: 'Claude', description: 'Used in every part of my workflow.' },
      { name: 'Claude Code', description: 'Agentic coding — the real deal.' },
    ],
  },
  {
    name: 'Tech Stack',
    items: [
      { name: 'Next.js + Vercel', description: 'Default choice for new projects.' },
      { name: 'Tailwind CSS', description: 'Makes styling fast and consistent.' },
    ],
  },
];
