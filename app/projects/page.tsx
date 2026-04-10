import type { Metadata } from 'next';
import { PageHeader } from '@/components/web/PageHeader';
import { ProjectCard } from '@/components/web/ProjectCard';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects — Bri Workman',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader title="PROJECTS" subtitle="Things I've built — with and without Claude." />

      {projects.length === 0 ? (
        <p className="text-text-muted font-mono">no projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
