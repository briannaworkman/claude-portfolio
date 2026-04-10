'use client';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <style>{`
        @keyframes page-header-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .page-header-cursor { animation: page-header-blink 1.1s step-end infinite; }
      `}</style>
      <h1 className="text-3xl font-mono font-bold text-white mb-1">
        {title}
        <span className="page-header-cursor ml-1 text-violet-400">_</span>
      </h1>
      <p className="text-text-muted">{subtitle}</p>
    </div>
  );
}
