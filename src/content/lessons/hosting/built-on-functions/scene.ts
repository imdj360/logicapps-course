import type { Scene } from '../../../../lessons/scene-types';

const stack = ['wf', 'func', 'wf-func'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'dev', kind: 'human', label: 'Developer', sublabel: 'VS Code', x: 110, y: 90 },
    { id: 'core', kind: 'hosting-plan', label: 'Core Tools', sublabel: 'local run', x: 110, y: 400 },
    { id: 'hostjson', kind: 'storage', label: 'host.json', sublabel: 'host settings', x: 280, y: 240 },
    { id: 'bundle', kind: 'action', label: 'Ext. bundle', sublabel: 'Workflows', x: 450, y: 90 },
    { id: 'wf', kind: 'hosting-plan', label: 'Workflow runtime', sublabel: 'extension', x: 450, y: 240 },
    { id: 'func', kind: 'hosting-plan', label: 'Functions host', sublabel: 'runtime', x: 450, y: 400 },
    { id: 'builtin', kind: 'connector-builtin', label: 'Built-in', sublabel: 'in-process', x: 770, y: 110 },
    { id: 'custom', kind: 'connector-builtin', label: 'Custom built-in', sublabel: 'your .NET code', x: 770, y: 260 },
    { id: 'managed', kind: 'connector-managed', label: 'Managed', sublabel: 'runs in Azure', x: 770, y: 410 },
  ],
  edges: [
    { id: 'dev-core', from: 'dev', to: 'core' },
    { id: 'core-func', from: 'core', to: 'func' },
    { id: 'hostjson-wf', from: 'hostjson', to: 'wf', style: 'dashed' },
    { id: 'bundle-wf', from: 'bundle', to: 'wf' },
    { id: 'wf-func', from: 'wf', to: 'func' },
    { id: 'wf-builtin', from: 'wf', to: 'builtin' },
    { id: 'wf-custom', from: 'wf', to: 'custom' },
    { id: 'wf-managed', from: 'wf', to: 'managed', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['dev', 'core', 'hostjson', 'dev-core'],
      highlight: ['hostjson', 'core'],
      chips: [{ label: 'project', value: 'looks like a function app' }],
    },
    runtime: {
      visible: [...stack],
      highlight: ['wf', 'func', 'wf-func'],
      tokens: [{ id: 'r1', edge: 'wf-func', tone: 'info' }],
      chips: [{ label: 'runtime', value: 'Functions extension' }, { label: 'one app', value: 'many workflows' }],
    },
    project: {
      visible: [...stack, 'dev', 'hostjson', 'hostjson-wf'],
      highlight: ['hostjson', 'dev'],
      chips: [{ label: 'per workflow', value: 'workflow.json' }, { label: 'shared', value: 'connections.json · host.json' }, { label: 'local only', value: 'local.settings.json', tone: 'warn' }],
    },
    settings: {
      visible: [...stack, 'hostjson', 'hostjson-wf'],
      highlight: ['hostjson', 'hostjson-wf'],
      tokens: [{ id: 's1', edge: 'hostjson-wf', tone: 'info' }],
      chips: [{ label: 'app settings', value: 'environment variables' }, { label: 'host settings', value: 'host.json, everywhere' }],
    },
    bundle: {
      visible: [...stack, 'bundle', 'bundle-wf'],
      highlight: ['bundle', 'bundle-wf'],
      tokens: [{ id: 'b1', edge: 'bundle-wf', tone: 'info' }],
      chips: [{ label: 'bundle', value: 'ExtensionBundle.Workflows' }, { label: 'missing actions?', value: 'clear the cache', tone: 'warn' }],
    },
    local: {
      visible: [...stack, 'dev', 'core', 'dev-core', 'core-func'],
      highlight: ['dev', 'core', 'dev-core', 'core-func'],
      tokens: [{ id: 'l1', edge: 'dev-core', tone: 'ok' }, { id: 'l2', edge: 'core-func', tone: 'ok' }],
      chips: [{ label: 'run', value: 'F5' }, { label: 'breakpoints', value: 'actions only' }],
    },
    builtin: {
      visible: [...stack, 'builtin', 'managed', 'wf-builtin', 'wf-managed'],
      highlight: ['builtin', 'wf-builtin'],
      tokens: [{ id: 'c1', edge: 'wf-builtin', tone: 'ok' }, { id: 'c2', edge: 'wf-managed', tone: 'info' }],
      chips: [{ label: 'built-in', value: 'in-process', tone: 'ok' }, { label: 'managed', value: 'in Azure, per call' }],
    },
    custom: {
      visible: [...stack, 'builtin', 'custom', 'managed', 'wf-builtin', 'wf-custom', 'wf-managed'],
      highlight: ['custom', 'wf-custom'],
      tokens: [{ id: 'x1', edge: 'wf-custom', tone: 'ok' }],
      chips: [{ label: 'custom built-in', value: '.NET, NuGet project' }, { label: 'custom managed', value: 'not supported', tone: 'warn' }],
    },
    code: {
      visible: [...stack, 'builtin', 'wf-builtin'],
      highlight: ['wf'],
      chips: [{ label: 'Inline Code', value: 'C# script · PowerShell' }, { label: 'also', value: '.NET functions' }],
    },
    recap: {
      visible: [...stack, 'dev', 'core', 'hostjson', 'bundle', 'builtin', 'custom', 'managed', 'dev-core', 'core-func', 'hostjson-wf', 'bundle-wf', 'wf-builtin', 'wf-custom', 'wf-managed'],
      chips: [{ label: 'runtime', value: 'Functions extension' }, { label: 'extend', value: '.NET' }],
    },
  },
  legend: [
    { tone: 'info', label: 'configuration / calls' },
    { tone: 'ok', label: 'runs in-process' },
  ],
};
