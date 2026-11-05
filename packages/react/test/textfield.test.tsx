import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextField } from '../src';

describe('TextField', () => {
  it('associates label, hint and input', () => {
    render(<TextField label="API key" hint="Stored locally" placeholder="sk-…" />);
    const input = screen.getByLabelText('API key');
    expect(input).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Stored locally')).toHaveAttribute('id', input.getAttribute('aria-describedby'));
  });

  it('shows error with role=alert and aria-invalid', () => {
    render(<TextField label="Name" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });
});
