import { Modal, Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import type { Size } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Box } from './Box';
import { Button } from './Button';
import type { ButtonVariant } from './Button';

export interface DialogAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
}

export interface DialogProps extends ViewProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Custom footer (overrides primaryAction/secondaryAction). */
  actions?: ReactNode;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  /** Passive dialog: no footer. */
  passive?: boolean;
  /** Danger flavour: the primary action renders as a danger button. */
  danger?: boolean;
  size?: Size;
}

/** Native dialog via RN Modal (fade). Same API as web Dialog. */
export const Dialog = forwardRef<View, DialogProps>(function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  primaryAction,
  secondaryAction,
  passive = false,
  danger = false,
  size = 'md',
  ...rest
}: DialogProps, ref: Ref<View>) {
  const { resolved: t } = useTheme();
  const maxWidth = size === 'sm' ? 360 : size === 'lg' ? 720 : 480;
  const footer =
    actions !== undefined ? (
      actions
    ) : passive ? null : (
      <>
        {secondaryAction ? (
          <Button variant="tertiary" onPress={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        ) : null}
        {primaryAction ? (
          <Button variant={danger ? 'danger' : 'primary'} loading={primaryAction.loading} onPress={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        ) : null}
      </>
    );
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange?.(false)}>
      <Pressable
        style={{ flex: 1, backgroundColor: t.color.bg.overlay, justifyContent: 'center', padding: space(t, 'xl') }}
        onPress={() => onOpenChange?.(false)}
      >
        <Pressable
          ref={ref}
          accessibilityViewIsModal
          accessibilityRole="alert"
          accessibilityLabel={typeof title === 'string' ? title : undefined}
          style={{
            backgroundColor: t.color.bg.raised,
            borderRadius: t.radius.xl,
            borderWidth: 1,
            borderColor: t.color.border.default,
            padding: space(t, 'xxl'),
            maxHeight: '85%',
            width: '100%',
            maxWidth,
            alignSelf: 'center',
          }}
          onPress={(e) => e.stopPropagation()}
          {...rest}
        >
          {title ? (
            <Text variant="heading-4" tone={danger ? 'danger' : 'default'}>
              {title}
            </Text>
          ) : null}
          {description ? (
            <Box paddingY="xs">
              <Text variant="body-sm" tone="muted">
                {description}
              </Text>
            </Box>
          ) : null}
          <Box style={{ marginBottom: space(t, 'lg') }}>{children}</Box>
          {footer ? (
            <Box direction="row" justify="flex-end" gap="sm">
              {footer}
            </Box>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
});
