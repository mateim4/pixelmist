import { forwardRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Popover } from './Popover';

export interface HoverCardProps extends ViewProps {
  title: ReactNode;
  status?: ReactNode;
  facts?: ReactNode;
  agent?: ReactNode;
  children: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Native hover card: long-press/tap the node to open the rich card (hover is web-only). */
export const HoverCard = forwardRef<View, HoverCardProps>(function HoverCard({ title, status, facts, agent, children, open: openProp, onOpenChange, ...rest }: HoverCardProps, ref) {
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
      <Pressable onPress={() => setOpen(!open)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
        {children}
      </Pressable>
      <Popover open={open} onOpenChange={setOpen} anchor={anchor} placement="top">
        <View style={{ gap: space(t, 'xxs'), maxWidth: 320 }}>
          <Text variant="body-sm-medium">{title}</Text>
          {status}
          {facts ? (
            <Text variant="caption" tone="muted">
              {facts}
            </Text>
          ) : null}
          {agent}
        </View>
      </Popover>
    </View>
  );
});
