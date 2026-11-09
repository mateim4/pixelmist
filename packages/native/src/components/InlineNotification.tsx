import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export type NotificationTone = 'error' | 'warning' | 'success' | 'info';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface InlineNotificationProps extends ViewProps {
  tone: NotificationTone;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose?: () => void;
  action?: NotificationAction;
}

const toneIcon: Record<NotificationTone, IconName> = {
  error: 'warning-filled',
  warning: 'warning',
  success: 'check',
  info: 'info',
};

/** Native inline notification. accessibilityRole: alert for error, status otherwise. */
export const InlineNotification = forwardRef<View, InlineNotificationProps>(function InlineNotification(
  { tone, title, subtitle, onClose, action, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const toneColor = t.color.status[tone === 'error' ? 'danger' : tone];
  const soft = t.color.status[`${tone === 'error' ? 'danger' : tone}Soft` as keyof typeof t.color.status] as string;
  return (
    <View
      ref={ref}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion={tone === 'error' ? undefined : 'polite'}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: space(t, 'sm'),
          padding: space(t, 'sm'),
          backgroundColor: soft,
          borderLeftWidth: 3,
          borderLeftColor: toneColor,
          borderRadius: t.radius.md,
        },
        style,
      ]}
      {...rest}
    >
      <Icon name={toneIcon[tone]} size={18} color={toneColor} />
      <View style={{ flex: 1 }}>
        <Text variant="body-sm-medium">{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="muted">
            {subtitle}
          </Text>
        ) : null}
        {action ? (
          <Pressable accessibilityRole="button" onPress={action.onClick} style={{ marginTop: space(t, 'xxs') }}>
            <Text variant="body-sm-medium" tone="link">
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {onClose ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss notification" onPress={onClose} hitSlop={8}>
          <Icon name="x" size={14} color={t.color.fg.muted} />
        </Pressable>
      ) : null}
    </View>
  );
});
