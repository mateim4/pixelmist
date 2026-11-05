import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  CodeBlock,
  IconTile,
  Stack,
  SunsetStripe,
  Switch,
  Tabs,
  Text,
  TextField,
  ThemeProvider,
  useTheme,
} from '@pixelmist/native';

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Box
      direction="row"
      align="center"
      justify="space-between"
      paddingX="xxl"
      paddingY="md"
      style={{ borderBottomWidth: 1, borderBottomColor: undefined }}
    >
      <Box direction="row" align="center" gap="sm">
        <Box radius="sm" style={{ width: 22, height: 22, backgroundColor: '#FF8204' }} />
        <Text variant="heading-5">pixelmist_</Text>
      </Box>
      <Button variant="secondary" size="sm" onPress={toggleTheme}>
        {theme === 'daylight' ? 'Terminal' : 'Daylight'}
      </Button>
    </Box>
  );
}

export default function App() {
  const [tab, setTab] = useState('agents');
  const [notifications, setNotifications] = useState(true);
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Header />
          <Stack gap="xl" padding="xxl">
            <Badge variant="accent">Design system · mobile</Badge>
            <Text variant="display-lg">Frontier tooling. In your hands.</Text>
            <Text variant="subtitle" tone="muted">
              Same tokens, same components as web — rendered natively via @pixelmist/native.
            </Text>
            <Box direction="row" gap="md" wrap="wrap">
              <Button variant="primary" rightIcon="arrow-right">
                Start building
              </Button>
              <Button variant="secondary">Spec</Button>
            </Box>

            <Text variant="micro-uppercase" tone="accent">
              02 — Actions
            </Text>
            <Box direction="row" gap="md" wrap="wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="dark">Dark</Button>
              <Button variant="cream">Cream</Button>
              <Button variant="link">Link</Button>
              <Button variant="primary" loading>
                Running
              </Button>
            </Box>

            <Text variant="micro-uppercase" tone="accent">
              03 — Status
            </Text>
            <Box direction="row" gap="sm" wrap="wrap">
              <Badge variant="accent">New</Badge>
              <Badge variant="outline" tone="success">
                Passing
              </Badge>
              <Badge variant="outline" tone="danger">
                Failed
              </Badge>
            </Box>
            <Box direction="row" align="center" gap="md">
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

            <Text variant="micro-uppercase" tone="accent">
              04 — Surfaces
            </Text>
            <Card variant="feature">
              <Stack gap="sm">
                <IconTile icon="sparkle" label="Agents" />
                <Text variant="heading-5">Feature card</Text>
                <Text variant="body-sm" tone="muted">
                  Native card from the same component tokens.
                </Text>
              </Stack>
            </Card>
            <CodeBlock title="agent — bash" code={'$ vibe run "ship it"\n✓ done in 4.2s'} />
            <TextField label="API key" hint="Stored locally." placeholder="sk-…" leftIcon="search" />
          </Stack>
          <SunsetStripe />
        </ScrollView>
      </View>
    </ThemeProvider>
  );
}
