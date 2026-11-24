import type { Scene } from '../../../../lessons/scene-types';

const core = ['ase', 'plan', 'la1', 'la2', 'ase-plan', 'plan-la1', 'plan-la2'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'ops', kind: 'human', label: 'Ops engineer', sublabel: 'outside network', x: 110, y: 110 },
    { id: 'ase', kind: 'hosting-plan', label: 'ASE v3', sublabel: 'internal', x: 450, y: 80 },
    { id: 'auto', kind: 'condition', label: 'Scaling rule', sublabel: 'CPU 50–70%', x: 790, y: 110 },
    { id: 'plan', kind: 'hosting-plan', label: 'Isolated v2 plan', sublabel: 'Windows only', x: 450, y: 210 },
    { id: 'la1', kind: 'action', label: 'Orders app', sublabel: 'Standard', x: 250, y: 330 },
    { id: 'la2', kind: 'action', label: 'Invoices app', sublabel: 'Standard', x: 650, y: 330 },
    { id: 'db', kind: 'storage', label: 'Private SQL', sublabel: 'in your VNet', x: 450, y: 430 },
  ],
  edges: [
    { id: 'ase-plan', from: 'ase', to: 'plan' },
    { id: 'plan-la1', from: 'plan', to: 'la1' },
    { id: 'plan-la2', from: 'plan', to: 'la2' },
    { id: 'la1-db', from: 'la1', to: 'db' },
    { id: 'la2-db', from: 'la2', to: 'db' },
    { id: 'ops-ase', from: 'ops', to: 'ase', style: 'dashed' },
    { id: 'auto-plan', from: 'auto', to: 'plan', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core],
      highlight: ['la2'],
      chips: [{ label: 'compute', value: 'dedicated' }, { label: 'endpoints', value: 'not public' }],
    },
    what: {
      visible: [...core],
      highlight: ['ase', 'plan'],
      chips: [{ label: 'environment', value: 'isolated · dedicated', tone: 'ok' }, { label: 'plan', value: 'Isolated v2' }, { label: 'OS', value: 'Windows only' }],
    },
    network: {
      visible: [...core, 'db', 'la1-db', 'la2-db'],
      highlight: ['ase', 'db', 'la1-db', 'la2-db'],
      tokens: [{ id: 'n1', edge: 'la1-db', tone: 'ok' }, { id: 'n2', edge: 'la2-db', tone: 'ok' }],
      chips: [{ label: 'internal', value: 'your network only', tone: 'ok' }, { label: 'external', value: 'public address' }],
    },
    history: {
      visible: [...core, 'ops', 'ops-ase'],
      highlight: ['ops', 'ops-ase'],
      tokens: [{ id: 'h1', edge: 'ops-ase', tone: 'fail' }],
      chips: [{ label: 'run history', value: 'visible' }, { label: 'inputs · outputs', value: 'hidden from outside', tone: 'fail' }],
    },
    scaling: {
      visible: [...core, 'auto', 'auto-plan'],
      highlight: ['auto', 'auto-plan', 'plan'],
      tokens: [{ id: 'a1', edge: 'auto-plan', tone: 'info' }],
      chips: [{ label: 'dynamic scaling', value: 'none', tone: 'warn' }, { label: 'per plan', value: '≤ 100 instances' }, { label: 'per ASE', value: '≤ 200 instances' }],
    },
    billing: {
      visible: [...core],
      highlight: ['plan'],
      chips: [{ label: 'you pay for', value: 'plan instances' }, { label: 'logic apps', value: 'any number' }, { label: 'empty ASE', value: '1 × I1v2', tone: 'warn' }],
    },
    differences: {
      visible: [...core, 'db', 'la1-db', 'la2-db'],
      highlight: ['la1', 'la2'],
      chips: [{ label: 'storage key access', value: 'can disable', tone: 'ok' }, { label: 'Scale Monitoring', value: 'not supported', tone: 'warn' }],
    },
    when: {
      visible: [...core, 'db', 'la1-db', 'la2-db'],
      chips: [{ label: 'isolation', value: 'a requirement?' }, { label: 'otherwise', value: 'WS plan + private endpoints' }],
    },
    recap: {
      visible: [...core, 'db', 'la1-db', 'la2-db', 'ops', 'ops-ase', 'auto', 'auto-plan'],
      chips: [{ label: 'isolation', value: 'full' }, { label: 'scaling', value: 'yours' }],
    },
  },
  legend: [
    { tone: 'ok', label: 'private traffic' },
    { tone: 'info', label: 'scaling rule' },
    { tone: 'fail', label: 'blocked' },
  ],
};
