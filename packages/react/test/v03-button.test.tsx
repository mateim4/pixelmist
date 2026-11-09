import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src';

describe('Button v0.3 variants', () => {
  it.each(['ghost', 'tertiary', 'danger', 'dangerTertiary'] as const)('renders variant %s', (variant) => {
    render(<Button variant={variant}>{variant}</Button>);
    expect(screen.getByRole('button', { name: variant })).toHaveClass(`pm-btn--${variant}`);
  });

  it('icon-only button uses label as accessible name and passes data-testid through', () => {
    render(<Button icon="trash" label="Delete run" data-testid="del-btn" />);
    const btn = screen.getByRole('button', { name: 'Delete run' });
    expect(btn).toHaveClass('pm-btn--icon-only');
    expect(btn).toHaveAttribute('data-testid', 'del-btn');
    expect(btn.querySelector('svg')).not.toBeNull();
  });

  it('icon-only button warns when no accessible label is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Button icon="x" />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('wraps in a tooltip when tooltip is set', () => {
    render(
      <Button icon="help" label="Help" tooltip="Get help" />,
    );
    const wrap = screen.getByRole('button', { name: 'Help' }).parentElement;
    expect(wrap).toHaveClass('pm-tooltip');
  });

  it('density classes sm/md/lg are applied', () => {
    render(<Button size="sm">S</Button>);
    expect(screen.getByRole('button', { name: 'S' })).toHaveClass('pm-btn--sm');
  });

  it('forwards ref to the button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>R</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
