import type { Scene } from '../../../../lessons/scene-types';

const scatter = ['req', 's1', 's2', 's3', 'req-s1', 'req-s2', 'req-s3'];
const gather = ['join', 's1-join', 's2-join', 's3-join'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'req', kind: 'trigger', label: 'Quote request', sublabel: 'large order', x: 110, y: 240 },
    { id: 's1', kind: 'user', label: 'Supplier A', sublabel: '2 s', x: 420, y: 90 },
    { id: 's2', kind: 'user', label: 'Supplier B', sublabel: '5 s', x: 420, y: 240 },
    { id: 's3', kind: 'user', label: 'Supplier C', sublabel: 'no answer', x: 420, y: 390 },
    { id: 'join', kind: 'action', label: 'Pick best', sublabel: 'gather', x: 740, y: 240 },
  ],
  edges: [
    { id: 'req-s1', from: 'req', to: 's1' },
    { id: 'req-s2', from: 'req', to: 's2' },
    { id: 'req-s3', from: 'req', to: 's3' },
    { id: 's1-join', from: 's1', to: 'join' },
    { id: 's2-join', from: 's2', to: 'join' },
    { id: 's3-join', from: 's3', to: 'join', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...scatter],
      chips: [{ label: 'want', value: 'best of 3 quotes' }, { label: 'one by one', value: 'too slow', tone: 'warn' }],
    },
    honest: {
      visible: [...scatter, ...gather],
      chips: [{ label: 'Arch. Center page', value: 'none (404)', tone: 'warn' }, { label: 'so', value: 'built from parts' }],
    },
    branches: {
      visible: [...scatter, ...gather],
      tokens: [{ id: 'b1', edge: 'req-s1', tone: 'info' }, { id: 'b2', edge: 'req-s2', tone: 'info' }, { id: 'b3', edge: 'req-s3', tone: 'info' }],
      chips: [{ label: 'scatter', value: 'parallel branches' }, { label: 'join run after', value: '+ failed · timed out' }],
    },
    deadline: {
      visible: [...scatter, ...gather],
      failed: ['s3'],
      tokens: [{ id: 'd1', edge: 's1-join', tone: 'ok' }, { id: 'd2', edge: 's2-join', tone: 'ok' }],
      chips: [{ label: 'Supplier C', value: 'timed out', tone: 'warn' }, { label: 'join uses', value: 'A and B' }],
    },
    topics: {
      visible: [...scatter, ...gather],
      highlight: ['req'],
      chips: [{ label: 'scatter', value: 'topic, one sub each' }, { label: 'replies', value: 'CorrelationId' }],
    },
    gather: {
      visible: [...scatter, ...gather],
      highlight: ['join'],
      chips: [{ label: 'collect', value: 'Until all or deadline' }, { label: 'Until default', value: '1 hour' }],
    },
    choose: {
      visible: [...scatter, ...gather],
      chips: [{ label: 'known fast APIs', value: 'branches' }, { label: 'slow or changing', value: 'topic' }],
    },
    recap: {
      visible: [...scatter, ...gather],
      chips: [{ label: 'ask', value: 'all at once' }, { label: 'decide', value: 'by deadline' }],
    },
  },
  legend: [{ tone: 'info', label: 'request' }, { tone: 'ok', label: 'quote' }],
};
