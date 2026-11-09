import { createContext, forwardRef, useContext, useEffect, useRef } from 'react';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import { cx, useControllableState, useId } from '@pixelmist/core';
import { Icon } from './Icon';

/* ---------- shell context: wires the header menu button to the side nav ---------- */
interface AppShellContextValue {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  navId: string;
  menuRef: React.MutableRefObject<HTMLButtonElement | null>;
}
const AppShellContext = createContext<AppShellContextValue | null>(null);

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Provides the nav open/close channel between Header's menu button and SideNav. forwardRef + pass-through. */
export const AppShell = forwardRef(function AppShell({ className, children, ...rest }: AppShellProps, ref: Ref<HTMLDivElement>) {
  const [navOpen, setNavOpen] = useControllableState<boolean>(undefined, false);
  const navId = useId();
  const menuRef = useRef<HTMLButtonElement | null>(null);
  return (
    <AppShellContext.Provider value={{ navOpen, setNavOpen, navId, menuRef }}>
      <div ref={ref} className={cx('pm-app-shell', className)} {...rest}>
        {children}
      </div>
    </AppShellContext.Provider>
  );
});

/* ---------- Header ---------- */
export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  productName?: ReactNode;
  /** Menu button for narrow screens (opens the SideNav overlay). */
  onMenuClick?: () => void;
  menuLabel?: string;
  /** Right-hand slot. */
  children?: ReactNode;
}

export const Header = forwardRef(function Header(
  { productName, onMenuClick, menuLabel = 'Open navigation', className, children, ...rest }: HeaderProps,
  ref: Ref<HTMLElement>,
) {
  const ctx = useContext(AppShellContext);
  const menu = onMenuClick ?? (ctx ? () => ctx.setNavOpen(true) : undefined);
  return (
    <header ref={ref} className={cx('pm-header', className)} {...rest}>
      <div className="pm-header__inner">
        {menu ? (
          <button
            ref={ctx?.menuRef}
            type="button"
            className="pm-header__menu"
            aria-label={menuLabel}
            aria-expanded={ctx ? ctx.navOpen : undefined}
            aria-controls={ctx ? ctx.navId : undefined}
            onClick={menu}
          >
            <Icon name="menu" size={20} />
          </button>
        ) : null}
        {productName ? <span className="pm-header__product">{productName}</span> : null}
        <div className="pm-header__right">{children}</div>
      </div>
    </header>
  );
});

/* ---------- SideNav ---------- */
export interface NavLinkItem {
  label: string;
  href: string;
  icon?: IconName;
  /** Current page → aria-current="page". */
  current?: boolean;
}
export interface NavGroup {
  heading?: string;
  links: NavLinkItem[];
}

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  groups: NavGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Router-agnostic link renderer (e.g. react-router's Link). Default: <a>. */
  linkAs?: React.ElementType;
  /** Accessible label for the nav. */
  label?: string;
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * Side navigation with grouped headings. Below the lg breakpoint it collapses to an
 * overlay (backdrop + panel, Escape/backdrop/link-click closes and returns focus to the
 * menu button; focus is contained while the overlay is open); at lg+ it is static.
 * Links are router-agnostic via `linkAs` and carry aria-current="page".
 */
export const SideNav = forwardRef(function SideNav(
  { groups, open, defaultOpen = false, onOpenChange, linkAs, label = 'Main navigation', className, id, ...rest }: SideNavProps,
  ref: Ref<HTMLElement>,
) {
  const ctx = useContext(AppShellContext);
  const [internal, setInternal] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  const isOpen = ctx && open === undefined ? ctx.navOpen : internal;
  const setOpen = (o: boolean) => {
    setInternal(o);
    ctx?.setNavOpen(o);
    if (!o) ctx?.menuRef.current?.focus?.();
  };
  const LinkTag = (linkAs ?? 'a') as React.ElementType;
  const navRef = useRef<HTMLElement | null>(null);
  const autoId = useId();
  const navId = id ?? (ctx ? ctx.navId : autoId);

  // Escape closes; while the overlay is open (narrow viewports) focus stays inside it.
  useEffect(() => {
    if (!isOpen) return;
    const narrow = () =>
      typeof matchMedia === 'function' && matchMedia('(max-width: 1023px)').matches;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key === 'Tab' && narrow()) {
        const nav = navRef.current;
        if (!nav) return;
        const items = [...nav.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        const active = document.activeElement;
        if (!nav.contains(active)) {
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
    return () => document.removeEventListener('keydown', onKey, true);
  }, [isOpen]);

  const nav = (
    <nav
      ref={(el) => {
        navRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      id={navId}
      aria-label={label}
      className={cx('pm-sidenav', isOpen && 'is-open', className)}
      {...rest}
    >
      {groups.map((g, gi) => (
        <div className="pm-sidenav__group" key={g.heading ?? gi}>
          {g.heading ? <p className="pm-sidenav__heading">{g.heading}</p> : null}
          <ul className="pm-sidenav__list">
            {g.links.map((l) => (
              <li key={l.href}>
                <LinkTag
                  href={l.href}
                  className={cx('pm-sidenav__link', l.current && 'is-current')}
                  aria-current={l.current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.icon ? <Icon name={l.icon} size={16} aria-hidden /> : null}
                  <span>{l.label}</span>
                </LinkTag>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {isOpen ? <div className="pm-sidenav__backdrop" onMouseDown={() => setOpen(false)} aria-hidden /> : null}
      {nav}
    </>
  );
});

/* ---------- SkipToContent ---------- */
export interface SkipToContentProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Id of the main content element. */
  targetId?: string;
}

/** Skip link: visually hidden until focused, then jumps to (and focuses) the main content. */
export const SkipToContent = forwardRef(function SkipToContent(
  { targetId = 'pm-main', className, children = 'Skip to content', onClick, ...rest }: SkipToContentProps,
  ref: Ref<HTMLAnchorElement>,
) {
  return (
    <a
      ref={ref}
      href={`#${targetId}`}
      className={cx('pm-skip', className)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const target = document.getElementById(targetId);
        if (target) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus();
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
});
