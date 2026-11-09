import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, Progress, Tabs } from '../src';

describe('Dialog v0.3', () => {
  it('footer with primary/secondary actions; danger flavour; size class', () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    render(
      <Dialog
        open
        title="Delete?"
        danger
        size="lg"
        primaryAction={{ label: 'Delete', onClick: onPrimary }}
        secondaryAction={{ label: 'Cancel', onClick: onSecondary }}
      >
        body
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('pm-dialog--lg', 'pm-dialog--danger');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('passive renders no footer; loading primary shows spinner and is disabled', () => {
    const { rerender } = render(<Dialog open passive title="t" />);
    expect(screen.getByRole('dialog').querySelector('.pm-dialog__actions')).toBeNull();
    rerender(<Dialog open title="t" primaryAction={{ label: 'Saving', onClick: () => {}, loading: true }} />);
    const btn = screen.getByRole('button', { name: 'Saving' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('closeOnOutsideClick=false keeps the dialog open on backdrop click', () => {
    const onOpenChange = vi.fn();
    const { container, rerender } = render(
      <Dialog open onOpenChange={onOpenChange} title="t">
        x
      </Dialog>,
    );
    const backdrop = container.querySelector('.pm-dialog__backdrop') ?? document.querySelector('.pm-dialog__backdrop')!;
    fireEvent.mouseDown(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    rerender(
      <Dialog open closeOnOutsideClick={false} onOpenChange={onOpenChange} title="t">
        x
      </Dialog>,
    );
    onOpenChange.mockClear();
    const backdrop2 = document.querySelector('.pm-dialog__backdrop')!;
    fireEvent.mouseDown(backdrop2);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('aria-labelledby/aria-describedby wiring', () => {
    render(
      <Dialog open title="Title here" description="Desc here">
        x
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).toHaveTextContent('Title here');
  });
});

describe('Progress v0.3', () => {
  it('passes data-testid through and forwards ref to the root', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Progress ref={ref} value={40} label="XP" data-testid="prog" />);
    const el = screen.getByTestId('prog');
    expect(ref.current).toBe(el);
    expect(el.querySelector('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '40');
  });

  it('status finished/error drive tone and aria-busy only when active', () => {
    const { rerender } = render(<Progress value={100} status="finished" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.closest('.pm-progress')).toHaveAttribute('data-status', 'finished');
    expect(bar.closest('.pm-progress')).toHaveAttribute('data-tone', 'success');
    expect(bar).not.toHaveAttribute('aria-busy');
    rerender(<Progress value={10} status="error" hint="failed" />);
    expect(screen.getByRole('progressbar').closest('.pm-progress')).toHaveAttribute('data-tone', 'danger');
    expect(screen.getByText('failed')).toBeInTheDocument();
  });
});

describe('Tabs.Panel', () => {
  it('compound API with panels: role=tabpanel, aria wiring, hidden when inactive', () => {
    render(
      <Tabs defaultValue="one">
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">first panel</Tabs.Panel>
        <Tabs.Panel value="two">second panel</Tabs.Panel>
      </Tabs>,
    );
    const tabOne = screen.getByRole('tab', { name: 'One' });
    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    const panelOne = screen.getByRole('tabpanel', { name: 'One' });
    expect(panelOne).toHaveTextContent('first panel');
    expect(tabOne).toHaveAttribute('aria-controls', panelOne.id);
    expect(panelOne).toHaveAttribute('aria-labelledby', tabOne.id);
    expect(screen.queryByText('second panel')).toBeNull(); // inactive panel unmounted
    fireEvent.click(tabTwo);
    expect(screen.getByRole('tabpanel', { name: 'Two' })).toHaveTextContent('second panel');
    expect(screen.queryByText('first panel')).toBeNull();
  });
});
