import { forwardRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import type { Size } from '@pixelmist/core';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space, asTokens } from '../theme/helpers';
import { Icon } from './Icon';

export interface SearchProps extends Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  size?: Size;
  clearable?: boolean;
  onClear?: () => void;
}

/** Native search field: search icon, clear button, Escape-equivalent (clear on blur not needed). */
export const Search = forwardRef<TextInput, SearchProps>(function Search(
  { value, defaultValue, onValueChange, label = 'Search', size = 'md', clearable = true, onClear, style, onKeyPress, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const input = asTokens(asTokens(t.components.input)['default'] ?? {});
  const [current, setCurrent] = useControllableState<string>(value, defaultValue ?? '', onValueChange);
  const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const clear = () => {
    setCurrent('');
    onClear?.();
  };
  return (
    <View accessibilityRole="search" style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ position: 'absolute', left: space(t, 'md'), zIndex: 1 }}>
        <Icon name="search" size={16} color={t.color.fg.subtle} />
      </View>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        value={current}
        onChangeText={setCurrent}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Escape' && current) clear();
          onKeyPress?.(e);
        }}
        style={[
          {
            flex: 1,
            height,
            backgroundColor: String(input.bg),
            color: String(input.fg),
            borderWidth: 1,
            borderColor: String(input.border),
            borderRadius: t.radius.full,
            paddingLeft: 40,
            paddingRight: clearable && current ? 36 : space(t, 'md'),
          },
          style,
        ]}
        placeholderTextColor={String(input.placeholder)}
        {...rest}
      />
      {clearable && current ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={clear}
          style={{ position: 'absolute', right: space(t, 'xs'), width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="x" size={14} color={t.color.fg.muted} />
        </Pressable>
      ) : null}
    </View>
  );
});
