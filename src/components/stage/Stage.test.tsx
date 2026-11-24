import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Stage } from './Stage';
import type { Scene } from '../../lessons/scene-types';

const scene: Scene = {
  viewBox: [900, 560],
  nodes: [
    { id: 't', kind: 'trigger', label: 'HTTP request', x: 100, y: 100 },
    { id: 'a', kind: 'action', label: 'Parse JSON', x: 300, y: 100 },
    { id: 'q', kind: 'servicebus', label: 'Orders queue', x: 500, y: 100 },
  ],
  edges: [
    { id: 't-a', from: 't', to: 'a' },
    { id: 'a-q', from: 'a', to: 'q', style: 'dashed' },
  ],
  steps: {
    one: { visible: ['t', 'a', 't-a'], chips: [{ label: 'run status', value: 'Running' }] },
    two: {
      visible: ['t', 'a', 'q', 't-a', 'a-q'], failed: ['q'],
      tokens: [{ id: 'm1', edge: 'a-q', tone: 'fail' }],
      chips: [{ label: 'run status', value: 'Failed', tone: 'fail' }],
    },
  },
  groups: [{ id: 'run', label: 'One run', x: 10, y: 40, w: 400, h: 120 }],
  legend: [{ tone: 'info', label: 'message' }],
};

const ids = (c: HTMLElement, attr: string) =>
  [...c.querySelectorAll(`[${attr}]`)].map((e) => e.getAttribute(attr));

describe('Stage', () => {
  it('renders only the nodes visible in the step', () => {
    const { container } = render(<Stage scene={scene} stepId="one" playing reducedMotion={false} />);
    expect(ids(container, 'data-node-id')).toEqual(['t', 'a']);
    expect(ids(container, 'data-edge-id')).toEqual(['t-a']);
  });

  it('draws a group box only when the step lists it', () => {
    const withGroup = { ...scene, steps: { ...scene.steps, three: { visible: ['run', 't', 'a'], chips: [] } } };
    const { container, rerender } = render(<Stage scene={withGroup} stepId="three" playing reducedMotion={false} />);
    expect(ids(container, 'data-group-id')).toEqual(['run']);
    expect(container.querySelector('[data-group-id="run"]')).toHaveTextContent('One run');
    rerender(<Stage scene={withGroup} stepId="one" playing reducedMotion={false} />);
    expect(ids(container, 'data-group-id')).toEqual([]);
  });

  it('marks failed nodes', () => {
    const { container } = render(<Stage scene={scene} stepId="two" playing reducedMotion={false} />);
    expect(container.querySelector('[data-node-id="q"]')).toHaveAttribute('data-state', 'failed');
    expect(container.querySelector('[data-node-id="a"]')).toHaveAttribute('data-state', 'normal');
  });

  it('renders one element per token', () => {
    const { container } = render(<Stage scene={scene} stepId="two" playing reducedMotion={false} />);
    expect(ids(container, 'data-token-id')).toEqual(['m1']);
    expect(container.querySelector('[data-token-id="m1"]')).toHaveAttribute('data-animated', 'true');
  });

  it('does not animate tokens with reduced motion', () => {
    const { container } = render(<Stage scene={scene} stepId="two" playing reducedMotion />);
    expect(container.querySelector('[data-token-id="m1"]')).toHaveAttribute('data-animated', 'false');
  });

  it('does not animate tokens while paused', () => {
    const { container } = render(<Stage scene={scene} stepId="two" playing={false} reducedMotion={false} />);
    expect(container.querySelector('[data-token-id="m1"]')).toHaveAttribute('data-animated', 'false');
  });

  it('shows the step chips', () => {
    const { getByText } = render(<Stage scene={scene} stepId="two" playing reducedMotion={false} />);
    expect(getByText('Failed')).toBeInTheDocument();
  });

  it('renders an empty stage for an unknown step', () => {
    const { container } = render(<Stage scene={scene} stepId="nope" playing reducedMotion={false} />);
    expect(container.querySelectorAll('[data-node-id]')).toHaveLength(0);
  });
});
