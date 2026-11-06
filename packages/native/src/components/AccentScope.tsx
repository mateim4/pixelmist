/**
 * @pixelmist/native — AccentScope component for React Native.
 * Provides per-product accent color theming for a subtree of components.
 */
import { AccentScope as CoreAccentScope } from '@pixelmist/core';
import type { AccentScopeProps } from '@pixelmist/core';
import { View } from 'react-native';

/**
 * AccentScope for React Native. Wraps the core AccentScope to provide
 * scoped accent color overrides for native components.
 * 
 * Native components will read from the AccentScope context via useAccentScope
 * and merge with the resolved theme.
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
  return (
    <CoreAccentScope
      accentPrimary={accentPrimary}
      accentPrimaryHover={accentPrimaryHover}
      accentPrimaryActive={accentPrimaryActive}
      accentSoft={accentSoft}
      accentSoftHover={accentSoftHover}
      accentBorder={accentBorder}
    >
      <View>{children}</View>
    </CoreAccentScope>
  );
}

// Re-export the hook for convenience
export { useAccentScope } from '@pixelmist/core';
