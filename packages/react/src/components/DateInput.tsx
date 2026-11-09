import { forwardRef } from 'react';
import type { InputHTMLAttributes, Ref } from 'react';
import type { Size } from '@pixelmist/core';
import { cx, useId } from '@pixelmist/core';

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  warning?: string;
  size?: Size;
  /** ISO YYYY-MM-DD. */
  value?: string;
}

/** Styled native date input. Value is ISO YYYY-MM-DD. */
export const DateInput = forwardRef(function DateInput(
  { label, hideLabel = false, hint, error, warning, size = 'md', className, id, ...rest }: DateInputProps,
  ref: Ref<HTMLInputElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;
  return (
    <div className={cx('pm-field', `pm-field--${size}`, hasError && 'pm-field--error', hasWarning && 'pm-field--warning', className)}>
      {label ? (
        <label className={cx('pm-field__label', hideLabel && 'pm-sr-only')} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="pm-field__control">
        <input
          ref={ref}
          id={inputId}
          type="date"
          className="pm-field__input pm-date__input"
          aria-invalid={hasError || undefined}
          aria-describedby={message ? msgId : undefined}
          {...rest}
        />
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
