import type { HorizonItem } from '@/data/stats';
import { EFFORT_COLORS } from '../constants';

export function HorizonCard({ item }: { item: HorizonItem }) {
  const c = EFFORT_COLORS[item.effort];
  return (
    <div
      className={`border ${c.border} ${c.bg} rounded p-4 transition-all duration-200 hover:brightness-110`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-mono text-sm text-white/90 font-semibold leading-snug">
          {item.title}
        </div>
        <span
          className={`shrink-0 text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${c.border} ${c.text} bg-black/20`}
        >
          {item.effort}
        </span>
      </div>
      <p className="text-xs font-mono text-white/50 leading-relaxed">{item.description}</p>
    </div>
  );
}
