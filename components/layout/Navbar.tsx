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
    <nav
      aria-label="Main navigation"
      className="fixed top-0 inset-x-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm"
    >
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
            type="button"
            onClick={toggle}
            aria-label={mode === 'web' ? 'Switch to terminal mode' : 'Switch to web mode'}
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
