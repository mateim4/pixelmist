import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export interface StreakProps extends ViewProps {
  /** Consecutive active days. */
  days: number;
}

/**
 * Streak chip — gamification primitive, same API as web. A live streak is `attention`
 * (it needs a person today); a count of zero is never toned — it renders neutral.
 * forwardRef + pass-through.
 */
export const Streak = forwardRef<View, StreakProps>(function Streak({ days, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const tones = t.color.tones as unknown as Record<
    string,
    { surface: string; border: string; text: string; strong: string; onStrong: string }
  >;
  const n = Math.max(0, Math.floor(days));
  const attention = n > 0;
  const tone = attention ? tones.attention! : null;
  return (
    <View
      ref={ref}
      accessibilityLabel={`${n} day streak`}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: space(t, 'xxs'),
          borderRadius: t.radius.full,
          borderWidth: 1,
          paddingHorizontal: space(t, 'xs'),
          backgroundColor: tone ? tone.surface : t.color.bg.surface,
          borderColor: tone ? tone.border : t.color.border.default,
        },
        style,
      ]}
      {...rest}
    >
      <Icon name="flame" size={16} color={tone ? tone.text : t.color.fg.muted} />
      <Text variant="caption" style={{ fontWeight: '600', color: tone ? tone.text : t.color.fg.muted }}>
        {n} {n === 1 ? 'day' : 'days'} streak
      </Text>
    </View>
  );
});
