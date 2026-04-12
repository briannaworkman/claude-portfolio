import { ASSESSMENT } from '@/data/stats';

export function AssessmentTab() {
  return (
    <div className="space-y-5 stats-fade-up">
      <div className="border border-white/8 bg-white/3 rounded p-5">
        <div className="text-xs font-mono text-white/35 uppercase tracking-widest mb-3">
          Summary
        </div>
        <p className="text-sm font-mono text-white/70 leading-relaxed">{ASSESSMENT.summary}</p>
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
                <span className="shrink-0 text-xs font-mono text-emerald-400/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {s.tag}
                </span>
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
                <span className="shrink-0 text-xs font-mono text-rose-400/60 border border-rose-500/30 px-2 py-0.5 rounded">
                  {r.tag}
                </span>
              </div>
              <p className="text-xs font-mono text-white/50 leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
