import type { Scene } from '../../../../lessons/scene-types';

const envs = ['dev', 'test', 'prod'];
const zipFlow = ['zip', ...envs, 'zip-dev', 'zip-test', 'zip-prod'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'zip', kind: 'storage', label: 'One app.zip', sublabel: 'unchanged', x: 110, y: 240 },
    { id: 'bicep', kind: 'action', label: '.bicepparam', sublabel: 'SKUs · VNet', x: 390, y: 80 },
    { id: 'params', kind: 'action', label: 'parameters.json', sublabel: 'URLs · queues', x: 390, y: 240 },
    { id: 'settings', kind: 'action', label: 'App settings', sublabel: 'merged safely', x: 390, y: 395 },
    { id: 'kv', kind: 'keyvault', label: 'Key Vault', sublabel: 'per-env secrets', x: 110, y: 395 },
    { id: 'dev', kind: 'hosting-plan', label: 'Dev', sublabel: 'WS1 · dev cfg', x: 740, y: 100 },
    { id: 'test', kind: 'hosting-plan', label: 'Test', sublabel: 'WS1 · test cfg', x: 740, y: 240 },
    { id: 'prod', kind: 'hosting-plan', label: 'Production', sublabel: 'WS2 · prod cfg', x: 740, y: 380 },
  ],
  edges: [
    { id: 'zip-dev', from: 'zip', to: 'dev' },
    { id: 'zip-test', from: 'zip', to: 'test' },
    { id: 'zip-prod', from: 'zip', to: 'prod' },
    { id: 'bicep-dev', from: 'bicep', to: 'dev', style: 'dashed' },
    { id: 'bicep-prod', from: 'bicep', to: 'prod', style: 'dashed' },
    { id: 'params-test', from: 'params', to: 'test', style: 'dashed' },
    { id: 'params-prod', from: 'params', to: 'prod', style: 'dashed' },
    { id: 'kv-settings', from: 'kv', to: 'settings', style: 'dashed', label: 'KV ref' },
    { id: 'settings-prod', from: 'settings', to: 'prod', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...envs],
      highlight: ['dev', 'test', 'prod'],
      chips: [
        { label: 'hardcoded config', value: 'rebuild per env', tone: 'fail' },
        { label: 'risk', value: 'untested prod zip', tone: 'warn' },
      ],
    },
    'three-layers': {
      visible: ['bicep', 'params', 'settings', 'kv', 'kv-settings', ...envs, 'bicep-prod', 'params-prod', 'settings-prod'],
      highlight: ['bicep', 'params', 'settings'],
      chips: [
        { label: 'layer 1', value: '.bicepparam (infra)' },
        { label: 'layer 2', value: 'parameters.json' },
        { label: 'layer 3', value: 'App settings + KV' },
      ],
    },
    bicepparam: {
      visible: ['bicep', ...envs, 'bicep-dev', 'bicep-prod'],
      highlight: ['bicep', 'bicep-dev', 'bicep-prod'],
      tokens: [
        { id: 'b1', edge: 'bicep-dev', tone: 'info' },
        { id: 'b2', edge: 'bicep-prod', tone: 'ok' },
      ],
      chips: [
        { label: 'dev', value: 'WS1 · public' },
        { label: 'prod', value: 'WS2 · private VNet', tone: 'ok' },
      ],
    },
    'workflow-params': {
      visible: ['params', ...envs, 'params-test', 'params-prod'],
      highlight: ['params', 'params-test', 'params-prod'],
      tokens: [
        { id: 'p1', edge: 'params-test', tone: 'info' },
        { id: 'p2', edge: 'params-prod', tone: 'ok' },
      ],
      chips: [
        { label: 'deploy', value: '--type static parameters.json' },
        { label: 'holds', value: 'URLs · queues · limits' },
      ],
    },
    'appsettings-merge': {
      visible: ['settings', 'prod', 'settings-prod'],
      highlight: ['settings', 'settings-prod'],
      tokens: [{ id: 'a1', edge: 'settings-prod', tone: 'ok' }],
      chips: [
        { label: 'safe merge', value: 'CLI set · Bicep union()', tone: 'ok' },
        { label: 'avoids', value: 'wiping runtime keys', tone: 'warn' },
      ],
    },
    secrets: {
      visible: ['kv', 'settings', 'prod', 'kv-settings', 'settings-prod'],
      highlight: ['kv', 'kv-settings'],
      tokens: [
        { id: 's1', edge: 'kv-settings', tone: 'ok' },
        { id: 's2', edge: 'settings-prod', tone: 'ok' },
      ],
      chips: [
        { label: 'parameters.json', value: 'no securestring', tone: 'warn' },
        { label: 'use', value: '@Microsoft.KeyVault(...)', tone: 'ok' },
      ],
    },
    connections: {
      visible: ['params', 'settings', 'prod', 'params-prod', 'settings-prod'],
      highlight: ['params', 'settings'],
      tokens: [
        { id: 'c1', edge: 'params-prod', tone: 'info' },
        { id: 'c2', edge: 'settings-prod', tone: 'info' },
      ],
      chips: [
        { label: 'connections.json', value: '@parameters · @appsetting' },
        { label: 'per env', value: 'own API conn + policy' },
      ],
    },
    promote: {
      visible: [...zipFlow],
      highlight: ['zip', 'zip-dev', 'zip-test', 'zip-prod'],
      tokens: [
        { id: 'pr1', edge: 'zip-dev', tone: 'info' },
        { id: 'pr2', edge: 'zip-test', tone: 'info' },
        { id: 'pr3', edge: 'zip-prod', tone: 'ok' },
      ],
      chips: [
        { label: 'artifact', value: 'same app.zip everywhere', tone: 'ok' },
      ],
    },
    recap: {
      visible: [...zipFlow, 'bicep', 'params', 'settings', 'kv', 'kv-settings', 'bicep-prod', 'params-prod', 'settings-prod'],
      chips: [
        { label: 'code', value: '1 immutable zip' },
        { label: 'config', value: 'per environment', tone: 'ok' },
      ],
    },
  },
  legend: [
    { tone: 'info', label: 'non-prod / config' },
    { tone: 'ok', label: 'promoted / secured' },
  ],
};
