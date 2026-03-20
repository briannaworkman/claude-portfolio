# Icon System Design

**Date:** 2026-03-19
**Status:** Approved

## Overview

Introduce a small, extensible icon system to the portfolio. The first pass replaces the text-only "GitHub ↗" and "Live ↗" links in project cards with labeled icon buttons — icon + text side by side. The system is designed to grow incrementally as new icons are needed (e.g. LinkedIn, external tools).

## Goals

- Replace "GitHub ↗" and "Live ↗" text links with icon + text links
- Establish a consistent icon component pattern for future additions
- No external icon library dependency — icons are inline SVG components

## Non-Goals

- LinkedIn or other social icons (deferred)
- Icon-only buttons (labels are always shown alongside icons)
- Icon animation or theming beyond existing color tokens

## Component Structure

```
components/icons/
  GitHubIcon.tsx        — GitHub brand SVG (user-supplied path data, see below)
  ExternalLinkIcon.tsx  — Arrow-up-right SVG for "Live" links
```

Each icon component:
- Accepts `className?: string` and `size?: number` (default `16`)
- Renders a single `<svg>` with `aria-hidden="true"` (link text provides the accessible label)
- Uses `currentColor` for fill/stroke so it inherits text color naturally

**GitHubIcon SVG:** The user will supply the SVG path data before implementation begins. The component should use `viewBox="0 0 24 24"` (standard GitHub mark dimensions) and render a single `<path>` with `fill="currentColor"`.

## Usage in ProjectCard

The GitHub and Live links in `ProjectCard.tsx` become labeled icon buttons:

```tsx
// Before
GitHub ↗

// After
<GitHubIcon className="shrink-0" /> GitHub
```

```tsx
// Before
Live ↗

// After
<ExternalLinkIcon className="shrink-0" /> Live
```

The `<a>` wrapper's existing hover and color classes remain unchanged. The icon sits inline with the text using `flex items-center gap-1`.

## Usage in Contact Page

The GitHub social link on `app/contact/page.tsx` also gets the `GitHubIcon` treatment, since it's the same platform. LinkedIn is left as text for now. The existing `<a>` wrapper should gain `flex items-center gap-1` to align the icon with the "GitHub" text label, matching the ProjectCard pattern.

## Accessibility

- Icons are `aria-hidden="true"` — they are decorative; the link's text content provides the label
- Existing `aria-label` attributes on project card links remain as-is
- The Contact page GitHub link has no `aria-label` and relies on its visible text ("GitHub") as the accessible label — this remains valid after the change since the text label is preserved

## Testing

- Update the `resume link points to correct file` test if any nav selectors are affected (unlikely)
- No new e2e tests required — the links themselves are unchanged, only their visual presentation

## Extension Pattern

To add a new icon later:
1. Create `components/icons/NewIcon.tsx` with the SVG
2. Import and use it at the call site

No central registry or barrel file needed at this scale.
