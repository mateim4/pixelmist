import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { InputHTMLAttributes, KeyboardEvent, Ref } from 'react';
import type { Size } from '@pixelmist/core';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface ComboBoxProps<T = string> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onSelect'> {
  items: T[];
  itemToString: (item: T) => string;
  /** Input text (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  /** Called when an option is chosen (Enter/click). */
  onSelect?: (item: T) => void;
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  warning?: string;
  size?: Size;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * ComboBox — APG combobox pattern: input role="combobox" (aria-expanded, aria-controls,
 * aria-activedescendant, aria-autocomplete="list"), type-to-filter, ArrowUp/Down/Home/End
 * navigate, Enter selects, Escape closes. Controlled or uncontrolled input text.
 */
function ComboBoxInner<T = string>(
  {
    items,
    itemToString,
    value,
    defaultValue,
    onValueChange,
    onSelect,
    label,
    hideLabel = false,
    hint,
    error,
    warning,
    size = 'md',
    placeholder,
    disabled,
    className,
    id,
    onKeyDown,
    onChange,
    ...rest
  }: ComboBoxProps<T>,
  ref: Ref<HTMLInputElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const listId = `${inputId}-list`;
  const msgId = `${inputId}-msg`;
  const [query, setQuery] = useControllableState<string>(value, defaultValue ?? '', onValueChange);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => itemToString(item).toLowerCase().includes(q));
  }, [items, itemToString, query]);

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
    if (open) setActive(0);
  }, [open, query]);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const choose = (item: T) => {
    setQuery(itemToString(item));
    onSelect?.(item);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Home' && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End' && open) {
      e.preventDefault();
      setActive(filtered.length - 1);
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      const item = filtered[active];
      if (item !== undefined) choose(item);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cx('pm-field', `pm-field--${size}`, hasError && 'pm-field--error', hasWarning && 'pm-field--warning', className)}
    >
      {label ? (
        <label className={cx('pm-field__label', hideLabel && 'pm-sr-only')} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="pm-field__control">
        <input
          ref={ref}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] !== undefined ? `${inputId}-opt-${active}` : undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? msgId : undefined}
          className="pm-field__input pm-combobox__input"
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange?.(e);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          {...rest}
        />
        <span className="pm-field__icon pm-field__icon--right" aria-hidden>
          <Icon name="chevron-down" size={16} className={cx('pm-select__chevron', open && 'is-open')} />
        </span>
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
      {open ? (
        <div className="pm-select__list pm-combobox__list" role="listbox" id={listId} ref={listRef}>
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              // options are not focusable: the input owns aria-activedescendant (APG combobox)
              <div
                key={`${inputId}-opt-${i}`}
                id={`${inputId}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={cx('pm-select__option', i === active && 'is-active')}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(item)}
              >
                {itemToString(item)}
              </div>
            ))
          ) : (
            <div className="pm-select__option is-empty" role="option" aria-selected={false} aria-disabled>
              No results
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** forwardRef erases generics — re-expose the typed signature. */
export const ComboBox = forwardRef(ComboBoxInner) as <T = string>(
  props: ComboBoxProps<T> & { ref?: Ref<HTMLInputElement> },
) => React.ReactElement;
