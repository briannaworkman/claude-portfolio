import type { MonthData, MonthMetrics } from '@/data/stats';
import { STATS_DATA } from '@/data/stats';
import { GREEN } from './constants';

export type DeltaResult = { display: string; color: string };

export type NumericMetricKey = {
  [K in keyof MonthMetrics]: MonthMetrics[K] extends number ? K : never;
}[keyof MonthMetrics];

export function fmt(n: number | string): string {
  return typeof n === 'number' && n >= 1000 ? n.toLocaleString() : String(n);
}

export function getDelta(
  current: MonthData,
  prev: MonthData | null,
  key: NumericMetricKey,
  invertGood = false,
): DeltaResult | null {
  if (!prev) return null;
  const diff = current.metrics[key] - prev.metrics[key];
  if (diff === 0) return null;
  const up = diff > 0;
  return {
    display: `${up ? '▲' : '▼'} ${Math.abs(diff)}`,
    color: (invertGood ? !up : up) ? GREEN : '#f43f5e',
  };
}

export function getDeltaPct(
  current: MonthData,
  prev: MonthData | null,
  key: NumericMetricKey,
  invertGood = false,
): DeltaResult | null {
  if (!prev) return null;
  const diff = current.metrics[key] - prev.metrics[key];
  if (diff === 0) return null;
  const up = diff > 0;
  return {
    display: `${up ? '▲' : '▼'} ${Math.abs(diff)}%`,
    color: (invertGood ? !up : up) ? GREEN : '#f43f5e',
  };
}

export const trendData = STATS_DATA.map((d) => ({
  label: d.slug,
  messages: d.metrics.messages,
  commits: d.metrics.commits,
  goalRate: d.metrics.goalRate,
  agentCalls: d.metrics.agentCalls,
  msgsPerDay: d.metrics.msgsPerDay,
  linesAdded: d.metrics.linesAdded,
  multiClaudingPct: d.metrics.multiClaudingPct,
  frictionScore: d.metrics.frictionScore,
}));
