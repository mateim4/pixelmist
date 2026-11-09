import { cloneElement, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Popover } from './Popover';
import type { PopoverPlacement } from './Popover';

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** Rich content: title, status tag, facts line, agent line. */
  title: ReactNode;
  status?: ReactNode;
  facts?: ReactNode;
  agent?: ReactNode;
  /** Trigger — for chart nodes, an SVG <g tabIndex={0}>. */
  children: ReactElement;
  placement?: PopoverPlacement;
  /** Controlled open (optional); otherwise hover/focus driven. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  /** Wrapper element: 'span' in HTML, 'g' when the trigger is an SVG node. */
  as?: 'span' | 'g';
}

/**
 * HoverCard: a rich tooltip for chart nodes — opens on hover (after `delay` ms) and on
 * keyboard focus of the trigger (SVG nodes need tabIndex={0}), stays open while the
 * pointer is over the card, Escape dismisses and returns focus to the trigger.
 * forwardRef + prop pass-through to the wrapper.
 */
export const HoverCard = forwardRef(function HoverCard(
  {
    title,
    status,
    facts,
    agent,
    children,
    placement = 'top',
    open: openProp,
    onOpenChange,
    delay = 120,
    as = 'span',
    className,
    onKeyDown,
    ...rest
  }: HoverCardProps,
  ref: Ref<HTMLElement>,
) {
  const [internal, setInternal] = useState(false);
  const [overContent, setOverContent] = useState(false);
  const open = openProp ?? internal;
  const setOpen = (o: boolean) => {
    setInternal(o);
    onOpenChange?.(o);
  };
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
    if (returning.current) return;
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(timer.current);
    if (overContent) return;
    later(() => setOpen(false), 120);
  };
  const focusTrigger = () => {
    const el = wrapRef.current?.querySelector<HTMLElement>('[tabindex], button, a[href], input, select, textarea');
    (el ?? wrapRef.current)?.focus?.();
  };

  // Escape dismisses from anywhere (the card is portaled) and returns focus to the trigger.
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
      className={cx('pm-hovercard', className)}
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
        className="pm-hovercard__content"
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
        <div className="pm-hovercard__title">{title}</div>
        {status ? <div className="pm-hovercard__status">{status}</div> : null}
        {facts ? <div className="pm-hovercard__facts">{facts}</div> : null}
        {agent ? <div className="pm-hovercard__agent">{agent}</div> : null}
      </Popover>
    </Tag>
  );
});
