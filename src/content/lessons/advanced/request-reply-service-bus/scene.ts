import type { Scene } from '../../../../lessons/scene-types';

const core = ['order', 'reqq', 'engine', 'repq', 'order-reqq', 'reqq-engine', 'engine-repq', 'repq-order'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'order', kind: 'action', label: 'Order flow', sublabel: 'requester', x: 120, y: 240 },
    { id: 'reqq', kind: 'servicebus', label: 'Request queue', sublabel: 'ReplyTo set', x: 450, y: 100 },
    { id: 'engine', kind: 'user', label: 'Pricing engine', sublabel: '3-10 min', x: 780, y: 240 },
    { id: 'repq', kind: 'servicebus', label: 'Reply queue', sublabel: 'sessions', x: 450, y: 380 },
    { id: 'topic', kind: 'servicebus', label: 'Topic', sublabel: 'multicast', x: 120, y: 420 },
  ],
  edges: [
    { id: 'order-engine', from: 'order', to: 'engine', style: 'dashed' },
    { id: 'order-reqq', from: 'order', to: 'reqq' },
    { id: 'reqq-engine', from: 'reqq', to: 'engine' },
    { id: 'engine-repq', from: 'engine', to: 'repq' },
    { id: 'repq-order', from: 'repq', to: 'order' },
    { id: 'order-topic', from: 'order', to: 'topic', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['order', 'engine', 'order-engine'],
      failed: ['order'],
      tokens: [{ id: 'h1', edge: 'order-engine', tone: 'fail' }],
      chips: [{ label: 'quote takes', value: '3-10 min' }, { label: 'HTTP timeout', value: '225 s by default', tone: 'fail' }],
    },
    pattern: {
      visible: [...core],
      highlight: ['reqq', 'repq'],
      chips: [{ label: 'ask', value: 'on a queue' }, { label: 'answer', value: 'on another queue', tone: 'ok' }],
    },
    two: {
      visible: [...core],
      chips: [{ label: 'HTTP', value: '202 + polling' }, { label: 'messaging', value: 'two queues' }],
    },
    sequence: {
      visible: [...core],
      tokens: [{ id: 's1', edge: 'order-reqq', tone: 'info' }, { id: 's2', edge: 'engine-repq', tone: 'ok' }, { id: 's3', edge: 'repq-order', tone: 'ok' }],
      chips: [{ label: 'request', value: 'MessageId + ReplyTo' }, { label: 'reply', value: 'CorrelationId = MessageId' }],
    },
    sessions: {
      visible: [...core],
      highlight: ['repq', 'repq-order'],
      tokens: [{ id: 'x1', edge: 'repq-order', tone: 'ok' }],
      chips: [{ label: 'request', value: 'ReplyToSessionId = GUID' }, { label: 'reply', value: 'SessionId = GUID' }],
    },
    build: {
      visible: [...core],
      highlight: ['order', 'engine'],
      chips: [{ label: 'send', value: 'managed Send message' }, { label: 'read', value: 'Get messages from a queue session' }],
    },
    wait: {
      visible: [...core],
      highlight: ['order', 'repq-order'],
      chips: [{ label: 'Until default', value: '60 loops or PT1H' }, { label: 'wait', value: 'Get messages + Delay (ours)' }],
    },
    multicast: {
      visible: [...core, 'topic', 'order-topic'],
      highlight: ['topic', 'order-topic'],
      tokens: [{ id: 'm1', edge: 'order-topic', tone: 'info' }],
      chips: [{ label: 'topic', value: 'many replies' }],
    },
    watch: {
      visible: [...core],
      failed: ['engine'],
      chips: [{ label: 'no reply', value: 'alert or compensate', tone: 'warn' }, { label: 'requests', value: 'idempotent' }],
    },
    when: {
      visible: [...core],
      chips: [{ label: 'use', value: 'answer takes minutes' }, { label: 'skip', value: 'answer in seconds' }],
    },
    recap: {
      visible: [...core, 'topic', 'order-topic'],
      chips: [{ label: 'match by', value: 'correlation or session' }],
    },
  },
  legend: [{ tone: 'info', label: 'request' }, { tone: 'ok', label: 'reply' }, { tone: 'fail', label: 'timeout' }],
};
