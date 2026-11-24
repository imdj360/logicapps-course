import type { Scene } from '../../../../lessons/scene-types';

const core = ['zip', 'stage', 'prod', 'zip-stage'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'zip', kind: 'storage', label: 'New version', sublabel: 'deployment zip', x: 110, y: 250 },
    { id: 'stage', kind: 'hosting-plan', label: 'Staging slot', sublabel: 'read-only', x: 400, y: 130 },
    { id: 'prod', kind: 'hosting-plan', label: 'Production slot', sublabel: 'runs workflows', x: 400, y: 370 },
    { id: 'caller', kind: 'trigger', label: 'Order system', sublabel: 'sends orders', x: 740, y: 370 },
    { id: 'store', kind: 'storage', label: 'Storage account', sublabel: 'file share', x: 740, y: 130 },
  ],
  edges: [
    { id: 'zip-stage', from: 'zip', to: 'stage' },
    { id: 'stage-prod', from: 'stage', to: 'prod' },
    { id: 'caller-prod', from: 'caller', to: 'prod' },
    { id: 'store-stage', from: 'store', to: 'stage', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['prod', 'caller', 'caller-prod'],
      tokens: [{ id: 'o1', edge: 'caller-prod', tone: 'info' }],
      chips: [{ label: 'deploy to production', value: 'risk of disruption', tone: 'warn' }],
    },
    slot: {
      visible: [...core, 'stage-prod', 'caller', 'caller-prod'],
      highlight: ['stage'],
      chips: [{ label: 'slot', value: 'isolated preproduction' }, { label: 'goal', value: 'zero downtime' }],
    },
    benefits: {
      visible: [...core, 'stage-prod', 'caller', 'caller-prod'],
      highlight: ['stage', 'prod'],
      chips: [{ label: 'swap', value: 'no interruption', tone: 'ok' }, { label: 'roll back', value: 'previous version' }],
    },
    create: {
      visible: ['stage', 'prod'],
      highlight: ['stage'],
      chips: [{ label: 'name', value: 'lowercase, digits, hyphens' }, { label: 'VS Code', value: 'Create slot' }],
    },
    deploy: {
      visible: core,
      highlight: ['zip-stage', 'stage'],
      tokens: [{ id: 'd1', edge: 'zip-stage', tone: 'ok' }],
      chips: [{ label: 'portal deploy', value: 'unavailable', tone: 'warn' }, { label: 'VS Code or CLI', value: 'overwrites slot' }],
    },
    behavior: {
      visible: [...core, 'stage-prod', 'caller', 'caller-prod'],
      highlight: ['stage'],
      failed: ['stage'],
      chips: [{ label: 'dispatcher', value: 'off in slot', tone: 'fail' }, { label: 'workflows run', value: 'production only', tone: 'warn' }],
    },
    limits: {
      visible: [...core, 'stage-prod', 'caller', 'caller-prod'],
      highlight: ['stage'],
      chips: [{ label: 'not supported', value: 'blue-green', tone: 'fail' }, { label: 'not supported', value: 'A/B testing', tone: 'fail' }, { label: 'not supported', value: 'verification before swap', tone: 'fail' }],
    },
    swap: {
      visible: [...core, 'stage-prod', 'caller', 'caller-prod'],
      highlight: ['stage-prod', 'prod'],
      tokens: [{ id: 's1', edge: 'stage-prod', tone: 'ok' }, { id: 'o2', edge: 'caller-prod', tone: 'info' }],
      chips: [{ label: 'target', value: 'production' }, { label: 'swap with preview', value: 'needs slot settings' }],
    },
    settings: {
      visible: [...core, 'stage-prod', 'store', 'store-stage'],
      highlight: ['store', 'store-stage'],
      chips: [{ label: 'private storage', value: 'create file share', tone: 'warn' }, { label: 'sticky setting', value: 'does not swap' }],
    },
    recap: {
      visible: ['zip', 'stage', 'prod', 'caller', 'zip-stage', 'stage-prod', 'caller-prod'],
      chips: [{ label: 'workflows run', value: 'production slot only' }],
    },
  },
  legend: [{ tone: 'ok', label: 'deploy or swap' }, { tone: 'info', label: 'orders' }],
};
