import { forwardRef } from 'react';
import type { InputHTMLAttributes, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import type { Size } from '@pixelmist/core';
import { cx, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  /** Visually hide the label (still announced to AT). */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  /** Warning state with its own message (does not set aria-invalid). */
  warning?: string;
  size?: Size;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

/**
 * Text input. Density sm 32 / md 40 / lg 48 px tall. Accent focus ring.
 * error → aria-invalid + role="alert" message; warning → warning-toned message;
 * hint → helper text. All wired with aria-describedby.
 */
export const TextField = forwardRef(function TextField(
  { label, hideLabel = false, hint, error, warning, size = 'md', leftIcon, rightIcon, className, id, ...rest }: TextFieldProps,
  ref: Ref<HTMLInputElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;
  if (!label && !rest['aria-label'] && !rest['aria-labelledby']) {
    // An unlabeled input is unusable — fail loudly in dev.
    console.warn('pixelmist TextField: provide `label` (or aria-label/aria-labelledby) for an accessible name.');
  }
  return (
    <div
      className={cx(
        'pm-field',
        `pm-field--${size}`,
        hasError && 'pm-field--error',
        hasWarning && 'pm-field--warning',
        className,
      )}
    >
      {label ? (
        <label className={cx('pm-field__label', hideLabel && 'pm-sr-only')} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="pm-field__control">
        {leftIcon ? (
          <span className="pm-field__icon pm-field__icon--left" aria-hidden>
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
          aria-describedby={message ? msgId : undefined}
          {...rest}
        />
        {rightIcon ? (
          <span className="pm-field__icon pm-field__icon--right" aria-hidden>
            <Icon name={rightIcon} size={16} />
          </span>
        ) : null}
      </div>
      {message ? (
        <p
          className={cx('pm-field__message', hasError && 'pm-field__message--error', hasWarning && 'pm-field__message--warning')}
          id={msgId}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
});
