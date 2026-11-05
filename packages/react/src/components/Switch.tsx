import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export const Switch = forwardRef(function Switch(
  { checked, defaultChecked = false, onCheckedChange, label, className, ...rest }: SwitchProps,
  ref: Ref<HTMLButtonElement>,
) {
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      className={cx('pm-switch', className)}
      onClick={() => setValue(!value)}
      {...rest}
    >
      <span className="pm-switch__knob" aria-hidden />
    </button>
  );
});
