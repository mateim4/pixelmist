import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, Button } from '../src';

function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return <Button onClick={toggleTheme}>theme:{theme}</Button>;
}

describe('ThemeProvider', () => {
  it('sets data-theme on <html> and toggles between daylight and terminal', () => {
    render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>,
    );
    expect(document.documentElement.dataset.theme).toBe('daylight');
    fireEvent.click(screen.getByRole('button', { name: /theme:/ }));
    expect(document.documentElement.dataset.theme).toBe('terminal');
    expect(screen.getByRole('button')).toHaveTextContent('theme:terminal');
  });
});
