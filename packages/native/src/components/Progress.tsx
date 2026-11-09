import { forwardRef, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useReducedMotion } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Box } from './Box';

export type ProgressStatus = 'active' | 'finished' | 'error';

export interface ProgressProps extends ViewProps {
  value?: number;
  label?: string;
  /** Helper text under the bar. */
  hint?: string;
  showValue?: boolean;
  /**
   * Status drives the tone (colour means state): active → progress, finished → settled,
   * error → danger. There is deliberately no `tone` prop.
   */
  status?: ProgressStatus;
}

/** Native progress bar — same API as web. forwardRef + prop pass-through. */
export const Progress = forwardRef<View, ProgressProps>(function Progress(
  { value, label, hint, showValue = false, status = 'active', style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const reduced = useReducedMotion();
  const tones = t.color.tones as unknown as Record<
    string,
    { surface: string; border: string; text: string; strong: string; onStrong: string }
  >;
  const indeterminate = value === undefined || !Number.isFinite(value);
  const pct = indeterminate ? 100 : Math.max(0, Math.min(100, value));
  const anim = useRef(new Animated.Value(indeterminate ? 0 : pct)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!indeterminate) {
      if (reduced) {
        anim.setValue(pct);
        return;
      }
      Animated.timing(anim, {
        toValue: pct,
        duration: Number(t.motion.duration.normal),
        useNativeDriver: false,
      }).start();
    } else if (!reduced) {
      const loop = Animated.loop(Animated.timing(slide, { toValue: 1, duration: 1200, useNativeDriver: true }));
      loop.start();
      return () => loop.stop();
    }
  }, [pct, indeterminate, reduced, anim, slide, t.motion.duration.normal]);

  const fillColor =
    status === 'finished' ? tones.settled!.strong : status === 'error' ? t.color.status.danger : tones.progress!.strong;
  const width = indeterminate
    ? slide.interpolate({ inputRange: [0, 1], outputRange: ['-40%' as never, '100%' as never] })
    : anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View ref={ref} style={style} {...rest}>
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
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: indeterminate ? undefined : Math.round(pct) }}
        accessibilityState={{ busy: status === 'active' || undefined }}
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
            width: indeterminate ? '40%' : (width as never),
            borderRadius: t.radius.full,
            backgroundColor: fillColor,
            transform: indeterminate
              ? [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-160, 400] }) }]
              : [],
          }}
        />
      </View>
      {hint ? (
        <Box paddingY="xxs">
          <Text variant="caption" tone="muted">
            {hint}
          </Text>
        </Box>
      ) : null}
    </View>
  );
});
