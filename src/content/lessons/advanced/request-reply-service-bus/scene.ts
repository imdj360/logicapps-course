import type { Scene } from '../../../../lessons/scene-types';

const core = ['order', 'reqq', 'engine', 'repq', 'order-reqq', 'reqq-engine', 'engine-repq', 'repq-order'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'order', kind: 'action', label: 'Order flow', sublabel: 'requester', x: 120, y: 240 },
    { id: 'reqq', kind: 'servicebus', label: 'Request queue', sublabel: 'ReplyTo set', x: 450, y: 100 },
    { id: 'engine', kind: 'user', label: 'Pricing engine', sublabel: '3–10 min', x: 780, y: 240 },
    { id: 'repq', kind: 'servicebus', label: 'Reply queue', sublabel: 'sessions', x: 450, y: 380 },
    { id: 'topic', kind: 'servicebus', label: 'Topic', sublabel: 'multicast', x: 120, y: 420 },
  ],
  edges: [
    { id: 'order-reqq', from: 'order', to: 'reqq' },
    { id: 'reqq-engine', from: 'reqq', to: 'engine' },
    { id: 'engine-repq', from: 'engine', to: 'repq' },
    { id: 'repq-order', from: 'repq', to: 'order' },
    { id: 'order-topic', from: 'order', to: 'topic', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['order', 'engine'],
      chips: [{ label: 'answer takes', value: '3–10 min' }, { label: 'HTTP waits', value: '225 s max', tone: 'warn' }],
    },
    two: {
      visible: [...core],
      chips: [{ label: 'HTTP', value: '202 + polling' }, { label: 'messaging', value: 'request + reply queues' }],
    },
    simple: {
      visible: [...core],
      tokens: [{ id: 's1', edge: 'order-reqq', tone: 'info' }, { id: 's2', edge: 'engine-repq', tone: 'ok' }],
      chips: [{ label: 'request', value: 'ReplyTo · MessageId' }, { label: 'reply', value: 'CorrelationId = MessageId' }],
    },
    sessions: {
      visible: [...core],
      highlight: ['repq', 'repq-order'],
      tokens: [{ id: 'x1', edge: 'repq-order', tone: 'ok' }],
      chips: [{ label: 'request', value: 'ReplyToSessionId = GUID' }, { label: 'reply', value: 'SessionId = GUID' }],
    },
    logicapps: {
      visible: [...core],
      highlight: ['order'],
      chips: [{ label: 'send', value: 'Session Id + advanced' }, { label: 'receive', value: 'Reply to · Correlation ID' }],
    },
    design: {
      visible: [...core],
      highlight: ['order', 'repq-order'],
      chips: [{ label: 'wait', value: 'Until, with timeout' }, { label: 'no reply', value: 'Has timed out', tone: 'warn' }],
    },
    multicast: {
      visible: [...core, 'topic', 'order-topic'],
      highlight: ['topic'],
      chips: [{ label: 'topic', value: 'many replies' }],
    },
    cautions: {
      visible: [...core],
      chips: [{ label: 'late replies', value: 'plan for them', tone: 'warn' }, { label: 'requests', value: 'idempotent' }],
    },
    recap: {
      visible: [...core, 'topic', 'order-topic'],
      chips: [{ label: 'match by', value: 'correlation or session' }],
    },
  },
  legend: [{ tone: 'info', label: 'request' }, { tone: 'ok', label: 'reply' }],
};
