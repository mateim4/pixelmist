import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

export interface SunsetStripeProps extends ViewProps {
  height?: number;
}

/** Brand signature band: red→orange→yellow→cream gradient (stops from the palette tokens). */
export function SunsetStripe({ height = 10, style, ...rest }: SunsetStripeProps) {
  const { resolved: t } = useTheme();
  const S = t.palette.sunset as unknown as Record<string, string>;
  const stops = [S['900'], S['800'], S['700'], S['600'], S['400'], S['300'], String(t.palette.cream.DEFAULT)];
  return (
    <View style={[{ width: '100%', height, overflow: 'hidden' }, style]} {...rest}>
      <Svg width="100%" height={height}>
        <Defs>
          <LinearGradient id="pm-sunset" x1="0" y1="0" x2="1" y2="0">
            {stops.map((c, i) => (
              <Stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height={height} fill="url(#pm-sunset)" />
      </Svg>
    </View>
  );
}
