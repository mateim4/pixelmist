import { forwardRef } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import type { Size } from '@pixelmist/core';

import { useTheme } from '../theme/ThemeProvider';
import { space, asTokens } from '../theme/helpers';
import type { TextVariant } from '@pixelmist/tokens';
import { Text } from './Text';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'cream' | 'link';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  style?: StyleProp<ViewStyle>;
  children?: string;
}

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    style,
    children,
    onPress,
    ...rest
  }: ButtonProps,
  ref,
) {
  const { resolved: t } = useTheme();
  const v = asTokens(asTokens(t.components.button)[variant] ?? {});
  const sizePad =
    size === 'sm'
      ? { padY: 6, padX: 12, minH: 36, text: 'body-sm-medium' }
      : size === 'lg'
        ? { padY: 12, padX: 24, minH: 52, text: 'body-md-medium' }
        : null;
  const padY = sizePad?.padY ?? Number(v.padY);
  const padX = sizePad?.padX ?? Number(v.padX);
  const minH = sizePad?.minH ?? Number(v.minHeight);
  const textVariant = sizePad?.text ?? 'button-md';
  const isDisabled = disabled || loading;
  const bg = String(isDisabled ? t.color.border.default : v.bg);
  const fg = String(isDisabled ? t.color.fg.disabled : v.fg);

  return (
    <Pressable
      ref={ref as never}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space(t, 'xs'),
          backgroundColor: pressed && !isDisabled ? String(v.bgActive) : bg,
          borderWidth: variant === 'link' ? 0 : 1,
          borderColor: isDisabled ? 'transparent' : String(v.border),
          borderRadius: Number(v.radius),
          paddingVertical: padY,
          paddingHorizontal: padX,
          minHeight: minH,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        } as ViewStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : leftIcon ? (
        <Icon name={leftIcon} size={16} color={fg} />
      ) : null}
      {children ? (
        <Text variant={textVariant as TextVariant} style={{ color: fg }}>
          {children}
        </Text>
      ) : null}
      {rightIcon && !loading ? <Icon name={rightIcon} size={16} color={fg} /> : null}
    </Pressable>
  );
});
