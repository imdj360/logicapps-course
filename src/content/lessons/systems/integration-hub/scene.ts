import type { Scene } from '../../../../lessons/scene-types';

const hub = ['erp', 'topic', 'crm', 'billing', 'erp-topic', 'topic-crm', 'topic-billing'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'publishes once', x: 110, y: 240 },
    { id: 'topic', kind: 'servicebus', label: 'Topic', sublabel: 'order shipped', x: 380, y: 240 },
    { id: 'crm', kind: 'trigger', label: 'CRM workflow', sublabel: 'subscription', x: 680, y: 130 },
    { id: 'billing', kind: 'trigger', label: 'Billing flow', sublabel: 'subscription', x: 680, y: 350 },
    { id: 'eg', kind: 'connector-managed', label: 'Event Grid', sublabel: 'managed trigger', x: 380, y: 80 },
    { id: 'eh', kind: 'servicebus', label: 'Event Hubs', sublabel: '≤1,000/min/conn', x: 380, y: 420 },
    { id: 'apim', kind: 'keyvault', label: 'API Mgmt', sublabel: 'front door', x: 110, y: 80 },
  ],
  edges: [
    { id: 'erp-topic', from: 'erp', to: 'topic' },
    { id: 'topic-crm', from: 'topic', to: 'crm' },
    { id: 'topic-billing', from: 'topic', to: 'billing' },
    { id: 'eg-crm', from: 'eg', to: 'crm', style: 'dashed' },
    { id: 'eh-billing', from: 'eh', to: 'billing', style: 'dashed' },
    { id: 'apim-erp', from: 'apim', to: 'erp', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['erp', 'crm', 'billing'],
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
      visible: [...hub, 'apim', 'apim-erp'],
      highlight: ['apim'],
      chips: [{ label: 'allow calls', value: "from APIM's IP (classic tiers)" }],
    },
    recap: {
      visible: [...hub, 'eg', 'eh', 'apim', 'eg-crm', 'eh-billing', 'apim-erp'],
      chips: [{ label: 'publish', value: 'once' }, { label: 'subscribe', value: 'freely' }],
    },
  },
  legend: [{ tone: 'info', label: 'published' }, { tone: 'ok', label: 'delivered' }],
};
