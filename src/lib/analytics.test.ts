import { afterEach, describe, expect, it, vi } from 'vitest';
import { track } from './analytics';

afterEach(() => { delete (window as { plausible?: unknown }).plausible; });

describe('track', () => {
  it('does nothing without plausible', () => {
    expect(() => track('lesson_start', { lesson: 'a' })).not.toThrow();
  });

  it('forwards the event and props to plausible', () => {
    const spy = vi.fn();
    (window as { plausible?: unknown }).plausible = spy;
    track('step_reached', { lesson: 'x', step: 3 });
    expect(spy).toHaveBeenCalledWith('step_reached', { props: { lesson: 'x', step: 3 } });
  });

  it('swallows errors thrown by plausible', () => {
    (window as { plausible?: unknown }).plausible = () => { throw new Error('boom'); };
    expect(() => track('devto_click')).not.toThrow();
  });
});
