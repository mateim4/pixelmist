import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space, asTokens } from '../theme/helpers';
import type { SpaceValue } from '../theme/helpers';

export type CardVariant = 'base' | 'feature' | 'cream' | 'featured' | 'code';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: SpaceValue;
}

export const Card = forwardRef<View, CardProps>(function Card({ variant = 'base', padding, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const v = asTokens(asTokens(t.components.card)[variant] ?? {});
  return (
    <View
      ref={ref}
      style={[
        {
          backgroundColor: String(v.bg),
          borderWidth: variant === 'featured' ? Number(v.borderWidth ?? 1) : variant === 'code' ? 0 : 1,
          borderColor: String(v.border),
          borderRadius: Number(v.radius),
          padding: padding !== undefined ? space(t, padding) : Number(v.padding ?? 0),
          // RN has no box-shadow token; elevation approximates it on Android, shadow on iOS
          elevation: variant === 'code' || variant === 'feature' || variant === 'featured' ? 3 : 0,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: variant === 'code' ? 12 : 4,
          shadowOffset: { width: 0, height: variant === 'code' ? 12 : 4 },
        },
        style,
      ]}
      {...rest}
    />
  );
});
