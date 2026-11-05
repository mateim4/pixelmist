import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function TypingDots() {
  const { resolved: t } = useTheme();
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, { toValue: -4, duration: 240, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 240, useNativeDriver: true }),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);
  return (
    <View
      accessibilityLabel="Generating"
      accessibilityRole="progressbar"
      style={{ flexDirection: 'row', gap: 4, paddingVertical: 8 }}
    >
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: t.color.fg.subtle,
            transform: [{ translateY: d }],
          }}
        />
      ))}
    </View>
  );
}
