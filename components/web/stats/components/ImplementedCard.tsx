import type { ImplementedItem } from '@/data/stats';

export function ImplementedCard({ item }: { item: ImplementedItem }) {
  return (
    <div className="border border-white/10 bg-white/3 rounded p-4 hover:border-emerald-500/30 hover:bg-emerald-950/20 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 border-emerald-500 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-white/90 font-semibold mb-1">{item.title}</div>
          <p className="text-xs font-mono text-white/50 leading-relaxed mb-2">{item.description}</p>
          {item.outcome && (
            <div className="text-xs font-mono text-emerald-400/80 border-l-2 border-emerald-500/40 pl-2">
              {item.outcome}
            </div>
          )}
          {item.fromMonth && (
            <div className="text-xs font-mono text-white/20 mt-2">suggested {item.fromMonth}</div>
          )}
        </div>
      </div>
    </div>
  );
}
