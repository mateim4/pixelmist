import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';
import { Popover } from './Popover';
import type { PopoverPlacement } from './Popover';

export interface InfoTipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'title'> {
  /** The button's accessible name, e.g. "About conflicts". */
  label: string;
  /** Phrasing content — the sentence that used to be printed under the heading. */
  children: ReactNode;
  /** Popover placement (default bottom-start). */
  align?: PopoverPlacement;
  /** Forwarded to the "?" button (and kept off the wrapper to avoid duplicate ids). */
  'data-testid'?: string;
}

/**
 * The small "?" beside a heading or control. Opens on hover (after 120ms), on keyboard
 * focus, and on click/tap — a click pins it open until a second click, Escape, or an
 * outside click. The content stays open while the pointer is over it (WCAG 1.4.13).
 * Escape returns focus to the "?" without reopening it.
 * Behaviour mirrors the reference implementation in brdcrmb's InfoTip.
 * forwardRef + prop pass-through to the wrapper.
 */
export const InfoTip = forwardRef(function InfoTip(
  { label, children, align = 'bottom-start', className, 'data-testid': testId, ...rest }: InfoTipProps,
  ref: Ref<HTMLSpanElement>,
) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [overContent, setOverContent] = useState(false);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  // Escape hands focus back to the "?", and that focus must not open it again.
  const returning = useRef(false);
  const id = useId();

  const later = useCallback((fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
    setPinned(false);
  }, []);

  // Escape closes from anywhere (the popover is portaled, so listen at document level)
  // and returns focus to the "?" without reopening it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        returning.current = true;
        buttonRef.current?.focus();
        returning.current = false;
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, close]);

  // A click anywhere else closes it, pinned or not. The popover is portaled, so
  // containment must also check the panel itself.
  useEffect(() => {
    if (!open) return;
    const doc = wrapRef.current?.ownerDocument ?? document;
    const outside = (e: Event) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (wrapRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      close();
    };
    doc.addEventListener('mousedown', outside, true);
    return () => doc.removeEventListener('mousedown', outside, true);
  }, [open, close]);

  return (
    <span
      ref={(el) => {
        wrapRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = el;
      }}
      className={cx('pm-infotip', className)}
      onMouseEnter={() => later(() => setOpen(true), 120)}
      onMouseLeave={() => {
        if (!pinned && !overContent) later(() => setOpen(false), 200);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null) && !overContent) close();
      }}
      {...rest}
    >
      <button
        ref={buttonRef}
        type="button"
        className="pm-infotip__button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={open ? id : undefined}
        data-testid={testId}
        onFocus={(e) => {
          if (returning.current) return;
          // Keyboard focus only: a mouse click focuses too, and the click handler decides that.
          let byKeyboard = true;
          try {
            byKeyboard = e.currentTarget.matches(':focus-visible');
          } catch {
            // An engine that does not know the selector: treat every focus as the keyboard's.
          }
          if (byKeyboard) setOpen(true);
        }}
        onClick={() => {
          clearTimeout(timer.current);
          if (open && pinned) close();
          else {
            setOpen(true);
            setPinned(true);
          }
        }}
      >
        <Icon name="help" size={16} aria-hidden />
      </button>
      <Popover
        open={open}
        onOpenChange={(o) => (o ? setOpen(true) : close())}
        anchor={wrapRef}
        placement={align}
        className="pm-infotip__content"
        role="tooltip"
        id={id}
        closeOnEscape={false}
        panelRef={panelRef}
        onMouseEnter={() => {
          clearTimeout(timer.current);
          setOverContent(true);
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOverContent(false);
          if (!pinned) later(() => setOpen(false), 200);
        }}
      >
        {/* A span, not a div: a ? may sit inside a line of text, and a block inside a <p> is invalid. */}
        <span>{children}</span>
      </Popover>
    </span>
  );
});
