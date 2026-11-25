import type { Scene } from '../../../../lessons/scene-types';

// The logic app on the left, your virtual network on the right. Built-in calls go through the
// integration subnet. With route-all on (the default) the managed Outlook call also leaves through the
// subnet, on its way to the managed API service outside the network.
const app = ['appBox', 'trig', 'http', 'sql', 'trig-http', 'http-sql'];
const vnet = ['vnetBox', 'api', 'db'];
const wired = ['subnet', 'http-subnet', 'sql-subnet', 'subnet-api', 'subnet-db'];
const managed = ['mail', 'cloud', 'sql-mail', 'mail-subnet', 'subnet-cloud'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'appBox', label: 'Standard logic app', x: 30, y: 40, w: 300, h: 430 },
    { id: 'vnetBox', label: 'Your virtual network', x: 410, y: 40, w: 470, h: 300 },
  ],
  nodes: [
    { id: 'trig', kind: 'trigger', label: 'Order received', sublabel: 'Request', x: 180, y: 110 },
    { id: 'http', kind: 'connector-builtin', label: 'Call warehouse', sublabel: 'HTTP · built-in', x: 180, y: 210 },
    { id: 'sql', kind: 'connector-builtin', label: 'Save order', sublabel: 'SQL · built-in', x: 180, y: 310 },
    { id: 'mail', kind: 'connector-managed', label: 'Email customer', sublabel: 'Outlook managed', x: 180, y: 410 },
    { id: 'subnet', kind: 'hosting-plan', label: 'App subnet', sublabel: '/26 recommended', x: 510, y: 210 },
    { id: 'api', kind: 'user', label: 'Warehouse API', sublabel: '10.0.1.3', x: 760, y: 140 },
    { id: 'db', kind: 'storage', label: 'SQL Server', sublabel: 'private IP', x: 760, y: 270 },
    { id: 'cloud', kind: 'connector-managed', label: 'Managed API', sublabel: 'Azure service', x: 640, y: 420 },
  ],
  edges: [
    { id: 'trig-http', from: 'trig', to: 'http' },
    { id: 'http-sql', from: 'http', to: 'sql' },
    { id: 'sql-mail', from: 'sql', to: 'mail' },
    { id: 'http-api', from: 'http', to: 'api', style: 'dashed' },
    { id: 'http-subnet', from: 'http', to: 'subnet' },
    { id: 'sql-subnet', from: 'sql', to: 'subnet' },
    { id: 'subnet-api', from: 'subnet', to: 'api' },
    { id: 'subnet-db', from: 'subnet', to: 'db' },
    { id: 'mail-subnet', from: 'mail', to: 'subnet' },
    { id: 'subnet-cloud', from: 'subnet', to: 'cloud', style: 'dashed', label: 'allow its IPs' },
  ],
  steps: {
    problem: {
      visible: [...app, ...vnet, 'http-api'],
      highlight: ['http', 'api'],
      failed: ['http'],
      tokens: [{ id: 'p1', edge: 'trig-http', tone: 'info' }, { id: 'p2', edge: 'http-api', tone: 'fail' }],
      chips: [{ label: 'call to 10.0.1.3', value: 'fails', tone: 'fail' }, { label: 'why', value: 'runs in the cloud' }],
    },
    idea: {
      visible: [...app, ...vnet, ...wired],
      highlight: ['subnet'],
      tokens: [{ id: 'i1', edge: 'http-subnet', tone: 'info' }, { id: 'i2', edge: 'subnet-api', tone: 'ok' }],
      chips: [{ label: 'outbound calls', value: 'start inside your network', tone: 'ok' }],
    },
    'outbound-only': {
      visible: [...app, ...vnet, ...wired],
      highlight: ['http-subnet', 'subnet-api'],
      tokens: [{ id: 'o1', edge: 'http-subnet', tone: 'info' }, { id: 'o2', edge: 'subnet-api', tone: 'ok' }],
      chips: [{ label: 'changes', value: 'outbound only' }, { label: 'inbound', value: 'still public: next lesson', tone: 'warn' }],
    },
    setup: {
      visible: [...app, ...vnet, ...wired],
      highlight: ['subnet', 'api'],
      tokens: [{ id: 's1', edge: 'trig-http', tone: 'info' }, { id: 's2', edge: 'http-subnet', tone: 'info' }, { id: 's3', edge: 'subnet-api', tone: 'ok' }],
      chips: [{ label: 'portal', value: 'Networking > Outbound traffic' }, { label: 'call to 10.0.1.3', value: 'succeeds', tone: 'ok' }],
    },
    subnet: {
      visible: [...app, ...vnet, ...wired],
      highlight: ['subnet'],
      chips: [{ label: 'recommended', value: '/26 · 64 addresses' }, { label: 'portal minimum', value: '/27' }, { label: 'resize later', value: 'not possible', tone: 'warn' }],
    },
    'route-all': {
      visible: [...app, ...vnet, ...wired, ...managed],
      highlight: ['subnet', 'http-subnet', 'sql-subnet', 'mail-subnet'],
      chips: [{ label: 'default', value: 'all outbound via the VNet' }, { label: 'applies', value: 'firewall · NSG · UDR', tone: 'warn' }],
    },
    connectors: {
      visible: [...app, ...vnet, ...wired, ...managed],
      highlight: ['http', 'sql', 'mail', 'cloud'],
      tokens: [{ id: 'c1', edge: 'sql-subnet', tone: 'info' }, { id: 'c2', edge: 'subnet-db', tone: 'ok' }, { id: 'c3', edge: 'mail-subnet', tone: 'info' }, { id: 'c4', edge: 'subnet-cloud', tone: 'info' }],
      chips: [{ label: 'built-in', value: 'through the VNet', tone: 'ok' }, { label: 'managed', value: 'allow regional IPs', tone: 'warn' }],
    },
    dns: {
      visible: [...app, ...vnet, ...wired],
      highlight: ['subnet'],
      chips: [{ label: 'own DNS', value: 'WEBSITE_DNS_SERVER' }, { label: 'secondary', value: 'WEBSITE_DNS_ALT_SERVER' }],
    },
    recap: {
      visible: [...app, ...vnet, ...wired, ...managed],
      chips: [{ label: 'VNet integration', value: 'outbound' }, { label: 'next', value: 'private endpoints (inbound)' }],
    },
  },
  legend: [
    { tone: 'info', label: 'outbound call' },
    { tone: 'ok', label: 'reached' },
    { tone: 'fail', label: 'blocked' },
  ],
};
