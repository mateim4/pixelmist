import { forwardRef, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import type { Size } from '@pixelmist/core';
import { cx, useId } from '@pixelmist/core';
import { Button } from './Button';
import type { ButtonVariant } from './Button';

export interface DialogAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose' | 'title'> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Custom footer (overrides primaryAction/secondaryAction). */
  actions?: ReactNode;
  /** Primary footer action. */
  primaryAction?: DialogAction;
  /** Secondary footer action. */
  secondaryAction?: DialogAction;
  /** Passive dialog: no footer. */
  passive?: boolean;
  /** Danger flavour: the primary action renders as a danger button. */
  danger?: boolean;
  /** sm/md/lg widths. */
  size?: Size;
  /** Close on backdrop click (default true). */
  closeOnOutsideClick?: boolean;
  /** Called whenever the dialog requests close (in addition to onOpenChange(false)). */
  onClose?: () => void;
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';
const EXIT_MS = 160;

/**
 * Modal dialog (replaces Carbon Modal): portal, backdrop, focus trap, Escape, animated
 * enter/exit. Footer with primary/secondary actions, danger flavour, sizes sm/md/lg,
 * passive mode, optional closeOnOutsideClick, loading primary.
 */
export const Dialog = forwardRef(function Dialog(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    actions,
    primaryAction,
    secondaryAction,
    passive = false,
    danger = false,
    size = 'md',
    closeOnOutsideClick = true,
    onClose,
    className,
    ...rest
  }: DialogProps,
  ref: Ref<HTMLDivElement>,
) {
  const [render, setRender] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<Element | null>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  const close = () => {
    onOpenChange?.(false);
    onClose?.();
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
        if (!items.length) {
          e.preventDefault();
          panel.focus();
          return;
        }
        const first = items[0]!;
        const last = items[items.length - 1]!;
        const active = document.activeElement;
        if (!panel.contains(active)) {
          // focus escaped the panel (e.g. to the browser chrome): pull it back in
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
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
  const footer =
    actions !== undefined ? (
      actions
    ) : passive ? null : (
      <>
        {secondaryAction ? (
          <Button variant="tertiary" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        ) : null}
        {primaryAction ? (
          <Button
            variant={danger ? 'danger' : 'primary'}
            loading={primaryAction.loading}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        ) : null}
      </>
    );

  return createPortal(
    <div
      className={cx('pm-dialog__backdrop', closing && 'is-closing')}
      onMouseDown={(e) => {
        if (closeOnOutsideClick && e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={(el) => {
          panelRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        className={cx('pm-dialog', `pm-dialog--${size}`, danger && 'pm-dialog--danger', closing && 'is-closing', className)}
        {...rest}
      >
        {title ? (
          <div className="pm-dialog__header">
            <h2 className="pm-dialog__title" id={titleId}>
              {title}
            </h2>
          </div>
        ) : null}
        {description ? (
          <p className="pm-dialog__description" id={descId}>
            {description}
          </p>
        ) : null}
        <div className="pm-dialog__body">{children}</div>
        {footer ? <div className="pm-dialog__actions">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
});
