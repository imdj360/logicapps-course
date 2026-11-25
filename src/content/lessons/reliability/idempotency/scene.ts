import type { Scene } from '../../../../lessons/scene-types';

// The Process order workflow, with the check-before-create pattern drawn inside it.
const intake = ['shop', 'queue', 'wfBox', 'trig', 'shop-queue', 'queue-trig'];
const naive = ['create', 'ship', 'trig-create', 'create-ship'];
const checked = ['get', 'cond', 'skip', 'create', 'ship', 'trig-get', 'get-cond', 'cond-skip', 'cond-create', 'create-ship'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'wfBox', label: 'Process order', x: 380, y: 50, w: 500, h: 400 },
  ],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop', sublabel: 'order 4711', x: 100, y: 120 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', sublabel: 'Service Bus', x: 280, y: 250 },
    { id: 'trig', kind: 'trigger', label: 'Queue trigger', x: 480, y: 120 },
    { id: 'get', kind: 'action', label: 'Get order', sublabel: 'by order no.', x: 760, y: 120 },
    { id: 'cond', kind: 'condition', label: 'Exists already?', sublabel: 'Condition', x: 760, y: 250 },
    { id: 'skip', kind: 'action', label: 'Stop', sublabel: 'nothing to do', x: 480, y: 250 },
    { id: 'create', kind: 'action', label: 'Create order', x: 760, y: 380 },
    { id: 'ship', kind: 'action', label: 'Ship', x: 480, y: 380 },
  ],
  edges: [
    { id: 'shop-queue', from: 'shop', to: 'queue' },
    { id: 'queue-trig', from: 'queue', to: 'trig' },
    { id: 'trig-create', from: 'trig', to: 'create' },
    { id: 'trig-get', from: 'trig', to: 'get' },
    { id: 'get-cond', from: 'get', to: 'cond' },
    { id: 'cond-skip', from: 'cond', to: 'skip', label: 'yes' },
    { id: 'cond-create', from: 'cond', to: 'create', label: 'no' },
    { id: 'create-ship', from: 'create', to: 'ship' },
  ],
  steps: {
    problem: {
      visible: [...intake, ...naive],
      highlight: ['ship'],
      tokens: [{ id: 'p1', edge: 'create-ship', tone: 'fail' }, { id: 'p2', edge: 'create-ship', tone: 'fail' }],
      chips: [{ label: 'order 4711', value: 'shipped twice', tone: 'fail' }],
    },
    idea: {
      visible: [...intake, ...naive],
      highlight: ['wfBox'],
      chips: [{ label: 'twice', value: 'same as once', tone: 'ok' }],
    },
    sources: {
      visible: [...intake, ...naive],
      highlight: ['queue-trig'],
      tokens: [{ id: 's1', edge: 'queue-trig', tone: 'info' }, { id: 's2', edge: 'queue-trig', tone: 'fail' }],
      chips: [{ label: 'repeats from', value: 'delivery · resubmit · retry' }],
    },
    check: {
      visible: [...intake, ...checked],
      highlight: ['get', 'cond', 'cond-skip'],
      tokens: [{ id: 'c1', edge: 'get-cond', tone: 'info' }, { id: 'c2', edge: 'cond-skip', tone: 'ok' }],
      chips: [{ label: 'second copy of 4711', value: 'found, stops', tone: 'ok' }, { label: 'ships', value: 'once', tone: 'ok' }],
    },
    key: {
      visible: [...intake, ...checked],
      highlight: ['get', 'shop'],
      chips: [{ label: 'look up by', value: 'order number', tone: 'ok' }],
    },
    sbdedupe: {
      visible: [...intake, ...checked],
      highlight: ['queue'],
      tokens: [{ id: 'd1', edge: 'shop-queue', tone: 'info' }, { id: 'd2', edge: 'shop-queue', tone: 'fail' }],
      chips: [{ label: 'message ID', value: 'order number' }, { label: 'quick repeat', value: 'dropped', tone: 'ok' }],
    },
    unsafe: {
      visible: [...intake, ...checked],
      highlight: ['create'],
      chips: [{ label: 'card payments', value: 'retry None', tone: 'warn' }],
    },
    recap: {
      visible: [...intake, ...checked],
      chips: [{ label: 'twice', value: 'changes nothing', tone: 'ok' }],
    },
  },
  legend: [
    { tone: 'info', label: 'first delivery' },
    { tone: 'ok', label: 'safe repeat' },
    { tone: 'fail', label: 'harmful repeat' },
  ],
};
