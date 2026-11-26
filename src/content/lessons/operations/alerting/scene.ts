import type { Scene } from '../../../../lessons/scene-types';

const core = ['app', 'metrics', 'rule', 'team', 'app-metrics', 'metrics-rule', 'rule-team'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'Standard', x: 110, y: 240 },
    { id: 'metrics', kind: 'appinsights', label: 'Workflow metrics', sublabel: 'failure rate', x: 360, y: 240 },
    { id: 'rule', kind: 'condition', label: 'Alert rule', sublabel: 'every 5 min', x: 610, y: 240 },
    { id: 'team', kind: 'human', label: 'Ops team', sublabel: 'action group', x: 820, y: 240 },
    { id: 'logs', kind: 'appinsights', label: 'Log query', sublabel: 'log alert', x: 360, y: 410 },
    { id: 'catch', kind: 'scope', label: 'Catch scope', sublabel: 'email per run', x: 610, y: 80 },
    { id: 'probe', kind: 'trigger', label: 'Health Check', sublabel: 'ping per min', x: 110, y: 80 },
  ],
  edges: [
    { id: 'app-metrics', from: 'app', to: 'metrics' },
    { id: 'metrics-rule', from: 'metrics', to: 'rule' },
    { id: 'rule-team', from: 'rule', to: 'team' },
    { id: 'app-logs', from: 'app', to: 'logs', style: 'dashed' },
    { id: 'logs-rule', from: 'logs', to: 'rule', style: 'dashed' },
    { id: 'app-catch', from: 'app', to: 'catch' },
    { id: 'catch-team', from: 'catch', to: 'team' },
    { id: 'probe-app', from: 'probe', to: 'app', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['app', 'team'],
      failed: ['app'],
      chips: [{ label: 'failing since', value: 'Saturday', tone: 'fail' }, { label: 'noticed', value: 'Monday', tone: 'warn' }],
    },
    levels: {
      visible: [...core, 'catch', 'app-catch', 'catch-team'],
      highlight: ['catch', 'rule'],
      tokens: [{ id: 'v1', edge: 'app-catch', tone: 'fail' }, { id: 'v2', edge: 'catch-team', tone: 'fail' }],
      chips: [{ label: 'level 1', value: 'catch scope email' }, { label: 'level 2', value: 'Azure Monitor alert', tone: 'ok' }],
    },
    metrics: {
      visible: ['app', 'metrics', 'app-metrics'],
      highlight: ['metrics'],
      tokens: [{ id: 'm1', edge: 'app-metrics', tone: 'info' }],
      chips: [{ label: 'namespace', value: 'App Service standard metrics' }, { label: 'filter', value: 'Workflow Name · Status' }],
    },
    rule: {
      visible: [...core],
      highlight: ['rule', 'rule-team'],
      tokens: [{ id: 'r1', edge: 'metrics-rule', tone: 'info' }, { id: 'r2', edge: 'rule-team', tone: 'fail' }],
      chips: [{ label: 'example check', value: 'every 5 min' }, { label: 'look back', value: '15 min' }],
    },
    delay: {
      visible: [...core],
      highlight: ['metrics'],
      chips: [{ label: 'metric', value: 'Job Execution Delay' }, { label: 'catches', value: 'slow, not failing', tone: 'warn' }],
    },
    logalerts: {
      visible: [...core, 'logs', 'app-logs', 'logs-rule'],
      highlight: ['logs', 'logs-rule'],
      tokens: [{ id: 'l1', edge: 'logs-rule', tone: 'info' }],
      chips: [{ label: 'log alert', value: 'query on a schedule' }],
    },
    health: {
      visible: [...core, 'probe', 'probe-app'],
      highlight: ['probe', 'probe-app'],
      tokens: [{ id: 'h1', edge: 'probe-app', tone: 'info' }],
      chips: [{ label: 'healthy', value: '200–299' }, { label: 'removed after', value: '10 failed pings' }, { label: 'needs', value: '2+ instances', tone: 'warn' }],
    },
    noise: {
      visible: [...core],
      chips: [{ label: 'alert on', value: 'rates, key workflows' }],
    },
    recap: {
      visible: [...core, 'logs', 'probe', 'app-logs', 'logs-rule', 'probe-app'],
      chips: [{ label: 'know', value: 'before customers do' }],
    },
  },
  legend: [
    { tone: 'info', label: 'signal' },
    { tone: 'fail', label: 'alert fired' },
  ],
};
