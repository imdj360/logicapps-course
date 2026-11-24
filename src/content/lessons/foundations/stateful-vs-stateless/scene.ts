import type { Scene } from '../../../../lessons/scene-types';

const fast = ['shop', 'price', 'mem', 'shop-price', 'price-mem'];
const safe = ['order', 'storage', 'order-storage'];
const chain = ['price-order'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop website', x: 110, y: 110 },
    { id: 'price', kind: 'trigger', label: 'Take order', sublabel: 'stateless', x: 340, y: 110 },
    { id: 'mem', kind: 'action', label: 'Memory only', sublabel: 'no history', x: 580, y: 110 },
    { id: 'api', kind: 'connector-managed', label: 'Stock service', sublabel: '202 Accepted', x: 800, y: 260 },
    { id: 'order', kind: 'trigger', label: 'Process order', sublabel: 'stateful', x: 340, y: 410 },
    { id: 'storage', kind: 'storage', label: 'Azure Storage', sublabel: 'state · history', x: 580, y: 410 },
    { id: 'you', kind: 'human', label: 'You', sublabel: 'resubmit', x: 800, y: 410 },
  ],
  edges: [
    { id: 'shop-price', from: 'shop', to: 'price' },
    { id: 'price-mem', from: 'price', to: 'mem', style: 'dashed' },
    { id: 'price-api', from: 'price', to: 'api' },
    { id: 'price-order', from: 'price', to: 'order' },
    { id: 'order-storage', from: 'order', to: 'storage' },
    { id: 'you-storage', from: 'you', to: 'storage', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['shop', 'price', 'order', 'shop-price', ...chain],
      highlight: ['price', 'order'],
      tokens: [{ id: 'p1', edge: 'shop-price', tone: 'info' }, { id: 'p2', edge: 'price-order', tone: 'ok' }],
      chips: [{ label: 'Take order', value: 'must be fast' }, { label: 'Process order', value: 'must not be lost' }],
    },
    stateful: {
      visible: [...safe, 'you', 'you-storage'],
      highlight: ['order', 'storage', 'order-storage'],
      tokens: [{ id: 's1', edge: 'order-storage', tone: 'info' }],
      chips: [{ label: 'state', value: 'external storage' }, { label: 'run history', value: 'yes', tone: 'ok' }, { label: 'max run', value: '90 days default' }],
    },
    stateless: {
      visible: [...fast],
      highlight: ['price', 'mem', 'price-mem'],
      tokens: [{ id: 'l1', edge: 'shop-price', tone: 'info' }, { id: 'l2', edge: 'price-mem', tone: 'info' }],
      chips: [{ label: 'state', value: 'in memory' }, { label: 'speed', value: 'faster', tone: 'ok' }, { label: 'runs', value: 'synchronous only' }],
    },
    choose: {
      visible: [...fast, ...safe, ...chain],
      highlight: ['price', 'order'],
      chips: [{ label: 'type', value: 'chosen at creation', tone: 'warn' }, { label: 'one logic app', value: 'both kinds' }],
    },
    limits: {
      visible: [...fast],
      highlight: ['price'],
      chips: [{ label: 'run', value: 'under 5 min' }, { label: 'content', value: 'under 64 KB', tone: 'warn' }, { label: 'For each', value: '100 items' }],
    },
    triggers: {
      visible: [...fast, ...safe, ...chain],
      highlight: ['price', 'order'],
      chips: [{ label: 'stateless', value: 'push triggers' }, { label: 'Recurrence', value: 'unavailable', tone: 'warn' }, { label: 'managed triggers', value: 'not offered', tone: 'warn' }],
    },
    async: {
      visible: [...fast, 'api', 'price-api'],
      highlight: ['api', 'price-api'],
      tokens: [{ id: 'a1', edge: 'price-api', tone: 'info' }],
      chips: [{ label: 'response', value: '202 Accepted' }, { label: 'polls location', value: 'no', tone: 'warn' }, { label: 'chunking', value: 'no', tone: 'warn' }],
    },
    history: {
      visible: [...fast, ...safe, ...chain, 'you', 'you-storage'],
      highlight: ['mem', 'you', 'you-storage'],
      failed: ['price'],
      chips: [{ label: 'run history', value: 'off by default', tone: 'warn' }, { label: 'resubmit', value: 'not by default', tone: 'fail' }, { label: 'debug', value: 'Debug state (not prod)' }],
    },
    mix: {
      visible: ['shop', 'price', 'order', 'storage', 'shop-price', 'price-order', 'order-storage'],
      highlight: ['price', 'order'],
      tokens: [{ id: 'm1', edge: 'price-order', tone: 'info' }, { id: 'm2', edge: 'order-storage', tone: 'ok' }],
      chips: [{ label: '1 call', value: 'Take order → Process order' }, { label: '2 reply', value: '202 Accepted' }, { label: '3 no wait', value: 'shop told right away', tone: 'ok' }],
    },
    recap: {
      visible: [...fast, ...safe, ...chain, 'you', 'you-storage'],
      chips: [{ label: 'stateful', value: 'safe' }, { label: 'stateless', value: 'fast' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data moving' },
    { tone: 'ok', label: 'hand-off to Process order' },
    { tone: 'failed', label: 'nothing saved to resubmit' },
  ],
};
