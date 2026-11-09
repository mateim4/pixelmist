import { forwardRef } from 'react';
import type { TextareaHTMLAttributes, Ref } from 'react';
import { cx, useId } from '@pixelmist/core';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  warning?: string;
  /** Show a character counter against maxLength. */
  showCount?: boolean;
}

export const TextArea = forwardRef(function TextArea(
  { label, hideLabel = false, hint, error, warning, showCount = false, maxLength, className, id, value, defaultValue, ...rest }: TextAreaProps,
  ref: Ref<HTMLTextAreaElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;
  const len = (typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0);
  return (
    <div className={cx('pm-field', hasError && 'pm-field--error', hasWarning && 'pm-field--warning', className)}>
      {label ? (
        <label className={cx('pm-field__label', hideLabel && 'pm-sr-only')} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        className="pm-field__input pm-field__textarea"
        aria-invalid={hasError || undefined}
        aria-describedby={message ? msgId : undefined}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        {...rest}
      />
      <div className="pm-field__footer">
        {message ? (
          <p
            className={cx('pm-field__message', hasError && 'pm-field__message--error', hasWarning && 'pm-field__message--warning')}
            id={msgId}
            role={hasError ? 'alert' : undefined}
          >
            {message}
          </p>
        ) : null}
        {showCount && maxLength ? (
          <span className="pm-field__count" aria-hidden>
            {len}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
});
