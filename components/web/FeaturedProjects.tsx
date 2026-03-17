import Link from 'next/link';
import { ProjectCard } from '@/components/web/ProjectCard';
import { projects } from '@/data/projects';

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        <Link
          href="/projects"
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
