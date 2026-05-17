'use client';

import { useState } from 'react';
import { ASSESSMENT } from '@/data/stats';

function ItemChips({ month, tag, variant }: { month?: string; tag: string; variant: 'strength' | 'edge' }) {
  const c = variant === 'strength'
    ? { text: 'text-emerald-400/60', border: 'border-emerald-500/30' }
    : { text: 'text-rose-400/60', border: 'border-rose-500/30' };
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {month && (
        <span className="text-xs font-mono text-white/30 border border-white/10 px-2 py-0.5 rounded">
          {month}
        </span>
      )}
      <span className={`text-xs font-mono ${c.text} border ${c.border} px-2 py-0.5 rounded`}>
        {tag}
      </span>
    </div>
  );
}

export function AssessmentTab() {
  const summaries = ASSESSMENT.summary;
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="space-y-5 stats-fade-up">
      <div className="border border-white/8 bg-white/3 rounded p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono text-white/35 uppercase tracking-widest">Summary</div>
          {summaries.length > 1 && (
            <div className="flex items-center gap-1.5">
              {summaries.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === activeIdx ? 'bg-[#00ff9d]' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <p key={activeIdx} className="text-sm font-mono text-white/70 leading-relaxed stats-fade-up">
          {summaries[activeIdx]}
        </p>
      </div>

      <div>
        <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-3">
          Strengths
        </div>
        <div className="space-y-3">
          {ASSESSMENT.strengths.map((s) => (
            <div
              key={s.label}
              className="border border-emerald-500/20 bg-emerald-950/15 rounded p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-mono text-sm text-white/90 font-semibold">{s.label}</div>
                <ItemChips month={s.month} tag={s.tag} variant="strength" />
              </div>
              <p className="text-xs font-mono text-white/50 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-3">
          Rough Edges
        </div>
        <div className="space-y-3">
          {ASSESSMENT.roughEdges.map((r) => (
            <div key={r.label} className="border border-rose-500/20 bg-rose-950/15 rounded p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-mono text-sm text-white/90 font-semibold">{r.label}</div>
                <ItemChips month={r.month} tag={r.tag} variant="edge" />
              </div>
              <p className="text-xs font-mono text-white/50 leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
