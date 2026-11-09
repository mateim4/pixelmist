import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

/** Three bouncing dots while the agent generates. forwardRef + pass-through. */
export const TypingDots = forwardRef(function TypingDots(
  { className, ...rest }: HTMLAttributes<HTMLSpanElement>,
  ref: Ref<HTMLSpanElement>,
) {
  return (
    <span ref={ref} className={cx('pm-typing', className)} aria-label="Generating" role="status" {...rest}>
      <span />
      <span />
      <span />
    </span>
  );
});
