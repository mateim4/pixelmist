import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextField, PasswordInput, Search, Select, ComboBox, Checkbox, RadioGroup, Radio, TextArea, DateInput } from '../src';

describe('TextField v0.3', () => {
  it('warning message without aria-invalid; error sets aria-invalid + role=alert', () => {
    const { rerender } = render(<TextField label="Name" warning="Check this" />);
    const input = screen.getByLabelText('Name');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('Check this')).toBeInTheDocument();
    rerender(<TextField label="Name" error="Required" />);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('hideLabel keeps the label accessible but visually hidden', () => {
    render(<TextField label="Secret" hideLabel />);
    const label = screen.getByText('Secret');
    expect(label).toHaveClass('pm-sr-only');
    expect(screen.getByLabelText('Secret')).toBeInTheDocument();
  });

  it('readOnly and disabled pass through; data-testid lands on the input', () => {
    render(<TextField label="A" readOnly disabled data-testid="tf" />);
    const input = screen.getByTestId('tf');
    expect(input).toHaveAttribute('readonly');
    expect(input).toBeDisabled();
  });

  it('size classes', () => {
    render(<TextField label="S" size="sm" />);
    expect(screen.getByLabelText('S').closest('.pm-field')).toHaveClass('pm-field--sm');
  });
});

describe('PasswordInput', () => {
  it('toggles type and aria-pressed with a labelled button', () => {
    render(<PasswordInput label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Search', () => {
  it('role=search, clear button clears, Escape clears, controlled value', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Search value="abc" onValueChange={onValueChange} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('abc');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onValueChange).toHaveBeenCalledWith('');
    rerender(<Search value="abc" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('uncontrolled with defaultValue', () => {
    render(<Search defaultValue="hi" />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'hey' } });
    expect(input).toHaveValue('hey');
  });
});

describe('Select v0.3', () => {
  const items = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
  ];
  it('typed items + itemToString API, keyboard select', () => {
    const onValueChange = vi.fn();
    render(
      <Select
        items={items}
        itemToString={(i) => i.name}
        itemToValue={(i) => i.id}
        label="Pick"
        onValueChange={onValueChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: /pick/i });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('helper and warning messages; error role=alert', () => {
    const { rerender } = render(<Select options={[{ value: 'x', label: 'X' }]} label="L" hint="pick one" />);
    expect(screen.getByText('pick one')).toBeInTheDocument();
    rerender(<Select options={[{ value: 'x', label: 'X' }]} label="L" warning="meh" />);
    expect(screen.getByText('meh')).toBeInTheDocument();
    rerender(<Select options={[{ value: 'x', label: 'X' }]} label="L" error="bad" />);
    expect(screen.getByRole('alert')).toHaveTextContent('bad');
  });
});

describe('ComboBox', () => {
  const items = ['apple', 'banana', 'cherry'];
  it('combobox role, type-to-filter, arrows + enter select, escape closes', () => {
    const onSelect = vi.fn();
    const onValueChange = vi.fn();
    render(<ComboBox items={items} itemToString={(s) => s} onSelect={onSelect} onValueChange={onValueChange} label="Fruit" />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'an' } });
    expect(onValueChange).toHaveBeenCalledWith('an');
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent('banana');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('banana');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Checkbox v0.3', () => {
  it('indeterminate sets aria-checked=mixed and clicking checks', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="All" indeterminate onCheckedChange={onCheckedChange} />);
    const cb = screen.getByRole('checkbox', { name: 'All' });
    expect(cb).toHaveAttribute('aria-checked', 'mixed');
    fireEvent.click(cb);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('helper and error text', () => {
    const { rerender } = render(<Checkbox label="C" hint="helper" />);
    expect(screen.getByText('helper')).toBeInTheDocument();
    rerender(<Checkbox label="C" error="nope" />);
    expect(screen.getByRole('alert')).toHaveTextContent('nope');
  });
});

describe('RadioGroup v0.3', () => {
  it('helper and error; radio selection', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <RadioGroup label="Size" hint="pick one" onValueChange={onValueChange}>
        <Radio value="s" label="Small" />
        <Radio value="l" label="Large" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
    expect(screen.getByText('pick one')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Large' }));
    expect(onValueChange).toHaveBeenCalledWith('l');
    rerender(
      <RadioGroup label="Size" error="required">
        <Radio value="s" label="Small" />
      </RadioGroup>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('required');
  });
});

describe('TextArea v0.3', () => {
  it('character counter with maxLength', () => {
    render(<TextArea label="Bio" maxLength={10} showCount defaultValue="hello" />);
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });
});

describe('DateInput', () => {
  it('renders a native date input with ISO value and label', () => {
    render(<DateInput label="Due" value="2025-06-01" readOnly />);
    const input = screen.getByLabelText('Due');
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveValue('2025-06-01');
  });
});
