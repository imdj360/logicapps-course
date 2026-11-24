import type { Scene } from '../../../../lessons/scene-types';

const senders = ['s1', 's2', 's3', 's1-recv', 's2-recv', 's3-recv', 'recv'];
const out = ['each', 'erp', 'recv-each', 'each-erp'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 's1', kind: 'action', label: 'Shop orders', sublabel: 'Send to batch', x: 110, y: 100 },
    { id: 's2', kind: 'action', label: 'App orders', sublabel: 'Send to batch', x: 110, y: 240 },
    { id: 's3', kind: 'action', label: 'EDI orders', sublabel: 'Send to batch', x: 110, y: 380 },
    { id: 'recv', kind: 'trigger', label: 'Batch Trigger', sublabel: 'receiver', x: 420, y: 240 },
    { id: 'each', kind: 'scope', label: 'For each', sublabel: 'Batched Items', x: 640, y: 240 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'one file', x: 820, y: 240 },
  ],
  edges: [
    { id: 's1-recv', from: 's1', to: 'recv' },
    { id: 's2-recv', from: 's2', to: 'recv' },
    { id: 's3-recv', from: 's3', to: 'recv' },
    { id: 'recv-each', from: 'recv', to: 'each' },
    { id: 'each-erp', from: 'each', to: 'erp' },
  ],
  steps: {
    problem: {
      visible: ['s1', 's2', 's3', 'erp'],
      highlight: ['erp'],
      chips: [{ label: 'today', value: 'hundreds of messages', tone: 'warn' }, { label: 'ERP wants', value: 'one file per hour' }],
    },
    pattern: {
      visible: [...senders],
      highlight: ['recv'],
      tokens: [{ id: 'p1', edge: 's1-recv', tone: 'info' }, { id: 'p2', edge: 's2-recv', tone: 'info' }, { id: 'p3', edge: 's3-recv', tone: 'info' }],
      chips: [{ label: 'receiver', value: 'Batch Trigger' }, { label: 'senders', value: 'Send to batch' }, { label: 'same', value: 'subscription · region' }],
    },
    release: {
      visible: [...senders, ...out],
      highlight: ['recv', 'recv-each'],
      tokens: [{ id: 'r1', edge: 'recv-each', tone: 'ok' }],
      chips: [{ label: 'release by', value: 'count · size · schedule' }, { label: 'max', value: '8,000 msgs · 80 MB' }, { label: 'schedule', value: '≥ 60 s' }],
    },
    sender: {
      visible: [...senders],
      highlight: ['s1', 's1-recv'],
      tokens: [{ id: 's1t', edge: 's1-recv', tone: 'info' }],
      chips: [{ label: 'batch name', value: 'must match', tone: 'warn' }, { label: 'also needs', value: 'workflow · trigger name' }],
    },
    partitions: {
      visible: [...senders],
      highlight: ['recv'],
      chips: [{ label: 'partition name', value: 'one subset each' }, { label: 'per partition', value: '≤ 5,000 msgs · 80 MB' }, { label: 'message ID', value: 'GUID if empty' }],
    },
    receive: {
      visible: [...senders, ...out],
      highlight: ['each', 'each-erp'],
      tokens: [{ id: 'e1', edge: 'each-erp', tone: 'ok' }],
      chips: [{ label: 'collection', value: 'Batched Items' }, { label: 'per item', value: 'partition · message ID' }],
    },
    limits: {
      visible: [...senders, ...out],
      highlight: ['recv'],
      chips: [{ label: 'see contents', value: 'after release only' }, { label: 'release early', value: 'change the criteria' }],
    },
    recap: {
      visible: [...senders, ...out],
      chips: [{ label: 'collect', value: 'receiver' }, { label: 'send', value: 'senders' }],
    },
  },
  legend: [
    { tone: 'info', label: 'single message' },
    { tone: 'ok', label: 'released batch' },
  ],
};
