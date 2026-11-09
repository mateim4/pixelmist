import { createRef } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { XPBar } from '../src/components/XPBar';
import { LevelBadge } from '../src/components/LevelBadge';
import { Streak } from '../src/components/Streak';
import { AchievementToast } from '../src/components/AchievementToast';

const setReducedMotion = (reduced: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (q: string) => ({
      matches: reduced && q.includes('prefers-reduced-motion'),
      media: q,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }),
  });
};

beforeEach(() => setReducedMotion(false));
afterEach(() => vi.useRealTimers());

describe('XPBar', () => {
  it('progressbar ARIA with XP values + level in valuetext; pass-through + ref on root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<XPBar value={120} max={200} level={3} data-testid="xp" ref={ref} />);
    const root = screen.getByTestId('xp');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-tone', 'progress');
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '200');
    expect(bar).toHaveAttribute('aria-valuenow', '120');
    expect(bar).toHaveAttribute('aria-valuetext', '120 of 200 XP, level 3');
    expect(root).toHaveTextContent('Lv 3');
    expect(root).toHaveTextContent('120 / 200 XP');
    // fill scales via transform, never resizes
    const fill = root.querySelector('.pm-xpbar__fill') as HTMLElement;
    expect(fill.style.transform).toBe('scaleX(0.6)');
  });

  it('clamps out-of-range and non-finite values', () => {
    const { rerender } = render(<XPBar value={999} max={200} data-testid="xp" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '200');
    rerender(<XPBar value={Number.NaN} max={200} data-testid="xp" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('tweened readout jumps instantly under prefers-reduced-motion', () => {
    setReducedMotion(true);
    const { rerender } = render(<XPBar value={10} max={100} data-testid="xp" />);
    expect(screen.getByTestId('xp')).toHaveTextContent('10 / 100 XP');
    rerender(<XPBar value={42} max={100} data-testid="xp" />);
    expect(screen.getByTestId('xp')).toHaveTextContent('42 / 100 XP');
  });

  it('aria-label from props lands on the track', () => {
    render(<XPBar value={1} max={10} aria-label="Quest progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Quest progress');
  });
});

describe('LevelBadge', () => {
  it('renders Lv n with an accessible label; pass-through + ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<LevelBadge level={7} data-testid="lv" ref={ref} />);
    const el = screen.getByTestId('lv');
    expect(ref.current).toBe(el);
    expect(el).toHaveAttribute('aria-label', 'Level 7');
    expect(el).toHaveTextContent('Lv 7');
  });
});

describe('Streak', () => {
  it('live streak is attention-toned; zero is never toned (neutral)', () => {
    const { rerender } = render(<Streak days={5} data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('data-tone', 'attention');
    expect(el).toHaveAttribute('aria-label', '5 day streak');
    expect(el).toHaveTextContent('5 days streak');
    rerender(<Streak days={0} data-testid="s" />);
    expect(el).toHaveAttribute('data-tone', 'neutral');
    expect(el).toHaveTextContent('0 days streak');
  });

  it('singular for one day', () => {
    render(<Streak days={1} />);
    expect(screen.getByText('1 day streak')).toBeInTheDocument();
  });
});

describe('AchievementToast', () => {
  it('role=status, title/description/action, close button, pass-through + ref', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const onAction = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <AchievementToast
        title="First merge"
        description="You merged your first PR"
        action={{ label: 'View', onClick: onAction }}
        onClose={onClose}
        duration={0}
        data-testid="ach"
        ref={ref}
      />,
    );
    const el = screen.getByTestId('ach');
    expect(ref.current).toBe(el);
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('data-tone', 'settled');
    expect(el).toHaveTextContent('First merge');
    expect(el).toHaveTextContent('You merged your first PR');
    fireEvent.click(screen.getByRole('button', { name: 'View' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('ach')).toBeNull();
  });

  it('auto-dismisses after duration; pauses on hover and resumes on leave', () => {
    vi.useFakeTimers();
    render(<AchievementToast title="Streak" duration={1000} data-testid="ach" />);
    const el = screen.getByTestId('ach');
    act(() => {
      vi.advanceTimersByTime(600);
    });
    fireEvent.mouseEnter(el); // pause at 600ms remaining 400
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('ach')).toBeInTheDocument(); // still there while hovered
    fireEvent.mouseLeave(el); // resume with 400ms left, then 180ms exit animation
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByTestId('ach')).toBeNull();
  });

  it('never auto-dismisses under prefers-reduced-motion', () => {
    setReducedMotion(true);
    vi.useFakeTimers();
    render(<AchievementToast title="Streak" duration={1000} data-testid="ach" />);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByTestId('ach')).toBeInTheDocument();
  });
});
