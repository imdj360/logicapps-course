import type { Scene } from '../../../../lessons/scene-types';

const core = ['repo', 'pipe', 'test', 'prod', 'repo-pipe', 'pipe-test', 'pipe-prod'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'repo', kind: 'storage', label: 'Repository', sublabel: 'workflows', x: 110, y: 240 },
    { id: 'pipe', kind: 'condition', label: 'Pipeline', sublabel: 'build · zip', x: 360, y: 240 },
    { id: 'infra', kind: 'storage', label: 'Templates', sublabel: 'ARM · Bicep', x: 360, y: 80 },
    { id: 'test', kind: 'hosting-plan', label: 'Test', sublabel: 'parameters', x: 640, y: 140 },
    { id: 'prod', kind: 'hosting-plan', label: 'Production', sublabel: 'slot swap', x: 640, y: 340 },
    { id: 'conn', kind: 'keyvault', label: 'API connection', sublabel: 'access policy', x: 360, y: 420 },
  ],
  edges: [
    { id: 'repo-pipe', from: 'repo', to: 'pipe' },
    { id: 'pipe-test', from: 'pipe', to: 'test' },
    { id: 'pipe-prod', from: 'pipe', to: 'prod' },
    { id: 'infra-test', from: 'infra', to: 'test', style: 'dashed' },
    { id: 'infra-prod', from: 'infra', to: 'prod', style: 'dashed' },
    { id: 'conn-prod', from: 'conn', to: 'prod', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['test', 'prod'],
      chips: [{ label: 'today', value: 'copy and paste', tone: 'warn' }],
    },
    separate: {
      visible: [...core, 'infra', 'infra-test', 'infra-prod'],
      highlight: ['infra', 'pipe'],
      chips: [{ label: 'infrastructure', value: 'templates' }, { label: 'code', value: 'one zip' }],
    },
    infra: {
      visible: [...core, 'infra', 'infra-test', 'infra-prod'],
      highlight: ['infra'],
      chips: [{ label: 'resource', value: 'functionapp,workflowapp' }, { label: 'plan', value: 'Workflow Standard' }],
    },
    zip: {
      visible: [...core],
      highlight: ['pipe'],
      tokens: [{ id: 'z1', edge: 'repo-pipe', tone: 'info' }],
      chips: [{ label: 'zip root', value: 'workflows · host.json' }, { label: 'never', value: 'extra folders', tone: 'warn' }],
    },
    connections: {
      visible: [...core, 'conn', 'conn-prod'],
      highlight: ['conn', 'conn-prod'],
      chips: [{ label: 'raw keys', value: 'expire in 7 days', tone: 'warn' }, { label: 'Azure', value: 'managed identity' }],
    },
    config: {
      visible: [...core],
      highlight: ['test', 'prod'],
      chips: [{ label: 'per environment', value: 'app settings · parameters.json' }],
    },
    release: {
      visible: [...core],
      highlight: ['pipe-test', 'pipe-prod'],
      tokens: [{ id: 'r1', edge: 'pipe-test', tone: 'ok' }, { id: 'r2', edge: 'pipe-prod', tone: 'ok' }],
      chips: [{ label: 'tools', value: 'GitHub · Azure DevOps · CLI' }],
    },
    slots: {
      visible: [...core],
      highlight: ['prod'],
      chips: [{ label: 'swap', value: 'no downtime', tone: 'ok' }, { label: 'staging slot', value: 'read-only' }],
    },
    roles: {
      visible: [...core],
      chips: [{ label: 'roles', value: 'Reader · Operator · Developer · Contributor' }],
    },
    recap: {
      visible: [...core, 'infra', 'conn', 'infra-test', 'infra-prod', 'conn-prod'],
      chips: [{ label: 'same artifact', value: 'every environment' }],
    },
  },
  legend: [{ tone: 'info', label: 'build' }, { tone: 'ok', label: 'deploy' }],
};
