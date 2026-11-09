import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Indeterminate (aria-checked="mixed") — e.g. a parent of partially-selected children. */
  indeterminate?: boolean;
  label?: string;
  hint?: string;
  error?: string;
}

export const Checkbox = forwardRef(function Checkbox(
  { checked, defaultChecked = false, onCheckedChange, indeterminate = false, label, hint, error, className, disabled, id, ...rest }: CheckboxProps,
  ref: Ref<HTMLButtonElement>,
) {
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  const autoId = useId();
  const btnId = id ?? autoId;
  const msgId = `${btnId}-msg`;
  const hasError = Boolean(error);
  const message = hasError ? error : hint;
  return (
    <div className={cx('pm-field', hasError && 'pm-field--error', className)}>
      <button
        ref={ref}
        id={btnId}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : value}
        aria-invalid={hasError || undefined}
        aria-describedby={message ? msgId : undefined}
        disabled={disabled}
        className={cx('pm-checkbox', indeterminate && 'is-indeterminate')}
        onClick={() => setValue(indeterminate ? true : !value)}
        {...rest}
      >
        <span className={cx('pm-checkbox__box', (value || indeterminate) && 'is-checked')} aria-hidden>
          {indeterminate ? <span className="pm-checkbox__dash" /> : <Icon name="check" size={12} strokeWidth={3} />}
        </span>
        {label ? <span className="pm-checkbox__label">{label}</span> : null}
      </button>
      {message ? (
        <p className={cx('pm-field__message', hasError && 'pm-field__message--error')} id={msgId} role={hasError ? 'alert' : undefined}>
          {message}
        </p>
      ) : null}
    </div>
  );
});
