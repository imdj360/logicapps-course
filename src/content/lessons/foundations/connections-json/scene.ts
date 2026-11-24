import type { Scene } from '../../../../lessons/scene-types';

const core = ['wf', 'cj', 'wf-cj'];
const kinds = ['sp', 'mg', 'fn', 'cj-sp', 'cj-mg', 'cj-fn'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'wf', kind: 'action', label: 'workflow.json', sublabel: 'connectionName', x: 110, y: 240 },
    { id: 'cj', kind: 'storage', label: 'connections.json', sublabel: 'project', x: 350, y: 240 },
    { id: 'sp', kind: 'connector-builtin', label: 'Service Bus', sublabel: 'serviceProvider', x: 600, y: 90 },
    { id: 'mg', kind: 'connector-managed', label: 'Office 365', sublabel: 'managedApi', x: 600, y: 240 },
    { id: 'fn', kind: 'action', label: 'Azure Function', sublabel: 'function', x: 600, y: 390 },
    { id: 'api', kind: 'keyvault', label: 'API connection', sublabel: 'Microsoft.Web', x: 810, y: 240 },
    { id: 'appset', kind: 'keyvault', label: 'App settings', sublabel: '@appsetting', x: 350, y: 410 },
    { id: 'local', kind: 'storage', label: 'local.settings', sublabel: 'dev keys', x: 110, y: 410 },
  ],
  edges: [
    { id: 'wf-cj', from: 'wf', to: 'cj' },
    { id: 'cj-sp', from: 'cj', to: 'sp' },
    { id: 'cj-mg', from: 'cj', to: 'mg' },
    { id: 'cj-fn', from: 'cj', to: 'fn' },
    { id: 'mg-api', from: 'mg', to: 'api' },
    { id: 'appset-cj', from: 'appset', to: 'cj', style: 'dashed' },
    { id: 'local-appset', from: 'local', to: 'appset', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core, 'sp', 'mg', 'cj-sp', 'cj-mg'],
      failed: ['mg'],
      chips: [{ label: 'VS Code', value: 'works', tone: 'ok' }, { label: 'Azure', value: 'Office 365 fails', tone: 'fail' }],
    },
    what: {
      visible: [...core],
      highlight: ['cj'],
      chips: [{ label: 'holds', value: 'connection metadata · endpoints' }, { label: 'written by', value: 'the designer' }],
    },
    kinds: {
      visible: [...core, ...kinds],
      highlight: ['sp', 'mg', 'fn'],
      tokens: [{ id: 'k1', edge: 'cj-sp', tone: 'info' }, { id: 'k2', edge: 'cj-mg', tone: 'info' }, { id: 'k3', edge: 'cj-fn', tone: 'info' }],
      chips: [{ label: 'built-in', value: 'serviceProviderConnections' }, { label: 'managed', value: 'managedApiConnections' }, { label: 'functions', value: 'functionConnections' }],
    },
    builtin: {
      visible: [...core, ...kinds, 'appset', 'appset-cj'],
      highlight: ['sp', 'cj-sp', 'appset', 'appset-cj', 'wf-cj'],
      tokens: [{ id: 'b1', edge: 'wf-cj', tone: 'info' }, { id: 'b2', edge: 'cj-sp', tone: 'ok' }],
      chips: [{ label: 'secret', value: '@appsetting(...)' }, { label: 'action uses', value: 'connectionName' }],
    },
    managed: {
      visible: [...core, ...kinds, 'api', 'mg-api'],
      highlight: ['mg', 'api', 'mg-api'],
      tokens: [{ id: 'm1', edge: 'mg-api', tone: 'info' }],
      chips: [{ label: 'connection', value: 'separate Azure resource' }, { label: 'type', value: 'Microsoft.Web/connections' }],
    },
    local: {
      visible: [...core, ...kinds, 'api', 'mg-api', 'appset', 'local', 'appset-cj', 'local-appset'],
      failed: ['mg'],
      highlight: ['local', 'local-appset'],
      chips: [{ label: 'local auth', value: 'raw key' }, { label: 'expires', value: 'after 7 days', tone: 'warn' }, { label: 'Azure needs', value: 'access policy', tone: 'warn' }],
    },
    identity: {
      visible: [...core, ...kinds, 'api', 'mg-api'],
      highlight: ['mg', 'api', 'mg-api'],
      tokens: [{ id: 'i1', edge: 'mg-api', tone: 'ok' }],
      chips: [{ label: 'auth', value: 'ManagedServiceIdentity', tone: 'ok' }, { label: 'system-assigned', value: 'on by default' }],
    },
    params: {
      visible: [...core, ...kinds, 'appset', 'appset-cj'],
      highlight: ['cj', 'appset-cj'],
      chips: [{ label: 'allowed', value: '@parameters · @appsetting' }, { label: 'parameterized', value: 'designer restricted', tone: 'warn' }],
    },
    secrets: {
      visible: [...core, ...kinds, 'appset', 'local', 'appset-cj', 'local-appset'],
      highlight: ['appset', 'local'],
      chips: [{ label: 'secrets', value: 'app settings · Key Vault' }, { label: 'local.settings.json', value: 'not in source control', tone: 'warn' }],
    },
    recap: {
      visible: [...core, ...kinds, 'api', 'appset', 'local', 'mg-api', 'appset-cj', 'local-appset'],
      chips: [{ label: 'file', value: 'connections.json' }, { label: 'secrets', value: 'app settings' }],
    },
  },
  legend: [
    { tone: 'info', label: 'reference' },
    { tone: 'ok', label: 'authenticated' },
    { tone: 'failed', label: 'fails in Azure' },
  ],
};
