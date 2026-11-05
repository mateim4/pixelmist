import { createContext, forwardRef, useContext } from 'react';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';

interface RadioGroupContextValue {
  value?: string;
  setValue: (v: string) => void;
  name?: string;
}
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  name?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

export function RadioGroup({ value, defaultValue, onValueChange, name, label, children, className }: RadioGroupProps) {
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  return (
    <RadioGroupContext.Provider value={{ value: current, setValue: setCurrent, name }}>
      <div role="radiogroup" aria-label={label} className={cx('pm-radio-group', className)}>
        {label ? <span className="pm-field__label">{label}</span> : null}
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  value: string;
  label?: string;
}

export const Radio = forwardRef(function Radio(
  { value, label, className, disabled, ...rest }: RadioProps,
  ref: Ref<HTMLButtonElement>,
) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error('Radio must be used inside <RadioGroup>');
  const checked = ctx.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      className={cx('pm-radio', className)}
      onClick={() => ctx.setValue(value)}
      {...rest}
    >
      <span className={cx('pm-radio__dot', checked && 'is-checked')} aria-hidden />
      {label ? <span className="pm-checkbox__label">{label}</span> : null}
    </button>
  );
});
