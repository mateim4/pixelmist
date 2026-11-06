import type { HTMLAttributes } from 'react';
import { cx } from '@pixelmist/core';

export interface AccentStripeProps extends HTMLAttributes<HTMLDivElement> {
  /** Stripe height in px. */
  height?: number;
}

/**
 * The pixelmist signature: a full-width blue→violet→ice gradient band
 * (the "dusk sweep"). Placed at the foot of a page/screen.
 */
export function AccentStripe({ height = 10, className, style, ...rest }: AccentStripeProps) {
  return <div aria-hidden className={cx('pm-accent-stripe', className)} style={{ height, ...style }} {...rest} />;
}
