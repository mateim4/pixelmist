import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@pixelmist/core';

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Footer actions (buttons). */
  actions?: ReactNode;
  /** Called when the user presses Escape / clicks the backdrop. Default: onOpenChange(false). */
  onClose?: () => void;
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';
const EXIT_MS = 160;

/** Modal dialog: portal, backdrop, focus trap, Escape, animated enter/exit. */
export function Dialog({ open, onOpenChange, title, description, children, actions, onClose }: DialogProps) {
  const [render, setRender] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<Element | null>(null);

  const close = () => {
    if (onClose) onClose();
    else onOpenChange?.(false);
  };

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      restoreRef.current = document.activeElement;
      const t = setTimeout(() => {
        const panel = panelRef.current;
        const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panel)?.focus();
      }, 30);
      return () => clearTimeout(t);
    }
    // exit animation, then unmount
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
      (restoreRef.current as HTMLElement | null)?.focus?.();
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = '';
    };
  }, [render]);

  if (!render) return null;
  return createPortal(
    <div
      className={cx('pm-dialog__backdrop', closing && 'is-closing')}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        className={cx('pm-dialog', closing && 'is-closing')}
      >
        {title ? (
          <div className="pm-dialog__header">
            <h2 className="pm-dialog__title">{title}</h2>
          </div>
        ) : null}
        {description ? <p className="pm-dialog__description">{description}</p> : null}
        <div className="pm-dialog__body">{children}</div>
        {actions ? <div className="pm-dialog__actions">{actions}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
