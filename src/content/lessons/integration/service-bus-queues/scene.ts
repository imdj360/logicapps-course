import type { Scene } from '../../../../lessons/scene-types';

const flow = ['shop', 'queue', 'trig', 'erp', 'shop-queue', 'queue-trig', 'trig-erp'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop', sublabel: 'bursts', x: 110, y: 240 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', sublabel: 'Service Bus', x: 330, y: 240 },
    { id: 'trig', kind: 'trigger', label: 'Queue trigger', sublabel: 'built-in', x: 560, y: 240 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'steady pace', x: 790, y: 240 },
    { id: 'settle', kind: 'action', label: 'Complete', sublabel: 'or Abandon', x: 560, y: 90 },
    { id: 'dlq', kind: 'servicebus', label: 'Dead-letter', sublabel: 'DLQ', x: 330, y: 410 },
    { id: 'topic', kind: 'servicebus', label: 'Orders topic', sublabel: '2 subscriptions', x: 330, y: 90 },
    { id: 'wh', kind: 'user', label: 'Warehouse', sublabel: 'own copy', x: 790, y: 90 },
    { id: 'dlqtrig', kind: 'trigger', label: 'DLQ trigger', sublabel: 'alert · repair', x: 560, y: 410 },
  ],
  edges: [
    { id: 'shop-queue', from: 'shop', to: 'queue' },
    { id: 'queue-trig', from: 'queue', to: 'trig' },
    { id: 'trig-erp', from: 'trig', to: 'erp' },
    { id: 'trig-settle', from: 'trig', to: 'settle', style: 'dashed' },
    { id: 'queue-dlq', from: 'queue', to: 'dlq', style: 'dashed' },
    { id: 'shop-topic', from: 'shop', to: 'topic' },
    { id: 'topic-wh', from: 'topic', to: 'wh' },
    { id: 'topic-erp', from: 'topic', to: 'erp' },
    { id: 'dlq-dlqtrig', from: 'dlq', to: 'dlqtrig' },
  ],
  steps: {
    problem: {
      visible: [...flow],
      highlight: ['queue'],
      tokens: [
        { id: 'p1', edge: 'shop-queue', tone: 'info' },
        { id: 'p2', edge: 'shop-queue', tone: 'info' },
        { id: 'p3', edge: 'queue-trig', tone: 'ok' },
      ],
      chips: [{ label: 'in', value: 'bursts' }, { label: 'out', value: 'steady' }],
    },
    connectors: {
      visible: [...flow],
      highlight: ['trig'],
      chips: [{ label: 'built-in', value: 'Standard only', tone: 'ok' }, { label: 'managed max message', value: '1 MB', tone: 'warn' }],
    },
    trigger: {
      visible: [...flow],
      highlight: ['trig', 'queue-trig'],
      tokens: [{ id: 't1', edge: 'queue-trig', tone: 'info' }, { id: 't2', edge: 'trig-erp', tone: 'ok' }],
      chips: [{ label: 'per run', value: 'one or more messages' }, { label: 'default', value: 'auto-complete' }],
    },
    peeklock: {
      visible: [...flow, 'settle', 'trig-settle'],
      highlight: ['settle', 'trig-settle'],
      tokens: [{ id: 'k1', edge: 'trig-settle', tone: 'ok' }],
      chips: [{ label: 'message', value: 'locked' }, { label: 'settle with', value: 'Complete · Abandon · Dead-letter …' }, { label: 'long runs', value: 'Renew lock', tone: 'warn' }],
    },
    topics: {
      visible: ['shop', 'topic', 'wh', 'erp', 'shop-topic', 'topic-wh', 'topic-erp'],
      highlight: ['topic'],
      tokens: [{ id: 't1', edge: 'topic-wh', tone: 'ok' }, { id: 't2', edge: 'topic-erp', tone: 'ok' }],
      chips: [{ label: 'queue', value: 'one reader per message' }, { label: 'topic', value: 'a copy per subscription', tone: 'ok' }, { label: 'trigger', value: 'topic subscription (peek-lock)' }],
    },
    sessions: {
      visible: [...flow],
      highlight: ['queue', 'trig'],
      chips: [{ label: 'pattern', value: 'sequential convoy' }, { label: 'trigger', value: 'IsSessionsEnabled' }, { label: 'cache', value: '1,500 sessions per entity' }],
    },
    deadletter: {
      visible: [...flow, 'dlq', 'dlqtrig', 'queue-dlq', 'dlq-dlqtrig'],
      highlight: ['dlq', 'dlqtrig', 'dlq-dlqtrig'],
      tokens: [{ id: 'd1', edge: 'queue-dlq', tone: 'fail' }, { id: 'd2', edge: 'dlq-dlqtrig', tone: 'info' }],
      chips: [{ label: 'read from', value: 'queue/$deadletterqueue' }],
    },
    concurrency: {
      visible: [...flow],
      highlight: ['trig'],
      chips: [{ label: 'concurrent runs', value: '> batch size' }, { label: 'between reads', value: '30 s default' }, { label: 'V1 + concurrency + 100 msgs', value: 'all dead-lettered', tone: 'fail' }],
    },
    auth: {
      visible: [...flow],
      highlight: ['queue'],
      chips: [{ label: 'auth', value: 'string · Entra · MI' }, { label: 'EntityPath in string', value: 'wrong scope', tone: 'warn' }],
    },
    recap: {
      visible: [...flow, 'settle', 'dlq', 'dlqtrig', 'trig-settle', 'queue-dlq', 'dlq-dlqtrig'],
      chips: [{ label: 'connector', value: 'built-in' }, { label: 'failures', value: 'dead-letter queue' }],
    },
  },
  legend: [
    { tone: 'info', label: 'message' },
    { tone: 'ok', label: 'processed' },
    { tone: 'fail', label: 'dead-lettered' },
  ],
};
