import { Switch as RNSwitch } from 'react-native';
import type { SwitchProps as RNSwitchProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';

export interface SwitchProps extends Omit<RNSwitchProps, 'value' | 'onValueChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, defaultChecked = false, onCheckedChange, ...rest }: SwitchProps) {
  const { resolved: t } = useTheme();
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  return (
    <RNSwitch
      value={value}
      onValueChange={setValue}
      trackColor={{ false: t.color.border.strong, true: t.color.accent.primary }}
      thumbColor="#ffffff"
      {...rest}
    />
  );
}
