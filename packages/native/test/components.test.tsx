import { describe, expect, it } from 'vitest';
import TestRenderer, { act } from 'react-test-renderer';
import { ThemeProvider, Button, Text, Badge, Progress, Checkbox, Message } from '../src';

const render = (node: React.ReactNode) => TestRenderer.create(<ThemeProvider>{node}</ThemeProvider>);

describe('@pixelmist/native (node render smoke)', () => {
  it('renders Text with resolved theme typography', () => {
    const tree = render(<Text variant="heading-3">Hello native</Text>).toJSON() as any;
    const text = JSON.stringify(tree);
    expect(text).toContain('Hello native');
    expect(text).toContain('"fontSize":28');
  });

  it('Button resolves component tokens from the active theme (daylight primary bg = #E51300)', () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = render(<Button variant="primary">Run</Button>);
    });
    const btn = renderer.root.findByProps({ accessibilityRole: 'button' });
    expect(JSON.stringify(renderer.toJSON())).toContain('Run');
    const style = btn.props.style({ pressed: false }); // Pressable style callback
    expect(JSON.stringify(style)).toContain('#E51300'); // resolved button.primary.bg
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
});
