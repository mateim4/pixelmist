import { forwardRef, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import type { Size } from '@pixelmist/core';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space, asTokens } from '../theme/helpers';
import { Text } from './Text';

export interface ComboBoxProps<T = string> extends Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText'> {
  items: T[];
  itemToString: (item: T) => string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onSelect?: (item: T) => void;
  label?: string;
  hint?: string;
  error?: string;
  warning?: string;
  size?: Size;
  placeholder?: string;
  disabled?: boolean;
}

/** Native combobox: type-to-filter list in a modal sheet. Same API as web ComboBox. */
export const ComboBox = forwardRef<TextInput, ComboBoxProps<any>>(function ComboBox(
  {
    items,
    itemToString,
    value,
    defaultValue,
    onValueChange,
    onSelect,
    label,
    hint,
    error,
    warning,
    size = 'md',
    placeholder,
    disabled,
    style,
    ...rest
  },
  ref,
) {
  const { resolved: t } = useTheme();
  const input = asTokens(asTokens(t.components.input)['default'] ?? {});
  const [query, setQuery] = useControllableState<string>(value, defaultValue ?? '', onValueChange);
  const [open, setOpen] = useState(false);
  const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => itemToString(i).toLowerCase().includes(q)) : items;
  }, [items, itemToString, query]);
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;
  return (
    <View style={{ gap: space(t, 'xxs') }}>
      {label ? <Text variant="body-sm-medium">{label}</Text> : null}
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={message}
        accessibilityRole="search"
        value={query}
        placeholder={placeholder}
        editable={!disabled}
        onChangeText={(v) => {
          setQuery(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={[
          {
            height,
            backgroundColor: String(input.bg),
            color: String(input.fg),
            borderWidth: 1,
            borderColor: hasError ? t.color.status.danger : hasWarning ? t.color.status.warning : String(input.border),
            borderRadius: Number(input.radius),
            paddingHorizontal: space(t, 'md'),
          },
          style,
        ]}
        placeholderTextColor={String(input.placeholder)}
        {...rest}
      />
      {message ? (
        <Text variant="caption" tone={hasError ? 'danger' : hasWarning ? 'warning' : 'muted'} accessibilityRole={hasError ? 'alert' : undefined}>
          {message}
        </Text>
      ) : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: t.color.bg.overlay, justifyContent: 'flex-end' }} onPress={() => setOpen(false)}>
          <Pressable
            style={{ backgroundColor: t.color.bg.raised, borderTopLeftRadius: t.radius.xl, borderTopRightRadius: t.radius.xl, padding: space(t, 'md'), maxHeight: '50%' }}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView>
              {filtered.map((item, i) => (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  onPress={() => {
                    setQuery(itemToString(item));
                    onSelect?.(item);
                    setOpen(false);
                  }}
                  style={{ paddingVertical: space(t, 'sm'), paddingHorizontal: space(t, 'sm'), borderRadius: t.radius.sm }}
                >
                  <Text variant="body-md">{itemToString(item)}</Text>
                </Pressable>
              ))}
              {filtered.length === 0 ? (
                <Text variant="body-sm" tone="muted">
                  No matches
                </Text>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
});
