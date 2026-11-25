import type { Scene } from '../../../../lessons/scene-types';

// One architecture map: the logic app above your virtual network, its storage on the left, managed
// connectors in Azure on the right, the datacenter below. Each step lights up one path.
const core = ['azBox', 'app', 'vnetBox', 'pe', 'subnet', 'caller', 'caller-pe', 'pe-app', 'app-subnet'];
const all = [
  ...core, 'stpe', 'storage', 'api', 'cloud', 'onpremBox', 'onsql', 'gw',
  'subnet-api', 'subnet-stpe', 'stpe-storage', 'subnet-cloud', 'subnet-onsql', 'cloud-gw', 'gw-onsql',
];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    // On a Workflow Service Plan the app runs on shared App Service infrastructure, outside your network.
    { id: 'azBox', label: 'App Service · WS plan', x: 340, y: 6, w: 220, h: 100 },
    { id: 'vnetBox', label: 'Your virtual network', x: 190, y: 140, w: 520, h: 220 },
    { id: 'onpremBox', label: 'Datacenter', x: 190, y: 390, w: 520, h: 100 },
  ],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Order logic app', sublabel: 'Standard', x: 450, y: 65 },
    { id: 'caller', kind: 'user', label: 'Internal app', sublabel: 'on the network', x: 90, y: 200 },
    { id: 'pe', kind: 'keyvault', label: 'Private endpt', sublabel: 'inbound', x: 300, y: 200 },
    { id: 'subnet', kind: 'hosting-plan', label: 'App subnet', sublabel: 'outbound', x: 600, y: 200 },
    { id: 'stpe', kind: 'keyvault', label: 'Storage endpts', sublabel: '4 services', x: 300, y: 305 },
    { id: 'api', kind: 'user', label: 'Internal API', sublabel: '10.0.1.3', x: 600, y: 305 },
    { id: 'storage', kind: 'storage', label: 'Storage', sublabel: 'no public', x: 90, y: 305 },
    { id: 'cloud', kind: 'connector-managed', label: 'Managed API', sublabel: 'Azure', x: 815, y: 200 },
    { id: 'onsql', kind: 'storage', label: 'ERP SQL Server', sublabel: 'datacenter', x: 300, y: 445 },
    { id: 'gw', kind: 'hosting-plan', label: 'Data gateway', sublabel: 'for managed', x: 600, y: 445 },
    // Problem-only: the same app before anything is private.
    { id: 'p-storage', kind: 'storage', label: 'Storage', sublabel: 'public', x: 200, y: 240 },
    { id: 'p-internet', kind: 'user', label: 'Internet', sublabel: 'anyone', x: 700, y: 240 },
    { id: 'p-erp', kind: 'storage', label: 'ERP SQL Server', sublabel: 'datacenter', x: 450, y: 420 },
  ],
  edges: [
    { id: 'caller-pe', from: 'caller', to: 'pe' },
    { id: 'pe-app', from: 'pe', to: 'app', label: 'in' },
    { id: 'app-subnet', from: 'app', to: 'subnet', label: 'out' },
    { id: 'subnet-api', from: 'subnet', to: 'api' },
    { id: 'subnet-stpe', from: 'subnet', to: 'stpe' },
    { id: 'stpe-storage', from: 'stpe', to: 'storage' },
    { id: 'subnet-cloud', from: 'subnet', to: 'cloud', style: 'dashed' },
    { id: 'subnet-onsql', from: 'subnet', to: 'onsql', label: 'VPN / ER' },
    { id: 'cloud-gw', from: 'cloud', to: 'gw', style: 'dashed' },
    { id: 'gw-onsql', from: 'gw', to: 'onsql', style: 'dashed' },
    { id: 'p-internet-app', from: 'p-internet', to: 'app', style: 'dashed', label: 'public' },
    { id: 'p-app-storage', from: 'app', to: 'p-storage', style: 'dashed', label: 'public' },
    { id: 'p-app-erp', from: 'app', to: 'p-erp', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['app', 'p-storage', 'p-internet', 'p-erp', 'p-internet-app', 'p-app-storage', 'p-app-erp'],
      highlight: ['app'],
      tokens: [{ id: 'p1', edge: 'p-internet-app', tone: 'info' }, { id: 'p2', edge: 'p-app-erp', tone: 'fail' }],
      chips: [{ label: 'rule 1', value: 'nothing public', tone: 'warn' }, { label: 'rule 2', value: 'reach the ERP', tone: 'warn' }],
    },
    map: {
      visible: [...all],
      highlight: ['vnetBox'],
      chips: [{ label: 'paths', value: 'in · out · storage · managed · on-prem' }],
    },
    inbound: {
      visible: [...all],
      highlight: ['caller', 'pe', 'caller-pe', 'pe-app'],
      tokens: [{ id: 'i1', edge: 'caller-pe', tone: 'info' }, { id: 'i2', edge: 'pe-app', tone: 'ok' }],
      chips: [{ label: 'feature', value: 'private endpoint' }, { label: 'from outside', value: '403 Forbidden', tone: 'warn' }],
    },
    outbound: {
      visible: [...all],
      highlight: ['subnet', 'app-subnet', 'subnet-api', 'api'],
      tokens: [{ id: 'o1', edge: 'app-subnet', tone: 'info' }, { id: 'o2', edge: 'subnet-api', tone: 'ok' }],
      chips: [{ label: 'feature', value: 'VNet integration' }, { label: 'inbound vs outbound', value: 'independent' }],
    },
    storage: {
      visible: [...all],
      highlight: ['stpe', 'storage', 'subnet-stpe', 'stpe-storage'],
      tokens: [{ id: 's1', edge: 'app-subnet', tone: 'info' }, { id: 's2', edge: 'subnet-stpe', tone: 'info' }, { id: 's3', edge: 'stpe-storage', tone: 'ok' }],
      chips: [{ label: 'storage', value: 'required by Standard' }, { label: 'private endpoints', value: 'Table · Queue · Blob · File' }],
    },
    managed: {
      visible: [...all],
      highlight: ['cloud', 'subnet-cloud'],
      tokens: [{ id: 'm1', edge: 'app-subnet', tone: 'info' }, { id: 'm2', edge: 'subnet-cloud', tone: 'info' }],
      chips: [{ label: 'managed connectors', value: 'outside your network' }, { label: 'firewall · NSG · UDR', value: 'allow their IPs', tone: 'warn' }],
    },
    onprem: {
      visible: [...all],
      highlight: ['onsql', 'subnet-onsql', 'gw', 'cloud-gw', 'gw-onsql'],
      tokens: [{ id: 'n1', edge: 'app-subnet', tone: 'info' }, { id: 'n2', edge: 'subnet-onsql', tone: 'ok' }, { id: 'n3', edge: 'gw-onsql', tone: 'info' }],
      chips: [{ label: 'built-in', value: 'over the network', tone: 'ok' }, { label: 'managed only', value: 'data gateway' }],
    },
    order: {
      visible: [...all],
      highlight: ['subnet'],
      chips: [{ label: 'our order', value: 'outbound → storage → inbound' }],
    },
    recap: {
      visible: [...all],
      chips: [{ label: 'in', value: 'private endpoint' }, { label: 'out', value: 'VNet integration' }],
    },
  },
  legend: [
    { tone: 'info', label: 'traffic' },
    { tone: 'ok', label: 'reached privately' },
    { tone: 'fail', label: 'not reachable' },
  ],
};
