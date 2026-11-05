import { forwardRef } from 'react';
import type { TextareaHTMLAttributes, Ref } from 'react';
import { cx, useId } from '@pixelmist/core';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextArea = forwardRef(function TextArea(
  { label, hint, error, className, id, ...rest }: TextAreaProps,
  ref: Ref<HTMLTextAreaElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const hasError = Boolean(error);
  return (
    <div className={cx('pm-field', hasError && 'pm-field--error', className)}>
      {label ? (
        <label className="pm-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        className="pm-field__input pm-field__textarea"
        aria-invalid={hasError || undefined}
        aria-describedby={hasError || hint ? hintId : undefined}
        {...rest}
      />
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
