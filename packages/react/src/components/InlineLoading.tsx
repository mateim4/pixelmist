import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export type InlineLoadingStatus = 'active' | 'finished' | 'error';

export interface InlineLoadingProps extends HTMLAttributes<HTMLDivElement> {
  status: InlineLoadingStatus;
  /** Text shown next to the indicator. */
  label: string;
  /** Extra text for the finished state (e.g. "Done"). */
  finishedLabel?: string;
  errorLabel?: string;
}

/** Inline loading: spinner + text; states active, finished (check), error (warning). role="status". */
export const InlineLoading = forwardRef(function InlineLoading(
  { status, label, finishedLabel, errorLabel, className, ...rest }: InlineLoadingProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={cx('pm-loading', `pm-loading--${status}`, className)}
      role={status === 'error' ? 'alert' : 'status'}
      data-status={status}
      {...rest}
    >
      {status === 'active' ? <span className="pm-btn__spinner" aria-hidden /> : null}
      {status === 'finished' ? <Icon name="check" size={16} aria-hidden /> : null}
      {status === 'error' ? <Icon name="warning-filled" size={16} aria-hidden /> : null}
      <span className="pm-loading__label">
        {status === 'finished' && finishedLabel ? finishedLabel : status === 'error' && errorLabel ? errorLabel : label}
      </span>
    </div>
  );
});
