export type SkillCategory = {
  name: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'REST APIs'],
  },
  {
    name: 'AI & Tooling',
    skills: ['Claude API', 'Claude Code', 'Anthropic SDK', 'Prompt Engineering'],
  },
  {
    name: 'Dev Tools',
    skills: ['Git', 'Biome', 'Vitest', 'Playwright', 'Vercel'],
  },
];
