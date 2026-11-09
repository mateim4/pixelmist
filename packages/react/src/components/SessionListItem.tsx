import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { ActivityMarker } from './ActivityMarker';
import type { ActivityState } from './ActivityMarker';
import { Text } from './Text';

export interface SessionListItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  project?: string;
  /** Linked work item (rendered as a link or text). */
  workItem?: ReactNode;
  state: ActivityState;
  /** "last active" time, e.g. "2m ago". */
  lastActive?: string;
}

/** Session list item: title, project, linked work item, activity marker, last active. */
export const SessionListItem = forwardRef(function SessionListItem(
  { title, project, workItem, state, lastActive, className, ...rest }: SessionListItemProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={cx('pm-session', className)} data-state={state} {...rest}>
      <ActivityMarker state={state} />
      <div className="pm-session__body">
        <Text variant="body-sm-medium" className="pm-session__title">
          {title}
        </Text>
        {project ? (
          <Text variant="caption" tone="muted">
            {project}
          </Text>
        ) : null}
        {workItem ? <div className="pm-session__work">{workItem}</div> : null}
      </div>
      {lastActive ? (
        <Text variant="micro" tone="subtle" className="pm-session__time">
          {lastActive}
        </Text>
      ) : null}
    </div>
  );
});
