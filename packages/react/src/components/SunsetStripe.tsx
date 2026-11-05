import type { HTMLAttributes } from 'react';
import { cx } from '@pixelmist/core';

export interface SunsetStripeProps extends HTMLAttributes<HTMLDivElement> {
  /** Stripe height in px. */
  height?: number;
}

/**
 * The Mistral signature: a full-width red→orange→yellow→cream gradient band.
 * Placed at the foot of a page/screen.
 */
export function SunsetStripe({ height = 10, className, style, ...rest }: SunsetStripeProps) {
  return <div aria-hidden className={cx('pm-sunset-stripe', className)} style={{ height, ...style }} {...rest} />;
}
