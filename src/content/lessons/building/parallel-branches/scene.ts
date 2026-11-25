import type { Scene } from '../../../../lessons/scene-types';

const split = ['trigger', 'email', 'stock', 'wh', 'trig-email', 'trig-stock', 'trig-wh'];
const join = ['ready', 'email-ready', 'stock-ready', 'wh-ready'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order accepted', x: 110, y: 240 },
    { id: 'email', kind: 'connector-managed', label: 'Send email', sublabel: 'to customer', x: 420, y: 90 },
    { id: 'stock', kind: 'connector-builtin', label: 'Reserve stock', x: 420, y: 240 },
    { id: 'wh', kind: 'servicebus', label: 'Notify warehouse', x: 420, y: 390 },
    { id: 'ready', kind: 'action', label: 'Mark ready', sublabel: 'join', x: 740, y: 240 },
  ],
  edges: [
    { id: 'trig-email', from: 'trigger', to: 'email' },
    { id: 'trig-stock', from: 'trigger', to: 'stock' },
    { id: 'trig-wh', from: 'trigger', to: 'wh' },
    { id: 'email-ready', from: 'email', to: 'ready' },
    { id: 'stock-ready', from: 'stock', to: 'ready' },
    { id: 'wh-ready', from: 'wh', to: 'ready' },
  ],
  steps: {
    problem: {
      visible: [...split],
      tokens: [{ id: 'p1', edge: 'trig-email', tone: 'info' }],
      chips: [{ label: 'steps', value: '3, independent' }, { label: 'in a line', value: 'slowest holds up all', tone: 'warn' }],
    },
    add: {
      visible: [...split],
      highlight: ['trig-email', 'trig-stock', 'trig-wh'],
      tokens: [
        { id: 'a1', edge: 'trig-email', tone: 'info' },
        { id: 'a2', edge: 'trig-stock', tone: 'info' },
        { id: 'a3', edge: 'trig-wh', tone: 'info' },
      ],
      chips: [{ label: 'branches', value: '3' }, { label: 'run after', value: 'same parent' }],
    },
    code: {
      visible: [...split],
      highlight: ['email', 'stock'],
      chips: [{ label: 'branch object', value: 'none' }, { label: 'what makes it parallel', value: 'shared runAfter' }],
    },
    join: {
      visible: [...split, ...join],
      highlight: ['ready', 'email-ready', 'stock-ready', 'wh-ready'],
      tokens: [
        { id: 'j1', edge: 'email-ready', tone: 'ok' },
        { id: 'j2', edge: 'stock-ready', tone: 'ok' },
        { id: 'j3', edge: 'wh-ready', tone: 'ok' },
      ],
      chips: [{ label: 'join waits for', value: 'all branches' }, { label: 'run after', value: 'last action per branch' }],
    },
    fail: {
      visible: [...split, ...join],
      failed: ['stock'],
      skipped: ['ready'],
      tokens: [{ id: 'f1', edge: 'trig-stock', tone: 'fail' }, { id: 'f2', edge: 'email-ready', tone: 'ok' }, { id: 'f3', edge: 'wh-ready', tone: 'ok' }],
      chips: [{ label: 'Reserve stock', value: 'Failed', tone: 'fail' }, { label: 'Mark ready', value: 'Skipped', tone: 'warn' }, { label: 'run', value: 'Failed', tone: 'fail' }],
    },
    handle: {
      visible: [...split, ...join],
      failed: ['stock'],
      highlight: ['ready', 'stock-ready'],
      tokens: [{ id: 'h1', edge: 'stock-ready', tone: 'info' }],
      chips: [{ label: 'join run after', value: '+ Has failed', tone: 'ok' }, { label: 'check', value: "actions('Reserve_stock')?['status']" }],
    },
    vs: {
      visible: [...split, ...join],
      chips: [{ label: 'branches', value: 'different work' }, { label: 'For each', value: 'same work per item' }],
    },
    limits: {
      visible: [...split, ...join],
      chips: [{ label: 'branch limit', value: 'none listed' }, { label: 'actions', value: '≤ 500' }, { label: 'nesting depth', value: '≤ 8' }],
    },
    recap: {
      visible: [...split, ...join],
      chips: [{ label: 'split', value: 'shared runAfter' }, { label: 'join', value: 'waits for all' }],
    },
  },
  legend: [
    { tone: 'info', label: 'running' },
    { tone: 'ok', label: 'completed' },
    { tone: 'fail', label: 'failed branch' },
  ],
};
