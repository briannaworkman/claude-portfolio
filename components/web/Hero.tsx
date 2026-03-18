import { about } from '@/data/about';

export function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <div className="space-y-4">
        <p className="font-mono text-violet-400 text-sm">hi, i'm</p>
        <h1 className="text-5xl font-bold tracking-tight text-text-primary">{about.name}</h1>
        <p className="text-2xl text-text-muted font-light">{about.title}</p>
        <p className="max-w-xl text-text-muted leading-relaxed pt-2">{about.bio}</p>
      </div>
    </section>
  );
}
