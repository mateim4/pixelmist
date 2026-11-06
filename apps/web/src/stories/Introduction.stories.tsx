import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, Button, Text, AccentStripe } from '@pixelmist/react';

const meta: Meta<typeof Button> = {
  title: 'Pixelmist/Introduction',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'dark', 'cream', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => (
    <ThemeProvider storageKey="pm-storybook-theme">
      <div
        style={{
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Text as="h1" variant="hero-display">
          Pixelmist Design System
        </Text>
        <Text variant="body-md" tone="muted" style={{ margin: '1rem 0' }}>
          A Mistral-inspired, cross-platform design system built with React + TypeScript.
          Works on web, desktop (Tauri), and mobile (React Native).
        </Text>
        <AccentStripe style={{ margin: '2rem 0' }} />
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Button variant="primary" rightIcon="arrow-right">
            Get Started
          </Button>
          <Button variant="secondary">Learn More</Button>
          <Button variant="link" rightIcon="arrow-right">
            Documentation
          </Button>
        </div>
        <Text as="h2" variant="heading-3" style={{ marginTop: '3rem' }}>
          Features
        </Text>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li style={{ margin: '0.5rem 0', padding: '0.5rem 0' }}>
            <Text variant="body-md">✓ Single token source (primitives → semantic → component)</Text>
          </li>
          <li style={{ margin: '0.5rem 0', padding: '0.5rem 0' }}>
            <Text variant="body-md">✓ Two renderers: DOM and React Native</Text>
          </li>
          <li style={{ margin: '0.5rem 0', padding: '0.5rem 0' }}>
            <Text variant="body-md">✓ WCAG AA contrast compliance</Text>
          </li>
          <li style={{ margin: '0.5rem 0', padding: '0.5rem 0' }}>
            <Text variant="body-md">✓ Reduced motion support</Text>
          </li>
          <li style={{ margin: '0.5rem 0', padding: '0.5rem 0' }}>
            <Text variant="body-md">✓ Per-product accent theming (AccentScope)</Text>
          </li>
        </ul>
      </div>
    </ThemeProvider>
  ),
};
