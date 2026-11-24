import type { Scene } from '../../../../lessons/scene-types';

// One value's journey, left to right: workflow → parameters.json → app setting → Key Vault.
const chain = ['wf', 'params', 'settings', 'kv', 'wf-params', 'params-settings', 'settings-kv'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'wf', kind: 'action', label: 'Call pricing API', sublabel: '@parameters()', x: 110, y: 200 },
    { id: 'params', kind: 'storage', label: 'parameters.json', sublabel: 'url · key', x: 340, y: 200 },
    { id: 'settings', kind: 'appinsights', label: 'App setting', sublabel: 'PricingKey', x: 575, y: 200 },
    { id: 'kv', kind: 'keyvault', label: 'Key Vault', sublabel: 'the secret', x: 810, y: 200 },
    { id: 'envs', kind: 'hosting-plan', label: 'Dev, test, prod', sublabel: 'own values', x: 457, y: 400 },
  ],
  edges: [
    { id: 'wf-params', from: 'wf', to: 'params', label: 'asks' },
    { id: 'params-settings', from: 'params', to: 'settings', label: 'secret' },
    { id: 'settings-kv', from: 'settings', to: 'kv', label: 'reference' },
    { id: 'envs-params', from: 'envs', to: 'params', style: 'dashed' },
    { id: 'envs-settings', from: 'envs', to: 'settings', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['wf', 'envs'],
      highlight: ['wf'],
      chips: [{ label: 'URL', value: 'differs per environment' }, { label: 'key', value: 'never in the workflow', tone: 'warn' }],
    },
    two: {
      visible: [...chain],
      highlight: ['wf', 'params', 'settings', 'kv'],
      tokens: [{ id: 't1', edge: 'wf-params', tone: 'info' }, { id: 't2', edge: 'params-settings', tone: 'info' }, { id: 't3', edge: 'settings-kv', tone: 'info' }],
      chips: [{ label: 'URL', value: 'stops at parameters' }, { label: 'key', value: 'goes on to Key Vault', tone: 'ok' }],
    },
    params: {
      visible: [...chain],
      highlight: ['wf', 'params', 'wf-params'],
      tokens: [{ id: 'p1', edge: 'wf-params', tone: 'info' }],
      chips: [{ label: 'workflow', value: "@parameters('pricingUrl')" }, { label: 'in parameters.json', value: '@appsetting() only' }],
    },
    appsetting: {
      visible: [...chain],
      highlight: ['settings', 'kv', 'settings-kv'],
      tokens: [{ id: 'a1', edge: 'settings-kv', tone: 'ok' }],
      chips: [{ label: 'app setting', value: '@Microsoft.KeyVault(...)' }, { label: 'access', value: 'Key Vault Secrets User', tone: 'ok' }],
    },
    choose: {
      visible: [...chain],
      highlight: ['params', 'settings', 'kv'],
      chips: [{ label: 'default', value: 'parameters' }, { label: 'secret', value: 'app setting → Key Vault', tone: 'ok' }],
    },
    env: {
      visible: [...chain, 'envs', 'envs-params', 'envs-settings'],
      highlight: ['envs'],
      tokens: [{ id: 'e1', edge: 'envs-params', tone: 'ok' }, { id: 'e2', edge: 'envs-settings', tone: 'ok' }],
      chips: [{ label: 'per environment', value: 'parameters.json + app settings' }, { label: 'workflow', value: 'same everywhere', tone: 'ok' }],
    },
    watch: {
      visible: [...chain],
      highlight: ['settings', 'kv'],
      chips: [{ label: 'designer', value: 'cannot resolve Key Vault refs', tone: 'warn' }, { label: 'so', value: 'only secrets in Key Vault' }],
    },
    recap: {
      visible: [...chain, 'envs', 'envs-params', 'envs-settings'],
      chips: [{ label: 'workflow', value: 'asks by name' }, { label: 'environments', value: 'supply the values' }],
    },
  },
  legend: [
    { tone: 'info', label: 'value requested' },
    { tone: 'ok', label: 'resolved' },
  ],
};
