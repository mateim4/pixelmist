import { ActivityIndicator, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Badge } from './Badge';
import type { BadgeTone } from './Badge';
import { Icon } from './Icon';
import { Box, Stack } from './Box';
import { Text } from './Text';

export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';
export interface ToolCallProps {
  name: string;
  status: ToolCallStatus;
  args?: string;
  result?: string;
  children?: ReactNode;
}

const statusTone: Record<ToolCallStatus, BadgeTone> = {
  pending: 'neutral',
  running: 'info',
  success: 'success',
  error: 'danger',
};

export function ToolCall({ name, status, args, result, children }: ToolCallProps) {
  const { resolved: t } = useTheme();
  return (
    <View
      style={{
        backgroundColor: t.color.bg.code,
        borderRadius: t.radius.lg,
        padding: space(t, 'md'),
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <Box
        direction="row"
        align="center"
        gap="sm"
        style={{
          paddingBottom: space(t, 'xs'),
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.08)',
          marginBottom: space(t, 'sm'),
        }}
      >
        {status === 'running' ? (
          <ActivityIndicator size="small" color={String(t.palette.sunset['400'])} />
        ) : (
          <Icon name="terminal" size={16} color="#f2f1ec" />
        )}
        <Text variant="code-md" style={{ color: '#f2f1ec', flex: 1 }}>
          {name}
        </Text>
        <Badge variant="outline" tone={statusTone[status]}>
          {status}
        </Badge>
      </Box>
      <Stack gap="xs">
        {args ? (
          <Text variant="code-md" style={{ color: 'rgba(242,241,236,0.85)' }}>
            {args}
          </Text>
        ) : null}
        {result ? (
          <Text variant="code-md" style={{ color: '#8fd6a8' }}>
            {result}
          </Text>
        ) : null}
        {children}
      </Stack>
    </View>
  );
}
