import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineNotification, Tag, SelectableTag } from '../src';

describe('InlineNotification', () => {
  it('error uses role=alert, others role=status', () => {
    const { rerender } = render(<InlineNotification tone="error" title="Failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    rerender(<InlineNotification tone="warning" title="Careful" />);
    expect(screen.getByRole('status')).toHaveTextContent('Careful');
    rerender(<InlineNotification tone="success" title="Done" />);
    expect(screen.getByRole('status')).toHaveTextContent('Done');
    rerender(<InlineNotification tone="info" title="FYI" />);
    expect(screen.getByRole('status')).toHaveTextContent('FYI');
  });

  it('renders subtitle, action and close; passes data-testid through', () => {
    const onClose = vi.fn();
    const onAction = vi.fn();
    render(
      <InlineNotification
        tone="warning"
        title="Unsaved"
        subtitle="You have unsaved changes"
        action={{ label: 'Save now', onClick: onAction }}
        onClose={onClose}
        data-testid="notif"
      />,
    );
    expect(screen.getByTestId('notif')).toHaveTextContent('You have unsaved changes');
    fireEvent.click(screen.getByRole('button', { name: 'Save now' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Tag', () => {
  it('renders the four semantic tones plus neutral, variants and sizes', () => {
    const { rerender } = render(
      <Tag tone="attention" data-testid="t">
        needs review
      </Tag>,
    );
    expect(screen.getByTestId('t')).toHaveAttribute('data-tone', 'attention');
    rerender(
      <Tag tone="progress" variant="highContrast" size="sm">
        running
      </Tag>,
    );
    const tag = screen.getByText('running');
    expect(tag).toHaveClass('pm-tag--highContrast', 'pm-tag--sm');
    expect(tag).toHaveAttribute('data-tone', 'progress');
    rerender(<Tag variant="outline">outline</Tag>);
    expect(screen.getByText('outline')).toHaveClass('pm-tag--outline');
  });
});

describe('SelectableTag', () => {
  it('toggles aria-pressed (uncontrolled)', () => {
    render(<SelectableTag>Filter</SelectableTag>);
    const chip = screen.getByRole('button', { name: 'Filter' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('controlled selected + onSelectedChange', () => {
    const onSelectedChange = vi.fn();
    const { rerender } = render(
      <SelectableTag selected={false} onSelectedChange={onSelectedChange}>
        Chip
      </SelectableTag>,
    );
    const chip = screen.getByRole('button', { name: 'Chip' });
    fireEvent.click(chip);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    rerender(
      <SelectableTag selected onSelectedChange={onSelectedChange}>
        Chip
      </SelectableTag>,
    );
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});
