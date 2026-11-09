import { forwardRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Popover } from './Popover';
import type { PopoverPlacement } from './Popover';

export interface TooltipProps extends ViewProps {
  label: ReactNode;
  children: ReactElement;
  placement?: PopoverPlacement;
  /** Controlled open (optional). On native, tap/focus opens. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Native tooltip: tap or focus the trigger to show the label in a popover. */
export const Tooltip = forwardRef<View, TooltipProps>(function Tooltip({ label, children, placement = 'top', open: openProp, onOpenChange, ...rest }: TooltipProps, ref) {
  const { resolved: t } = useTheme();
  const [internal, setInternal] = useState(false);
  const open = openProp ?? internal;
  const setOpen = (o: boolean) => {
    setInternal(o);
    onOpenChange?.(o);
  };
  const anchor = { current: null as never };
  return (
    <View ref={ref} {...rest}>
      <Pressable
        accessibilityHint={typeof label === 'string' ? label : undefined}
        onPress={() => setOpen(!open)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </Pressable>
      <Popover open={open} onOpenChange={setOpen} anchor={anchor} placement={placement}>
        <Text variant="caption" style={{ maxWidth: 260, padding: space(t, 'xxs') }}>
          {label}
        </Text>
      </Popover>
    </View>
  );
});
