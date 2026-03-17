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
