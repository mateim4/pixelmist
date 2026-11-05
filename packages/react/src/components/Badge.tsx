import type { HTMLAttributes } from 'react';
import { cx } from '@pixelmist/core';

export type BadgeVariant = 'accent' | 'cream' | 'dark' | 'outline';
export type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
}

/** Pill status chip (radius full — the one place Mistral uses pills). */
export function Badge({ variant = 'accent', tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cx('pm-badge', `pm-badge--${variant}`, className)} data-tone={tone} {...rest} />;
}
