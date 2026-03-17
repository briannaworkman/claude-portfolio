// Multi-word commands that must be matched before splitting
const MULTI_WORD_COMMANDS = ['ls projects', 'open github', 'open linkedin'];

export type ParsedCommand = {
  command: string;
  args: string[];
};

export function parseCommand(raw: string): ParsedCommand {
  const input = raw.trim();
  if (!input) return { command: '', args: [] };

  // Check multi-word commands first
  for (const cmd of MULTI_WORD_COMMANDS) {
    if (input === cmd || input.startsWith(`${cmd} `)) {
      const rest = input.slice(cmd.length).trim();
      return { command: cmd, args: rest ? [rest] : [] };
    }
  }

  // Single-word commands with optional args
  const [command, ...rest] = input.split(' ');
  const args = rest.length > 0 ? [rest.join(' ')] : [];
  return { command, args };
}
