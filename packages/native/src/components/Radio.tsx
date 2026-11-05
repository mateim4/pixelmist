import { createContext, forwardRef, useContext } from 'react';
import { Pressable, View } from 'react-native';
import type { PressableProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';

interface RadioGroupContextValue {
  value?: string;
  setValue: (v: string) => void;
}
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  children?: React.ReactNode;
}

export function RadioGroup({ value, defaultValue, onValueChange, label, children }: RadioGroupProps) {
  const { resolved: t } = useTheme();
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange ? (v) => onValueChange(v as string) : undefined,
  );
  return (
    <RadioGroupContext.Provider value={{ value: current, setValue: setCurrent }}>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ gap: space(t, 'sm') }}>
        {label ? <Text variant="body-sm-medium">{label}</Text> : null}
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps extends Omit<PressableProps, 'onPress'> {
  value: string;
  label?: string;
  disabled?: boolean;
}

export const Radio = forwardRef<View, RadioProps>(function Radio({ value, label, disabled, ...rest }, ref) {
  const ctx = useContext(RadioGroupContext);
  const { resolved: t } = useTheme();
  if (!ctx) throw new Error('Radio must be used inside <RadioGroup>');
  const checked = ctx.value === value;
  return (
    <Pressable
      ref={ref}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => ctx.setValue(value)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'sm'), opacity: disabled ? 0.6 : 1 }}
      {...rest}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: checked ? t.color.accent.primary : t.color.border.strong,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.color.bg.raised,
        }}
      >
        {checked ? (
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.color.accent.primary }} />
        ) : null}
      </View>
      {label ? <Text variant="body-sm">{label}</Text> : null}
    </Pressable>
  );
});
