import type { Scene } from '../../../../lessons/scene-types';

const core = ['order', 'hook', 'finance', 'order-hook', 'hook-finance', 'finance-hook'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'order', kind: 'trigger', label: 'Large order', sublabel: 'stateful', x: 120, y: 240 },
    { id: 'hook', kind: 'action', label: 'HTTP Webhook', sublabel: 'paused', x: 420, y: 240 },
    { id: 'finance', kind: 'human', label: 'Finance team', sublabel: '3 days', x: 740, y: 240 },
    { id: 'state', kind: 'storage', label: 'Order state', sublabel: 'by order ID', x: 420, y: 80 },
    { id: 'second', kind: 'trigger', label: 'Second flow', sublabel: 'on reply', x: 740, y: 410 },
  ],
  edges: [
    { id: 'order-hook', from: 'order', to: 'hook' },
    { id: 'hook-finance', from: 'hook', to: 'finance' },
    { id: 'finance-hook', from: 'finance', to: 'hook', style: 'dashed' },
    { id: 'order-state', from: 'order', to: 'state', style: 'dashed' },
    { id: 'finance-second', from: 'finance', to: 'second', style: 'dashed' },
    { id: 'second-state', from: 'second', to: 'state', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['order', 'finance'],
      chips: [{ label: 'decision takes', value: '3 days' }],
    },
    limits: {
      visible: [...core],
      highlight: ['order'],
      chips: [{ label: 'stateful run', value: '90 days default' }, { label: 'stateless run', value: '5 min', tone: 'warn' }],
    },
    webhook: {
      visible: [...core],
      highlight: ['hook'],
      tokens: [{ id: 'w1', edge: 'hook-finance', tone: 'info' }, { id: 'w2', edge: 'finance-hook', tone: 'ok' }],
      chips: [{ label: 'Standard stateful', value: 'up to 30 days' }, { label: 'stateless', value: '5 min' }],
    },
    callback: {
      visible: [...core],
      highlight: ['finance-hook'],
      chips: [{ label: 'callback URL dies on', value: 'cancel · delete/disable · keys · timeout' }],
    },
    approval: {
      visible: [...core],
      highlight: ['finance'],
      chips: [{ label: 'action', value: 'Send approval email' }, { label: 'wait limit', value: 'not on Learn', tone: 'warn' }],
    },
    correlation: {
      visible: [...core],
      highlight: ['order'],
      chips: [{ label: 'header', value: 'x-ms-client-tracking-id' }, { label: 'logs', value: 'ClientTrackingId' }],
    },
    split: {
      visible: ['order', 'finance', 'state', 'second', 'order-state', 'finance-second', 'second-state'],
      highlight: ['state', 'second'],
      tokens: [{ id: 's1', edge: 'finance-second', tone: 'ok' }, { id: 's2', edge: 'second-state', tone: 'info' }],
      chips: [{ label: 'our design', value: 'two flows, shared state' }],
    },
    timeout: {
      visible: [...core],
      chips: [{ label: 'no answer', value: 'Has timed out', tone: 'warn' }],
    },
    recap: {
      visible: [...core, 'state', 'second', 'order-state', 'finance-second', 'second-state'],
      chips: [{ label: 'wait', value: 'webhook or split' }],
    },
  },
  legend: [{ tone: 'info', label: 'request' }, { tone: 'ok', label: 'answer' }],
};
