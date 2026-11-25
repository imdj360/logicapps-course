import { useEffect, useState } from 'react';
import { Stage } from '../stage/Stage';
import type { Scene } from '../../lessons/scene-types';

// Same order workflow as the first lesson (Microsoft's overview example): one run takes the "under the limit" path.
const scene: Scene = {
  viewBox: [560, 380],
  groups: [{ id: 'wf', label: 'Order workflow', x: 30, y: 30, w: 500, h: 340 }],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', sublabel: 'HTTP request', x: 150, y: 100 },
    { id: 'cond', kind: 'condition', label: 'Over limit?', sublabel: 'Condition', x: 150, y: 215 },
    { id: 'create', kind: 'connector-builtin', label: 'Create order', sublabel: 'HTTP to ERP', x: 150, y: 330 },
    { id: 'review', kind: 'connector-managed', label: 'Ask for review', sublabel: 'Outlook email', x: 410, y: 215 },
  ],
  edges: [
    { id: 'e1', from: 'trigger', to: 'cond' },
    { id: 'e2', from: 'cond', to: 'create', label: 'under' },
    { id: 'e3', from: 'cond', to: 'review', label: 'over', style: 'dashed' },
  ],
  steps: {
    hero: {
      visible: ['wf', 'trigger', 'cond', 'create', 'review', 'e1', 'e2', 'e3'],
      highlight: ['create'],
      skipped: ['review'],
      tokens: [
        { id: 't1', edge: 'e1', tone: 'info' },
        { id: 't2', edge: 'e2', tone: 'ok' },
      ],
      chips: [
        { label: 'order total', value: 'under the limit' },
        { label: 'run status', value: 'Succeeded', tone: 'ok' },
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
