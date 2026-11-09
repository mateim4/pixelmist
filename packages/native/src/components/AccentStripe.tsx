import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

export interface AccentStripeProps extends ViewProps {
  height?: number;
}

/** Brand signature band: violet→indigo→blue→ice gradient (stops from the dusk/blue palette tokens). */
export const AccentStripe = forwardRef<View, AccentStripeProps>(function AccentStripe({ height = 10, style, ...rest }: AccentStripeProps, ref) {
  const { resolved: t } = useTheme();
  const D = t.palette.dusk as unknown as Record<string, string>;
  const B = t.palette.blue as unknown as Record<string, string>;
  const stops = [D['950'], D['900'], D['700'], D['500'], B['500'], B['300'], B['100']];
  return (
    <View ref={ref} style={[{ width: '100%', height, overflow: 'hidden' }, style]} {...rest}>
      <Svg width="100%" height={height}>
        <Defs>
          <LinearGradient id="pm-accent-stripe" x1="0" y1="0" x2="1" y2="0">
            {stops.map((c, i) => (
              <Stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height={height} fill="url(#pm-accent-stripe)" />
      </Svg>
    </View>
  );
});
