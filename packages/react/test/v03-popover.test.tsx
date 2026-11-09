import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRef } from 'react';
import { Popover, Tooltip, InfoTip } from '../src';

describe('Popover', () => {
  it('renders nothing when closed, content when open, passes props through', () => {
    const { rerender } = render(
      <Popover open={false} anchor={() => null} data-testid="p">
        hi
      </Popover>,
    );
    expect(screen.queryByTestId('p')).toBeNull();
    rerender(
      <Popover open anchor={() => null} data-testid="p" aria-label="card">
        hi
      </Popover>,
    );
    const pop = screen.getByTestId('p');
    expect(pop).toHaveTextContent('hi');
    expect(pop).toHaveAttribute('aria-label', 'card');
    expect(pop).toHaveAttribute('data-placement');
  });

  it('Escape closes via onOpenChange and returns focus to the anchor', () => {
    const onOpenChange = vi.fn();
    function Demo() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={ref}>anchor</button>
          <Popover open onOpenChange={onOpenChange} anchor={ref}>
            content
          </Popover>
        </>
      );
    }
    render(<Demo />);
    const anchor = screen.getByRole('button', { name: 'anchor' });
    anchor.focus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.activeElement).toBe(anchor);
  });
});

describe('Tooltip', () => {
  it('opens on keyboard focus with role=tooltip and aria-describedby, Escape dismisses', () => {
    render(
      <Tooltip label="hint text">
        <button>trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'trigger' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.focus(trigger);
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('hint text');
    expect(trigger).toHaveAttribute('aria-describedby', tip.id);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('opens on hover after the 120ms delay', () => {
    vi.useFakeTimers();
    render(
      <Tooltip label="hover hint">
        <button>trigger</button>
      </Tooltip>,
    );
    const wrap = screen.getByRole('button', { name: 'trigger' }).parentElement!;
    fireEvent.mouseEnter(wrap);
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(130);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('InfoTip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('click pins open; second click closes; aria-expanded reflects state', () => {
    render(
      <InfoTip label="About conflicts" data-testid="tip">
        Conflicts are pairs of records that disagree.
      </InfoTip>,
    );
    const btn = screen.getByTestId('tip');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Conflicts are pairs of records that disagree.')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape closes and returns focus to the ? without reopening', () => {
    render(
      <InfoTip label="About" data-testid="tip">
        info
      </InfoTip>,
    );
    const btn = screen.getByTestId('tip');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    btn.focus();
    fireEvent.keyDown(btn.parentElement!, { key: 'Escape' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(btn);
    // focus returned programmatically must not reopen it
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('outside click closes a pinned tip', () => {
    render(
      <div>
        <InfoTip label="About" data-testid="tip">
          info
        </InfoTip>
        <button>outside</button>
      </div>,
    );
    const btn = screen.getByTestId('tip');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on hover after 120ms', () => {
    render(
      <InfoTip label="About" data-testid="tip">
        info
      </InfoTip>,
    );
    const wrap = screen.getByTestId('tip').parentElement!;
    fireEvent.mouseEnter(wrap);
    act(() => {
      vi.advanceTimersByTime(130);
    });
    expect(screen.getByTestId('tip')).toHaveAttribute('aria-expanded', 'true');
  });
});
