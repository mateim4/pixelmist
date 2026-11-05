import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox, RadioGroup, Radio, Select, TextArea, Progress } from '../src';

describe('Checkbox', () => {
  it('toggles aria-checked and calls onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept" onCheckedChange={onCheckedChange} />);
    const cb = screen.getByRole('checkbox', { name: 'Accept' });
    expect(cb).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(cb);
    expect(cb).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('RadioGroup', () => {
  it('selects one option', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Plan" onValueChange={onValueChange}>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenCalledWith('pro');
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ];
  it('opens listbox and selects an option', () => {
    const onValueChange = vi.fn();
    render(<Select options={options} placeholder="Pick" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('supports arrow-key selection', () => {
    const onValueChange = vi.fn();
    render(<Select options={options} defaultValue="a" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // opens
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // move to Beta
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});

describe('TextArea / Progress', () => {
  it('TextArea wires label and error', () => {
    render(<TextArea label="Prompt" error="Too short" />);
    const ta = screen.getByLabelText('Prompt');
    expect(ta).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
  });

  it('Progress exposes progressbar semantics', () => {
    render(<Progress value={64} label="XP" showValue />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '64');
    expect(screen.getByText('64%')).toBeInTheDocument();
  });
});
