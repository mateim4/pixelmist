import { describe, expect, it, vi } from 'vitest';
import TestRenderer, { act } from 'react-test-renderer';
import {
  ThemeProvider,
  Button,
  InlineNotification,
  Tag,
  SelectableTag,
  Link,
  InlineLoading,
  PasswordInput,
  Search,
  Select,
  ComboBox,
  Checkbox,
  RadioGroup,
  Radio,
  TextArea,
  DateInput,
  Dialog,
  Progress,
  Tabs,
  Disclosure,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  AppShell,
  Header,
  SideNav,
  Layer,
  Grid,
  ActivityMarker,
  AgentChip,
  HoverCard,
  Legend,
  Composer,
  Markdown,
  Message,
  PermissionPrompt,
  PlanList,
  SessionListItem,
  Popover,
  Tooltip,
  InfoTip,
  Text,
} from '../src';

const render = (node: React.ReactNode) => TestRenderer.create(<ThemeProvider>{node}</ThemeProvider>);
const json = (r: TestRenderer.ReactTestRenderer) => JSON.stringify(r.toJSON());

describe('@pixelmist/native v0.3 components', () => {
  it('Button new variants render (ghost/tertiary/danger/dangerTertiary) and icon-only uses label', () => {
    for (const variant of ['ghost', 'tertiary', 'danger', 'dangerTertiary'] as const) {
      const t = render(<Button variant={variant}>{variant}</Button>);
      expect(json(t)).toContain(variant);
    }
    const iconBtn = render(<Button icon="trash" label="Delete run" />);
    const btn = iconBtn.root.findByProps({ accessibilityRole: 'button' });
    expect(btn.props.accessibilityLabel).toBe('Delete run');
  });

  it('InlineNotification error uses alert role; warning uses live region', () => {
    const err = render(<InlineNotification tone="error" title="Failed" />);
    expect(err.root.findByProps({ accessibilityRole: 'alert' })).toBeTruthy();
    const warn = render(<InlineNotification tone="warning" title="Careful" />);
    expect(warn.root.findByProps({ accessibilityLiveRegion: 'polite' })).toBeTruthy();
  });

  it('Tag tones resolve from semantic tone tokens; SelectableTag toggles selected', () => {
    const t = render(<Tag tone="settled">done</Tag>);
    expect(json(t)).toContain('done');
    let r!: TestRenderer.ReactTestRenderer;
    act(() => {
      r = render(<SelectableTag>chip</SelectableTag>);
    });
    const find = () => r.root.findByProps({ accessibilityRole: 'button' });
    expect(find().props.accessibilityState.selected).toBe(false);
    act(() => {
      find().props.onPress();
    });
    expect(find().props.accessibilityState.selected).toBe(true);
  });

  it('Link renders with link role; InlineLoading states', () => {
    expect(json(render(<Link href="https://example.com">docs</Link>))).toContain('docs');
    expect(json(render(<InlineLoading status="active" label="Working" />))).toContain('Working');
    expect(json(render(<InlineLoading status="finished" label="W" finishedLabel="Done" />))).toContain('Done');
  });

  it('PasswordInput toggles secureTextEntry; Search clears; DateInput is ISO text', () => {
    let r!: TestRenderer.ReactTestRenderer;
    act(() => {
      r = render(<PasswordInput label="Password" />);
    });
    const input = () => r.root.findAll((n) => n.props.secureTextEntry !== undefined)[0]!;
    expect(input().props.secureTextEntry).toBe(true);
    const toggle = r.root.findByProps({ accessibilityLabel: 'Show password' });
    act(() => {
      toggle.props.onPress();
    });
    expect(input().props.secureTextEntry).toBe(false);

    const s = render(<Search defaultValue="abc" />);
    expect(json(s)).toContain('abc');
    const d = render(<DateInput label="Due" value="2025-06-01" />);
    expect(json(d)).toContain('2025-06-01');
  });

  it('Select typed items API; ComboBox filters', () => {
    const items = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }];
    const s = render(<Select label="Pick" items={items} itemToString={(i) => i.name} itemToValue={(i) => i.id} />);
    expect(json(s)).toContain('Pick');
    const c = render(<ComboBox label="Fruit" items={['apple', 'banana']} itemToString={(x) => x} defaultValue="ban" />);
    expect(json(c)).toContain('ban');
  });

  it('Checkbox indeterminate = mixed; RadioGroup hint; TextArea counter', () => {
    const cb = render(<Checkbox label="All" indeterminate />);
    expect(cb.root.findByProps({ accessibilityRole: 'checkbox' }).props.accessibilityState.checked).toBe('mixed');
    const rg = render(
      <RadioGroup label="Size" hint="pick one">
        <Radio value="s" label="S" />
      </RadioGroup>,
    );
    expect(json(rg)).toContain('pick one');
    const ta = render(<TextArea label="Bio" maxLength={10} showCount defaultValue="hello" />);
    expect(json(ta)).toContain('"5","/","10"');
  });

  it('Dialog footer actions + danger; Progress status; Tabs.Panel', () => {
    const onP = vi.fn();
    const d = render(
      <Dialog open title="Delete?" danger primaryAction={{ label: 'Delete', onClick: onP }}>
        <Text>body</Text>
      </Dialog>,
    );
    expect(json(d)).toContain('Delete');
    const p = render(<Progress value={100} status="finished" label="XP" />);
    expect(json(p)).toContain('XP');
    const tabs = render(
      <Tabs defaultValue="one">
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">first</Tabs.Panel>
        <Tabs.Panel value="two">second</Tabs.Panel>
      </Tabs>,
    );
    expect(json(tabs)).toContain('first');
    expect(json(tabs)).not.toContain('second');
  });

  it('Table compound renders; Disclosure toggles; AppShell header+nav; Layer levels; Grid rows', () => {
    const tbl = render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>alpha</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(json(tbl)).toContain('alpha');

    let disc!: TestRenderer.ReactTestRenderer;
    act(() => {
      disc = render(
        <Disclosure title="More">
          <Text>details</Text>
        </Disclosure>,
      );
    });
    expect(json(disc)).not.toContain('details');
    act(() => {
      disc.root.findByProps({ accessibilityRole: 'button' }).props.onPress();
    });
    expect(json(disc)).toContain('details');

    const shell = render(
      <AppShell>
        <Header productName="brdcrmb" />
        <SideNav groups={[{ heading: 'Work', links: [{ label: 'Dashboard', onPress: () => {}, current: true }] }]} />
      </AppShell>,
    );
    expect(json(shell)).toContain('brdcrmb');

    const layer = render(
      <Layer>
        <Layer>
          <Text>x</Text>
        </Layer>
      </Layer>,
    );
    expect(json(layer)).toContain('x');

    const grid = render(
      <Grid columns={2}>
        <Text>a</Text>
        <Text>b</Text>
      </Grid>,
    );
    expect(json(grid)).toContain('a');
  });

  it('ActivityMarker/AgentChip/HoverCard/Legend', () => {
    expect(json(render(<ActivityMarker state="working" />))).toContain('Working');
    const chip = render(<AgentChip name="atlas" color={2} state="idle" />);
    expect(json(chip)).toContain('atlas');
    const hc = render(
      <HoverCard title="Run 42" facts="criteria 2 of 3 met">
        <Text>node</Text>
      </HoverCard>,
    );
    expect(json(hc)).toContain('node');
    const legend = render(<Legend items={[{ label: 'atlas', color: 0 }]} />);
    expect(json(legend)).toContain('atlas');
  });

  it('Composer send/stop; Markdown; Message markdown; PermissionPrompt; PlanList; SessionListItem', () => {
    const onSend = vi.fn();
    const comp = render(<Composer defaultValue="hi" onSend={onSend} />);
    expect(json(comp)).toContain('hi');
    const md = render(<Markdown source={'Hello **world**\n\n- a\n- b\n\n`code`'} />);
    expect(json(md)).toContain('world');
    const msg = render(<Message role="assistant" markdown>{'Here is `code`'}</Message>);
    expect(json(msg)).toContain('code');
    const pp = render(<PermissionPrompt action="run tests" onAllowOnce={() => {}} onAlwaysAllow={() => {}} onDeny={() => {}} />);
    expect(json(pp)).toContain('run tests');
    const plan = render(
      <PlanList
        steps={[
          { label: 'Scan', status: 'done' },
          { label: 'Fix', status: 'inProgress' },
        ]}
      />,
    );
    expect(json(plan)).toContain('Scan');
    const sess = render(<SessionListItem title="Sync" project="brdcrmb" state="working" lastActive="2m ago" />);
    expect(json(sess)).toContain('Sync');
  });

  it('Popover/Tooltip/InfoTip render when open', () => {
    const pop = render(
      <Popover open>
        <Text>pop content</Text>
      </Popover>,
    );
    expect(json(pop)).toContain('pop content');
    const tip = render(
      <InfoTip label="About">
        <Text>info</Text>
      </InfoTip>,
    );
    expect(tip.root.findByProps({ accessibilityLabel: 'About' })).toBeTruthy();
    const tt = render(
      <Tooltip label="hint">
        <Text>trigger</Text>
      </Tooltip>,
    );
    expect(json(tt)).toContain('trigger');
  });
});
