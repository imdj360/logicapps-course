import type { Scene } from '../../../../lessons/scene-types';

const core = ['shop', 'trigger', 'parse', 'stock', 'queue', 'shop-trigger', 'trigger-parse', 'parse-stock', 'stock-queue'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop website', x: 110, y: 100 },
    { id: 'app', kind: 'user', label: 'Mobile app', x: 110, y: 250 },
    { id: 'sftp', kind: 'storage', label: 'SFTP folder', x: 110, y: 400 },
    { id: 'trigger', kind: 'trigger', label: 'Request', sublabel: 'push trigger', x: 330, y: 100 },
    { id: 'poll', kind: 'trigger', label: 'New file?', sublabel: 'polling trigger', x: 330, y: 400 },
    { id: 'parse', kind: 'action', label: 'Parse order', x: 550, y: 100 },
    { id: 'stock', kind: 'connector-managed', label: 'Check stock', x: 770, y: 100 },
    { id: 'queue', kind: 'servicebus', label: 'Send to queue', x: 770, y: 250 },
    { id: 'history', kind: 'storage', label: 'Run record', sublabel: '1 per trigger', x: 150, y: 400 },
    { id: 'actrec', kind: 'storage', label: 'Step records', sublabel: 'in · out each', x: 560, y: 400 },
  ],
  edges: [
    { id: 'shop-trigger', from: 'shop', to: 'trigger' },
    { id: 'app-trigger', from: 'app', to: 'trigger' },
    { id: 'poll-sftp', from: 'poll', to: 'sftp', style: 'dashed' },
    { id: 'trigger-parse', from: 'trigger', to: 'parse' },
    { id: 'parse-stock', from: 'parse', to: 'stock' },
    { id: 'stock-queue', from: 'stock', to: 'queue' },
    { id: 'trigger-history', from: 'trigger', to: 'history', style: 'dashed' },
    { id: 'trigger-actrec', from: 'trigger', to: 'actrec', style: 'dashed' },
    { id: 'parse-actrec', from: 'parse', to: 'actrec', style: 'dashed' },
    { id: 'stock-actrec', from: 'stock', to: 'actrec', style: 'dashed' },
    { id: 'queue-actrec', from: 'queue', to: 'actrec', style: 'dashed' },
  ],
  groups: [
    // Frames the trigger and every action: one trigger fire = one run.
    { id: 'run', label: 'One run', x: 236, y: 38, w: 628, h: 260 },
  ],
  steps: {
    problem: {
      visible: [...core],
      failed: ['queue'],
      chips: [{ label: 'order', value: '#4711' }, { label: 'warehouse', value: 'never received', tone: 'fail' }],
    },
    listen: {
      visible: ['shop', 'trigger', 'shop-trigger', 'sftp', 'poll', 'poll-sftp'],
      highlight: ['trigger', 'poll'],
      tokens: [{ id: 'push', edge: 'shop-trigger', tone: 'info' }, { id: 'check', edge: 'poll-sftp', tone: 'info' }],
      chips: [{ label: 'push', value: 'waits to be called' }, { label: 'polling', value: 'checks every 1 min' }],
    },
    skipped: {
      visible: ['sftp', 'poll', 'poll-sftp'],
      highlight: ['poll'],
      tokens: [{ id: 'check2', edge: 'poll-sftp', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'Skipped', tone: 'warn' }, { label: 'runs created', value: '0' }],
    },
    fired: {
      visible: ['shop', 'trigger', 'shop-trigger', 'run'],
      highlight: ['trigger'],
      tokens: [{ id: 'order', edge: 'shop-trigger', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'Succeeded · Fired', tone: 'ok' }, { label: 'run', value: 'Running' }],
    },
    actions: {
      visible: [...core, 'run'],
      highlight: ['trigger-parse', 'parse-stock', 'stock-queue'],
      tokens: [
        { id: 'a1', edge: 'trigger-parse', tone: 'info' },
        { id: 'a2', edge: 'parse-stock', tone: 'info' },
        { id: 'a3', edge: 'stock-queue', tone: 'info' },
      ],
      chips: [{ label: 'run', value: 'Running' }, { label: 'runAfter', value: 'Succeeded' }],
    },
    history: {
      visible: [...core, 'run', 'history', 'actrec', 'trigger-history', 'trigger-actrec', 'parse-actrec', 'stock-actrec', 'queue-actrec'],
      highlight: ['run', 'history', 'actrec'],
      tokens: [{ id: 'h0', edge: 'trigger-history', tone: 'info' }, { id: 'h4', edge: 'trigger-actrec', tone: 'info' }, { id: 'h1', edge: 'parse-actrec', tone: 'info' }, { id: 'h2', edge: 'stock-actrec', tone: 'info' }, { id: 'h3', edge: 'queue-actrec', tone: 'info' }],
      chips: [{ label: 'run', value: 'one per trigger fire' }, { label: 'every step', value: 'request + each action' }, { label: 'stored', value: 'inputs · outputs' }],
    },
    parallel: {
      visible: [...core, 'app', 'app-trigger'],
      highlight: ['trigger'],
      tokens: [{ id: 'o1', edge: 'shop-trigger', tone: 'info' }, { id: 'o2', edge: 'app-trigger', tone: 'info' }],
      chips: [{ label: 'runs', value: '2 running' }, { label: 'concurrency', value: 'off (unlimited)' }],
    },
    failure: {
      visible: [...core, 'run'],
      failed: ['stock'],
      tokens: [{ id: 'f1', edge: 'parse-stock', tone: 'fail' }],
      chips: [
        { label: 'Check stock', value: 'Failed', tone: 'fail' },
        { label: 'Send to queue', value: 'Skipped', tone: 'warn' },
        { label: 'run', value: 'Failed', tone: 'fail' },
      ],
    },
    read: {
      visible: [...core, 'history', 'actrec', 'trigger-history', 'trigger-actrec', 'stock-actrec', 'run'],
      failed: ['stock'],
      highlight: ['actrec', 'stock-actrec'],
      tokens: [{ id: 'r1', edge: 'stock-actrec', tone: 'fail' }],
      chips: [{ label: 'failed step', value: 'Check stock', tone: 'fail' }, { label: 'output', value: 'HTTP 500' }],
    },
    recap: {
      visible: [...core, 'history', 'actrec', 'trigger-history', 'trigger-actrec', 'parse-actrec', 'stock-actrec', 'queue-actrec', 'run'],
      chips: [{ label: 'trigger', value: 'starts a run' }, { label: 'recorded', value: 'the run + every action' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data moving' },
    { tone: 'fail', label: 'error' },
    { tone: 'failed', label: 'failed step' },
  ],
};
