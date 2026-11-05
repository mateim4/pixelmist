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
  label?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  disabled,
  ...rest
}: CheckboxProps) {
  const { resolved: t } = useTheme();
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => setValue(!value)}
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
          borderColor: value ? t.color.accent.primary : t.color.border.strong,
          backgroundColor: value ? t.color.accent.primary : t.color.bg.raised,
        }}
      >
        {value ? <Icon name="check" size={12} color="#fff" strokeWidth={3} /> : null}
      </View>
      {label ? <Text variant="body-sm">{label}</Text> : null}
    </Pressable>
  );
}
