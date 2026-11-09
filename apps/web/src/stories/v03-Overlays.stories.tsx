import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Popover, Tooltip, InfoTip, Button, HoverCard, Tag, AgentChip } from '@pixelmist/react';

const meta: Meta = { title: 'Pixelmist/v0.3/Overlays' };
export default meta;

export const PopoverDemo: StoryObj = {
  render: () => {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button ref={anchor} variant="tertiary" onClick={() => setOpen((o) => !o)}>
          Toggle popover
        </Button>
        <Popover open={open} onOpenChange={setOpen} anchor={anchor} placement="bottom-start" style={{ padding: 12 }}>
          Anchored popover content. Escape closes and returns focus.
        </Popover>
      </>
    );
  },
};

export const TooltipDemo: StoryObj = {
  render: () => (
    <Tooltip label="Save the current run">
      <Button variant="ghost" icon="download" label="Save" />
    </Tooltip>
  ),
};

export const InfoTipDemo: StoryObj = {
  render: () => (
    <p style={{ fontSize: 16 }}>
      Conflicts <InfoTip label="About conflicts">Conflicts are pairs of records that disagree about the same thing.</InfoTip>
    </p>
  ),
};

export const HoverCardDemo: StoryObj = {
  render: () => (
    <svg width={200} height={80}>
      <HoverCard
        title="Run 42"
        status={<Tag tone="progress">running</Tag>}
        facts="criteria 2 of 3 met"
        agent={<AgentChip name="atlas" color={0} state="working" />}
      >
        <g tabIndex={0}>
          <circle cx={60} cy={40} r={18} fill="var(--pm-color-tones-progress-strong)" />
        </g>
      </HoverCard>
    </svg>
  ),
};
