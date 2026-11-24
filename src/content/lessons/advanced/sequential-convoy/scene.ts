import type { Scene } from '../../../../lessons/scene-types';

const core = ['src', 'queue', 'run1', 'run2', 'src-queue', 'queue-run1', 'queue-run2'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'src', kind: 'user', label: 'Order system', sublabel: 'SessionId=order', x: 120, y: 240 },
    { id: 'queue', kind: 'servicebus', label: 'Session queue', sublabel: 'FIFO in session', x: 420, y: 240 },
    { id: 'run1', kind: 'scope', label: 'Run: order 4711', sublabel: 'one session', x: 740, y: 130 },
    { id: 'run2', kind: 'scope', label: 'Run: order 4712', sublabel: 'in parallel', x: 740, y: 350 },
    { id: 'renew', kind: 'condition', label: 'Renew lock', sublabel: 'Until loop', x: 420, y: 80 },
    { id: 'dlq', kind: 'servicebus', label: 'Dead-letter', sublabel: 'after 10 tries', x: 420, y: 410 },
  ],
  edges: [
    { id: 'src-queue', from: 'src', to: 'queue' },
    { id: 'queue-run1', from: 'queue', to: 'run1' },
    { id: 'queue-run2', from: 'queue', to: 'run2' },
    { id: 'renew-run1', from: 'renew', to: 'run1', style: 'dashed' },
    { id: 'queue-dlq', from: 'queue', to: 'dlq', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core],
      failed: ['run1'],
      chips: [{ label: 'arrived', value: 'created → changed → cancelled' }, { label: 'processed', value: 'out of order', tone: 'fail' }],
    },
    pattern: {
      visible: [...core],
      tokens: [{ id: 'p1', edge: 'queue-run1', tone: 'ok' }, { id: 'p2', edge: 'queue-run2', tone: 'ok' }],
      chips: [{ label: 'within a group', value: 'in order' }, { label: 'across groups', value: 'parallel' }],
    },
    sessions: {
      visible: [...core],
      highlight: ['queue'],
      chips: [{ label: 'one session', value: 'one receiver' }, { label: 'tier', value: 'Standard · Premium' }],
    },
    logicapps: {
      visible: [...core],
      highlight: ['run1', 'run2'],
      chips: [{ label: 'Standard', value: 'sequential convoy template' }, { label: 'per run', value: 'a whole session' }],
    },
    locks: {
      visible: [...core, 'renew', 'renew-run1'],
      highlight: ['renew', 'renew-run1'],
      tokens: [{ id: 'l1', edge: 'renew-run1', tone: 'info' }],
      chips: [{ label: 'min lock', value: '30 s' }, { label: 'failure', value: 'Abandon, retry' }],
    },
    poison: {
      visible: [...core, 'dlq', 'queue-dlq'],
      highlight: ['dlq'],
      tokens: [{ id: 'd1', edge: 'queue-dlq', tone: 'fail' }],
      chips: [{ label: 'bad message', value: 'blocks its session', tone: 'warn' }, { label: 'after', value: '10 deliveries' }],
    },
    key: {
      visible: [...core],
      highlight: ['src'],
      chips: [{ label: 'key', value: 'unit of parallelism' }, { label: 'too coarse', value: 'little parallelism', tone: 'warn' }],
    },
    recap: {
      visible: [...core, 'renew', 'dlq', 'renew-run1', 'queue-dlq'],
      chips: [{ label: 'order', value: 'per session' }],
    },
  },
  legend: [{ tone: 'ok', label: 'in order' }, { tone: 'info', label: 'lock renewal' }, { tone: 'fail', label: 'poison' }],
};
