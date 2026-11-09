import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tag, SelectableTag, Link, InlineLoading } from '@pixelmist/react';

const meta: Meta = { title: 'Pixelmist/v0.3/Tag Link Loading' };
export default meta;

export const TagTones: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag tone="attention">needs review</Tag>
      <Tag tone="progress">running</Tag>
      <Tag tone="settled">done</Tag>
      <Tag tone="inactive">archived</Tag>
      <Tag tone="neutral">draft</Tag>
      <Tag tone="attention" variant="outline">outline</Tag>
      <Tag tone="settled" variant="highContrast">solid</Tag>
      <Tag tone="progress" size="sm">small</Tag>
    </div>
  ),
};

export const SelectableTags: StoryObj = {
  render: () => {
    const [a, setA] = useState(false);
    const [b, setB] = useState(true);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <SelectableTag selected={a} onSelectedChange={setA}>
          agents
        </SelectableTag>
        <SelectableTag selected={b} onSelectedChange={setB}>
          runs
        </SelectableTag>
        <SelectableTag>papers</SelectableTag>
      </div>
    );
  },
};

export const Links: StoryObj = {
  render: () => (
    <p style={{ fontSize: 15 }}>
      Read the <Link href="https://example.com/docs">docs</Link> or{' '}
      <Link href="https://example.com" external variant="standalone">
        visit the site
      </Link>
    </p>
  ),
};

export const LoadingStates: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <InlineLoading status="active" label="Scanning repository…" />
      <InlineLoading status="finished" label="Scanning repository…" finishedLabel="Scan complete" />
      <InlineLoading status="error" label="Scanning repository…" errorLabel="Scan failed" />
    </div>
  ),
};
