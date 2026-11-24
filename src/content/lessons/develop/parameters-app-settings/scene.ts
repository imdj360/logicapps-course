import type { Scene } from '../../../../lessons/scene-types';

const core = ['wf', 'params', 'wf-params'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'wf', kind: 'action', label: 'Call pricing API', sublabel: 'workflow.json', x: 110, y: 250 },
    { id: 'params', kind: 'storage', label: 'parameters.json', sublabel: 'per environment', x: 340, y: 130 },
    { id: 'settings', kind: 'appinsights', label: 'App settings', sublabel: 'app-wide', x: 340, y: 370 },
    { id: 'kv', kind: 'keyvault', label: 'Key Vault', sublabel: 'secrets', x: 600, y: 440 },
    { id: 'dev', kind: 'hosting-plan', label: 'Dev', sublabel: 'own values', x: 650, y: 100 },
    { id: 'prod', kind: 'hosting-plan', label: 'Production', sublabel: 'own values', x: 650, y: 260 },
  ],
  edges: [
    { id: 'wf-params', from: 'wf', to: 'params' },
    { id: 'wf-settings', from: 'wf', to: 'settings' },
    { id: 'params-settings', from: 'params', to: 'settings', style: 'dashed' },
    { id: 'settings-kv', from: 'settings', to: 'kv', style: 'dashed' },
    { id: 'params-dev', from: 'params', to: 'dev' },
    { id: 'params-prod', from: 'params', to: 'prod' },
  ],
  steps: {
    problem: {
      visible: ['wf', 'dev', 'prod'],
      chips: [{ label: 'URL and key', value: 'differ per environment', tone: 'warn' }],
    },
    two: {
      visible: [...core, 'settings', 'wf-settings'],
      highlight: ['params', 'settings'],
      chips: [{ label: 'tools', value: 'parameters · app settings' }],
    },
    params: {
      visible: core,
      highlight: ['params', 'wf-params'],
      tokens: [{ id: 'p1', edge: 'wf-params', tone: 'info' }],
      chips: [{ label: 'syntax', value: '@parameters(name)' }, { label: 'entry', value: 'type + value' }],
    },
    appsetting: {
      visible: [...core, 'settings', 'wf-settings', 'params-settings'],
      highlight: ['params-settings', 'settings'],
      tokens: [{ id: 'a1', edge: 'params-settings', tone: 'info' }],
      chips: [{ label: 'syntax', value: '@appsetting(name)' }, { label: 'in parameters.json', value: 'only valid type' }],
    },
    choose: {
      visible: [...core, 'settings', 'wf-settings', 'params-settings'],
      highlight: ['params', 'settings'],
      chips: [{ label: 'parameters', value: 'large and complex values', tone: 'ok' }, { label: 'app settings', value: 'size limits', tone: 'warn' }],
    },
    env: {
      visible: [...core, 'settings', 'wf-settings', 'params-settings', 'dev', 'prod', 'params-dev', 'params-prod'],
      highlight: ['params-dev', 'params-prod'],
      tokens: [{ id: 'e1', edge: 'params-dev', tone: 'ok' }, { id: 'e2', edge: 'params-prod', tone: 'ok' }],
      chips: [{ label: 'one file', value: 'per environment' }],
    },
    secrets: {
      visible: [...core, 'settings', 'wf-settings', 'params-settings', 'kv', 'settings-kv'],
      highlight: ['kv'],
      failed: [],
      chips: [{ label: 'secure types', value: 'not supported', tone: 'fail' }, { label: 'prefer', value: 'managed identity' }],
    },
    keyvault: {
      visible: [...core, 'settings', 'wf-settings', 'params-settings', 'kv', 'settings-kv'],
      highlight: ['settings-kv', 'kv'],
      tokens: [{ id: 'k1', edge: 'settings-kv', tone: 'ok' }],
      chips: [{ label: 'new secret version', value: 'within 24 hours' }, { label: 'designer', value: 'cannot resolve', tone: 'warn' }],
    },
    slots: {
      visible: [...core, 'settings', 'wf-settings', 'params-settings', 'kv', 'settings-kv'],
      highlight: ['settings'],
      chips: [{ label: 'portal option', value: 'Deployment slot setting' }, { label: 'parameterized connections', value: 'restricted designer', tone: 'warn' }],
    },
    recap: {
      visible: ['wf', 'params', 'settings', 'kv', 'dev', 'prod', 'wf-params', 'wf-settings', 'params-settings', 'settings-kv', 'params-dev', 'params-prod'],
      chips: [{ label: 'secrets', value: 'Key Vault via app settings' }],
    },
  },
  legend: [{ tone: 'info', label: 'reference' }, { tone: 'ok', label: 'resolved value' }],
};
