import { forwardRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export type InlineLoadingStatus = 'active' | 'finished' | 'error';

export interface InlineLoadingProps extends ViewProps {
  status: InlineLoadingStatus;
  label: string;
  finishedLabel?: string;
  errorLabel?: string;
}

/** Native inline loading: spinner + text; finished shows a check, error a warning. */
export const InlineLoading = forwardRef<View, InlineLoadingProps>(function InlineLoading(
  { status, label, finishedLabel, errorLabel, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const text = status === 'finished' && finishedLabel ? finishedLabel : status === 'error' && errorLabel ? errorLabel : label;
  const color = status === 'finished' ? t.color.status.success : status === 'error' ? t.color.status.danger : t.color.fg.default;
  return (
    <View ref={ref} accessibilityRole="progressbar" style={[{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'xs') }, style]} {...rest}>
      {status === 'active' ? <ActivityIndicator size="small" color={t.color.accent.primary} /> : null}
      {status === 'finished' ? <Icon name="check" size={16} color={color} /> : null}
      {status === 'error' ? <Icon name="warning-filled" size={16} color={color} /> : null}
      <Text variant="body-sm" style={{ color }}>
        {text}
      </Text>
    </View>
  );
});
