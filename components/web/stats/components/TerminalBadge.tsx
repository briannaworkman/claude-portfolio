import { GREEN } from '../constants';

export function TerminalBadge({ text, color = GREEN }: { text: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded border"
      style={{ color, borderColor: `${color}40`, background: `${color}10` }}
    >
      <span>▸</span>
      {text}
    </span>
  );
}
