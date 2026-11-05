import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../src';

function renderTabs(onValueChange = vi.fn()) {
  render(
    <Tabs variant="underline" defaultValue="a" onValueChange={onValueChange}>
      <Tabs.List>
        <Tabs.Tab value="a">Alpha</Tabs.Tab>
        <Tabs.Tab value="b">Beta</Tabs.Tab>
      </Tabs.List>
    </Tabs>,
  );
  return onValueChange;
}

describe('Tabs', () => {
  it('marks the default tab selected', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'false');
  });

  it('switches selection and calls onValueChange', () => {
    const onValueChange = renderTabs();
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});
