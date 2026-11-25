import type { Scene } from '../../../../lessons/scene-types';

// Spoke network with two subnets, a hub firewall that all outbound traffic goes through, a NAT gateway
// for a fixed IP, and the things that break if the firewall or vault rules are wrong.
const base = ['app', 'spokeBox', 'intsub', 'app-intsub'];
const hub = ['hubBox', 'fw', 'intsub-fw', 'cloud', 'fw-cloud'];
const subnets = ['pesub'];
const fixed = ['nat', 'partner', 'intsub-nat', 'nat-partner'];
const vault = ['kv', 'intsub-kv'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'spokeBox', label: 'Spoke network', x: 230, y: 40, w: 330, h: 300 },
    { id: 'hubBox', label: 'Hub network', x: 590, y: 40, w: 290, h: 160 },
  ],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Order logic app', sublabel: 'Standard', x: 110, y: 120 },
    { id: 'intsub', kind: 'hosting-plan', label: 'Integration sub', sublabel: 'delegated · /26', x: 395, y: 120 },
    { id: 'pesub', kind: 'keyvault', label: 'Endpoint subnet', sublabel: 'no delegation', x: 330, y: 270 },
    { id: 'fw', kind: 'keyvault', label: 'Azure Firewall', sublabel: 'allow rules', x: 735, y: 120 },
    { id: 'cloud', kind: 'connector-managed', label: 'Managed API', sublabel: 'AzureConnectors', x: 800, y: 430 },
    { id: 'kv', kind: 'keyvault', label: 'Key Vault', sublabel: 'network rules', x: 560, y: 430 },
    { id: 'nat', kind: 'hosting-plan', label: 'NAT gateway', sublabel: 'fixed IP', x: 110, y: 300 },
    { id: 'partner', kind: 'user', label: 'Partner API', sublabel: 'allow-lists IP', x: 110, y: 440 },
  ],
  edges: [
    { id: 'app-intsub', from: 'app', to: 'intsub', label: 'out' },
    { id: 'intsub-fw', from: 'intsub', to: 'fw', label: 'route table' },
    { id: 'fw-cloud', from: 'fw', to: 'cloud' },
    { id: 'intsub-kv', from: 'intsub', to: 'kv' },
    { id: 'intsub-nat', from: 'intsub', to: 'nat' },
    { id: 'nat-partner', from: 'nat', to: 'partner' },
  ],
  steps: {
    problem: {
      visible: [...base, ...hub, ...vault, 'partner'],
      failed: ['cloud', 'kv'],
      tokens: [{ id: 'p1', edge: 'intsub-fw', tone: 'info' }, { id: 'p2', edge: 'fw-cloud', tone: 'fail' }, { id: 'p3', edge: 'intsub-kv', tone: 'fail' }],
      chips: [{ label: 'managed connectors', value: 'failing', tone: 'fail' }, { label: 'Key Vault refs', value: 'not resolving', tone: 'fail' }, { label: 'partner', value: 'wants one IP', tone: 'warn' }],
    },
    subnets: {
      visible: [...base, ...subnets],
      highlight: ['intsub', 'pesub'],
      chips: [{ label: 'VNet integration', value: 'delegated subnet' }, { label: 'private endpoints', value: 'no delegation' }, { label: 'so', value: 'two subnets', tone: 'ok' }],
    },
    forced: {
      visible: [...base, ...subnets, ...hub],
      highlight: ['intsub-fw', 'fw'],
      tokens: [{ id: 'f1', edge: 'app-intsub', tone: 'info' }, { id: 'f2', edge: 'intsub-fw', tone: 'info' }, { id: 'f3', edge: 'fw-cloud', tone: 'ok' }],
      chips: [{ label: 'route table', value: 'all outbound to firewall' }, { label: 'firewall must allow', value: 'storage · connections · connectors', tone: 'warn' }],
    },
    tags: {
      visible: [...base, ...hub],
      highlight: ['fw', 'cloud'],
      chips: [{ label: 'LogicAppsManagement', value: 'inbound' }, { label: 'LogicApps', value: 'outbound' }, { label: 'AzureConnectors', value: 'managed connectors', tone: 'ok' }],
    },
    fqdns: {
      visible: [...base, ...hub],
      highlight: ['app'],
      chips: [{ label: 'IPs', value: 'Settings > Networking' }, { label: 'domain names', value: 'connectionRuntimeUrl' }],
    },
    nat: {
      visible: [...base, ...subnets, ...fixed],
      highlight: ['nat', 'partner'],
      tokens: [{ id: 'n1', edge: 'app-intsub', tone: 'info' }, { id: 'n2', edge: 'intsub-nat', tone: 'info' }, { id: 'n3', edge: 'nat-partner', tone: 'ok' }],
      chips: [{ label: 'NAT gateway', value: 'static public IP', tone: 'ok' }, { label: 'needs', value: 'route all' }, { label: 'firewall in path', value: 'its IP instead (ours)', tone: 'warn' }],
    },
    keyvault: {
      visible: [...base, ...subnets, ...vault],
      highlight: ['kv', 'intsub-kv'],
      tokens: [{ id: 'k1', edge: 'intsub-kv', tone: 'ok' }],
      chips: [{ label: 'resolved at', value: 'startup (configuration)' }, { label: 'vault allows', value: 'the virtual network', tone: 'ok' }, { label: 'not', value: 'public outbound IPs', tone: 'warn' }],
    },
    inbound: {
      visible: [...base, ...hub],
      highlight: ['cloud'],
      chips: [{ label: 'webhook callbacks', value: 'allow AzureConnectors' }, { label: 'Office 365', value: 'caller is the connector' }],
    },
    checklist: {
      visible: [...base, ...subnets, ...hub, ...fixed, ...vault],
      chips: [{ label: 'before go-live', value: 'subnets · firewall · NAT · vault' }],
    },
    recap: {
      visible: [...base, ...subnets, ...hub, ...fixed, ...vault],
      chips: [{ label: 'rules', value: 'service tags, not IP lists' }],
    },
  },
  legend: [
    { tone: 'info', label: 'outbound' },
    { tone: 'ok', label: 'allowed' },
    { tone: 'fail', label: 'blocked' },
  ],
};
