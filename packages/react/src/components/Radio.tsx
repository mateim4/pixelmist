import { createContext, forwardRef, useContext } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, Ref } from 'react';
import { cx, useControllableState, useId } from '@pixelmist/core';

interface RadioGroupContextValue {
  value?: string;
  setValue: (v: string) => void;
  name?: string;
}
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  name?: string;
  label?: string;
  hint?: string;
  error?: string;
}

/** Radio group (role="radiogroup") with arrow-key navigation per the APG. forwardRef + pass-through. */
export const RadioGroup = forwardRef(function RadioGroup(
  { value, defaultValue, onValueChange, name, label, hint, error, className, id, onKeyDown, children, ...rest }: RadioGroupProps,
  ref: Ref<HTMLDivElement>,
) {
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  const autoId = useId();
  const rootId = id ?? autoId;
  const msgId = `${rootId}-msg`;
  const hasError = Boolean(error);
  const message = hasError ? error : hint;

  // APG radiogroup: ArrowUp/Left move to the previous radio, ArrowDown/Right to the next,
  // selecting as they go (roving selection within the group).
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const radios = [...(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'))];
    if (radios.length < 2) return;
    const idx = radios.findIndex((r) => r.getAttribute('aria-checked') === 'true');
    e.preventDefault();
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (idx + 1) % radios.length
        : (idx - 1 + radios.length) % radios.length;
    const el = radios[next]!;
    el.click();
    el.focus();
  };

  return (
    <RadioGroupContext.Provider value={{ value: current, setValue: setCurrent, name }}>
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={label ? `${rootId}-label` : rest['aria-labelledby']}
        aria-label={!label ? rest['aria-label'] : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={message ? msgId : undefined}
        className={cx('pm-radio-group', hasError && 'pm-field--error', className)}
        id={rootId}
        onKeyDown={onKey}
        {...rest}
      >
        {label ? (
          <span className="pm-field__label" id={`${rootId}-label`}>
            {label}
          </span>
        ) : null}
        {children}
        {message ? (
          <p className={cx('pm-field__message', hasError && 'pm-field__message--error')} id={msgId} role={hasError ? 'alert' : undefined}>
            {message}
          </p>
        ) : null}
      </div>
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  value: string;
  label?: string;
  hint?: string;
}

export const Radio = forwardRef(function Radio(
  { value, label, hint, className, disabled, id, ...rest }: RadioProps,
  ref: Ref<HTMLButtonElement>,
) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error('Radio must be used inside <RadioGroup>');
  const checked = ctx.value === value;
  const autoId = useId();
  const radioId = id ?? autoId;
  const hintId = `${radioId}-hint`;
  return (
    <button
      ref={ref}
      id={radioId}
      type="button"
      role="radio"
      aria-checked={checked}
      aria-describedby={hint ? hintId : undefined}
      disabled={disabled}
      className={cx('pm-radio', className)}
      onClick={() => ctx.setValue(value)}
      {...rest}
    >
      <span className={cx('pm-radio__dot', checked && 'is-checked')} aria-hidden />
      {label ? <span className="pm-checkbox__label">{label}</span> : null}
      {hint ? (
        <span className="pm-field__message" id={hintId}>
          {hint}
        </span>
      ) : null}
    </button>
  );
});
