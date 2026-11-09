import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';
import { Button } from './Button';

export interface PermissionPromptProps extends ViewProps {
  action: ReactNode;
  onAllowOnce: () => void;
  onAlwaysAllow: () => void;
  onDeny: () => void;
  title?: ReactNode;
}

/** Native permission prompt card: Allow once / Always allow / Deny. */
export const PermissionPrompt = forwardRef<View, PermissionPromptProps>(function PermissionPrompt(
  { action, onAllowOnce, onAlwaysAllow, onDeny, title = 'Permission requested', style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const tn = t.color.tones.attention;
  return (
    <View
      ref={ref}
      accessibilityRole="alert"
      style={[{ backgroundColor: tn.surface, borderWidth: 1, borderColor: tn.border, borderRadius: t.radius.lg, padding: space(t, 'md'), gap: space(t, 'sm') }, style]}
      {...rest}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'xs') }}>
        <Icon name="lock" size={16} color={tn.text} />
        <Text variant="body-sm-medium" style={{ color: tn.text }}>
          {title}
        </Text>
      </View>
      <Text variant="code-md">{action}</Text>
      <View style={{ flexDirection: 'row', gap: space(t, 'xs'), flexWrap: 'wrap' }}>
        <Button variant="primary" size="sm" onPress={onAllowOnce}>
          Allow once
        </Button>
        <Button variant="tertiary" size="sm" onPress={onAlwaysAllow}>
          Always allow
        </Button>
        <Button variant="dangerTertiary" size="sm" onPress={onDeny}>
          Deny
        </Button>
      </View>
    </View>
  );
});
