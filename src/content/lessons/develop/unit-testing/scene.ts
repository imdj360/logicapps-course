import type { Scene } from '../../../../lessons/scene-types';

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'def', kind: 'storage', label: 'Definition', sublabel: 'workflow.json', x: 110, y: 110 },
    { id: 'run', kind: 'storage', label: 'Run history', sublabel: 'local run', x: 110, y: 370 },
    { id: 'gen', kind: 'action', label: 'Create unit test', sublabel: 'VS Code', x: 380, y: 240 },
    { id: 'outputs', kind: 'storage', label: 'MockOutputs', sublabel: 'typed classes', x: 680, y: 100 },
    { id: 'cls', kind: 'action', label: 'Test class', sublabel: 'TestExecutor', x: 680, y: 240 },
    { id: 'mock', kind: 'storage', label: 'Mock JSON', sublabel: '*-mock.json', x: 680, y: 380 },
    { id: 'q', kind: 'servicebus', label: 'Orders queue', sublabel: 'real messages', x: 110, y: 240 },
    { id: 'wf', kind: 'trigger', label: 'Order intake', sublabel: 'workflow', x: 380, y: 240 },
    { id: 'api', kind: 'connector-managed', label: 'Pricing API', sublabel: 'real calls', x: 680, y: 240 },
    { id: 'ext', kind: 'connector-managed', label: 'External APIs', sublabel: 'not called', x: 380, y: 430 },
  ],
  edges: [
    { id: 'def-gen', from: 'def', to: 'gen' },
    { id: 'run-gen', from: 'run', to: 'gen' },
    { id: 'gen-outputs', from: 'gen', to: 'outputs' },
    { id: 'gen-cls', from: 'gen', to: 'cls' },
    { id: 'gen-mock', from: 'gen', to: 'mock' },
    { id: 'cls-ext', from: 'cls', to: 'ext', style: 'dashed' },
    { id: 'q-wf', from: 'q', to: 'wf' },
    { id: 'wf-api', from: 'wf', to: 'api' },
  ],
  steps: {
    problem: {
      visible: ['q', 'wf', 'api', 'q-wf', 'wf-api'],
      highlight: ['q', 'api'],
      tokens: [{ id: 'u1', edge: 'q-wf', tone: 'info' }, { id: 'u2', edge: 'wf-api', tone: 'info' }],
      chips: [{ label: 'to test a change', value: 'real queue, real API', tone: 'warn' }, { label: 'today', value: 'run it and hope', tone: 'warn' }],
    },
    offline: {
      visible: ['cls', 'ext', 'cls-ext'],
      highlight: ['ext'],
      failed: ['cls-ext'],
      chips: [{ label: 'external calls', value: 'mocked', tone: 'ok' }, { label: 'workflow logic', value: 'unchanged' }],
    },
    'two-ways': {
      visible: ['def', 'run', 'gen', 'def-gen', 'run-gen'],
      highlight: ['def', 'run'],
      chips: [{ label: 'start from', value: 'definition or run' }],
    },
    'from-def': {
      visible: ['def', 'gen', 'def-gen'],
      highlight: ['def', 'gen'],
      tokens: [{ id: 't1', edge: 'def-gen', tone: 'info' }],
      chips: [{ label: 'designer', value: 'Create unit test' }],
    },
    'from-run': {
      visible: ['run', 'gen', 'run-gen'],
      highlight: ['run', 'gen'],
      tokens: [{ id: 't1', edge: 'run-gen', tone: 'info' }],
      chips: [{ label: 'run history', value: 'Create unit test from run' }],
    },
    generated: {
      visible: ['gen', 'outputs', 'cls', 'mock', 'gen-outputs', 'gen-cls', 'gen-mock'],
      highlight: ['outputs', 'cls', 'mock'],
      tokens: [{ id: 't1', edge: 'gen-outputs', tone: 'ok' }, { id: 't2', edge: 'gen-cls', tone: 'ok' }, { id: 't3', edge: 'gen-mock', tone: 'ok' }],
      chips: [{ label: 'folder', value: 'Tests' }, { label: '*-mock.json', value: 'run-based only' }],
    },
    'test-class': {
      visible: ['cls', 'outputs', 'mock', 'gen', 'gen-cls', 'gen-outputs', 'gen-mock'],
      highlight: ['cls'],
      chips: [{ label: 'Setup()', value: 'new TestExecutor' }, { label: 'config', value: 'testSettings.config' }],
    },
    'run-it': {
      visible: ['cls', 'ext', 'cls-ext'],
      highlight: ['cls'],
      chips: [{ label: 'Microsoft Learn docs on running tests', value: 'silent', tone: 'warn' }],
    },
    limits: {
      visible: ['def', 'run', 'gen', 'cls', 'def-gen', 'run-gen', 'gen-cls'],
      highlight: ['cls'],
      chips: [{ label: 'language', value: 'C# only' }, { label: 'unmocked actions', value: 'not supported', tone: 'warn' }],
    },
    recap: {
      visible: ['def', 'run', 'gen', 'outputs', 'cls', 'mock', 'def-gen', 'run-gen', 'gen-outputs', 'gen-cls', 'gen-mock'],
      chips: [{ label: 'result', value: 'tests without external calls', tone: 'ok' }],
    },
  },
  legend: [{ tone: 'info', label: 'create' }, { tone: 'ok', label: 'generated' }],
};
