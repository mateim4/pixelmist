import type { Meta, StoryObj } from '@storybook/react';
import { Card, Text, Badge, Box } from '@pixelmist/react';

const meta: Meta<typeof Card> = {
  title: 'Pixelmist/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: <Text variant="body-md">Card Content</Text>,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['base', 'feature', 'cream', 'featured', 'code'],
      description: 'Card visual style variant',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Card padding',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    variant: 'base',
    children: <Text variant="body-md">Base Card</Text>,
  },
};

export const Feature: Story = {
  args: {
    variant: 'feature',
    children: <Text variant="body-md">Feature Card</Text>,
  },
};

export const Cream: Story = {
  args: {
    variant: 'cream',
    children: <Text variant="body-md">Cream Card</Text>,
  },
};

export const Featured: Story = {
  args: {
    variant: 'featured',
    children: <Text variant="body-md">Featured Card</Text>,
  },
};

export const Code: Story = {
  args: {
    variant: 'code',
    children: (
      <Box gap="md">
        <Badge variant="outline" tone="success">
          Featured
        </Badge>
        <Text variant="code-md">code {JSON.stringify({ data: 'value' }, null, 2)}</Text>
      </Box>
    ),
  },
};

export const WithPadding: Story = {
  args: {
    variant: 'base',
    padding: 'lg',
    children: <Text variant="body-md">Card with large padding</Text>,
  },
};

export const ComplexCard: Story = {
  render: () => (
    <Card variant="featured">
      <Box gap="md">
        <Badge variant="accent">New</Badge>
        <Text as="h3" variant="heading-3">
          Feature Title
        </Text>
        <Text variant="body-md" tone="muted">
          This is a featured card with custom content
        </Text>
        <Text variant="code-md">const example = 'code';</Text>
      </Box>
    </Card>
  ),
};
