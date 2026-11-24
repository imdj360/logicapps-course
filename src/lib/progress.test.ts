import { beforeEach, describe, expect, it, vi } from 'vitest';
import { completedCount, getLesson, getProgress, markComplete, markStepReached, onProgressChange } from './progress';

const memory = (): Storage => {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size; },
  };
};

const throwing = (): Storage => ({
  ...memory(),
  getItem: () => { throw new Error('blocked'); },
  setItem: () => { throw new Error('blocked'); },
});

let s: Storage;
beforeEach(() => { s = memory(); });

describe('progress', () => {
  it('round-trips step and completion', () => {
    markStepReached('a', 3, s);
    markComplete('a', s);
    expect(getLesson('a', s)).toEqual({ lastStep: 3, completed: true });
  });

  it('keeps the furthest step reached', () => {
    markStepReached('a', 2, s);
    markStepReached('a', 1, s);
    expect(getLesson('a', s)?.lastStep).toBe(2);
  });

  it('returns null for an unknown lesson', () => {
    expect(getLesson('nope', s)).toBeNull();
  });

  it('survives storage that throws', () => {
    const t = throwing();
    expect(getProgress(t)).toEqual({});
    expect(() => markStepReached('a', 1, t)).not.toThrow();
    expect(() => markComplete('a', t)).not.toThrow();
  });

  it('treats corrupt JSON as empty', () => {
    s.setItem('lac:progress:v1', '{not json');
    expect(getProgress(s)).toEqual({});
  });

  it('treats non-object JSON as empty', () => {
    s.setItem('lac:progress:v1', '[1,2]');
    expect(getProgress(s)).toEqual({});
  });

  it('counts only the listed completed slugs', () => {
    markComplete('a', s);
    markComplete('b', s);
    markStepReached('c', 1, s);
    expect(completedCount(['a', 'c', 'x'], s)).toBe(1);
  });

  it('notifies listeners on change and can unsubscribe', () => {
    const cb = vi.fn();
    const off = onProgressChange(cb);
    markComplete('a', s);
    expect(cb).toHaveBeenCalledTimes(1);
    off();
    markComplete('b', s);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
