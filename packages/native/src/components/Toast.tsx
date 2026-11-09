import { createContext, forwardRef, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';
import type { IconName } from '@pixelmist/icons';

export type ToastTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';
export interface ToastAction {
  label: string;
  onClick: () => void;
}
export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  duration?: number;
  /** Icon override (e.g. 'trophy' for achievements). */
  icon?: IconName;
  /** Optional action button. */
  action?: ToastAction;
}
interface ToastItem extends ToastInput {
  id: number;
}
interface ToastContextValue {
  push: (t: ToastInput) => number;
  dismiss: (id: number) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);
const toneIcon: Record<ToastTone, IconName> = {
  neutral: 'info',
  success: 'check',
  info: 'info',
  warning: 'alert',
  danger: 'alert',
};
const toneColor = (t: any, tone: ToastTone): string =>
  tone === 'neutral' ? t.color.accent.primary : t.color.status[tone as 'success' | 'info' | 'warning' | 'danger'];

export const ToastProvider = forwardRef<View, { children?: ReactNode; max?: number } & ViewProps>(function ToastProvider({ children, max = 4, ...rest }: { children?: ReactNode; max?: number } & ViewProps, ref: Ref<View>) {
  const { resolved: t } = useTheme();
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current[id]);
    setItems((list) => list.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = ++idRef.current;
      setItems((list) => [...list.slice(-(max - 1)), { ...toast, id }]);
      const duration = toast.duration ?? 4200;
      if (duration > 0) timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss, max],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        ref={ref}
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          right: space(t, 'lg'),
          bottom: space(t, 'lg'),
          width: 320,
          maxWidth: '90%',
          gap: space(t, 'sm'),
          zIndex: t.layout.zIndex.toast,
          elevation: 8,
        }}
        accessibilityLiveRegion="polite"
        {...rest}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              gap: space(t, 'sm'),
              alignItems: 'flex-start',
              backgroundColor: t.color.bg.raised,
              borderRadius: t.radius.md,
              borderWidth: 1,
              borderColor: t.color.border.default,
              borderLeftWidth: 3,
              borderLeftColor: toneColor(t, item.tone ?? 'neutral'),
              padding: space(t, 'md'),
              elevation: 6,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            <Icon name={item.icon ?? toneIcon[item.tone ?? 'neutral']} size={16} color={toneColor(t, item.tone ?? 'neutral')} />
            <View style={{ flex: 1 }}>
              <Text variant="body-sm-medium">{item.title}</Text>
              {item.description ? (
                <Text variant="caption" tone="muted">
                  {item.description}
                </Text>
              ) : null}
              {item.action ? (
                <Pressable accessibilityRole="button" onPress={item.action.onClick} hitSlop={8} style={{ minHeight: 24, alignSelf: 'flex-start' }}>
                  <Text variant="caption" style={{ fontWeight: '600', color: t.color.accent.primary, textDecorationLine: 'underline' }}>
                    {item.action.label}
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss"
              onPress={() => dismiss(item.id)}
              hitSlop={8}
            >
              <Text variant="body-sm" tone="subtle">
                ×
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
});

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
