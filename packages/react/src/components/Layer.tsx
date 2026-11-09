import { createContext, forwardRef, useContext } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

const LayerContext = createContext(0);

export interface LayerProps extends HTMLAttributes<HTMLDivElement> {
  /** Explicit level; otherwise nests one deeper than the parent Layer. */
  level?: number;
}

/**
 * Surface level. A nested Layer automatically takes the next surface token, so a
 * card inside a panel still stands out: level 0 → bg.surface, 1 → bg.raised,
 * 2+ → bg.canvas. Driven by data-level + CSS vars, theme-aware.
 */
export const Layer = forwardRef(function Layer({ level, className, children, ...rest }: LayerProps, ref: Ref<HTMLDivElement>) {
  const parent = useContext(LayerContext);
  const current = level ?? parent + 1;
  return (
    <LayerContext.Provider value={current}>
      <div ref={ref} className={cx('pm-layer', className)} data-level={Math.min(current, 2)} {...rest}>
        {children}
      </div>
    </LayerContext.Provider>
  );
});

/** Current layer level (0 = outermost). */
export function useLayer(): number {
  return useContext(LayerContext);
}
