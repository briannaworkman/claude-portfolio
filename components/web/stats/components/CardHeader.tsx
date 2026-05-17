import type { DeltaResult } from '../utils';

type Props = {
  label: string;
  delta?: DeltaResult | null;
  labelClassName?: string;
};

export function CardHeader({ label, delta, labelClassName = 'text-white/35' }: Props) {
  return (
    <div className="relative mb-2">
      <div className={`text-xs font-mono uppercase tracking-widest pr-14 ${labelClassName}`}>
        {label}
      </div>
      {delta && (
        <span
          className="absolute top-0 right-0 text-xs font-mono font-semibold whitespace-nowrap"
          style={{ color: delta.color }}
        >
          {delta.display}
        </span>
      )}
    </div>
  );
}
