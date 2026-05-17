import { GREEN } from '../constants';
import type { DeltaResult } from '../utils';
import { fmt } from '../utils';
import { CardHeader } from './CardHeader';

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
      <CardHeader label={label} delta={delta} />
      <span className="text-2xl font-mono font-bold" style={{ color: accent }}>
        {fmt(value)}
        {suffix}
      </span>
      {sublabel && <div className="text-xs font-mono text-white/30 mt-0.5">{sublabel}</div>}
    </div>
  );
}
