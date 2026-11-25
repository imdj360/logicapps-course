import type { Scene } from '../../../../lessons/scene-types';

const core = ['wfBox', 'trigger', 'call', 'api', 'next', 'trig-call', 'call-api', 'call-next'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'wfBox', label: 'Process order', x: 40, y: 175, w: 760, h: 135 },
  ],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', sublabel: 'trigger', x: 150, y: 245 },
    { id: 'call', kind: 'connector-builtin', label: 'Call partner', sublabel: 'HTTP · retries', x: 420, y: 245 },
    { id: 'api', kind: 'user', label: 'Partner API', sublabel: '503 · 429', x: 420, y: 420 },
    { id: 'next', kind: 'action', label: 'Save order', x: 690, y: 245 },
    { id: 'history', kind: 'storage', label: 'Run history', sublabel: 'with retries', x: 690, y: 80 },
  ],
  edges: [
    { id: 'trig-call', from: 'trigger', to: 'call' },
    { id: 'call-api', from: 'call', to: 'api' },
    { id: 'call-next', from: 'call', to: 'next' },
    { id: 'call-history', from: 'call', to: 'history', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core],
      failed: ['api'],
      tokens: [{ id: 'p1', edge: 'call-api', tone: 'fail' }],
      chips: [{ label: 'partner', value: '503 · 429', tone: 'fail' }, { label: 'a second later', value: 'works', tone: 'ok' }],
    },
    default: {
      visible: [...core],
      highlight: ['call', 'call-api'],
      tokens: [{ id: 'd1', edge: 'call-api', tone: 'fail' }, { id: 'd2', edge: 'call-api', tone: 'fail' }, { id: 'd3', edge: 'call-api', tone: 'ok' }],
      chips: [{ label: 'default', value: 'exponential, up to 4' }, { label: 'waits', value: '5–45 s' }, { label: 'retried on', value: 'timeout · 408 · 429 · 5xx' }],
    },
    types: {
      visible: [...core],
      highlight: ['call'],
      chips: [{ label: 'types', value: 'Default · None · Fixed · Exponential' }, { label: 'where', value: 'Settings > Networking' }],
    },
    fixed: {
      visible: [...core],
      highlight: ['call-api'],
      tokens: [{ id: 'f1', edge: 'call-api', tone: 'info' }, { id: 'f2', edge: 'call-api', tone: 'info' }],
      chips: [{ label: 'interval', value: 'PT30S' }, { label: 'count', value: '2' }],
    },
    exponential: {
      visible: [...core],
      highlight: ['call-api'],
      chips: [{ label: 'wait', value: 'random, growing' }, { label: 'max interval', value: '1 h (HTTP host)' }],
    },
    limits: {
      visible: [...core],
      highlight: ['call'],
      chips: [{ label: 'count', value: '1–90 (default 4)' }, { label: 'stateful interval', value: '5 s – 1 day' }, { label: 'stateless interval', value: '1 s – 1 min' }],
    },
    retryafter: {
      visible: [...core],
      highlight: ['api', 'call-api'],
      chips: [{ label: 'service says', value: 'Retry-After: 300' }, { label: 'works with', value: '429 · 202' }],
    },
    history: {
      visible: [...core, 'history', 'call-history'],
      highlight: ['history', 'call-history'],
      tokens: [{ id: 'h1', edge: 'call-history', tone: 'ok' }],
      chips: [{ label: 'status', value: 'Succeeded with retries', tone: 'ok' }],
    },
    none: {
      visible: [...core],
      highlight: ['call'],
      chips: [{ label: 'not safe to repeat', value: 'policy None', tone: 'warn' }],
    },
    recap: {
      visible: [...core, 'history', 'call-history'],
      chips: [{ label: 'retry', value: 'temporary failures' }, { label: 'skip retries', value: 'unsafe calls' }],
    },
  },
  legend: [
    { tone: 'info', label: 'attempt' },
    { tone: 'ok', label: 'success' },
    { tone: 'fail', label: 'temporary failure' },
  ],
};
