import type { Scene } from '../../../../lessons/scene-types';

// The workflow does real work between the queue and the ERP: parse, send, then settle the message.
const wf = ['wfBox', 'trig', 'parse', 'send', 'trig-parse', 'parse-send', 'erp', 'send-erp'];
const inQ = ['shop', 'queue', 'shop-queue', 'queue-trig'];
const settle = ['complete', 'dl', 'send-complete', 'send-dl'];

export const scene: Scene = {
  viewBox: [900, 560],
  groups: [
    { id: 'wfBox', label: 'Order to ERP workflow', x: 200, y: 150, w: 660, h: 250 },
  ],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop', sublabel: 'bursts', x: 100, y: 70 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', sublabel: 'Service Bus', x: 300, y: 70 },
    { id: 'topic', kind: 'servicebus', label: 'Orders topic', sublabel: '2 subscriptions', x: 300, y: 70 },
    { id: 'wh', kind: 'user', label: 'Warehouse', sublabel: 'own copy', x: 560, y: 70 },
    { id: 'trig', kind: 'trigger', label: 'Queue trigger', sublabel: 'built-in', x: 300, y: 225 },
    { id: 'parse', kind: 'action', label: 'Parse order', sublabel: 'Parse JSON', x: 520, y: 225 },
    { id: 'send', kind: 'connector-builtin', label: 'Send to ERP', sublabel: 'HTTP', x: 745, y: 225 },
    { id: 'dl', kind: 'action', label: 'Dead-letter', sublabel: 'if it fails', x: 520, y: 340 },
    { id: 'complete', kind: 'action', label: 'Complete', sublabel: 'the message', x: 745, y: 340 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'steady pace', x: 790, y: 70 },
    { id: 'dlq', kind: 'servicebus', label: 'Dead-letter', sublabel: 'queue', x: 300, y: 490 },
  ],
  edges: [
    { id: 'shop-queue', from: 'shop', to: 'queue' },
    { id: 'queue-trig', from: 'queue', to: 'trig' },
    { id: 'shop-topic', from: 'shop', to: 'topic' },
    { id: 'topic-trig', from: 'topic', to: 'trig', label: 'ERP' },
    { id: 'topic-wh', from: 'topic', to: 'wh' },
    { id: 'trig-parse', from: 'trig', to: 'parse' },
    { id: 'parse-send', from: 'parse', to: 'send' },
    { id: 'send-erp', from: 'send', to: 'erp' },
    { id: 'send-complete', from: 'send', to: 'complete', label: 'ok' },
    { id: 'send-dl', from: 'send', to: 'dl', style: 'dashed', label: 'failed' },
    { id: 'dl-dlq', from: 'dl', to: 'dlq', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...inQ, ...wf],
      highlight: ['queue'],
      tokens: [
        { id: 'p1', edge: 'shop-queue', tone: 'info' },
        { id: 'p2', edge: 'shop-queue', tone: 'info' },
        { id: 'p3', edge: 'send-erp', tone: 'ok' },
      ],
      chips: [{ label: 'in', value: 'bursts' }, { label: 'out', value: 'one order at a time' }],
    },
    connectors: {
      visible: [...inQ, ...wf],
      highlight: ['trig'],
      chips: [{ label: 'use', value: 'built-in connector', tone: 'ok' }, { label: 'managed', value: '1 MB limit', tone: 'warn' }],
    },
    trigger: {
      visible: [...inQ, ...wf],
      highlight: ['trig', 'queue-trig'],
      tokens: [{ id: 't1', edge: 'queue-trig', tone: 'info' }, { id: 't2', edge: 'trig-parse', tone: 'info' }, { id: 't3', edge: 'parse-send', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'auto-completes' }, { label: 'per run', value: 'one or more messages' }],
    },
    peeklock: {
      visible: [...inQ, ...wf, ...settle],
      highlight: ['complete', 'dl', 'send-complete', 'send-dl'],
      tokens: [{ id: 'k1', edge: 'send-complete', tone: 'ok' }],
      chips: [{ label: 'trigger', value: '(peek-lock)' }, { label: 'you settle', value: 'Complete · Dead-letter', tone: 'ok' }],
    },
    topics: {
      visible: ['shop', 'topic', 'wh', 'shop-topic', 'topic-trig', 'topic-wh', ...wf],
      highlight: ['topic', 'wh', 'trig'],
      tokens: [{ id: 'to1', edge: 'topic-wh', tone: 'ok' }, { id: 'to2', edge: 'topic-trig', tone: 'ok' }],
      chips: [{ label: 'queue', value: 'one reader per message' }, { label: 'topic', value: 'a copy per subscription', tone: 'ok' }],
    },
    sessions: {
      visible: [...inQ, ...wf],
      highlight: ['queue'],
      chips: [{ label: 'same order', value: 'same session ID' }, { label: 'trigger setting', value: 'IsSessionsEnabled = Yes' }],
    },
    deadletter: {
      visible: [...inQ, ...wf, ...settle, 'dlq', 'dl-dlq'],
      highlight: ['dl', 'dlq', 'dl-dlq'],
      failed: ['send'],
      tokens: [{ id: 'd1', edge: 'send-dl', tone: 'fail' }, { id: 'd2', edge: 'dl-dlq', tone: 'fail' }],
      chips: [{ label: 'read it at', value: 'queue/$deadletterqueue' }, { label: 'then', value: 'alert · repair · resubmit' }],
    },
    concurrency: {
      visible: [...inQ, ...wf],
      highlight: ['trig'],
      chips: [{ label: 'concurrent runs', value: 'more than batch size' }, { label: 'between batch reads', value: '30 s by default' }],
    },
    auth: {
      visible: [...inQ, ...wf],
      highlight: ['queue', 'queue-trig'],
      chips: [{ label: 'auth', value: 'connection string · Entra ID · MI' }, { label: 'connection string', value: 'namespace, no EntityPath', tone: 'warn' }],
    },
    recap: {
      visible: [...inQ, ...wf, ...settle, 'dlq', 'dl-dlq'],
      chips: [{ label: 'queue', value: 'absorbs bursts' }, { label: 'workflow', value: 'parse · send · settle' }],
    },
  },
  legend: [
    { tone: 'info', label: 'message' },
    { tone: 'ok', label: 'processed' },
    { tone: 'fail', label: 'dead-lettered' },
  ],
};
