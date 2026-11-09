import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Tween a displayed number toward `value` over `duration` ms (the motion rule allows a
 * number tween to run longer than a normal transition, never past 400ms). Ease-out cubic.
 * Under `prefers-reduced-motion` the value jumps instantly.
 */
export function useTweenedNumber(value: number, duration = 320): number {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = displayRef.current;
    if (from === value) return;
    const reduced =
      typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION).matches;
    if (reduced || typeof requestAnimationFrame !== 'function') {
      displayRef.current = value;
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = t >= 1 ? value : from + (value - from) * eased;
      displayRef.current = v;
      setDisplay(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display;
}
