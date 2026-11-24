import type { Scene } from '../../../../lessons/scene-types';

const core = ['wf', 'jdbc', 'db', 'wf-jdbc', 'jdbc-db'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'wf', kind: 'trigger', label: 'Every hour', sublabel: 'Recurrence', x: 110, y: 240 },
    { id: 'jdbc', kind: 'connector-builtin', label: 'JDBC', sublabel: 'Execute query', x: 380, y: 240 },
    { id: 'jar', kind: 'storage', label: 'Driver JARs', sublabel: 'SDK (Java)', x: 380, y: 410 },
    { id: 'db', kind: 'storage', label: 'MySQL', sublabel: 'your database', x: 680, y: 240 },
    { id: 'ora', kind: 'connector-builtin', label: 'Oracle DB', sublabel: 'preview', x: 380, y: 80 },
    { id: 'oradb', kind: 'storage', label: 'Oracle', sublabel: 'database', x: 680, y: 80 },
  ],
  edges: [
    { id: 'wf-jdbc', from: 'wf', to: 'jdbc' },
    { id: 'jdbc-db', from: 'jdbc', to: 'db' },
    { id: 'jar-jdbc', from: 'jar', to: 'jdbc', style: 'dashed' },
    { id: 'wf-ora', from: 'wf', to: 'ora', style: 'dashed' },
    { id: 'ora-oradb', from: 'ora', to: 'oradb' },
    { id: 'jdbc-oradb', from: 'jdbc', to: 'oradb', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['wf', 'db'],
      highlight: ['db'],
      chips: [{ label: 'MySQL', value: 'no dedicated connector', tone: 'warn' }],
    },
    what: {
      visible: [...core],
      highlight: ['jdbc'],
      tokens: [{ id: 'w1', edge: 'jdbc-db', tone: 'ok' }],
      chips: [{ label: 'available', value: 'Standard only' }, { label: 'data gateway', value: 'not needed', tone: 'ok' }],
    },
    package: {
      visible: [...core, 'jar', 'jar-jdbc'],
      highlight: ['jar', 'jar-jdbc'],
      tokens: [{ id: 'pk1', edge: 'jar-jdbc', tone: 'info' }],
      chips: [{ label: 'folder', value: 'lib/builtinOperationSdks/JAR' }, { label: 'deploy', value: 'zip with the project' }],
    },
    connect: {
      visible: [...core, 'jar', 'jar-jdbc', 'oradb', 'jdbc-oradb'],
      highlight: ['jdbc-db', 'jdbc-oradb'],
      tokens: [{ id: 'c1', edge: 'jdbc-db', tone: 'ok' }, { id: 'c2', edge: 'jdbc-oradb', tone: 'ok' }],
      chips: [{ label: 'connection', value: 'URL · user · password' }, { label: 'URL format', value: 'from the driver docs', tone: 'warn' }],
    },
    actions: {
      visible: [...core, 'jar', 'jar-jdbc'],
      highlight: ['jdbc'],
      tokens: [{ id: 'a1', edge: 'wf-jdbc', tone: 'info' }, { id: 'a2', edge: 'jdbc-db', tone: 'info' }],
      chips: [{ label: 'actions', value: 'Execute query · Get tables · Get schema' }, { label: 'triggers', value: 'none' }],
    },
    alternatives: {
      visible: [...core, 'ora', 'oradb', 'wf-ora', 'ora-oradb'],
      highlight: ['ora', 'ora-oradb'],
      tokens: [{ id: 'o1', edge: 'ora-oradb', tone: 'ok' }],
      chips: [{ label: 'SQL Server', value: 'own connector: triggers · MI' }, { label: 'Oracle', value: 'own connector (preview) or JDBC' }],
    },
    watch: {
      visible: [...core, 'jar', 'jar-jdbc'],
      highlight: ['jdbc-db'],
      chips: [{ label: 'needs', value: 'network path to the DB' }, { label: 'before you rely on it', value: 'test', tone: 'warn' }],
    },
    recap: {
      visible: [...core, 'jar', 'jar-jdbc', 'oradb', 'jdbc-oradb'],
      chips: [{ label: 'JDBC', value: 'any database with a driver' }],
    },
  },
  legend: [
    { tone: 'info', label: 'query' },
    { tone: 'ok', label: 'connected' },
  ],
};
