import type { Scene } from '../../../../lessons/scene-types';

const core = ['sender', 'blob', 'queue', 'receiver', 'sender-blob', 'sender-queue', 'queue-receiver', 'blob-receiver'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'sender', kind: 'action', label: 'Sender flow', sublabel: 'sends invoice', x: 120, y: 240 },
    { id: 'blob', kind: 'storage', label: 'Blob Storage', sublabel: '40 MB invoice', x: 450, y: 90 },
    { id: 'queue', kind: 'servicebus', label: 'Queue', sublabel: 'Service Bus', x: 450, y: 390 },
    { id: 'receiver', kind: 'action', label: 'Receiver flow', sublabel: 'reads invoice', x: 780, y: 240 },
    { id: 'eg', kind: 'connector-managed', label: 'Event Grid', sublabel: 'BlobCreated', x: 780, y: 80 },
  ],
  edges: [
    { id: 'sender-blob', from: 'sender', to: 'blob' },
    { id: 'sender-queue', from: 'sender', to: 'queue' },
    { id: 'queue-receiver', from: 'queue', to: 'receiver' },
    { id: 'blob-receiver', from: 'blob', to: 'receiver', style: 'dashed' },
    { id: 'blob-eg', from: 'blob', to: 'eg', style: 'dashed' },
    { id: 'eg-receiver', from: 'eg', to: 'receiver', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['sender', 'queue', 'receiver', 'sender-queue', 'queue-receiver'],
      failed: ['queue'],
      tokens: [{ id: 'p1', edge: 'sender-queue', tone: 'fail' }],
      chips: [{ label: 'invoice', value: '40 MB' }, { label: 'Standard queue', value: '256 KB max', tone: 'fail' }],
    },
    pattern: {
      visible: [...core],
      highlight: ['blob', 'queue'],
      chips: [{ label: 'file', value: 'stays in Blob Storage' }, { label: 'message', value: 'carries its path', tone: 'ok' }],
    },
    limits: {
      visible: [...core],
      highlight: ['queue'],
      chips: [{ label: 'Standard', value: '256 KB' }, { label: 'Premium', value: '1 MB, up to 100 MB' }, { label: 'managed connector', value: '1 MB', tone: 'warn' }],
    },
    sequence: {
      visible: [...core],
      tokens: [{ id: 's1', edge: 'sender-blob', tone: 'info' }, { id: 's2', edge: 'sender-queue', tone: 'ok' }, { id: 's2b', edge: 'queue-receiver', tone: 'ok' }, { id: 's3', edge: 'blob-receiver', tone: 'info' }],
      chips: [{ label: '1', value: 'save the file' }, { label: '2', value: 'then send the path' }, { label: '3', value: 'receiver fetches it' }],
    },
    build: {
      visible: [...core],
      highlight: ['sender', 'receiver'],
      tokens: [{ id: 'b1', edge: 'sender-blob', tone: 'info' }, { id: 'b2', edge: 'sender-queue', tone: 'ok' }, { id: 'b2b', edge: 'queue-receiver', tone: 'ok' }, { id: 'b3', edge: 'blob-receiver', tone: 'info' }],
      chips: [{ label: 'sender', value: 'Upload blob → Send message' }, { label: 'receiver', value: 'queue trigger → Read blob content' }],
    },
    eventgrid: {
      visible: ['sender', 'blob', 'eg', 'receiver', 'sender-blob', 'blob-eg', 'eg-receiver', 'blob-receiver'],
      highlight: ['eg', 'blob-eg', 'eg-receiver'],
      tokens: [{ id: 'e0', edge: 'sender-blob', tone: 'info' }, { id: 'e1', edge: 'blob-eg', tone: 'ok' }, { id: 'e2', edge: 'eg-receiver', tone: 'ok' }, { id: 'e3', edge: 'blob-receiver', tone: 'info' }],
      chips: [{ label: 'claim check', value: 'blob URL in event' }, { label: 'event', value: 'BlobCreated' }],
    },
    lifecycle: {
      visible: [...core],
      highlight: ['blob'],
      chips: [{ label: 'message', value: 'removed once done' }, { label: 'file', value: 'stays until deleted', tone: 'warn' }],
    },
    security: {
      visible: [...core],
      highlight: ['blob-receiver'],
      chips: [{ label: 'in the reference', value: 'no tokens' }, { label: 'access (ours)', value: 'managed identity' }],
    },
    when: {
      visible: [...core],
      chips: [{ label: 'use', value: 'big or sensitive payloads' }, { label: 'skip', value: 'if a tier fits' }],
    },
    recap: {
      visible: [...core, 'eg', 'blob-eg', 'eg-receiver'],
      chips: [{ label: 'queue carries', value: 'the ticket, not the coat' }],
    },
  },
  legend: [{ tone: 'info', label: 'payload' }, { tone: 'ok', label: 'reference' }, { tone: 'fail', label: 'too large' }],
};
