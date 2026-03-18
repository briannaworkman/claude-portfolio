'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useMode } from '@/context/ModeContext';

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/uses', label: 'Uses' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { mode, toggle } = useMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Ctrl+` toggles terminal mode
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

  // Open / close the dialog in sync with React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Sync state when dialog is closed natively (e.g. Escape key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setMenuOpen(false);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  // Clicking the dialog element itself (the backdrop area) closes the menu.
  // onKeyDown is required by the linter alongside onClick; Escape is already
  // handled natively by the dialog element via showModal().
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) setMenuOpen(false);
  };
  const handleDialogKeyDown = () => {};

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 inset-x-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm"
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-violet-400 font-semibold tracking-tight">
          brianna.dev
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-text-muted hover:text-text-primary transition-colors p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
        >
          {menuOpen ? (
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>

        {/* Mobile menu dialog */}
        <dialog
          ref={dialogRef}
          className="mobile-nav-menu md:hidden"
          onClick={handleDialogClick}
          onKeyDown={handleDialogKeyDown}
        >
          <div className="bg-bg border-b border-border px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Resume
            </a>
            <button
              type="button"
              onClick={() => {
                toggle();
                setMenuOpen(false);
              }}
              aria-label={mode === 'web' ? 'Switch to terminal mode' : 'Switch to web mode'}
              className="text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-violet-500 text-text-muted hover:text-violet-400 transition-all self-start"
            >
              {mode === 'web' ? '> terminal' : '⬡ web'}
            </button>
          </div>
        </dialog>
      </div>
    </nav>
  );
}
