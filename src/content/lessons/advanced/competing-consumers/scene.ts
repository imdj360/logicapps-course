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
      chips: [{ label: 'queue', value: '50,000 invoices' }, { label: 'one worker', value: 'done by noon', tone: 'warn' }],
    },
    pattern: {
      visible: [...core],
      tokens: [{ id: 'p1', edge: 'queue-c1', tone: 'info' }, { id: 'p2', edge: 'queue-c2', tone: 'info' }, { id: 'p3', edge: 'queue-c3', tone: 'info' }],
      chips: [{ label: 'many tills', value: 'one line' }, { label: 'each message', value: 'one worker' }],
    },
    sequence: {
      visible: [...core],
      tokens: [{ id: 's1', edge: 'queue-c1', tone: 'info' }, { id: 's2', edge: 'queue-c2', tone: 'ok' }],
      chips: [{ label: '1-2', value: 'take it, hidden from others' }, { label: '3', value: 'done: removed', tone: 'ok' }, { label: '4', value: 'failed: back in queue', tone: 'warn' }],
    },
    build: {
      visible: [...core],
      highlight: ['c1', 'c2', 'c3'],
      chips: [{ label: 'trigger', value: 'queue (peek-lock)' }, { label: 'success', value: 'Complete the message' }, { label: 'failure', value: 'Abandon the message' }],
    },
    scale: {
      visible: [...core],
      highlight: ['c1', 'c2', 'c3'],
      chips: [{ label: 'concurrency', value: 'off = unlimited · on = 1 to 100' }, { label: 'once on', value: 'cannot be turned off', tone: 'warn' }],
    },
    order: {
      visible: [...core],
      chips: [{ label: 'order', value: 'not guaranteed', tone: 'warn' }, { label: 'delivery', value: 'at least once' }, { label: 'fix', value: 'idempotent steps' }],
    },
    poison: {
      visible: [...core, 'dlq', 'c3-dlq'],
      highlight: ['dlq'],
      tokens: [{ id: 'd1', edge: 'c3-dlq', tone: 'fail' }],
      chips: [{ label: 'too many tries', value: 'MaxDeliveryCount' }, { label: 'then', value: 'dead-letter queue', tone: 'fail' }],
    },
    priority: {
      visible: [...core, 'high', 'high-c1'],
      highlight: ['high', 'high-c1'],
      tokens: [{ id: 'h1', edge: 'high-c1', tone: 'ok' }],
      chips: [{ label: 'route by', value: 'Priority property + SQL filter' }, { label: 'urgent lane', value: 'more workers' }],
    },
    starvation: {
      visible: [...core, 'high', 'high-c1'],
      chips: [{ label: 'risk', value: 'normal work may never run', tone: 'warn' }, { label: 'fix', value: 'age boost or own pools' }],
    },
    when: {
      visible: [...core],
      chips: [{ label: 'use', value: 'independent, async work' }, { label: 'skip', value: 'strict order' }],
    },
    recap: {
      visible: [...core, 'dlq', 'high', 'c3-dlq', 'high-c1'],
      chips: [{ label: 'scale', value: 'add workers' }],
    },
  },
  legend: [{ tone: 'info', label: 'work' }, { tone: 'ok', label: 'urgent' }, { tone: 'fail', label: 'poison' }],
};
