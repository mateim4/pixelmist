/**
 * @pixelmist/react — AccentScope component for web.
 * Provides per-product accent color theming for a subtree of components.
 */
import { AccentScope as CoreAccentScope, type AccentScopeProps } from '@pixelmist/core';
import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes, Ref } from 'react';

/**
 * AccentScope for web platform. Wraps the core AccentScope with CSS custom property
 * injection so that components can read the scoped accent colors via CSS variables.
 * 
 * This component sets CSS custom properties on a wrapper element that override
 * the theme's accent color variables within the scope.
 */
export const AccentScope = forwardRef(function AccentScope(props: AccentScopeProps & HTMLAttributes<HTMLDivElement>, ref: Ref<HTMLDivElement>) {
  const { accentPrimary, accentPrimaryHover, accentPrimaryActive, accentSoft, accentSoftHover, accentBorder, ...rest } = props;
  
  // Build inline style with CSS custom property overrides
  const style = useMemo(() => {
    const result: React.CSSProperties = {};
    if (accentPrimary) (result as any)['--pm-color-accent-primary'] = accentPrimary;
    if (accentPrimaryHover) (result as any)['--pm-color-accent-primary-hover'] = accentPrimaryHover;
    if (accentPrimaryActive) (result as any)['--pm-color-accent-primary-active'] = accentPrimaryActive;
    if (accentSoft) (result as any)['--pm-color-accent-soft'] = accentSoft;
    if (accentSoftHover) (result as any)['--pm-color-accent-soft-hover'] = accentSoftHover;
    if (accentBorder) (result as any)['--pm-color-accent-border'] = accentBorder;
    return result;
  }, [accentPrimary, accentPrimaryHover, accentPrimaryActive, accentSoft, accentSoftHover, accentBorder]);

  return (
    <div
      ref={ref}
      data-pm-accent-scope={Object.values({ accentPrimary, accentPrimaryHover, accentPrimaryActive, accentSoft, accentSoftHover, accentBorder }).some(Boolean) ? 'true' : undefined}
      style={style}
      {...rest}
    >
      <CoreAccentScope {...props} />
    </div>
  );
});
