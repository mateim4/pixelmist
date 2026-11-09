import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

export type BadgeVariant = 'accent' | 'cream' | 'dark' | 'outline';
export type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
}

/** Pill status chip (radius full — the one place Mistral uses pills). forwardRef + pass-through. */
export const Badge = forwardRef(function Badge(
  { variant = 'accent', tone = 'neutral', className, ...rest }: BadgeProps,
  ref: Ref<HTMLSpanElement>,
) {
  return <span ref={ref} className={cx('pm-badge', `pm-badge--${variant}`, className)} data-tone={tone} {...rest} />;
});
