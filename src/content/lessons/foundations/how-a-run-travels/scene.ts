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
    { id: 'history', kind: 'storage', label: 'Run history', sublabel: '90 days default', x: 550, y: 400 },
  ],
  edges: [
    { id: 'shop-trigger', from: 'shop', to: 'trigger' },
    { id: 'app-trigger', from: 'app', to: 'trigger' },
    { id: 'poll-sftp', from: 'poll', to: 'sftp', style: 'dashed' },
    { id: 'trigger-parse', from: 'trigger', to: 'parse' },
    { id: 'parse-stock', from: 'parse', to: 'stock' },
    { id: 'stock-queue', from: 'stock', to: 'queue' },
    { id: 'parse-history', from: 'parse', to: 'history', style: 'dashed' },
    { id: 'stock-history', from: 'stock', to: 'history', style: 'dashed' },
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
      visible: ['shop', 'trigger', 'shop-trigger'],
      highlight: ['trigger'],
      tokens: [{ id: 'order', edge: 'shop-trigger', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'Succeeded · Fired', tone: 'ok' }, { label: 'run', value: 'Running' }],
    },
    actions: {
      visible: [...core],
      highlight: ['trigger-parse', 'parse-stock', 'stock-queue'],
      tokens: [
        { id: 'a1', edge: 'trigger-parse', tone: 'info' },
        { id: 'a2', edge: 'parse-stock', tone: 'info' },
        { id: 'a3', edge: 'stock-queue', tone: 'info' },
      ],
      chips: [{ label: 'run', value: 'Running' }, { label: 'runAfter', value: 'Succeeded' }],
    },
    history: {
      visible: [...core, 'history', 'parse-history', 'stock-history'],
      highlight: ['history'],
      tokens: [{ id: 'h1', edge: 'parse-history', tone: 'info' }, { id: 'h2', edge: 'stock-history', tone: 'info' }],
      chips: [{ label: 'recorded', value: 'status · inputs · outputs' }, { label: 'retention', value: '90 days' }],
    },
    parallel: {
      visible: [...core, 'app', 'app-trigger'],
      highlight: ['trigger'],
      tokens: [{ id: 'o1', edge: 'shop-trigger', tone: 'info' }, { id: 'o2', edge: 'app-trigger', tone: 'info' }],
      chips: [{ label: 'runs', value: '2 running' }, { label: 'concurrency', value: 'off (unlimited)' }],
    },
    failure: {
      visible: [...core],
      failed: ['stock'],
      tokens: [{ id: 'f1', edge: 'parse-stock', tone: 'fail' }],
      chips: [
        { label: 'Check stock', value: 'Failed', tone: 'fail' },
        { label: 'Send to queue', value: 'Skipped', tone: 'warn' },
        { label: 'run', value: 'Failed', tone: 'fail' },
      ],
    },
    read: {
      visible: [...core, 'history', 'stock-history'],
      failed: ['stock'],
      highlight: ['history', 'stock-history'],
      tokens: [{ id: 'r1', edge: 'stock-history', tone: 'fail' }],
      chips: [{ label: 'failed step', value: 'Check stock', tone: 'fail' }, { label: 'output', value: 'HTTP 500' }],
    },
    recap: {
      visible: [...core, 'history', 'parse-history', 'stock-history'],
      chips: [{ label: 'trigger', value: 'starts a run' }, { label: 'history', value: 'every step' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data moving' },
    { tone: 'fail', label: 'error' },
    { tone: 'failed', label: 'failed step' },
  ],
};
