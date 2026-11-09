import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export type NotificationTone = 'error' | 'warning' | 'success' | 'info';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface InlineNotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone: NotificationTone;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Show a close button. */
  onClose?: () => void;
  closeLabel?: string;
  action?: NotificationAction;
}

const toneIcon: Record<NotificationTone, IconName> = {
  error: 'warning-filled',
  warning: 'warning',
  success: 'check',
  info: 'info',
};

/**
 * Inline notification banner. role="alert" for error, role="status" otherwise.
 * Tone maps to the semantic tones: error→danger, warning→attention, success→settled, info→progress.
 */
export const InlineNotification = forwardRef(function InlineNotification(
  { tone, title, subtitle, onClose, closeLabel = 'Dismiss notification', action, className, ...rest }: InlineNotificationProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={cx('pm-notif', `pm-notif--${tone}`, className)}
      role={tone === 'error' ? 'alert' : 'status'}
      data-tone={tone}
      {...rest}
    >
      <span className="pm-notif__icon" aria-hidden>
        <Icon name={toneIcon[tone]} size={18} />
      </span>
      <div className="pm-notif__body">
        <p className="pm-notif__title">{title}</p>
        {subtitle ? <p className="pm-notif__subtitle">{subtitle}</p> : null}
        {action ? (
          <button type="button" className="pm-notif__action" onClick={action.onClick}>
            {action.label}
          </button>
        ) : null}
      </div>
      {onClose ? (
        <button type="button" className="pm-notif__close" aria-label={closeLabel} onClick={onClose}>
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
});
