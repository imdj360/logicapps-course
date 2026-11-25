import type { Scene } from '../../../../lessons/scene-types';

// Problem: one run loops over 500 orders. Split on: each order gets its own run.
const oneRun = ['oneRun', 'partner', 'req0', 'each0', 'create0', 'partner-req0', 'req0-each0', 'each0-create0'];
const split = [
  'partner', 'trig', 'partner-trig',
  'run1', 'run2', 'run3',
  'v1', 'c1', 'v2', 'c2', 'v3', 'c3',
  'trig-v1', 'trig-v2', 'trig-v3', 'v1-c1', 'v2-c2', 'v3-c3',
];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'oneRun', label: 'One run', x: 216, y: 175, w: 650, h: 140 },
    { id: 'run1', label: 'Run: order 1', x: 452, y: 40, w: 432, h: 120 },
    { id: 'run2', label: 'Run: order 2', x: 452, y: 190, w: 432, h: 120 },
    { id: 'run3', label: 'Run: order 500', x: 452, y: 340, w: 432, h: 120, labelAlign: 'end' },
  ],
  nodes: [
    { id: 'partner', kind: 'user', label: 'Partner', sublabel: '500 orders', x: 100, y: 250 },
    { id: 'req0', kind: 'trigger', label: 'Request', sublabel: 'array of 500', x: 310, y: 250 },
    { id: 'each0', kind: 'scope', label: 'For each order', sublabel: '500 times', x: 520, y: 250 },
    { id: 'create0', kind: 'action', label: 'Create order', sublabel: 'in the loop', x: 745, y: 250 },
    { id: 'trig', kind: 'trigger', label: 'Request', sublabel: 'Split on', x: 310, y: 250 },
    { id: 'v1', kind: 'action', label: 'Validate', sublabel: 'order 1', x: 560, y: 105 },
    { id: 'c1', kind: 'action', label: 'Create order', x: 770, y: 105 },
    { id: 'v2', kind: 'action', label: 'Validate', sublabel: 'order 2', x: 560, y: 255 },
    { id: 'c2', kind: 'action', label: 'Create order', x: 770, y: 255 },
    { id: 'v3', kind: 'action', label: 'Validate', sublabel: 'order 500', x: 560, y: 405 },
    { id: 'c3', kind: 'action', label: 'Create order', x: 770, y: 405 },
  ],
  edges: [
    { id: 'partner-req0', from: 'partner', to: 'req0' },
    { id: 'req0-each0', from: 'req0', to: 'each0' },
    { id: 'each0-create0', from: 'each0', to: 'create0' },
    { id: 'partner-trig', from: 'partner', to: 'trig' },
    { id: 'trig-v1', from: 'trig', to: 'v1' },
    { id: 'trig-v2', from: 'trig', to: 'v2' },
    { id: 'trig-v3', from: 'trig', to: 'v3' },
    { id: 'v1-c1', from: 'v1', to: 'c1' },
    { id: 'v2-c2', from: 'v2', to: 'c2' },
    { id: 'v3-c3', from: 'v3', to: 'c3' },
  ],
  steps: {
    problem: {
      visible: [...oneRun],
      highlight: ['oneRun', 'each0'],
      tokens: [{ id: 'p1', edge: 'partner-req0', tone: 'info' }, { id: 'p1b', edge: 'req0-each0', tone: 'info' }, { id: 'p2', edge: 'each0-create0', tone: 'info' }],
      chips: [{ label: 'For each', value: '500 orders, one run' }, { label: 'our concern', value: 'one failure, whole run', tone: 'warn' }],
    },
    spliton: {
      visible: [...split],
      highlight: ['trig', 'run1', 'run2', 'run3'],
      tokens: [{ id: 's1', edge: 'trig-v1', tone: 'ok' }, { id: 's2', edge: 'trig-v2', tone: 'ok' }, { id: 's3', edge: 'trig-v3', tone: 'ok' }],
      chips: [{ label: 'trigger setting', value: 'Split on' }, { label: 'result', value: 'one run per order', tone: 'ok' }],
    },
    which: {
      visible: [...split],
      highlight: ['trig'],
      chips: [{ label: 'supported', value: 'Request · HTTP · Service Bus · Outlook' }, { label: 'needs', value: 'array in, array out' }],
    },
    scope: {
      visible: [...split],
      highlight: ['run2'],
      chips: [{ label: 'each run sees', value: 'its own order' }, { label: 'outside the array', value: 'use ?', tone: 'warn' }],
    },
    response: {
      visible: [...split],
      highlight: ['partner', 'partner-trig'],
      tokens: [{ id: 'r1t', edge: 'partner-trig', tone: 'info' }],
      chips: [{ label: 'with a Response action', value: '202 Accepted at once', tone: 'warn' }],
    },
    limits: {
      visible: [...split],
      chips: [{ label: 'max items', value: '100,000' }, { label: 'with trigger concurrency', value: '100', tone: 'warn' }],
    },
    vs: {
      visible: [...split],
      chips: [{ label: 'split', value: 'items stand alone' }, { label: 'loop', value: 'items belong together' }],
    },
    recap: {
      visible: [...split],
      chips: [{ label: 'Split on', value: 'one run per item' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request' },
    { tone: 'ok', label: 'separate run' },
  ],
};
