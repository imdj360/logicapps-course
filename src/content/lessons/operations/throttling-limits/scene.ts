import type { Scene } from '../../../../lessons/scene-types';

const core = ['app', 'conn', 'dest', 'app-conn', 'conn-dest'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'concurrency', x: 110, y: 240 },
    { id: 'conn', kind: 'connector-managed', label: 'Connector', sublabel: 'own limits', x: 400, y: 240 },
    { id: 'dest', kind: 'storage', label: 'Database', sublabel: '15 calls/s', x: 700, y: 240 },
    { id: 'queue', kind: 'servicebus', label: 'Queue', sublabel: 'one inserter', x: 400, y: 410 },
    { id: 'storage', kind: 'storage', label: 'Storage', sublabel: '20k req/s', x: 110, y: 410 },
    { id: 'conn2', kind: 'connector-managed', label: 'Connection 2', sublabel: 'partition', x: 400, y: 90 },
  ],
  edges: [
    { id: 'app-conn', from: 'app', to: 'conn' },
    { id: 'conn-dest', from: 'conn', to: 'dest' },
    { id: 'app-conn2', from: 'app', to: 'conn2', style: 'dashed' },
    { id: 'conn2-dest', from: 'conn2', to: 'dest', style: 'dashed' },
    { id: 'app-queue', from: 'app', to: 'queue', style: 'dashed' },
    { id: 'queue-dest', from: 'queue', to: 'dest', style: 'dashed' },
    { id: 'app-storage', from: 'app', to: 'storage', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core],
      tokens: [{ id: 'p1', edge: 'conn-dest', tone: 'fail' }, { id: 'p2', edge: 'conn-dest', tone: 'fail' }],
      chips: [{ label: 'response', value: '429 Too Many Requests', tone: 'fail' }],
    },
    levels: {
      visible: [...core],
      highlight: ['app', 'conn', 'dest'],
      chips: [{ label: 'levels', value: 'logic app · connector · destination' }],
    },
    resource: {
      visible: [...core],
      highlight: ['app'],
      chips: [{ label: 'action limit (Standard)', value: 'none', tone: 'ok' }, { label: 'trigger concurrency', value: '1–100, irreversible', tone: 'warn' }, { label: 'waiting runs', value: '≤ 200' }],
    },
    connector: {
      visible: [...core, 'conn2', 'app-conn2', 'conn2-dest'],
      highlight: ['conn', 'conn2'],
      tokens: [{ id: 'c1', edge: 'app-conn', tone: 'info' }, { id: 'c2', edge: 'app-conn2', tone: 'info' }],
      chips: [{ label: 'Service Bus connector', value: '6,000 calls/min' }, { label: 'spread', value: 'more connections' }],
    },
    destination: {
      visible: [...core, 'queue', 'app-queue', 'queue-dest'],
      highlight: ['queue', 'queue-dest'],
      tokens: [{ id: 'd1', edge: 'app-queue', tone: 'info' }, { id: 'd2', edge: 'queue-dest', tone: 'ok' }],
      chips: [{ label: '20 parallel vs 15/s', value: 'backlog grows', tone: 'fail' }, { label: 'fix', value: 'queue · parent/child · webhooks', tone: 'ok' }],
    },
    storage: {
      visible: [...core, 'storage', 'app-storage'],
      highlight: ['storage'],
      chips: [{ label: 'storage', value: '20,000 req/s per account' }, { label: 'spread', value: 'workflows · accounts' }],
    },
    sizes: {
      visible: [...core],
      highlight: ['app-conn'],
      chips: [{ label: 'no chunking', value: '100 MB' }, { label: 'chunking (Standard)', value: '1 GB · 52 MB chunks' }],
    },
    apim: {
      visible: [...core],
      highlight: ['app'],
      chips: [{ label: 'via APIM REST API', value: '56 calls / 5 min', tone: 'warn' }, { label: 'instead', value: 'callback URL', tone: 'ok' }],
    },
    recap: {
      visible: [...core, 'queue', 'storage', 'conn2', 'app-conn2', 'conn2-dest', 'app-queue', 'queue-dest', 'app-storage'],
      chips: [{ label: 'find', value: 'which level' }, { label: 'then', value: 'slow the caller' }],
    },
  },
  legend: [
    { tone: 'info', label: 'calls' },
    { tone: 'ok', label: 'paced' },
    { tone: 'fail', label: '429' },
  ],
};
