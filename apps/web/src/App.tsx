import { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  Command,
  CommandItem,
  Dialog,
  DiffView,
  IconTile,
  Message,
  Progress,
  XPBar,
  LevelBadge,
  Streak,
  AchievementToast,
  Radio,
  RadioGroup,
  Select,
  Stack,
  AccentStripe,
  Switch,
  Tabs,
  Text,
  TextArea,
  TextField,
  ThemeProvider,
  ToastProvider,
  ToolCall,
  TypingDots,
  useTheme,
  useToast,
} from '@pixelmist/react';

const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

function Header({ onCommand }: { onCommand: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  return (
    <Box
      as="header"
      display="flex"
      align="center"
      justify="space-between"
      paddingX="xxl"
      style={{
        height: 'var(--pm-layout-nav-height)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--pm-layout-z-index-sticky)',
        background: 'var(--pm-color-bg-canvas)',
        borderBottom: '1px solid var(--pm-color-border-soft)',
      }}
      data-testid="header"
    >
      <Box display="flex" align="center" gap="sm">
        <Box radius="sm" style={{ width: 22, height: 22, background: 'var(--pm-color-gradient-hero)' }} aria-hidden />
        <Text variant="heading-5" as="span">
          pixelmist_
        </Text>
        {isTauri ? (
          <Badge variant="dark" tone="info">
            desktop shell
          </Badge>
        ) : null}
      </Box>
      <Box display="flex" align="center" gap="md">
        <Button variant="secondary" size="sm" leftIcon="terminal" onClick={onCommand} data-testid="command-button">
          Commands{' '}
          <kbd
            style={{
              fontSize: 10,
              border: '1px solid var(--pm-color-border-default)',
              borderRadius: 4,
              padding: '1px 4px',
            }}
          >
            ⌘K
          </kbd>
        </Button>
        {isTauri ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              const { invoke } = await import('@tauri-apps/api/core');
              toast.push({ title: await invoke<string>('greet', { name: 'harness' }), tone: 'info' });
            }}
          >
            Ping Tauri IPC
          </Button>
        ) : null}
        <Button variant="secondary" size="sm" leftIcon={theme === 'daylight' ? 'moon' : 'sun'} onClick={toggleTheme} data-testid="theme-toggle">
          {theme === 'daylight' ? 'Terminal' : 'Daylight'}
        </Button>
      </Box>
    </Box>
  );
}

function Hero() {
  return (
    <Box className="pm-container" paddingY="hero" style={{ paddingTop: 'var(--pm-space-hero)' }}>
      <Stack gap="xl" style={{ maxWidth: 760 }}>
        <Badge variant="accent">Design system · web / desktop / mobile · animated</Badge>
        <Text as="h1" variant="hero-display">
          Frontier tooling.
          <br />
          In your hands.
        </Text>
        <Text variant="subtitle" tone="muted">
          Pixelmist is a Mistral-inspired design system for your AI harness — one token source, two renderers (DOM +
          React Native), seamless motion on every interactive surface.
        </Text>
        <Box display="flex" gap="md" wrap="wrap">
          <Button variant="primary" rightIcon="arrow-right">
            Start building
          </Button>
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
          <Text variant="micro-uppercase" tone="accent">
            {eyebrow}
          </Text>
          <Text as="h2" variant="heading-2">
            {title}
          </Text>
        </Stack>
        {children}
      </Box>
    </section>
  );
}

function OverlaysSection({ onCommand }: { onCommand: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToast();
  return (
    <Section eyebrow="05 — Overlays & motion" title="Dialog, toasts, ⌘K palette — all animated">
      <div className="row">
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          Open dialog
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.push({ title: 'Saved', description: 'Workspace synced', tone: 'success' })}
        >
          Toast success
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.push({ title: 'Careful', description: 'Sandbox is read-only', tone: 'warning' })}
        >
          Toast warning
        </Button>
        <Button variant="secondary" leftIcon="search" onClick={onCommand}>
          Command palette
        </Button>
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Start a new run?"
        description="The agent will read your repo, plan, and open a PR. This is a demo dialog with focus trap + Escape."
        actions={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDialogOpen(false);
                toast.push({ title: 'Run queued', tone: 'info' });
              }}
            >
              Start run
            </Button>
          </>
        }
      >
        <TextField label="Task" placeholder="e.g. refactor auth module" />
      </Dialog>
    </Section>
  );
}

