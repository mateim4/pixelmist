import { useEffect, useRef, useState } from 'react';
import { Animated, useReducedMotion } from 'react-native';

/**
 * Tween a displayed number toward `value` over `duration` ms (≤400ms per the motion rule).
 * Under reduced motion the value jumps instantly.
 */
export function useTweenedNumber(value: number, duration = 320): number {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    if (reduced) {
      anim.setValue(value);
      setDisplay(value);
      return;
    }
    const id = anim.addListener(({ value: v }) => setDisplay(v));
    Animated.timing(anim, { toValue: value, duration, useNativeDriver: false }).start();
    return () => anim.removeListener(id);
  }, [value, reduced, duration, anim]);

  return display;
}
