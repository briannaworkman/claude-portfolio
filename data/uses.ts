export type UsesCategory = {
  name: string;
  items: Array<{ name: string; description: string }>;
};

export const usesCategories: UsesCategory[] = [
  {
    name: 'Editor',
    items: [{ name: 'Cursor', description: 'AI-native editor — my daily driver.' }],
  },
  {
    name: 'Terminal',
    items: [{ name: 'cmux', description: 'Native macOS terminal built on Ghostty for managing multiple AI coding agents.' }],
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
