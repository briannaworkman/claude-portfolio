'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/web/PageHeader';
import { STATS_DATA } from '@/data/stats';
import { AssessmentTab } from './AssessmentTab';
import { TrendsTab } from './charts';
import { HorizonCard, ImplementedCard, ScanLines } from './components';
import { TAB_LABELS, TABS } from './constants';
import { MetricsTab } from './MetricsTab';
import { getDelta, getDeltaPct } from './utils';

export function StatsDashboard() {
  const [activeMonth, setActiveMonth] = useState(STATS_DATA.length - 1);
  const [activeTab, setActiveTab] = useState('metrics');

  const current = STATS_DATA[activeMonth];
  const prev = activeMonth > 0 ? STATS_DATA[activeMonth - 1] : null;
  const maxBreakdown = current.workBreakdown.reduce((sum, w) => sum + w.sessions, 0);

  const dGoalRate = getDeltaPct(current, prev, 'goalRate');
  const dMessages = getDelta(current, prev, 'messages');
  const dCommits = getDelta(current, prev, 'commits');
  const dAgentCalls = getDelta(current, prev, 'agentCalls');
  const dFriction = getDeltaPct(current, prev, 'frictionScore', true);

  return (
    <div className="relative overflow-x-hidden">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .stats-fade-up { animation: fadeUp .35s ease both; }
      `}</style>

      <ScanLines />
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(ellipse,#00ff9d 0%,transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* ── HEADER ── */}
        <div className="mb-10 stats-fade-up flex items-start justify-between gap-4 flex-wrap">
          <PageHeader
            title="STATS"
            subtitle="rolling claude code insights · updated monthly"
            className=""
          />
          <div className="flex items-center gap-2 flex-wrap">
            {STATS_DATA.map((d, i) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => setActiveMonth(i)}
                className={`text-xs font-mono px-3 py-1.5 rounded border transition-all duration-150 ${
                  activeMonth === i
                    ? 'border-[#00ff9d]/60 text-[#00ff9d] bg-[#00ff9d]/8'
                    : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
                }`}
              >
                {d.slug}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          className="flex items-center mb-6 border-b border-white/8 stats-fade-up overflow-x-auto overflow-y-hidden"
          style={{ animationDelay: '0.05s' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 text-xs font-mono uppercase tracking-widest px-4 py-2.5 border-b-2 transition-all duration-150 -mb-px ${
                activeTab === tab
                  ? 'border-[#00ff9d] text-[#00ff9d]'
                  : 'border-transparent text-white/35 hover:text-white/60'
              }`}
            >
              {TAB_LABELS[tab]}
              {tab === 'implemented' && current.implemented.length > 0 && (
                <span className="ml-1.5 text-emerald-400">({current.implemented.length})</span>
              )}
              {tab === 'horizon' && (
                <span className="ml-1.5 text-amber-400">({current.horizon.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        {activeTab === 'metrics' && (
          <MetricsTab
            current={current}
            maxBreakdown={maxBreakdown}
            dMessages={dMessages}
            dCommits={dCommits}
            dAgentCalls={dAgentCalls}
            dGoalRate={dGoalRate}
            dFriction={dFriction}
          />
        )}

        {activeTab === 'trends' && <TrendsTab hasEnoughData={STATS_DATA.length >= 4} />}

        {activeTab === 'assessment' && <AssessmentTab />}

        {activeTab === 'horizon' && (
          <div className="space-y-3 stats-fade-up">
            {current.horizon.length === 0 ? (
              <p className="text-xs font-mono text-white/30">
                nothing on the horizon for this period.
              </p>
            ) : (
              current.horizon.map((item) => <HorizonCard key={item.id} item={item} />)
            )}
          </div>
        )}

        {activeTab === 'implemented' && (
          <div className="space-y-3 stats-fade-up">
            {current.implemented.length === 0 ? (
              <p className="text-xs font-mono text-white/30">
                no items implemented from previous horizons yet.
              </p>
            ) : (
              current.implemented.map((item) => (
                <ImplementedCard key={`${item.title}-${item.fromMonth}`} item={item} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
