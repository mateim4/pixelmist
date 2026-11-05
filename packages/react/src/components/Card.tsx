import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import type { SpaceValue } from './Box';
import { spaceCss } from './Box';

export type CardVariant = 'base' | 'feature' | 'cream' | 'featured' | 'code';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Adds the hover lift + shadow transition (for clickable cards). */
  hoverable?: boolean;
  /** Override the variant's padding; token name ("xxl") or px. */
  padding?: SpaceValue;
}

export const Card = forwardRef(function Card(
  { variant = 'base', hoverable = false, padding, className, style, ...rest }: CardProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={cx('pm-card', `pm-card--${variant}`, hoverable && 'pm-card--lift', className)}
      style={{ ...(padding !== undefined && { padding: spaceCss(padding) }), ...style }}
      {...rest}
    />
  );
});
