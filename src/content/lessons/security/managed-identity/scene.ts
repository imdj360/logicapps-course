import type { Scene } from '../../../../lessons/scene-types';

const core = ['app', 'mi', 'app-mi'];
const targets = ['storage', 'sb', 'kv', 'mi-storage', 'mi-sb', 'mi-kv'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'Standard', x: 110, y: 240 },
    { id: 'mi', kind: 'keyvault', label: 'Identity', sublabel: 'system-assigned', x: 370, y: 240 },
    { id: 'uami', kind: 'keyvault', label: 'User-assigned', sublabel: 'shared', x: 370, y: 410 },
    { id: 'storage', kind: 'storage', label: 'Storage', sublabel: 'role assignment', x: 680, y: 90 },
    { id: 'sb', kind: 'servicebus', label: 'Service Bus', sublabel: 'built-in', x: 680, y: 240 },
    { id: 'kv', kind: 'keyvault', label: 'Key Vault', sublabel: 'vault.azure.net', x: 680, y: 390 },
  ],
  edges: [
    { id: 'app-mi', from: 'app', to: 'mi' },
    { id: 'app-uami', from: 'app', to: 'uami', style: 'dashed' },
    { id: 'mi-storage', from: 'mi', to: 'storage' },
    { id: 'mi-sb', from: 'mi', to: 'sb' },
    { id: 'mi-kv', from: 'mi', to: 'kv' },
  ],
  steps: {
    problem: {
      visible: ['app', 'storage', 'sb', 'kv'],
      chips: [{ label: 'today', value: 'keys · strings · secrets', tone: 'warn' }],
    },
    identities: {
      visible: [...core, 'uami', 'app-uami'],
      highlight: ['mi', 'uami'],
      chips: [{ label: 'system-assigned', value: 'on by default' }, { label: 'in use', value: 'one at a time' }],
    },
    access: {
      visible: [...core, ...targets],
      highlight: ['storage', 'mi-storage'],
      tokens: [{ id: 'a1', edge: 'mi-storage', tone: 'ok' }],
      chips: [{ label: 'example role', value: 'Storage Blob Data Contributor' }],
    },
    builtin: {
      visible: [...core, ...targets],
      highlight: ['sb', 'mi-sb'],
      tokens: [{ id: 'b1', edge: 'mi-sb', tone: 'ok' }],
      chips: [{ label: 'user-assigned', value: 'SQL Server · HTTP only', tone: 'warn' }],
    },
    managed: {
      visible: [...core, ...targets],
      highlight: ['kv'],
      chips: [{ label: 'needs', value: 'Entra OAuth support' }, { label: 'connections', value: 'token store + target' }],
    },
    http: {
      visible: [...core, ...targets],
      highlight: ['mi-kv'],
      tokens: [{ id: 'h1', edge: 'mi-kv', tone: 'ok' }],
      chips: [{ label: 'Key Vault audience', value: 'https://vault.azure.net' }, { label: 'mismatch', value: '400 or 401', tone: 'fail' }],
    },
    disable: {
      visible: [...core, ...targets],
      failed: ['mi'],
      chips: [{ label: 'disable', value: 'all connections break', tone: 'fail' }, { label: 'instead', value: 'remove role assignments', tone: 'ok' }],
    },
    cautions: {
      visible: [...core, ...targets],
      chips: [{ label: 'hybrid', value: 'no managed identity' }, { label: 'editors', value: "hold the identity's rights", tone: 'warn' }],
    },
    recap: {
      visible: [...core, ...targets, 'uami', 'app-uami'],
      chips: [{ label: 'secrets stored', value: 'none' }],
    },
  },
  legend: [{ tone: 'ok', label: 'signed in as the app' }, { tone: 'fail', label: 'broken' }],
};
