import type { Scene } from '../../../../lessons/scene-types';

const core = ['src', 'queue', 'run1', 'run2', 'src-queue', 'queue-run1', 'queue-run2'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'src', kind: 'user', label: 'Order system', sublabel: 'order updates', x: 120, y: 240 },
    { id: 'queue', kind: 'servicebus', label: 'Session queue', sublabel: 'FIFO in session', x: 420, y: 240 },
    { id: 'run1', kind: 'scope', label: 'Run: order 4711', sublabel: 'one session', x: 740, y: 130 },
    { id: 'run2', kind: 'scope', label: 'Run: order 4712', sublabel: 'in parallel', x: 740, y: 350 },
    { id: 'pq', kind: 'servicebus', label: 'Orders queue', sublabel: 'no sessions', x: 420, y: 240 },
    { id: 'ra', kind: 'scope', label: 'Run A', sublabel: 'gets cancelled', x: 740, y: 130 },
    { id: 'rb', kind: 'scope', label: 'Run B', sublabel: 'gets changed', x: 740, y: 350 },
    { id: 'renew', kind: 'condition', label: 'Renew lock', sublabel: 'Until loop', x: 420, y: 80 },
    { id: 'dlq', kind: 'servicebus', label: 'Dead-letter', sublabel: 'MaxDelivery 10', x: 420, y: 410 },
  ],
  edges: [
    { id: 'src-pq', from: 'src', to: 'pq' },
    { id: 'pq-ra', from: 'pq', to: 'ra' },
    { id: 'pq-rb', from: 'pq', to: 'rb' },
    { id: 'src-queue', from: 'src', to: 'queue' },
    { id: 'queue-run1', from: 'queue', to: 'run1' },
    { id: 'queue-run2', from: 'queue', to: 'run2' },
    { id: 'renew-run1', from: 'renew', to: 'run1', style: 'dashed' },
    { id: 'queue-dlq', from: 'queue', to: 'dlq', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['src', 'pq', 'ra', 'rb', 'src-pq', 'pq-ra', 'pq-rb'],
      failed: ['ra'],
      tokens: [{ id: 'q1', edge: 'pq-ra', tone: 'fail' }, { id: 'q2', edge: 'pq-rb', tone: 'info' }],
      chips: [{ label: 'arrived', value: 'created, changed, cancelled' }, { label: 'processed', value: 'out of order', tone: 'fail' }],
    },
    pattern: {
      visible: [...core],
      tokens: [{ id: 'p1', edge: 'queue-run1', tone: 'ok' }, { id: 'p2', edge: 'queue-run2', tone: 'ok' }],
      chips: [{ label: 'one order', value: 'in order' }, { label: 'many orders', value: 'in parallel' }],
    },
    sessions: {
      visible: [...core],
      highlight: ['queue'],
      chips: [{ label: 'SessionId', value: 'order ID' }, { label: 'one session', value: 'one receiver' }, { label: 'tier', value: 'Standard or Premium' }],
    },
    sequence: {
      visible: [...core],
      tokens: [{ id: 'q1', edge: 'src-queue', tone: 'info' }, { id: 'q2', edge: 'queue-run1', tone: 'ok' }, { id: 'q3', edge: 'queue-run2', tone: 'ok' }],
      chips: [{ label: '1', value: 'send with SessionId' }, { label: '2-3', value: 'run takes one session' }, { label: '4', value: 'other runs in parallel' }],
    },
    build: {
      visible: [...core],
      highlight: ['run1', 'run2'],
      chips: [{ label: 'start from', value: 'Standard template' }, { label: 'per run', value: 'a whole session' }],
    },
    locks: {
      visible: [...core, 'renew', 'renew-run1'],
      highlight: ['renew', 'renew-run1'],
      tokens: [{ id: 'l1', edge: 'renew-run1', tone: 'info' }],
      chips: [{ label: 'Until loop', value: 'Renew lock + Delay' }, { label: 'min lock', value: '30 s' }],
    },
    poison: {
      visible: [...core, 'dlq', 'queue-dlq'],
      highlight: ['dlq'],
      tokens: [{ id: 'd1', edge: 'queue-dlq', tone: 'fail' }],
      chips: [{ label: 'bad message', value: 'blocks its session', tone: 'warn' }, { label: 'MaxDeliveryCount', value: 'default 10' }],
    },
    key: {
      visible: [...core],
      highlight: ['src'],
      chips: [{ label: 'key', value: 'unit of parallelism' }, { label: 'too coarse', value: 'little parallelism', tone: 'warn' }],
    },
    when: {
      visible: [...core],
      chips: [{ label: 'use', value: 'order matters, groups exist' }, { label: 'skip', value: 'order does not matter' }],
    },
    recap: {
      visible: [...core, 'renew', 'dlq', 'renew-run1', 'queue-dlq'],
      chips: [{ label: 'order', value: 'per session' }],
    },
  },
  legend: [{ tone: 'ok', label: 'in order' }, { tone: 'info', label: 'lock renewal' }, { tone: 'fail', label: 'poison' }],
};
