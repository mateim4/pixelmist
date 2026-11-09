import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useReducedMotion } from 'react-native';
import type { ReactNode } from 'react';
import type { IconName } from '@pixelmist/icons';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export interface AchievementToastAction {
  label: string;
  onClick: () => void;
}

export interface AchievementToastProps extends ViewProps {
  title: ReactNode;
  description?: ReactNode;
  /** Icon, default `trophy`. */
  icon?: IconName;
  action?: AchievementToastAction;
  onClose?: () => void;
  closeLabel?: string;
  /**
   * ms until auto-dismiss (default 6000); 0 = sticky. Never auto-dismisses under
   * reduced motion. (Native has no hover, so there is no pause-on-hover here.)
   */
  duration?: number;
}

/**
 * Achievement toast — gamification primitive, same API as web. A settled (done) card:
 * icon, title, optional description/action, close. Polite live region.
 * forwardRef + prop pass-through.
 */
export const AchievementToast = forwardRef<View, AchievementToastProps>(function AchievementToast(
  { title, description, icon = 'trophy', action, onClose, closeLabel = 'Dismiss', duration = 6000, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const reduced = useReducedMotion();
  const tones = t.color.tones as unknown as Record<
    string,
    { surface: string; border: string; text: string; strong: string; onStrong: string }
  >;
  const settled = tones.settled!;
  const [gone, setGone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const close = useCallback(() => {
    if (timer.current !== undefined) clearTimeout(timer.current);
    setGone(true);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!reduced && duration > 0) timer.current = setTimeout(close, duration);
    return () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    };
  }, [close, duration, reduced]);

  if (gone) return null;
  return (
    <View
      ref={ref}
      accessibilityLiveRegion="polite"
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: space(t, 'sm'),
          padding: space(t, 'sm'),
          backgroundColor: settled.surface,
          borderWidth: 1,
          borderColor: settled.border,
          borderRadius: t.radius.md,
        },
        style,
      ]}
      {...rest}
    >
      <Icon name={icon} size={18} color={settled.strong} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body-sm-medium">{title}</Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
        {action ? (
          <Pressable accessibilityRole="button" onPress={action.onClick} style={{ minHeight: 24, alignSelf: 'flex-start' }}>
            <Text variant="caption" style={{ fontWeight: '600', color: settled.strong, textDecorationLine: 'underline' }}>
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={close} style={{ minWidth: 24, minHeight: 24 }}>
        <Icon name="x" size={14} color={t.color.fg.muted} />
      </Pressable>
    </View>
  );
});