function FormSection() {
  const { theme, setTheme } = useTheme();
  const [plan, setPlan] = useState('pro');
  const [sandbox, setSandbox] = useState('pro');
  const isDark = theme === 'terminal';
  return (
    <Section eyebrow="06 — Form" title="Select, checkbox, radio, textarea, progress" data-testid="form-section">
      <Box display="grid" gap="md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Select
          label="Plan"
          value={plan}
          onValueChange={setPlan}
          options={[
            { value: 'free', label: 'Free — 3 runs/day' },
            { value: 'pro', label: 'Pro — unlimited' },
            { value: 'team', label: 'Team — shared memory' },
          ]}
        />
        <TextField label="API key" hint="Stored locally, never sent anywhere." placeholder="sk-…" leftIcon="search" />
        <TextArea
          label="System prompt"
          hint="Optional — overrides the default harness prompt."
          placeholder="You are a senior engineer…"
          rows={3}
        />
      </Box>
      <div className="row">
        <Checkbox label="Auto-approve file edits" defaultChecked />
        <Checkbox label="Notify on completion" />
        <Switch label="Dark mode" checked={isDark} onCheckedChange={(checked) => setTheme(checked ? 'terminal' : 'daylight')} />
      </div>
      <RadioGroup label="Sandbox" value={sandbox} onValueChange={setSandbox}>
        <Radio value="local" label="Local (free)" />
        <Radio value="cloud" label="Cloud sandbox (pro)" />
      </RadioGroup>
      <Progress value={64} label="XP to level 5" showValue />
    </Section>
  );
}

function HarnessSection() {
  return (
    <Section eyebrow="07 — Harness" title="Messages, tool calls, diffs, streaming">
      <Stack gap="lg" style={{ maxWidth: 720 }}>
        <Message role="user" name="you" timestamp="21:04">
          Refactor the auth module and add tests
        </Message>
        <Message role="assistant" name="vibe" timestamp="21:04">
          On it — I found 12 files. Here's the plan, then the diff. <TypingDots />
        </Message>
        <ToolCall name="fs.read" status="success" args={'{"glob": "src/auth/**"}'} result="12 files matched" />
        <ToolCall name="test.run" status="running" args={'{"suite": "auth"}'} />
        <DiffView
          lines={[
            { type: 'ctx', text: 'export function login(user) {' },
            { type: 'del', text: '  return db.query(user) // no validation' },
            { type: 'add', text: '  const u = validate(user)' },
            { type: 'add', text: '  return db.query(u) // validated + rate-limited' },
            { type: 'ctx', text: '}' },
          ]}
        />
      </Stack>
    </Section>
  );
}

function GamifiedSection() {
  const toast = useToast();
  const [xp, setXp] = useState(64);
  const [quests, setQuests] = useState([true, false, false, true]);
  const toggleQuest = (i: number) => {
    setQuests((q) => {
      const next = [...q];
      next[i] = !next[i];
      return next;
    });
    if (!quests[i]) {
      setXp((x) => Math.min(100, x + 12));
      toast.push({ title: 'Quest complete', description: '+12 XP', tone: 'success' });
      if (xp + 12 >= 100)
        setTimeout(
          () => toast.push({ title: 'Level up!', description: 'You reached level 5', tone: 'warning', duration: 6000 }),
          500,
        );
    }
  };
  const questList = ['Ship one PR', 'Review a teammate PR', 'Write a test', 'Fix a flaky test'];
  return (
    <Section eyebrow="08 — Gamified" title="XP, quests, streaks — pixel-ready widgets">
      <div className="grid">
        <Card variant="feature" hoverable>
          <Stack gap="md">
            <Box display="flex" align="center" justify="space-between">
              <Box display="flex" align="center" gap="sm">
                <IconTile icon="sparkle" label="Level" />
                <Text variant="heading-5">Agent</Text>
                <LevelBadge level={4} />
              </Box>
              <Streak days={7} />
            </Box>
            <XPBar value={xp} max={100} level={4} hint="Complete quests to fill the bar" />
            <AchievementToast
              title="Quest complete"
              description="The XP bar filled — level up!"
              duration={0}
              icon="trophy"
            />
            <Text variant="body-sm" tone="muted">
              Complete quests to fill the bar. Hover cards lift; everything transitions.
            </Text>
          </Stack>
        </Card>
        <Card variant="cream" hoverable>
          <Stack gap="sm">
            <Text variant="heading-5">Daily quests</Text>
            {questList.map((q, i) => (
              <Checkbox key={q} label={q} checked={quests[i]} onCheckedChange={() => toggleQuest(i)} />
            ))}
          </Stack>
        </Card>
        <Card variant="featured" hoverable>
          <Stack gap="sm">
            <Badge variant="accent">Achievement</Badge>
            <Text variant="heading-5">Mantis approved</Text>
            <Text variant="body-sm">Finish a run without a single failed tool call.</Text>
            <Button
              variant="dark"
              size="sm"
              onClick={() =>
                toast.push({ title: 'Achievement unlocked', description: 'Mantis approved · +50 XP', tone: 'success' })
              }
            >
              Unlock (demo)
            </Button>
          </Stack>
        </Card>
      </div>
    </Section>
  );
}

