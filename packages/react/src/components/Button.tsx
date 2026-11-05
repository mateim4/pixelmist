import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import type { Size } from '@pixelmist/core';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'cream' | 'link';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  children?: ReactNode;
}

/** Mistral-style action button: radius md (8px), 10px/20px padding, 44px min height. */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    children,
    type = 'button',
    ...rest
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('pm-btn', `pm-btn--${variant}`, `pm-btn--${size}`, fullWidth && 'pm-btn--full', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="pm-btn__spinner" aria-hidden />
      ) : leftIcon ? (
        <Icon name={leftIcon} size={16} />
      ) : null}
      {children ? <span className="pm-btn__label">{children}</span> : null}
      {rightIcon && !loading ? <Icon name={rightIcon} size={16} /> : null}
    </button>
  );
});
