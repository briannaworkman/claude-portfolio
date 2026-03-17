import { describe, expect, it } from 'vitest';
import { parseCommand } from '@/lib/terminal/parser';

describe('parseCommand', () => {
  it('parses a bare command', () => {
    expect(parseCommand('whoami')).toEqual({ command: 'whoami', args: [] });
  });

  it('parses command with single arg', () => {
    expect(parseCommand('cat my-project')).toEqual({
      command: 'cat',
      args: ['my-project'],
    });
  });

  it('parses multi-word command (ls projects)', () => {
    expect(parseCommand('ls projects')).toEqual({
      command: 'ls projects',
      args: [],
    });
  });

  it('parses open with subcommand', () => {
    expect(parseCommand('open github')).toEqual({
      command: 'open github',
      args: [],
    });
  });

  it('parses ask with multi-word question', () => {
    expect(parseCommand('ask what do you work on')).toEqual({
      command: 'ask',
      args: ['what do you work on'],
    });
  });

  it('trims whitespace', () => {
    expect(parseCommand('  whoami  ')).toEqual({ command: 'whoami', args: [] });
  });

  it('returns empty command for blank input', () => {
    expect(parseCommand('')).toEqual({ command: '', args: [] });
    expect(parseCommand('   ')).toEqual({ command: '', args: [] });
  });
});
