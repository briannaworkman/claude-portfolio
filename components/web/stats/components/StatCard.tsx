import { GREEN } from '../constants';
import type { DeltaResult } from '../utils';
import { fmt } from '../utils';

export function StatCard({
  label,
  value,
  accent = GREEN,
  sublabel,
  delta,
  suffix = '',
}: {
  label: string;
  value: number;
  accent?: string;
  sublabel?: string;
  delta?: DeltaResult | null;
  suffix?: string;
}) {
  return (
    <div className="relative border border-white/8 bg-white/3 rounded p-4 overflow-hidden">
      <div className="relative mb-2">
        <div className="text-xs font-mono text-white/35 uppercase tracking-widest pr-14">{label}</div>
        {delta && (
          <span className="absolute top-0 right-0 text-xs font-mono font-semibold whitespace-nowrap" style={{ color: delta.color }}>
            {delta.display}
          </span>
        )}
      </div>
      <span className="text-2xl font-mono font-bold" style={{ color: accent }}>
        {fmt(value)}
        {suffix}
      </span>
      {sublabel && <div className="text-xs font-mono text-white/30 mt-0.5">{sublabel}</div>}
    </div>
  );
}
