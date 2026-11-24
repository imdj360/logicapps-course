import type { Scene } from '../../../../lessons/scene-types';

const core = ['dev', 'proj', 'dev-proj'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'dev', kind: 'user', label: 'Developer', sublabel: 'you', x: 110, y: 250 },
    { id: 'proj', kind: 'storage', label: 'Project', sublabel: 'workflow.json', x: 340, y: 250 },
    { id: 'host', kind: 'hosting-plan', label: 'Local runtime', sublabel: 'F5 · 7071', x: 600, y: 120 },
    { id: 'local', kind: 'keyvault', label: 'local.settings', sublabel: 'stays local', x: 340, y: 420 },
    { id: 'azure', kind: 'hosting-plan', label: 'Standard app', sublabel: 'in Azure', x: 700, y: 360 },
    { id: 'caller', kind: 'trigger', label: 'Order request', sublabel: 'HTTP call', x: 110, y: 90 },
  ],
  edges: [
    { id: 'dev-proj', from: 'dev', to: 'proj' },
    { id: 'proj-host', from: 'proj', to: 'host' },
    { id: 'caller-host', from: 'caller', to: 'host' },
    { id: 'local-proj', from: 'local', to: 'proj', style: 'dashed' },
    { id: 'proj-azure', from: 'proj', to: 'azure' },
    { id: 'dev-azure', from: 'dev', to: 'azure', style: 'dashed', label: 'portal, live' },
  ],
  steps: {
    problem: {
      visible: ['dev', 'azure', 'dev-azure'],
      failed: ['azure'],
      tokens: [{ id: 'pr1', edge: 'dev-azure', tone: 'fail' }],
      chips: [{ label: 'today', value: 'edit live in portal', tone: 'warn' }],
    },
    tools: {
      visible: core,
      highlight: ['dev'],
      chips: [{ label: 'extension installs', value: 'Core Tools · .NET · Node.js' }],
    },
    project: {
      visible: core,
      highlight: ['proj'],
      chips: [{ label: 'template', value: 'Logic app' }, { label: 'first workflow', value: 'stateful or stateless' }],
    },
    layout: {
      visible: [...core, 'local', 'local-proj'],
      highlight: ['proj'],
      chips: [{ label: 'per workflow', value: 'workflow.json' }, { label: 'root', value: 'connections · host · parameters' }],
    },
    'local-settings': {
      visible: [...core, 'local', 'local-proj'],
      highlight: ['local'],
      chips: [{ label: 'deployment', value: 'file ignored', tone: 'warn' }, { label: 'source control', value: 'exclude it' }],
    },
    run: {
      visible: [...core, 'host', 'caller', 'proj-host', 'caller-host'],
      highlight: ['host'],
      tokens: [{ id: 'q1', edge: 'caller-host', tone: 'info' }],
      chips: [{ label: 'start', value: 'F5' }, { label: 'URL', value: 'localhost:7071' }],
    },
    history: {
      visible: [...core, 'host', 'caller', 'proj-host', 'caller-host'],
      highlight: ['host'],
      chips: [{ label: 'Overview', value: 'Run history' }, { label: 'app stopped', value: 'no history', tone: 'warn' }],
    },
    deploy: {
      visible: [...core, 'azure', 'proj-azure'],
      highlight: ['azure', 'proj-azure'],
      tokens: [{ id: 'd1', edge: 'proj-azure', tone: 'ok' }],
      chips: [{ label: 'command', value: 'Deploy to logic app' }, { label: 'existing app', value: 'overwritten', tone: 'warn' }],
    },
    recap: {
      visible: ['dev', 'proj', 'host', 'local', 'azure', 'caller', 'dev-proj', 'proj-host', 'caller-host', 'local-proj', 'proj-azure'],
      chips: [{ label: 'build and test', value: 'locally first' }],
    },
  },
  legend: [{ tone: 'info', label: 'test request' }, { tone: 'ok', label: 'deploy' }],
};
