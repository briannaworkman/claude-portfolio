export type OutputLine = {
  id: string;
  type: 'input' | 'output' | 'error' | 'stream';
  text: string;
};

type Props = {
  lines: OutputLine[];
};

export function TerminalOutput({ lines }: Props) {
  return (
    <div className="flex flex-col gap-1 font-mono text-sm">
      {lines.map((line) => (
        <div
          key={line.id}
          className={
            line.type === 'input'
              ? 'text-white'
              : line.type === 'error'
                ? 'text-red-400'
                : 'text-text-primary/80'
          }
        >
          {line.type === 'input' && <span className="text-amber-400 mr-2 select-none">{'>'}</span>}
          <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}
