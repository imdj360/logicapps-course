import type { Scene } from '../../../../lessons/scene-types';

const hub = ['erp', 'topic', 'crm', 'billing', 'erp-topic', 'topic-crm', 'topic-billing'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'publishes once', x: 110, y: 285 },
    { id: 'topic', kind: 'servicebus', label: 'Topic', sublabel: 'order shipped', x: 380, y: 285 },
    { id: 'crm', kind: 'trigger', label: 'CRM workflow', sublabel: 'subscription', x: 680, y: 165 },
    { id: 'billing', kind: 'trigger', label: 'Billing flow', sublabel: 'subscription', x: 680, y: 385 },
    { id: 'eg', kind: 'connector-managed', label: 'Event Grid', sublabel: 'managed trigger', x: 380, y: 165 },
    { id: 'eh', kind: 'servicebus', label: 'Event Hubs', sublabel: '≤1,000/min/conn', x: 380, y: 415 },
    { id: 'p-erp', kind: 'user', label: 'ERP', sublabel: 'calls warehouse', x: 110, y: 240 },
    { id: 'wh', kind: 'user', label: 'Warehouse', sublabel: 'calls CRM', x: 380, y: 240 },
    { id: 'p-crm', kind: 'user', label: 'CRM', sublabel: 'calls billing', x: 680, y: 130 },
    { id: 'p-billing', kind: 'user', label: 'Billing', x: 680, y: 350 },
    { id: 'apim', kind: 'keyvault', label: 'API Mgmt', sublabel: 'front door', x: 110, y: 65 },
    { id: 'api-wf', kind: 'trigger', label: 'API workflow', sublabel: 'HTTP trigger', x: 380, y: 65 },
  ],
  edges: [
    { id: 'erp-topic', from: 'erp', to: 'topic' },
    { id: 'topic-crm', from: 'topic', to: 'crm' },
    { id: 'topic-billing', from: 'topic', to: 'billing' },
    { id: 'eg-crm', from: 'eg', to: 'crm', style: 'dashed' },
    { id: 'eh-billing', from: 'eh', to: 'billing', style: 'dashed' },
    { id: 'apim-apiwf', from: 'apim', to: 'api-wf', style: 'dashed', label: 'callers' },
    { id: 'erp-wh', from: 'p-erp', to: 'wh' },
    { id: 'wh-crm', from: 'wh', to: 'p-crm' },
    { id: 'crm-billing', from: 'p-crm', to: 'p-billing' },
  ],
  steps: {
    problem: {
      visible: ['p-erp', 'wh', 'p-crm', 'p-billing', 'erp-wh', 'wh-crm', 'crm-billing'],
      chips: [{ label: 'today', value: 'point to point', tone: 'warn' }],
    },
    reference: {
      visible: [...hub],
      highlight: ['topic'],
      chips: [{ label: 'patterns', value: 'load leveling · pub/sub' }],
    },
    topics: {
      visible: [...hub],
      highlight: ['topic-crm', 'topic-billing'],
      tokens: [{ id: 't1', edge: 'erp-topic', tone: 'info' }, { id: 't2', edge: 'topic-crm', tone: 'ok' }, { id: 't3', edge: 'topic-billing', tone: 'ok' }],
      chips: [{ label: 'trigger', value: 'topic subscription (peek-lock)' }, { label: 'tier', value: 'Standard · Premium' }],
    },
    eventgrid: {
      visible: [...hub, 'eg', 'eg-crm'],
      highlight: ['eg', 'eg-crm'],
      tokens: [{ id: 'e1', edge: 'eg-crm', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'managed webhook' }, { label: 'private endpoint only', value: "won't fire", tone: 'warn' }],
    },
    eventhubs: {
      visible: [...hub, 'eh', 'eh-billing'],
      highlight: ['eh', 'eh-billing'],
      tokens: [{ id: 'h1', edge: 'eh-billing', tone: 'info' }],
      chips: [{ label: 'per run', value: 'one partition' }, { label: 'update trigger', value: 'position resets', tone: 'warn' }],
    },
    small: {
      visible: [...hub],
      highlight: ['crm', 'billing'],
      chips: [{ label: 'our rule', value: 'one workflow per job' }],
    },
    front: {
      visible: [...hub, 'apim', 'api-wf', 'apim-apiwf'],
      highlight: ['apim', 'api-wf', 'apim-apiwf'],
      tokens: [{ id: 'f1', edge: 'apim-apiwf', tone: 'info' }],
      chips: [{ label: 'allow calls', value: "from APIM's IP (classic tiers)" }],
    },
    recap: {
      visible: [...hub, 'eg', 'eh', 'apim', 'api-wf', 'eg-crm', 'eh-billing', 'apim-apiwf'],
      chips: [{ label: 'publish', value: 'once' }, { label: 'subscribe', value: 'freely' }],
    },
  },
  legend: [{ tone: 'info', label: 'published' }, { tone: 'ok', label: 'delivered' }],
};
