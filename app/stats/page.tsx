import type { Metadata } from 'next';
import { StatsDashboard } from '@/components/web/stats/StatsDashboard';

export const metadata: Metadata = {
  title: 'Stats — Bri Workman',
};

export default function StatsPage() {
  return <StatsDashboard />;
}
