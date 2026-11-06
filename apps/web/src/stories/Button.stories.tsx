import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@pixelmist/react';
import { fn } from '@storybook/test';

const meta: Meta<typeof Button> = {
  title: 'Pixelmist/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'dark', 'cream', 'link'],
      description: 'Button visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    leftIcon: {
      control: { type: 'select' },
      options: ['', 'arrow-right', 'arrow-left', 'check', 'x', 'plus', 'sparkle', 'zap', 'terminal', 'play'],
      description: 'Icon on the left',
    },
    rightIcon: {
      control: { type: 'select' },
      options: ['', 'arrow-right', 'arrow-left', 'check', 'x', 'plus', 'sparkle', 'zap', 'terminal', 'play'],
      description: 'Icon on the right',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    children: 'Dark Button',
  },
};

export const Cream: Story = {
  args: {
    variant: 'cream',
    children: 'Cream Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'primary',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
    children: 'Large Button',
  },
};

export const WithLeftIcon: Story = {
  args: {
    leftIcon: 'sparkle',
    variant: 'primary',
    children: 'With Icon',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: 'arrow-right',
    variant: 'primary',
    children: 'With Icon',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    variant: 'primary',
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: 'primary',
    children: 'Disabled',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    variant: 'primary',
    children: 'Full Width',
  },
};
