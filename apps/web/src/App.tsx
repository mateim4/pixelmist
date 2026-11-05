import { useState } from 'react';
import {
  Badge, Box, Button, Card, CodeBlock, IconTile, Stack, SunsetStripe, Switch, Tabs, Text, TextField, ThemeProvider, useTheme,
} from '@pixelmist/react';

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Box
      as="header"
      display="flex"
      align="center"
      justify="space-between"
      paddingX="xxl"
      style={{
        height: 'var(--pm-layout-nav-height)',
        position: 'sticky', top: 0, zIndex: 'var(--pm-layout-z-index-sticky)',
        background: 'var(--pm-color-bg-canvas)',
        borderBottom: '1px solid var(--pm-color-border-soft)',
      }}
    >
      <Box display="flex" align="center" gap="sm">
        <Box radius="sm" style={{ width: 22, height: 22, background: 'var(--pm-color-gradient-hero)' }} aria-hidden />
        <Text variant="heading-5" as="span">pixelmist_</Text>
      </Box>
      <Box display="flex" align="center" gap="md">
        <Badge variant="cream" tone="info">v0.1.0</Badge>
        <Button variant="secondary" size="sm" leftIcon={theme === 'daylight' ? 'moon' : 'sun'} onClick={toggleTheme}>
          {theme === 'daylight' ? 'Terminal' : 'Daylight'}
        </Button>
      </Box>
    </Box>
  );
}

function Hero() {
  return (
    <Box paddingX="xxl" paddingY="hero" className="pm-container" style={{ paddingTop: 'var(--pm-space-hero)' }}>
      <Stack gap="xl" style={{ maxWidth: 760 }}>
        <Badge variant="accent">Design system · web / desktop / mobile</Badge>
        <Text as="h1" variant="hero-display">Frontier tooling.<br />In your hands.</Text>
        <Text variant="subtitle" tone="muted">
          Pixelmist is a Mistral-inspired design system for your AI harness — one token source,
          two renderers (DOM + React Native), three platforms.
        </Text>
        <Box display="flex" gap="md" wrap="wrap">
          <Button variant="primary" rightIcon="arrow-right">Start building</Button>
          <Button variant="secondary">Read the spec</Button>
          <Button variant="link">GitHub</Button>
        </Box>
      </Stack>
    </Box>
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section>
      <Box className="pm-container" display="flex" direction="column" gap="xxl">
        <Stack gap="xs">
          <Text variant="micro-uppercase" tone="accent">{eyebrow}</Text>
          <Text as="h2" variant="heading-2">{title}</Text>
        </Stack>
        {children}
      </Box>
    </section>
  );
}

export function App() {
  const [tab, setTab] = useState('agents');
  const [notifications, setNotifications] = useState(true);
  return (
    <ThemeProvider storageKey="pm-theme">
      <div className="pm-app pm-playground">
        <Header />
        <Hero />

        <Section eyebrow="01 — Typography" title="Editorial display, UI sans, mono code">
          <Stack gap="md">
            <Text as="h3" variant="display-lg">Display 64 — PP Editorial fallback</Text>
            <Text as="h4" variant="heading-3">Heading 3 — Inter 28/500</Text>
            <Text variant="body-md">Body 16/1.55 — the quick brown fox jumps over the lazy dog.</Text>
            <Text variant="body-sm" tone="muted">Body small 14 — muted secondary copy.</Text>
            <Text variant="micro-uppercase" tone="accent">Micro uppercase eyebrow</Text>
            <Text variant="code-md">const agent = await harness.run(task) // JetBrains Mono</Text>
          </Stack>
        </Section>

        <Section eyebrow="02 — Actions" title="Buttons, sizes and states">
          <div className="row">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="cream">Cream</Button>
            <Button variant="link">Link</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg" rightIcon="arrow-up-right">Large</Button>
            <Button variant="primary" loading>Deploying</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Section>

        <Section eyebrow="03 — Status" title="Badges and switches">
          <div className="row">
            <Badge variant="accent">New</Badge>
            <Badge variant="cream">Beta</Badge>
            <Badge variant="dark">Stable</Badge>
            <Badge variant="outline" tone="neutral">Draft</Badge>
            <Badge variant="outline" tone="success">Passing</Badge>
            <Badge variant="outline" tone="info">Queued</Badge>
            <Badge variant="outline" tone="warning">Degraded</Badge>
            <Badge variant="outline" tone="danger">Failed</Badge>
          </div>
          <Box display="flex" align="center" gap="md">
            <Switch label="Notifications" checked={notifications} onCheckedChange={setNotifications} />
            <Text variant="body-sm">Notifications</Text>
          </Box>
          <Tabs variant="pill" value={tab} onValueChange={setTab}>
            <Tabs.List>
              <Tabs.Tab value="agents">Agents</Tabs.Tab>
              <Tabs.Tab value="tools">Tools</Tabs.Tab>
              <Tabs.Tab value="runs">Runs</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Tabs variant="underline" value={tab} onValueChange={setTab}>
            <Tabs.List>
              <Tabs.Tab value="agents">Agents</Tabs.Tab>
              <Tabs.Tab value="tools">Tools</Tabs.Tab>
              <Tabs.Tab value="runs">Runs</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Section>

        <Section eyebrow="04 — Surfaces" title="Cards, code and inputs">
          <div className="grid">
            <Card variant="base">
              <Stack gap="sm">
                <IconTile icon="zap" label="Fast" />
                <Text variant="heading-5">Base card</Text>
                <Text variant="body-sm" tone="muted">White surface, hairline border, radius 12.</Text>
              </Stack>
            </Card>
            <Card variant="feature">
              <Stack gap="sm">
                <IconTile icon="sparkle" label="Agents" />
                <Text variant="heading-5">Feature card</Text>
                <Text variant="body-sm" tone="muted">32px padding, soft shadow — product highlights.</Text>
              </Stack>
            </Card>
            <Card variant="cream">
              <Stack gap="sm">
                <IconTile icon="folder" label="Project" />
                <Text variant="heading-5">Cream card</Text>
                <Text variant="body-sm">Warm cream surface with beige border.</Text>
              </Stack>
            </Card>
            <Card variant="featured">
              <Stack gap="sm">
                <Badge variant="accent">Featured</Badge>
                <Text variant="heading-5">Pricing-style card</Text>
                <Text variant="body-sm">Cream surface with a 2px accent border.</Text>
              </Stack>
            </Card>
          </div>
          <CodeBlock title="agent.ts — bash" code={'$ vibe run "refactor the auth module"\n✓ plan created (6 steps)\n✓ 12 files edited\n✓ tests passing (41/41)'} />
          <Box display="grid" gap="md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <TextField label="API key" hint="Stored locally, never sent anywhere." placeholder="sk-…" leftIcon="search" />
            <TextField label="Workspace" error="Workspace name is required" defaultValue="" />
          </Box>
        </Section>

        <SunsetStripe />
        <Box as="footer" className="pm-container" paddingY="section" display="flex" justify="space-between">
          <Text variant="micro" tone="muted">pixelmist — a Mistral-inspired design system</Text>
          <Text variant="micro" tone="accent">sunset stripe™</Text>
        </Box>
      </div>
    </ThemeProvider>
  );
}
