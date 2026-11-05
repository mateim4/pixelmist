import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src';

describe('Button', () => {
  it('renders label and applies variant/size classes', () => {
    render(
      <Button variant="secondary" size="lg">
        Save
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('pm-btn', 'pm-btn--secondary', 'pm-btn--lg');
  });

  it('fires onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Run</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('loading disables the button and shows a spinner', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Deploy
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn.querySelector('.pm-btn__spinner')).not.toBeNull();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders icons', () => {
    render(
      <Button leftIcon="terminal" rightIcon="arrow-right">
        Open
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Open' });
    expect(btn.querySelectorAll('svg')).toHaveLength(2);
  });
});
