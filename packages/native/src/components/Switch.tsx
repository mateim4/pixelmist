import { forwardRef } from 'react';
import type { ElementRef } from 'react';
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

export const Switch = forwardRef<ElementRef<typeof RNSwitch>, SwitchProps>(function Switch({ checked, defaultChecked = false, onCheckedChange, ...rest }: SwitchProps, ref) {
  const { resolved: t } = useTheme();
  const [value, setValue] = useControllableState<boolean>(checked, defaultChecked, onCheckedChange);
  return (
    <RNSwitch
      ref={ref}
      value={value}
      onValueChange={setValue}
      trackColor={{ false: t.color.border.strong, true: t.color.accent.primary }}
      thumbColor="#ffffff"
      {...rest}
    />
  );
});
