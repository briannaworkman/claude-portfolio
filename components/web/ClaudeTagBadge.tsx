import { type ClaudeTag, claudeTagLabel } from '@/data/projects';

type Props = {
  tags: ClaudeTag[];
};

export function ClaudeTagBadge({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border border-violet-500/50 text-violet-400 shadow-claude bg-violet-500/5"
        >
          <span aria-hidden="true">◆</span>
          <span>{claudeTagLabel[tag]}</span>
        </span>
      ))}
    </>
  );
}
