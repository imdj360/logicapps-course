import type { Scene } from '../../../../lessons/scene-types';

const senders = ['s1', 's2', 's3', 's1-recv', 's2-recv', 's3-recv', 'recv'];
const out = ['recvBox', 'each', 'file', 'erp', 'recv-each', 'each-file', 'file-erp'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'recvBox', label: 'Receiver workflow · Collect orders', x: 270, y: 170, w: 590, h: 140 },
  ],
  nodes: [
    { id: 's1', kind: 'action', label: 'Shop orders', sublabel: 'Send to batch', x: 110, y: 100 },
    { id: 's2', kind: 'action', label: 'App orders', sublabel: 'Send to batch', x: 110, y: 240 },
    { id: 's3', kind: 'action', label: 'EDI orders', sublabel: 'Send to batch', x: 110, y: 380 },
    { id: 'q1', kind: 'action', label: 'Shop orders', sublabel: 'each order', x: 110, y: 100 },
    { id: 'q2', kind: 'action', label: 'App orders', sublabel: 'each order', x: 110, y: 240 },
    { id: 'q3', kind: 'action', label: 'EDI orders', sublabel: 'each order', x: 110, y: 380 },
    { id: 'erp0', kind: 'user', label: 'ERP', sublabel: 'hundreds a day', x: 600, y: 240 },
    { id: 'recv', kind: 'trigger', label: 'Batch Trigger', sublabel: 'every 1 hour', x: 365, y: 245 },
    { id: 'each', kind: 'scope', label: 'For each', sublabel: 'add a line', x: 565, y: 245 },
    { id: 'file', kind: 'action', label: 'Write file', sublabel: 'one CSV', x: 765, y: 245 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'one file', x: 765, y: 430 },
  ],
  edges: [
    { id: 'q1-erp0', from: 'q1', to: 'erp0' },
    { id: 'q2-erp0', from: 'q2', to: 'erp0' },
    { id: 'q3-erp0', from: 'q3', to: 'erp0' },
    { id: 's1-recv', from: 's1', to: 'recv' },
    { id: 's2-recv', from: 's2', to: 'recv' },
    { id: 's3-recv', from: 's3', to: 'recv' },
    { id: 'recv-each', from: 'recv', to: 'each', label: 'items' },
    { id: 'each-file', from: 'each', to: 'file' },
    { id: 'file-erp', from: 'file', to: 'erp' },
  ],
  steps: {
    problem: {
      visible: ['q1', 'q2', 'q3', 'erp0', 'q1-erp0', 'q2-erp0', 'q3-erp0'],
      highlight: ['erp0'],
      tokens: [{ id: 't1', edge: 'q1-erp0', tone: 'info' }, { id: 't2', edge: 'q2-erp0', tone: 'info' }, { id: 't3', edge: 'q3-erp0', tone: 'info' }],
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
      highlight: ['each', 'recv-each'],
      tokens: [{ id: 'e1', edge: 'recv-each', tone: 'ok' }],
      chips: [{ label: 'collection', value: 'Batched Items' }, { label: 'per item', value: 'partition · message ID' }],
    },
    example: {
      visible: [...senders, ...out],
      highlight: ['recv', 'file', 'erp'],
      tokens: [{ id: 'x1', edge: 's1-recv', tone: 'info' }, { id: 'x2', edge: 's3-recv', tone: 'info' }, { id: 'x3', edge: 'file-erp', tone: 'ok' }],
      chips: [{ label: 'release', value: 'every 1 hour' }, { label: 'partition', value: 'warehouse code' }, { label: 'result (ours)', value: 'one file per warehouse' }],
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
