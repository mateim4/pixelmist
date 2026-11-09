import { forwardRef, useState } from 'react';
import type { Ref } from 'react';
import { Modal, Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';
import { Box } from './Box';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T = SelectOption> extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  options?: SelectOption[];
  /** Typed items API (same as web). */
  items?: T[];
  itemToString?: (item: T) => string;
  itemToValue?: (item: T) => string;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  warning?: string;
  disabled?: boolean;
}

/** Native select as a bottom-sheet style modal list. */
function SelectInner<T = SelectOption>({
  value,
  defaultValue,
  onValueChange,
  options,
  items,
  itemToString,
  itemToValue,
  placeholder = 'Select…',
  label,
  hint,
  error,
  warning,
  disabled,
  ...rest
}: SelectProps<T>, ref: Ref<View>) {
  const { resolved: t } = useTheme();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  const opts: SelectOption[] =
    options ??
    (items ?? []).map((item) => ({
      value: itemToValue ? itemToValue(item) : itemToString!(item),
      label: itemToString!(item),
    }));
  const selected = opts.find((o) => o.value === current);
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;
  return (
    <View ref={ref} {...rest}>
      {label ? (
        <Box paddingY="xxs">
          <Text variant="body-sm-medium">{label}</Text>
        </Box>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 44,
          paddingHorizontal: space(t, 'md'),
          backgroundColor: t.color.bg.raised,
          borderWidth: 1,
          borderColor: hasError ? t.color.status.danger : hasWarning ? t.color.status.warning : t.color.border.strong,
          borderRadius: t.radius.md,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text variant="body-md" tone={selected ? 'default' : 'disabled'}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="chevron-down" size={16} color={t.color.fg.subtle} />
      </Pressable>
      {message ? (
        <Text variant="caption" tone={hasError ? 'danger' : hasWarning ? 'warning' : 'muted'} accessibilityRole={hasError ? 'alert' : undefined}>
          {message}
        </Text>
      ) : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: t.color.bg.overlay, justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: t.color.bg.raised,
              borderTopLeftRadius: t.radius.xl,
              borderTopRightRadius: t.radius.xl,
              padding: space(t, 'md'),
              gap: space(t, 'xxs'),
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {opts.map((opt) => (
              <Pressable
                key={opt.value}
                accessibilityRole="button"
                disabled={opt.disabled}
                onPress={() => {
                  if (!opt.disabled) {
                    setCurrent(opt.value);
                    setOpen(false);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: space(t, 'sm'),
                  paddingHorizontal: space(t, 'sm'),
                  borderRadius: t.radius.sm,
                  backgroundColor: opt.value === current ? t.color.accent.soft : 'transparent',
                }}
              >
                <Text variant="body-md" tone={opt.value === current ? 'accent' : 'default'}>
                  {opt.label}
                </Text>
                {opt.value === current ? <Icon name="check" size={16} color={t.color.accent.primary} /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/** forwardRef erases generics — re-expose the typed signature. */
export const Select = forwardRef(SelectInner) as <T = SelectOption>(
  props: SelectProps<T> & { ref?: Ref<View> },
) => React.ReactElement;
