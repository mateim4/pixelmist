import { forwardRef } from 'react';
import type { InputHTMLAttributes, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import type { Size } from '@pixelmist/core';
import { cx, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: Size;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

/** 44px text input, 1px strong border, accent focus ring (Mistral focus state). */
export const TextField = forwardRef(function TextField(
  { label, hint, error, size = 'md', leftIcon, rightIcon, className, id, ...rest }: TextFieldProps,
  ref: Ref<HTMLInputElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const hasError = Boolean(error);
  return (
    <div className={cx('pm-field', `pm-field--${size}`, hasError && 'pm-field--error', className)}>
      {label ? (
        <label className="pm-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="pm-field__control">
        {leftIcon ? (
          <span className="pm-field__icon pm-field__icon--left">
            <Icon name={leftIcon} size={16} />
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cx(
            'pm-field__input',
            leftIcon && 'pm-field__input--left-icon',
            rightIcon && 'pm-field__input--right-icon',
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError || hint ? hintId : undefined}
          {...rest}
        />
        {rightIcon ? (
          <span className="pm-field__icon pm-field__icon--right">
            <Icon name={rightIcon} size={16} />
          </span>
        ) : null}
      </div>
      {hasError ? (
        <p className="pm-field__message pm-field__message--error" id={hintId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="pm-field__message" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
