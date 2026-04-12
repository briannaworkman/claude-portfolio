import { GREEN } from '../constants';

export function MiniBar({
  label,
  value,
  max,
  color = GREEN,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs font-mono text-white/40 truncate shrink-0">{label}</div>
      <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }}
        />
      </div>
      <div className="w-6 text-xs font-mono text-white/50 text-right shrink-0">
        {Math.round((value / max) * 100)}%
      </div>
    </div>
  );
}
