import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export interface LevelBadgeProps extends ViewProps {
  /** Current level. */
  level: number;
}

/**
 * Level badge — gamification primitive, same API as web. Medal icon + "Lv n".
 * A level is not a state, so it is always neutral. forwardRef + pass-through.
 */
export const LevelBadge = forwardRef<View, LevelBadgeProps>(function LevelBadge({ level, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  return (
    <View
      ref={ref}
      accessibilityLabel={`Level ${level}`}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: space(t, 'xxs'),
          backgroundColor: t.color.bg.surface,
          borderWidth: 1,
          borderColor: t.color.border.default,
          borderRadius: t.radius.full,
          paddingHorizontal: space(t, 'xs'),
        },
        style,
      ]}
      {...rest}
    >
      <Icon name="medal" size={16} color={t.color.fg.default} />
      <Text variant="caption" style={{ fontWeight: '600', color: t.color.fg.default }}>
        Lv {level}
      </Text>
    </View>
  );
});
