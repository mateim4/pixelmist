import { createContext, forwardRef, useContext } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import type { PressableProps, ViewProps } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';

interface AppShellContextValue {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}
const AppShellContext = createContext<AppShellContextValue | null>(null);

export interface AppShellProps extends ViewProps {
  children?: React.ReactNode;
}

/** Native app shell: wires the header menu button to the side-nav overlay. */
export function AppShell({ children, style, ...rest }: AppShellProps) {
  const [navOpen, setNavOpen] = useControllableState<boolean>(undefined, false);
  return (
    <AppShellContext.Provider value={{ navOpen, setNavOpen }}>
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    </AppShellContext.Provider>
  );
}

export interface HeaderProps extends ViewProps {
  productName?: string;
  onMenuClick?: () => void;
  menuLabel?: string;
  children?: React.ReactNode;
}

export const Header = forwardRef<View, HeaderProps>(function Header(
  { productName, onMenuClick, menuLabel = 'Open navigation', children, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const ctx = useContext(AppShellContext);
  const menu = onMenuClick ?? (ctx ? () => ctx.setNavOpen(true) : undefined);
  return (
    <View
      ref={ref}
      style={[{ height: Number(t.layout.nav.height), flexDirection: 'row', alignItems: 'center', gap: space(t, 'md'), paddingHorizontal: space(t, 'md'), borderBottomWidth: 1, borderBottomColor: t.color.border.soft, backgroundColor: t.color.bg.surface }, style]}
      {...rest}
    >
      {menu ? (
        <Pressable accessibilityRole="button" accessibilityLabel={menuLabel} onPress={menu} hitSlop={8}>
          <Icon name="menu" size={20} color={t.color.fg.default} />
        </Pressable>
      ) : null}
      {productName ? <Text variant="heading-5">{productName}</Text> : null}
      <View style={{ flex: 1 }} />
      {children}
    </View>
  );
});

export interface NavLinkItem {
  label: string;
  onPress: () => void;
  icon?: IconName;
  current?: boolean;
}
export interface NavGroup {
  heading?: string;
  links: NavLinkItem[];
}

export interface SideNavProps extends ViewProps {
  groups: NavGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
}

/** Native side nav: a modal overlay drawer (there is no persistent sidebar on mobile). */
export const SideNav = forwardRef<View, SideNavProps>(function SideNav(
  { groups, open, defaultOpen = false, onOpenChange, label = 'Main navigation', ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const ctx = useContext(AppShellContext);
  const [internal, setInternal] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  const isOpen = ctx && open === undefined ? ctx.navOpen : internal;
  const setOpen = (o: boolean) => {
    setInternal(o);
    ctx?.setNavOpen(o);
  };
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View
          ref={ref}
          accessibilityLabel={label}
          style={{ width: 240, backgroundColor: t.color.bg.surface, borderRightWidth: 1, borderRightColor: t.color.border.soft, padding: space(t, 'md') }}
          {...rest}
        >
          <ScrollView>
            {groups.map((g, gi) => (
              <View key={g.heading ?? gi} style={{ marginBottom: space(t, 'md') }}>
                {g.heading ? (
                  <Text variant="micro" tone="subtle" style={{ textTransform: 'uppercase', marginBottom: space(t, 'xxs') }}>
                    {g.heading}
                  </Text>
                ) : null}
                {g.links.map((l) => (
                  <Pressable
                    key={l.label}
                    accessibilityRole="link"
                    accessibilityLabel={l.current ? `${l.label}, current page` : l.label}
                    onPress={() => {
                      l.onPress();
                      setOpen(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: space(t, 'xs'),
                      padding: space(t, 'xs'),
                      borderRadius: t.radius.sm,
                      backgroundColor: l.current ? t.color.accent.soft : 'transparent',
                    }}
                  >
                    {l.icon ? <Icon name={l.icon} size={16} color={l.current ? t.color.accent.primary : t.color.fg.muted} /> : null}
                    <Text variant="body-sm" tone={l.current ? 'accent' : 'muted'}>
                      {l.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
        <Pressable accessibilityLabel="Close navigation" style={{ flex: 1, backgroundColor: t.color.bg.overlay }} onPress={() => setOpen(false)} />
      </View>
    </Modal>
  );
});

export interface SkipToContentProps extends PressableProps {
  onSkip: () => void;
  label?: string;
}

/** Native skip-to-content: a button that moves accessibility focus to the main region. */
export const SkipToContent = forwardRef<View, SkipToContentProps>(function SkipToContent({ onSkip, label = 'Skip to content', ...rest }, ref) {
  return (
    <Pressable ref={ref as never} accessibilityRole="button" accessibilityLabel={label} onPress={onSkip} {...rest}>
      <Text variant="body-sm-medium" tone="inverse">
        {label}
      </Text>
    </Pressable>
  );
});
