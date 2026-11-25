import type { Scene } from '../../../../lessons/scene-types';

const core = ['order', 'hook', 'finance', 'order-hook', 'hook-finance', 'finance-hook'];
const split = ['order', 'finance', 'state', 'second', 'order-finance', 'order-state', 'finance-second', 'second-state'];

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
    { id: 'order-finance', from: 'order', to: 'finance', style: 'dashed' },
    { id: 'order-hook', from: 'order', to: 'hook' },
    { id: 'hook-finance', from: 'hook', to: 'finance' },
    { id: 'finance-hook', from: 'finance', to: 'hook', style: 'dashed' },
    { id: 'order-state', from: 'order', to: 'state', style: 'dashed' },
    { id: 'finance-second', from: 'finance', to: 'second', style: 'dashed' },
    { id: 'second-state', from: 'second', to: 'state', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['order', 'finance', 'order-finance'],
      tokens: [{ id: 'w1', edge: 'order-finance', tone: 'info' }],
      chips: [{ label: 'decision takes', value: '3 days' }, { label: 'order', value: 'must wait', tone: 'warn' }],
    },
    pattern: {
      visible: [...core],
      highlight: ['hook'],
      chips: [{ label: 'run', value: 'pauses' }, { label: 'callback', value: 'wakes it up', tone: 'ok' }],
    },
    sequence: {
      visible: [...core],
      tokens: [{ id: 's1', edge: 'hook-finance', tone: 'info' }, { id: 's2', edge: 'finance-hook', tone: 'ok' }],
      chips: [{ label: '1', value: 'ask + callback URL' }, { label: '2', value: 'run pauses' }, { label: '3', value: 'answer posted' }, { label: '4', value: 'run continues' }],
    },
    build: {
      visible: [...core],
      highlight: ['hook'],
      tokens: [{ id: 'b1', edge: 'hook-finance', tone: 'info' }, { id: 'b2', edge: 'finance-hook', tone: 'ok' }],
      chips: [{ label: 'action', value: 'HTTP Webhook' }, { label: 'URL from', value: 'listCallbackUrl()' }],
    },
    limits: {
      visible: [...core],
      highlight: ['order', 'hook'],
      chips: [{ label: 'stateful run', value: '90 days' }, { label: 'webhook, stateful', value: '30 days' }, { label: 'stateless', value: '5 min', tone: 'warn' }],
    },
    callback: {
      visible: [...core],
      highlight: ['finance-hook'],
      chips: [{ label: 'URL dies on', value: 'cancel · delete or disable · key rotation · timeout', tone: 'warn' }],
    },
    correlation: {
      visible: [...core],
      highlight: ['order'],
      chips: [{ label: 'header', value: 'x-ms-client-tracking-id' }, { label: 'logs', value: 'ClientTrackingId' }],
    },
    split: {
      visible: [...split],
      highlight: ['state', 'second'],
      tokens: [
        { id: 'p0', edge: 'order-finance', tone: 'info' },
        { id: 'p0b', edge: 'order-state', tone: 'info' },
        { id: 'p1', edge: 'finance-second', tone: 'ok' },
        { id: 'p2', edge: 'second-state', tone: 'info' },
      ],
      chips: [{ label: 'design (ours)', value: 'two flows, shared state' }],
    },
    timeout: {
      visible: [...core],
      highlight: ['finance'],
      chips: [{ label: 'no answer', value: 'Has timed out (ours)', tone: 'warn' }],
    },
    when: {
      visible: [...core, 'state', 'second', 'order-state', 'finance-second', 'second-state'],
      chips: [{ label: 'days', value: 'webhook' }, { label: 'very long', value: 'split' }],
    },
    recap: {
      visible: [...core, 'state', 'second', 'order-state', 'finance-second', 'second-state'],
      chips: [{ label: 'wait', value: 'webhook or split' }],
    },
  },
  legend: [{ tone: 'info', label: 'request' }, { tone: 'ok', label: 'answer' }],
};
