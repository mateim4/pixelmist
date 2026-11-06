import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '@pixelmist/react';

const meta: Meta<typeof Text> = {
  title: 'Pixelmist/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'Hello World',
  },
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'strong', 'em'],
      description: 'HTML tag to render',
    },
    variant: {
      control: { type: 'select' },
      options: [
        'hero-display',
        'display-lg',
        'display-md',
        'display-sm',
        'heading-1',
        'heading-2',
        'heading-3',
        'heading-4',
        'heading-5',
        'body-lg',
        'body-md',
        'body-sm',
        'body-xs',
        'code-lg',
        'code-md',
        'code-sm',
        'label-lg',
        'label-md',
        'label-sm',
      ],
      description: 'Typography variant',
    },
    tone: {
      control: { type: 'select' },
      options: ['default', 'muted', 'subtle', 'disabled', 'inverse', 'onAccent', 'link', 'success', 'info', 'warning', 'danger'],
      description: 'Text color tone',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    as: 'h1',
    variant: 'display-lg',
    children: 'Display Large',
  },
};

export const Heading: Story = {
  args: {
    as: 'h2',
    variant: 'heading-3',
    children: 'Heading 3',
  },
};

export const Body: Story = {
  args: {
    as: 'p',
    variant: 'body-md',
    children: 'Body text with default tone',
  },
};

export const Muted: Story = {
  args: {
    variant: 'body-md',
    tone: 'muted',
    children: 'Muted text',
  },
};

export const Code: Story = {
  args: {
    variant: 'code-md',
    children: 'const x = 42;',
  },
};

export const Success: Story = {
  args: {
    variant: 'body-md',
    tone: 'success',
    children: 'Success!',
  },
};

export const Warning: Story = {
  args: {
    variant: 'body-md',
    tone: 'warning',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    variant: 'body-md',
    tone: 'danger',
    children: 'Danger',
  },
};
