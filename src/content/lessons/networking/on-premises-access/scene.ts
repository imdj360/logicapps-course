import type { Scene } from '../../../../lessons/scene-types';

// Two routes into the datacenter: built-in SQL over VNet integration and a VPN/ExpressRoute link,
// or a managed connector through the on-premises data gateway (which connects out over Service Bus).
const base = ['appBox', 'dcBox', 'trig', 'trig-builtin', 'builtin-or-managed', 'builtin', 'managed', 'sql'];
const route1 = ['subnet', 'builtin-subnet', 'subnet-sql'];
const route2 = ['cloud', 'gw', 'managed-cloud', 'cloud-gw', 'gw-sql'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'appBox', label: 'Standard logic app', x: 30, y: 30, w: 300, h: 300 },
    { id: 'dcBox', label: 'Company datacenter', x: 520, y: 300, w: 360, h: 180, labelAlign: 'end' },
  ],
  nodes: [
    { id: 'trig', kind: 'trigger', label: 'Order received', sublabel: 'Request', x: 180, y: 100 },
    { id: 'builtin', kind: 'connector-builtin', label: 'Insert row', sublabel: 'SQL · built-in', x: 180, y: 200 },
    { id: 'managed', kind: 'connector-managed', label: 'Insert row', sublabel: 'SQL · managed', x: 180, y: 290 },
    { id: 'subnet', kind: 'hosting-plan', label: 'App subnet', sublabel: 'VNet + VPN/ER', x: 430, y: 200 },
    { id: 'cloud', kind: 'connector-managed', label: 'Managed API', sublabel: 'Azure', x: 430, y: 420 },
    { id: 'sql', kind: 'storage', label: 'ERP SQL Server', sublabel: 'on-premises', x: 780, y: 360 },
    { id: 'gw', kind: 'hosting-plan', label: 'Data gateway', sublabel: 'installed here', x: 620, y: 440 },
    { id: 'p-sql', kind: 'storage', label: 'ERP SQL Server', sublabel: 'not in Azure', x: 700, y: 200 },
  ],
  edges: [
    { id: 'trig-builtin', from: 'trig', to: 'builtin' },
    { id: 'builtin-or-managed', from: 'builtin', to: 'managed', style: 'dashed', label: 'or' },
    { id: 'p-trig-sql', from: 'trig', to: 'p-sql', style: 'dashed' },
    { id: 'builtin-subnet', from: 'builtin', to: 'subnet' },
    { id: 'subnet-sql', from: 'subnet', to: 'sql', label: 'no gateway' },
    { id: 'managed-cloud', from: 'managed', to: 'cloud' },
    { id: 'cloud-gw', from: 'cloud', to: 'gw', style: 'dashed' },
    { id: 'gw-sql', from: 'gw', to: 'sql' },
  ],
  steps: {
    problem: {
      visible: ['appBox', 'trig', 'p-sql', 'p-trig-sql'],
      highlight: ['p-sql'],
      tokens: [{ id: 'p1', edge: 'p-trig-sql', tone: 'fail' }],
      chips: [{ label: 'ERP database', value: 'in the datacenter' }, { label: 'logic app', value: "can't see it", tone: 'fail' }],
    },
    'two-routes': {
      visible: [...base, ...route1, ...route2],
      highlight: ['builtin', 'managed'],
      chips: [{ label: 'built-in', value: 'no gateway', tone: 'ok' }, { label: 'managed only', value: 'gateway required', tone: 'warn' }],
    },
    'built-in': {
      visible: [...base, ...route1],
      highlight: ['builtin', 'subnet', 'subnet-sql'],
      tokens: [{ id: 'b1', edge: 'trig-builtin', tone: 'info' }, { id: 'b2', edge: 'builtin-subnet', tone: 'info' }, { id: 'b3', edge: 'subnet-sql', tone: 'ok' }],
      chips: [{ label: 'needs', value: 'VNet integration' }, { label: 'link to datacenter', value: 'VPN / ExpressRoute (ours)' }],
    },
    gateway: {
      visible: [...base, ...route2],
      highlight: ['gw', 'managed'],
      tokens: [{ id: 'g1', edge: 'managed-cloud', tone: 'info' }, { id: 'g2', edge: 'cloud-gw', tone: 'info' }, { id: 'g3', edge: 'gw-sql', tone: 'ok' }],
      chips: [{ label: 'data sources', value: 'SQL · Oracle · SAP · DB2 · MQ ...' }],
    },
    how: {
      visible: [...base, ...route2],
      highlight: ['gw', 'cloud-gw'],
      tokens: [{ id: 'h1', edge: 'cloud-gw', tone: 'info' }],
      chips: [{ label: 'gateway connects', value: 'outbound · Service Bus' }, { label: 'proxy · firewall', value: 'can block it', tone: 'warn' }],
    },
    setup: {
      visible: [...base, ...route2],
      highlight: ['gw'],
      chips: [{ label: 'per computer', value: 'one gateway' }, { label: 'Azure resource', value: 'same account · same region' }],
    },
    rules: {
      visible: [...base, ...route2],
      highlight: ['gw'],
      chips: [{ label: 'service principals', value: 'not supported', tone: 'warn' }, { label: 'subscriptions', value: 'same tenant' }],
    },
    ha: {
      visible: [...base, ...route2],
      highlight: ['gw'],
      chips: [{ label: 'high availability', value: 'gateway cluster' }, { label: 'gateway cost', value: 'none extra', tone: 'ok' }],
    },
    recap: {
      visible: [...base, ...route1, ...route2],
      chips: [{ label: 'built-in', value: 'over the network' }, { label: 'managed', value: 'data gateway' }],
    },
  },
  legend: [
    { tone: 'info', label: 'call' },
    { tone: 'ok', label: 'reached' },
    { tone: 'fail', label: 'no route' },
  ],
};
