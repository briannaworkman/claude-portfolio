# Portfolio Design Spec
**Date:** 2026-03-16
**Project:** claude-portfolio
**Status:** Approved

---

## Overview

A dark, bold personal portfolio for Brianna Workman — a frontend-focused software engineer who uses AI (Claude specifically) heavily in her workflow. The portfolio serves two audiences: recruiters/hiring managers and developer peers. It is designed to grow with her over time.

The defining feature is **dual-mode rendering**: a traditional web portfolio and an interactive terminal portfolio, toggled like a theme switch. Both modes read from the same content layer.

---

## Goals

- Professional portfolio usable for job searches but not built *just* for that
- Impress both technical peers and non-technical hiring managers
- Showcase Claude-powered projects prominently without sidelining other work
- Grow gracefully — blog starts thin, content is added incrementally
- Signal engineering maturity (tests, clean architecture, real tooling)

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Content | MDX via `next-mdx-remote` (blog), TypeScript data files (projects, uses, skills) |
| Linting / Formatting | Biome |
| Unit tests | Vitest |
| E2E tests | Playwright |
| `ask` command AI | Anthropic SDK (Claude API) |
| Deployment | Vercel |

---

## Site Structure

### Web Mode Routes

| Route | Purpose |
|---|---|
| `/` | Landing page: hero, about summary, skills section, featured projects |
| `/projects` | Full project grid with Claude-powered badges |
| `/blog` | Blog post list — starts minimal, grows over time |
| `/uses` | Tools, hardware, editor setup, Claude workflow |
| `/contact` | Social links + contact form |
| `resume.pdf` | Downloadable PDF, linked from nav and terminal |

### Mode Toggle

- A visible button in the navbar switches between web mode and terminal mode
- Keyboard shortcut: `Ctrl+\`` — avoids conflicts with browser/OS backtick behavior
- Selected mode persisted to `localStorage`
- Terminal mode renders as a full-page overlay on whichever route the user is on — the underlying route does not change
- If a user on `/blog` toggles to terminal mode, the terminal overlay appears over the blog page; toggling back returns them to `/blog`

---

## Terminal Mode

An authentic in-browser terminal experience. Styled with macOS traffic-light chrome, monospace font throughout, amber prompt symbol (`>`).

### Commands

| Command | Output |
|---|---|
| `help` | List all available commands |
| `whoami` | About Brianna |
| `experience` | Work history |
| `skills` | Tech stack overview |
| `ls projects` | List all projects |
| `cat <slug>` | Full details for a specific project, where `<slug>` is case-insensitive and matches the project's `slug` field (e.g. `cat claude-portfolio` and `cat Claude-Portfolio` both work) |
| `blog` | List blog posts |
| `uses` | Tools and setup |
| `contact` | How to reach her |
| `availability` | Current open-to-work status, sourced from `data/about.ts` |
| `open github` | Opens GitHub profile in new tab (URL from `data/social.ts`) |
| `open linkedin` | Opens LinkedIn profile in new tab (URL from `data/social.ts`) |
| `resume` | Triggers PDF download — prints `error: resume.pdf not found.` if file is missing |
| `education` | Academic background |
| `interests` | What she geeks out on |
| `ask <question>` | Claude API-powered — answers questions about Brianna in character |
| `clear` | Clears terminal output |

### Terminal UX Features

- Tab autocomplete for commands and project slugs. Slug list is a static import from `data/projects.ts` bundled at build time — no fetch on load.
- Command history navigation with ↑ / ↓ arrow keys
- `command not found: <cmd>. type help to see available commands.` for unknown input
- `ask` command streams response token-by-token by forwarding Anthropic's raw SSE stream from the Route Handler to the client (no custom wrapping — the client uses the Anthropic SDK's browser-compatible streaming helper)
- If Claude API fails: prints `error: failed to reach brianna's brain. try again.`

### `ask` Command — Implementation Details

The `ask` command hits a Next.js Route Handler at `/api/ask`. It is the only server-side endpoint in the project.

**System prompt:** The route handler constructs a system prompt from the structured content in `data/about.ts` (bio, experience, skills, interests). It instructs Claude to answer questions about Brianna in first person, in a friendly and professional tone. Claude is instructed to decline questions unrelated to Brianna's professional background and to never fabricate facts not present in the source data.

**Model:** `claude-haiku-4-5-20251001` — fast and cost-efficient for this use case.

**Token budget:** Max 300 output tokens per response to keep answers concise and costs predictable.

**Input limits:** User input is capped at 500 characters before submission (enforced client-side and server-side). If the server receives input exceeding 500 characters, it returns HTTP 400 and the terminal prints: `error: question too long. keep it under 500 characters.`

**Rate limiting:** The Route Handler applies an IP-based rate limit using a **sliding window** of 10 requests per 60 seconds, implemented with an in-memory store. If the limit is hit, the server returns HTTP 429 and the terminal prints: `error: rate limit exceeded. try again in a minute.`

**Abuse surface:** The system prompt explicitly scopes Claude's responses to professional topics only. No user input is interpolated directly into the system prompt — only the question is passed as a user message.

---

## Content Layer

Single source of truth for both modes. No content duplication.

- **Blog posts:** MDX files in `content/blog/` processed with `next-mdx-remote`
- **Projects:** `data/projects.ts`
- **Uses:** `data/uses.ts`
- **Skills:** `data/skills.ts`
- **Bio / about / experience / availability:** `data/about.ts`
- **Social links:** `data/social.ts`

### Project Data Shape

