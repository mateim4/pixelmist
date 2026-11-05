import type { ReactNode } from 'react';
import { cx } from '@pixelmist/core';
import type { IconName } from '@pixelmist/icons';
import { IconTile } from './IconTile';
import { Text } from './Text';
import { Box, Stack } from './Box';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface MessageProps {
  role: MessageRole;
  name?: string;
  timestamp?: string;
  children?: ReactNode;
  className?: string;
}

const roleIcon: Record<MessageRole, IconName> = {
  user: 'user',
  assistant: 'sparkle',
  system: 'info',
  tool: 'terminal',
};

/** Chat/harness message row: icon tile + name/time + body. */
export function Message({ role, name, timestamp, children, className }: MessageProps) {
  return (
    <Box display="flex" direction="row" gap="md" className={cx('pm-message', `pm-message--${role}`, className)}>
      <IconTile icon={roleIcon[role]} label={role} />
      <Stack gap="xxs" flex={1} style={{ minWidth: 0 }}>
        <Box display="flex" gap="sm" align="baseline">
          <Text variant="body-sm-medium">{name ?? role}</Text>
          {timestamp ? (
            <Text variant="micro" tone="subtle">
              {timestamp}
            </Text>
          ) : null}
        </Box>
        <Text variant="body-md" className="pm-message__body">
          {children}
        </Text>
      </Stack>
    </Box>
  );
}
