import type { Scene } from '../../../../lessons/scene-types';

const core = ['wf', 'jdbc', 'db', 'wf-jdbc', 'jdbc-db'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'wf', kind: 'trigger', label: 'Every hour', sublabel: 'workflow', x: 110, y: 240 },
    { id: 'jdbc', kind: 'connector-builtin', label: 'JDBC', sublabel: 'Execute query', x: 380, y: 240 },
    { id: 'jar', kind: 'storage', label: 'Driver JARs', sublabel: 'SDK (Java)', x: 380, y: 410 },
    { id: 'db', kind: 'storage', label: 'MySQL', sublabel: 'your database', x: 680, y: 240 },
    { id: 'ora', kind: 'connector-builtin', label: 'Oracle DB', sublabel: 'preview', x: 380, y: 80 },
    { id: 'oradb', kind: 'storage', label: 'Oracle 11+', sublabel: 'host:port/svc', x: 680, y: 80 },
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
      chips: [{ label: 'database', value: 'no dedicated connector', tone: 'warn' }],
    },
    what: {
      visible: [...core],
      highlight: ['jdbc'],
      tokens: [{ id: 'w1', edge: 'jdbc-db', tone: 'ok' }],
      chips: [{ label: 'available', value: 'Standard only' }, { label: 'data gateway', value: 'not needed', tone: 'ok' }],
    },
    driver: {
      visible: [...core, 'jar', 'jar-jdbc'],
      highlight: ['jar', 'jar-jdbc'],
      tokens: [{ id: 'd1', edge: 'jar-jdbc', tone: 'info' }],
      chips: [{ label: 'artifact', value: 'Client or SDK Assembly (Java)' }, { label: 'folder', value: 'lib/builtinOperationSdks/JAR' }],
    },
    package: {
      visible: [...core, 'jar', 'jar-jdbc'],
      highlight: ['jar', 'jar-jdbc'],
      tokens: [{ id: 'pk1', edge: 'jar-jdbc', tone: 'ok' }],
      chips: [{ label: 'project folder', value: 'lib/builtinOperationSdks/JAR' }, { label: 'deploy', value: 'zip, project at root' }],
    },
    connect: {
      visible: [...core, 'jar', 'jar-jdbc'],
      highlight: ['jdbc-db'],
      chips: [{ label: 'connection', value: 'URL · user · password' }, { label: 'URL format', value: "from your driver's docs", tone: 'warn' }],
    },
    oracle: {
      visible: [...core, 'jar', 'oradb', 'jar-jdbc', 'jdbc-oradb'],
      highlight: ['jdbc-oradb', 'oradb', 'jar'],
      tokens: [{ id: 'or1', edge: 'jdbc-oradb', tone: 'ok' }],
      chips: [{ label: 'driver', value: "Oracle's ojdbc JAR" }, { label: 'URL', value: 'jdbc:oracle:thin:@//host:1521/svc' }, { label: 'format from', value: "Oracle's docs" }],
    },
    actions: {
      visible: [...core],
      highlight: ['jdbc'],
      tokens: [{ id: 'a1', edge: 'wf-jdbc', tone: 'info' }, { id: 'a2', edge: 'jdbc-db', tone: 'info' }],
      chips: [{ label: 'actions', value: 'Execute query · Get tables · Get schema' }, { label: 'triggers', value: 'none' }],
    },
    params: {
      visible: [...core],
      highlight: ['jdbc'],
      chips: [{ label: 'values', value: 'query parameters', tone: 'ok' }, { label: 'not', value: 'string concatenation', tone: 'fail' }],
    },
    alternatives: {
      visible: [...core, 'ora', 'oradb', 'wf-ora', 'ora-oradb'],
      highlight: ['ora', 'ora-oradb'],
      tokens: [{ id: 'o1', edge: 'ora-oradb', tone: 'ok' }],
      chips: [{ label: 'SQL Server', value: 'built-in adds triggers · MI' }, { label: 'Oracle', value: 'JDBC or built-in (preview)' }],
    },
    network: {
      visible: [...core, 'ora', 'oradb', 'wf-ora', 'ora-oradb'],
      highlight: ['jdbc-db', 'ora-oradb'],
      chips: [{ label: 'needs', value: 'network path from runtime' }, { label: 'private DB', value: 'VNet integration · hybrid' }],
    },
    gaps: {
      visible: [...core, 'jar', 'jar-jdbc'],
      chips: [{ label: 'not on Learn', value: 'Java version · URL examples' }, { label: 'so', value: 'test first', tone: 'warn' }],
    },
    recap: {
      visible: [...core, 'jar', 'ora', 'oradb', 'jar-jdbc', 'wf-ora', 'ora-oradb', 'jdbc-oradb'],
      chips: [{ label: 'generic', value: 'JDBC: MySQL · Oracle' }, { label: 'dedicated', value: 'SQL Server · Oracle' }],
    },
  },
  legend: [
    { tone: 'info', label: 'query' },
    { tone: 'ok', label: 'connected' },
  ],
};
