import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Button } from './Button';
import { Icon } from './Icon';

export interface PermissionPromptProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What the agent wants to run, e.g. "run `cargo test` in brdcrmb". */
  action: ReactNode;
  onAllowOnce: () => void;
  onAlwaysAllow: () => void;
  onDeny: () => void;
  title?: ReactNode;
}

/** Permission prompt card: "the agent wants to run X" — Allow once / Always allow / Deny. */
export const PermissionPrompt = forwardRef(function PermissionPrompt(
  { action, onAllowOnce, onAlwaysAllow, onDeny, title = 'Permission requested', className, ...rest }: PermissionPromptProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={cx('pm-permission', className)} role="group" aria-label="Permission request" {...rest}>
      <div className="pm-permission__header">
        <Icon name="lock" size={16} aria-hidden />
        <span className="pm-permission__title">{title}</span>
      </div>
      <p className="pm-permission__action">{action}</p>
      <div className="pm-permission__actions">
        <Button variant="primary" size="sm" onClick={onAllowOnce}>
          Allow once
        </Button>
        <Button variant="tertiary" size="sm" onClick={onAlwaysAllow}>
          Always allow
        </Button>
        <Button variant="dangerTertiary" size="sm" onClick={onDeny}>
          Deny
        </Button>
      </div>
    </div>
  );
});
