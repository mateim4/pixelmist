import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@pixelmist/core';

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export type PopoverAnchor = RefObject<HTMLElement | null> | HTMLElement | (() => HTMLElement | null);

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Controlled open state. */
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element the popover is anchored to. */
  anchor: PopoverAnchor;
  placement?: PopoverPlacement;
  /** Gap between anchor and popover, px. */
  offset?: number;
  /** Flip to the opposite side when there is not enough room (default true). */
  flip?: boolean;
  /**
   * Escape closes and returns focus to the anchor (default true). Set false when the
   * consumer handles Escape itself (e.g. InfoTip returns focus to its "?" button).
   */
  closeOnEscape?: boolean;
  /** Ref to the floating panel (for outside-click containment checks). */
  panelRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

const resolveAnchor = (a: PopoverAnchor): HTMLElement | null =>
  typeof a === 'function' ? a() : 'current' in a ? a.current : a;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const VIEWPORT_PAD = 8;

/** Compute the fixed-position rect for the popover, flipping the main axis if needed. */
function computePosition(
  anchor: Rect,
  size: { width: number; height: number },
  placement: PopoverPlacement,
  offset: number,
  flip: boolean,
): { top: number; left: number; placement: PopoverPlacement } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const [main, align = 'center'] = placement.split('-') as [string, string?];
  let m = main;
  if (flip) {
    const room: Record<string, number> = {
      top: anchor.top,
      bottom: vh - (anchor.top + anchor.height),
      left: anchor.left,
      right: vw - (anchor.left + anchor.width),
    };
    const need = m === 'top' || m === 'bottom' ? size.height + offset : size.width + offset;
    const opposite = ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as Record<string, string>)[m] ?? 'bottom';
    if ((room[m] ?? 0) < need && (room[opposite] ?? 0) > (room[m] ?? 0)) m = opposite;
  }
  let top = 0;
  let left = 0;
  if (m === 'top') top = anchor.top - size.height - offset;
  else if (m === 'bottom') top = anchor.top + anchor.height + offset;
  else if (m === 'left') left = anchor.left - size.width - offset;
  else left = anchor.left + anchor.width + offset;
  if (m === 'top' || m === 'bottom') {
    if (align === 'start') left = anchor.left;
    else if (align === 'end') left = anchor.left + anchor.width - size.width;
    else left = anchor.left + anchor.width / 2 - size.width / 2;
  } else {
    if (align === 'start') top = anchor.top;
    else if (align === 'end') top = anchor.top + anchor.height - size.height;
    else top = anchor.top + anchor.height / 2 - size.height / 2;
  }
  // clamp into the viewport
  left = Math.min(Math.max(left, VIEWPORT_PAD), Math.max(VIEWPORT_PAD, vw - size.width - VIEWPORT_PAD));
  top = Math.min(Math.max(top, VIEWPORT_PAD), Math.max(VIEWPORT_PAD, vh - size.height - VIEWPORT_PAD));
  return { top, left, placement: `${m}${align !== 'center' ? `-${align}` : ''}` as PopoverPlacement };
}

/**
 * Low-level anchored popover: portal, 12 placements (8 with start/end) with auto-flip,
 * controlled `open`, Escape closes and returns focus to the anchor. No role of its own —
 * Tooltip/InfoTip/HoverCard layer semantics on top.
 */
export const Popover = forwardRef(function Popover(
  {
    open,
    onOpenChange,
    anchor,
    placement = 'bottom',
    offset = 8,
    flip = true,
    closeOnEscape = true,
    panelRef: panelRefProp,
    className,
    children,
    style,
    ...rest
  }: PopoverProps,
  ref: Ref<HTMLDivElement>,
) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const setPanelRef = (el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (typeof panelRefProp === 'function') panelRefProp(el);
    else if (panelRefProp) (panelRefProp as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };
  const [pos, setPos] = useState<{ top: number; left: number; placement: PopoverPlacement } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const el = resolveAnchor(anchor);
    const panel = innerRef.current;
    if (!el || !panel) return;
    const measure = () => {
      const a = el.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      setPos(computePosition(a, { width: p.width, height: p.height }, placement, offset, flip));
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, anchor, placement, offset, flip]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onOpenChange?.(false);
        resolveAnchor(anchor)?.focus?.();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, closeOnEscape, anchor, onOpenChange]);

  if (!open) return null;
  return createPortal(
    <div
      ref={setPanelRef}
      className={cx('pm-popover', className)}
      data-placement={pos?.placement ?? placement}
      style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, ...style }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
});
