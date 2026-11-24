import type { Scene } from '../../../../lessons/scene-types';

const core = ['wf', 'breaker', 'api', 'wf-breaker', 'breaker-api'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'wf', kind: 'trigger', label: 'Order runs', sublabel: 'many', x: 120, y: 240 },
    { id: 'breaker', kind: 'condition', label: 'Breaker', sublabel: 'closed', x: 420, y: 240 },
    { id: 'api', kind: 'user', label: 'Partner API', sublabel: 'down 2 h', x: 740, y: 240 },
    { id: 'state', kind: 'storage', label: 'Breaker state', sublabel: 'table', x: 420, y: 80 },
    { id: 'park', kind: 'servicebus', label: 'Parked work', sublabel: 'retry later', x: 420, y: 410 },
  ],
  edges: [
    { id: 'wf-breaker', from: 'wf', to: 'breaker' },
    { id: 'breaker-api', from: 'breaker', to: 'api' },
    { id: 'state-breaker', from: 'state', to: 'breaker', style: 'dashed' },
    { id: 'breaker-park', from: 'breaker', to: 'park', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['wf', 'api'],
      failed: ['api'],
      chips: [{ label: 'every run', value: 'retries 4 times', tone: 'warn' }],
    },
    pattern: {
      visible: [...core],
      highlight: ['breaker'],
      chips: [{ label: 'breaker', value: 'decides: call or not' }],
    },
    states: {
      visible: [...core],
      failed: ['api'],
      highlight: ['breaker'],
      chips: [{ label: 'Closed', value: 'count failures' }, { label: 'Open', value: 'fail fast', tone: 'warn' }, { label: 'Half-Open', value: 'test a few' }],
    },
    retry: {
      visible: [...core],
      chips: [{ label: 'retry', value: 'will succeed soon' }, { label: 'breaker', value: 'likely to fail' }],
    },
    logicapps: {
      visible: [...core, 'state', 'park', 'state-breaker', 'breaker-park'],
      highlight: ['state', 'breaker-park'],
      tokens: [{ id: 'l1', edge: 'state-breaker', tone: 'info' }, { id: 'l2', edge: 'breaker-park', tone: 'ok' }],
      chips: [{ label: 'our design', value: 'shared state, checked first' }],
    },
    notneeded: {
      visible: [...core, 'park', 'breaker-park'],
      chips: [{ label: 'behind a queue', value: 'might not be suitable' }],
    },
    fallback: {
      visible: [...core],
      chips: [{ label: 'open state', value: 'useful default' }, { label: 'operators', value: 'manual reset' }],
    },
    recap: {
      visible: [...core, 'state', 'park', 'state-breaker', 'breaker-park'],
      chips: [{ label: 'stop', value: 'hammering a down service' }],
    },
  },
  legend: [{ tone: 'info', label: 'state check' }, { tone: 'ok', label: 'parked' }],
};
