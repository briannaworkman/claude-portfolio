import { about } from '@/data/about';

export function TerminalWelcome() {
  return (
    <div className="border border-violet-500/40 rounded font-mono text-sm mb-6 flex flex-col sm:flex-row">
      {/* Left panel */}
      <div className="flex flex-col items-center justify-center px-8 py-6 sm:border-r border-b sm:border-b-0 border-violet-500/40 sm:min-w-56 gap-3 text-center">
        <div className="text-violet-400 font-semibold tracking-tight">brianna.dev</div>
        <div className="text-text-primary">Welcome!</div>
        <div className="text-violet-400 text-4xl select-none leading-none">⬡</div>
        <div className="text-text-muted text-xs leading-relaxed">
          <div>claude-haiku-4-5</div>
          <div>{about.location}</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col px-6 py-6 gap-5 justify-center">
        <div>
          <div className="text-violet-400 mb-2">Get started here</div>
          <div className="flex flex-col gap-1 text-text-muted">
            <div>
              Type <span className="text-text-primary">help</span> to see all available commands
            </div>
            <div>
              Type <span className="text-text-primary">ask &lt;question&gt;</span> to chat with me
              (Claude-powered)
            </div>
            <div>
              Type <span className="text-text-primary">whoami</span> to learn about me
            </div>
            <div>
              Type <span className="text-text-primary">ls projects</span> to browse my work
            </div>
            <div>
              Type <span className="text-text-primary">stats</span> to see my Claude Code usage
            </div>
          </div>
        </div>

        <div>
          <div className="text-violet-400 mb-2">Terminal Profile</div>
          <div className="text-text-muted">
            {about.name} · {about.title} · Claude Code enthusiast
          </div>
        </div>
      </div>
    </div>
  );
}
