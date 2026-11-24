import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { parseStepHash, useStepNav } from './useStepNav';

describe('parseStepHash', () => {
  it.each([
    ['#3', 5, 2],
    ['#99', 5, 4],
    ['#0', 5, 0],
    ['#-2', 5, 0],
    ['#abc', 5, 0],
    ['#2.5', 5, 0],
    ['', 5, 0],
  ])('%s with %i steps → index %i', (hash, count, index) => {
    expect(parseStepHash(hash, count)).toBe(index);
  });
});

describe('useStepNav', () => {
  it('starts at the hash step and stays on the last step', () => {
    const { result } = renderHook(() => useStepNav(3, '#3'));
    expect(result.current.index).toBe(2);
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  it('does not go before the first step', () => {
    const { result } = renderHook(() => useStepNav(3, ''));
    act(() => result.current.back());
    expect(result.current.index).toBe(0);
  });

  it('jumps with goTo, clamped', () => {
    const { result } = renderHook(() => useStepNav(3, ''));
    act(() => result.current.goTo(1));
    expect(result.current.index).toBe(1);
    act(() => result.current.goTo(10));
    expect(result.current.index).toBe(2);
  });
});
