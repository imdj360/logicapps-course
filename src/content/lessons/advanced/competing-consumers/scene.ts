import type { Scene } from '../../../../lessons/scene-types';

const core = ['queue', 'c1', 'c2', 'c3', 'queue-c1', 'queue-c2', 'queue-c3'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'queue', kind: 'servicebus', label: 'Invoices queue', sublabel: '50,000 msgs', x: 160, y: 240 },
    { id: 'c1', kind: 'trigger', label: 'Worker 1', sublabel: 'peek-lock', x: 480, y: 100 },
    { id: 'c2', kind: 'trigger', label: 'Worker 2', sublabel: 'peek-lock', x: 480, y: 240 },
    { id: 'c3', kind: 'trigger', label: 'Worker 3', sublabel: 'peek-lock', x: 480, y: 380 },
    { id: 'dlq', kind: 'servicebus', label: 'Dead-letter', sublabel: 'max deliveries', x: 780, y: 380 },
    { id: 'high', kind: 'servicebus', label: 'High priority', sublabel: 'SQL filter', x: 780, y: 100 },
  ],
  edges: [
    { id: 'queue-c1', from: 'queue', to: 'c1' },
    { id: 'queue-c2', from: 'queue', to: 'c2' },
    { id: 'queue-c3', from: 'queue', to: 'c3' },
    { id: 'c3-dlq', from: 'c3', to: 'dlq', style: 'dashed' },
    { id: 'high-c1', from: 'high', to: 'c1', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['queue', 'c1', 'queue-c1'],
      highlight: ['queue'],
      chips: [{ label: 'one worker', value: 'done by noon', tone: 'warn' }],
    },
    pattern: {
      visible: [...core],
      tokens: [{ id: 'p1', edge: 'queue-c1', tone: 'info' }, { id: 'p2', edge: 'queue-c2', tone: 'info' }, { id: 'p3', edge: 'queue-c3', tone: 'info' }],
      chips: [{ label: 'each message', value: 'one worker' }],
    },
    logicapps: {
      visible: [...core],
      highlight: ['c1', 'c2', 'c3'],
      chips: [{ label: 'consumer', value: 'peek-lock trigger' }, { label: 'more workers', value: 'plan scales out' }],
    },
    idempotent: {
      visible: [...core],
      chips: [{ label: 'order', value: 'not guaranteed', tone: 'warn' }, { label: 'delivery', value: 'at least once' }],
    },
    poison: {
      visible: [...core, 'dlq', 'c3-dlq'],
      highlight: ['dlq'],
      tokens: [{ id: 'd1', edge: 'c3-dlq', tone: 'fail' }],
      chips: [{ label: 'poison', value: 'dead-lettered' }],
    },
    priority: {
      visible: [...core, 'high', 'high-c1'],
      highlight: ['high', 'high-c1'],
      tokens: [{ id: 'h1', edge: 'high-c1', tone: 'ok' }],
      chips: [{ label: 'route by', value: 'Priority property' }, { label: 'consumers', value: 'more for high' }],
    },
    starvation: {
      visible: [...core, 'high', 'high-c1'],
      chips: [{ label: 'risk', value: 'low priority may never run', tone: 'warn' }, { label: 'consider', value: 'age boost · own pools' }],
    },
    when: {
      visible: [...core],
      chips: [{ label: 'fits', value: 'independent async work' }, { label: 'not', value: 'strict sequence' }],
    },
    recap: {
      visible: [...core, 'dlq', 'high', 'c3-dlq', 'high-c1'],
      chips: [{ label: 'scale', value: 'add workers' }],
    },
  },
  legend: [{ tone: 'info', label: 'work' }, { tone: 'ok', label: 'urgent' }, { tone: 'fail', label: 'poison' }],
};
