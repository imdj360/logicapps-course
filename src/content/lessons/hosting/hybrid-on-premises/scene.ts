import type { Scene } from '../../../../lessons/scene-types';

const local = ['rt', 'sql', 'smb', 'plant', 'rt-sql', 'rt-smb', 'rt-plant'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'dev', kind: 'human', label: 'Developer', sublabel: 'VS Code', x: 110, y: 230 },
    { id: 'arc', kind: 'hosting-plan', label: 'Azure Arc', sublabel: 'management', x: 450, y: 80 },
    { id: 'entra', kind: 'keyvault', label: 'Entra ID', sublabel: 'app reg', x: 790, y: 80 },
    { id: 'rt', kind: 'hosting-plan', label: 'Logic Apps', sublabel: 'Container Apps', x: 450, y: 240 },
    { id: 'conn', kind: 'connector-managed', label: 'Managed API', sublabel: 'runs in Azure', x: 790, y: 240 },
    { id: 'sql', kind: 'storage', label: 'SQL database', sublabel: 'run history', x: 250, y: 410 },
    { id: 'smb', kind: 'storage', label: 'SMB share', sublabel: 'maps · schemas', x: 450, y: 410 },
    { id: 'plant', kind: 'user', label: 'Plant systems', sublabel: 'local network', x: 650, y: 410 },
  ],
  edges: [
    { id: 'arc-rt', from: 'arc', to: 'rt', style: 'dashed' },
    { id: 'dev-rt', from: 'dev', to: 'rt' },
    { id: 'rt-sql', from: 'rt', to: 'sql' },
    { id: 'rt-smb', from: 'rt', to: 'smb' },
    { id: 'rt-plant', from: 'rt', to: 'plant' },
    { id: 'rt-conn', from: 'rt', to: 'conn', style: 'dashed' },
    { id: 'rt-entra', from: 'rt', to: 'entra', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['rt', 'plant', 'rt-plant'],
      highlight: ['plant'],
      tokens: [{ id: 'p1', edge: 'rt-plant', tone: 'info' }],
      chips: [{ label: 'runs in', value: 'plant datacenter' }, { label: 'model', value: 'hybrid' }],
    },
    pieces: {
      visible: [...local],
      highlight: ['rt', 'sql', 'smb'],
      tokens: [{ id: 'k1', edge: 'rt-sql', tone: 'info' }, { id: 'k2', edge: 'rt-smb', tone: 'info' }],
      chips: [{ label: 'runtime', value: 'Container Apps ext.' }, { label: 'run history', value: 'SQL database' }, { label: 'artifacts', value: 'SMB share' }],
    },
    where: {
      visible: [...local, 'arc', 'arc-rt'],
      highlight: ['arc', 'rt'],
      chips: [{ label: 'cluster', value: 'Arc-enabled Kubernetes' }, { label: 'regions', value: 'limited list', tone: 'warn' }],
    },
    deploy: {
      visible: [...local, 'dev', 'dev-rt'],
      highlight: ['dev', 'dev-rt'],
      tokens: [{ id: 'd1', edge: 'dev-rt', tone: 'ok' }],
      chips: [{ label: 'hosting plan', value: 'Hybrid' }, { label: 'recommended', value: 'zip deploy', tone: 'ok' }, { label: 'needs', value: 'app registration' }],
    },
    scaling: {
      visible: [...local],
      highlight: ['rt'],
      chips: [{ label: 'scaler', value: 'KEDA' }, { label: 'replicas', value: '1–30 default' }, { label: 'per replica', value: '0.25–2 vCPU' }],
    },
    billing: {
      visible: [...local, 'conn', 'rt-conn'],
      highlight: ['rt'],
      chips: [{ label: 'Azure bills', value: 'vCPU × replicas' }, { label: 'you run', value: 'cluster · SQL' }, { label: 'managed connectors', value: 'extra', tone: 'warn' }],
    },
    auth: {
      visible: [...local, 'conn', 'entra', 'rt-conn', 'rt-entra'],
      highlight: ['entra', 'rt-entra', 'conn'],
      tokens: [{ id: 'a1', edge: 'rt-entra', tone: 'info' }, { id: 'a2', edge: 'rt-conn', tone: 'info' }],
      chips: [{ label: 'managed identity', value: 'not supported', tone: 'fail' }, { label: 'use', value: 'Entra app registration', tone: 'ok' }],
    },
    offline: {
      visible: [...local, 'arc', 'conn', 'arc-rt', 'rt-conn'],
      failed: ['conn', 'arc'],
      highlight: ['rt-plant'],
      tokens: [{ id: 'o1', edge: 'rt-plant', tone: 'ok' }, { id: 'o2', edge: 'rt-conn', tone: 'fail' }],
      chips: [{ label: 'local workflows', value: 'keep running', tone: 'ok' }, { label: 'managed connectors', value: 'stop', tone: 'fail' }, { label: 'logs kept', value: '24 hours', tone: 'warn' }],
    },
    limits: {
      visible: [...local],
      highlight: ['rt'],
      chips: [{ label: 'deployment slots', value: 'not available', tone: 'warn' }, { label: 'connector MI', value: 'not available', tone: 'warn' }],
    },
    recap: {
      visible: [...local, 'dev', 'arc', 'entra', 'conn', 'dev-rt', 'arc-rt', 'rt-conn', 'rt-entra'],
      chips: [{ label: 'runs', value: 'on your cluster' }, { label: 'you run', value: 'more' }],
    },
  },
  legend: [
    { tone: 'info', label: 'runtime traffic' },
    { tone: 'ok', label: 'works locally' },
    { tone: 'fail', label: 'needs Azure' },
  ],
};