```ts
type Project = {
  slug: string          // URL-safe, lowercase identifier for cat <slug> command
  title: string
  description: string
  url?: string          // live URL if deployed
  repo?: string         // GitHub repo URL
  tags: string[]
  featured: boolean     // shown in landing page featured section
  claudeTag: 'built-with' | 'powered-by' | null
  // 'built-with'  → Claude helped build it (dev tooling)
  // 'powered-by'  → the project itself uses Claude at runtime
  // null          → no Claude involvement
}
```

Both `'built-with'` and `'powered-by'` render the same purple glow badge in this version — the label text differs (`Built with Claude` vs `Powered by Claude`). Visual differentiation can be added later if needed.

### About Data Shape

```ts
type About = {
  name: string
  title: string                   // e.g. "Software Engineer"
  bio: string                     // 2-3 sentence bio
  availability: 'open' | 'not-looking' | 'freelance'
  experience: Array<{
    company: string
    role: string
    startDate: string             // "YYYY-MM"
    endDate: string | 'present'
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    graduationYear: number
  }>
  interests: string[]             // used in `interests` command and ask system prompt
}
```

### Social Data Shape

```ts
type Social = {
  github: string | null
  linkedin: string | null
  email: string | null
}
```

If a social URL is `null`, the `open github` / `open linkedin` terminal command prints: `error: link not configured.` The web mode link is hidden.

---

## Contact Form

The `/contact` page includes:
- **Fields:** Name, Email, Message (all required)
- **Submission:** Posts to **Formspree** (free tier, 50 submissions/month — sufficient for a personal portfolio). No server-side code required; the form posts directly to a Formspree endpoint URL stored in an environment variable (`NEXT_PUBLIC_FORMSPREE_ENDPOINT`).
- **Validation:** Client-side required field checks before submission; server returns HTTP 400 with field errors on invalid input
- **Success state:** Inline confirmation message — "Thanks! I'll get back to you soon."
- **Error state:** Inline error message — "Something went wrong. Try emailing me directly at [email]."
- The page also lists social links (GitHub, LinkedIn, email) independently of the form

---

## Visual Design

### Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0a` | Page background |
| Surface | `#1a1a1a` | Cards, panels |
| Accent primary | Violet/purple | Links, highlights, active states |
| Accent secondary | Amber/orange | Terminal prompt, badges, callouts |
| Text primary | Off-white | Body copy |
| Text muted | Dark gray | Secondary text |
| Claude badge | Purple with glow | `claudeTag` projects (`built-with` and `powered-by` same style, different label) |

### Typography

- **All text:** Geist / Geist Mono (single font family from Vercel, simplifies loading)
- Headings: Geist bold
- Body: Geist regular
- Terminal / code: Geist Mono

### Web Mode Aesthetic

Dark, spacious, bold section headers. Cards with subtle border and hover lift. Subtle gradient accents. Premium feel, not cluttered.

### Terminal Mode Aesthetic

Authentic terminal chrome — macOS traffic light dots, Geist Mono throughout, amber `>` prompt, off-white output text, brighter white for typed commands.

---

## Error Handling

| Scenario | Web Mode | Terminal Mode |
|---|---|---|
| Unknown terminal command | N/A | `command not found: <cmd>. type help to see available commands.` |
| `ask` API failure | N/A | `error: failed to reach brianna's brain. try again.` |
| `ask` rate limit exceeded (HTTP 429) | N/A | `error: rate limit exceeded. try again in a minute.` |
| `ask` input too long (HTTP 400) | N/A | `error: question too long. keep it under 500 characters.` |
| Blog with no posts | Friendly empty state | `no posts found.` |
| Resume PDF missing | Link disabled with tooltip | `error: resume.pdf not found.` |
| `cat <slug>` — slug not found | N/A | `error: project '<slug>' not found. run ls projects to see available projects.` |
| `open github` / `open linkedin` — URL null | Link hidden | `error: link not configured.` |
| Contact form submission failure | Inline error with fallback email | N/A |

---

## Resume PDF

The resume file lives at `/public/resume.pdf`. This is the standard Next.js location for static assets. The terminal `resume` command and the nav link both point to `/resume.pdf`. The "missing" error state is triggered when the file does not exist at that path.

---

## Testing Strategy

### Vitest (Unit)

- Terminal command parser (raw input → `{ command: string, args: string[] }`)
- `claudeTag` badge label logic (`'built-with'` → `"Built with Claude"`, etc.)
- Case-insensitive slug matching for `cat` command
- Sliding window rate limiter logic
- Content data shape validation (spot-checks that data files conform to their types)

### Playwright (E2E)

- Mode toggle switches between web and terminal (and back)
- Key pages render without errors (`/`, `/projects`, `/blog`, `/uses`, `/contact`)
- Terminal accepts input and returns output
- `ls projects` returns at least one project entry
- `cat <slug>` returns project details for a known slug
- `cat` with an unknown slug returns the not-found error
- `ask` command renders a response (Route Handler is stubbed in CI to return a fixed string — avoids live API calls and flakiness)
- Contact form: fills fields, submits, shows success state (form action stubbed in CI)

### CI — GitHub Actions

Runs on every push and pull request. Node version: **20 LTS**. Package manager: **pnpm**.

```yaml
steps:
  - Install dependencies (pnpm install --frozen-lockfile)
  - biome check (lint + format)
  - vitest run (unit tests)
  - next build
  - Playwright E2E (against next start)
```

Vercel preview deployments are triggered separately by Vercel's GitHub integration and do not run tests.

---

## Out of Scope (for now)

- CMS integration — content is file-based to start
- Authentication / admin panel
- Comments on blog posts
- Analytics (Vercel Analytics can be added later with one line)
- Persistent rate limiting across server restarts (in-memory is sufficient for a personal portfolio)
- Visual differentiation between `built-with` and `powered-by` badge styles
