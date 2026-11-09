import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

export interface DisclosureProps extends ViewProps {
  title: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/** Native disclosure (fold). */
export const Disclosure = forwardRef<View, DisclosureProps>(function Disclosure(
  { title, open, defaultOpen = false, onOpenChange, children, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const [isOpen, setOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  return (
    <View ref={ref} style={style} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setOpen(!isOpen)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'xs'), paddingVertical: space(t, 'xs') }}
      >
        <Icon name="chevron-right" size={16} color={t.color.fg.muted} />
        <Text variant="body-sm-medium">{title}</Text>
      </Pressable>
      {isOpen ? <View>{children}</View> : null}
    </View>
  );
});
