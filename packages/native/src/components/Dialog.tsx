import { Modal, Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { space, asTokens } from '../theme/helpers';
import { Text } from './Text';
import { Box } from './Box';

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

/** Native dialog via RN Modal (fade). */
export function Dialog({ open, onOpenChange, title, description, children, actions }: DialogProps) {
  const { resolved: t } = useTheme();
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange?.(false)}>
      <Pressable
        style={{ flex: 1, backgroundColor: t.color.bg.overlay, justifyContent: 'center', padding: space(t, 'xl') }}
        onPress={() => onOpenChange?.(false)}
      >
        <Pressable
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={{
            backgroundColor: t.color.bg.raised,
            borderRadius: t.radius.xl,
            borderWidth: 1,
            borderColor: t.color.border.default,
            padding: space(t, 'xxl'),
            maxHeight: '85%',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? <Text variant="heading-4">{title}</Text> : null}
          {description ? (
            <Box paddingY="xs">
              <Text variant="body-sm" tone="muted">
                {description}
              </Text>
            </Box>
          ) : null}
          <Box style={{ marginBottom: space(t, 'lg') }}>{children}</Box>
          {actions ? (
            <Box direction="row" justify="flex-end" gap="sm">
              {actions}
            </Box>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
