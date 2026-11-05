import { cx } from '@pixelmist/core';
import { Text } from './Text';

export interface ProgressProps {
  /** 0–100; omit for indeterminate. */
  value?: number;
  label?: string;
  /** Show the numeric value. */
  showValue?: boolean;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

/** Progress/XP bar. Determinate animates width; indeterminate runs a shimmer. */
export function Progress({ value, label, showValue = false, tone = 'accent', className }: ProgressProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 100 : Math.max(0, Math.min(100, value));
  return (
    <div className={cx('pm-progress', className)} data-tone={tone}>
      {label || showValue ? (
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
        aria-label={label}
      >
        <div
          className={cx('pm-progress__fill', indeterminate && 'is-indeterminate')}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
