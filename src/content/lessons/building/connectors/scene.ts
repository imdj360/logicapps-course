import type { Scene } from '../../../../lessons/scene-types';

const builtin = ['app', 'built', 'app-built'];
const managed = ['managed', 'azure', 'app-managed', 'managed-azure'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'Standard', x: 110, y: 240 },
    { id: 'built', kind: 'connector-builtin', label: 'Service Bus', sublabel: 'built-in', x: 360, y: 110 },
    { id: 'managed', kind: 'connector-managed', label: 'Service Bus', sublabel: 'managed', x: 360, y: 370 },
    { id: 'vnet', kind: 'keyvault', label: 'Private VNet', sublabel: 'your network', x: 600, y: 110 },
    { id: 'azure', kind: 'hosting-plan', label: 'Shared Azure', sublabel: 'multitenant', x: 600, y: 300 },
    { id: 'conn', kind: 'keyvault', label: 'API connection', sublabel: 'Azure resource', x: 600, y: 430 },
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', x: 810, y: 210 },
  ],
  edges: [
    { id: 'app-built', from: 'app', to: 'built' },
    { id: 'app-managed', from: 'app', to: 'managed' },
    { id: 'built-vnet', from: 'built', to: 'vnet' },
    { id: 'vnet-queue', from: 'vnet', to: 'queue' },
    { id: 'managed-azure', from: 'managed', to: 'azure' },
    { id: 'azure-queue', from: 'azure', to: 'queue' },
    { id: 'managed-conn', from: 'managed', to: 'conn', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...builtin, ...managed.slice(0, 1), 'app-managed'],
      highlight: ['built', 'managed'],
      chips: [{ label: 'Built-in', value: 'Service Bus' }, { label: 'Shared', value: 'Service Bus' }],
    },
    builtin: {
      visible: [...builtin],
      highlight: ['built', 'app-built'],
      tokens: [{ id: 'b1', edge: 'app-built', tone: 'ok' }],
      chips: [{ label: 'runs', value: 'in-process' }, { label: 'gallery label', value: 'Built-in' }],
    },
    managed: {
      visible: [...builtin, ...managed],
      highlight: ['managed', 'azure', 'managed-azure'],
      tokens: [{ id: 'm1', edge: 'app-managed', tone: 'info' }, { id: 'm2', edge: 'managed-azure', tone: 'info' }],
      chips: [{ label: 'hosted by', value: 'Microsoft, shared' }, { label: 'gallery label', value: 'Shared' }],
    },
    both: {
      visible: [...builtin, ...managed],
      highlight: ['built', 'managed'],
      chips: [{ label: 'both versions', value: 'e.g. 9 services' }, { label: 'usually better', value: 'built-in', tone: 'ok' }],
    },
    cost: {
      visible: [...builtin, ...managed],
      highlight: ['built', 'managed'],
      chips: [{ label: 'built-in', value: 'free', tone: 'ok' }, { label: 'managed', value: 'per call', tone: 'warn' }],
    },
    connections: {
      visible: [...builtin, ...managed, 'conn', 'managed-conn'],
      highlight: ['conn', 'managed-conn', 'app'],
      chips: [{ label: 'built-in', value: 'connections.json' }, { label: 'managed', value: 'API connection resource' }],
    },
    auth: {
      visible: [...builtin, ...managed, 'conn', 'managed-conn'],
      highlight: ['built'],
      chips: [{ label: 'options', value: 'string · Entra · MI' }, { label: 'SFTP built-in', value: 'password / key', tone: 'warn' }, { label: 'recommended', value: 'managed identity', tone: 'ok' }],
    },
    network: {
      visible: [...builtin, ...managed, 'vnet', 'queue', 'built-vnet', 'vnet-queue', 'azure-queue'],
      highlight: ['built-vnet', 'vnet-queue', 'vnet'],
      tokens: [{ id: 'n1', edge: 'built-vnet', tone: 'ok' }, { id: 'n2', edge: 'vnet-queue', tone: 'ok' }, { id: 'n3', edge: 'azure-queue', tone: 'info' }],
      chips: [{ label: 'built-in', value: 'reaches your VNet', tone: 'ok' }, { label: 'managed to on-prem', value: 'data gateway', tone: 'warn' }],
    },
    throttle: {
      visible: [...builtin, ...managed, 'queue', 'azure-queue'],
      highlight: ['managed', 'azure-queue'],
      tokens: [{ id: 't1', edge: 'azure-queue', tone: 'fail' }],
      chips: [{ label: 'managed limits', value: 'per connector' }, { label: 'Service Bus managed', value: '6,000/min/conn' }],
    },
    recap: {
      visible: [...builtin, ...managed, 'vnet', 'queue', 'conn', 'built-vnet', 'vnet-queue', 'azure-queue', 'managed-conn'],
      chips: [{ label: 'default choice', value: 'built-in, if it exists' }],
    },
  },
  legend: [
    { tone: 'ok', label: 'built-in path' },
    { tone: 'info', label: 'managed path' },
    { tone: 'fail', label: 'throttled' },
  ],
};
