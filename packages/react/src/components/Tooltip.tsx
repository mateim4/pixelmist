import { cloneElement, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Popover } from './Popover';
import type { PopoverPlacement } from './Popover';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Tooltip content. */
  label: ReactNode;
  /** The trigger element (wrapped; gets aria-describedby while open). */
  children: ReactElement;
  placement?: PopoverPlacement;
  /** Open delay on hover, ms (default 120). */
  delay?: number;
  disabled?: boolean;
  /** Wrapper element: 'span' in HTML, 'g' when the trigger is an SVG node. */
  as?: 'span' | 'g';
}

/**
 * Tooltip: opens on hover after `delay` ms and on keyboard focus, stays open while the
 * pointer is over the tooltip itself, Escape dismisses and returns focus to the trigger
 * (WCAG 1.4.13). role="tooltip", linked to the trigger with aria-describedby.
 * forwardRef + prop pass-through to the wrapper.
 */
export const Tooltip = forwardRef(function Tooltip(
  { label, children, placement = 'top', delay = 120, disabled = false, as = 'span', className, onKeyDown, ...rest }: TooltipProps,
  ref: Ref<HTMLElement>,
) {
  const [open, setOpen] = useState(false);
  const [overContent, setOverContent] = useState(false);
  const wrapRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const id = useId();
  // span in HTML, g inside <svg>; typed loosely because the union of element props is not assignable
  const Tag = as as React.ElementType;

  const later = useCallback((fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Escape hands focus back to the trigger, and that focus must not reopen the card.
  const returning = useRef(false);

  const show = () => {
    if (disabled || returning.current) return;
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(timer.current);
    if (overContent) return; // pointer is over the tooltip: stay open (WCAG 1.4.13)
    later(() => setOpen(false), 120);
  };
  const focusTrigger = () => {
    const el = wrapRef.current?.querySelector<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    (el ?? wrapRef.current)?.focus?.();
  };

  // Escape dismisses from anywhere (the content is portaled, so listen at document level)
  // and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        clearTimeout(timer.current);
        setOpen(false);
        returning.current = true;
        focusTrigger();
        returning.current = false;
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open]);

  const trigger = cloneElement(children, {
    'aria-describedby': open ? [children.props['aria-describedby'], id].filter(Boolean).join(' ') : children.props['aria-describedby'],
  } as Record<string, unknown>);

  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        wrapRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className={cx('pm-tooltip', className)}
      onMouseEnter={() => later(show, delay)}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {trigger}
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={wrapRef}
        placement={placement}
        className="pm-tooltip__content"
        role="tooltip"
        id={id}
        closeOnEscape={false}
        onMouseEnter={() => {
          clearTimeout(timer.current);
          setOverContent(true);
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOverContent(false);
          hide();
        }}
      >
        {label}
      </Popover>
    </Tag>
  );
});
