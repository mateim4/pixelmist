import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dialog,
  Progress,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Disclosure,
  AppShell,
  Header,
  SideNav,
  SkipToContent,
  Layer,
  Grid,
  Card,
  Text,
  Button,
} from '@pixelmist/react';

const meta: Meta = { title: 'Pixelmist/v0.3/Layout & Table' };
export default meta;

export const DialogDemo: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [danger, setDanger] = useState(false);
    return (
      <>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => { setDanger(false); setOpen(true); }}>Open dialog</Button>
          <Button variant="danger" onClick={() => { setDanger(true); setOpen(true); }}>Open danger dialog</Button>
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={danger ? 'Delete this run?' : 'Run settings'}
          description="This cannot be undone."
          danger={danger}
          size="md"
          primaryAction={{ label: danger ? 'Delete' : 'Save', onClick: () => setOpen(false), loading: false }}
          secondaryAction={{ label: 'Cancel', onClick: () => setOpen(false) }}
        >
          <Progress value={64} label="Progress" status="active" hint="64% of criteria met" showValue />
        </Dialog>
      </>
    );
  },
};

export const TabsWithPanels: StoryObj = {
  render: () => (
    <Tabs defaultValue="overview" variant="underline">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="sources">Sources</Tabs.Tab>
        <Tabs.Tab value="check">Check</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="sources">Sources content</Tabs.Panel>
      <Tabs.Panel value="check">Check content</Tabs.Panel>
    </Tabs>
  ),
};

export const TableDemo: StoryObj = {
  render: () => {
    const [sort, setSort] = useState<'ascending' | 'descending' | null>('ascending');
    return (
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeaderCell sort={{ direction: sort, onSort: () => setSort(sort === 'ascending' ? 'descending' : 'ascending') }}>
              Run
            </TableHeaderCell>
            <TableHeaderCell>Agent</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>run-42</TableCell>
            <TableCell>atlas</TableCell>
            <TableCell>running</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>run-41</TableCell>
            <TableCell>vega</TableCell>
            <TableCell>done</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const DisclosureDemo: StoryObj = {
  render: () => (
    <Disclosure title="Advanced options">
      <Text variant="body-sm">Hidden until expanded. Animates with grid-template-rows.</Text>
    </Disclosure>
  ),
};

export const AppShellDemo: StoryObj = {
  render: () => (
    <div style={{ border: '1px solid var(--pm-color-border-soft)', borderRadius: 12, overflow: 'hidden' }}>
      <AppShell>
        <SkipToContent targetId="demo-main" />
        <Header productName="brdcrmb">
          <Button size="sm" variant="ghost" icon="plus" label="New run" />
        </Header>
        <div style={{ display: 'flex' }}>
          <SideNav
            groups={[
              { heading: 'Work', links: [{ label: 'Dashboard', href: '#', current: true }, { label: 'Agents', href: '#' }] },
              { heading: 'This project', links: [{ label: 'Runs', href: '#' }, { label: 'Papers', href: '#' }] },
              { heading: 'This app', links: [{ label: 'Settings', href: '#' }] },
            ]}
          />
          <main id="demo-main" style={{ flex: 1, padding: 16 }}>
            <Layer style={{ padding: 16 }}>
              <Layer style={{ padding: 16 }}>
                <Text variant="body-sm">Nested layers take the next surface token automatically.</Text>
              </Layer>
            </Layer>
            <div style={{ height: 12 }} />
            <Grid columns={{ base: 1, md: 3 }} gap="sm">
              <Card variant="base">1</Card>
              <Card variant="base">2</Card>
              <Card variant="base">3</Card>
            </Grid>
          </main>
        </div>
      </AppShell>
    </div>
  ),
};
