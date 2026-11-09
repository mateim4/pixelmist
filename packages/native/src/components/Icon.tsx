import { forwardRef } from 'react';
import { iconPaths } from '@pixelmist/icons';
import type { IconName } from '@pixelmist/icons';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export interface IconProps extends Omit<SvgProps, 'children' | 'color' | 'width' | 'height'> {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon = forwardRef<Svg, IconProps>(function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, ...rest }: IconProps, ref) {
  return (
    <Svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no"
      {...rest}
    >
      <Path d={iconPaths[name]} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
