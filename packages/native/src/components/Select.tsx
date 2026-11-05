import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
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

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

/** Native select as a bottom-sheet style modal list. */
export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = 'Select…',
  label,
  disabled,
}: SelectProps) {
  const { resolved: t } = useTheme();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  const selected = options.find((o) => o.value === current);
  return (
    <View>
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
          borderColor: t.color.border.strong,
          borderRadius: t.radius.md,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text variant="body-md" tone={selected ? 'default' : 'disabled'}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="chevron-down" size={16} color={t.color.fg.subtle} />
      </Pressable>
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
            {options.map((opt) => (
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
