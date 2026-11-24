import { useCallback, useState } from 'react';

export function parseStepHash(hash: string, count: number): number {
  const raw = hash.replace(/^#/, '');
  if (!/^-?\d+$/.test(raw)) return 0;
  const n = Math.min(Math.max(Number(raw), 1), count);
  return n - 1;
}

export function useStepNav(count: number, initialHash: string) {
  const [index, setIndex] = useState(() => parseStepHash(initialHash, count));
  const clamp = useCallback((i: number) => Math.min(Math.max(i, 0), count - 1), [count]);

  return {
    index,
    next: useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]),
    back: useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]),
    goTo: useCallback((i: number) => setIndex(clamp(i)), [clamp]),
  };
}
