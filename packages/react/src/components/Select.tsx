import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/** Custom dropdown select (no native <select> styling fights). Keyboard: arrows/enter/escape. */
export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = 'Select…',
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const selected = options.find((o) => o.value === current);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (open)
      setActive(
        Math.max(
          0,
          options.findIndex((o) => o.value === current),
        ),
      );
  }, [open, options, current]);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
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
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[active];
      if (opt && !opt.disabled) {
        setCurrent(opt.value);
        setOpen(false);
      }
    }
  };

  return (
    <div className={cx('pm-field', className)} ref={rootRef}>
      {label ? (
        <span className="pm-field__label" id={`${id}-label`}>
          {label}
        </span>
      ) : null}
      <button
        type="button"
        className={cx('pm-select__trigger', open && 'is-open', error && 'pm-field--error')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-invalid={Boolean(error) || undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <span className={cx('pm-select__value', !selected && 'is-placeholder')}>{selected?.label ?? placeholder}</span>
        <Icon name="chevron-down" size={16} className={cx('pm-select__chevron', open && 'is-open')} />
      </button>
      {error ? (
        <p className="pm-field__message pm-field__message--error" role="alert">
          {error}
        </p>
      ) : null}
      {open ? (
        <div
          className="pm-select__list"
          role="listbox"
          ref={listRef}
          aria-activedescendant={options[active] ? `${id}-opt-${active}` : undefined}
        >
          {options.map((opt, i) => (
            <button
              key={opt.value}
              id={`${id}-opt-${i}`}
              type="button"
              role="option"
              aria-selected={opt.value === current}
              className={cx('pm-select__option', i === active && 'is-active', opt.value === current && 'is-selected')}
              disabled={opt.disabled}
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
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
