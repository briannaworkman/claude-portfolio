import type { DeltaResult } from '../utils';

export function FrictionCard({ value, delta }: { value: number; delta?: DeltaResult | null }) {
  return (
    <div className="relative border border-rose-500/20 bg-rose-950/15 rounded p-4 overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs font-mono text-rose-400/60 uppercase tracking-widest">Friction</div>
        {delta && (
          <span className="text-xs font-mono font-semibold" style={{ color: delta.color }}>
            {delta.display}
          </span>
        )}
      </div>
      <span className="text-2xl font-mono font-bold text-rose-400">{value}</span>
      <span className="text-sm font-mono text-white/30 ml-1">/ 10</span>
      <div className="text-xs font-mono text-rose-400/40 mt-0.5">want this at zero</div>
    </div>
  );
}
