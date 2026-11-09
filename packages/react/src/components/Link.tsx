import { createElement, forwardRef } from 'react';
import type { AnchorHTMLAttributes, ElementType, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'as'> {
  /** Polymorphic: render as react-router's Link etc. Receives href + onClick + rest. */
  as?: ElementType;
  /** External link: adds the external-link icon, target="_blank", rel="noopener noreferrer". */
  external?: boolean;
  /** Standalone (own line) vs inline (within text). */
  variant?: 'inline' | 'standalone';
  children?: ReactNode;
}

/** Link: inline or standalone, external variant with icon, polymorphic via `as`. */
export const Link = forwardRef(function Link(
  { as, external = false, variant = 'inline', className, children, href, target, rel, ...rest }: LinkProps,
  ref: Ref<HTMLAnchorElement>,
) {
  const Tag = (as ?? 'a') as ElementType;
  return createElement(Tag, {
    ref,
    href,
    target: external ? (target ?? '_blank') : target,
    rel: external ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel,
    className: cx('pm-link', `pm-link--${variant}`, className),
    ...rest,
    children: (
      <>
        {children}
        {external ? <Icon name="external-link" size={14} className="pm-link__external" aria-hidden /> : null}
      </>
    ),
  });
});
