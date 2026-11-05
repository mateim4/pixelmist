import { createContext, useContext, forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import type { PressableProps, ViewProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { textStyle, space } from '../theme/helpers';
import { Text } from './Text';

export type TabsVariant = 'pill' | 'underline';

interface TabsContextValue {
  variant: TabsVariant;
  value: string;
  setValue: (v: string) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends ViewProps {
  variant?: TabsVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
}

function TabsRoot({ variant = 'pill', value, defaultValue = '', onValueChange, style, children, ...rest }: TabsProps) {
  const [current, setCurrent] = useControllableState<string>(value, defaultValue, onValueChange);
  return (
    <TabsContext.Provider value={{ variant, value: current, setValue: setCurrent }}>
      <View style={style} {...rest}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

export function TabsList({ style, ...rest }: ViewProps) {
  const ctx = useContext(TabsContext);
  const { resolved: t } = useTheme();
  const pill = ctx?.variant === 'pill';
  return (
    <View
      accessibilityRole="tablist"
      style={[
        { flexDirection: 'row', gap: space(t, pill ? 'xxs' : 'md') },
        pill && {
          alignSelf: 'flex-start',
          padding: space(t, 'xxs'),
          backgroundColor: t.color.bg.surface,
          borderWidth: 1,
          borderColor: t.color.border.soft,
          borderRadius: t.radius.full,
        },
        !pill && { borderBottomWidth: 1, borderBottomColor: t.color.border.soft },
        style,
      ]}
      {...rest}
    />
  );
}

export interface TabsTabProps extends Omit<PressableProps, 'children'> {
  value: string;
  children?: string;
}

export const TabsTab = forwardRef<View, TabsTabProps>(function TabsTab({ value, children, ...rest }, ref) {
  const ctx = useContext(TabsContext);
  const { resolved: t } = useTheme();
  if (!ctx) throw new Error('Tabs.Tab must be used inside <Tabs>');
  const selected = ctx.value === value;
  const pill = ctx.variant === 'pill';
  return (
    <Pressable
      ref={ref}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={() => ctx.setValue(value)}
      style={{
        borderRadius: pill ? t.radius.full : 0,
        paddingVertical: space(t, pill ? 'xs' : 'sm'),
        paddingHorizontal: space(t, 'md'),
        ...(pill && selected && { backgroundColor: t.color.bg.inverse }),
        ...(!pill && {
          borderBottomWidth: 2,
          borderBottomColor: selected ? t.color.accent.primary : 'transparent',
          marginBottom: -1,
        }),
      }}
      {...rest}
    >
      <Text
        variant="body-sm-medium"
        style={{ color: selected ? (pill ? t.color.fg.inverse : t.color.accent.primary) : t.color.fg.muted }}
      >
        {children}
      </Text>
    </Pressable>
  );
});

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab: TabsTab });
