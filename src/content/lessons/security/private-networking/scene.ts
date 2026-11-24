import type { Scene } from '../../../../lessons/scene-types';

const core = ['caller', 'pe', 'app', 'caller-pe', 'pe-app'];
const out = ['vnet', 'db', 'app-vnet', 'vnet-db'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'caller', kind: 'user', label: 'Internal app', sublabel: 'in the VNet', x: 110, y: 240 },
    { id: 'pe', kind: 'keyvault', label: 'Private endpt', sublabel: 'inbound', x: 330, y: 240 },
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'Standard', x: 560, y: 240 },
    { id: 'vnet', kind: 'keyvault', label: 'VNet integr.', sublabel: 'outbound', x: 560, y: 410 },
    { id: 'db', kind: 'storage', label: 'Private DB', sublabel: '10.0.0.4', x: 800, y: 410 },
    { id: 'internet', kind: 'user', label: 'Internet', sublabel: '403', x: 330, y: 80 },
    { id: 'webhook', kind: 'connector-managed', label: 'Event Grid', sublabel: 'webhook', x: 800, y: 80 },
    { id: 'storage', kind: 'storage', label: 'Storage', sublabel: '443 · 445', x: 800, y: 240 },
  ],
  edges: [
    { id: 'caller-pe', from: 'caller', to: 'pe' },
    { id: 'pe-app', from: 'pe', to: 'app' },
    { id: 'app-vnet', from: 'app', to: 'vnet' },
    { id: 'vnet-db', from: 'vnet', to: 'db' },
    { id: 'internet-pe', from: 'internet', to: 'pe', style: 'dashed' },
    { id: 'webhook-app', from: 'webhook', to: 'app', style: 'dashed' },
    { id: 'app-storage', from: 'app', to: 'storage' },
  ],
  steps: {
    problem: {
      visible: ['caller', 'app', 'db'],
      chips: [{ label: 'rule', value: 'nothing public' }],
    },
    directions: {
      visible: [...core, ...out],
      highlight: ['pe', 'vnet'],
      chips: [{ label: 'inbound', value: 'private endpoint' }, { label: 'outbound', value: 'VNet integration' }],
    },
    inbound: {
      visible: [...core, 'internet', 'internet-pe'],
      highlight: ['pe', 'caller-pe'],
      tokens: [{ id: 'i1', edge: 'caller-pe', tone: 'ok' }, { id: 'i2', edge: 'internet-pe', tone: 'fail' }],
      chips: [{ label: 'from outside', value: '403 Forbidden', tone: 'warn' }],
    },
    breaks: {
      visible: [...core, 'webhook', 'webhook-app'],
      failed: ['webhook'],
      chips: [{ label: 'managed webhooks', value: "can't reach in", tone: 'fail' }, { label: 'deploy from', value: 'inside the VNet' }],
    },
    outbound: {
      visible: [...core, ...out],
      highlight: ['vnet', 'vnet-db'],
      tokens: [{ id: 'o1', edge: 'app-vnet', tone: 'ok' }, { id: 'o2', edge: 'vnet-db', tone: 'ok' }],
      chips: [{ label: 'subnet', value: '/26 recommended' }, { label: 'portal minimum', value: '/27' }],
    },
    managed: {
      visible: [...core, ...out],
      highlight: ['app-vnet'],
      chips: [{ label: 'allow outbound', value: 'managed connector IPs', tone: 'warn' }],
    },
    storage: {
      visible: [...core, ...out, 'storage', 'app-storage'],
      highlight: ['storage', 'app-storage'],
      chips: [{ label: 'ports', value: '443 · 445 · 20000–30000' }],
    },
    dns: {
      visible: [...core, ...out],
      chips: [{ label: 'own DNS', value: 'WEBSITE_DNS_SERVER' }],
    },
    restrictions: {
      visible: [...core, 'internet', 'internet-pe'],
      chips: [{ label: 'public, but', value: 'access restrictions' }],
    },
    recap: {
      visible: [...core, ...out, 'storage', 'app-storage'],
      chips: [{ label: 'traffic', value: 'private both ways' }],
    },
  },
  legend: [{ tone: 'ok', label: 'private traffic' }, { tone: 'fail', label: 'blocked' }],
};
