import type { Scene } from '../../../../lessons/scene-types';

const scatter = ['req', 's1', 's2', 's3', 'req-s1', 'req-s2', 'req-s3'];
const gather = ['join', 's1-join', 's2-join', 's3-join'];
const topicFlow = [
  'req', 'topic', 's1', 's2', 's3', 'replyq', 'join',
  'req-topic', 'topic-s1', 'topic-s2', 'topic-s3',
  's1-replyq', 's2-replyq', 's3-replyq', 'replyq-join',
];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'req', kind: 'trigger', label: 'Quote request', sublabel: 'large order', x: 84, y: 240 },
    { id: 'topic', kind: 'servicebus', label: 'RFQ topic', sublabel: 'subscriptions', x: 267, y: 240 },
    { id: 's1', kind: 'user', label: 'Supplier A', sublabel: '2 s', x: 450, y: 90 },
    { id: 's2', kind: 'user', label: 'Supplier B', sublabel: '5 s', x: 450, y: 240 },
    { id: 's3', kind: 'user', label: 'Supplier C', sublabel: 'no answer', x: 450, y: 390 },
    { id: 'replyq', kind: 'servicebus', label: 'Replies queue', sublabel: 'CorrelationId', x: 633, y: 240 },
    { id: 'join', kind: 'action', label: 'Pick cheapest', sublabel: 'gather', x: 816, y: 240 },
  ],
  edges: [
    { id: 'req-s1', from: 'req', to: 's1' },
    { id: 'req-s2', from: 'req', to: 's2' },
    { id: 'req-s3', from: 'req', to: 's3' },
    { id: 's1-join', from: 's1', to: 'join' },
    { id: 's2-join', from: 's2', to: 'join' },
    { id: 's3-join', from: 's3', to: 'join', style: 'dashed' },
    { id: 'req-topic', from: 'req', to: 'topic' },
    { id: 'topic-s1', from: 'topic', to: 's1' },
    { id: 'topic-s2', from: 'topic', to: 's2' },
    { id: 'topic-s3', from: 'topic', to: 's3' },
    { id: 's1-replyq', from: 's1', to: 'replyq' },
    { id: 's2-replyq', from: 's2', to: 'replyq' },
    { id: 's3-replyq', from: 's3', to: 'replyq', style: 'dashed' },
    { id: 'replyq-join', from: 'replyq', to: 'join' },
  ],
  steps: {
    problem: {
      visible: [...scatter],
      failed: ['s3'],
      chips: [{ label: 'one by one', value: 'too slow', tone: 'warn' }, { label: 'Supplier C', value: 'never answers', tone: 'fail' }],
    },
    idea: {
      visible: [...scatter, ...gather],
      chips: [{ label: 'scatter', value: 'ask all at once' }, { label: 'gather', value: 'collect, then choose', tone: 'ok' }],
    },
    flow: {
      visible: [...scatter, ...gather],
      tokens: [{ id: 'f1', edge: 'req-s1', tone: 'info' }, { id: 'f2', edge: 'req-s2', tone: 'info' }, { id: 'f3', edge: 'req-s3', tone: 'info' }, { id: 'f4', edge: 's1-join', tone: 'ok' }, { id: 'f5', edge: 's2-join', tone: 'ok' }],
      chips: [{ label: '1-2', value: 'order, ask all three' }, { label: '3-4', value: 'replies, pick cheapest' }],
    },
    branches: {
      visible: [...scatter, ...gather],
      highlight: ['join'],
      tokens: [{ id: 'b1', edge: 'req-s1', tone: 'info' }, { id: 'b2', edge: 'req-s2', tone: 'info' }, { id: 'b3', edge: 'req-s3', tone: 'info' }],
      chips: [{ label: 'scatter', value: 'parallel branches + HTTP' }, { label: 'gather', value: 'join after all branches' }],
    },
    deadline: {
      visible: [...scatter, ...gather],
      failed: ['s3'],
      tokens: [{ id: 'd1', edge: 's1-join', tone: 'ok' }, { id: 'd2', edge: 's2-join', tone: 'ok' }],
      chips: [{ label: 'join run after', value: '+ Has failed, Has timed out' }, { label: 'HTTP timeout', value: 'max 225 s', tone: 'warn' }],
    },
    topic: {
      visible: [...topicFlow],
      highlight: ['topic', 'req-topic', 'topic-s1', 'topic-s2', 'topic-s3'],
      tokens: [
        { id: 't1', edge: 'req-topic', tone: 'info' },
        { id: 't2', edge: 'topic-s1', tone: 'info' },
        { id: 't3', edge: 'topic-s2', tone: 'info' },
        { id: 't4', edge: 'topic-s3', tone: 'info' },
      ],
      chips: [{ label: 'scatter', value: 'Send message to topic' }, { label: 'replies', value: 'match CorrelationId' }],
    },
    gather: {
      visible: [...topicFlow],
      highlight: ['replyq', 'join', 'replyq-join'],
      tokens: [
        { id: 'g1', edge: 's1-replyq', tone: 'ok' },
        { id: 'g2', edge: 's2-replyq', tone: 'ok' },
        { id: 'g3', edge: 'replyq-join', tone: 'ok' },
      ],
      chips: [{ label: 'collect', value: 'Until all or deadline' }, { label: 'Until default', value: '60 loops / 1 hour' }],
    },
    watch: {
      visible: [...scatter, ...gather],
      failed: ['s3'],
      chips: [{ label: 'two of three', value: 'enough? decide first', tone: 'warn' }],
    },
    when: {
      visible: [...scatter, ...gather],
      chips: [{ label: 'use', value: 'best of independent answers' }, { label: 'skip', value: 'one source is enough' }],
    },
    recap: {
      visible: [...scatter, ...gather],
      chips: [{ label: 'ask', value: 'all at once' }, { label: 'decide', value: 'by deadline' }],
    },
  },
  legend: [{ tone: 'info', label: 'request' }, { tone: 'ok', label: 'quote' }],
};
