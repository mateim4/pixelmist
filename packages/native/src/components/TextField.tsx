import { forwardRef } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import type { Size } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { textStyle, space, asTokens } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export interface TextFieldProps extends Omit<TextInputProps, 'placeholderTextColor'> {
  label?: string;
  /** Visually hide the label (still announced to AT via accessibilityLabel). */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  /** Warning state with its own message (does not mark invalid). */
  warning?: string;
  size?: Size;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, hideLabel = false, hint, error, warning, size = 'md', leftIcon, rightIcon, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const input = asTokens(asTokens(t.components.input)['default'] ?? {});
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  // native keeps the 44px touch default for md
  const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const message = hasError ? error : hasWarning ? warning : hint;
  return (
    <View style={{ gap: space(t, 'xxs') }} accessibilityLabel={label}>
      {label && !hideLabel ? <Text variant="body-sm-medium">{label}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leftIcon ? (
          <View style={{ position: 'absolute', left: space(t, 'md'), zIndex: 1 }}>
            <Icon name={leftIcon} size={16} color={t.color.fg.subtle} />
          </View>
        ) : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label ?? rest.accessibilityLabel}
          accessibilityHint={message}
          accessibilityState={rest.accessibilityState}
          style={[
            {
              flex: 1,
              height,
              backgroundColor: String(input.bg),
              color: String(input.fg),
              borderWidth: 1,
              borderColor: hasError
                ? t.color.status.danger
                : hasWarning
                  ? t.color.status.warning
                  : String(input.border),
              borderRadius: Number(input.radius),
              paddingHorizontal: space(t, 'md'),
              paddingLeft: leftIcon ? 40 : space(t, 'md'),
              paddingRight: rightIcon ? 40 : space(t, 'md'),
              ...(textStyle(t, 'body-md') as object),
            },
            style,
          ]}
          placeholderTextColor={String(input.placeholder)}
          editable={rest.editable}
          {...rest}
        />
        {rightIcon ? (
          <View style={{ position: 'absolute', right: space(t, 'md'), zIndex: 1 }}>
            <Icon name={rightIcon} size={16} color={t.color.fg.subtle} />
          </View>
        ) : null}
      </View>
      {message ? (
        <Text variant="caption" tone={hasError ? 'danger' : hasWarning ? 'warning' : 'muted'} accessibilityRole={hasError ? 'alert' : undefined}>
          {message}
        </Text>
      ) : null}
    </View>
  );
});
