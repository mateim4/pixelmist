import { forwardRef } from 'react';
import type { InputHTMLAttributes, KeyboardEvent, Ref } from 'react';
import type { Size } from '@pixelmist/core';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  /** Accessible label (visually hidden when `label` is omitted). */
  label?: string;
  size?: Size;
  /** Show the clear button (default: shown whenever there is a value). */
  clearable?: boolean;
  onClear?: () => void;
}

/**
 * Search field: role="search", search icon, clear button, Escape clears.
 * Controlled (value/onValueChange) or uncontrolled (defaultValue).
 */
export const Search = forwardRef(function Search(
  {
    value,
    defaultValue,
    onValueChange,
    label = 'Search',
    size = 'md',
    clearable = true,
    onClear,
    className,
    id,
    onChange,
    onKeyDown,
    ...rest
  }: SearchProps,
  ref: Ref<HTMLInputElement>,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [current, setCurrent] = useControllableState<string>(value, defaultValue ?? '', (v) => {
    onValueChange?.(v);
  });

  const clear = () => {
    setCurrent('');
    onClear?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value);
    onChange?.(e);
  };
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && current) {
      e.preventDefault();
      clear();
    }
    onKeyDown?.(e);
  };

  return (
    <div role="search" className={cx('pm-search', `pm-search--${size}`, className)}>
      <label className="pm-sr-only" htmlFor={inputId}>
        {label}
      </label>
      <span className="pm-search__icon" aria-hidden>
        <Icon name="search" size={16} />
      </span>
      <input
        ref={ref}
        id={inputId}
        type="search"
        className="pm-search__input"
        value={current}
        onChange={handleChange}
        onKeyDown={handleKey}
        {...rest}
      />
      {clearable && current ? (
        <button type="button" className="pm-search__clear" aria-label="Clear search" onClick={clear}>
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
});
