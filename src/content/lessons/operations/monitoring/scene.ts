import type { Scene } from '../../../../lessons/scene-types';

const core = ['app', 'history', 'app-history'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'Standard', x: 110, y: 240 },
    { id: 'history', kind: 'storage', label: 'Run history', sublabel: 'one run', x: 400, y: 90 },
    { id: 'ai', kind: 'appinsights', label: 'App Insights', sublabel: 'requests', x: 400, y: 240 },
    { id: 'la', kind: 'appinsights', label: 'Log Analytics', sublabel: 'WorkflowRuntime', x: 400, y: 410 },
    { id: 'you', kind: 'human', label: 'You', sublabel: 'KQL', x: 720, y: 330 },
  ],
  edges: [
    { id: 'app-history', from: 'app', to: 'history' },
    { id: 'app-ai', from: 'app', to: 'ai' },
    { id: 'app-la', from: 'app', to: 'la', style: 'dashed' },
    { id: 'ai-you', from: 'ai', to: 'you' },
    { id: 'la-you', from: 'la', to: 'you' },
  ],
  steps: {
    problem: {
      visible: [...core],
      chips: [{ label: 'question', value: 'slow last Tuesday?' }, { label: 'and', value: 'where is order 4711?' }],
    },
    runhistory: {
      visible: [...core],
      highlight: ['history', 'app-history'],
      tokens: [{ id: 'r1', edge: 'app-history', tone: 'info' }],
      chips: [{ label: 'shows', value: 'one run, step by step' }, { label: 'kept', value: '90 days' }],
    },
    appinsights: {
      visible: [...core, 'ai', 'app-ai'],
      highlight: ['ai', 'app-ai'],
      tokens: [{ id: 'a1', edge: 'app-ai', tone: 'info' }],
      chips: [{ label: 'host.json', value: 'TelemetryVersion v2' }, { label: 'runtime', value: 'Functions v4' }],
    },
    tables: {
      visible: [...core, 'ai', 'you', 'app-ai', 'ai-you'],
      highlight: ['ai', 'ai-you'],
      tokens: [{ id: 't1', edge: 'ai-you', tone: 'ok' }],
      chips: [{ label: 'requests', value: 'triggers · actions' }, { label: 'traces', value: 'run start · end' }, { label: 'operation_Id', value: 'run ID' }],
    },
    verbosity: {
      visible: [...core, 'ai', 'app-ai'],
      highlight: ['app-ai'],
      chips: [{ label: 'default', value: 'Information' }, { label: 'errors only', value: 'logLevel: Error' }],
    },
    loganalytics: {
      visible: [...core, 'la', 'you', 'app-la', 'la-you'],
      highlight: ['la', 'app-la'],
      tokens: [{ id: 'l1', edge: 'app-la', tone: 'info' }, { id: 'l2', edge: 'la-you', tone: 'ok' }],
      chips: [{ label: 'category', value: 'Workflow Runtime Logs' }, { label: 'table', value: 'LogicAppWorkflowRuntime' }, { label: 'delay', value: 'up to 30 min', tone: 'warn' }],
    },
    tracking: {
      visible: [...core, 'ai', 'la', 'you', 'app-ai', 'app-la', 'ai-you', 'la-you'],
      highlight: ['you'],
      chips: [{ label: 'header', value: 'x-ms-client-tracking-id' }, { label: 'per action', value: 'tracked properties' }],
    },
    'find-queries': {
      visible: [...core, 'ai', 'you', 'app-ai', 'ai-you'],
      highlight: ['you', 'ai-you'],
      tokens: [{ id: 'q1', edge: 'ai-you', tone: 'ok' }],
      chips: [{ label: 'order 4711', value: 'clientTrackingId' }, { label: 'customer', value: 'trackedProperties' }, { label: 'one run', value: 'operation_Id' }],
    },
    'trouble-queries': {
      visible: [...core, 'ai', 'you', 'app-ai', 'ai-you'],
      highlight: ['ai', 'ai-you'],
      tokens: [{ id: 'q2', edge: 'ai-you', tone: 'ok' }],
      chips: [{ label: 'retries', value: 'retryHistory' }, { label: 'failures', value: 'success == false', tone: 'warn' }, { label: 'slow', value: 'p95 duration' }],
    },
    views: {
      visible: [...core, 'ai', 'app-ai'],
      highlight: ['ai'],
      chips: [{ label: 'live', value: 'Live metrics · Log stream' }, { label: 'map', value: 'Application map' }],
    },
    recap: {
      visible: [...core, 'ai', 'la', 'you', 'app-ai', 'app-la', 'ai-you', 'la-you'],
      chips: [{ label: 'one run', value: 'run history' }, { label: 'all runs', value: 'KQL' }],
    },
  },
  legend: [
    { tone: 'info', label: 'telemetry' },
    { tone: 'ok', label: 'query result' },
  ],
};
