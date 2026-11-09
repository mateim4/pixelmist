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
  warning?: string;
  /** Show a character counter against maxLength. */
  showCount?: boolean;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { label, hint, error, warning, showCount = false, maxLength, value, defaultValue, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const input = asTokens(asTokens(t.components.input)['default'] ?? {});
  const hasError = Boolean(error);
  const hasWarning = !hasError && Boolean(warning);
  const message = hasError ? error : hasWarning ? warning : hint;
  const len = typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0;
  return (
    <View style={{ gap: space(t, 'xxs') }}>
      {label ? <Text variant="body-sm-medium">{label}</Text> : null}
      <TextInput
        ref={ref}
        multiline
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        accessibilityLabel={label}
        accessibilityHint={message}
        style={[
          {
            minHeight: 96,
            textAlignVertical: 'top',
            backgroundColor: String(input.bg),
            color: String(input.fg),
            borderWidth: 1,
            borderColor: hasError ? t.color.status.danger : hasWarning ? t.color.status.warning : String(input.border),
            borderRadius: Number(input.radius),
            padding: space(t, 'sm'),
            ...(textStyle(t, 'body-md') as object),
          },
          style,
        ]}
        placeholderTextColor={String(input.placeholder)}
        {...rest}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {message ? (
          <Text variant="caption" tone={hasError ? 'danger' : hasWarning ? 'warning' : 'muted'} accessibilityRole={hasError ? 'alert' : undefined}>
            {message}
          </Text>
        ) : null}
        {showCount && maxLength ? (
          <Text variant="micro" tone="subtle">
            {len}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
});
