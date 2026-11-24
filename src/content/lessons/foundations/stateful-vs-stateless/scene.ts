import type { Scene } from '../../../../lessons/scene-types';

// One picture for the whole lesson: Take order (stateless) on top, Process order (stateful) below.
const take = ['takeBox', 'shop', 't1', 't2', 't3', 't4', 'shop-t1', 't1-t2', 't2-t3', 't3-t4'];
const proc = ['procBox', 'p1', 'p2', 'p3', 'p1-p2', 'p2-p3'];
const store = ['storage', 'p1-st', 'p2-st', 'p3-st'];
const call = ['t3-p1'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'takeBox', label: 'Take order · stateless', x: 232, y: 8, w: 216, h: 400 },
    { id: 'procBox', label: 'Process order · stateful', x: 488, y: 110, w: 224, h: 298 },
  ],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop website', sublabel: 'customer waits', x: 100, y: 70 },
    { id: 't1', kind: 'trigger', label: 'Request', sublabel: 'push trigger', x: 340, y: 70 },
    { id: 't2', kind: 'action', label: 'Check stock', sublabel: 'calls service', x: 340, y: 170 },
    { id: 't3', kind: 'action', label: 'Invoke workflow', sublabel: 'Process order', x: 340, y: 270 },
    { id: 't4', kind: 'action', label: 'Response', sublabel: 'Order received', x: 340, y: 370 },
    { id: 'api', kind: 'connector-managed', label: 'Stock service', sublabel: '202 Accepted', x: 100, y: 170 },
    { id: 'p1', kind: 'trigger', label: 'Request', sublabel: 'called', x: 600, y: 170 },
    { id: 'p2', kind: 'action', label: 'Reserve stock', x: 600, y: 270 },
    { id: 'p3', kind: 'action', label: 'Create invoice', x: 600, y: 370 },
    { id: 'storage', kind: 'storage', label: 'Azure Storage', sublabel: 'every step', x: 810, y: 270 },
    { id: 'you', kind: 'human', label: 'You', sublabel: 'see · resubmit', x: 810, y: 420 },
  ],
  edges: [
    { id: 'shop-t1', from: 'shop', to: 't1' },
    { id: 't1-t2', from: 't1', to: 't2' },
    { id: 't2-t3', from: 't2', to: 't3' },
    { id: 't3-t4', from: 't3', to: 't4' },
    { id: 't2-api', from: 't2', to: 'api' },
    { id: 't3-p1', from: 't3', to: 'p1' },
    { id: 'p1-p2', from: 'p1', to: 'p2' },
    { id: 'p2-p3', from: 'p2', to: 'p3' },
    { id: 'p1-st', from: 'p1', to: 'storage', style: 'dashed' },
    { id: 'p2-st', from: 'p2', to: 'storage', style: 'dashed' },
    { id: 'p3-st', from: 'p3', to: 'storage', style: 'dashed' },
    { id: 'you-st', from: 'you', to: 'storage', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...take, ...proc, ...call],
      highlight: ['takeBox', 'procBox'],
      tokens: [{ id: 'p0', edge: 'shop-t1', tone: 'info' }, { id: 'p1', edge: 't3-p1', tone: 'ok' }],
      chips: [{ label: 'Take order', value: 'must be fast' }, { label: 'Process order', value: 'must not be lost' }],
    },
    stateful: {
      visible: [...take, ...call, ...proc, ...store, 'you', 'you-st'],
      highlight: ['procBox', 'storage'],
      tokens: [{ id: 's1', edge: 'p1-st', tone: 'info' }, { id: 's2', edge: 'p2-st', tone: 'info' }, { id: 's3', edge: 'p3-st', tone: 'info' }],
      chips: [{ label: 'each step', value: 'saved to storage' }, { label: 'run history', value: 'yes', tone: 'ok' }, { label: 'max run', value: '90 days default' }],
    },
    stateless: {
      visible: [...take, ...call, ...proc],
      highlight: ['takeBox'],
      tokens: [{ id: 'l1', edge: 't1-t2', tone: 'info' }, { id: 'l2', edge: 't2-t3', tone: 'info' }, { id: 'l3', edge: 't3-t4', tone: 'info' }],
      chips: [{ label: 'state', value: 'in memory only' }, { label: 'speed', value: 'faster', tone: 'ok' }, { label: 'runs', value: 'synchronous only' }],
    },
    choose: {
      visible: [...take, ...proc, ...call],
      highlight: ['takeBox', 'procBox'],
      chips: [{ label: 'type', value: 'chosen at creation', tone: 'warn' }, { label: 'one logic app', value: 'both workflows' }],
    },
    limits: {
      visible: [...take, ...call, ...proc],
      highlight: ['takeBox'],
      chips: [{ label: 'run', value: 'under 5 min' }, { label: 'content', value: 'under 64 KB', tone: 'warn' }, { label: 'For each', value: '100 items' }],
    },
    triggers: {
      visible: [...take, ...proc, ...call],
      highlight: ['t1', 'p1'],
      chips: [{ label: 'stateless', value: 'push triggers' }, { label: 'Recurrence', value: 'unavailable', tone: 'warn' }, { label: 'managed triggers', value: 'not offered', tone: 'warn' }],
    },
    async: {
      visible: [...take, ...call, ...proc, 'api', 't2-api'],
      highlight: ['t2', 'api', 't2-api'],
      tokens: [{ id: 'a1', edge: 't2-api', tone: 'info' }],
      chips: [{ label: 'service answers', value: '202 Accepted' }, { label: 'polls location', value: 'no', tone: 'warn' }, { label: 'chunking', value: 'no', tone: 'warn' }],
    },
    history: {
      visible: [...take, ...proc, ...call, ...store, 'you', 'you-st'],
      failed: ['t2'],
      highlight: ['you', 'you-st', 'storage'],
      chips: [{ label: 'Take order fails', value: 'nothing saved', tone: 'fail' }, { label: 'Process order', value: 'resubmit from history', tone: 'ok' }, { label: 'debug', value: 'Debug state (not prod)' }],
    },
    mix: {
      visible: [...take, ...proc, ...call, ...store],
      highlight: ['t3', 'p1', 't3-p1', 't4'],
      tokens: [{ id: 'm1', edge: 't3-p1', tone: 'ok' }, { id: 'm2', edge: 't3-t4', tone: 'info' }],
      chips: [{ label: '1 invoke', value: 'Process order' }, { label: '2 reply', value: '202 Accepted' }, { label: '3 no wait', value: 'Response sent right away', tone: 'ok' }],
    },
    recap: {
      visible: [...take, ...proc, ...call, ...store, 'you', 'you-st'],
      chips: [{ label: 'stateless', value: 'fast, in memory' }, { label: 'stateful', value: 'safe, saved' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data moving' },
    { tone: 'ok', label: 'hand-off to Process order' },
    { tone: 'failed', label: 'failed, nothing saved' },
  ],
};
