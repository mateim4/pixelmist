import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

export interface DiffLine {
  type: 'add' | 'del' | 'ctx';
  text: string;
}

export interface DiffViewProps extends HTMLAttributes<HTMLDivElement> {
  lines: DiffLine[];
}

/** Minimal unified diff view with tinted add/del rows (mono, code surface). */
export const DiffView = forwardRef(function DiffView({ lines, className, ...rest }: DiffViewProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className={cx('pm-diff', className)} {...rest}>
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
});
