import type { Scene } from '../../../../lessons/scene-types';

const core = ['trigger', 'try', 'trig-try'];
const handling = ['catch', 'filter', 'term', 'try-catch', 'catch-filter', 'filter-term'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 110, y: 240 },
    { id: 'try', kind: 'scope', label: 'Try', sublabel: 'the work', x: 340, y: 240 },
    { id: 'next', kind: 'action', label: 'Confirm order', x: 590, y: 90 },
    { id: 'catch', kind: 'scope', label: 'Catch', sublabel: 'on failure', x: 590, y: 240 },
    { id: 'filter', kind: 'action', label: 'Filter result', sublabel: "result('Try')", x: 810, y: 240 },
    { id: 'term', kind: 'condition', label: 'Terminate', sublabel: 'Failed', x: 810, y: 410 },
    { id: 'cleanup', kind: 'scope', label: 'Cleanup', sublabel: 'all 4 statuses', x: 340, y: 410 },
  ],
  edges: [
    { id: 'trig-try', from: 'trigger', to: 'try' },
    { id: 'try-next', from: 'try', to: 'next' },
    { id: 'try-catch', from: 'try', to: 'catch', style: 'dashed' },
    { id: 'catch-filter', from: 'catch', to: 'filter' },
    { id: 'filter-term', from: 'filter', to: 'term' },
    { id: 'try-cleanup', from: 'try', to: 'cleanup', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core, 'next', 'try-next'],
      failed: ['try'],
      chips: [{ label: 'failed action', value: 'Failed', tone: 'fail' }, { label: 'after it', value: 'Skipped', tone: 'warn' }, { label: 'run', value: 'Failed', tone: 'fail' }],
    },
    statuses: {
      visible: [...core, 'next', 'try-next'],
      highlight: ['try-next'],
      chips: [{ label: 'run after reacts to', value: 'Succeeded · Failed · Skipped · TimedOut' }, { label: 'default', value: 'Is successful' }],
    },
    json: {
      visible: [...core, 'next', 'try-next'],
      highlight: ['next'],
      chips: [{ label: 'runAfter', value: 'per predecessor' }],
    },
    scope: {
      visible: [...core, 'next', 'try-next'],
      highlight: ['try'],
      failed: ['try'],
      chips: [{ label: 'all succeed', value: 'Succeeded', tone: 'ok' }, { label: 'any fails', value: 'Failed', tone: 'fail' }],
    },
    trycatch: {
      visible: [...core, 'next', 'catch', 'try-next', 'try-catch'],
      failed: ['try'],
      highlight: ['catch', 'try-catch'],
      tokens: [{ id: 't1', edge: 'try-catch', tone: 'fail' }],
      chips: [{ label: 'Catch runs after', value: 'Has failed · Has timed out' }],
    },
    result: {
      visible: [...core, 'catch', 'filter', 'try-catch', 'catch-filter'],
      failed: ['try'],
      highlight: ['filter', 'catch-filter'],
      tokens: [{ id: 'r1', edge: 'catch-filter', tone: 'info' }],
      chips: [{ label: 'result()', value: 'top-level actions only' }, { label: 'per item', value: 'name · status · outputs' }],
    },
    finally: {
      visible: [...core, 'cleanup', 'try-cleanup'],
      highlight: ['cleanup', 'try-cleanup'],
      tokens: [{ id: 'f1', edge: 'try-cleanup', tone: 'ok' }],
      chips: [{ label: 'run after', value: 'all four statuses' }, { label: 'runs', value: 'every time', tone: 'ok' }],
    },
    handled: {
      visible: [...core, ...handling],
      failed: ['try'],
      highlight: ['term', 'filter-term'],
      tokens: [{ id: 'h1', edge: 'filter-term', tone: 'info' }],
      chips: [{ label: 'handled failure', value: 'run Succeeded', tone: 'warn' }, { label: 'with Terminate', value: 'run Failed', tone: 'fail' }],
    },
    monitor: {
      visible: [...core, ...handling],
      chips: [{ label: 'alert, e.g.', value: '> 5 failed runs / hour' }, { label: 'correlate', value: 'x-ms-client-tracking-id' }],
    },
    recap: {
      visible: [...core, ...handling, 'next', 'cleanup', 'try-next', 'try-cleanup'],
      chips: [{ label: 'catch', value: 'scope + run after' }, { label: 'report', value: 'Terminate Failed' }],
    },
  },
  legend: [
    { tone: 'info', label: 'handling' },
    { tone: 'ok', label: 'always runs' },
    { tone: 'fail', label: 'failure' },
  ],
};
