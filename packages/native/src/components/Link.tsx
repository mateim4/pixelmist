import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Linking, Pressable } from 'react-native';
import type { PressableProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Icon } from './Icon';

export interface LinkProps extends Omit<PressableProps, 'children'> {
  href: string;
  external?: boolean;
  variant?: 'inline' | 'standalone';
  children?: ReactNode;
}

/** Native link: opens externally via Linking; external shows the external-link icon. */
export const Link = forwardRef<unknown, LinkProps>(function Link({ href, external = false, children, ...rest }, ref) {
  const { resolved: t } = useTheme();
  return (
    <Pressable
      ref={ref as never}
      accessibilityRole="link"
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      onPress={() => Linking.openURL(href)}
      {...rest}
    >
      <Text variant="body-sm" tone="link" style={{ textDecorationLine: 'underline' }}>
        {children}
        {external ? ' ' : null}
      </Text>
      {external ? <Icon name="external-link" size={14} color={t.color.fg.link} /> : null}
    </Pressable>
  );
});
