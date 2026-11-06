import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@pixelmist/react';

const meta: Meta<typeof Badge> = {
  title: 'Pixelmist/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['accent', 'cream', 'dark', 'outline'],
      description: 'Badge visual style variant',
    },
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'success', 'info', 'warning', 'danger'],
      description: 'Badge color tone',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Accent',
  },
};

export const Cream: Story = {
  args: {
    variant: 'cream',
    children: 'Cream',
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    children: 'Dark',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Success: Story = {
  args: {
    variant: 'outline',
    tone: 'success',
    children: 'Success',
  },
};

export const Info: Story = {
  args: {
    variant: 'outline',
    tone: 'info',
    children: 'Info',
  },
};

export const Warning: Story = {
  args: {
    variant: 'outline',
    tone: 'warning',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    variant: 'outline',
    tone: 'danger',
    children: 'Danger',
  },
};
