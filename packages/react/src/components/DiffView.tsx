import { cx } from '@pixelmist/core';

export interface DiffLine {
  type: 'add' | 'del' | 'ctx';
  text: string;
}

export interface DiffViewProps {
  lines: DiffLine[];
  className?: string;
}

/** Minimal unified diff view with tinted add/del rows (mono, code surface). */
export function DiffView({ lines, className }: DiffViewProps) {
  return (
    <div className={cx('pm-diff', className)}>
      {lines.map((l, i) => (
        <div key={i} className={cx('pm-diff__line', `pm-diff__line--${l.type}`)}>
          <span className="pm-diff__sign" aria-hidden>
            {l.type === 'add' ? '+' : l.type === 'del' ? '−' : ' '}
          </span>
          <code>{l.text || ' '}</code>
        </div>
      ))}
    </div>
  );
}
