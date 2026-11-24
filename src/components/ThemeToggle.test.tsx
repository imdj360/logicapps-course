import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  vi.restoreAllMocks();
});

describe('ThemeToggle', () => {
  it('switches between light and dark', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { getByRole } = render(<ThemeToggle />);
    fireEvent.click(getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    fireEvent.click(getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('still toggles when storage throws', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { getByRole } = render(<ThemeToggle />);
    fireEvent.click(getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
