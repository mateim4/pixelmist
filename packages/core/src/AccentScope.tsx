/**
 * @pixelmist/core — AccentScope: per-product accent theming API.
 * Allows overriding the semantic accent colors for a subtree of components.
 */
import { createContext, useContext, useMemo } from 'react';

export interface AccentScopeValue {
  /** Custom accent color override (CSS color value or token ref). Undefined = use theme default. */
  accentPrimary?: string;
  accentPrimaryHover?: string;
  accentPrimaryActive?: string;
  accentSoft?: string;
  accentSoftHover?: string;
  accentBorder?: string;
}

const AccentScopeContext = createContext<AccentScopeValue | null>(null);

export interface AccentScopeProps extends AccentScopeValue {
  children?: React.ReactNode;
}

/**
 * AccentScope provides per-product accent color overrides for its children.
 * Components that consume accent tokens should check this context and fall back
 * to the theme's semantic accent colors when not provided.
 * 
 * Usage:
 * <AccentScope accentPrimary="#0EA5E9" accentSoft="#E0F2FE">
 *   <Button variant="primary">Blue Accent</Button>
 * </AccentScope>
 */
export function AccentScope({
  accentPrimary,
  accentPrimaryHover,
  accentPrimaryActive,
  accentSoft,
  accentSoftHover,
  accentBorder,
  children,
}: AccentScopeProps) {
  const value = useMemo<AccentScopeValue>(() => ({
    accentPrimary,
    accentPrimaryHover,
    accentPrimaryActive,
    accentSoft,
    accentSoftHover,
    accentBorder,
  }), [accentPrimary, accentPrimaryHover, accentPrimaryActive, accentSoft, accentSoftHover, accentBorder]);

  return <AccentScopeContext.Provider value={value}>{children}</AccentScopeContext.Provider>;
}

export function useAccentScope(): AccentScopeValue | null {
  return useContext(AccentScopeContext);
}

/**
 * Get the effective accent color for the current scope, falling back to the theme's
 * semantic accent color. This is a helper for components to use.
 */
export function useAccentColor():
  | AccentScopeValue
  | { accentPrimary: string; accentPrimaryHover: string; accentPrimaryActive: string; accentSoft: string; accentSoftHover: string; accentBorder: string }
{
  const scope = useAccentScope();
  // If we have any scope values, return them (partial overrides are allowed)
  if (scope && Object.values(scope).some((v) => v !== undefined)) {
    return {
      accentPrimary: scope.accentPrimary ?? '',
      accentPrimaryHover: scope.accentPrimaryHover ?? '',
      accentPrimaryActive: scope.accentPrimaryActive ?? '',
      accentSoft: scope.accentSoft ?? '',
      accentSoftHover: scope.accentSoftHover ?? '',
      accentBorder: scope.accentBorder ?? '',
    };
  }
  // No scope or no overrides - return empty object to signal "use theme default"
  return {
    accentPrimary: '',
    accentPrimaryHover: '',
    accentPrimaryActive: '',
    accentSoft: '',
    accentSoftHover: '',
    accentBorder: '',
  };
}
