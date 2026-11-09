import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'> {
  title: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Disclosure (fold): the panel animates open with grid-template-rows 0fr→1fr
 * (≤400ms, the one allowed long motion). Under prefers-reduced-motion it fades
 * in place — travel collapses via --pm-motion-travel.
 */
export const Disclosure = forwardRef(function Disclosure(
  { title, open, defaultOpen = false, onOpenChange, className, children, ...rest }: DisclosureProps,
  ref: Ref<HTMLDivElement>,
) {
  const [isOpen, setOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  const id = useId();
  const triggerId = `${id}-trigger`;
  return (
    <div ref={ref} className={cx('pm-disclosure', isOpen && 'is-open', className)} {...rest}>
      <button
        type="button"
        id={triggerId}
        className="pm-disclosure__trigger"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setOpen(!isOpen)}
      >
        <Icon name="chevron-right" size={16} className="pm-disclosure__chevron" aria-hidden />
        <span className="pm-disclosure__title">{title}</span>
      </button>
      {/* no `hidden`: the panel collapses via grid-template-rows + visibility (see CSS),
          so the fold animates and the closed panel stays out of the tab order */}
      <div className="pm-disclosure__panel" role="region" id={id} aria-labelledby={triggerId}>
        <div className="pm-disclosure__inner">{children}</div>
      </div>
    </div>
  );
});
