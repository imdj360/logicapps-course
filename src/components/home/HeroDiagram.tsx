import { useEffect, useState } from 'react';
import { Stage } from '../stage/Stage';
import type { Scene } from '../../lessons/scene-types';

const scene: Scene = {
  viewBox: [560, 380],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Message arrives', x: 150, y: 70 },
    { id: 'parse', kind: 'action', label: 'Parse order', x: 150, y: 190 },
    { id: 'agent', kind: 'llm-agent', label: 'Agent', sublabel: 'picks a tool', x: 410, y: 190 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', x: 150, y: 310 },
    { id: 'human', kind: 'human', label: 'Approve', x: 410, y: 310 },
  ],
  edges: [
    { id: 'e1', from: 'trigger', to: 'parse' },
    { id: 'e2', from: 'parse', to: 'agent' },
    { id: 'e3', from: 'parse', to: 'queue' },
    { id: 'e4', from: 'agent', to: 'human', style: 'dashed' },
  ],
  steps: {
    hero: {
      visible: ['trigger', 'parse', 'agent', 'queue', 'human', 'e1', 'e2', 'e3', 'e4'],
      highlight: ['agent'],
      tokens: [
        { id: 't1', edge: 'e1', tone: 'info' },
        { id: 't2', edge: 'e3', tone: 'ok' },
        { id: 't3', edge: 'e2', tone: 'info' },
      ],
      chips: [
        { label: 'run status', value: 'Running', tone: 'neutral' },
        { label: 'retries', value: '0 of 4', tone: 'ok' },
      ],
    },
  },
  legend: [],
};

export function HeroDiagram() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches), []);
  return <Stage scene={scene} stepId="hero" playing reducedMotion={reduced} />;
}
