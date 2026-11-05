import { forwardRef } from 'react';
import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';
import type { TextVariant } from '@pixelmist/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { textStyle, toneColor } from '../theme/helpers';

export type TextTone =
  | 'default' | 'muted' | 'subtle' | 'disabled' | 'inverse'
  | 'accent' | 'link' | 'success' | 'info' | 'warning' | 'danger';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

/** Same API as @pixelmist/react <Text>: variant = type-scale token, tone = semantic color. */
export const Text = forwardRef<RNText, TextProps>(function Text({ variant = 'body-md', tone = 'default', style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  return <RNText ref={ref} style={[textStyle(t, variant), { color: toneColor(t, tone) }, style]} {...rest} />;
});
