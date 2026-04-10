import type { Metadata } from 'next';
import { PageHeader } from '@/components/web/PageHeader';
import { usesCategories } from '@/data/uses';

export const metadata: Metadata = {
  title: 'Uses — Bri Workman',
};

export default function UsesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHeader title="USES" subtitle="My setup, tools, and the stack I reach for by default." />

      <div className="space-y-10">
        {usesCategories.map((category) => (
          <section key={category.name}>
            <h2 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-4">
              {category.name}
            </h2>
            <ul className="space-y-4">
              {category.items.map((item) => (
                <li key={item.name} className="flex gap-4">
                  <span className="font-medium text-text-primary w-32 shrink-0">{item.name}</span>
                  <span className="text-text-muted text-sm">{item.description}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
