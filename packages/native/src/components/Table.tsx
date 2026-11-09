import { forwardRef } from 'react';
import { ScrollView, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';

export type TableDensity = 'normal' | 'compact';

export interface TableProps extends ViewProps {
  density?: TableDensity;
  /** Header row stays visible while the body scrolls. */
  stickyHeader?: boolean;
  children?: React.ReactNode;
}

/**
 * Native table: horizontal ScrollView (the table scrolls sideways inside its container,
 * never the page) with a header row and body rows. Same compound API as web.
 */
export const Table = forwardRef<ScrollView, TableProps>(function Table(
  { density = 'normal', stickyHeader = false, children, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const pad = density === 'compact' ? space(t, 'xxs') : space(t, 'sm');
  return (
    <ScrollView horizontal ref={ref} style={[{ borderWidth: 1, borderColor: t.color.border.soft, borderRadius: t.radius.md }, style]} {...rest}>
      <View>
        <TableContext.Provider value={{ pad, sticky: stickyHeader }}>{children}</TableContext.Provider>
      </View>
    </ScrollView>
  );
});

import { createContext, useContext } from 'react';
interface TableCtx {
  pad: number;
  sticky: boolean;
}
const TableContext = createContext<TableCtx>({ pad: 12, sticky: false });

export const TableHead = forwardRef<View, ViewProps>(function TableHead({ children, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const ctx = useContext(TableContext);
  return (
    <View
      ref={ref}
      style={[{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.color.border.default, backgroundColor: ctx.sticky ? t.color.bg.raised : 'transparent' }, style]}
      {...rest}
    >
      {children}
    </View>
  );
});

export const TableBody = forwardRef<View, ViewProps>(function TableBody({ children, style, ...rest }, ref) {
  return (
    <View ref={ref} style={style} {...rest}>
      {children}
    </View>
  );
});

export const TableRow = forwardRef<View, ViewProps>(function TableRow({ children, style, ...rest }, ref) {
  return (
    <View ref={ref} style={[{ flexDirection: 'row' }, style]} {...rest}>
      {children}
    </View>
  );
});

export interface TableHeaderCellProps extends ViewProps {
  sort?: { direction: 'ascending' | 'descending' | null; onSort?: () => void };
  children?: React.ReactNode;
}

export const TableHeaderCell = forwardRef<View, TableHeaderCellProps>(function TableHeaderCell({ sort, children, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const ctx = useContext(TableContext);
  return (
    <View
      ref={ref}
      accessibilityRole="header"
      style={[{ padding: ctx.pad, minWidth: 96 }, style]}
      {...rest}
    >
      {sort ? (
        <PressableRow onPress={sort.onSort}>
          <Text variant="body-sm-medium" tone="muted">
            {children}
          </Text>
          <Icon name={sort.direction === 'ascending' ? 'chevron-up' : 'chevron-down'} size={14} color={t.color.fg.subtle} />
        </PressableRow>
      ) : (
        <Text variant="body-sm-medium" tone="muted">
          {children}
        </Text>
      )}
    </View>
  );
});

import { Pressable } from 'react-native';
import { Icon } from './Icon';
function PressableRow({ children, onPress }: { children?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {children}
    </Pressable>
  );
}

export const TableCell = forwardRef<View, ViewProps>(function TableCell({ children, style, ...rest }, ref) {
  const ctx = useContext(TableContext);
  return (
    <View ref={ref} style={[{ padding: ctx.pad, minWidth: 96 }, style]} {...rest}>
      {typeof children === 'string' ? <Text variant="body-sm">{children}</Text> : children}
    </View>
  );
});
