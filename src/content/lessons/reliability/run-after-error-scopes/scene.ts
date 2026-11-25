import type { Scene } from '../../../../lessons/scene-types';

// Scopes are drawn as frames so you can see they group actions. Run after is set on the scope;
// the arrows leave from Try's last action and are labelled with Try's outcome.
const flow = ['trigger', 'stock', 'charge', 'confirm', 'trig-stock', 'stock-charge', 'charge-confirm'];
const tryScope = ['tryBox'];
const catchScope = ['catchBox', 'filter', 'term', 'charge-filter', 'filter-term'];
const clean = ['cleanup', 'charge-cleanup'];

export const scene: Scene = {
  viewBox: [900, 520],
  groups: [
    { id: 'tryBox', label: 'Try (scope)', x: 196, y: 50, w: 400, h: 125 },
    { id: 'catchBox', label: 'Catch (scope) · run after: failed, timed out', x: 196, y: 235, w: 664, h: 125, labelAlign: 'end' },
  ],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 100, y: 115 },
    { id: 'stock', kind: 'connector-builtin', label: 'Reserve stock', x: 300, y: 115 },
    { id: 'charge', kind: 'connector-builtin', label: 'Charge card', x: 495, y: 115 },
    { id: 'confirm', kind: 'action', label: 'Confirm order', x: 745, y: 115 },
    { id: 'filter', kind: 'action', label: 'Filter result', sublabel: "result('Try')", x: 420, y: 300 },
    { id: 'term', kind: 'condition', label: 'Terminate', sublabel: 'Failed', x: 690, y: 300 },
    { id: 'cleanup', kind: 'scope', label: 'Cleanup', sublabel: 'all 4 statuses', x: 100, y: 450 },
  ],
  edges: [
    { id: 'trig-stock', from: 'trigger', to: 'stock' },
    { id: 'stock-charge', from: 'stock', to: 'charge' },
    { id: 'charge-confirm', from: 'charge', to: 'confirm', label: 'ok' },
    { id: 'charge-filter', from: 'charge', to: 'filter', style: 'dashed', label: 'Try failed' },
    { id: 'filter-term', from: 'filter', to: 'term' },
    { id: 'charge-cleanup', from: 'charge', to: 'cleanup', style: 'dashed', label: 'always' },
  ],
  steps: {
    problem: {
      visible: [...flow],
      failed: ['charge'],
      skipped: ['confirm'],
      chips: [{ label: 'Charge card', value: 'Failed', tone: 'fail' }, { label: 'Confirm order', value: 'Skipped', tone: 'warn' }, { label: 'run', value: 'Failed', tone: 'fail' }],
    },
    statuses: {
      visible: [...flow],
      highlight: ['charge-confirm'],
      chips: [{ label: 'run after reacts to', value: 'Succeeded · Failed · Skipped · TimedOut' }, { label: 'default', value: 'Is successful' }],
    },
    json: {
      visible: [...flow],
      highlight: ['confirm'],
      chips: [{ label: 'runAfter', value: 'per predecessor' }],
    },
    scope: {
      visible: [...flow, ...tryScope],
      highlight: ['tryBox'],
      failed: ['charge'],
      chips: [{ label: 'all succeed', value: 'Try Succeeded', tone: 'ok' }, { label: 'any fails', value: 'Try Failed', tone: 'fail' }],
    },
    trycatch: {
      visible: [...flow, ...tryScope, ...catchScope],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['catchBox', 'charge-filter'],
      tokens: [{ id: 't1', edge: 'charge-filter', tone: 'fail' }],
      chips: [{ label: 'Catch runs after Try', value: 'Has failed · Has timed out' }],
    },
    result: {
      visible: [...flow, ...tryScope, ...catchScope],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['filter'],
      tokens: [{ id: 'r1', edge: 'filter-term', tone: 'info' }],
      chips: [{ label: "result('Try')", value: 'top-level actions only' }, { label: 'per item', value: 'name · status · outputs' }],
    },
    finally: {
      visible: [...flow, ...tryScope, ...clean],
      highlight: ['cleanup', 'charge-cleanup'],
      tokens: [{ id: 'f1', edge: 'charge-cleanup', tone: 'ok' }],
      chips: [{ label: 'run after', value: 'all four statuses' }, { label: 'runs', value: 'every time', tone: 'ok' }],
    },
    handled: {
      visible: [...flow, ...tryScope, ...catchScope],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['term'],
      tokens: [{ id: 'h1', edge: 'filter-term', tone: 'info' }],
      chips: [{ label: 'failure handled', value: 'run Succeeded', tone: 'warn' }, { label: 'end with Terminate', value: 'run Failed', tone: 'fail' }],
    },
    monitor: {
      visible: [...flow, ...tryScope, ...catchScope, ...clean],
      chips: [{ label: 'alert, e.g.', value: '> 5 failed runs / hour' }, { label: 'correlate', value: 'x-ms-client-tracking-id' }],
    },
    recap: {
      visible: [...flow, ...tryScope, ...catchScope, ...clean],
      chips: [{ label: 'catch', value: 'scope + run after' }, { label: 'report', value: 'Terminate Failed' }],
    },
  },
  legend: [
    { tone: 'info', label: 'handling' },
    { tone: 'ok', label: 'always runs' },
    { tone: 'fail', label: 'failure' },
  ],
};
