import type { Scene } from '../../../../lessons/scene-types';

const core = ['sender', 'blob', 'queue', 'receiver', 'sender-blob', 'sender-queue', 'queue-receiver', 'receiver-blob'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'sender', kind: 'action', label: 'Sender flow', sublabel: 'Create blob', x: 120, y: 240 },
    { id: 'blob', kind: 'storage', label: 'Blob Storage', sublabel: '40 MB payload', x: 450, y: 90 },
    { id: 'queue', kind: 'servicebus', label: 'Queue', sublabel: 'reference only', x: 450, y: 390 },
    { id: 'receiver', kind: 'action', label: 'Receiver flow', sublabel: 'Get blob', x: 780, y: 240 },
    { id: 'eg', kind: 'connector-managed', label: 'Event Grid', sublabel: 'BlobCreated', x: 780, y: 80 },
  ],
  edges: [
    { id: 'sender-blob', from: 'sender', to: 'blob' },
    { id: 'sender-queue', from: 'sender', to: 'queue' },
    { id: 'queue-receiver', from: 'queue', to: 'receiver' },
    { id: 'receiver-blob', from: 'receiver', to: 'blob', style: 'dashed' },
    { id: 'blob-eg', from: 'blob', to: 'eg', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['sender', 'queue', 'receiver', 'sender-queue', 'queue-receiver'],
      failed: ['queue'],
      tokens: [{ id: 'p1', edge: 'sender-queue', tone: 'fail' }],
      chips: [{ label: 'payload', value: '40 MB' }, { label: 'queue', value: 'rejects or slows', tone: 'fail' }],
    },
    pattern: {
      visible: [...core],
      highlight: ['blob', 'queue'],
      chips: [{ label: 'store', value: 'payload' }, { label: 'send', value: 'reference' }],
    },
    limits: {
      visible: [...core],
      highlight: ['queue'],
      chips: [{ label: 'Standard', value: '256 KB' }, { label: 'Premium', value: 'up to 100 MB (AMQP)' }, { label: 'managed connector', value: '1 MB', tone: 'warn' }],
    },
    sequence: {
      visible: [...core],
      tokens: [{ id: 's1', edge: 'sender-blob', tone: 'info' }, { id: 's2', edge: 'sender-queue', tone: 'ok' }, { id: 's3', edge: 'receiver-blob', tone: 'info' }],
      chips: [{ label: '1', value: 'write payload' }, { label: '2', value: 'then send reference' }],
    },
    eventgrid: {
      visible: [...core, 'eg', 'blob-eg'],
      highlight: ['eg', 'blob-eg'],
      tokens: [{ id: 'e1', edge: 'blob-eg', tone: 'info' }],
      chips: [{ label: 'claim check', value: 'blob URL in event' }, { label: 'expect', value: 'late · duplicate events', tone: 'warn' }],
    },
    lifecycle: {
      visible: [...core],
      highlight: ['blob'],
      chips: [{ label: 'decide', value: 'who deletes' }, { label: 'risk', value: 'orphaned payloads', tone: 'warn' }],
    },
    security: {
      visible: [...core],
      highlight: ['receiver-blob'],
      chips: [{ label: 'in the reference', value: 'no tokens' }, { label: 'access (ours)', value: 'managed identity' }],
    },
    when: {
      visible: [...core],
      chips: [{ label: 'use', value: 'big or sensitive payloads' }, { label: 'skip', value: 'if a tier fits' }],
    },
    recap: {
      visible: [...core, 'eg', 'blob-eg'],
      chips: [{ label: 'queue carries', value: 'a ticket, not the bag' }],
    },
  },
  legend: [{ tone: 'info', label: 'payload' }, { tone: 'ok', label: 'reference' }, { tone: 'fail', label: 'too large' }],
};
