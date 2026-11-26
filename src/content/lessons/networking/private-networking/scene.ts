import type { Scene } from '../../../../lessons/scene-types';

// Inbound only. Callers on the network reach the app through the private endpoint; the internet,
// managed webhooks and outside deployments can't.
const core = ['vnetBox', 'caller', 'pe', 'app', 'caller-pe', 'pe-app'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'vnetBox', label: 'Your virtual network', x: 30, y: 150, w: 450, h: 300 },
  ],
  nodes: [
    { id: 'caller', kind: 'user', label: 'Internal app', sublabel: 'on the network', x: 140, y: 230 },
    { id: 'vm', kind: 'user', label: 'Test VM', sublabel: 'same VNet', x: 140, y: 370 },
    { id: 'pe', kind: 'keyvault', label: 'Private endpt', sublabel: 'private IP', x: 370, y: 300 },
    { id: 'app', kind: 'hosting-plan', label: 'Order logic app', sublabel: 'Request trigger', x: 690, y: 300 },
    { id: 'internet', kind: 'user', label: 'Internet', sublabel: 'anyone', x: 690, y: 70 },
    { id: 'webhook', kind: 'connector-managed', label: 'Event Grid', sublabel: 'managed webhook', x: 370, y: 70 },
    { id: 'github', kind: 'action', label: 'GitHub repo', sublabel: 'Deployment Ctr', x: 690, y: 440 },
  ],
  edges: [
    { id: 'caller-pe', from: 'caller', to: 'pe' },
    { id: 'vm-pe', from: 'vm', to: 'pe' },
    { id: 'pe-app', from: 'pe', to: 'app' },
    { id: 'internet-app', from: 'internet', to: 'app', style: 'dashed' },
    { id: 'webhook-app', from: 'webhook', to: 'app', style: 'dashed' },
    { id: 'github-app', from: 'github', to: 'app', label: 'Azure builds' },
  ],
  steps: {
    problem: {
      visible: ['app', 'internet', 'internet-app'],
      highlight: ['internet-app'],
      tokens: [{ id: 'p1', edge: 'internet-app', tone: 'info' }],
      chips: [{ label: 'Request trigger URL', value: 'callable from anywhere', tone: 'warn' }],
    },
    idea: {
      visible: [...core],
      highlight: ['pe'],
      tokens: [{ id: 'i1', edge: 'caller-pe', tone: 'info' }, { id: 'i2', edge: 'pe-app', tone: 'ok' }],
      chips: [{ label: 'private endpoint', value: 'private IP in your VNet', tone: 'ok' }],
    },
    'inbound-only': {
      visible: [...core],
      highlight: ['pe-app'],
      chips: [{ label: 'changes', value: 'inbound only' }, { label: 'subnet', value: 'no delegations' }],
    },
    setup: {
      visible: [...core],
      highlight: ['pe'],
      chips: [{ label: 'portal', value: 'Networking > Inbound traffic' }, { label: 'trigger', value: 'Request · HTTP + Webhook' }],
    },
    test: {
      visible: [...core, 'vm', 'vm-pe', 'internet', 'internet-app'],
      highlight: ['vm', 'internet-app'],
      tokens: [{ id: 't1', edge: 'internet-app', tone: 'fail' }, { id: 't2', edge: 'vm-pe', tone: 'info' }, { id: 't3', edge: 'pe-app', tone: 'ok' }],
      chips: [{ label: 'from outside', value: '403 Forbidden', tone: 'warn' }, { label: 'from the VM', value: 'works', tone: 'ok' }],
    },
    breaks: {
      visible: [...core, 'webhook', 'webhook-app'],
      highlight: ['webhook'],
      failed: ['webhook'],
      tokens: [{ id: 'b1', edge: 'webhook-app', tone: 'fail' }],
      chips: [{ label: 'managed webhooks', value: "can't reach in", tone: 'fail' }, { label: 'Outlook trigger', value: 'hourly', tone: 'warn' }],
    },
    deploy: {
      visible: [...core, 'github', 'github-app'],
      highlight: ['github', 'github-app'],
      tokens: [{ id: 'd1', edge: 'github-app', tone: 'ok' }],
      chips: [{ label: 'VS Code · CLI', value: 'only from inside', tone: 'warn' }, { label: 'WEBSITE_RUN_FROM_PACKAGE', value: 'remove or 0' }],
    },
    restrictions: {
      visible: ['app', 'internet', 'internet-app'],
      highlight: ['app', 'internet-app'],
      tokens: [{ id: 'r1', edge: 'internet-app', tone: 'info' }],
      chips: [{ label: 'public, but', value: 'access restrictions' }, { label: 'run history', value: 'IP ranges' }],
    },
    recap: {
      visible: [...core, 'vm', 'vm-pe', 'webhook', 'webhook-app', 'github', 'github-app'],
      failed: ['webhook'],
      chips: [{ label: 'inbound', value: 'private endpoint' }, { label: 'outbound', value: 'VNet integration lesson' }],
    },
  },
  legend: [
    { tone: 'info', label: 'call' },
    { tone: 'ok', label: 'allowed' },
    { tone: 'fail', label: 'blocked' },
  ],
};
