import type { Scene } from '../../../../lessons/scene-types';

const base = ['queue', 'w1', 'queue-w1'];
const scaled = ['w2', 'w3', 'queue-w2', 'queue-w3'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'queue', kind: 'servicebus', label: 'Orders queue', sublabel: 'length grows', x: 110, y: 110 },
    { id: 'scaler', kind: 'condition', label: 'Scaler', sublabel: '~15–30 s', x: 110, y: 330 },
    { id: 'w1', kind: 'hosting-plan', label: 'Instance 1', sublabel: 'WS2', x: 370, y: 110 },
    { id: 'w2', kind: 'hosting-plan', label: 'Instance 2', sublabel: 'added', x: 370, y: 240 },
    { id: 'w3', kind: 'hosting-plan', label: 'Instance 3', sublabel: 'prewarmed', x: 370, y: 370 },
    { id: 'storage', kind: 'storage', label: 'Azure Storage', sublabel: '20k req/s', x: 630, y: 240 },
    { id: 'slot', kind: 'hosting-plan', label: 'Staging slot', sublabel: 'read-only', x: 790, y: 110 },
  ],
  edges: [
    { id: 'queue-w1', from: 'queue', to: 'w1' },
    { id: 'queue-w2', from: 'queue', to: 'w2' },
    { id: 'queue-w3', from: 'queue', to: 'w3' },
    { id: 'scaler-queue', from: 'scaler', to: 'queue', style: 'dashed' },
    { id: 'scaler-w2', from: 'scaler', to: 'w2', style: 'dashed' },
    { id: 'w1-storage', from: 'w1', to: 'storage' },
    { id: 'w2-storage', from: 'w2', to: 'storage' },
    { id: 'w3-storage', from: 'w3', to: 'storage' },
    { id: 'slot-w1', from: 'slot', to: 'w1', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...base],
      highlight: ['queue'],
      tokens: [
        { id: 'o1', edge: 'queue-w1', tone: 'info' },
        { id: 'o2', edge: 'queue-w1', tone: 'info' },
        { id: 'o3', edge: 'queue-w1', tone: 'info' },
      ],
      chips: [{ label: 'time', value: '09:00' }, { label: 'queue', value: 'growing', tone: 'warn' }],
    },
    tiers: {
      visible: [...base],
      highlight: ['w1'],
      chips: [{ label: 'WS1 / WS2 / WS3', value: '1 / 2 / 4 vCPU' }, { label: 'built-in ops', value: 'included', tone: 'ok' }, { label: 'managed connectors', value: 'per call', tone: 'warn' }],
    },
    scaler: {
      visible: [...base, 'scaler', 'scaler-queue', 'scaler-w2', 'w2', 'queue-w2'],
      highlight: ['scaler', 'scaler-queue', 'w2'],
      tokens: [{ id: 's1', edge: 'scaler-queue', tone: 'info' }, { id: 's2', edge: 'scaler-w2', tone: 'ok' }],
      chips: [{ label: 'watches', value: 'trigger · job delay' }, { label: 'decides', value: 'about every 15–30 s' }],
    },
    rampup: {
      visible: [...base, ...scaled, 'scaler', 'scaler-w2'],
      highlight: ['w2', 'w3'],
      tokens: [{ id: 'r1', edge: 'queue-w1', tone: 'info' }],
      chips: [{ label: '1 → 100 instances', value: 'might take 25–50 min', tone: 'warn' }, { label: 'queue', value: 'still growing', tone: 'warn' }],
    },
    prewarm: {
      visible: [...base, ...scaled],
      highlight: ['w3'],
      tokens: [{ id: 'p1', edge: 'queue-w1', tone: 'ok' }, { id: 'p2', edge: 'queue-w2', tone: 'ok' }, { id: 'p3', edge: 'queue-w3', tone: 'ok' }],
      chips: [{ label: 'prewarmed', value: 'ready before 9am', tone: 'ok' }, { label: 'or', value: 'split across apps' }],
    },
    storage: {
      visible: [...base, ...scaled, 'storage', 'w1-storage', 'w2-storage', 'w3-storage'],
      highlight: ['storage'],
      tokens: [{ id: 't1', edge: 'w1-storage', tone: 'info' }, { id: 't2', edge: 'w2-storage', tone: 'info' }, { id: 't3', edge: 'w3-storage', tone: 'fail' }],
      chips: [{ label: 'per account', value: '20,000 req/s', tone: 'warn' }, { label: 'guideline', value: '~100k actions/min' }, { label: 'max accounts', value: '32' }],
    },
    coldstart: {
      visible: [...base],
      highlight: ['w1'],
      chips: [{ label: 'more workflows', value: 'slower cold start', tone: 'warn' }, { label: 'actions per workflow', value: '≤ 50' }],
    },
    slots: {
      visible: [...base, 'slot', 'slot-w1'],
      highlight: ['slot', 'slot-w1'],
      tokens: [{ id: 'd1', edge: 'slot-w1', tone: 'ok' }],
      chips: [{ label: 'swap', value: 'no downtime', tone: 'ok' }, { label: 'workflows run', value: 'production only' }, { label: 'A/B testing', value: 'not supported', tone: 'warn' }],
    },
    zones: {
      visible: [...base, ...scaled],
      highlight: ['w1', 'w2', 'w3'],
      chips: [{ label: 'zone redundancy', value: 'set at creation' }, { label: 'available on', value: 'WS plan · ASE v3' }],
    },
    recap: {
      visible: [...base, ...scaled, 'scaler', 'scaler-queue', 'scaler-w2', 'storage', 'w1-storage', 'w2-storage', 'w3-storage', 'slot', 'slot-w1'],
      chips: [{ label: 'scale', value: 'plan ahead' }, { label: 'storage', value: 'watch it' }],
    },
  },
  legend: [
    { tone: 'info', label: 'work / requests' },
    { tone: 'ok', label: 'handled' },
    { tone: 'fail', label: 'throttled' },
  ],
};
