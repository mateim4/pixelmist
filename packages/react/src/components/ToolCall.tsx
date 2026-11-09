import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Badge } from './Badge';
import type { BadgeTone } from './Badge';
import { Icon } from './Icon';
import { Box, Stack } from './Box';
import { Text } from './Text';

export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolCallProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  status: ToolCallStatus;
  /** Serialized args shown in the code area. */
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

/** A harness tool invocation card: header with live status badge + args/result code. */
export const ToolCall = forwardRef(function ToolCall({ name, status, args, result, children, className, ...rest }: ToolCallProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className={cx('pm-toolcall', className)} data-status={status} {...rest}>
      <Box display="flex" align="center" gap="sm" className="pm-toolcall__header">
        {status === 'running' ? <span className="pm-btn__spinner" aria-hidden /> : <Icon name="terminal" size={16} />}
        <Text variant="body-sm-medium" className="pm-toolcall__name">
          {name}
        </Text>
        <Badge variant="outline" tone={statusTone[status]}>
          {status}
        </Badge>
      </Box>
      <Stack gap="xs">
        {args ? (
          <pre className="pm-toolcall__code">
            <code>{args}</code>
          </pre>
        ) : null}
        {result ? (
          <pre className="pm-toolcall__code pm-toolcall__code--result">
            <code>{result}</code>
          </pre>
        ) : null}
        {children}
      </Stack>
    </div>
  );
});
