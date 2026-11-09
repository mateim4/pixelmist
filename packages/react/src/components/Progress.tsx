import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Text } from './Text';

export type ProgressStatus = 'active' | 'finished' | 'error';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100; omit for indeterminate. */
  value?: number;
  label?: string;
  /** Helper text under the bar. */
  hint?: string;
  /** Show the numeric value. */
  showValue?: boolean;
  /**
   * Status drives the tone (colour means state): active → progress, finished → settled,
   * error → danger. There is deliberately no `tone` prop.
   */
  status?: ProgressStatus;
}

/**
 * Progress bar. Determinate animates the fill with transform: scaleX (motion rule:
 * only opacity/transform/colour animate). Indeterminate runs a shimmer.
 * forwardRef + prop pass-through to the root element; aria-label/aria-labelledby
 * from props land on the progressbar track.
 */
export const Progress = forwardRef(function Progress(
  {
    value,
    label,
    hint,
    showValue = false,
    status = 'active',
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  }: ProgressProps,
  ref: Ref<HTMLDivElement>,
) {
  const indeterminate = value === undefined || !Number.isFinite(value);
  const pct = indeterminate ? 100 : Math.max(0, Math.min(100, value));
  const resolvedTone = status === 'finished' ? 'success' : status === 'error' ? 'danger' : 'accent';
  return (
    <div ref={ref} className={cx('pm-progress', className)} data-tone={resolvedTone} data-status={status} {...rest}>
      {label || showValue || hint ? (
        <div className="pm-progress__meta">
          {label ? <Text variant="body-sm-medium">{label}</Text> : <span />}
          {showValue && !indeterminate ? (
            <Text variant="caption" tone="muted">
              {Math.round(pct)}%
            </Text>
          ) : null}
        </div>
      ) : null}
      <div
        className="pm-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-label={ariaLabel ?? label}
        aria-labelledby={ariaLabelledby}
        aria-busy={status === 'active' || undefined}
      >
        <div
          className={cx('pm-progress__fill', indeterminate && 'is-indeterminate')}
          style={indeterminate ? undefined : { transform: `scaleX(${pct / 100})` }}
        />
      </div>
      {hint ? (
        <Text variant="caption" tone="muted" className="pm-progress__hint">
          {hint}
        </Text>
      ) : null}
    </div>
  );
});
