import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import type { Size } from '@pixelmist/core';
import { cx } from '@pixelmist/core';
import { useTweenedNumber } from '../hooks/useTweenedNumber';

export interface XPBarProps extends HTMLAttributes<HTMLDivElement> {
  /** XP earned into the current level. */
  value: number;
  /** XP needed to reach the next level. */
  max: number;
  /** Current level, shown as a "Lv n" chip. */
  level?: number;
  /** Show the tweened "x / y XP" readout (default true). */
  showValue?: boolean;
  label?: string;
  /** Helper text under the bar. */
  hint?: string;
  size?: Size;
}

/**
 * XP bar — gamification primitive. Progress into the current level, toned `progress`
 * (in flight; colour means state). The numeric readout tweens (≤400ms, instant under
 * prefers-reduced-motion); the fill animates with transform: scaleX only.
 * forwardRef + prop pass-through to the root element.
 */
export const XPBar = forwardRef(function XPBar(
  {
    value,
    max,
    level,
    showValue = true,
    label,
    hint,
    size = 'md',
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  }: XPBarProps,
  ref: Ref<HTMLDivElement>,
) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(safeMax, value)) : 0;
  const pct = (clamped / safeMax) * 100;
  const tweened = useTweenedNumber(Math.round(clamped));
  return (
    <div ref={ref} className={cx('pm-xpbar', `pm-xpbar--${size}`, className)} data-tone="progress" {...rest}>
      <div className="pm-xpbar__meta">
        {level !== undefined ? <span className="pm-xpbar__level">Lv {level}</span> : <span />}
        {showValue ? (
          <span className="pm-xpbar__value">
            {tweened} / {safeMax} XP
          </span>
        ) : null}
      </div>
      <div
        className="pm-xpbar__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={Math.round(clamped)}
        aria-valuetext={`${Math.round(clamped)} of ${safeMax} XP${level !== undefined ? `, level ${level}` : ''}`}
        aria-label={ariaLabel ?? (label || (level !== undefined ? `Level ${level} progress` : 'XP progress'))}
        aria-labelledby={ariaLabelledby}
        aria-busy
      >
        <div className="pm-xpbar__fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      {hint ? <p className="pm-xpbar__hint">{hint}</p> : null}
    </div>
  );
});
