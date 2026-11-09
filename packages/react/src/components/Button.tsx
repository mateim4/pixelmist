import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import type { Size } from '@pixelmist/core';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'cream' | 'link' | 'ghost' | 'tertiary' | 'danger' | 'dangerTertiary';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** Icon-only button: renders just `icon`. `label` is then the required accessible name. */
  icon?: IconName;
  /** Accessible name for an icon-only button (required when `icon` is set without children). */
  label?: string;
  /** Tooltip shown on hover/focus (also for icon-only buttons). */
  tooltip?: string;
  children?: ReactNode;
}

/**
 * Action button: radius md (8px), density sm 32 / md 40 / lg 48 px tall.
 * Variants: primary, secondary, dark, cream, link, ghost, tertiary (outline),
 * danger (filled), dangerTertiary (outline). Icon-only via `icon` + `label` (+ optional `tooltip`).
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    icon,
    label,
    tooltip,
    className,
    disabled,
    children,
    type = 'button',
    ...rest
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  const iconOnly = Boolean(icon) && !children;
  if (iconOnly && !label && !rest['aria-label']) {
    // An icon-only button without an accessible name is unusable — fail loudly in dev.
    console.warn('pixelmist Button: icon-only button requires `label` (or aria-label) for an accessible name.');
  }
  const button = (
    <button
      ref={ref}
      type={type}
      className={cx(
        'pm-btn',
        `pm-btn--${variant}`,
        `pm-btn--${size}`,
        fullWidth && 'pm-btn--full',
        iconOnly && 'pm-btn--icon-only',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={iconOnly ? label ?? rest['aria-label'] : rest['aria-label']}
      {...rest}
    >
      {loading ? (
        <span className="pm-btn__spinner" aria-hidden />
      ) : (
        (icon ?? leftIcon) && <Icon name={(icon ?? leftIcon)!} size={size === 'sm' ? 14 : 16} />
      )}
      {children ? <span className="pm-btn__label">{children}</span> : null}
      {rightIcon && !loading ? <Icon name={rightIcon} size={size === 'sm' ? 14 : 16} /> : null}
    </button>
  );
  return tooltip ? <Tooltip label={tooltip}>{button}</Tooltip> : button;
});
