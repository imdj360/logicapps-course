import type { Scene } from '../../../../lessons/scene-types';

const front = ['shop', 'front', 'queue', 'shop-front', 'front-queue'];
const back = ['proc', 'erp', 'queue-proc', 'proc-erp'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop', sublabel: 'orders', x: 100, y: 240 },
    { id: 'front', kind: 'trigger', label: 'Front door', sublabel: 'Request · 202', x: 290, y: 240 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', sublabel: 'dedupe on', x: 480, y: 240 },
    { id: 'proc', kind: 'scope', label: 'Process order', sublabel: 'peek-lock', x: 670, y: 240 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'idempotent', x: 820, y: 400 },
    { id: 'dlq', kind: 'servicebus', label: 'Dead-letter', sublabel: 'repair', x: 480, y: 410 },
    { id: 'mon', kind: 'appinsights', label: 'Monitoring', sublabel: 'tracking ID', x: 670, y: 80 },
  ],
  edges: [
    { id: 'shop-front', from: 'shop', to: 'front' },
    { id: 'front-queue', from: 'front', to: 'queue' },
    { id: 'queue-proc', from: 'queue', to: 'proc' },
    { id: 'proc-erp', from: 'proc', to: 'erp' },
    { id: 'queue-dlq', from: 'queue', to: 'dlq', style: 'dashed' },
    { id: 'proc-mon', from: 'proc', to: 'mon', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['shop', 'erp'],
      chips: [{ label: 'shop', value: 'answer in seconds' }, { label: 'ERP', value: 'each order once' }],
    },
    front: {
      visible: [...front],
      highlight: ['front'],
      tokens: [{ id: 'f1', edge: 'shop-front', tone: 'info' }, { id: 'f2', edge: 'front-queue', tone: 'ok' }],
      chips: [{ label: 'answer', value: '202 Accepted', tone: 'ok' }],
    },
    queue: {
      visible: [...front, ...back],
      highlight: ['queue'],
      chips: [{ label: 'pattern', value: 'queue-based load leveling' }, { label: 'MessageId', value: 'order number' }],
    },
    process: {
      visible: [...front, ...back],
      highlight: ['proc', 'queue-proc'],
      tokens: [{ id: 'p1', edge: 'queue-proc', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'built-in, peek-lock' }, { label: 'workflow', value: 'stateful' }],
    },
    transform: {
      visible: [...front, ...back],
      highlight: ['proc-erp', 'erp'],
      tokens: [{ id: 't1', edge: 'proc-erp', tone: 'ok' }],
      chips: [{ label: 'reshape', value: 'Liquid · XSLT' }, { label: 'write', value: 'upsert by order number' }],
    },
    failures: {
      visible: [...front, ...back, 'dlq', 'queue-dlq'],
      highlight: ['dlq', 'proc'],
      tokens: [{ id: 'x1', edge: 'queue-dlq', tone: 'fail' }],
      chips: [{ label: 'catch', value: 'Try/Catch + Terminate' }, { label: 'poison', value: 'dead-letter queue' }],
    },
    observe: {
      visible: [...front, ...back, 'mon', 'proc-mon'],
      highlight: ['mon'],
      chips: [{ label: 'tracking ID', value: 'order number' }, { label: 'alert', value: 'Runs Failure Rate' }],
    },
    scale: {
      visible: [...front, ...back],
      chips: [{ label: 'grow', value: 'queue absorbs bursts' }],
    },
    recap: {
      visible: [...front, ...back, 'dlq', 'mon', 'queue-dlq', 'proc-mon'],
      chips: [{ label: 'fast', value: 'front' }, { label: 'reliable', value: 'back' }],
    },
  },
  legend: [{ tone: 'info', label: 'order' }, { tone: 'ok', label: 'processed' }, { tone: 'fail', label: 'poison' }],
};
