import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { View, ViewProps } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import { useTheme } from '../theme/ThemeProvider';
import { Box, Stack } from './Box';
import { Text } from './Text';
import { IconTile } from './IconTile';
import { Markdown } from './Markdown';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';
export interface MessageProps extends Omit<ViewProps, 'role'> {
  role: MessageRole;
  name?: string;
  timestamp?: string;
  children?: ReactNode;
  /** Render a string child as markdown (code blocks, lists, links, inline code; no raw HTML). */
  markdown?: boolean;
}

const roleIcon: Record<MessageRole, IconName> = {
  user: 'user',
  assistant: 'sparkle',
  system: 'info',
  tool: 'terminal',
};

export const Message = forwardRef<View, MessageProps>(function Message({ role, name, timestamp, children, markdown = false, ...rest }: MessageProps, ref) {
  useTheme();
  return (
    <Box ref={ref} direction="row" gap="md" {...rest}>
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
        {markdown && typeof children === 'string' ? <Markdown source={children} /> : <Text variant="body-md">{children}</Text>}
      </Stack>
    </Box>
  );
});
