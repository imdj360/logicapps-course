import type { Scene } from '../../../../lessons/scene-types';

const parts = ['app', 'tables', 'blobs', 'queues', 'app-tables', 'app-blobs', 'app-queues'];
const account = ['cu00', 'tables-cu00', 'blobs-cu00', 'queues-cu00'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'app', kind: 'hosting-plan', label: 'Logic app', sublabel: 'stateful', x: 110, y: 240 },
    { id: 'tables', kind: 'storage', label: 'Tables', sublabel: 'run state', x: 360, y: 100 },
    { id: 'blobs', kind: 'storage', label: 'Blobs', sublabel: 'run history', x: 360, y: 240 },
    { id: 'queues', kind: 'servicebus', label: 'Queues', sublabel: 'scheduling', x: 360, y: 380 },
    { id: 'cu00', kind: 'storage', label: 'Storage CU00', sublabel: 'primary', x: 620, y: 170 },
    { id: 'cu01', kind: 'storage', label: 'Storage CU01', sublabel: 'scale unit', x: 620, y: 360 },
    { id: 'clean', kind: 'condition', label: 'Cleanup', sublabel: 'checks weekly', x: 810, y: 100 },
  ],
  edges: [
    { id: 'app-tables', from: 'app', to: 'tables' },
    { id: 'app-blobs', from: 'app', to: 'blobs' },
    { id: 'app-queues', from: 'app', to: 'queues' },
    { id: 'tables-cu00', from: 'tables', to: 'cu00' },
    { id: 'blobs-cu00', from: 'blobs', to: 'cu00' },
    { id: 'queues-cu00', from: 'queues', to: 'cu00' },
    { id: 'app-cu01', from: 'app', to: 'cu01', style: 'dashed' },
    { id: 'clean-cu00', from: 'clean', to: 'cu00', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['app', 'cu00'],
      highlight: ['cu00'],
      chips: [{ label: 'runs', value: 'slow', tone: 'warn' }, { label: 'CPU', value: 'fine', tone: 'ok' }],
    },
    what: {
      visible: [...parts, ...account],
      highlight: ['tables', 'blobs', 'queues'],
      tokens: [{ id: 'w1', edge: 'app-tables', tone: 'info' }, { id: 'w2', edge: 'app-blobs', tone: 'info' }, { id: 'w3', edge: 'app-queues', tone: 'info' }],
      chips: [{ label: 'tables', value: 'run state' }, { label: 'blobs', value: 'run history' }, { label: 'queues', value: 'scheduling' }],
    },
    setting: {
      visible: [...parts, ...account],
      highlight: ['cu00'],
      chips: [{ label: 'app setting', value: 'AzureWebJobsStorage' }, { label: 'required', value: 'yes', tone: 'warn' }],
    },
    limits: {
      visible: [...parts, ...account],
      failed: ['cu00'],
      tokens: [{ id: 'l1', edge: 'tables-cu00', tone: 'fail' }, { id: 'l2', edge: 'blobs-cu00', tone: 'fail' }, { id: 'l3', edge: 'queues-cu00', tone: 'fail' }],
      chips: [{ label: 'per partition', value: '2,000 requests' }, { label: 'per account', value: '20,000 req/s', tone: 'fail' }],
    },
    spread: {
      visible: [...parts, ...account],
      highlight: ['app'],
      chips: [{ label: 'first', value: 'more workflows' }, { label: 'guideline', value: '~100k actions/min/account' }],
    },
    scaleunits: {
      visible: [...parts, ...account, 'cu01', 'app-cu01'],
      highlight: ['cu01', 'app-cu01'],
      tokens: [{ id: 's1', edge: 'app-cu01', tone: 'ok' }, { id: 's2', edge: 'blobs-cu00', tone: 'ok' }],
      chips: [{ label: 'max accounts', value: '32' }, { label: 'setting', value: 'Runtime.ScaleUnitsCount' }, { label: 'set up', value: 'before creating', tone: 'warn' }],
    },
    retention: {
      visible: [...parts, ...account, 'clean', 'clean-cu00'],
      highlight: ['clean', 'blobs'],
      tokens: [{ id: 'r1', edge: 'clean-cu00', tone: 'info' }],
      chips: [{ label: 'retention', value: '90 days default' }, { label: 'range', value: '7–365 days' }, { label: 'might see', value: 'up to 97 days' }],
    },
    billing: {
      visible: [...parts, ...account],
      highlight: ['cu00'],
      chips: [{ label: 'storage', value: 'billed separately', tone: 'warn' }, { label: 'grows with', value: 'every stateful run' }],
    },
    recap: {
      visible: [...parts, ...account, 'cu01', 'app-cu01', 'clean', 'clean-cu00'],
      chips: [{ label: 'watch', value: 'storage throughput' }, { label: 'plan', value: 'accounts up front' }],
    },
  },
  legend: [
    { tone: 'info', label: 'storage requests' },
    { tone: 'ok', label: 'spread load' },
    { tone: 'fail', label: 'throttled' },
  ],
};
