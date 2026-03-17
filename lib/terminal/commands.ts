// lib/terminal/commands.ts — placeholder, replaced in Chunk 6
import type { OutputLine } from '@/components/terminal/TerminalOutput';

export async function runCommand(
  _input: string,
  _onStream: (chunk: string) => void,
): Promise<OutputLine[]> {
  return [{ id: crypto.randomUUID(), type: 'error', text: 'commands not implemented yet' }];
}
