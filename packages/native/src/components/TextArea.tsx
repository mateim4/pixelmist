import { forwardRef } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { asTokens, space, textStyle } from '../theme/helpers';
import { Text } from './Text';

export interface TextAreaProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { label, hint, error, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const input = asTokens(asTokens(t.components.input)['default'] ?? {});
  const hasError = Boolean(error);
  return (
    <View style={{ gap: space(t, 'xxs') }}>
      {label ? <Text variant="body-sm-medium">{label}</Text> : null}
      <TextInput
        ref={ref}
        multiline
        accessibilityLabel={label}
        accessibilityHint={hint ?? error}
        style={[
          {
            minHeight: 96,
            textAlignVertical: 'top',
            backgroundColor: String(input.bg),
            color: String(input.fg),
            borderWidth: 1,
            borderColor: hasError ? t.color.status.danger : String(input.border),
            borderRadius: Number(input.radius),
            padding: space(t, 'sm'),
            ...(textStyle(t, 'body-md') as object),
          },
          style,
        ]}
        placeholderTextColor={String(input.placeholder)}
        {...rest}
      />
      {hasError ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});
