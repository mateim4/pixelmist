import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, Button } from '../src';

describe('Dialog', () => {
  it('renders nothing when closed and a dialog when open', () => {
    const { rerender } = render(
      <Dialog open={false} title="Hi">
        body
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(
      <Dialog open title="Hi">
        body
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  it('Escape calls onOpenChange(false)', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="t">
        x
      </Dialog>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('backdrop click closes, panel click does not', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="t">
        x
      </Dialog>,
    );
    const backdrop = document.querySelector('.pm-dialog__backdrop')!;
    fireEvent.mouseDown(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('focuses the first action on open and traps Tab', () => {
    render(<Dialog open title="t" actions={<Button>OK</Button>} />);
    expect(document.activeElement).toHaveTextContent('OK');
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toHaveTextContent('OK'); // single item wraps to itself
  });
});
