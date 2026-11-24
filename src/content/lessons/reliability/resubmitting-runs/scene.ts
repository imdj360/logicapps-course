import type { Scene } from '../../../../lessons/scene-types';

const main = ['trigger', 'call', 'save', 'partner', 'trig-call', 'call-save', 'call-partner'];
const catching = ['catch', 'alert', 'call-catch', 'save-catch', 'catch-alert'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 110, y: 110 },
    { id: 'call', kind: 'connector-managed', label: 'Call partner API', sublabel: 'in Try scope', x: 340, y: 110 },
    { id: 'save', kind: 'connector-builtin', label: 'Save order', sublabel: 'in Try scope', x: 580, y: 110 },
    { id: 'partner', kind: 'user', label: 'Partner API', x: 340, y: 270 },
    { id: 'catch', kind: 'scope', label: 'Catch scope', sublabel: 'after Try fails', x: 580, y: 270 },
    { id: 'alert', kind: 'action', label: 'Alert team', x: 800, y: 270 },
    { id: 'term', kind: 'condition', label: 'Terminate', sublabel: 'status: Failed', x: 800, y: 420 },
    { id: 'you', kind: 'human', label: 'You', sublabel: 'next morning', x: 110, y: 420 },
    { id: 'history', kind: 'storage', label: 'Run history', sublabel: '90 days', x: 340, y: 420 },
  ],
  edges: [
    { id: 'trig-call', from: 'trigger', to: 'call' },
    { id: 'call-save', from: 'call', to: 'save' },
    { id: 'call-partner', from: 'call', to: 'partner' },
    { id: 'call-catch', from: 'call', to: 'catch', style: 'dashed' },
    { id: 'save-catch', from: 'save', to: 'catch', style: 'dashed' },
    { id: 'catch-alert', from: 'catch', to: 'alert' },
    { id: 'alert-term', from: 'alert', to: 'term' },
    { id: 'you-history', from: 'you', to: 'history' },
    { id: 'history-trig', from: 'history', to: 'trigger', style: 'dashed' },
    { id: 'history-call', from: 'history', to: 'call', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...main],
      failed: ['partner'],
      tokens: [{ id: 'p1', edge: 'call-partner', tone: 'fail' }],
      chips: [{ label: 'time', value: '02:13' }, { label: 'partner API', value: '503', tone: 'fail' }],
    },
    retry: {
      visible: [...main],
      highlight: ['call', 'call-partner'],
      tokens: [
        { id: 'r1', edge: 'call-partner', tone: 'fail' },
        { id: 'r2', edge: 'call-partner', tone: 'fail' },
        { id: 'r3', edge: 'call-partner', tone: 'fail' },
      ],
      chips: [{ label: 'policy', value: 'default (exponential)' }, { label: 'retries', value: 'up to 4', tone: 'warn' }, { label: 'retried on', value: '408 · 429 · 5xx' }],
    },
    fails: {
      visible: [...main],
      failed: ['call'],
      chips: [{ label: 'Call partner API', value: 'Failed', tone: 'fail' }, { label: 'Save order', value: 'Skipped', tone: 'warn' }, { label: 'run', value: 'Failed', tone: 'fail' }],
    },
    catch: {
      visible: [...main, ...catching],
      failed: ['call'],
      highlight: ['call', 'save', 'catch'],
      tokens: [{ id: 'c1', edge: 'call-catch', tone: 'fail' }, { id: 'c2', edge: 'catch-alert', tone: 'info' }],
      chips: [{ label: 'Try scope', value: 'Failed', tone: 'fail' }, { label: 'Catch scope', value: 'runs' }, { label: 'team', value: 'alerted', tone: 'ok' }],
    },
    'run-after': {
      visible: [...main, ...catching],
      failed: ['call'],
      highlight: ['catch', 'call-catch', 'save-catch'],
      chips: [
        { label: 'Is successful', value: 'off', tone: 'neutral' },
        { label: 'Has failed', value: 'on', tone: 'ok' },
        { label: 'Has timed out', value: 'on', tone: 'ok' },
        { label: 'Is skipped', value: 'optional', tone: 'warn' },
      ],
    },
    terminate: {
      visible: [...main, ...catching, 'term', 'alert-term'],
      failed: ['call'],
      highlight: ['term'],
      tokens: [{ id: 't1', edge: 'alert-term', tone: 'info' }],
      chips: [{ label: 'without Terminate', value: 'Succeeded', tone: 'warn' }, { label: 'with Terminate', value: 'Failed', tone: 'fail' }],
    },
    resubmit: {
      visible: [...main, 'you', 'history', 'you-history', 'history-trig'],
      highlight: ['history-trig', 'trigger'],
      tokens: [{ id: 's1', edge: 'you-history', tone: 'info' }, { id: 's2', edge: 'history-trig', tone: 'ok' }],
      chips: [{ label: 'inputs', value: 'same as original' }, { label: 'new run', value: 'Running', tone: 'ok' }],
    },
    'from-action': {
      visible: [...main, 'you', 'history', 'you-history', 'history-call'],
      highlight: ['history-call', 'call'],
      tokens: [{ id: 'f1', edge: 'history-call', tone: 'ok' }, { id: 'f2', edge: 'call-save', tone: 'ok' }],
      chips: [{ label: 'earlier actions', value: 'reuse outputs' }, { label: 'limit', value: '≤ 40 actions, sequential' }],
    },
    duplicates: {
      visible: [...main, 'history', 'history-trig'],
      highlight: ['save'],
      tokens: [{ id: 'd1', edge: 'call-save', tone: 'fail' }],
      chips: [{ label: 'Save order', value: 'runs twice', tone: 'fail' }, { label: 'fix', value: 'check order ID first', tone: 'ok' }],
    },
    limits: {
      visible: ['you', 'history', 'you-history'],
      highlight: ['history'],
      chips: [{ label: 'retention', value: '90 days from start' }, { label: 'stateless', value: 'no history by default', tone: 'warn' }],
    },
    recap: {
      visible: [...main, ...catching, 'term', 'alert-term', 'you', 'history', 'you-history', 'history-trig'],
      chips: [{ label: 'retry', value: 'automatic' }, { label: 'catch', value: 'scopes' }, { label: 'resubmit', value: 'with care' }],
    },
  },
  legend: [
    { tone: 'fail', label: 'error response' },
    { tone: 'info', label: 'normal flow' },
    { tone: 'ok', label: 'rerun' },
  ],
};
