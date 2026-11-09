import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

export type ActivityState = 'working' | 'idle' | 'stopped';

export interface ActivityMarkerProps extends HTMLAttributes<HTMLSpanElement> {
  state: ActivityState;
  /** Accessible label, e.g. "agent is working". Defaults per state. */
  label?: string;
}

const defaultLabel: Record<ActivityState, string> = {
  working: 'Working',
  idle: 'Idle',
  stopped: 'Stopped',
};

/**
 * Activity marker: working = pulsing ring, idle = steady ring, stopped = no ring.
 * Under prefers-reduced-motion the pulse stops and working becomes a still filled
 * marker, clearly different from idle's hollow ring.
 */
export const ActivityMarker = forwardRef(function ActivityMarker(
  { state, label, className, ...rest }: ActivityMarkerProps,
  ref: Ref<HTMLSpanElement>,
) {
  return (
    <span
      ref={ref}
      className={cx('pm-marker', `pm-marker--${state}`, className)}
      data-state={state}
      role="img"
      aria-label={label ?? defaultLabel[state]}
      {...rest}
    >
      <span className="pm-marker__dot" aria-hidden />
      <span className="pm-marker__ring" aria-hidden />
    </span>
  );
});

export interface AgentChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  name: string;
  /** Colour from the categorical palette (index 0–7) or any CSS colour. */
  color: number | string;
  state: ActivityState;
}

/** Agent chip: activity marker + colour dot + name. */
export const AgentChip = forwardRef(function AgentChip({ name, color, state, className, ...rest }: AgentChipProps, ref: Ref<HTMLSpanElement>) {
  const cssColor = typeof color === 'number' ? `var(--pm-color-dataviz-categorical-${color})` : color;
  return (
    <span ref={ref} className={cx('pm-agent-chip', className)} {...rest}>
      <ActivityMarker state={state} />
      <span className="pm-agent-chip__dot" style={{ backgroundColor: cssColor }} aria-hidden />
      <span className="pm-agent-chip__name">{name}</span>
    </span>
  );
});
