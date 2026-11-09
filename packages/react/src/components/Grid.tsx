import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import type { SpaceValue } from './Box';
import { spaceCss } from './Box';

export interface GridBreakpoints {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed column count, or per-breakpoint counts. */
  columns: number | GridBreakpoints;
  gap?: SpaceValue;
}

/**
 * Responsive column grid. `columns={3}` is fixed; `columns={{ base: 1, md: 2, lg: 4 }}`
 * maps to the layout breakpoints (sm 640 / md 768 / lg 1024 / xl 1280) via data attributes.
 */
export const Grid = forwardRef(function Grid({ columns, gap = 'md', className, style, ...rest }: GridProps, ref: Ref<HTMLDivElement>) {
  const bp = typeof columns === 'number' ? { base: columns } : columns;
  return (
    <div
      ref={ref}
      className={cx('pm-grid', className)}
      style={{ gap: spaceCss(gap), ...style }}
      data-cols-base={bp.base}
      data-cols-sm={bp.sm}
      data-cols-md={bp.md}
      data-cols-lg={bp.lg}
      data-cols-xl={bp.xl}
      {...rest}
    />
  );
});
