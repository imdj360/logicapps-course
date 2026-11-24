import type { Scene } from '../../../../lessons/scene-types';

const core = ['app', 'setting', 'kv', 'setting-kv', 'app-setting'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'identity', x: 110, y: 240 },
    { id: 'setting', kind: 'storage', label: 'App setting', sublabel: 'KV reference', x: 380, y: 120 },
    { id: 'kv', kind: 'keyvault', label: 'Key Vault', sublabel: 'secrets', x: 680, y: 240 },
    { id: 'action', kind: 'connector-builtin', label: 'Get secret', sublabel: 'run time', x: 380, y: 370 },
    { id: 'history', kind: 'storage', label: 'Run history', sublabel: 'secured', x: 680, y: 430 },
  ],
  edges: [
    { id: 'app-setting', from: 'app', to: 'setting' },
    { id: 'setting-kv', from: 'setting', to: 'kv' },
    { id: 'app-action', from: 'app', to: 'action' },
    { id: 'action-kv', from: 'action', to: 'kv' },
    { id: 'action-history', from: 'action', to: 'history', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['app', 'kv'],
      chips: [{ label: 'partner wants', value: 'an API key' }, { label: 'store it in', value: 'Key Vault' }],
    },
    references: {
      visible: [...core],
      highlight: ['setting', 'setting-kv'],
      tokens: [{ id: 'r1', edge: 'setting-kv', tone: 'info' }],
      chips: [{ label: 'syntax', value: '@Microsoft.KeyVault(...)' }, { label: 'role', value: 'Key Vault Secrets User' }],
    },
    rotation: {
      visible: [...core],
      highlight: ['kv'],
      chips: [{ label: 'no version', value: 'latest within 24 h' }, { label: 'config change', value: 'refetch now' }],
    },
    designer: {
      visible: [...core],
      highlight: ['setting'],
      chips: [{ label: 'reference', value: 'secrets only', tone: 'warn' }, { label: 'designer', value: "can't dereference", tone: 'fail' }],
    },
    params: {
      visible: [...core],
      chips: [{ label: 'securestring', value: 'not in Standard' }, { label: 'pattern', value: 'parameter ← app setting' }],
    },
    connector: {
      visible: [...core, 'action', 'app-action', 'action-kv'],
      highlight: ['action', 'action-kv'],
      tokens: [{ id: 'c1', edge: 'action-kv', tone: 'info' }],
      chips: [{ label: 'built-in action', value: 'Get secret' }, { label: 'auth', value: 'managed identity' }],
    },
    secure: {
      visible: [...core, 'action', 'history', 'app-action', 'action-kv', 'action-history'],
      highlight: ['history', 'action-history'],
      chips: [{ label: 'turn on', value: 'Secure Outputs', tone: 'ok' }, { label: 'and', value: 'on downstream actions' }],
    },
    slots: {
      visible: [...core],
      chips: [{ label: 'per environment', value: 'own vault' }, { label: 'KV settings', value: 'slot settings' }],
    },
    recap: {
      visible: [...core, 'action', 'history', 'app-action', 'action-kv', 'action-history'],
      chips: [{ label: 'secret', value: 'in the vault, hidden in runs' }],
    },
  },
  legend: [{ tone: 'info', label: 'secret read' }],
};
