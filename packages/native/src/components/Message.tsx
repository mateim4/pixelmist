import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Box, Stack } from './Box';
import { Text } from './Text';
import { IconTile } from './IconTile';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';
export interface MessageProps {
  role: MessageRole;
  name?: string;
  timestamp?: string;
  children?: ReactNode;
}

const roleIcon: Record<MessageRole, IconName> = {
  user: 'user',
  assistant: 'sparkle',
  system: 'info',
  tool: 'terminal',
};

export function Message({ role, name, timestamp, children }: MessageProps) {
  useTheme();
  return (
    <Box direction="row" gap="md">
      <IconTile icon={roleIcon[role]} label={role} />
      <Stack gap="xxs" flex={1}>
        <Box direction="row" gap="sm" align="center">
          <Text variant="body-sm-medium">{name ?? role}</Text>
          {timestamp ? (
            <Text variant="micro" tone="subtle">
              {timestamp}
            </Text>
          ) : null}
        </Box>
        <Text variant="body-md">{children}</Text>
      </Stack>
    </Box>
  );
}
