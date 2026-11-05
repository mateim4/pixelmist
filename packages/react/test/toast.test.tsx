import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast, Button } from '../src';

function Trigger() {
  const toast = useToast();
  return (
    <Button onClick={() => toast.push({ title: 'Achievement unlocked', description: '+50 XP', tone: 'success' })}>
      go
    </Button>
  );
}

describe('Toast', () => {
  it('push renders a toast with tone and dismisses on click', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    const toast = screen.getByText('Achievement unlocked').closest('.pm-toast')!;
    expect(toast).toHaveAttribute('data-tone', 'success');
    fireEvent.click(screen.getByLabelText('Dismiss'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Achievement unlocked')).toBeNull();
    vi.useRealTimers();
  });
});
