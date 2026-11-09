import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, Ref } from 'react';
import type { Size } from '@pixelmist/core';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T = SelectOption> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  /** Simple options (label/value). Prefer `items` + `itemToString` for typed data. */
  options?: SelectOption[];
  /** Typed items API. */
  items?: T[];
  itemToString?: (item: T) => string;
  itemToValue?: (item: T) => string;
  placeholder?: string;
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  warning?: string;
  size?: Size;
  disabled?: boolean;
}

/**
 * Custom listbox select. Keyboard: arrows/enter/escape/home/end. Controlled or
 * uncontrolled. Typed `items` + `itemToString` API alongside `options`.
 */
function SelectInner<T = SelectOption>(
  {
    value,
    defaultValue,
    onValueChange,
    options,
    items,
    itemToString,
    itemToValue,
    placeholder = 'Select…',
    label,
    hideLabel = false,
    hint,
    error,
    warning,
    size = 'md',
    disabled,
    className,
    id,
    ...rest
  }: SelectProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const rootId = id ?? autoId;
  const msgId = `${rootId}-msg`;
  const listId = `${rootId}-list`;

  const opts: SelectOption[] = useMemo(
    () =>
      options ??
      (items ?? []).map((item) => ({
        value: itemToValue ? itemToValue(item) : itemToString!(item),
        label: itemToString!(item),
      })),
    [options, items, itemToString, itemToValue],
  );
  const selected = opts.find((o) => o.value === current);
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (open) setActive(Math.max(0, opts.findIndex((o) => o.value === current)));
  }, [open, opts, current]);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, opts.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(opts.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = opts[active];
      if (opt && !opt.disabled) {
        setCurrent(opt.value);
        setOpen(false);
      }
    }
  };

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={cx('pm-field', `pm-field--${size}`, hasError && 'pm-field--error', hasWarning && 'pm-field--warning', className)}
      id={rootId}
      {...rest}
    >
      {label ? (
        <span className={cx('pm-field__label', hideLabel && 'pm-sr-only')} id={`${rootId}-label`}>
          {label}
        </span>
      ) : null}
      <button
        type="button"
        className={cx('pm-select__trigger', open && 'is-open')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && opts[active] ? `${rootId}-opt-${active}` : undefined}
        aria-labelledby={label ? `${rootId}-label` : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={message ? msgId : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <span className={cx('pm-select__value', !selected && 'is-placeholder')}>{selected?.label ?? placeholder}</span>
        <Icon name="chevron-down" size={16} className={cx('pm-select__chevron', open && 'is-open')} />
      </button>
      {message ? (
        <p
          className={cx('pm-field__message', hasError && 'pm-field__message--error', hasWarning && 'pm-field__message--warning')}
          id={msgId}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </p>
      ) : null}
      {open ? (
        <div
          className="pm-select__list"
          role="listbox"
          id={listId}
          ref={listRef}
          aria-labelledby={label ? `${rootId}-label` : undefined}
        >
          {opts.map((opt, i) => (
            // options are not focusable: focus stays on the trigger, which owns
            // aria-activedescendant (APG listbox pattern)
            <div
              key={opt.value}
              id={`${rootId}-opt-${i}`}
              role="option"
              aria-selected={opt.value === current}
              aria-disabled={opt.disabled || undefined}
              className={cx('pm-select__option', i === active && 'is-active', opt.value === current && 'is-selected')}
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                if (!opt.disabled) {
                  setCurrent(opt.value);
                  setOpen(false);
                }
              }}
            >
              {opt.label}
              {opt.value === current ? <Icon name="check" size={14} /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** forwardRef erases generics — re-expose the typed signature. */
export const Select = forwardRef(SelectInner) as <T = SelectOption>(
  props: SelectProps<T> & { ref?: Ref<HTMLDivElement> },
) => React.ReactElement;
