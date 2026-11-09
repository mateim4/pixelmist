import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@pixelmist/core';
import type { BadgeTone } from './Badge';
import { Icon } from './Icon';
import type { IconName } from '@pixelmist/icons';

export type ToastTone = Exclude<BadgeTone, 'neutral'> | 'neutral';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** ms until auto-dismiss; 0 = sticky. Pauses on hover/focus (WCAG 2.2.1). */
  duration?: number;
  /** Icon override (e.g. 'trophy' for achievements). */
  icon?: IconName;
  /** Optional action button. */
  action?: ToastAction;
}
interface ToastItem extends ToastInput {
  id: number;
  leaving: boolean;
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

export interface ToastProviderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** max visible toasts */
  max?: number;
}

/**
 * Toast region (portal). Auto-dismiss pauses while the pointer is over a toast or focus
 * is inside it; timers are cleaned up on unmount. Danger toasts use role="alert",
 * everything else role="status" via the polite live region.
 * forwardRef + prop pass-through to the region element.
 */
export const ToastProvider = forwardRef(function ToastProvider(
  { children, max = 4, className, ...rest }: ToastProviderProps,
  ref: Ref<HTMLDivElement>,
) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  // remaining ms per toast, for pause/resume on hover/focus
  const remaining = useRef<Map<number, number>>(new Map());
  const startedAt = useRef<Map<number, number>>(new Map());

  const clearTimer = (id: number) => {
    const t = timers.current.get(id);
    if (t !== undefined) clearTimeout(t);
    timers.current.delete(id);
  };

  const dismiss = useCallback((id: number) => {
    clearTimer(id);
    setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    const timer = setTimeout(() => {
      setItems((list) => list.filter((t) => t.id !== id));
      timers.current.delete(id);
      remaining.current.delete(id);
      startedAt.current.delete(id);
    }, 180);
    timers.current.set(id, timer);
  }, []);

  const pause = useCallback((id: number, duration: number) => {
    if (!timers.current.has(id)) return;
    clearTimer(id);
    remaining.current.set(id, Math.max(0, duration - (Date.now() - (startedAt.current.get(id) ?? Date.now()))));
  }, []);

  const resume = useCallback(
    (id: number) => {
      const left = remaining.current.get(id);
      if (left === undefined || left <= 0) return;
      startedAt.current.set(id, Date.now());
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), left),
      );
    },
    [dismiss],
  );

  const push = useCallback(
    (t: ToastInput) => {
      const id = ++idRef.current;
      setItems((list) => [...list.slice(-(max - 1)), { ...t, id, leaving: false }]);
      const duration = t.duration ?? 4200;
      if (duration > 0) {
        startedAt.current.set(id, Date.now());
        remaining.current.set(id, duration);
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss, max],
  );

  // no timer leaks on unmount
  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((t) => clearTimeout(t));
      timersMap.clear();
    };
  }, []);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div ref={ref} className={cx('pm-toast-root', className)} role="region" aria-label="Notifications" aria-live="polite" {...rest}>
          {items.map((t) => {
            const duration = t.duration ?? 4200;
            return (
              <div
                key={t.id}
                className={cx('pm-toast', t.leaving && 'is-leaving')}
                data-tone={t.tone ?? 'neutral'}
                role={t.tone === 'danger' ? 'alert' : undefined}
                onMouseEnter={() => pause(t.id, duration)}
                onMouseLeave={() => resume(t.id)}
                onFocus={() => pause(t.id, duration)}
                onBlur={() => resume(t.id)}
              >
                <span className="pm-toast__icon">
                  <Icon name={t.icon ?? toneIcon[t.tone ?? 'neutral']} size={16} />
                </span>
                <span className="pm-toast__content">
                  <span className="pm-toast__title">{t.title}</span>
                  {t.description ? <span className="pm-toast__description">{t.description}</span> : null}
                  {t.action ? (
                    <button type="button" className="pm-toast__action" onClick={t.action.onClick}>
                      {t.action.label}
                    </button>
                  ) : null}
                </span>
                <button className="pm-toast__close" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
                  ×
                </button>
                {duration > 0 ? (
                  <span
                    className="pm-toast__progress"
                    style={{ animationDuration: `${duration}ms` }}
                    aria-hidden
                  />
                ) : null}
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
});

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
