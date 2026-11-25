import type { Scene } from '../../../../lessons/scene-types';

// Scopes are drawn as frames so you can see they group actions. Run after is set on the scope;
// the arrows leave from Try's last action and are labelled with Try's outcome.
const flow = ['trigger', 'stock', 'charge', 'confirm', 'trig-stock', 'stock-charge', 'charge-confirm'];
// All the work, Confirm order included, sits inside the Try box.
const tryScope = ['tryBox'];
const catchScope = ['catchBox', 'filter', 'term', 'try-catch', 'filter-term'];
const clean = ['cleanup', 'try-cleanup'];

export const scene: Scene = {
  viewBox: [900, 520],
  groups: [
    { id: 'tryBox', label: 'Try (scope)', x: 196, y: 50, w: 664, h: 125 },
    { id: 'catchBox', label: 'Catch (scope) · run after: failed, timed out', x: 196, y: 235, w: 664, h: 125, labelAlign: 'end' },
  ],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 100, y: 115 },
    { id: 'stock', kind: 'connector-builtin', label: 'Reserve stock', x: 300, y: 115 },
    { id: 'charge', kind: 'connector-builtin', label: 'Charge card', x: 495, y: 115 },
    { id: 'confirm', kind: 'action', label: 'Confirm order', x: 745, y: 115 },
    { id: 'filter', kind: 'action', label: 'Filter result', sublabel: "result('Try')", x: 420, y: 300 },
    { id: 'term', kind: 'condition', label: 'Terminate', sublabel: 'Failed', x: 690, y: 300 },
    { id: 'notify', kind: 'action', label: 'Notify team', sublabel: 'if card fails', x: 495, y: 300 },
    { id: 'cleanup', kind: 'connector-builtin', label: 'Log outcome', sublabel: 'HTTP to a log', x: 100, y: 300 },
  ],
  edges: [
    { id: 'trig-stock', from: 'trigger', to: 'stock' },
    { id: 'stock-charge', from: 'stock', to: 'charge' },
    { id: 'charge-confirm', from: 'charge', to: 'confirm' },
    { id: 'try-catch', from: 'tryBox', to: 'catchBox', style: 'dashed', label: 'Try failed' },
    { id: 'filter-term', from: 'filter', to: 'term' },
    { id: 'charge-notify', from: 'charge', to: 'notify', style: 'dashed', label: 'failed' },
    { id: 'try-cleanup', from: 'tryBox', to: 'cleanup', style: 'dashed', label: 'always' },
  ],
  steps: {
    problem: {
      visible: [...flow],
      failed: ['charge'],
      skipped: ['confirm'],
      chips: [{ label: 'Charge card', value: 'Failed', tone: 'fail' }, { label: 'Confirm order', value: 'Skipped', tone: 'warn' }, { label: 'run', value: 'Failed, nobody told', tone: 'fail' }],
    },
    idea: {
      visible: [...flow],
      highlight: ['charge-confirm', 'confirm'],
      tokens: [{ id: 'i1', edge: 'charge-confirm', tone: 'ok' }],
      chips: [{ label: 'Confirm order runs after', value: 'Charge card is successful' }],
    },
    single: {
      visible: [...flow, 'notify', 'charge-notify'],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['notify', 'charge-notify'],
      tokens: [{ id: 's1', edge: 'charge-notify', tone: 'fail' }],
      chips: [{ label: 'Notify team runs after', value: 'Charge card has failed' }],
    },
    scope: {
      visible: [...flow, ...tryScope, ...catchScope],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['tryBox', 'catchBox', 'try-catch'],
      tokens: [{ id: 't1', edge: 'try-catch', tone: 'fail' }],
      chips: [{ label: 'Try box', value: 'Failed (one action failed)', tone: 'fail' }, { label: 'Catch runs after Try', value: 'has failed · timed out' }],
    },
    result: {
      visible: [...flow, ...tryScope, ...catchScope],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['filter'],
      chips: [{ label: "result('Try')", value: 'each action: name · status' }, { label: 'keep', value: 'status = Failed' }],
    },
    finally: {
      visible: [...flow, ...tryScope, ...clean],
      highlight: ['cleanup', 'try-cleanup'],
      tokens: [{ id: 'f1', edge: 'try-cleanup', tone: 'ok' }],
      chips: [{ label: 'Log outcome runs after Try', value: 'all four outcomes' }, { label: 'so it runs', value: 'every time', tone: 'ok' }],
    },
    handled: {
      visible: [...flow, ...tryScope, ...catchScope],
      failed: ['charge'],
      skipped: ['confirm'],
      highlight: ['term'],
      tokens: [{ id: 'h1', edge: 'filter-term', tone: 'info' }],
      chips: [{ label: 'without Terminate', value: 'run Succeeded', tone: 'warn' }, { label: 'with Terminate', value: 'run Failed', tone: 'fail' }],
    },
    recap: {
      visible: [...flow, ...tryScope, ...catchScope, ...clean],
      chips: [{ label: 'react', value: 'run after' }, { label: 'many actions', value: 'Try + Catch scopes' }],
    },
  },
  legend: [
    { tone: 'info', label: 'handling' },
    { tone: 'ok', label: 'always runs' },
    { tone: 'fail', label: 'failure' },
  ],
};
