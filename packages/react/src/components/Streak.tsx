import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export interface StreakProps extends HTMLAttributes<HTMLSpanElement> {
  /** Consecutive active days. */
  days: number;
  size?: 'sm' | 'md';
}

/**
 * Streak chip — gamification primitive. Flame icon + "n-day streak". A live streak is
 * `attention` (it needs a person today); a count of zero is never toned — it renders
 * neutral. forwardRef + prop pass-through to the root element.
 */
export const Streak = forwardRef(function Streak(
  { days, size = 'md', className, ...rest }: StreakProps,
  ref: Ref<HTMLSpanElement>,
) {
  const n = Math.max(0, Math.floor(days));
  const tone = n > 0 ? 'attention' : 'neutral';
  return (
    <span
      ref={ref}
      className={cx('pm-streak', `pm-streak--${size}`, className)}
      data-tone={tone}
      aria-label={`${n} day streak`}
      {...rest}
    >
      <Icon name="flame" size={size === 'sm' ? 14 : 16} aria-hidden />
      <span className="pm-streak__label">
        {n} {n === 1 ? 'day' : 'days'} streak
      </span>
    </span>
  );
});
