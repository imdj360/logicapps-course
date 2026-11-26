import type { Scene } from '../../../../lessons/scene-types';

// Two routes into the datacenter: built-in SQL over VNet integration and a VPN/ExpressRoute link,
// or a managed connector through the on-premises data gateway (which connects out over Service Bus).
const base = ['appBox', 'dcBox', 'trig', 'trig-builtin', 'builtin-or-managed', 'builtin', 'managed', 'sql'];
const route1 = ['subnet', 'builtin-subnet', 'subnet-sql'];
const route2 = ['cloud', 'gw', 'managed-cloud', 'gw-cloud', 'gw-sql'];

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
    { id: 'cloud', kind: 'connector-managed', label: 'Managed API', sublabel: 'Azure', x: 250, y: 440 },
    { id: 'sql', kind: 'storage', label: 'ERP SQL Server', sublabel: 'on-premises', x: 780, y: 360 },
    { id: 'gw', kind: 'hosting-plan', label: 'Data gateway', sublabel: 'installed here', x: 620, y: 440 },
    { id: 'rec', kind: 'trigger', label: 'Every 5 min', sublabel: 'Recurrence', x: 180, y: 100 },
    { id: 'sftpget', kind: 'connector-managed', label: 'Get file', sublabel: 'partner SFTP', x: 180, y: 200 },
    { id: 'archive', kind: 'storage', label: 'Blob archive', sublabel: 'built-in', x: 430, y: 200 },
    { id: 'createfile', kind: 'connector-managed', label: 'Create file', sublabel: 'File System', x: 180, y: 290 },
    { id: 'fsb', kind: 'connector-builtin', label: 'Create file', sublabel: 'built-in', x: 180, y: 200 },
    { id: 'fsm', kind: 'connector-managed', label: 'Create file', sublabel: 'managed', x: 180, y: 290 },
    { id: 'share', kind: 'storage', label: 'File share', sublabel: 'partner/OUT', x: 780, y: 360 },
    { id: 'p-sql', kind: 'storage', label: 'ERP SQL Server', sublabel: 'not in Azure', x: 700, y: 200 },
  ],
  edges: [
    { id: 'trig-builtin', from: 'trig', to: 'builtin' },
    { id: 'builtin-or-managed', from: 'builtin', to: 'managed', style: 'dashed', label: 'or' },
    { id: 'p-trig-sql', from: 'trig', to: 'p-sql', style: 'dashed' },
    { id: 'builtin-subnet', from: 'builtin', to: 'subnet' },
    { id: 'subnet-sql', from: 'subnet', to: 'sql', label: 'no gateway' },
    { id: 'managed-cloud', from: 'managed', to: 'cloud' },
    { id: 'gw-cloud', from: 'gw', to: 'cloud', style: 'dashed', label: 'polls out' },
    { id: 'gw-sql', from: 'gw', to: 'sql' },
    { id: 'rec-sftpget', from: 'rec', to: 'sftpget' },
    { id: 'sftpget-create', from: 'sftpget', to: 'createfile', label: 'for each' },
    { id: 'sftpget-archive', from: 'sftpget', to: 'archive', label: 'copy' },
    { id: 'create-cloud', from: 'createfile', to: 'cloud' },
    { id: 'gw-share', from: 'gw', to: 'share' },
    { id: 'rec-fsb', from: 'rec', to: 'fsb' },
    { id: 'fsb-or-fsm', from: 'fsb', to: 'fsm', style: 'dashed', label: 'or' },
    { id: 'fsb-subnet', from: 'fsb', to: 'subnet' },
    { id: 'subnet-share', from: 'subnet', to: 'share', label: 'SMB 445' },
    { id: 'fsm-cloud', from: 'fsm', to: 'cloud' },
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
    which: {
      visible: [...base, ...route1, ...route2],
      highlight: ['subnet', 'gw'],
      chips: [{ label: 'VPN or ExpressRoute?', value: 'yes: built-in', tone: 'ok' }, { label: 'no network path', value: 'data gateway' }, { label: 'gateway needs', value: 'no inbound ports', tone: 'ok' }],
    },
    'built-in': {
      visible: [...base, ...route1],
      highlight: ['builtin', 'subnet', 'subnet-sql'],
      tokens: [{ id: 'b1', edge: 'trig-builtin', tone: 'info' }, { id: 'b2', edge: 'builtin-subnet', tone: 'info' }, { id: 'b3', edge: 'subnet-sql', tone: 'ok' }],
      chips: [{ label: 'needs', value: 'VNet integration' }, { label: 'link to datacenter', value: 'VPN / ExpressRoute' }],
    },
    gateway: {
      visible: [...base, ...route2],
      highlight: ['gw', 'managed'],
      tokens: [{ id: 'g1', edge: 'managed-cloud', tone: 'info' }, { id: 'g2', edge: 'gw-cloud', tone: 'info' }, { id: 'g3', edge: 'gw-sql', tone: 'ok' }],
      chips: [{ label: 'data sources', value: 'SQL · Oracle · SAP · DB2 · MQ ...' }],
    },
    how: {
      visible: [...base, ...route2],
      highlight: ['gw', 'gw-cloud'],
      tokens: [{ id: 'h1', edge: 'gw-cloud', tone: 'info' }],
      chips: [{ label: 'gateway', value: 'polls out · no inbound' }, { label: 'outbound ports', value: '80 · 443 · 1433 · 5671-2 · 9350-54' }, { label: 'proxy · firewall', value: 'allow them', tone: 'warn' }],
    },
    setup: {
      visible: [...base, ...route2],
      highlight: ['gw'],
      chips: [{ label: 'per computer', value: 'one gateway' }, { label: 'Azure resource', value: 'same account · same region' }],
    },
    example: {
      visible: ['appBox', 'dcBox', 'rec', 'sftpget', 'archive', 'createfile', 'cloud', 'gw', 'share', 'rec-sftpget', 'sftpget-archive', 'sftpget-create', 'create-cloud', 'gw-cloud', 'gw-share'],
      highlight: ['createfile', 'gw', 'share'],
      tokens: [
        { id: 'x0', edge: 'rec-sftpget', tone: 'info' }, { id: 'x1', edge: 'sftpget-create', tone: 'info' }, { id: 'x2', edge: 'create-cloud', tone: 'info' },
        { id: 'x3', edge: 'gw-cloud', tone: 'info' }, { id: 'x4', edge: 'gw-share', tone: 'ok' },
      ],
      chips: [{ label: 'from', value: 'partner SFTP' }, { label: 'to', value: 'File System (managed) via gateway' }, { label: 'then', value: 'delete from SFTP' }],
    },
    'file-share': {
      visible: ['appBox', 'dcBox', 'rec', 'fsb', 'fsm', 'subnet', 'cloud', 'gw', 'share',
        'rec-fsb', 'fsb-or-fsm', 'fsb-subnet', 'subnet-share', 'fsm-cloud', 'gw-cloud', 'gw-share'],
      highlight: ['fsb', 'fsm', 'share'],
      tokens: [
        { id: 'f1', edge: 'rec-fsb', tone: 'info' }, { id: 'f2', edge: 'fsb-subnet', tone: 'info' }, { id: 'f3', edge: 'subnet-share', tone: 'ok' },
        { id: 'f4', edge: 'gw-cloud', tone: 'info' }, { id: 'f5', edge: 'gw-share', tone: 'ok' },
      ],
      chips: [{ label: 'built-in', value: 'VNet · SMB 445 · no gateway', tone: 'ok' }, { label: 'managed', value: 'data gateway · same domain' }, { label: 'both', value: 'Windows shares · no mapped drives', tone: 'warn' }],
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
