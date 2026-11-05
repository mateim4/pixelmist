import { createContext, useContext, forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';

export type TabsVariant = 'pill' | 'underline';

interface TabsContextValue {
  variant: TabsVariant;
  value: string;
  setValue: (v: string) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  variant?: TabsVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children?: ReactNode;
}

function TabsRoot({ variant = 'pill', value, defaultValue = '', onValueChange, className, children, ...rest }: TabsProps) {
  const [current, setCurrent] = useControllableState<string>(value, defaultValue, onValueChange);
  return (
    <TabsContext.Provider value={{ variant, value: current, setValue: setCurrent }}>
      <div className={cx('pm-tabs', className)} {...rest}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}
function TabsList({ className, ...rest }: TabsListProps) {
  const ctx = useContext(TabsContext);
  return <div role="tablist" className={cx('pm-tabs__list', `pm-tabs__list--${ctx?.variant ?? 'pill'}`, className)} {...rest} />;
}

export interface TabsTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
}
const TabsTab = forwardRef(function TabsTab({ value, className, onClick, ...rest }: TabsTabProps, ref: Ref<HTMLButtonElement>) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.Tab must be used inside <Tabs>');
  const selected = ctx.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={selected}
      className={cx('pm-tab', `pm-tab--${ctx.variant}`, selected && 'is-selected', className)}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) ctx.setValue(value); }}
      {...rest}
    />
  );
});

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab: TabsTab });
