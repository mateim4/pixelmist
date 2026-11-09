import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import type { SpaceValue } from '../theme/helpers';

export interface GridBreakpoints {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface GridProps extends ViewProps {
  columns: number | GridBreakpoints;
  gap?: SpaceValue;
}

/**
 * Native grid: wraps children into rows of `columns` columns.
 * Responsive breakpoint counts are a web concept; on native use the base count.
 */
export const Grid = forwardRef<View, GridProps>(function Grid({ columns, gap = 'md', children, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const n = typeof columns === 'number' ? columns : columns.base ?? 1;
  const g = space(t, gap);
  const items = Array.isArray(children) ? children : [children];
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += n) rows.push(items.slice(i, i + n));
  return (
    <View ref={ref} style={[{ gap: g }, style]} {...rest}>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', gap: g }}>
          {row.map((child, ci) => (
            <View key={ci} style={{ flex: 1, minWidth: 0 } as ViewStyle}>
              {child}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
});
