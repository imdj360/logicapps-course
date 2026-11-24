import type { Scene } from '../../../../lessons/scene-types';

export const scene: Scene = {
  viewBox: [900, 400],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Recurrence', sublabel: 'every 5 min', x: 160, y: 200 },
    { id: 'call', kind: 'connector-managed', label: 'Call API', x: 450, y: 200 },
    { id: 'alert', kind: 'appinsights', label: 'Alert rule', x: 740, y: 200 },
  ],
  edges: [
    { id: 'trigger-call', from: 'trigger', to: 'call' },
    { id: 'call-alert', from: 'call', to: 'alert', style: 'dashed' },
  ],
  steps: {
    problem: { visible: ['trigger', 'call', 'trigger-call'], failed: ['call'], tokens: [{ id: 'm', edge: 'trigger-call', tone: 'fail' }], chips: [{ label: 'run status', value: 'Failed', tone: 'fail' }] },
    fix: { visible: ['trigger', 'call', 'alert', 'trigger-call', 'call-alert'], failed: ['call'], highlight: ['alert', 'call-alert'], tokens: [{ id: 'a', edge: 'call-alert', tone: 'info' }], chips: [{ label: 'run status', value: 'Failed', tone: 'fail' }, { label: 'alert', value: 'Fired', tone: 'ok' }] },
    recap: { visible: ['trigger', 'call', 'alert', 'trigger-call', 'call-alert'], chips: [{ label: 'alerting', value: 'On', tone: 'ok' }] },
  },
  legend: [{ tone: 'fail', label: 'failed message' }, { tone: 'info', label: 'alert signal' }],
};