const commandItems: CommandItem[] = [
  { id: 'run', label: 'Run agent', group: 'Harness', icon: 'play', hint: '⏎' },
  { id: 'quest', label: 'Complete daily quest', group: 'Gamified', icon: 'zap' },
  { id: 'theme', label: 'Toggle theme', group: 'View', icon: 'sun' },
  { id: 'deploy', label: 'Deploy to production', group: 'Harness', icon: 'arrow-up-right', disabled: true },
];

export function App() {
  const [tab, setTab] = useState('agents');
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const basics = useMemo(() => ['a'], []);
  return (
    <ThemeProvider storageKey="pm-theme">
      <ToastProvider>
        <div className="pm-app pm-playground">
          <Header onCommand={() => setCommandOpen(true)} />
          <Hero />
          <Section eyebrow="01 — Typography" title="Editorial display, UI sans, mono code">
            <Stack gap="md">
              <Text as="h3" variant="display-lg">
                Display 64 — editorial serif fallback
              </Text>
              <Text as="h4" variant="heading-3">
                Heading 3 — Inter 28/500
              </Text>
              <Text variant="body-md">Body 16/1.55 — the quick brown fox jumps over the lazy dog.</Text>
              <Text variant="body-sm" tone="muted">
                Body small 14 — muted secondary copy.
              </Text>
              <Text variant="micro-uppercase" tone="accent">
                Micro uppercase eyebrow
              </Text>
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
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="lg" rightIcon="arrow-up-right">
                Large
              </Button>
              <Button variant="primary" loading>
                Deploying
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </Section>
          <Section eyebrow="03 — Status" title="Badges, switches, tabs (arrow-key nav)">
            <div className="row">
              <Badge variant="accent">New</Badge>
              <Badge variant="cream">Beta</Badge>
              <Badge variant="dark">Stable</Badge>
              <Badge variant="outline" tone="neutral">
                Draft
              </Badge>
              <Badge variant="outline" tone="success">
                Passing
              </Badge>
              <Badge variant="outline" tone="info">
                Queued
              </Badge>
              <Badge variant="outline" tone="warning">
                Degraded
              </Badge>
              <Badge variant="outline" tone="danger">
                Failed
              </Badge>
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
          <Section eyebrow="04 — Surfaces" title="Cards (hover lift), code, inputs">
            <div className="grid">
              <Card variant="base" hoverable>
                <Stack gap="sm">
                  <IconTile icon="zap" label="Fast" />
                  <Text variant="heading-5">Base card</Text>
                  <Text variant="body-sm" tone="muted">
                    Hover me — I lift.
                  </Text>
                </Stack>
              </Card>
              <Card variant="feature" hoverable>
                <Stack gap="sm">
                  <IconTile icon="sparkle" label="Agents" />
                  <Text variant="heading-5">Feature card</Text>
                  <Text variant="body-sm" tone="muted">
                    32px padding, soft shadow.
                  </Text>
                </Stack>
              </Card>
              <Card variant="cream" hoverable>
                <Stack gap="sm">
                  <IconTile icon="folder" label="Project" />
                  <Text variant="heading-5">Cream card</Text>
                  <Text variant="body-sm">Warm cream surface.</Text>
                </Stack>
              </Card>
              <Card variant="featured" hoverable>
                <Stack gap="sm">
                  <Badge variant="accent">Featured</Badge>
                  <Text variant="heading-5">2px accent border</Text>
                </Stack>
              </Card>
            </div>
            <CodeBlock
              title="agent.ts — bash"
              code={
                '$ vibe run "refactor the auth module"\n✓ plan created (6 steps)\n✓ 12 files edited\n✓ tests passing (41/41)'
              }
            />
          </Section>
          <OverlaysSection onCommand={() => setCommandOpen(true)} />
          <FormSection />
          <HarnessSection />
          <GamifiedSection />
          <Command open={commandOpen} onOpenChange={setCommandOpen} items={commandItems} />
          <AccentStripe />
          <Box as="footer" className="pm-container" paddingY="section" display="flex" justify="space-between">
            <Text variant="micro" tone="muted">
              pixelmist — a Mistral-inspired design system · {basics.length > 0 ? 'animated' : ''}
            </Text>
            <Text variant="micro" tone="accent">
              accent stripe™ (panning)
            </Text>
          </Box>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
