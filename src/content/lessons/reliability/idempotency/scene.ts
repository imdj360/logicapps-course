import type { Scene } from '../../../../lessons/scene-types';

const core = ['shop', 'queue', 'wf', 'db', 'shop-queue', 'queue-wf', 'wf-db'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop', sublabel: 'order 4711', x: 110, y: 240 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', sublabel: 'dedupe on', x: 340, y: 240 },
    { id: 'wf', kind: 'action', label: 'Process order', sublabel: 'workflow', x: 580, y: 240 },
    { id: 'db', kind: 'storage', label: 'Orders DB', sublabel: 'upsert by key', x: 810, y: 240 },
    { id: 'retry', kind: 'condition', label: 'Retry', sublabel: 'after timeout', x: 580, y: 90 },
    { id: 'resubmit', kind: 'human', label: 'Resubmit', sublabel: 'same inputs', x: 580, y: 410 },
  ],
  edges: [
    { id: 'shop-queue', from: 'shop', to: 'queue' },
    { id: 'queue-wf', from: 'queue', to: 'wf' },
    { id: 'wf-db', from: 'wf', to: 'db' },
    { id: 'retry-db', from: 'retry', to: 'db', style: 'dashed' },
    { id: 'resubmit-wf', from: 'resubmit', to: 'wf', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core],
      highlight: ['db'],
      tokens: [{ id: 'p1', edge: 'wf-db', tone: 'fail' }, { id: 'p2', edge: 'wf-db', tone: 'fail' }],
      chips: [{ label: 'order 4711', value: 'shipped twice', tone: 'fail' }],
    },
    atleastonce: {
      visible: [...core],
      highlight: ['queue-wf'],
      chips: [{ label: 'delivery', value: 'at least once' }, { label: 'duplicates', value: 'rare', tone: 'warn' }],
    },
    sources: {
      visible: [...core, 'retry', 'resubmit', 'retry-db', 'resubmit-wf'],
      highlight: ['retry', 'resubmit'],
      tokens: [{ id: 's1', edge: 'retry-db', tone: 'fail' }, { id: 's2', edge: 'resubmit-wf', tone: 'fail' }],
      chips: [{ label: 'sources', value: 'delivery · resubmit · retry · concurrency' }],
    },
    key: {
      visible: [...core],
      highlight: ['shop'],
      chips: [{ label: 'key', value: 'order number', tone: 'ok' }, { label: 'better than', value: 'a fresh GUID', tone: 'warn' }],
    },
    sbdedupe: {
      visible: [...core],
      highlight: ['queue'],
      tokens: [{ id: 'd1', edge: 'shop-queue', tone: 'info' }, { id: 'd2', edge: 'shop-queue', tone: 'fail' }],
      chips: [{ label: 'window', value: '10 min default' }, { label: 'same MessageId', value: 'dropped', tone: 'ok' }, { label: 'tiers', value: 'Standard · Premium' }],
    },
    writes: {
      visible: [...core],
      highlight: ['db', 'wf-db'],
      tokens: [{ id: 'w1', edge: 'wf-db', tone: 'ok' }],
      chips: [{ label: 'write', value: 'upsert by key', tone: 'ok' }, { label: 'side effects', value: 'check "done" first' }],
    },
    tracking: {
      visible: [...core],
      highlight: ['wf'],
      chips: [{ label: 'tracking ID', value: 'correlates' }, { label: 'Microsoft Learn docs say', value: 'correlation only', tone: 'warn' }],
    },
    unsafe: {
      visible: [...core, 'retry', 'retry-db'],
      highlight: ['retry'],
      chips: [{ label: 'unsafe call', value: 'retry None' }],
    },
    recap: {
      visible: [...core, 'retry', 'resubmit', 'retry-db', 'resubmit-wf'],
      chips: [{ label: 'twice', value: 'changes nothing' }],
    },
  },
  legend: [
    { tone: 'info', label: 'first delivery' },
    { tone: 'ok', label: 'safe repeat' },
    { tone: 'fail', label: 'harmful repeat' },
  ],
};
