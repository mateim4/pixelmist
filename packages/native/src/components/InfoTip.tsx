import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';
import { Popover } from './Popover';
import type { PopoverPlacement } from './Popover';

export interface InfoTipProps extends ViewProps {
  /** The button's accessible name, e.g. "About conflicts". */
  label: string;
  children: ReactNode;
  align?: PopoverPlacement;
}

/** Native InfoTip: the small "?" — tap toggles the pinned tip (hover is web-only). */
export const InfoTip = forwardRef<View, InfoTipProps>(function InfoTip({ label, children, align = 'bottom-start', ...rest }: InfoTipProps, ref) {
  const { resolved: t } = useTheme();
  const [open, setOpen] = useState(false);
  const anchor = { current: null as never };
  return (
    <View ref={ref} style={{ flexDirection: 'row', alignItems: 'center' }} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="help" size={16} color={t.color.fg.subtle} />
      </Pressable>
      <Popover open={open} onOpenChange={setOpen} anchor={anchor} placement={align}>
        <Text variant="body-sm" style={{ maxWidth: 300, padding: space(t, 'xxs') }}>
          {children}
        </Text>
      </Popover>
    </View>
  );
});
