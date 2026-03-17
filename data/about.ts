export type Availability = 'open' | 'not-looking' | 'freelance';

export type Experience = {
  company: string;
  role: string;
  startDate: string; // "YYYY-MM"
  endDate: string | 'present';
  description: string;
};

export type Education = {
  institution: string;
  degree: string;
  graduationYear: number;
};

export type About = {
  name: string;
  title: string;
  bio: string;
  availability: Availability;
  experience: Experience[];
  education: Education[];
  interests: string[];
};

export const about: About = {
  name: 'Brianna Workman',
  title: 'Software Engineer',
  bio: 'Frontend-focused software engineer who loves building with AI. I use Claude heavily in my workflow and am passionate about finding new ways AI can improve how we build software.',
  availability: 'not-looking',
  experience: [
    {
      company: 'Your Company',
      role: 'Software Engineer',
      startDate: '2023-01',
      endDate: 'present',
      description: 'Add your experience here.',
    },
  ],
  education: [
    {
      institution: 'Your University',
      degree: 'B.S. Computer Science',
      graduationYear: 2023,
    },
  ],
  interests: [
    'AI-assisted development',
    'Claude Code workflows',
    'Frontend engineering',
    'Design systems',
    'Developer tooling',
  ],
};
