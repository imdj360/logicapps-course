import type { Scene } from '../../../../lessons/scene-types';

const plans = ['workflow', 'cons', 'ws', 'ase', 'hyb', 'wf-cons', 'wf-ws', 'wf-ase', 'wf-hyb'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'workflow', kind: 'action', label: 'Order workflow', x: 450, y: 70 },
    { id: 'cons', kind: 'hosting-plan', label: 'Consumption', sublabel: 'multitenant', x: 115, y: 230 },
    { id: 'ws', kind: 'hosting-plan', label: 'Standard WS1–3', sublabel: 'single-tenant', x: 335, y: 230 },
    { id: 'ase', kind: 'hosting-plan', label: 'ASE v3', sublabel: 'Isolated v2', x: 555, y: 230 },
    { id: 'hyb', kind: 'hosting-plan', label: 'Hybrid', sublabel: 'Arc Kubernetes', x: 780, y: 230 },
    { id: 'shared', kind: 'user', label: 'Other tenants', sublabel: 'shared compute', x: 115, y: 410 },
    { id: 'storage', kind: 'storage', label: 'Azure Storage', sublabel: 'state · history', x: 255, y: 410 },
    { id: 'func', kind: 'hosting-plan', label: 'Functions host', sublabel: 'runtime', x: 425, y: 410 },
    { id: 'vnet', kind: 'keyvault', label: 'Private VNet', sublabel: 'private access', x: 600, y: 410 },
    { id: 'sql', kind: 'storage', label: 'SQL Server', sublabel: 'state · history', x: 780, y: 410 },
  ],
  edges: [
    { id: 'wf-cons', from: 'workflow', to: 'cons' },
    { id: 'wf-ws', from: 'workflow', to: 'ws' },
    { id: 'wf-ase', from: 'workflow', to: 'ase' },
    { id: 'wf-hyb', from: 'workflow', to: 'hyb' },
    { id: 'cons-shared', from: 'cons', to: 'shared', style: 'dashed' },
    { id: 'ws-storage', from: 'ws', to: 'storage' },
    { id: 'ws-func', from: 'ws', to: 'func' },
    { id: 'ws-vnet', from: 'ws', to: 'vnet', style: 'dashed' },
    { id: 'ase-vnet', from: 'ase', to: 'vnet' },
    { id: 'hyb-sql', from: 'hyb', to: 'sql' },
  ],
  steps: {
    problem: {
      visible: [...plans],
      chips: [{ label: 'finance', value: 'pay per run' }, { label: 'security', value: 'no public endpoints' }, { label: 'plant', value: 'on-premises' }],
    },
    consumption: {
      visible: [...plans, 'shared', 'cons-shared'],
      highlight: ['cons', 'wf-cons'],
      tokens: [{ id: 'c1', edge: 'wf-cons', tone: 'info' }],
      chips: [{ label: 'tenancy', value: 'multitenant' }, { label: 'billing', value: 'per execution' }, { label: 'workflows', value: '1 per resource' }],
    },
    'consumption-fit': {
      visible: [...plans, 'shared', 'cons-shared'],
      highlight: ['cons'],
      chips: [{ label: 'billing', value: 'executions, not compute', tone: 'ok' }, { label: 'private network', value: 'look at Standard', tone: 'warn' }],
    },
    standard: {
      visible: [...plans],
      highlight: ['ws', 'wf-ws'],
      tokens: [{ id: 's1', edge: 'wf-ws', tone: 'info' }],
      chips: [{ label: 'tenancy', value: 'single-tenant' }, { label: 'WS1 / WS2 / WS3', value: '1 / 2 / 4 vCPU' }, { label: 'billing', value: 'per plan' }],
    },
    scaling: {
      visible: [...plans],
      highlight: ['ws'],
      tokens: [{ id: 's2', edge: 'wf-ws', tone: 'info' }, { id: 's3', edge: 'wf-ws', tone: 'info' }],
      chips: [{ label: 'scaling', value: 'dynamic' }, { label: '1 → 100 workers', value: '25–50 min', tone: 'warn' }],
    },
    network: {
      visible: [...plans, 'vnet', 'ws-vnet'],
      highlight: ['ws', 'vnet', 'ws-vnet'],
      tokens: [{ id: 'n1', edge: 'ws-vnet', tone: 'ok' }],
      chips: [{ label: 'inbound', value: 'private endpoint', tone: 'ok' }, { label: 'outbound', value: 'VNet integration', tone: 'ok' }],
    },
    ase: {
      visible: [...plans, 'vnet', 'ase-vnet'],
      highlight: ['ase', 'wf-ase', 'ase-vnet'],
      tokens: [{ id: 'a1', edge: 'wf-ase', tone: 'info' }],
      chips: [{ label: 'isolation', value: 'dedicated', tone: 'ok' }, { label: 'scaling', value: 'your autoscale rules', tone: 'warn' }],
    },
    hybrid: {
      visible: [...plans, 'sql', 'hyb-sql'],
      highlight: ['hyb', 'wf-hyb', 'hyb-sql'],
      tokens: [{ id: 'h1', edge: 'wf-hyb', tone: 'info' }, { id: 'h2', edge: 'hyb-sql', tone: 'info' }],
      chips: [{ label: 'runs on', value: 'your Kubernetes' }, { label: 'state', value: 'SQL Server' }],
    },
    behind: {
      visible: [...plans, 'storage', 'func', 'ws-storage', 'ws-func'],
      highlight: ['storage', 'func'],
      tokens: [{ id: 'b1', edge: 'ws-storage', tone: 'info' }],
      chips: [{ label: 'storage account', value: 'required' }, { label: 'runtime', value: 'Functions extension' }],
    },
    recap: {
      visible: [...plans, 'shared', 'storage', 'func', 'vnet', 'sql', 'cons-shared', 'ws-storage', 'ws-func', 'ws-vnet', 'ase-vnet', 'hyb-sql'],
      chips: [{ label: 'options', value: '4' }, { label: 'same workflow', value: 'different trade-offs' }],
    },
  },
  legend: [{ tone: 'info', label: 'deployment / data' }, { tone: 'ok', label: 'private traffic' }],
};
