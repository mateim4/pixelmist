import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  ActivityMarker,
  AgentChip,
  Legend,
  Composer,
  Markdown,
  Message,
  PermissionPrompt,
  PlanList,
  SessionListItem,
  Tag,
  ToolCall,
  TypingDots,
} from '@pixelmist/react';

const meta: Meta = { title: 'Pixelmist/v0.3/DataViz & Chat' };
export default meta;

export const MarkersAndChips: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <ActivityMarker state="working" />
        <ActivityMarker state="idle" />
        <ActivityMarker state="stopped" />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <AgentChip name="atlas" color={0} state="working" />
        <AgentChip name="vega" color={1} state="idle" />
        <AgentChip name="nova" color={4} state="stopped" />
      </div>
      <Legend
        items={[
          { label: 'atlas', color: 0 },
          { label: 'vega', color: 1 },
          { label: 'nova', color: 4 },
        ]}
      />
    </div>
  ),
};

export const ChatDemo: StoryObj = {
  render: () => {
    const [running, setRunning] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
        <Message role="user" name="you" timestamp="10:02">
          Summarise the conflicts in brdcrmb
        </Message>
        <Message role="assistant" name="atlas" timestamp="10:02" markdown>
          {'Found **3 conflicts**:\n\n- `BRD-12` vs `BRD-14` — owner\n- `BRD-13` — due date\n\nSee [the report](https://example.com) for details.\n\n```ts\nconst n = 3;\n```'}
        </Message>
        <ToolCall name="snooper.scan" status="success" args={'{"repo":"brdcrmb"'} result={'{"conflicts":3}'} />
        <PermissionPrompt
          action="run `cargo test` in brdcrmb"
          onAllowOnce={() => setLog((l) => [...l, 'allowed once'])}
          onAlwaysAllow={() => setLog((l) => [...l, 'always allowed'])}
          onDeny={() => setLog((l) => [...l, 'denied'])}
        />
        <PlanList
          steps={[
            { label: 'Scan repository', status: 'done' },
            { label: 'Resolve conflicts', status: 'inProgress' },
            { label: 'Write report', status: 'pending' },
          ]}
        />
        {running ? <TypingDots /> : null}
        <Composer
          placeholder="Message the agent…"
          running={running}
          onSend={() => {
            setRunning(true);
            setTimeout(() => setRunning(false), 1500);
          }}
          onStop={() => setRunning(false)}
          onAttach={() => setLog((l) => [...l, 'attach'])}
        />
        {log.map((l, i) => (
          <div key={i} style={{ fontSize: 12, color: 'var(--pm-color-fg-muted)' }}>
            {l}
          </div>
        ))}
      </div>
    );
  },
};

export const SessionList: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
      <SessionListItem title="Morning sync" project="brdcrmb" workItem={<Tag tone="attention" size="sm">BRD-12</Tag>} state="working" lastActive="2m ago" />
      <SessionListItem title="Paper review" project="pixelmist" state="idle" lastActive="1h ago" />
      <SessionListItem title="Old run" project="shako" state="stopped" lastActive="3d ago" />
    </div>
  ),
};

export const MarkdownDemo: StoryObj = {
  render: () => (
    <Markdown
      source={
        '# Heading is not supported — paragraphs only\n\nSome **bold**, *italic*, `inline code` and a [link](https://example.com).\n\n- first\n- second\n\n1. one\n2. two\n\n```ts\nconst answer = 42;\n```\n\n<script>alert("never rendered as HTML")</script>'
      }
    />
  ),
};
