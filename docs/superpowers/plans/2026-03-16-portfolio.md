# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, bold personal portfolio with dual web/terminal modes, Claude-powered `ask` command, blog, projects, uses, and contact form — deployed on Vercel.

**Architecture:** Next.js App Router with a shared TypeScript content layer. Terminal mode is a full-screen overlay toggled via navbar button or `Ctrl+\``. Both modes read from the same data files in `data/`. The only server-side endpoint is `/api/ask` for the Claude-powered terminal command.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS, Biome, Vitest, Playwright, Anthropic SDK, Formspree, Vercel. Package manager: pnpm. Node: 20 LTS.

---

## File Map

```
claude-portfolio/
├── .github/workflows/ci.yml
├── app/
│   ├── globals.css
│   ├── layout.tsx              # Root layout: Geist fonts, ModeProvider, Navbar
│   ├── page.tsx                # Landing: Hero, AboutSummary, Skills, FeaturedProjects
│   ├── projects/page.tsx       # Full project grid
│   ├── blog/
│   │   ├── page.tsx            # Blog post list
│   │   └── [slug]/page.tsx     # Individual MDX blog post
│   ├── uses/page.tsx
│   ├── contact/page.tsx
│   └── api/ask/route.ts        # Claude streaming endpoint
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Nav + mode toggle button
│   │   └── Footer.tsx
│   ├── web/
│   │   ├── Hero.tsx
│   │   ├── AboutSummary.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ClaudeTagBadge.tsx  # Purple glow badge
│   │   └── ContactForm.tsx     # Formspree form
│   └── terminal/
│       ├── Terminal.tsx        # Full-screen overlay + macOS chrome
│       ├── TerminalInput.tsx   # Input with history + tab autocomplete
│       └── TerminalOutput.tsx  # Renders output lines
├── lib/
│   ├── terminal/
│   │   ├── parser.ts           # parseCommand(input) → {command, args}
│   │   ├── commands.ts         # All command handlers
│   │   └── rate-limiter.ts     # Sliding window rate limiter (server only)
│   └── mdx.ts                  # MDX post loading helpers
├── context/
│   └── ModeContext.tsx         # 'web' | 'terminal' mode with localStorage
├── data/
│   ├── projects.ts
│   ├── about.ts
│   ├── skills.ts
│   ├── uses.ts
│   └── social.ts
├── content/blog/hello-world.mdx
├── public/                     # resume.pdf goes here
├── __tests__/
│   ├── lib/parser.test.ts
│   ├── lib/rate-limiter.test.ts
│   └── components/ClaudeTagBadge.test.ts
├── e2e/
│   ├── navigation.spec.ts
│   ├── terminal.spec.ts
│   └── contact.spec.ts
├── .env.local.example
├── biome.json
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## Chunk 1: Project Scaffolding

**Goal:** Working Next.js project with all tooling configured and CI passing on an empty app.

---

### Task 1.1: Initialize Next.js project

**Files:**
- Creates: entire project scaffold

- [ ] **Step 1: Scaffold Next.js with pnpm**

```bash
# Run from the parent directory of claude-portfolio
# Since the repo already exists, initialize inside it
cd /path/to/claude-portfolio
pnpm dlx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint=false \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --use-pnpm
```

When prompted:
- Would you like to use ESLint? → No (we use Biome)
- Would you like to customize the default import alias? → Yes, keep `@/*`

- [ ] **Step 2: Verify it runs**

```bash
pnpm dev
```

Expected: server starts at `http://localhost:3000` with default Next.js page.

- [ ] **Step 3: Remove boilerplate**

Delete the default content from `app/page.tsx` and `app/globals.css` — leave them as empty shells:

```tsx
// app/page.tsx
export default function Home() {
  return <main />
}
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Task 1.2: Install dependencies

**Files:**
- Modifies: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
pnpm add @anthropic-ai/sdk next-mdx-remote gray-matter
```

- [ ] **Step 2: Install dev dependencies**

```bash
pnpm add -D \
  @biomejs/biome \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  @playwright/test \
  next-test-api-route-handler
```

- [ ] **Step 3: Install Playwright browsers**

```bash
pnpm dlx playwright install --with-deps chromium
```

---

### Task 1.3: Configure Biome

**Files:**
- Create: `biome.json`

- [ ] **Step 1: Initialize Biome**

```bash
pnpm biome init
```

- [ ] **Step 2: Replace `biome.json` with project config**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": [".next", "node_modules", "public"]
  }
}
```

- [ ] **Step 3: Add Biome scripts to `package.json`**

Add to the `"scripts"` section:

```json
"lint": "biome check .",
"lint:fix": "biome check --write .",
"format": "biome format --write ."
```

- [ ] **Step 4: Run lint to verify**

```bash
pnpm lint
```

Expected: exits 0 (or minor warnings — fix any errors).

---

### Task 1.4: Configure Tailwind with custom theme

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#1a1a1a',
        'surface-hover': '#222222',
        border: '#2a2a2a',
        'text-primary': '#f0f0f0',
        'text-muted': '#6b6b6b',
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        claude: '0 0 12px rgba(139, 92, 246, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-text-primary font-sans;
  }

  ::selection {
    @apply bg-violet-600 text-white;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-surface;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border rounded-full;
  }
}
```

- [ ] **Step 3: Verify Tailwind works**

Add a test class to `app/page.tsx` (`className="bg-surface p-8"`), run `pnpm dev`, check it renders a dark gray box. Remove the class after verifying.

---

### Task 1.5: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `__tests__/setup.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    globals: true,
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 2: Create `__tests__/setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Add test script to `package.json`**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a smoke test to verify setup**

Create `__tests__/smoke.test.ts`:

```ts
describe('Vitest setup', () => {
  it('works', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: 1 test passes.

- [ ] **Step 6: Delete `__tests__/smoke.test.ts`**

---

### Task 1.6: Configure Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/.gitkeep`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 2: Add e2e scripts to `package.json`**

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

- [ ] **Step 3: Create `e2e/` directory placeholder**

```bash
touch e2e/.gitkeep
```

---

### Task 1.7: Create environment variable files

**Files:**
- Create: `.env.local.example`
- Create: `.env.test`
- Modify: `.gitignore` (ensure `.env.local` is ignored)

- [ ] **Step 1: Create `.env.local.example`**

```bash
# Claude API key from https://console.anthropic.com
ANTHROPIC_API_KEY=your_key_here

# Formspree endpoint from https://formspree.io
# Format: https://formspree.io/f/YOUR_FORM_ID
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

- [ ] **Step 2: Create `.env.test` for CI stubs**

```bash
ANTHROPIC_API_KEY=test_key_not_real
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/test
```

- [ ] **Step 3: Add a placeholder `public/resume.pdf`**

Create a placeholder so the resume link and terminal command don't 404 during development:

```bash
# Create a minimal placeholder PDF (1-byte file — replace with your real resume before deploying)
echo "%PDF-1.0" > public/resume.pdf
```

Add to `.gitignore` if you don't want to commit your real resume — or commit the placeholder and replace it when ready.

- [ ] **Step 4: Verify `.gitignore` has `.env.local`**

Check `.gitignore` contains `.env.local`. Next.js scaffolding includes this by default.

---

### Task 1.8: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Unit tests
        run: pnpm test
        env:
          ANTHROPIC_API_KEY: test_key_not_real
          NEXT_PUBLIC_FORMSPREE_ENDPOINT: https://formspree.io/f/test

      - name: Install Playwright browsers
        run: pnpm dlx playwright install --with-deps chromium

      - name: E2E tests (includes build via webServer config)
        run: pnpm test:e2e
        env:
          CI: true
          ANTHROPIC_API_KEY: test_key_not_real
          NEXT_PUBLIC_FORMSPREE_ENDPOINT: https://formspree.io/f/test

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

- [ ] **Step 2: Commit Chunk 1**

```bash
git add -A
git commit -m "chore: scaffold project with Next.js, Biome, Tailwind, Vitest, Playwright, CI"
```

---

## Chunk 2: Content Layer

**Goal:** All data files typed and populated with placeholder content. MDX blog setup working.

---

### Task 2.1: Data types and files

**Files:**
- Create: `data/projects.ts`
- Create: `data/about.ts`
- Create: `data/skills.ts`
- Create: `data/uses.ts`
- Create: `data/social.ts`

- [ ] **Step 1: Create `data/projects.ts`**

```ts
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
    url: 'https://briannaworkman.dev',
    repo: 'https://github.com/briannaworkman/claude-portfolio',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    featured: true,
    claudeTag: 'built-with',
  },
];
```

- [ ] **Step 2: Create `data/about.ts`**

```ts
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
```

- [ ] **Step 3: Create `data/skills.ts`**

```ts
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
```

- [ ] **Step 4: Create `data/uses.ts`**

```ts
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
    items: [
      { name: 'iTerm2', description: 'With Zsh and Oh My Zsh.' },
    ],
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
```

- [ ] **Step 5: Create `data/social.ts`**

```ts
export type Social = {
  github: string | null;
  linkedin: string | null;
  email: string | null;
};

export const social: Social = {
  github: 'https://github.com/briannaworkman',
  linkedin: 'https://linkedin.com/in/briannaworkman',
  email: 'hello@briannaworkman.dev',
};
```

---

### Task 2.2: Data shape unit tests

**Files:**
- Create: `__tests__/data/shapes.test.ts`

- [ ] **Step 1: Write failing data shape tests**

```ts
// __tests__/data/shapes.test.ts
import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { about } from '@/data/about';
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
    for (const [, url] of Object.entries(social)) {
      if (url !== null) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });
});
```

- [ ] **Step 2: Run tests — expect them to pass immediately** (tests validate the data we just wrote)

```bash
pnpm test
```

Expected: all pass.

---

### Task 2.3: MDX blog setup

**Files:**
- Create: `lib/mdx.ts`
- Create: `content/blog/hello-world.mdx`

- [ ] **Step 1: Create `lib/mdx.ts`**

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date string "YYYY-MM-DD"
  description: string;
};

export type Post = PostMeta & {
  content: string;
};

export function getAllPostMetas(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const file = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
      const { data } = matter(file);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const file = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(file);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    content,
  };
}
```

- [ ] **Step 2: Create `content/blog/hello-world.mdx`**

```mdx
---
title: Hello World
date: 2026-03-16
description: First post — a placeholder while I get the blog set up.
---

# Hello World

Welcome to my blog. More posts coming soon.
```

- [ ] **Step 3: Configure `next.config.ts` for MDX if needed**

```ts
// next.config.ts — next-mdx-remote handles MDX processing at runtime,
// no special Next.js config needed for it. Leave as default:
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Commit Chunk 2**

```bash
git add -A
git commit -m "feat: add content layer — data types, placeholder data, MDX setup"
```

---

## Chunk 3: Mode System + Shared Layout

**Goal:** Root layout with Geist fonts, mode context with localStorage persistence, Navbar with toggle button and keyboard shortcut.

---

### Task 3.1: Mode context

**Files:**
- Create: `context/ModeContext.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/context/ModeContext.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { ModeProvider, useMode } from '@/context/ModeContext';

describe('ModeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to web mode', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    expect(result.current.mode).toBe('web');
  });

  it('toggles from web to terminal', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    act(() => result.current.toggle());
    expect(result.current.mode).toBe('terminal');
  });

  it('toggles from terminal back to web', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    act(() => result.current.toggle());
    act(() => result.current.toggle());
    expect(result.current.mode).toBe('web');
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useMode(), { wrapper: ModeProvider });
    act(() => result.current.toggle());
    expect(localStorage.getItem('portfolio-mode')).toBe('terminal');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test __tests__/context/ModeContext.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `context/ModeContext.tsx`**

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'web' | 'terminal';

type ModeContextValue = {
  mode: Mode;
  toggle: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = 'portfolio-mode';

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('web');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'terminal') setMode('terminal');
  }, []);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === 'web' ? 'terminal' : 'web';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return <ModeContext.Provider value={{ mode, toggle }}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test __tests__/context/ModeContext.test.tsx
```

Expected: all 4 tests pass.

---

### Task 3.2: Navbar

**Files:**
- Create: `components/layout/Navbar.tsx`

- [ ] **Step 1: Create `components/layout/Navbar.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useMode } from '@/context/ModeContext';

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/uses', label: 'Uses' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { mode, toggle } = useMode();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-violet-400 font-semibold tracking-tight">
          brianna.dev
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {label}
            </Link>
          ))}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            Resume
          </a>

          <button
            onClick={toggle}
            className="text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-violet-500 text-text-muted hover:text-violet-400 transition-all"
            title="Toggle terminal mode (Ctrl+`)"
          >
            {mode === 'web' ? '> terminal' : '⬡ web'}
          </button>
        </div>
      </div>
    </nav>
  );
}
```

---

### Task 3.3: Footer

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Create `components/layout/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-8">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-text-muted text-sm">
        <span className="font-mono">brianna workman</span>
        <span>built with claude code</span>
      </div>
    </footer>
  );
}
```

---

### Task 3.4: Root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install Geist font package** (may already be included by Next.js scaffold)

```bash
pnpm add geist
```

- [ ] **Step 2: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ModeProvider } from '@/context/ModeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Terminal } from '@/components/terminal/Terminal';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Brianna Workman — Software Engineer',
  description:
    'Frontend-focused software engineer building with AI. Explore my projects, writing, and workflow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-bg text-text-primary antialiased">
        <ModeProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
          <Footer />
          <Terminal />
        </ModeProvider>
      </body>
    </html>
  );
}
```

Note: `Terminal` is imported here but written in Chunk 5. Create a placeholder for now:

```tsx
// components/terminal/Terminal.tsx — placeholder
export function Terminal() {
  return null;
}
```

- [ ] **Step 3: Verify app renders**

```bash
pnpm dev
```

Expected: page loads with navbar and dark background. No console errors.

- [ ] **Step 4: Commit Chunk 3**

```bash
git add -A
git commit -m "feat: add mode context, navbar with toggle, root layout"
```

---

## Chunk 4: Web Mode Pages

**Goal:** All web mode pages and shared components — landing, projects, blog, uses, contact.

---

### Task 4.1: ClaudeTagBadge component

**Files:**
- Create: `components/web/ClaudeTagBadge.tsx`
- Create: `__tests__/components/ClaudeTagBadge.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// __tests__/components/ClaudeTagBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClaudeTagBadge } from '@/components/web/ClaudeTagBadge';

describe('ClaudeTagBadge', () => {
  it('renders "Built with Claude" for built-with', () => {
    render(<ClaudeTagBadge tag="built-with" />);
    expect(screen.getByText('Built with Claude')).toBeInTheDocument();
  });

  it('renders "Powered by Claude" for powered-by', () => {
    render(<ClaudeTagBadge tag="powered-by" />);
    expect(screen.getByText('Powered by Claude')).toBeInTheDocument();
  });

  it('renders nothing for null', () => {
    const { container } = render(<ClaudeTagBadge tag={null} />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test __tests__/components/ClaudeTagBadge.test.tsx
```

- [ ] **Step 3: Create `components/web/ClaudeTagBadge.tsx`**

```tsx
import { claudeTagLabel, type ClaudeTag } from '@/data/projects';

type Props = {
  tag: ClaudeTag | null;
};

export function ClaudeTagBadge({ tag }: Props) {
  if (!tag) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border border-violet-500/50 text-violet-400 shadow-claude bg-violet-500/5">
      ◆ {claudeTagLabel[tag]}
    </span>
  );
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pnpm test __tests__/components/ClaudeTagBadge.test.tsx
```

---

### Task 4.2: ProjectCard component

**Files:**
- Create: `components/web/ProjectCard.tsx`

- [ ] **Step 1: Create `components/web/ProjectCard.tsx`**

```tsx
import Link from 'next/link';
import { ClaudeTagBadge } from '@/components/web/ClaudeTagBadge';
import type { Project } from '@/data/projects';

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <article className="group relative flex flex-col gap-3 p-5 rounded-lg border border-border bg-surface hover:border-violet-500/40 hover:bg-surface-hover transition-all">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-text-primary group-hover:text-violet-400 transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0 text-text-muted">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub ↗
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-text-muted">{project.description}</p>

      <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
        <ClaudeTagBadge tag={project.claudeTag} />
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-2 py-0.5 rounded bg-border text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
```

---

### Task 4.3: Landing page sections

**Files:**
- Create: `components/web/Hero.tsx`
- Create: `components/web/AboutSummary.tsx`
- Create: `components/web/SkillsSection.tsx`
- Create: `components/web/FeaturedProjects.tsx`

- [ ] **Step 1: Create `components/web/Hero.tsx`**

```tsx
import { about } from '@/data/about';

export function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <div className="space-y-4">
        <p className="font-mono text-amber-400 text-sm">hi, i'm</p>
        <h1 className="text-5xl font-bold tracking-tight text-text-primary">
          {about.name}
        </h1>
        <p className="text-2xl text-text-muted font-light">{about.title}</p>
        <p className="max-w-xl text-text-muted leading-relaxed pt-2">{about.bio}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/web/SkillsSection.tsx`**

```tsx
import { skillCategories } from '@/data/skills';

export function SkillsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">
              {category.name}
            </h3>
            <ul className="space-y-1">
              {category.skills.map((skill) => (
                <li key={skill} className="text-sm text-text-muted">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/web/FeaturedProjects.tsx`**

```tsx
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/web/ProjectCard';
import Link from 'next/link';

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
```

---

### Task 4.4: Landing page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update `app/page.tsx`**

```tsx
import { Hero } from '@/components/web/Hero';
import { SkillsSection } from '@/components/web/SkillsSection';
import { FeaturedProjects } from '@/components/web/FeaturedProjects';

export default function Home() {
  return (
    <>
      <Hero />
      <SkillsSection />
      <FeaturedProjects />
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
pnpm dev
```

Expected: dark page with name, bio, skills grid, featured project card.

---

### Task 4.5: Projects page

**Files:**
- Create: `app/projects/page.tsx`

- [ ] **Step 1: Create `app/projects/page.tsx`**

```tsx
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/web/ProjectCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — Brianna Workman',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">Projects</h1>
      <p className="text-text-muted mb-10">Things I've built — with and without Claude.</p>

      {projects.length === 0 ? (
        <p className="text-text-muted font-mono">no projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Task 4.6: Blog pages

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create `app/blog/page.tsx`**

```tsx
import Link from 'next/link';
import { getAllPostMetas } from '@/lib/mdx';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Brianna Workman',
};

export default function BlogPage() {
  const posts = getAllPostMetas();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">Blog</h1>
      <p className="text-text-muted mb-10">Thoughts on AI, engineering, and workflow.</p>

      {posts.length === 0 ? (
        <p className="text-text-muted font-mono">nothing here yet, check back soon.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border pb-6 last:border-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                <time className="text-xs font-mono text-text-muted">{post.date}</time>
                <h2 className="mt-1 text-xl font-semibold group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-1 text-text-muted text-sm">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/blog/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPost, getAllPostMetas } from '@/lib/mdx';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostMetas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Brianna Workman` };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <time className="text-xs font-mono text-text-muted">{post.date}</time>
        <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
      </header>
      <div className="prose prose-invert prose-violet max-w-none">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Install Tailwind typography plugin for blog prose**

```bash
pnpm add -D @tailwindcss/typography
```

Add to `tailwind.config.ts`:

```ts
plugins: [require('@tailwindcss/typography')],
```

---

### Task 4.7: Uses page

**Files:**
- Create: `app/uses/page.tsx`

- [ ] **Step 1: Create `app/uses/page.tsx`**

```tsx
import { usesCategories } from '@/data/uses';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses — Brianna Workman',
};

export default function UsesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">Uses</h1>
      <p className="text-text-muted mb-10">
        My setup, tools, and the stack I reach for by default.
      </p>

      <div className="space-y-10">
        {usesCategories.map((category) => (
          <section key={category.name}>
            <h2 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-4">
              {category.name}
            </h2>
            <ul className="space-y-4">
              {category.items.map((item) => (
                <li key={item.name} className="flex gap-4">
                  <span className="font-medium text-text-primary w-32 shrink-0">
                    {item.name}
                  </span>
                  <span className="text-text-muted text-sm">{item.description}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 4.8: Contact form + page

**Files:**
- Create: `components/web/ContactForm.tsx`
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create `components/web/ContactForm.tsx`**

```tsx
'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');

  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) {
      setState('error');
      return;
    }

    setState('submitting');
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setState('success');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <p className="font-mono text-violet-400 py-8">
        ✓ Thanks! I'll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state === 'error' && (
        <p className="text-sm text-red-400 font-mono">
          Something went wrong. Try emailing me directly.
        </p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm text-text-muted mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-text-muted mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-text-muted mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded font-medium transition-colors"
      >
        {state === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `app/contact/page.tsx`**

```tsx
import { social } from '@/data/social';
import { ContactForm } from '@/components/web/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Brianna Workman',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">Contact</h1>
      <p className="text-text-muted mb-10">
        Say hi — I'm always happy to chat about projects, AI workflows, or engineering.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ContactForm />

        <div className="space-y-4">
          <h2 className="text-sm font-mono text-amber-400 uppercase tracking-wider">Elsewhere</h2>
          <ul className="space-y-2">
            {social.github && (
              <li>
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  GitHub ↗
                </a>
              </li>
            )}
            {social.linkedin && (
              <li>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  LinkedIn ↗
                </a>
              </li>
            )}
            {social.email && (
              <li>
                <a
                  href={`mailto:${social.email}`}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  {social.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit Chunk 4**

```bash
git add -A
git commit -m "feat: add web mode pages — landing, projects, blog, uses, contact"
```

---

## Chunk 5: Terminal Core

**Goal:** Command parser, terminal overlay component with macOS chrome, input with history and autocomplete.

---

### Task 5.1: Command parser

**Files:**
- Create: `lib/terminal/parser.ts`
- Create: `__tests__/lib/parser.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/lib/parser.test.ts
import { describe, expect, it } from 'vitest';
import { parseCommand } from '@/lib/terminal/parser';

describe('parseCommand', () => {
  it('parses a bare command', () => {
    expect(parseCommand('whoami')).toEqual({ command: 'whoami', args: [] });
  });

  it('parses command with single arg', () => {
    expect(parseCommand('cat my-project')).toEqual({
      command: 'cat',
      args: ['my-project'],
    });
  });

  it('parses multi-word command (ls projects)', () => {
    expect(parseCommand('ls projects')).toEqual({
      command: 'ls projects',
      args: [],
    });
  });

  it('parses open with subcommand', () => {
    expect(parseCommand('open github')).toEqual({
      command: 'open github',
      args: [],
    });
  });

  it('parses ask with multi-word question', () => {
    expect(parseCommand('ask what do you work on')).toEqual({
      command: 'ask',
      args: ['what do you work on'],
    });
  });

  it('trims whitespace', () => {
    expect(parseCommand('  whoami  ')).toEqual({ command: 'whoami', args: [] });
  });

  it('returns empty command for blank input', () => {
    expect(parseCommand('')).toEqual({ command: '', args: [] });
    expect(parseCommand('   ')).toEqual({ command: '', args: [] });
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test __tests__/lib/parser.test.ts
```

- [ ] **Step 3: Create `lib/terminal/parser.ts`**

```ts
// Multi-word commands that must be matched before splitting
const MULTI_WORD_COMMANDS = ['ls projects', 'open github', 'open linkedin'];

export type ParsedCommand = {
  command: string;
  args: string[];
};

export function parseCommand(raw: string): ParsedCommand {
  const input = raw.trim();
  if (!input) return { command: '', args: [] };

  // Check multi-word commands first
  for (const cmd of MULTI_WORD_COMMANDS) {
    if (input === cmd || input.startsWith(cmd + ' ')) {
      const rest = input.slice(cmd.length).trim();
      return { command: cmd, args: rest ? [rest] : [] };
    }
  }

  // Single-word commands with optional args
  const [command, ...rest] = input.split(' ');
  const args = rest.length > 0 ? [rest.join(' ')] : [];
  return { command, args };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test __tests__/lib/parser.test.ts
```

---

### Task 5.2: Terminal output component

**Files:**
- Create: `components/terminal/TerminalOutput.tsx`

- [ ] **Step 1: Create `components/terminal/TerminalOutput.tsx`**

```tsx
export type OutputLine = {
  id: string;
  type: 'input' | 'output' | 'error' | 'stream';
  text: string;
};

type Props = {
  lines: OutputLine[];
};

export function TerminalOutput({ lines }: Props) {
  return (
    <div className="flex flex-col gap-1 font-mono text-sm">
      {lines.map((line) => (
        <div
          key={line.id}
          className={
            line.type === 'input'
              ? 'text-white'
              : line.type === 'error'
                ? 'text-red-400'
                : 'text-text-primary/80'
          }
        >
          {line.type === 'input' && (
            <span className="text-amber-400 mr-2 select-none">{'>'}</span>
          )}
          <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}
```

---

### Task 5.3: Terminal input component

**Files:**
- Create: `components/terminal/TerminalInput.tsx`

- [ ] **Step 1: Create `components/terminal/TerminalInput.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';

const BASE_COMMANDS = [
  'help',
  'whoami',
  'experience',
  'skills',
  'ls projects',
  'blog',
  'uses',
  'contact',
  'availability',
  'open github',
  'open linkedin',
  'resume',
  'education',
  'interests',
  'clear',
];

const ALL_COMPLETIONS = [
  ...BASE_COMMANDS,
  ...projects.map((p) => `cat ${p.slug}`),
  'ask ',
];

type Props = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
};

export function TerminalInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      setHistory((h) => [trimmed, ...h]);
      setHistoryIndex(-1);
      onSubmit(trimmed);
      setValue('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex((i) => {
        const next = Math.min(i + 1, history.length - 1);
        setValue(history[next] ?? '');
        return next;
      });
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex((i) => {
        const next = Math.max(i - 1, -1);
        setValue(next === -1 ? '' : (history[next] ?? ''));
        return next;
      });
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const lower = value.toLowerCase();
      const match = ALL_COMPLETIONS.find((c) => c.startsWith(lower) && c !== lower);
      if (match) setValue(match);
    }
  }

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className="text-amber-400 select-none shrink-0">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? '' : 'type a command...'}
        className="flex-1 bg-transparent outline-none text-white placeholder:text-text-muted caret-amber-400"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
}
```

---

### Task 5.4: Terminal overlay component

**Files:**
- Modify: `components/terminal/Terminal.tsx` (replace placeholder)

- [ ] **Step 1: Replace placeholder `components/terminal/Terminal.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useMode } from '@/context/ModeContext';
import { TerminalInput } from '@/components/terminal/TerminalInput';
import { TerminalOutput, type OutputLine } from '@/components/terminal/TerminalOutput';
import { runCommand } from '@/lib/terminal/commands';

const WELCOME_LINES: OutputLine[] = [
  { id: 'w1', type: 'output', text: 'Type help to explore. Welcome!' },
];

export function Terminal() {
  const { mode, toggle } = useMode();
  const [lines, setLines] = useState<OutputLine[]>(WELCOME_LINES);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  async function handleSubmit(input: string) {
    const inputLine: OutputLine = {
      id: crypto.randomUUID(),
      type: 'input',
      text: input,
    };

    if (input === 'clear') {
      setLines(WELCOME_LINES);
      return;
    }

    setLines((prev) => [...prev, inputLine]);
    setIsProcessing(true);

    const outputLines = await runCommand(input, (chunk) => {
      // Streaming callback for ask command
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (last?.type === 'stream') {
          return [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
        }
        return [...prev, { id: crypto.randomUUID(), type: 'stream', text: chunk }];
      });
    });

    if (outputLines.length > 0) {
      setLines((prev) => [...prev, ...outputLines]);
    }

    setIsProcessing(false);
  }

  if (mode !== 'terminal') return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col" data-testid="terminal">
      {/* macOS chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface shrink-0">
        <button
          onClick={toggle}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          title="Close terminal"
        />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-xs font-mono text-text-muted">
          brianna@portfolio ~ zsh
        </span>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1">
        <TerminalOutput lines={lines} />
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border px-6 py-4 bg-surface shrink-0">
        <TerminalInput onSubmit={handleSubmit} disabled={isProcessing} />
        <p className="mt-1 text-xs text-text-muted font-mono">
          Press Tab to autocomplete · ↑↓ for history · Ctrl+` to exit
        </p>
      </div>
    </div>
  );
}
```

Note: `runCommand` is imported from `lib/terminal/commands` which is written in Chunk 6. Create a placeholder:

```ts
// lib/terminal/commands.ts — placeholder, replaced in Chunk 6
import type { OutputLine } from '@/components/terminal/TerminalOutput';

export async function runCommand(
  _input: string,
  _onStream: (chunk: string) => void,
): Promise<OutputLine[]> {
  return [{ id: crypto.randomUUID(), type: 'error', text: 'commands not implemented yet' }];
}
```

- [ ] **Step 2: Verify terminal overlay appears**

```bash
pnpm dev
```

Click the `> terminal` button in the navbar. Expected: full-screen dark overlay with macOS dots and input field.

- [ ] **Step 3: Commit Chunk 5**

```bash
git add -A
git commit -m "feat: add terminal core — parser, output, input, overlay"
```

---

## Chunk 6: Terminal Commands

**Goal:** All terminal command handlers implemented and wired up.

---

### Task 6.1: Command handlers

**Files:**
- Modify: `lib/terminal/commands.ts` (replace placeholder)

- [ ] **Step 1: Write slug-matching test first**

Create `__tests__/lib/commands.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { findProjectBySlug } from '@/lib/terminal/commands';
import { projects } from '@/data/projects';

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
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test __tests__/lib/commands.test.ts
```

- [ ] **Step 3: Replace `lib/terminal/commands.ts` with full implementation**

```ts
import { about, type Availability } from '@/data/about';
import { projects } from '@/data/projects';
import { claudeTagLabel } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { usesCategories } from '@/data/uses';
import { social } from '@/data/social';
import { getAllPostMetas } from '@/lib/mdx';
import { parseCommand } from '@/lib/terminal/parser';
import type { OutputLine } from '@/components/terminal/TerminalOutput';

type StreamCallback = (chunk: string) => void;

function line(text: string, type: OutputLine['type'] = 'output'): OutputLine {
  return { id: crypto.randomUUID(), type, text };
}

export function findProjectBySlug(slug: string) {
  return projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

const availabilityText: Record<Availability, string> = {
  open: 'open to work — feel free to reach out.',
  'not-looking': 'not currently looking, but happy to connect.',
  freelance: 'open to freelance opportunities.',
};

const HELP_TEXT = `
Available commands:

  whoami          About me
  experience      Work history
  skills          Tech stack overview
  ls projects     List all projects
  cat <slug>      Project details (e.g. cat claude-portfolio)
  blog            Blog posts
  uses            Tools and setup
  contact         How to reach me
  availability    Current status
  open github     Open GitHub profile
  open linkedin   Open LinkedIn profile
  resume          Download my resume
  education       Academic background
  interests       What I geek out on
  ask <question>  Ask me anything (Claude-powered)
  clear           Clear the terminal

Tip: Press Tab to autocomplete · ↑↓ for history
`.trim();

async function handleAsk(question: string, onStream: StreamCallback): Promise<OutputLine[]> {
  if (!question.trim()) {
    return [line('usage: ask <question>', 'error')];
  }
  if (question.length > 500) {
    return [line('error: question too long. keep it under 500 characters.', 'error')];
  }

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (res.status === 429) {
      return [line('error: rate limit exceeded. try again in a minute.', 'error')];
    }
    if (res.status === 400) {
      return [line('error: question too long. keep it under 500 characters.', 'error')];
    }
    if (!res.ok || !res.body) {
      return [line('error: failed to reach brianna\'s brain. try again.', 'error')];
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        onStream(decoder.decode(value, { stream: true }));
      }
    }

    return []; // stream handled via onStream callback
  } catch {
    return [line('error: failed to reach brianna\'s brain. try again.', 'error')];
  }
}

export async function runCommand(
  input: string,
  onStream: StreamCallback,
): Promise<OutputLine[]> {
  const { command, args } = parseCommand(input);

  switch (command) {
    case 'help':
      return [line(HELP_TEXT)];

    case 'whoami':
      return [
        line(`${about.name}`),
        line(`${about.title}`),
        line(''),
        line(about.bio),
      ];

    case 'experience':
      return about.experience.flatMap((exp) => [
        line(`${exp.role} @ ${exp.company} (${exp.startDate} – ${exp.endDate})`),
        line(`  ${exp.description}`),
        line(''),
      ]);

    case 'skills':
      return skillCategories.flatMap((cat) => [
        line(`[${cat.name}]`),
        line(`  ${cat.skills.join(', ')}`),
        line(''),
      ]);

    case 'ls projects':
      return [
        line('Projects:'),
        ...projects.map((p) => {
          const badge = p.claudeTag ? ` [${claudeTagLabel[p.claudeTag]}]` : '';
          return line(`  ${p.slug}${badge} — ${p.title}`);
        }),
      ];

    case 'cat': {
      const slug = args[0];
      if (!slug) return [line('usage: cat <slug>', 'error')];
      const project = findProjectBySlug(slug);
      if (!project) {
        return [
          line(
            `error: project '${slug}' not found. run ls projects to see available projects.`,
            'error',
          ),
        ];
      }
      const lines: OutputLine[] = [
        line(project.title),
        line(''),
        line(project.description),
        line(''),
        line(`tags: ${project.tags.join(', ')}`),
      ];
      if (project.claudeTag) lines.push(line(`claude: ${claudeTagLabel[project.claudeTag]}`));
      if (project.url) lines.push(line(`url: ${project.url}`));
      if (project.repo) lines.push(line(`repo: ${project.repo}`));
      return lines;
    }

    case 'blog': {
      const posts = getAllPostMetas();
      if (posts.length === 0) return [line('no posts found.')];
      return [
        line('Posts:'),
        ...posts.map((p) => line(`  ${p.date}  ${p.title}`)),
      ];
    }

    case 'uses':
      return usesCategories.flatMap((cat) => [
        line(`[${cat.name}]`),
        ...cat.items.map((item) => line(`  ${item.name} — ${item.description}`)),
        line(''),
      ]);

    case 'contact': {
      const parts: OutputLine[] = [];
      if (social.email) parts.push(line(`email: ${social.email}`));
      if (social.github) parts.push(line(`github: ${social.github}`));
      if (social.linkedin) parts.push(line(`linkedin: ${social.linkedin}`));
      return parts.length ? parts : [line('no contact info configured.')];
    }

    case 'availability':
      return [line(availabilityText[about.availability])];

    case 'open github':
      if (!social.github) return [line('error: link not configured.', 'error')];
      window.open(social.github, '_blank', 'noopener');
      return [line(`opening ${social.github}...`)];

    case 'open linkedin':
      if (!social.linkedin) return [line('error: link not configured.', 'error')];
      window.open(social.linkedin, '_blank', 'noopener');
      return [line(`opening ${social.linkedin}...`)];

    case 'resume': {
      // HEAD request to verify the file exists before opening
      const check = await fetch('/resume.pdf', { method: 'HEAD' });
      if (!check.ok) {
        return [line('error: resume.pdf not found.', 'error')];
      }
      window.open('/resume.pdf', '_blank', 'noopener');
      return [line('opening resume.pdf...')];
    }

    case 'education':
      return about.education.flatMap((edu) => [
        line(`${edu.degree}`),
        line(`  ${edu.institution}, ${edu.graduationYear}`),
        line(''),
      ]);

    case 'interests':
      return [line(about.interests.join(', '))];

    case 'ask':
      return handleAsk(args[0] ?? '', onStream);

    case '':
      return [];

    default:
      return [
        line(`command not found: ${command}. type help to see available commands.`, 'error'),
      ];
  }
}
```

- [ ] **Step 4: Run slug-matching tests — expect PASS**

```bash
pnpm test __tests__/lib/commands.test.ts
```

- [ ] **Step 5: Verify terminal manually**

```bash
pnpm dev
```

Open terminal mode. Test: `help`, `whoami`, `ls projects`, `cat claude-portfolio`, `skills`. All should return real content.

- [ ] **Step 6: Commit Chunk 6**

```bash
git add -A
git commit -m "feat: implement all terminal commands"
```

---

## Chunk 7: Claude API — `/api/ask`

**Goal:** Streaming Claude API endpoint with rate limiting and input validation.

---

### Task 7.1: Sliding window rate limiter

**Files:**
- Create: `lib/terminal/rate-limiter.ts`
- Create: `__tests__/lib/rate-limiter.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/lib/rate-limiter.test.ts
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { RateLimiter } from '@/lib/terminal/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    const limiter = new RateLimiter({ maxRequests: 3, windowMs: 60_000 });
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
  });

  it('blocks when limit is exceeded', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check('ip1');
    limiter.check('ip1');
    expect(limiter.check('ip1')).toBe(false);
  });

  it('allows requests again after window slides', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check('ip1');
    limiter.check('ip1');

    // Advance time past the window
    vi.advanceTimersByTime(61_000);

    expect(limiter.check('ip1')).toBe(true);
  });

  it('tracks IPs independently', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 60_000 });
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip2')).toBe(true);
    expect(limiter.check('ip1')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test __tests__/lib/rate-limiter.test.ts
```

- [ ] **Step 3: Create `lib/terminal/rate-limiter.ts`**

```ts
type RateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
};

export class RateLimiter {
  private store = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor({ maxRequests, windowMs }: RateLimiterOptions) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(ip: string): boolean {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    const timestamps = (this.store.get(ip) ?? []).filter((t) => t > cutoff);

    if (timestamps.length >= this.maxRequests) return false;

    timestamps.push(now);
    this.store.set(ip, timestamps);
    return true;
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test __tests__/lib/rate-limiter.test.ts
```

---

### Task 7.2: `/api/ask` Route Handler

**Files:**
- Create: `app/api/ask/route.ts`

**Streaming approach:** The Route Handler uses the Anthropic SDK server-side to stream from Claude, then pipes raw text chunks to the client via a `ReadableStream` with `Content-Type: text/plain`. The client (`commands.ts`) consumes this with a standard `fetch` + `ReadableStream` reader — no Anthropic SDK on the client side. This keeps the API key server-only.

**Model:** `claude-haiku-4-5-20251001` — verify this ID is current against the Anthropic docs before wiring up. If the build fails with a model error, check `https://docs.anthropic.com/en/docs/about-claude/models` for the latest Haiku model ID.

- [ ] **Step 1: Create `app/api/ask/route.ts`**

```ts
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { about } from '@/data/about';
import { RateLimiter } from '@/lib/terminal/rate-limiter';

const client = new Anthropic();
const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60_000 });

function buildSystemPrompt(): string {
  const experience = about.experience
    .map((e) => `${e.role} at ${e.company} (${e.startDate}–${e.endDate}): ${e.description}`)
    .join('\n');

  const education = about.education
    .map((e) => `${e.degree} from ${e.institution}, ${e.graduationYear}`)
    .join('\n');

  return `You are answering questions on behalf of ${about.name}, a ${about.title}.
Answer in first person, in a friendly and professional tone.
Only answer questions related to ${about.name}'s professional background.
Never fabricate information — only state facts from the data below.
If asked something unrelated or unanswerable from the data, politely decline.

Bio: ${about.bio}

Experience:
${experience}

Education:
${education}

Interests: ${about.interests.join(', ')}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

  if (!limiter.check(ip)) {
    return new Response('rate limit exceeded', { status: 429 });
  }

  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const question = body.question ?? '';

  if (typeof question !== 'string' || question.length === 0) {
    return new Response('question is required', { status: 400 });
  }

  if (question.length > 500) {
    return new Response('question too long', { status: 400 });
  }

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: question }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
```

- [ ] **Step 2: Test the endpoint manually**

```bash
pnpm dev
```

In another terminal (with your real API key in `.env.local`):

```bash
curl -N -X POST http://localhost:3000/api/ask \
  -H 'Content-Type: application/json' \
  -d '{"question": "what do you work on?"}'
```

Expected: streaming text response about Brianna.

- [ ] **Step 3: Test the `ask` command in terminal mode**

Open the portfolio in browser, toggle terminal mode, type `ask what tech do you use?`

Expected: streamed response appears token by token.

- [ ] **Step 4: Commit Chunk 7**

```bash
git add -A
git commit -m "feat: add Claude streaming API endpoint with rate limiting"
```

---

## Chunk 8: E2E Tests + CI Verification

**Goal:** Full Playwright E2E suite passing in CI with stubbed API calls.

---

### Task 8.1: Navigation E2E tests

**Files:**
- Create: `e2e/navigation.spec.ts`

- [ ] **Step 1: Create `e2e/navigation.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('projects page renders', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('blog page renders with empty state or posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('uses page renders', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.locator('h1')).toContainText('Uses');
  });

  test('contact page renders', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });
});
```

---

### Task 8.2: Terminal E2E tests

**Files:**
- Create: `e2e/terminal.spec.ts`

- [ ] **Step 1: Create `e2e/terminal.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('Terminal mode', () => {
  test('toggle button opens terminal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await expect(page.getByTestId('terminal')).toBeVisible();
  });

  test('macOS close button closes terminal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await expect(page.getByTestId('terminal')).toBeVisible();
    // Click the red dot
    await page.locator('[data-testid="terminal"] button').first().click();
    await expect(page.getByTestId('terminal')).not.toBeVisible();
  });

  test('help command lists commands', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').type('help');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('whoami');
    await expect(page.getByTestId('terminal')).toContainText('ls projects');
  });

  test('ls projects returns project list', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('ls projects');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('claude-portfolio');
  });

  test('cat with valid slug returns project details', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('cat claude-portfolio');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('Claude Portfolio');
  });

  test('cat with unknown slug returns error', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('cat not-a-real-project');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('not found');
  });

  test('unknown command shows error', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('foobar');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('command not found');
  });

  test('ask command returns a response (stubbed)', async ({ page }) => {
    // Stub the /api/ask endpoint to avoid real API calls in CI
    await page.route('**/api/ask', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'I work on frontend projects and love using Claude in my workflow.',
      });
    });

    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('ask what do you work on');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('frontend', { timeout: 10_000 });
  });
});
```

---

### Task 8.3: Contact form E2E test

**Files:**
- Create: `e2e/contact.spec.ts`

- [ ] **Step 1: Create `e2e/contact.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('shows success message after submission (stubbed)', async ({ page }) => {
    // Stub Formspree endpoint
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.goto('/contact');

    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'Hello from Playwright!');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Thanks!')).toBeVisible({ timeout: 5_000 });
  });
});
```

---

### Task 8.4: Run full test suite and verify CI

- [ ] **Step 1: Run all unit tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 2: Build**

```bash
pnpm build
```

Expected: successful build, no type errors.

- [ ] **Step 3: Run E2E tests**

```bash
pnpm build && pnpm start &
sleep 3
pnpm test:e2e
```

Expected: all E2E tests pass.

- [ ] **Step 4: Commit Chunk 8**

```bash
git add -A
git commit -m "test: add Playwright E2E suite for navigation, terminal, and contact form"
```

- [ ] **Step 5: Push to GitHub and verify CI passes**

```bash
git push origin main
```

Check GitHub Actions for green CI.

---

## Final: Deploy to Vercel

- [ ] Connect the GitHub repo to Vercel (if not already done)
- [ ] Add environment variables in Vercel dashboard:
  - `ANTHROPIC_API_KEY` — your real key from console.anthropic.com
  - `NEXT_PUBLIC_FORMSPREE_ENDPOINT` — your Formspree form URL
- [ ] Trigger a deployment
- [ ] Sign up for Formspree at formspree.io, create a form, copy the endpoint URL into Vercel env
- [ ] Test the live `ask` command and contact form end-to-end
