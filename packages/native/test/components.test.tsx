import { describe, expect, it } from 'vitest';
import TestRenderer, { act } from 'react-test-renderer';
import { ThemeProvider, Button, Text, Badge, Progress, Checkbox, Message, Card, Switch, TextField, Select, Radio, RadioGroup, Dialog, ToastProvider, AccentScope } from '../src';

const render = (node: React.ReactNode) => TestRenderer.create(<ThemeProvider>{node}</ThemeProvider>);

describe('@pixelmist/native (node render smoke)', () => {
  it('renders Text with resolved theme typography', () => {
    const tree = render(<Text variant="heading-3">Hello native</Text>).toJSON() as any;
    const text = JSON.stringify(tree);
    expect(text).toContain('Hello native');
    expect(text).toContain('"fontSize":28');
  });

  it('Button resolves component tokens from the active theme (daylight primary bg = #6D28D9 (dusk.700))', () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = render(<Button variant="primary">Run</Button>);
    });
    const btn = renderer.root.findByProps({ accessibilityRole: 'button' });
    expect(JSON.stringify(renderer.toJSON())).toContain('Run');
    const style = btn.props.style({ pressed: false }); // Pressable style callback
    expect(JSON.stringify(style)).toContain('#6D28D9'); // resolved button.primary.bg
  });

  it('Badge tone success uses status colors', () => {
    const tree = render(
      <Badge variant="outline" tone="success">
        Passing
      </Badge>,
    ).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('#0E7A4B');
  });

  it('Progress exposes progressbar role with value', () => {
    const tree = render(<Progress value={64} label="XP" />).toJSON() as any;
    const json = JSON.stringify(tree);
    expect(json).toContain('progressbar');
    expect(json).toContain('64');
  });

  it('Checkbox toggles checked state', () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = render(<Checkbox label="Quest" />);
    });
    const find = () => renderer.root.findByProps({ accessibilityRole: 'checkbox' });
    expect(find().props.accessibilityState.checked).toBe(false);
    act(() => {
      find().props.onPress();
    });
    expect(find().props.accessibilityState.checked).toBe(true);
  });

  it('Message renders role icon + content', () => {
    const tree = render(
      <Message role="assistant" name="vibe">
        Ship it
      </Message>,
    ).toJSON() as any;
    const json = JSON.stringify(tree);
    expect(json).toContain('Ship it');
    expect(json).toContain('vibe');
  });

  // Additional tests for 16 total
  it('renders Card with variant base', () => {
    const tree = render(<Card variant="base"><Text>Card content</Text></Card>).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Card content');
  });

  it('renders Switch with label', () => {
    const tree = render(<Switch label="Toggle" />).toJSON() as any;
    const json = JSON.stringify(tree);
    expect(json).toContain('Toggle');
    expect(json).toContain('Switch');
  });

  it('renders TextField with label', () => {
    const tree = render(<TextField label="Input" />).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Input');
  });

  it('renders Select with label', () => {
    const tree = render(
      <Select label="Choose" options={[{ value: 'a', label: 'Option A' }]}>
        <Select.Option value="a" label="Option A" />
      </Select>
    ).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Choose');
  });

  it('renders RadioGroup with options', () => {
    const tree = render(
      <RadioGroup label="Select one">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    ).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Select one');
    expect(JSON.stringify(tree)).toContain('A');
  });

  it('renders Dialog with title', () => {
    const tree = render(
      <Dialog open={true} title="Test">
        <Text>Content</Text>
      </Dialog>
    ).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Test');
    expect(JSON.stringify(tree)).toContain('Content');
  });

  it('renders ToastProvider', () => {
    const tree = render(<ToastProvider><Text>Test</Text></ToastProvider>).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Test');
  });

  it('renders AccentScope', () => {
    const tree = render(
      <AccentScope accentPrimary="#ff0000">
        <Text>Scoped</Text>
      </AccentScope>
    ).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Scoped');
  });

  it('Badge variant accent renders correctly', () => {
    const tree = render(<Badge variant="accent">New</Badge>).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('New');
  });

  it('Button secondary variant renders', () => {
    const tree = render(<Button variant="secondary">Secondary</Button>).toJSON() as any;
    expect(JSON.stringify(tree)).toContain('Secondary');
  });
});
