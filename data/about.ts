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
  location: string;
  bio: string;
  availability: Availability;
  experience: Experience[];
  education: Education[];
  interests: string[];
};

export const about: About = {
  name: 'Bri Workman',
  title: 'Software Engineer',
  location: 'Detroit Metropolitan Area',
  bio: 'Frontend-focused software engineer who loves building with AI. I use Claude heavily in my workflow and am passionate about finding new ways AI can improve how we build software.',
  availability: 'not-looking',
  experience: [
    {
      company: 'Signal Advisors',
      role: 'Software Engineer',
      startDate: '2025-09',
      endDate: 'present',
      description:
        'Currently playing a key role in designing, building, and evolving Signals core platform. I focus on front end development to help deliver highly reliable, secure, and intuitive software for a fast-growing financial services business.',
    },
    {
      company: 'Nerdery',
      role: 'Software Engineer',
      startDate: '2020-11',
      endDate: '2025-09',
      description:
        'I developed and maintained responsive, accessible, and performant web applications using modern front-end technologies such as React, Next.js, Tailwind, and JavaScript/TypeScript. Working remotely in an agile environment, I translated user stories and product requirements into high-quality, scalable code while collaborating closely withcross-functional teams — including design, product management, QA, and clients — to align on technical solutions and delivery timelines. I actively participated in code reviews, contributing to a culture of continuous improvement through constructive feedback. I also engaged directly with clients to gather requirements, demo features, and provide technical guidance, fostering transparency and trust throughout the development lifecycle.',
    },
    {
      company: 'BloomTech',
      role: 'Web Development Team Lead',
      startDate: '2019-10',
      endDate: '2020-11',
      description:
        "I provided comprehensive support to a team of 10 students in an environment that emulated real-world software development using Agile methodology. I facilitated daily standup meetings to build camaraderie, encourage the sharing of ideas and progress, and offer guidance on that week's study material, while also delivering one-on-one feedback and code reviews on a weekly basis. Through a dedicated Slack help channel, I provided daily issue resolution and curriculum feedback, and delivered supplemental lectures on various software engineering topics. Beyond technical guidance, I focused on mentoring students on how to learn effectively and approach problem-solving, reviewing their code and offering detailed, constructive feedback to support their growth.",
    },
  ],
  education: [
    {
      institution: 'BloomTech',
      degree: 'Full Stack Web Development, Computer Science',
      graduationYear: 2020,
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
