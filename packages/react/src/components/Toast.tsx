import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@pixelmist/core';
import type { BadgeTone } from './Badge';
import { Icon } from './Icon';
import type { IconName } from '@pixelmist/icons';

export type ToastTone = Exclude<BadgeTone, 'neutral'> | 'neutral';

export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** ms until auto-dismiss; 0 = sticky. */
  duration?: number;
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

export function ToastProvider({ children, /** max visible toasts */ max = 4 }: { children?: ReactNode; max?: number }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    const timer = setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 180);
    timers.current.set(id, timer);
  }, []);

  const push = useCallback(
    (t: ToastInput) => {
      const id = ++idRef.current;
      setItems((list) => [...list.slice(-(max - 1)), { ...t, id, leaving: false }]);
      const duration = t.duration ?? 4200;
      if (duration > 0)
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      return id;
    },
    [dismiss, max],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pm-toast-root" role="region" aria-label="Notifications" aria-live="polite">
          {items.map((t) => (
            <div key={t.id} className={cx('pm-toast', t.leaving && 'is-leaving')} data-tone={t.tone ?? 'neutral'}>
              <span className="pm-toast__icon">
                <Icon name={toneIcon[t.tone ?? 'neutral']} size={16} />
              </span>
              <span className="pm-toast__content">
                <span className="pm-toast__title">{t.title}</span>
                {t.description ? <span className="pm-toast__description">{t.description}</span> : null}
              </span>
              <button className="pm-toast__close" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
                ×
              </button>
              {(t.duration ?? 4200) > 0 ? (
                <span
                  className="pm-toast__progress"
                  style={{ animationDuration: `${t.duration ?? 4200}ms` }}
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
