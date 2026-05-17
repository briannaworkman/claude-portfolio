import { ExternalLinkIcon } from '@/components/icons/ExternalLinkIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { ClaudeTagBadge } from '@/components/web/ClaudeTagBadge';
import type { Project } from '@/data/projects';

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <article className="group relative flex flex-col gap-3 p-5 rounded-lg border border-border bg-surface hover:border-violet-500/40 hover:bg-surface-hover transition-all">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-text-primary group-hover:text-violet-400 transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0 text-text-muted">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="flex items-center gap-1 text-xs hover:text-text-primary transition-colors"
            >
              <GitHubIcon size={14} />
              GitHub
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="flex items-center gap-1 text-xs hover:text-text-primary transition-colors"
            >
              <ExternalLinkIcon size={14} />
              Live
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-text-muted">{project.description}</p>

      <div className="flex flex-col gap-2 mt-auto pt-2">
        <ClaudeTagBadge tags={project.claudeTags} />
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2 py-0.5 rounded bg-border text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
