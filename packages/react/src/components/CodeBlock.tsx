import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Header label, e.g. the file name or language. */
  title?: string;
  /** Raw code string (rendered as-is inside <pre><code>). */
  code?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/** Dark terminal-style code panel with a header bar — the Vibe look. forwardRef + pass-through. */
export const CodeBlock = forwardRef(function CodeBlock(
  { title, code, children, actions, className, ...rest }: CodeBlockProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={cx('pm-codeblock', className)} {...rest}>
      {title || actions ? (
        <div className="pm-codeblock__header">
          <span className="pm-codeblock__title">{title}</span>
          {actions ? <span className="pm-codeblock__actions">{actions}</span> : null}
        </div>
      ) : null}
      <pre className="pm-codeblock__pre">
        <code>{code ?? children}</code>
      </pre>
    </div>
  );
});
