'use client';

import { useEffect, useRef, useState } from 'react';
import { TerminalInput } from '@/components/terminal/TerminalInput';
import { type OutputLine, TerminalOutput } from '@/components/terminal/TerminalOutput';
import { useMode } from '@/context/ModeContext';
import { runCommand } from '@/lib/terminal/commands';

const WELCOME_LINES: OutputLine[] = [
  { id: 'w1', type: 'output', text: 'Type help to explore. Welcome!' },
];

export function Terminal() {
  const { mode, toggle } = useMode();
  const [lines, setLines] = useState<OutputLine[]>(WELCOME_LINES);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom whenever lines change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  async function handleSubmit(input: string) {
    if (input === 'clear') {
      setLines(WELCOME_LINES);
      return;
    }

    const inputLine: OutputLine = {
      id: crypto.randomUUID(),
      type: 'input',
      text: input,
    };

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
          type="button"
          onClick={toggle}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          title="Close terminal"
          aria-label="Close terminal"
        />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-xs font-mono text-text-muted">brianna@portfolio ~ zsh</span>
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
