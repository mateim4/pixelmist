import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export type PlanStepStatus = 'pending' | 'inProgress' | 'done';

export interface PlanStep {
  label: ReactNode;
  status: PlanStepStatus;
}

export interface PlanListProps extends HTMLAttributes<HTMLOListElement> {
  steps: PlanStep[];
}

const statusLabel: Record<PlanStepStatus, string> = {
  pending: 'Pending',
  inProgress: 'In progress',
  done: 'Done',
};

/** Plan list: the agent's steps as pending, in progress or done. */
export const PlanList = forwardRef(function PlanList({ steps, className, ...rest }: PlanListProps, ref: Ref<HTMLOListElement>) {
  return (
    <ol ref={ref} className={cx('pm-plan', className)} {...rest}>
      {steps.map((step, i) => (
        <li key={i} className={cx('pm-plan__step', `pm-plan__step--${step.status}`)} data-status={step.status} aria-label={statusLabel[step.status]}>
          <span className="pm-plan__icon" aria-hidden>
            {step.status === 'done' ? (
              <Icon name="check" size={14} strokeWidth={2.5} />
            ) : step.status === 'inProgress' ? (
              <span className="pm-btn__spinner" />
            ) : (
              <span className="pm-plan__pending-dot" />
            )}
          </span>
          <span className="pm-plan__label">{step.label}</span>
          <span className="pm-sr-only">{statusLabel[step.status]}</span>
        </li>
      ))}
    </ol>
  );
});
