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

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'cream' | 'link' | 'ghost' | 'tertiary' | 'danger' | 'dangerTertiary';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** Icon-only button: renders just `icon`. `label` is then the required accessible name. */
  icon?: IconName;
  /** Accessible name for an icon-only button. */
  label?: string;
  style?: StyleProp<ViewStyle>;
  children?: string;
}

/** Native button — same API as @pixelmist/react. Native keeps the 44px touch default for md. */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    icon,
    label,
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
  // native density: sm 36 / md 44 (touch default) / lg 52
  const sizePad =
    size === 'sm'
      ? { padY: 6, padX: 12, minH: 36, text: 'body-sm-medium' }
      : size === 'lg'
        ? { padY: 12, padX: 24, minH: 52, text: 'body-md-medium' }
        : { padY: 10, padX: 20, minH: 44, text: 'button-md' };
  const padY = sizePad.padY;
  const padX = sizePad.padX;
  const minH = sizePad.minH;
  const textVariant = sizePad.text;
  const isDisabled = disabled || loading;
  const iconOnly = Boolean(icon) && !children;
  const bg = String(isDisabled ? t.color.border.default : v.bg);
  const fg = String(isDisabled ? t.color.fg.disabled : v.fg);

  return (
    <Pressable
      ref={ref as never}
      accessibilityRole="button"
      accessibilityLabel={iconOnly ? label : rest.accessibilityLabel}
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
          borderWidth: variant === 'link' || variant === 'ghost' ? 0 : 1,
          borderColor: isDisabled ? 'transparent' : String(v.border),
          borderRadius: Number(v.radius),
          paddingVertical: padY,
          paddingHorizontal: iconOnly ? 0 : padX,
          minHeight: minH,
          width: iconOnly ? minH : undefined,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        } as ViewStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        (icon ?? leftIcon) && <Icon name={(icon ?? leftIcon)!} size={size === 'sm' ? 14 : 16} color={fg} />
      )}
      {children ? (
        <Text variant={textVariant as TextVariant} style={{ color: fg }}>
          {children}
        </Text>
      ) : null}
      {rightIcon && !loading ? <Icon name={rightIcon} size={size === 'sm' ? 14 : 16} color={fg} /> : null}
    </Pressable>
  );
});
