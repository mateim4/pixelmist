import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import type { PressableProps, ViewProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { asTokens } from '../theme/helpers';
import { Text } from './Text';

export type TagTone = 'attention' | 'progress' | 'settled' | 'inactive' | 'neutral';
export type TagVariant = 'soft' | 'outline' | 'highContrast';
export type TagSize = 'sm' | 'md';

export interface TagProps extends ViewProps {
  tone?: TagTone;
  variant?: TagVariant;
  size?: TagSize;
  children?: string;
}

/** Native Tag — same API as web. Tones map to the semantic tone tokens. */
export const Tag = forwardRef<View, TagProps>(function Tag(
  { tone = 'neutral', variant = 'soft', size = 'md', children, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const tag = asTokens(t.components.tag);
  const tones = t.color.tones as unknown as Record<string, { surface: string; border: string; text: string; strong: string; onStrong: string }>;
  const tn = tone === 'neutral' ? null : tones[tone];
  let bg = t.color.bg.surface;
  let fg = t.color.fg.muted;
  let border = t.color.border.default;
  if (tn) {
    if (variant === 'highContrast') {
      bg = tn.strong;
      fg = tn.onStrong;
      border = tn.strong;
    } else if (variant === 'outline') {
      bg = 'transparent';
      fg = tn.text;
      border = tn.border;
    } else {
      bg = tn.surface;
      fg = tn.text;
      border = tn.border;
    }
  } else if (variant === 'highContrast') {
    bg = t.color.bg.inverse;
    fg = t.color.fg.inverse;
    border = t.color.bg.inverse;
  }
  return (
    <View
      ref={ref}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          borderRadius: Number(tag.radius),
          paddingVertical: size === 'sm' ? Number(tag.padYSm) : Number(tag.padY),
          paddingHorizontal: size === 'sm' ? Number(tag.padXSm) : Number(tag.padX),
        },
        style,
      ]}
      {...rest}
    >
      <Text variant={size === 'sm' ? 'micro' : 'caption-bold'} style={{ color: fg }}>
        {children}
      </Text>
    </View>
  );
});

export interface SelectableTagProps extends Omit<PressableProps, 'children'> {
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  tone?: TagTone;
  variant?: TagVariant;
  size?: TagSize;
  children?: string;
}

/** Native selectable tag: a toggle chip with accessibilityState.selected. */
export const SelectableTag = forwardRef<View, SelectableTagProps>(function SelectableTag(
  { selected, defaultSelected = false, onSelectedChange, tone = 'neutral', variant = 'outline', size = 'md', children, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const [value, setValue] = useControllableState<boolean>(selected, defaultSelected, onSelectedChange);
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: value }}
      onPress={() => setValue(!value)}
      {...rest}
    >
      <Tag tone={tone} variant={value ? 'soft' : variant} size={size} style={value ? { borderColor: t.color.accent.primary } : undefined}>
        {children}
      </Tag>
    </Pressable>
  );
});
