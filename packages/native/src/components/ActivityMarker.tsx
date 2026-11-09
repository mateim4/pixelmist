import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export type ActivityState = 'working' | 'idle' | 'stopped';

export interface ActivityMarkerProps extends ViewProps {
  state: ActivityState;
  label?: string;
}

const defaultLabel: Record<ActivityState, string> = { working: 'Working', idle: 'Idle', stopped: 'Stopped' };

/** Native activity marker: working = filled dot, idle = hollow ring, stopped = no ring. */
export const ActivityMarker = forwardRef<View, ActivityMarkerProps>(function ActivityMarker({ state, label, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const color = state === 'working' ? t.color.tones.progress.strong : state === 'idle' ? t.color.tones.inactive.strong : t.color.fg.disabled;
  return (
    <View
      ref={ref}
      accessibilityRole="image"
      accessibilityLabel={label ?? defaultLabel[state]}
      style={[{ width: 12, height: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: state === 'stopped' ? 0 : 1.5, borderColor: color }, style]}
      {...rest}
    >
      <View style={{ width: state === 'working' ? 8 : 4, height: state === 'working' ? 8 : 4, borderRadius: 4, backgroundColor: color }} />
    </View>
  );
});

export interface AgentChipProps extends ViewProps {
  name: string;
  color: number | string;
  state: ActivityState;
}

/** Native agent chip: marker + colour dot + name. */
export const AgentChip = forwardRef<View, AgentChipProps>(function AgentChip({ name, color, state, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  const cssColor = typeof color === 'number' ? (t.color.dataviz.categorical as string[])[color] : color;
  return (
    <View
      ref={ref}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2, paddingHorizontal: 8, borderWidth: 1, borderColor: t.color.border.default, borderRadius: t.radius.full, backgroundColor: t.color.bg.surface, alignSelf: 'flex-start' }, style]}
      {...rest}
    >
      <ActivityMarker state={state} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cssColor }} />
      <Text variant="body-sm">{name}</Text>
    </View>
  );
});

import { Text } from './Text';
