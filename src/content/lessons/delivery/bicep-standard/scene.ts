import type { Scene } from '../../../../lessons/scene-types';

const infraCore = ['infraBox', 'plan', 'storage', 'ai', 'site', 'plan-site', 'storage-site', 'ai-site'];
const codeCore = ['codeBox', 'wf', 'connjson', 'wf-site'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'infraBox', label: 'Infrastructure (Bicep)', x: 25, y: 35, w: 545, h: 430 },
    { id: 'codeBox', label: 'Code (workflow zip)', x: 615, y: 35, w: 260, h: 430 },
  ],
  nodes: [
    // Infrastructure (Bicep)
    { id: 'plan', kind: 'hosting-plan', label: 'WS1 Plan (ASP)', sublabel: 'serverfarms', x: 135, y: 115 },
    { id: 'storage', kind: 'storage', label: 'StorageV2', sublabel: 'state · queues', x: 135, y: 245 },
    { id: 'ai', kind: 'appinsights', label: 'App Insights', sublabel: 'telemetry', x: 135, y: 375 },
    { id: 'site', kind: 'hosting-plan', label: 'Logic App', sublabel: 'workflowapp', x: 420, y: 145 },
    { id: 'conn', kind: 'connector-managed', label: 'API connection', sublabel: 'kind: V2', x: 420, y: 280 },
    { id: 'policy', kind: 'keyvault', label: 'Access policy', sublabel: 'principalId', x: 420, y: 405 },

    // Code (workflow zip) & AVM
    { id: 'wf', kind: 'trigger', label: 'Workflows', sublabel: 'host · params', x: 745, y: 145 },
    { id: 'connjson', kind: 'action', label: 'connections.json', sublabel: 'ManagedIdentity', x: 745, y: 280 },
    { id: 'avm', kind: 'scope', label: 'AVM modules', sublabel: 'br/public:avm', x: 745, y: 245 },
  ],
  edges: [
    { id: 'plan-site', from: 'plan', to: 'site' },
    { id: 'storage-site', from: 'storage', to: 'site' },
    { id: 'ai-site', from: 'ai', to: 'site', style: 'dashed' },
    { id: 'site-conn', from: 'site', to: 'conn' },
    { id: 'policy-conn', from: 'policy', to: 'conn', style: 'dashed', label: 'allows MI' },
    { id: 'avm-site', from: 'avm', to: 'site', style: 'dashed' },
    { id: 'wf-site', from: 'wf', to: 'site', label: 'zip deploy' },
    { id: 'connjson-conn', from: 'connjson', to: 'conn', style: 'dashed', label: 'refs V2' },
    { id: 'wf-connjson', from: 'wf', to: 'connjson' },
  ],
  steps: {
    problem: {
      visible: ['plan', 'storage', 'ai', 'site'],
      highlight: ['site'],
      chips: [
        { label: 'portal click-ops', value: 'hidden resources', tone: 'warn' },
        { label: 'result', value: 'env drift', tone: 'fail' },
      ],
    },
    split: {
      visible: [...infraCore, ...codeCore, 'conn', 'policy', 'site-conn', 'policy-conn', 'connjson-conn', 'wf-connjson'],
      highlight: ['infraBox', 'codeBox'],
      chips: [
        { label: 'infra (Bicep)', value: 'ASP · storage · app · policy' },
        { label: 'code (zip)', value: 'workflows · connections.json' },
      ],
    },
    plan: {
      visible: [...infraCore],
      highlight: ['plan', 'plan-site'],
      tokens: [{ id: 'pl1', edge: 'plan-site', tone: 'info' }],
      chips: [
        { label: 'type', value: 'Microsoft.Web/serverfarms' },
        { label: 'sku', value: 'WS1 · WorkflowStandard', tone: 'ok' },
      ],
    },
    storage: {
      visible: [...infraCore],
      highlight: ['storage', 'storage-site'],
      tokens: [{ id: 'st1', edge: 'storage-site', tone: 'info' }],
      chips: [
        { label: 'kind', value: 'StorageV2' },
        { label: 'security', value: 'HTTPS · TLS 1.2' },
      ],
    },
    site: {
      visible: [...infraCore],
      highlight: ['site'],
      tokens: [
        { id: 'si1', edge: 'plan-site', tone: 'ok' },
        { id: 'si2', edge: 'storage-site', tone: 'ok' },
      ],
      chips: [
        { label: 'kind', value: 'functionapp,workflowapp', tone: 'ok' },
        { label: 'settings', value: 'APP_KIND · ~4 · storage' },
      ],
    },
    connections: {
      visible: [...infraCore, 'conn', 'site-conn'],
      highlight: ['conn', 'site-conn'],
      tokens: [{ id: 'cn1', edge: 'site-conn', tone: 'info' }],
      chips: [
        { label: 'type', value: 'Microsoft.Web/connections' },
        { label: 'kind', value: 'V2' },
      ],
    },
    'access-policy': {
      visible: [...infraCore, 'conn', 'policy', 'site-conn', 'policy-conn'],
      highlight: ['policy', 'policy-conn'],
      tokens: [{ id: 'ap1', edge: 'policy-conn', tone: 'ok' }],
      chips: [
        { label: 'child resource', value: 'connections/accessPolicies', tone: 'ok' },
        { label: 'missing policy', value: 'runtime failure', tone: 'fail' },
      ],
    },
    code: {
      visible: [...infraCore, ...codeCore, 'conn', 'policy', 'site-conn', 'policy-conn', 'connjson-conn', 'wf-connjson'],
      highlight: ['codeBox', 'wf', 'connjson', 'policy'],
      tokens: [
        { id: 'co1', edge: 'wf-site', tone: 'info' },
        { id: 'co2', edge: 'wf-connjson', tone: 'info' },
        { id: 'co3', edge: 'connjson-conn', tone: 'ok' },
        { id: 'co4', edge: 'policy-conn', tone: 'ok' },
      ],
      chips: [
        { label: 'connections.json', value: 'ManagedServiceIdentity', tone: 'ok' },
        { label: 'authorized by', value: 'Bicep access policy' },
      ],
    },
    avm: {
      visible: [...infraCore, 'avm', 'avm-site'],
      highlight: ['avm', 'avm-site'],
      tokens: [{ id: 'av1', edge: 'avm-site', tone: 'ok' }],
      chips: [
        { label: 'registry', value: 'br/public:avm/res/...' },
        { label: 'benefit', value: 'PEs + secure defaults', tone: 'ok' },
      ],
    },
    recap: {
      visible: [...infraCore, ...codeCore, 'conn', 'policy', 'site-conn', 'policy-conn', 'connjson-conn', 'wf-connjson'],
      chips: [
        { label: 'infra', value: 'Bicep (ASP · storage · app · policy)' },
        { label: 'code', value: 'zip (workflows · connections.json)', tone: 'ok' },
      ],
    },
  },
  legend: [
    { tone: 'info', label: 'provisions / deploys' },
    { tone: 'ok', label: 'authorized / ready' },
  ],
};
