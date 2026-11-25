import type { Scene } from '../../../../lessons/scene-types';

// The logic app reaches its own storage account through the integration subnet and four storage
// private endpoints inside your virtual network.
const app = ['app'];
const net = ['vnetBox', 'subnet', 'app-subnet'];
const eps = ['table', 'queue', 'blob', 'file', 'subnet-table', 'subnet-queue', 'subnet-blob', 'subnet-file',
  'table-storage', 'queue-storage', 'blob-storage', 'file-storage', 'storage'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'vnetBox', label: 'Your virtual network', x: 230, y: 30, w: 440, h: 440 },
  ],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Order logic app', sublabel: 'Standard', x: 110, y: 250 },
    { id: 'subnet', kind: 'hosting-plan', label: 'App subnet', sublabel: '443·445 open', x: 340, y: 250 },
    { id: 'table', kind: 'keyvault', label: 'Table endpoint', sublabel: 'private', x: 560, y: 90 },
    { id: 'queue', kind: 'keyvault', label: 'Queue endpoint', sublabel: 'private', x: 560, y: 195 },
    { id: 'blob', kind: 'keyvault', label: 'Blob endpoint', sublabel: 'private', x: 560, y: 300 },
    { id: 'file', kind: 'keyvault', label: 'File endpoint', sublabel: 'SMB share', x: 560, y: 405 },
    { id: 'storage', kind: 'storage', label: 'Storage', sublabel: 'no public', x: 800, y: 250 },
    { id: 'p-storage', kind: 'storage', label: 'Storage', sublabel: 'public', x: 600, y: 250 },
  ],
  edges: [
    { id: 'p-app-storage', from: 'app', to: 'p-storage', style: 'dashed', label: 'public' },
    { id: 'app-subnet', from: 'app', to: 'subnet' },
    { id: 'subnet-table', from: 'subnet', to: 'table' },
    { id: 'subnet-queue', from: 'subnet', to: 'queue' },
    { id: 'subnet-blob', from: 'subnet', to: 'blob' },
    { id: 'subnet-file', from: 'subnet', to: 'file' },
    { id: 'table-storage', from: 'table', to: 'storage' },
    { id: 'queue-storage', from: 'queue', to: 'storage' },
    { id: 'blob-storage', from: 'blob', to: 'storage' },
    { id: 'file-storage', from: 'file', to: 'storage' },
  ],
  steps: {
    problem: {
      visible: [...app, 'p-storage', 'p-app-storage'],
      highlight: ['p-storage'],
      tokens: [{ id: 'p1', edge: 'p-app-storage', tone: 'info' }],
      chips: [{ label: 'storage', value: 'required by Standard' }, { label: 'policy', value: 'no public access', tone: 'warn' }],
    },
    idea: {
      visible: [...app, ...net, ...eps],
      highlight: ['subnet', 'storage'],
      tokens: [{ id: 'i1', edge: 'app-subnet', tone: 'info' }, { id: 'i2', edge: 'subnet-blob', tone: 'info' }, { id: 'i3', edge: 'blob-storage', tone: 'ok' }],
      chips: [{ label: 'storage traffic', value: 'stays in your network', tone: 'ok' }],
    },
    four: {
      visible: [...app, ...net, ...eps],
      highlight: ['table', 'queue', 'blob', 'file'],
      tokens: [
        { id: 'f1', edge: 'subnet-table', tone: 'info' }, { id: 'f2', edge: 'subnet-queue', tone: 'info' },
        { id: 'f3', edge: 'subnet-blob', tone: 'info' }, { id: 'f4', edge: 'subnet-file', tone: 'info' },
      ],
      chips: [{ label: 'private endpoints', value: 'one per service' }, { label: 'services', value: 'Table · Queue · Blob · File' }],
    },
    portal: {
      visible: [...app, ...net, ...eps],
      highlight: ['storage', 'app-subnet'],
      chips: [{ label: 'needs', value: 'temporary public access', tone: 'warn' }, { label: 'app setting', value: 'WEBSITE_CONTENTOVERVNET = 1' }],
    },
    arm: {
      visible: [...app, ...net, ...eps],
      highlight: ['vnetBox', 'storage'],
      chips: [{ label: 'ARM template', value: 'never public', tone: 'ok' }, { label: 'includes', value: 'private DNS zones · file share' }],
    },
    ports: {
      visible: [...app, ...net, ...eps],
      highlight: ['subnet'],
      tokens: [{ id: 'o1', edge: 'subnet-file', tone: 'info' }, { id: 'o2', edge: 'file-storage', tone: 'ok' }],
      chips: [{ label: '443', value: 'storage' }, { label: '445', value: 'SMB file share' }, { label: '20000–30000', value: 'between workers' }],
    },
    errors: {
      visible: [...app, ...net, ...eps],
      highlight: ['app'],
      failed: ['app'],
      chips: [{ label: 'workflows', value: "don't load", tone: 'fail' }, { label: 'Kudu console', value: 'not available', tone: 'warn' }],
    },
    fix: {
      visible: [...app, ...net, ...eps],
      highlight: ['file', 'storage'],
      chips: [{ label: 'check', value: 'WEBSITE_CONTENT* settings' }, { label: 'detectors', value: 'Logic App Down · Network' }],
    },
    recap: {
      visible: [...app, ...net, ...eps],
      chips: [{ label: 'storage', value: 'four private endpoints' }, { label: 'reached via', value: 'VNet integration' }],
    },
  },
  legend: [
    { tone: 'info', label: 'storage traffic' },
    { tone: 'ok', label: 'reached privately' },
    { tone: 'fail', label: 'app down' },
  ],
};
