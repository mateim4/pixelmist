import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Text } from './Text';
import { Icon } from './Icon';
import { ActivityIndicator } from 'react-native';

export type PlanStepStatus = 'pending' | 'inProgress' | 'done';

export interface PlanStep {
  label: ReactNode;
  status: PlanStepStatus;
}

export interface PlanListProps extends ViewProps {
  steps: PlanStep[];
}

const statusLabel: Record<PlanStepStatus, string> = { pending: 'Pending', inProgress: 'In progress', done: 'Done' };

/** Native plan list: steps as pending / in progress / done. */
export const PlanList = forwardRef<View, PlanListProps>(function PlanList({ steps, style, ...rest }, ref) {
  const { resolved: t } = useTheme();
  return (
    <View ref={ref} style={[{ gap: space(t, 'xs') }, style]} {...rest}>
      {steps.map((step, i) => (
        <View
          key={i}
          accessibilityLabel={statusLabel[step.status]}
          style={{ flexDirection: 'row', alignItems: 'center', gap: space(t, 'xs') }}
        >
          {step.status === 'done' ? (
            <Icon name="check" size={14} color={t.color.tones.settled.strong} />
          ) : step.status === 'inProgress' ? (
            <ActivityIndicator size="small" color={t.color.tones.progress.strong} />
          ) : (
            <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 1.5, borderColor: t.color.fg.subtle }} />
          )}
          <Text variant="body-sm" tone={step.status === 'pending' ? 'muted' : step.status === 'done' ? 'success' : 'default'}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
});
