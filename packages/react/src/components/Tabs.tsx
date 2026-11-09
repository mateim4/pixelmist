import { createContext, useContext, forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode, Ref } from 'react';
import { cx, useControllableState, useId } from '@pixelmist/core';

export type TabsVariant = 'pill' | 'underline';

interface TabsContextValue {
  variant: TabsVariant;
  value: string;
  setValue: (v: string) => void;
  tabRefs: React.MutableRefObject<Map<string, HTMLButtonElement | null>>;
  registerTab: (value: string, el: HTMLButtonElement | null) => void;
  rootId: string;
}
const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  variant?: TabsVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children?: ReactNode;
}

const TabsRoot = forwardRef(function TabsRoot(
  {
    variant = 'pill',
    value,
    defaultValue = '',
    onValueChange,
    className,
    children,
    ...rest
  }: TabsProps,
  ref: Ref<HTMLDivElement>,
) {
  const [current, setCurrent] = useControllableState<string>(value, defaultValue, onValueChange);
  const tabRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const rootId = useId();
  const registerTab = useCallback((v: string, el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(v, el);
    else tabRefs.current.delete(v);
  }, []);
  return (
    <TabsContext.Provider value={{ variant, value: current, setValue: setCurrent, tabRefs, registerTab, rootId }}>
      <div ref={ref} className={cx('pm-tabs', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}
const TabsList = forwardRef(function TabsList({ className, children, onKeyDown, ...rest }: TabsListProps, ref: Ref<HTMLDivElement>) {
  const ctx = useContext(TabsContext);
  const variant = ctx?.variant ?? 'pill';
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // slide the underline indicator to the selected tab (Vercel-style)
  useEffect(() => {
    if (!ctx || variant !== 'underline') return;
    const measure = () => {
      const el = ctx.tabRefs.current.get(ctx.value);
      const list = el?.parentElement;
      if (el && list) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ctx, ctx?.value, variant]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!ctx) return;
    const values = [...ctx.tabRefs.current.keys()];
    const idx = values.indexOf(ctx.value);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? (idx + 1) % values.length : (idx - 1 + values.length) % values.length;
      const v = values[next];
      if (v !== undefined) {
        ctx.setValue(v);
        ctx.tabRefs.current.get(v)?.focus();
      }
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const v = e.key === 'Home' ? values[0] : values[values.length - 1];
      if (v !== undefined) {
        ctx.setValue(v);
        ctx.tabRefs.current.get(v)?.focus();
      }
    }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      className={cx('pm-tabs__list', `pm-tabs__list--${variant}`, className)}
      onKeyDown={onKey}
      {...rest}
    >
      {children}
      {variant === 'underline' && indicator ? (
        <span
          className="pm-tabs__indicator"
          style={{
            transform: `translateX(calc(var(--pm-motion-travel) * ${indicator.left}px))`,
            width: indicator.width,
          }}
          aria-hidden
        />
      ) : null}
    </div>
  );
});

export interface TabsTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
}
const TabsTab = forwardRef(function TabsTab(
  { value, className, onClick, id, ...rest }: TabsTabProps,
  ref: Ref<HTMLButtonElement>,
) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.Tab must be used inside <Tabs>');
  const selected = ctx.value === value;
  const tabId = id ?? `${ctx.rootId}-tab-${value}`;
  return (
    <button
      ref={(el) => {
        ctx.registerTab(value, el);
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      }}
      type="button"
      role="tab"
      id={tabId}
      aria-controls={`${ctx.rootId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      aria-selected={selected}
      className={cx('pm-tab', `pm-tab--${ctx.variant}`, selected && 'is-selected', className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setValue(value);
      }}
      {...rest}
    />
  );
});

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}
/** Tab panel: role="tabpanel", labelled by its tab, hidden when not selected. */
const TabsPanel = forwardRef(function TabsPanel({ value, className, children, ...rest }: TabsPanelProps, ref: Ref<HTMLDivElement>) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.Panel must be used inside <Tabs>');
  const selected = ctx.value === value;
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${ctx.rootId}-panel-${value}`}
      aria-labelledby={`${ctx.rootId}-tab-${value}`}
      tabIndex={0}
      hidden={!selected}
      className={cx('pm-tabs__panel', className)}
      {...rest}
    >
      {selected ? children : null}
    </div>
  );
});

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab: TabsTab, Panel: TabsPanel });
