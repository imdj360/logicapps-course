import type { Scene } from '../../../../lessons/scene-types';

const homes = ['project', 'ws', 'ase', 'hyb', 'p-ws', 'p-ase', 'p-hyb'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'project', kind: 'action', label: 'Standard project', sublabel: 'build once', x: 450, y: 70 },
    { id: 'cons', kind: 'hosting-plan', label: 'Consumption', sublabel: 'multitenant', x: 790, y: 70 },
    { id: 'ws', kind: 'hosting-plan', label: 'Service Plan', sublabel: 'WS1–WS3', x: 200, y: 230 },
    { id: 'ase', kind: 'hosting-plan', label: 'ASE v3', sublabel: 'Isolated v2', x: 450, y: 230 },
    { id: 'hyb', kind: 'hosting-plan', label: 'Hybrid', sublabel: 'Arc Kubernetes', x: 700, y: 230 },
    { id: 'storage', kind: 'storage', label: 'Azure Storage', sublabel: 'state · history', x: 110, y: 410 },
    { id: 'func', kind: 'hosting-plan', label: 'Functions host', sublabel: 'runtime', x: 300, y: 410 },
    { id: 'vnet', kind: 'keyvault', label: 'Private VNet', sublabel: 'private access', x: 530, y: 410 },
    { id: 'sql', kind: 'storage', label: 'SQL Server', sublabel: 'state · history', x: 760, y: 410 },
  ],
  edges: [
    { id: 'p-ws', from: 'project', to: 'ws' },
    { id: 'p-ase', from: 'project', to: 'ase' },
    { id: 'p-hyb', from: 'project', to: 'hyb' },
    { id: 'ws-storage', from: 'ws', to: 'storage' },
    { id: 'ws-func', from: 'ws', to: 'func' },
    { id: 'ws-vnet', from: 'ws', to: 'vnet', style: 'dashed' },
    { id: 'ase-vnet', from: 'ase', to: 'vnet' },
    { id: 'hyb-sql', from: 'hyb', to: 'sql' },
  ],
  steps: {
    problem: {
      visible: [...homes],
      highlight: ['project'],
      tokens: [
        { id: 'd1', edge: 'p-ws', tone: 'info' },
        { id: 'd2', edge: 'p-ase', tone: 'info' },
        { id: 'd3', edge: 'p-hyb', tone: 'info' },
      ],
      chips: [{ label: 'finance', value: 'what will it cost?' }, { label: 'security', value: 'no public endpoints' }, { label: 'plant', value: 'on-premises' }],
    },
    standard: {
      visible: [...homes],
      highlight: ['project', 'p-ws', 'p-ase', 'p-hyb'],
      chips: [{ label: 'runtime', value: 'single-tenant' }, { label: 'workflows', value: 'many per app' }, { label: 'build in', value: 'VS Code · portal', tone: 'ok' }],
    },
    plans: {
      visible: [...homes],
      highlight: ['ws', 'p-ws'],
      tokens: [{ id: 's1', edge: 'p-ws', tone: 'info' }],
      chips: [{ label: 'WS1 / WS2 / WS3', value: '1 / 2 / 4 vCPU' }, { label: 'plan', value: 'reserved capacity' }, { label: 'built-in ops', value: 'included', tone: 'ok' }, { label: 'managed connectors', value: 'per call', tone: 'warn' }],
    },
    scaling: {
      visible: [...homes],
      highlight: ['ws'],
      tokens: [{ id: 's2', edge: 'p-ws', tone: 'info' }, { id: 's3', edge: 'p-ws', tone: 'info' }],
      chips: [{ label: 'scaling', value: 'dynamic' }, { label: '1 → 100 workers', value: '25–50 min', tone: 'warn' }],
    },
    network: {
      visible: [...homes, 'vnet', 'ws-vnet'],
      highlight: ['ws', 'vnet', 'ws-vnet'],
      tokens: [{ id: 'n1', edge: 'ws-vnet', tone: 'ok' }],
      chips: [{ label: 'inbound', value: 'private endpoint', tone: 'ok' }, { label: 'outbound', value: 'VNet integration', tone: 'ok' }],
    },
    ase: {
      visible: [...homes, 'vnet', 'ase-vnet'],
      highlight: ['ase', 'p-ase', 'ase-vnet'],
      tokens: [{ id: 'a1', edge: 'p-ase', tone: 'info' }],
      chips: [{ label: 'isolation', value: 'dedicated', tone: 'ok' }, { label: 'scaling', value: 'your autoscale rules', tone: 'warn' }],
    },
    hybrid: {
      visible: [...homes, 'sql', 'hyb-sql'],
      highlight: ['hyb', 'p-hyb', 'hyb-sql'],
      tokens: [{ id: 'h1', edge: 'p-hyb', tone: 'info' }, { id: 'h2', edge: 'hyb-sql', tone: 'info' }],
      chips: [{ label: 'runs on', value: 'your Kubernetes' }, { label: 'run history', value: 'SQL database' }, { label: 'features', value: 'some missing', tone: 'warn' }],
    },
    behind: {
      visible: [...homes, 'storage', 'func', 'ws-storage', 'ws-func'],
      highlight: ['storage', 'func'],
      tokens: [{ id: 'b1', edge: 'ws-storage', tone: 'info' }],
      chips: [{ label: 'storage', value: 'stateful workflows' }, { label: 'runtime', value: 'Functions extension' }],
    },
    consumption: {
      visible: [...homes, 'cons'],
      highlight: ['cons'],
      chips: [{ label: 'tenancy', value: 'multitenant' }, { label: 'billing', value: 'per execution' }, { label: 'agent workflows', value: 'preview', tone: 'warn' }],
    },
    recap: {
      visible: [...homes, 'cons', 'storage', 'func', 'vnet', 'sql', 'ws-storage', 'ws-func', 'ws-vnet', 'ase-vnet', 'hyb-sql'],
      chips: [{ label: 'build', value: 'once' }, { label: 'host', value: 'by trade-off' }],
    },
  },
  legend: [{ tone: 'info', label: 'deployment / data' }, { tone: 'ok', label: 'private traffic' }],
};
