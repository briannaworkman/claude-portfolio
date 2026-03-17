import type { OutputLine } from '@/components/terminal/TerminalOutput';
import { type Availability, about } from '@/data/about';
import { claudeTagLabel, projects } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { social } from '@/data/social';
import { usesCategories } from '@/data/uses';
import type { PostMeta } from '@/lib/mdx';
import { parseCommand } from '@/lib/terminal/parser';

type StreamCallback = (chunk: string) => void;

function line(text: string, type: OutputLine['type'] = 'output'): OutputLine {
  return { id: crypto.randomUUID(), type, text };
}

export function findProjectBySlug(slug: string) {
  return projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

const availabilityText: Record<Availability, string> = {
  open: 'open to work — feel free to reach out.',
  'not-looking': 'not currently looking, but happy to connect.',
  freelance: 'open to freelance opportunities.',
};

const HELP_TEXT = `
Available commands:

  whoami          About me
  experience      Work history
  skills          Tech stack overview
  ls projects     List all projects
  cat <slug>      Project details (e.g. cat claude-portfolio)
  blog            Blog posts
  uses            Tools and setup
  contact         How to reach me
  availability    Current status
  open github     Open GitHub profile
  open linkedin   Open LinkedIn profile
  resume          Download my resume
  education       Academic background
  interests       What I geek out on
  ask <question>  Ask me anything (Claude-powered)
  clear           Clear the terminal

Tip: Press Tab to autocomplete · ↑↓ for history
`.trim();

async function handleAsk(question: string, onStream: StreamCallback): Promise<OutputLine[]> {
  if (!question.trim()) {
    return [line('usage: ask <question>', 'error')];
  }
  if (question.length > 500) {
    return [line('error: question too long. keep it under 500 characters.', 'error')];
  }

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (res.status === 429) {
      return [line('error: rate limit exceeded. try again in a minute.', 'error')];
    }
    if (res.status === 400) {
      return [line('error: question too long. keep it under 500 characters.', 'error')];
    }
    if (!res.ok || !res.body) {
      return [line("error: failed to reach brianna's brain. try again.", 'error')];
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    try {
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          onStream(decoder.decode(value, { stream: true }));
        }
      }
    } finally {
      reader.cancel();
    }

    return []; // stream handled via onStream callback
  } catch {
    return [line("error: failed to reach brianna's brain. try again.", 'error')];
  }
}

export async function runCommand(input: string, onStream: StreamCallback): Promise<OutputLine[]> {
  const { command, args } = parseCommand(input);

  switch (command) {
    case 'help':
      return [line(HELP_TEXT)];

    case 'whoami':
      return [line(`${about.name}`), line(`${about.title}`), line(''), line(about.bio)];

    case 'experience':
      return about.experience.flatMap((exp) => [
        line(`${exp.role} @ ${exp.company} (${exp.startDate} – ${exp.endDate})`),
        line(`  ${exp.description}`),
        line(''),
      ]);

    case 'skills':
      return skillCategories.flatMap((cat) => [
        line(`[${cat.name}]`),
        line(`  ${cat.skills.join(', ')}`),
        line(''),
      ]);

    case 'ls projects':
      return [
        line('Projects:'),
        ...projects.map((p) => {
          const badge = p.claudeTag ? ` [${claudeTagLabel[p.claudeTag]}]` : '';
          return line(`  ${p.slug}${badge} — ${p.title}`);
        }),
      ];

    case 'cat': {
      const slug = args[0];
      if (!slug) return [line('usage: cat <slug>', 'error')];
      const project = findProjectBySlug(slug);
      if (!project) {
        return [
          line(
            `error: project '${slug}' not found. run ls projects to see available projects.`,
            'error',
          ),
        ];
      }
      const lines: OutputLine[] = [
        line(project.title),
        line(''),
        line(project.description),
        line(''),
        line(`tags: ${project.tags.join(', ')}`),
      ];
      if (project.claudeTag) lines.push(line(`claude: ${claudeTagLabel[project.claudeTag]}`));
      if (project.url) lines.push(line(`url: ${project.url}`));
      if (project.repo) lines.push(line(`repo: ${project.repo}`));
      return lines;
    }

    case 'blog': {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) return [line('error: failed to load blog posts.', 'error')];
        const posts = (await res.json()) as PostMeta[];
        if (posts.length === 0) return [line('no posts found.')];
        return [line('Posts:'), ...posts.map((p) => line(`  ${p.date}  ${p.title}`))];
      } catch {
        return [line('error: failed to load blog posts.', 'error')];
      }
    }

    case 'uses':
      return usesCategories.flatMap((cat) => [
        line(`[${cat.name}]`),
        ...cat.items.map((item) => line(`  ${item.name} — ${item.description}`)),
        line(''),
      ]);

    case 'contact': {
      const parts: OutputLine[] = [];
      if (social.email) parts.push(line(`email: ${social.email}`));
      if (social.github) parts.push(line(`github: ${social.github}`));
      if (social.linkedin) parts.push(line(`linkedin: ${social.linkedin}`));
      return parts.length ? parts : [line('no contact info configured.')];
    }

    case 'availability':
      return [line(availabilityText[about.availability])];

    case 'open github':
      if (!social.github) return [line('error: link not configured.', 'error')];
      window.open(social.github, '_blank', 'noopener');
      return [line(`opening ${social.github}...`)];

    case 'open linkedin':
      if (!social.linkedin) return [line('error: link not configured.', 'error')];
      window.open(social.linkedin, '_blank', 'noopener');
      return [line(`opening ${social.linkedin}...`)];

    case 'resume': {
      try {
        const check = await fetch('/resume.pdf', { method: 'HEAD' });
        if (!check.ok) return [line('error: resume.pdf not found.', 'error')];
        window.open('/resume.pdf', '_blank', 'noopener');
        return [line('opening resume.pdf...')];
      } catch {
        return [line('error: could not verify resume. try again.', 'error')];
      }
    }

    case 'education':
      return about.education.flatMap((edu) => [
        line(`${edu.degree}`),
        line(`  ${edu.institution}, ${edu.graduationYear}`),
        line(''),
      ]);

    case 'interests':
      return [line(about.interests.join(', '))];

    case 'ask':
      return handleAsk(args[0] ?? '', onStream);

    case '':
      return [];

    default:
      return [line(`command not found: ${command}. type help to see available commands.`, 'error')];
  }
}
