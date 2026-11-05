import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { asTokens } from '../theme/helpers';
import { Text } from './Text';

export type BadgeVariant = 'accent' | 'cream' | 'dark' | 'outline';
export type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  children?: string;
}

export function Badge({ variant = 'accent', tone = 'neutral', style, children, ...rest }: BadgeProps) {
  const { resolved: t } = useTheme();
  const v = asTokens(asTokens(t.components.badge)[variant] ?? {});
  let bg = v.bg as string;
  let fg = v.fg as string;
  if (tone !== 'neutral') {
    bg = t.color.status[`${tone}Soft` as keyof typeof t.color.status] as string;
    fg = t.color.status[tone as 'success' | 'info' | 'warning' | 'danger'];
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: bg,
        borderRadius: Number(v.radius),
        paddingVertical: Number(v.padY),
        paddingHorizontal: Number(v.padX),
        borderWidth: variant === 'outline' || variant === 'cream' ? 1 : 0,
        borderColor: (v.border as string) ?? 'transparent',
        alignSelf: 'flex-start',
      }}
      {...rest}
    >
      <Text variant="caption-bold" style={{ color: fg }}>
        {children}
      </Text>
    </View>
  );
}
