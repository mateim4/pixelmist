import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Box } from './Box';

export interface ProgressProps {
  value?: number;
  label?: string;
  showValue?: boolean;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

export function Progress({ value, label, showValue = false, tone = 'accent' }: ProgressProps) {
  const { resolved: t } = useTheme();
  const indeterminate = value === undefined;
  const pct = indeterminate ? 100 : Math.max(0, Math.min(100, value));
  const anim = useRef(new Animated.Value(indeterminate ? 0 : pct)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!indeterminate) {
      Animated.timing(anim, {
        toValue: pct,
        duration: Number(t.motion.duration.slow),
        easing: undefined as never,
        useNativeDriver: false,
      }).start();
    } else {
      const loop = Animated.loop(Animated.timing(slide, { toValue: 1, duration: 1200, useNativeDriver: true }));
      loop.start();
      return () => loop.stop();
    }
  }, [pct, indeterminate]);

  const fillColor = tone === 'accent' ? t.color.accent.primary : t.color.status[tone];
  const width = indeterminate
    ? slide.interpolate({ inputRange: [0, 1], outputRange: ['-40%' as never, '100%' as never] })
    : anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View>
      {label || showValue ? (
        <Box direction="row" justify="space-between" paddingY="xxs">
          {label ? <Text variant="body-sm-medium">{label}</Text> : <View />}
          {showValue && !indeterminate ? (
            <Text variant="caption" tone="muted">
              {Math.round(pct)}%
            </Text>
          ) : null}
        </Box>
      ) : null}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: indeterminate ? undefined : Math.round(pct) }}
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
            width: indeterminate ? '40%' : width,
            borderRadius: t.radius.full,
            backgroundColor: fillColor,
            transform: indeterminate
              ? [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-160, 400] }) }]
              : [],
          }}
        />
      </View>
    </View>
  );
}
