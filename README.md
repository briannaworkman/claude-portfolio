# ✨ briworkman.dev — Personal Portfolio

[![CI](https://github.com/briannaworkman/claude-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/briannaworkman/claude-portfolio/actions/workflows/ci.yml)
[![Powered by Claude](https://img.shields.io/badge/Powered_by-Claude_Sonnet-a78bfa?logo=anthropic&logoColor=white)](https://anthropic.com)

A dark, bold personal portfolio with a secret: **it's also a terminal.** 🖥️✨

Built with Next.js, powered by Claude, and designed to grow with me.

---

## 🌟 What's Inside

### 🌐 Web Mode
A clean, expressive portfolio with all the classics:

- 🏠 **Landing page** — hero, skills, featured projects
- 🔨 **Projects** — everything I've built, with Claude badges for AI-powered work
- ✍️ **Blog** — thoughts on AI, engineering, and workflow (MDX-powered)
- 📊 **Stats** — Claude Code usage insights dashboard (sessions, tokens, work breakdown)
- 🛠️ **Uses** — my setup, tools, and go-to stack
- 📬 **Contact** — a real working form (Formspree)
- 📄 **Resume** — always one click away

### 💻 Terminal Mode
Press **`> terminal`** in the navbar (or `Ctrl+\``) to drop into a full interactive terminal. 🤯

```
> help
> whoami
> ls projects
> cat claude-portfolio
> ask what do you work on?
> stats
> stats 2026-04
> open github
```

The `ask` command is powered by **Claude Haiku** — it answers questions about me in real time, streamed token by token. 🤖💜

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| 🏗️ Framework | Next.js 15 (App Router) |
| 🎨 Styling | Tailwind CSS v4 |
| 🧹 Linting | Biome |
| 🧪 Unit Tests | Vitest + Testing Library |
| 🎭 E2E Tests | Playwright |
| 🤖 AI | Anthropic SDK (Claude Haiku) |
| 📝 Blog | MDX + next-mdx-remote |
| 📬 Contact | Formspree |
| 🚀 Hosting | Vercel |
| 📦 Package Manager | pnpm |

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in. 🎉

---

## ⚙️ Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```bash
# Required for the terminal `ask` command
ANTHROPIC_API_KEY=sk-ant-...

# Required for the contact form
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | 🔥 Start dev server |
| `pnpm build` | 🏗️ Build for production |
| `pnpm lint` | 🧹 Lint with Biome |
| `pnpm lint:fix` | 🪄 Auto-fix lint issues |
| `pnpm test` | 🧪 Run unit tests (watch mode) |
| `pnpm test:e2e` | 🎭 Run Playwright E2E tests |

---

## 🗂️ Project Structure

```
claude-portfolio/
├── app/                  # Next.js App Router pages + API routes
│   ├── api/ask/          # 🤖 Claude streaming endpoint
│   ├── blog/             # ✍️ Blog list + MDX post pages
│   ├── contact/          # 📬 Contact page
│   ├── projects/         # 🔨 Projects page
│   ├── stats/            # 📊 Claude Code insights dashboard
│   ├── uses/             # 🛠️ Uses page
│   ├── robots.ts         # 🤖 Crawler rules
│   └── sitemap.ts        # 🗺️ Auto-generated sitemap
├── components/
│   ├── layout/           # 🧭 Navbar, Footer
│   ├── terminal/         # 💻 Terminal overlay, input, output
│   └── web/              # 🌐 Web mode components
├── content/blog/         # ✍️ MDX blog posts go here
├── context/              # 🔄 ModeContext (web ↔ terminal)
├── data/                 # 📦 Your info lives here!
├── lib/
│   └── terminal/         # ⚙️ Parser, commands, rate limiter
├── e2e/                  # 🎭 Playwright tests
└── public/               # 🖼️ Static assets (resume.pdf goes here!)
```

---

## ✏️ Making It Yours

All your personal content lives in `data/`:

| File | What to update |
|---|---|
| `data/about.ts` | 👤 Name, bio, experience, education, availability |
| `data/projects.ts` | 🔨 Your projects (with optional Claude badges!) |
| `data/skills.ts` | 💪 Your tech stack |
| `data/uses.ts` | 🛠️ Your tools and setup |
| `data/social.ts` | 🔗 GitHub, LinkedIn, email |

Drop your resume at `public/resume.pdf` and write blog posts in `content/blog/*.mdx`. That's it! 🎊

---

## 🤖 Claude Badges

Projects can be tagged to show off AI involvement:

```ts
claudeTag: 'built-with'   // 💜 Built with Claude
claudeTag: 'powered-by'   // ⚡ Powered by Claude
claudeTag: null            // No badge
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test --run

# E2E tests (requires a build)
pnpm test:e2e
```

73 unit tests + 31 E2E tests. All green. ✅

---

## 🚢 Deploying to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables (`ANTHROPIC_API_KEY`, `NEXT_PUBLIC_FORMSPREE_ENDPOINT`)
4. Deploy 🚀

---

Built with 💜 and a lot of Claude Code.
