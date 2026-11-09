import { forwardRef, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useReducedMotion } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Box } from './Box';
import { useTweenedNumber } from '../hooks/useTweenedNumber';

export interface XPBarProps extends ViewProps {
  /** XP earned into the current level. */
  value: number;
  /** XP needed to reach the next level. */
  max: number;
  /** Current level, shown as a "Lv n" chip. */
  level?: number;
  /** Show the tweened "x / y XP" readout (default true). */
  showValue?: boolean;
  label?: string;
  hint?: string;
}

/**
 * XP bar — gamification primitive, same API as web. Progress into the current level,
 * toned `progress` (in flight). The readout tweens (≤400ms, instant under reduced
 * motion); the fill animates via Animated. forwardRef + prop pass-through.
 */
export const XPBar = forwardRef<View, XPBarProps>(function XPBar(
  { value, max, level, showValue = true, label, hint, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const reduced = useReducedMotion();
  const tones = t.color.tones as unknown as Record<
    string,
    { surface: string; border: string; text: string; strong: string; onStrong: string }
  >;
  const progress = tones.progress!;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(safeMax, value)) : 0;
  const pct = (clamped / safeMax) * 100;
  const tweened = useTweenedNumber(Math.round(clamped));
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    if (reduced) {
      anim.setValue(pct);
      return;
    }
    Animated.timing(anim, {
      toValue: pct,
      duration: Number(t.motion.duration.normal),
      useNativeDriver: false,
    }).start();
  }, [pct, reduced, anim, t.motion.duration.normal]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View ref={ref} style={[{ gap: space(t, 'xxs') }, style]} {...rest}>
      <Box direction="row" justify="space-between" align="center">
        {level !== undefined ? (
          <Text
            variant="caption"
            style={{
              color: progress.text,
              backgroundColor: progress.surface,
              borderWidth: 1,
              borderColor: progress.border,
              borderRadius: t.radius.full,
              paddingHorizontal: space(t, 'xs'),
              fontWeight: '600',
            }}
          >
            Lv {level}
          </Text>
        ) : (
          <View />
        )}
        {showValue ? (
          <Text variant="caption" tone="muted">
            {Math.round(tweened)} / {safeMax} XP
          </Text>
        ) : null}
      </Box>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={label ?? (level !== undefined ? `Level ${level} progress` : 'XP progress')}
        accessibilityValue={{ min: 0, max: safeMax, now: Math.round(clamped), text: `${Math.round(clamped)} of ${safeMax} XP${level !== undefined ? `, level ${level}` : ''}` }}
        accessibilityState={{ busy: true }}
        style={{
          height: 8,
          borderRadius: t.radius.full,
          backgroundColor: t.color.bg.surface,
          borderWidth: 1,
          borderColor: t.color.border.soft,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            width: width as never,
            borderRadius: t.radius.full,
            backgroundColor: progress.strong,
          }}
        />
      </View>
      {hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
});
