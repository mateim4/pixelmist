import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';
import { Icon } from './Icon';

export interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export const Checkbox = forwardRef(function Checkbox(
  { checked, defaultChecked = false, onCheckedChange, label, className, disabled, ...rest }: CheckboxProps,
  ref: Ref<HTMLButtonElement>,
) {
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={value}
      disabled={disabled}
      className={cx('pm-checkbox', className)}
      onClick={() => setValue(!value)}
      {...rest}
    >
      <span className={cx('pm-checkbox__box', value && 'is-checked')} aria-hidden>
        <Icon name="check" size={12} strokeWidth={3} />
      </span>
      {label ? <span className="pm-checkbox__label">{label}</span> : null}
    </button>
  );
});
