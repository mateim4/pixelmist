import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Pressable } from 'react-native';
import type { PressableProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { View } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';

export interface CheckboxProps extends Omit<PressableProps, 'onPress'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Indeterminate — accessibilityState.checked becomes "mixed". */
  indeterminate?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export const Checkbox = forwardRef<ElementRef<typeof Pressable>, CheckboxProps>(function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  label,
  hint,
  error,
  disabled,
  ...rest
}: CheckboxProps, ref) {
  const { resolved: t } = useTheme();
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  const hasError = Boolean(error);
  const message = hasError ? error : hint;
  return (
    <View style={{ gap: space(t, 'xxs') }}>
      <Pressable
        ref={ref}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: indeterminate ? 'mixed' : value, disabled }}
        accessibilityHint={message}
        disabled={disabled}
        onPress={() => setValue(indeterminate ? true : !value)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'sm'), opacity: disabled ? 0.6 : 1 }}
        {...rest}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: t.radius.xs,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: value || indeterminate ? t.color.accent.primary : t.color.border.strong,
            backgroundColor: value || indeterminate ? t.color.accent.primary : t.color.bg.raised,
          }}
        >
          {indeterminate ? (
            <View style={{ width: 8, height: 2, backgroundColor: '#fff', borderRadius: 1 }} />
          ) : value ? (
            <Icon name="check" size={12} color="#fff" strokeWidth={3} />
          ) : null}
        </View>
        {label ? <Text variant="body-sm">{label}</Text> : null}
      </Pressable>
      {message ? (
        <Text variant="caption" tone={hasError ? 'danger' : 'muted'} accessibilityRole={hasError ? 'alert' : undefined}>
          {message}
        </Text>
      ) : null}
    </View>
  );
});
