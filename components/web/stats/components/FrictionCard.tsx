import type { DeltaResult } from '../utils';
import { CardHeader } from './CardHeader';

export function FrictionCard({ value, delta }: { value: number; delta?: DeltaResult | null }) {
  return (
    <div className="relative border border-rose-500/20 bg-rose-950/15 rounded p-4 overflow-hidden">
      <CardHeader label="Friction" delta={delta} labelClassName="text-rose-400/60" />
      <span className="text-2xl font-mono font-bold text-rose-400">{value}</span>
      <span className="text-sm font-mono text-white/30 ml-1">/ 10</span>
      <div className="text-xs font-mono text-rose-400/40 mt-0.5">want this at zero</div>
    </div>
  );
}
