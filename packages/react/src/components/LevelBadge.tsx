import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export interface LevelBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Current level. */
  level: number;
  size?: 'sm' | 'md';
}

/**
 * Level badge — gamification primitive. Medal icon + "Lv n". A level is not a state,
 * so it is always neutral (colour means state and nothing else).
 * forwardRef + prop pass-through to the root element.
 */
export const LevelBadge = forwardRef(function LevelBadge(
  { level, size = 'md', className, ...rest }: LevelBadgeProps,
  ref: Ref<HTMLSpanElement>,
) {
  return (
    <span
      ref={ref}
      className={cx('pm-level', `pm-level--${size}`, className)}
      aria-label={`Level ${level}`}
      {...rest}
    >
      <Icon name="medal" size={size === 'sm' ? 14 : 16} aria-hidden />
      <span className="pm-level__label">Lv {level}</span>
    </span>
  );
});
