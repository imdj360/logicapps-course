import type { Scene } from '../../../../lessons/scene-types';

// Building blocks on one map: the app (outside your network) at the top, your virtual network below it,
// the datacenter at the bottom. Each step adds one block; the combinations show them together.
const appOnly = ['azBox', 'app'];
const outbound = [...appOnly, 'vnetBox', 'subnet', 'api', 'app-subnet', 'subnet-api'];
const inbound = ['caller', 'pe', 'caller-pe', 'pe-app'];
const storage = ['stpe', 'storage', 'subnet-stpe', 'stpe-storage'];
const onprem = ['onpremBox', 'onsql', 'gw', 'cloud', 'subnet-onsql', 'subnet-cloud', 'gw-cloud', 'gw-onsql'];
const egress = ['fw', 'subnet-fw', 'cloud', 'subnet-cloud'];
const hub = ['hubBox', 'fw', 'subnet-fw'];
const all = [...new Set([...outbound, ...inbound, ...storage, ...onprem, ...egress, ...hub])];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    // On a Workflow Service Plan the app runs on shared App Service infrastructure, outside your network.
    { id: 'azBox', label: 'App Service · WS plan', x: 340, y: 6, w: 220, h: 100 },
    { id: 'vnetBox', label: 'Your virtual network', x: 190, y: 140, w: 520, h: 220 },
    { id: 'hubBox', label: 'Hub · peered', x: 728, y: 8, w: 170, h: 118 },
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
    { id: 'fw', kind: 'keyvault', label: 'Firewall · NAT', sublabel: 'egress', x: 815, y: 78 },
    { id: 'cloud', kind: 'connector-managed', label: 'Managed API', sublabel: 'Azure', x: 815, y: 200 },
    { id: 'onsql', kind: 'storage', label: 'ERP SQL Server', sublabel: 'datacenter', x: 300, y: 445 },
    { id: 'gw', kind: 'hosting-plan', label: 'Data gateway', sublabel: 'for managed', x: 600, y: 445 },
    // Problem-only: the same app before anything is private.
    { id: 'p-storage', kind: 'storage', label: 'Storage', sublabel: 'public', x: 200, y: 240 },
    { id: 'p-internet', kind: 'user', label: 'Internet', sublabel: 'SaaS · callers', x: 700, y: 240 },
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
    { id: 'subnet-fw', from: 'subnet', to: 'fw' },
    { id: 'gw-cloud', from: 'gw', to: 'cloud', style: 'dashed', label: 'polls out' },
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
      chips: [{ label: 'project 1', value: 'SaaS only' }, { label: 'project 2', value: 'private database' }, { label: 'project 3', value: 'locked down', tone: 'warn' }],
    },
    idea: {
      visible: [...all],
      highlight: ['vnetBox', 'onpremBox'],
      chips: [{ label: 'building blocks', value: 'mix and match', tone: 'ok' }],
    },
    baseline: {
      visible: [...appOnly, 'p-internet', 'p-storage', 'p-internet-app', 'p-app-storage'],
      highlight: ['azBox'],
      tokens: [{ id: 'b1', edge: 'p-internet-app', tone: 'info' }],
      chips: [{ label: 'runs on', value: 'shared App Service' }, { label: 'your network', value: 'not joined' }, { label: 'ASE v3', value: 'runs inside' }],
    },
    'block-outbound': {
      visible: [...outbound],
      highlight: ['subnet', 'api', 'app-subnet', 'subnet-api'],
      tokens: [{ id: 'o1', edge: 'app-subnet', tone: 'info' }, { id: 'o2', edge: 'subnet-api', tone: 'ok' }],
      chips: [{ label: 'need', value: 'reach private resources' }, { label: 'add', value: 'VNet integration + private DNS', tone: 'ok' }],
    },
    'block-inbound': {
      visible: [...outbound, ...inbound],
      highlight: ['pe', 'caller-pe', 'pe-app'],
      tokens: [{ id: 'i1', edge: 'caller-pe', tone: 'info' }, { id: 'i2', edge: 'pe-app', tone: 'ok' }],
      chips: [{ label: 'need', value: 'no public inbound' }, { label: 'add', value: 'private endpoint', tone: 'ok' }, { label: 'lose', value: 'managed webhooks', tone: 'warn' }],
    },
    'block-storage': {
      visible: [...outbound, ...storage],
      highlight: ['stpe', 'storage'],
      tokens: [{ id: 's1', edge: 'app-subnet', tone: 'info' }, { id: 's2', edge: 'subnet-stpe', tone: 'info' }, { id: 's3', edge: 'stpe-storage', tone: 'ok' }],
      chips: [{ label: 'need', value: 'private storage' }, { label: 'add', value: 'Table · Queue · Blob · File endpoints', tone: 'ok' }],
    },
    'block-onprem': {
      visible: [...outbound, ...onprem],
      highlight: ['onsql', 'subnet-onsql', 'gw'],
      tokens: [
        { id: 'n1', edge: 'app-subnet', tone: 'info' }, { id: 'n2', edge: 'subnet-onsql', tone: 'ok' },
        { id: 'n3', edge: 'subnet-cloud', tone: 'info' }, { id: 'n4', edge: 'gw-cloud', tone: 'info' }, { id: 'n5', edge: 'gw-onsql', tone: 'ok' },
      ],
      chips: [{ label: 'built-in', value: 'VPN / ExpressRoute', tone: 'ok' }, { label: 'managed only', value: 'data gateway' }],
    },
    'block-egress': {
      visible: [...outbound, ...egress],
      highlight: ['fw', 'subnet-fw'],
      tokens: [{ id: 'e1', edge: 'app-subnet', tone: 'info' }, { id: 'e2', edge: 'subnet-fw', tone: 'info' }],
      chips: [{ label: 'need', value: 'central egress · fixed IP' }, { label: 'add', value: 'firewall rules · NAT gateway', tone: 'ok' }],
    },
    'block-hub': {
      visible: [...outbound, ...hub],
      highlight: ['hubBox', 'subnet-fw'],
      tokens: [{ id: 'h1', edge: 'app-subnet', tone: 'info' }, { id: 'h2', edge: 'subnet-fw', tone: 'ok' }],
      chips: [{ label: 'need', value: 'shared firewall · VPN · services' }, { label: 'add', value: 'spoke peered to hub', tone: 'ok' }, { label: 'hub VPN', value: 'gateway transit (ours)' }],
    },
    combos: {
      visible: [...all],
      chips: [{ label: 'SaaS', value: 'baseline' }, { label: 'internal APIs', value: 'outbound (+ egress)' }, { label: 'locked down', value: 'outbound + inbound + storage' }, { label: 'enterprise', value: '+ hub-and-spoke' }],
    },
    recap: {
      visible: [...all],
      chips: [{ label: 'start with', value: 'your requirements' }, { label: 'build first', value: 'the outbound block' }],
    },
  },
  legend: [
    { tone: 'info', label: 'traffic' },
    { tone: 'ok', label: 'reached privately' },
    { tone: 'fail', label: 'not reachable' },
  ],
};
