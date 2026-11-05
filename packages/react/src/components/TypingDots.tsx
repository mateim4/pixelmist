import { cx } from '@pixelmist/core';

export function TypingDots({ className }: { className?: string }) {
  return (
    <span className={cx('pm-typing', className)} aria-label="Generating" role="status">
      <span />
      <span />
      <span />
    </span>
  );
}
