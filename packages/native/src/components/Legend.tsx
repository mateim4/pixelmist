import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';

export interface LegendItem {
  label: string;
  color: string | number;
}

export interface LegendProps extends ViewProps {
  items: LegendItem[];
  direction?: 'horizontal' | 'vertical';
}

/** Native legend: swatches with labels, horizontal or vertical. */
export const Legend = forwardRef<View, LegendProps>(function Legend({ items, direction = 'horizontal', style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  return (
    <View
      ref={ref}
      style={[direction === 'vertical' ? { flexDirection: 'column', gap: space(t, 'xs') } : { flexDirection: 'row', gap: space(t, 'md'), flexWrap: 'wrap' }, style]}
      {...rest}
    >
      {items.map((item) => (
        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'xs') }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: t.radius.xs,
              borderWidth: 1,
              borderColor: t.color.border.default,
              backgroundColor: typeof item.color === 'number' ? (t.color.dataviz.categorical as string[])[item.color] : item.color,
            }}
          />
          <Text variant="caption" tone="muted">
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
});
