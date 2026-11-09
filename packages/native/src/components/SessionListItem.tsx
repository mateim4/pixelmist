import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import type { PressableProps } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { ActivityMarker } from './ActivityMarker';
import type { ActivityState } from './ActivityMarker';

export interface SessionListItemProps extends Omit<PressableProps, 'children'> {
  title: string;
  project?: string;
  workItem?: ReactNode;
  state: ActivityState;
  lastActive?: string;
}

/** Native session list item: marker + title/project/work + last active. */
export const SessionListItem = forwardRef<View, SessionListItemProps>(function SessionListItem(
  { title, project, workItem, state, lastActive, style, ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  return (
    <Pressable
      ref={ref as never}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'sm'), padding: space(t, 'sm'), borderWidth: 1, borderColor: t.color.border.soft, borderRadius: t.radius.md, backgroundColor: t.color.bg.surface }, style] as never}
      {...rest}
    >
      <ActivityMarker state={state} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="body-sm-medium" numberOfLines={1}>
          {title}
        </Text>
        {project ? (
          <Text variant="caption" tone="muted">
            {project}
          </Text>
        ) : null}
        {workItem}
      </View>
      {lastActive ? (
        <Text variant="micro" tone="subtle">
          {lastActive}
        </Text>
      ) : null}
    </Pressable>
  );
});
