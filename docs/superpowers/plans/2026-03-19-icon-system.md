# Icon System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small extensible icon system with `GitHubIcon` and `ExternalLinkIcon` components, and use them as labeled icon buttons in `ProjectCard` and the contact page.

**Architecture:** Two standalone SVG icon components live in `components/icons/`. Each accepts `className` and `size` props, renders `aria-hidden="true"`, and uses `currentColor`. Call sites wrap the icon and text in a flex row — no new abstractions needed. Tests are written at the point where each icon is wired into the DOM, not when the file is created.

**Tech Stack:** React, TypeScript, Tailwind CSS, Playwright (e2e)

**Spec:** `docs/superpowers/specs/2026-03-19-icon-system-design.md`

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `components/icons/GitHubIcon.tsx` | GitHub brand SVG icon component |
| Create | `components/icons/ExternalLinkIcon.tsx` | Arrow-up-right SVG for live links |
| Modify | `components/web/ProjectCard.tsx` | Use both icons in project link buttons |
| Modify | `app/contact/page.tsx` | Use GitHubIcon in social link |
| Modify | `e2e/navigation.spec.ts` | Add icon presence tests |

---

## Task 1: GitHubIcon component

**Files:**
- Create: `components/icons/GitHubIcon.tsx`

- [ ] **Step 1: Create `components/icons/GitHubIcon.tsx`**

```tsx
type Props = {
  className?: string;
  size?: number;
};

export function GitHubIcon({ className, size = 16 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z" />
    </svg>
  );
}
```

- [ ] **Step 2: Run linter**

```bash
npx biome check components/icons/GitHubIcon.tsx
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/icons/GitHubIcon.tsx
git commit -m "feat: add GitHubIcon component"
```

---

## Task 2: ExternalLinkIcon component

**Files:**
- Create: `components/icons/ExternalLinkIcon.tsx`

- [ ] **Step 1: Create `components/icons/ExternalLinkIcon.tsx`**

```tsx
type Props = {
  className?: string;
  size?: number;
};

export function ExternalLinkIcon({ className, size = 16 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
```

- [ ] **Step 2: Run linter**

```bash
npx biome check components/icons/ExternalLinkIcon.tsx
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/icons/ExternalLinkIcon.tsx
git commit -m "feat: add ExternalLinkIcon component"
```

---

## Task 3: Update ProjectCard to use icons (TDD)

**Files:**
- Modify: `components/web/ProjectCard.tsx`
- Modify: `e2e/navigation.spec.ts`

- [ ] **Step 1: Write the failing e2e test**

Add to `e2e/navigation.spec.ts` inside the existing `Navigation` describe block:

```ts
test('github links render an svg icon', async ({ page }) => {
  await page.goto('/projects');
  const githubLink = page.locator('a[aria-label*="on GitHub"]').first();
  await expect(githubLink.locator('svg')).toBeVisible();
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx playwright test e2e/navigation.spec.ts --grep "github links render"
```

Expected: FAIL — no SVG inside the link yet

- [ ] **Step 3: Update `components/web/ProjectCard.tsx`**

```tsx
import { ClaudeTagBadge } from '@/components/web/ClaudeTagBadge';
import { ExternalLinkIcon } from '@/components/icons/ExternalLinkIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
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
              aria-label={`${project.title} on GitHub`}
              className="flex items-center gap-1 text-xs hover:text-text-primary transition-colors"
            >
              <GitHubIcon size={14} />
              GitHub
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="flex items-center gap-1 text-xs hover:text-text-primary transition-colors"
            >
              <ExternalLinkIcon size={14} />
              Live
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

- [ ] **Step 4: Run the full navigation test suite**

```bash
npx playwright test e2e/navigation.spec.ts
```

Expected: all tests PASS including the new "github links render an svg icon" test

- [ ] **Step 5: Run linter**

```bash
npx biome check components/web/ProjectCard.tsx
```

Expected: no errors (Biome may reorder imports alphabetically — that's fine)

- [ ] **Step 6: Commit**

```bash
git add components/web/ProjectCard.tsx e2e/navigation.spec.ts
git commit -m "feat: use icon buttons in ProjectCard links"
```

---

## Task 4: Update Contact page to use GitHubIcon (TDD)

**Files:**
- Modify: `app/contact/page.tsx`
- Modify: `e2e/navigation.spec.ts`

- [ ] **Step 1: Write the failing e2e test**

Add to `e2e/navigation.spec.ts` inside the `Navigation` describe block:

```ts
test('contact page github link renders an svg icon', async ({ page }) => {
  await page.goto('/contact');
  const githubLink = page.locator('a[href*="github.com"]');
  await expect(githubLink.locator('svg')).toBeVisible();
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx playwright test e2e/navigation.spec.ts --grep "contact page github"
```

Expected: FAIL — no SVG in the link yet

- [ ] **Step 3: Update `app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { ContactForm } from '@/components/web/ContactForm';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { social } from '@/data/social';

export const metadata: Metadata = {
  title: 'Contact — Bri Workman',
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
          <h2 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Elsewhere</h2>
          <ul className="space-y-2">
            {social.github && (
              <li>
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors"
                >
                  <GitHubIcon size={14} />
                  GitHub
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

- [ ] **Step 4: Run the full navigation test suite**

```bash
npx playwright test e2e/navigation.spec.ts
```

Expected: all tests PASS including the new contact page test

- [ ] **Step 5: Run linter**

```bash
npx biome check app/contact/page.tsx
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/contact/page.tsx e2e/navigation.spec.ts
git commit -m "feat: use GitHubIcon on contact page"
```

---

## Task 5: Final verification

- [ ] **Step 1: Run the full e2e suite**

```bash
npx playwright test
```

Expected: all tests PASS

- [ ] **Step 2: Run full lint check**

```bash
npx biome check .
```

Expected: no errors

- [ ] **Step 3: Push**

```bash
git push
```
