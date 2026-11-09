import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, Ref } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@pixelmist/core';
import type { IconName } from '@pixelmist/icons';
import { Icon } from './Icon';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: IconName;
  hint?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  /** Listen for Cmd/Ctrl+K to toggle. */
  hotkey?: boolean;
}

/** ⌘K command palette — the harness launcher. */
export const Command = forwardRef(function Command({ open, onOpenChange, items, placeholder = 'Type a command…', hotkey = true, className, ...rest }: CommandProps, ref: Ref<HTMLDivElement>) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [closing, setClosing] = useState(false);
  const [render, setRender] = useState(open);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setClosing(true);
      const t = setTimeout(() => {
        setRender(false);
        setClosing(false);
      }, 140);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q) || i.group?.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const select = (item: CommandItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    onOpenChange?.(false);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      const item = filtered[active];
      if (item) select(item);
    } else if (e.key === 'Escape') {
      onOpenChange?.(false);
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active]);

  if (!render) return null;
  const groups = new Map<string, CommandItem[]>();
  for (const item of filtered) {
    const g = item.group ?? '';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(item);
  }

  return createPortal(
    <div
      className={cx('pm-command__backdrop', closing && 'is-closing')}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange?.(false);
      }}
    >
      <div
        ref={ref}
        className={cx('pm-command', closing && 'is-closing', className)}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        {...rest}
      >
        <div className="pm-command__input-row">
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            className="pm-command__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            role="combobox"
            aria-expanded="true"
            aria-controls="pm-command-list"
            aria-activedescendant={`pm-command-item-${active}`}
          />
          <kbd className="pm-command__kbd">esc</kbd>
        </div>
        <div className="pm-command__list" id="pm-command-list" role="listbox" ref={listRef}>
          {filtered.length === 0 ? <div className="pm-command__empty">No results</div> : null}
          {[...groups.entries()].map(([group, list]) => (
            <div key={group || 'default'} className="pm-command__group">
              {group ? <div className="pm-command__group-label">{group}</div> : null}
              {list.map((item) => {
                const idx = filtered.indexOf(item);
                return (
                  <button
                    key={item.id}
                    id={`pm-command-item-${idx}`}
                    data-idx={idx}
                    role="option"
                    aria-selected={idx === active}
                    className={cx('pm-command__item', idx === active && 'is-active')}
                    disabled={item.disabled}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => select(item)}
                  >
                    {item.icon ? <Icon name={item.icon} size={16} /> : null}
                    <span className="pm-command__label">{item.label}</span>
                    {item.hint ? <kbd className="pm-command__kbd">{item.hint}</kbd> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
});
