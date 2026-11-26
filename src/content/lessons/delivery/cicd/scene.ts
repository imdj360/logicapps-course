import type { Scene } from '../../../../lessons/scene-types';

const codePipe = ['repo', 'pipeBox', 'build', 'release', 'test', 'prod', 'repo-build', 'build-release', 'release-test', 'release-prod'];
const infraPipe = ['infra', 'repo-infra', 'infra-test', 'infra-prod'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'pipeBox', label: 'CI/CD pipelines', x: 230, y: 40, w: 430, h: 425 },
  ],
  nodes: [
    { id: 'manual', kind: 'human', label: 'Developer', sublabel: 'portal export', x: 150, y: 245 },
    { id: 'repo', kind: 'storage', label: 'Repository', sublabel: 'infra + code', x: 105, y: 245 },
    { id: 'infra', kind: 'action', label: 'Infra pipeline', sublabel: 'Bicep · ARM', x: 330, y: 105 },
    { id: 'build', kind: 'action', label: 'Build & zip', sublabel: 'app.zip', x: 330, y: 265 },
    { id: 'release', kind: 'condition', label: 'Deploy pipeline', sublabel: 'GitHub · AzDO', x: 560, y: 265 },
    { id: 'conn', kind: 'keyvault', label: 'Connections', sublabel: 'PS + policy', x: 560, y: 415 },
    { id: 'test', kind: 'hosting-plan', label: 'Test', sublabel: 'env + params', x: 790, y: 135 },
    { id: 'prod', kind: 'hosting-plan', label: 'Production', sublabel: 'slot swap', x: 790, y: 355 },
  ],
  edges: [
    { id: 'manual-test', from: 'manual', to: 'test', style: 'dashed', label: 'manual edit' },
    { id: 'manual-prod', from: 'manual', to: 'prod', style: 'dashed', label: 'copy-paste' },
    { id: 'repo-infra', from: 'repo', to: 'infra' },
    { id: 'infra-test', from: 'infra', to: 'test', style: 'dashed' },
    { id: 'infra-prod', from: 'infra', to: 'prod', style: 'dashed' },
    { id: 'repo-build', from: 'repo', to: 'build' },
    { id: 'build-release', from: 'build', to: 'release', label: 'app.zip' },
    { id: 'conn-release', from: 'conn', to: 'release', style: 'dashed', label: 'connections' },
    { id: 'conn-prod', from: 'conn', to: 'prod', style: 'dashed', label: 'policy' },
    { id: 'release-test', from: 'release', to: 'test' },
    { id: 'release-prod', from: 'release', to: 'prod' },
  ],
  steps: {
    problem: {
      visible: ['manual', 'test', 'prod', 'manual-test', 'manual-prod'],
      highlight: ['manual', 'manual-prod'],
      failed: ['prod'],
      tokens: [
        { id: 'p1', edge: 'manual-test', tone: 'info' },
        { id: 'p2', edge: 'manual-prod', tone: 'fail' },
      ],
      chips: [
        { label: 'today', value: 'export & paste', tone: 'warn' },
        { label: 'result', value: 'test & prod drift', tone: 'fail' },
      ],
    },
    separate: {
      visible: [...codePipe, ...infraPipe],
      highlight: ['infra', 'build', 'release'],
      chips: [{ label: 'infrastructure', value: 'Bicep pipeline' }, { label: 'code', value: 'build & deploy zip' }],
    },
    infra: {
      visible: [...codePipe, ...infraPipe],
      highlight: ['infra', 'repo-infra', 'infra-test', 'infra-prod'],
      tokens: [
        { id: 'i1', edge: 'repo-infra', tone: 'info' },
        { id: 'i2', edge: 'infra-test', tone: 'ok' },
        { id: 'i3', edge: 'infra-prod', tone: 'ok' },
      ],
      chips: [{ label: 'stage 1', value: 'provision ASP · storage · app' }, { label: 'includes', value: 'V2 conns + policies' }],
    },
    zip: {
      visible: [...codePipe],
      highlight: ['build', 'repo-build', 'build-release'],
      tokens: [
        { id: 'z1', edge: 'repo-build', tone: 'info' },
        { id: 'z2', edge: 'build-release', tone: 'info' },
      ],
      chips: [{ label: 'zip root', value: 'workflows · host.json' }, { label: 'never', value: 'extra folders', tone: 'warn' }],
    },
    connections: {
      visible: [...codePipe, 'conn', 'conn-release', 'conn-prod'],
      highlight: ['conn', 'conn-release', 'conn-prod'],
      tokens: [
        { id: 'c1', edge: 'conn-release', tone: 'info' },
        { id: 'c2', edge: 'conn-prod', tone: 'ok' },
      ],
      chips: [{ label: 'PowerShell', value: 'generates connections.json', tone: 'ok' }, { label: 'auth', value: 'ManagedServiceIdentity' }],
    },
    config: {
      visible: [...codePipe],
      highlight: ['test', 'prod'],
      chips: [{ label: 'per environment', value: 'app settings · parameters.json' }],
    },
    release: {
      visible: [...codePipe],
      highlight: ['release', 'release-test', 'release-prod'],
      tokens: [
        { id: 'r1', edge: 'build-release', tone: 'info' },
        { id: 'r2', edge: 'release-test', tone: 'ok' },
        { id: 'r3', edge: 'release-prod', tone: 'ok' },
      ],
      chips: [{ label: 'tools', value: 'GitHub · Azure DevOps · CLI' }],
    },
    slots: {
      visible: [...codePipe],
      highlight: ['prod', 'release-prod'],
      tokens: [{ id: 's1', edge: 'release-prod', tone: 'ok' }],
      chips: [{ label: 'swap', value: 'no downtime', tone: 'ok' }, { label: 'staging slot', value: 'read-only' }],
    },
    roles: {
      visible: [...codePipe, ...infraPipe],
      highlight: ['pipeBox'],
      chips: [{ label: 'roles', value: 'Reader · Operator · Developer · Contributor' }],
    },
    recap: {
      visible: [...codePipe, ...infraPipe, 'conn', 'conn-release', 'conn-prod'],
      chips: [{ label: 'pipelines', value: 'infra first, then same zip', tone: 'ok' }],
    },
  },
  legend: [
    { tone: 'info', label: 'build / generate' },
    { tone: 'ok', label: 'deploy / authorize' },
    { tone: 'fail', label: 'manual drift' },
  ],
};
