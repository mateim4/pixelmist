import { describe, expect, it, vi } from 'vitest';
import TestRenderer, { act } from 'react-test-renderer';
import { ThemeProvider, XPBar, LevelBadge, Streak, AchievementToast } from '../src';
// 'react-native' is aliased to test/rn-mock.ts in vitest.config.ts
import { __setReducedMotion } from 'react-native';

const render = (node: React.ReactNode) => TestRenderer.create(<ThemeProvider>{node}</ThemeProvider>);
const json = (r: TestRenderer.ReactTestRenderer) => JSON.stringify(r.toJSON());
/** Concatenate all text leaves of a test-renderer tree. */
const textOf = (node: any): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  return textOf(node.children);
};
const text = (r: TestRenderer.ReactTestRenderer) => textOf(r.toJSON());

describe('@pixelmist/native gamification', () => {
  it('XPBar: progressbar role with XP value, level chip, tweened readout', () => {
    __setReducedMotion(true);
    const t = render(<XPBar value={120} max={200} level={3} testID="xp" />);
    const s = json(t);
    expect(s).toContain('progressbar');
    expect(text(t)).toContain('Lv 3');
    expect(text(t)).toContain('120 / 200 XP');
    expect(s).toContain('"now":120');
    expect(s).toContain('"max":200');
    expect(s).toContain('120 of 200 XP, level 3');
    __setReducedMotion(false);
  });

  it('XPBar clamps out-of-range values', () => {
    __setReducedMotion(true);
    const t = render(<XPBar value={999} max={200} />);
    expect(json(t)).toContain('"now":200');
    __setReducedMotion(false);
  });

  it('LevelBadge: accessible label + Lv text', () => {
    const t = render(<LevelBadge level={7} testID="lv" />);
    const s = json(t);
    expect(s).toContain('Level 7');
    expect(text(t)).toContain('Lv 7');
  });

  it('Streak: live streak is attention-toned, zero is neutral (never toned)', () => {
    const live = json(render(<Streak days={5} testID="s" />));
    expect(text(render(<Streak days={5} testID="s" />))).toContain('5 days streak');
    expect(live).toContain('5 day streak'); // accessibilityLabel
    const zero = json(render(<Streak days={0} testID="s" />));
    expect(text(render(<Streak days={0} testID="s" />))).toContain('0 days streak');
    // attention tone uses the attention surface colour; neutral uses the plain surface
    expect(live).not.toBe(zero);
    const one = render(<Streak days={1} />);
    expect(text(one)).toContain('1 day streak');
  });

  it('AchievementToast: polite live region, title/description/action, close, auto-dismiss', () => {
    vi.useFakeTimers();
    __setReducedMotion(false);
    const onClose = vi.fn();
    const onAction = vi.fn();
    let t!: TestRenderer.ReactTestRenderer;
    act(() => {
      t = render(
        <AchievementToast title="First merge" description="Nice one" action={{ label: 'View', onClick: onAction }} onClose={onClose} duration={1000} testID="ach" />,
      );
    });
    const s = json(t);
    expect(s).toContain('polite');
    expect(text(t)).toContain('First merge');
    expect(text(t)).toContain('Nice one');
    expect(text(t)).toContain('View');
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(text(t)).not.toContain('First merge');
    vi.useRealTimers();
  });

  it('AchievementToast: sticky under reduced motion and when duration=0', () => {
    vi.useFakeTimers();
    __setReducedMotion(true);
    let t!: TestRenderer.ReactTestRenderer;
    act(() => {
      t = render(<AchievementToast title="Streak" duration={1000} testID="ach" />);
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(text(t)).toContain('Streak');
    __setReducedMotion(false);
    let t2!: TestRenderer.ReactTestRenderer;
    act(() => {
      t2 = render(<AchievementToast title="Sticky" duration={0} testID="ach2" />);
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(text(t2)).toContain('Sticky');
    vi.useRealTimers();
  });
});
