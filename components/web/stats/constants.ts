export const GREEN = '#00ff9d';

export const EFFORT_COLORS = {
  low: { bg: 'bg-emerald-900/40', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  medium: { bg: 'bg-amber-900/40', border: 'border-amber-500/40', text: 'text-amber-400' },
  high: { bg: 'bg-rose-900/40', border: 'border-rose-500/40', text: 'text-rose-400' },
} as const;

export const AXIS_STYLE = { fontFamily: 'monospace', fontSize: 10, fill: '#ffffff30' };
export const GRID_STYLE = { stroke: '#ffffff08', strokeDasharray: '3 3' };

export const TAB_LABELS: Record<string, string> = {
  metrics: 'metrics',
  trends: 'trends',
  assessment: 'assessment',
  horizon: 'on the horizon',
  implemented: 'implemented',
};

export const TABS = ['metrics', 'trends', 'assessment', 'horizon', 'implemented'];
