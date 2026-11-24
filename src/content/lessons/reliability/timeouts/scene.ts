import type { Scene } from '../../../../lessons/scene-types';

const core = ['trigger', 'call', 'api', 'trig-call', 'call-api'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 110, y: 240 },
    { id: 'call', kind: 'connector-builtin', label: 'Confirm order', sublabel: 'HTTP · async', x: 380, y: 240 },
    { id: 'api', kind: 'user', label: 'Partner API', sublabel: 'never finishes', x: 650, y: 240 },
    { id: 'until', kind: 'scope', label: 'Until confirmed', sublabel: 'loop', x: 380, y: 90 },
    { id: 'catch', kind: 'scope', label: 'Catch', sublabel: 'Has timed out', x: 380, y: 410 },
    { id: 'alert', kind: 'action', label: 'Alert team', x: 650, y: 410 },
  ],
  edges: [
    { id: 'trig-call', from: 'trigger', to: 'call' },
    { id: 'call-api', from: 'call', to: 'api' },
    { id: 'trig-until', from: 'trigger', to: 'until', style: 'dashed' },
    { id: 'call-catch', from: 'call', to: 'catch', style: 'dashed' },
    { id: 'catch-alert', from: 'catch', to: 'alert' },
  ],
  steps: {
    problem: {
      visible: [...core],
      highlight: ['api'],
      tokens: [{ id: 'p1', edge: 'call-api', tone: 'info' }],
      chips: [{ label: 'run', value: 'Running for days', tone: 'warn' }, { label: 'failed', value: 'nothing' }],
    },
    levels: {
      visible: [...core, 'until', 'trig-until'],
      chips: [{ label: 'levels', value: 'request · action · loop · run' }],
    },
    http: {
      visible: [...core],
      highlight: ['call-api'],
      tokens: [{ id: 'h1', edge: 'call-api', tone: 'fail' }],
      chips: [{ label: 'Standard', value: '225 s (also max)' }, { label: 'Consumption', value: '120 s' }, { label: 'no answer', value: 'action fails', tone: 'fail' }],
    },
    action: {
      visible: [...core],
      highlight: ['call'],
      chips: [{ label: 'setting', value: 'limit.timeout' }, { label: 'when it lapses', value: 'Cancelled · ActionTimedOut', tone: 'warn' }],
    },
    until: {
      visible: [...core, 'until', 'trig-until'],
      highlight: ['until'],
      chips: [{ label: 'stateful', value: '1 hour' }, { label: 'stateless', value: '5 min' }, { label: 'checked', value: 'per cycle' }],
    },
    run: {
      visible: [...core],
      chips: [{ label: 'stateful run', value: '90 days default' }, { label: 'stateless run', value: '5 min' }, { label: 'keep ≤', value: 'retention', tone: 'warn' }],
    },
    catch: {
      visible: [...core, 'catch', 'alert', 'call-catch', 'catch-alert'],
      highlight: ['catch', 'call-catch'],
      tokens: [{ id: 'c1', edge: 'call-catch', tone: 'fail' }, { id: 'c2', edge: 'catch-alert', tone: 'info' }],
      chips: [{ label: 'run after', value: 'Has timed out', tone: 'ok' }],
    },
    deliberate: {
      visible: [...core, 'catch', 'alert', 'call-catch', 'catch-alert'],
      highlight: ['call'],
      chips: [{ label: 'timeout', value: 'from the business' }],
    },
    recap: {
      visible: [...core, 'until', 'catch', 'alert', 'trig-until', 'call-catch', 'catch-alert'],
      chips: [{ label: 'give up', value: 'on purpose' }],
    },
  },
  legend: [
    { tone: 'info', label: 'waiting' },
    { tone: 'fail', label: 'timed out' },
  ],
};
