import { forwardRef } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import type { SpaceValue } from '../theme/helpers';

export interface BoxProps extends ViewProps {
  display?: ViewStyle['display'];
  direction?: ViewStyle['flexDirection'];
  gap?: SpaceValue;
  padding?: SpaceValue;
  paddingX?: SpaceValue;
  paddingY?: SpaceValue;
  margin?: SpaceValue;
  marginX?: SpaceValue;
  marginY?: SpaceValue;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
  flex?: ViewStyle['flex'];
  width?: ViewStyle['width'];
  maxWidth?: ViewStyle['maxWidth'];
  radius?: SpaceValue;
  bg?: string;
  style?: StyleProp<ViewStyle>;
}

export const Box = forwardRef<View, BoxProps>(function Box(
  {
    display,
    direction,
    gap,
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY,
    align,
    justify,
    wrap,
    flex,
    width,
    maxWidth,
    radius,
    bg,
    style,
    ...rest
  },
  ref,
) {
  const { resolved: t } = useTheme();
  const s: ViewStyle = {
    ...(display !== undefined && { display }),
    ...(direction !== undefined && { flexDirection: direction }),
    ...(gap !== undefined && { gap: space(t, gap) }),
    ...(padding !== undefined && { padding: space(t, padding) }),
    ...(paddingX !== undefined && { paddingHorizontal: space(t, paddingX) }),
    ...(paddingY !== undefined && { paddingVertical: space(t, paddingY) }),
    ...(margin !== undefined && { margin: space(t, margin) }),
    ...(marginX !== undefined && { marginHorizontal: space(t, marginX) }),
    ...(marginY !== undefined && { marginVertical: space(t, marginY) }),
    ...(align !== undefined && { alignItems: align }),
    ...(justify !== undefined && { justifyContent: justify }),
    ...(wrap !== undefined && { flexWrap: wrap }),
    ...(flex !== undefined && { flex }),
    ...(width !== undefined && { width: typeof width === 'number' ? width : width }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(radius !== undefined && { borderRadius: space(t, radius) }),
    ...(bg !== undefined && { backgroundColor: bg }),
  };
  return <View ref={ref} style={[s, style]} {...rest} />;
});

export interface StackProps extends BoxProps {}

export const Stack = forwardRef<View, StackProps>(function Stack(
  { direction = 'column', display = 'flex', ...rest },
  ref,
) {
  return <Box ref={ref} display={display} direction={direction} {...rest} />;
});
