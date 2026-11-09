import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';

export interface LegendItem {
  label: string;
  /** CSS colour or categorical index (0–7). */
  color: string | number;
}

export interface LegendProps extends HTMLAttributes<HTMLDivElement> {
  items: LegendItem[];
  direction?: 'horizontal' | 'vertical';
}

/** Legend: swatches with labels, horizontal or vertical. */
export const Legend = forwardRef(function Legend(
  { items, direction = 'horizontal', className, ...rest }: LegendProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={cx('pm-legend', `pm-legend--${direction}`, className)} role="list" {...rest}>
      {items.map((item) => (
        <span className="pm-legend__item" role="listitem" key={item.label}>
          <span
            className="pm-legend__swatch"
            style={{ backgroundColor: typeof item.color === 'number' ? `var(--pm-color-dataviz-categorical-${item.color})` : item.color }}
            aria-hidden
          />
          <span className="pm-legend__label">{item.label}</span>
        </span>
      ))}
    </div>
  );
});
