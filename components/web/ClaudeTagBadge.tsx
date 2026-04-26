import { type ClaudeTag, claudeTagLabel } from '@/data/projects';

type Props = {
  tags: ClaudeTag[];
};

const bothTags = new Set<string>(['built-with', 'powered-by']);

function resolveLabel(tags: ClaudeTag[]): string {
  if (tags.length >= 2 && tags.every((t) => bothTags.has(t))) {
    return 'Built & powered by Claude';
  }
  return claudeTagLabel[tags[0]];
}

export function ClaudeTagBadge({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border border-violet-500/50 text-violet-400 shadow-claude bg-violet-500/5">
      <span aria-hidden="true">◆</span>
      <span>{resolveLabel(tags)}</span>
    </span>
  );
}
