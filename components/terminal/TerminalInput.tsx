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

const ALL_COMPLETIONS = [...BASE_COMMANDS, ...projects.map((p) => `cat ${p.slug}`), 'ask '];

type Props = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
};

export function TerminalInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [_historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
