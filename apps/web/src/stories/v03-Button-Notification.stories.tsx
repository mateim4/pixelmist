import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, InlineNotification } from '@pixelmist/react';

const meta: Meta<typeof Button> = {
  title: 'Pixelmist/v0.3/Button variants',
  component: Button,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } };
export const Tertiary: Story = { args: { variant: 'tertiary', children: 'Tertiary (outline)' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };
export const DangerTertiary: Story = { args: { variant: 'dangerTertiary', children: 'Remove' } };
export const IconOnly: Story = { args: { icon: 'trash', label: 'Delete run', variant: 'ghost', tooltip: 'Delete this run' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

const notifMeta: Meta<typeof InlineNotification> = {
  title: 'Pixelmist/v0.3/InlineNotification',
  component: InlineNotification,
  tags: ['autodocs'],
};
export const NotificationStories: StoryObj<typeof InlineNotification> = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
        <InlineNotification tone="error" title="Run failed" subtitle="The agent hit an error in step 3." onClose={() => setShow(false)} />
        {show ? (
          <InlineNotification
            tone="warning"
            title="Unsaved changes"
            subtitle="Two records were edited."
            action={{ label: 'Save now', onClick: () => setShow(false) }}
            onClose={() => setShow(false)}
          />
        ) : null}
        <InlineNotification tone="success" title="All checks passed" />
        <InlineNotification tone="info" title="New version available" subtitle="v0.3.0 of the harness is out." />
      </div>
    );
  },
};
export const _notifMeta = notifMeta;
