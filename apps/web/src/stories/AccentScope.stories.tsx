import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, AccentScope, Button, Badge, Card, Text, Box } from '@pixelmist/react';

const meta: Meta<typeof AccentScope> = {
  title: 'Pixelmist/AccentScope',
  component: AccentScope,
  tags: ['autodocs'],
  argTypes: {
    accentPrimary: {
      control: 'color',
      description: 'Custom primary accent color',
    },
    accentPrimaryHover: {
      control: 'color',
      description: 'Custom primary accent hover color',
    },
    accentPrimaryActive: {
      control: 'color',
      description: 'Custom primary accent active color',
    },
    accentSoft: {
      control: 'color',
      description: 'Custom soft accent color',
    },
    accentSoftHover: {
      control: 'color',
      description: 'Custom soft accent hover color',
    },
    accentBorder: {
      control: 'color',
      description: 'Custom accent border color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ThemeProvider storageKey="pm-storybook-theme">
      <Box gap="lg">
        <Text as="h2" variant="heading-3">
          Default Theme (Dusk Accent)
        </Text>
        <Button variant="primary">Default Primary Button</Button>
        <Badge variant="accent">Default Accent Badge</Badge>
      </Box>
    </ThemeProvider>
  ),
};

export const BlueScope: Story = {
  render: () => (
    <ThemeProvider storageKey="pm-storybook-theme">
      <Box gap="lg">
        <Text as="h2" variant="heading-3">
          Blue Accent Scope
        </Text>
        <Text variant="body-md" tone="muted">
          Outside scope (default dusk accent):
        </Text>
        <Button variant="primary">Default Button</Button>
        <Badge variant="accent">Default Badge</Badge>
        
        <AccentScope accentPrimary="#0EA5E9" accentSoft="#E0F2FE">
          <Text variant="body-md" tone="muted" style={{ marginTop: '1rem' }}>
            Inside scope (blue accent):
          </Text>
          <Button variant="primary">Blue Primary Button</Button>
          <Badge variant="accent">Blue Accent Badge</Badge>
          <Card variant="feature">
            <Text variant="body-md">Feature card with blue accent</Text>
          </Card>
        </AccentScope>
        
        <Text variant="body-md" tone="muted" style={{ marginTop: '1rem' }}>
          Back to default:
        </Text>
        <Button variant="primary">Default Button</Button>
      </Box>
    </ThemeProvider>
  ),
};

export const VioletScope: Story = {
  render: () => (
    <ThemeProvider storageKey="pm-storybook-theme">
      <Box gap="lg">
        <Text as="h2" variant="heading-3">
          Violet Accent Scope
        </Text>
        <AccentScope accentPrimary="#8B5CF6" accentSoft="#E9D5FF">
          <Button variant="primary">Violet Button</Button>
          <Badge variant="accent">Violet Badge</Badge>
          <Card variant="feature">
            <Text variant="body-md">Violet accent card</Text>
          </Card>
        </AccentScope>
      </Box>
    </ThemeProvider>
  ),
};

export const NestedScopes: Story = {
  render: () => (
    <ThemeProvider storageKey="pm-storybook-theme">
      <Box gap="lg">
        <Text as="h2" variant="heading-3">
          Nested Accent Scopes
        </Text>
        <Text variant="body-md" tone="muted">
          Default (dusk):
        </Text>
        <Button variant="primary">Default</Button>
        
        <AccentScope accentPrimary="#0EA5E9" accentSoft="#E0F2FE">
          <Text variant="body-md" tone="muted" style={{ marginTop: '1rem' }}>
            Blue scope:
          </Text>
          <Button variant="primary">Blue</Button>
          
          <AccentScope accentPrimary="#10B981" accentSoft="#D1FAE5">
            <Text variant="body-md" tone="muted" style={{ marginTop: '1rem', marginLeft: '1rem' }}>
              Nested green scope:
            </Text>
            <Button variant="primary">Green</Button>
          </AccentScope>
          
          <Text variant="body-md" tone="muted" style={{ marginTop: '1rem' }}>
            Back to blue:
          </Text>
          <Button variant="primary">Blue again</Button>
        </AccentScope>
        
        <Text variant="body-md" tone="muted" style={{ marginTop: '1rem' }}>
          Back to default:
        </Text>
        <Button variant="primary">Default again</Button>
      </Box>
    </ThemeProvider>
  ),
};

export const PartialOverride: Story = {
  render: () => (
    <ThemeProvider storageKey="pm-storybook-theme">
      <Box gap="lg">
        <Text as="h2" variant="heading-3">
          Partial Accent Override
        </Text>
        <Text variant="body-md" tone="muted">
          Only overriding accentPrimary, other accent colors use theme defaults:
        </Text>
        <AccentScope accentPrimary="#EF4444">
          <Button variant="primary">Red Primary (custom)</Button>
          <Badge variant="accent">Accent Badge (default soft color)</Badge>
        </AccentScope>
      </Box>
    </ThemeProvider>
  ),
};
