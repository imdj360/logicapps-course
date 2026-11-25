import type { Scene } from '../../../../lessons/scene-types';

// One run with the four timeout levels on it: request (call → API), action (Confirm order), loop (Until), run (the frame).
const core = ['runBox', 'trigger', 'call', 'api', 'trig-call', 'call-api'];
const loop = ['until', 'call-until'];
const handle = ['catch', 'alert', 'call-catch', 'catch-alert'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'runBox', label: 'One run · up to 90 days', x: 40, y: 40, w: 820, h: 290 },
  ],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 150, y: 115 },
    { id: 'call', kind: 'connector-builtin', label: 'Confirm order', sublabel: 'HTTP · timeout', x: 400, y: 115 },
    { id: 'until', kind: 'scope', label: 'Until confirmed', sublabel: 'loop · 1 h', x: 680, y: 115 },
    { id: 'catch', kind: 'scope', label: 'Catch', sublabel: 'Has timed out', x: 400, y: 255 },
    { id: 'alert', kind: 'action', label: 'Alert team', x: 680, y: 255 },
    { id: 'api', kind: 'user', label: 'Partner API', sublabel: 'never finishes', x: 150, y: 430 },
  ],
  edges: [
    { id: 'trig-call', from: 'trigger', to: 'call' },
    { id: 'call-api', from: 'call', to: 'api' },
    { id: 'call-until', from: 'call', to: 'until' },
    { id: 'call-catch', from: 'call', to: 'catch', style: 'dashed', label: 'timed out' },
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
      visible: [...core, ...loop],
      highlight: ['call-api', 'call', 'until', 'runBox'],
      chips: [{ label: 'levels', value: 'request · action · loop · run' }],
    },
    http: {
      visible: [...core, ...loop],
      highlight: ['call-api'],
      tokens: [{ id: 'h1', edge: 'call-api', tone: 'fail' }],
      chips: [{ label: 'Standard', value: '225 s (also max)' }, { label: 'Consumption', value: '120 s' }, { label: 'no answer', value: 'action fails', tone: 'fail' }],
    },
    action: {
      visible: [...core, ...loop],
      highlight: ['call'],
      chips: [{ label: 'setting', value: 'limit.timeout' }, { label: 'when it lapses', value: 'Cancelled · ActionTimedOut', tone: 'warn' }],
    },
    until: {
      visible: [...core, ...loop],
      highlight: ['until'],
      tokens: [{ id: 'u1', edge: 'call-until', tone: 'info' }],
      chips: [{ label: 'stateful', value: '1 hour' }, { label: 'stateless', value: '5 min' }, { label: 'checked', value: 'per cycle' }],
    },
    run: {
      visible: [...core, ...loop],
      highlight: ['runBox'],
      chips: [{ label: 'stateful run', value: '90 days default' }, { label: 'stateless run', value: '5 min' }, { label: 'keep ≤', value: 'retention', tone: 'warn' }],
    },
    catch: {
      visible: [...core, ...loop, ...handle],
      highlight: ['catch', 'call-catch'],
      failed: ['call'],
      tokens: [{ id: 'c1', edge: 'call-catch', tone: 'fail' }, { id: 'c2', edge: 'catch-alert', tone: 'info' }],
      chips: [{ label: 'run after', value: 'Has timed out', tone: 'ok' }],
    },
    deliberate: {
      visible: [...core, ...loop, ...handle],
      highlight: ['call'],
      chips: [{ label: 'timeout', value: 'from the business' }],
    },
    recap: {
      visible: [...core, ...loop, ...handle],
      chips: [{ label: 'give up', value: 'on purpose' }],
    },
  },
  legend: [
    { tone: 'info', label: 'waiting' },
    { tone: 'fail', label: 'timed out' },
  ],
};
