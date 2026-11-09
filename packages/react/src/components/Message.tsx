import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import type { IconName } from '@pixelmist/icons';
import { IconTile } from './IconTile';
import { Text } from './Text';
import { Box, Stack } from './Box';
import { Markdown } from './Markdown';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
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

/** Chat/harness message row: icon tile + name/time + body. forwardRef + pass-through. */
export const Message = forwardRef(function Message(
  { role, name, timestamp, children, className, markdown = false, ...rest }: MessageProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <Box ref={ref} display="flex" direction="row" gap="md" className={cx('pm-message', `pm-message--${role}`, className)} {...rest}>
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
        {markdown && typeof children === 'string' ? (
          <Markdown source={children} className="pm-message__body" />
        ) : (
          <Text variant="body-md" className="pm-message__body">
            {children}
          </Text>
        )}
      </Stack>
    </Box>
  );
});
