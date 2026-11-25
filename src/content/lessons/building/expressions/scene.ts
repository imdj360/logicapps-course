import type { Scene } from '../../../../lessons/scene-types';

const reads = ['trigger', 'email', 'ship', 'summary', 'trig-email', 'trig-ship', 'trig-summary'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order received', sublabel: 'JSON body', x: 110, y: 240 },
    { id: 'email', kind: 'action', label: 'Customer email', sublabel: "?['email']", x: 390, y: 90 },
    { id: 'ship', kind: 'action', label: 'Ship date', sublabel: 'addDays +3', x: 390, y: 240 },
    { id: 'summary', kind: 'action', label: 'Summary text', sublabel: 'expression', x: 390, y: 390 },
    { id: 'params', kind: 'keyvault', label: 'Parameters', sublabel: 'per environment', x: 690, y: 170 },
    { id: 'appset', kind: 'keyvault', label: 'App settings', sublabel: 'configuration', x: 690, y: 360 },
  ],
  edges: [
    { id: 'trig-email', from: 'trigger', to: 'email' },
    { id: 'trig-ship', from: 'trigger', to: 'ship' },
    { id: 'trig-summary', from: 'trigger', to: 'summary' },
    { id: 'params-summary', from: 'params', to: 'summary', style: 'dashed' },
    { id: 'appset-params', from: 'appset', to: 'params', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...reads],
      chips: [{ label: 'order', value: 'SO-1042, 2 lines' }, { label: 'email', value: 'null', tone: 'warn' }],
    },
    syntax: {
      visible: [...reads],
      highlight: ['summary', 'trig-summary'],
      tokens: [{ id: 's1', edge: 'trig-summary', tone: 'info' }],
      chips: [{ label: "@triggerBody()?['orderId']", value: 'SO-1042' }, { label: 'whole value', value: 'keeps the type' }],
    },
    types: {
      visible: [...reads],
      highlight: ['summary'],
      chips: [{ label: 'Order @{...} received', value: 'Order SO-1042 received' }, { label: 'inside text', value: 'always a string', tone: 'warn' }],
    },
    data: {
      visible: [...reads],
      highlight: ['trigger'],
      tokens: [{ id: 'd1', edge: 'trig-email', tone: 'info' }, { id: 'd2', edge: 'trig-ship', tone: 'info' }, { id: 'd3', edge: 'trig-summary', tone: 'info' }],
      chips: [{ label: 'trigger', value: 'triggerBody()' }, { label: 'actions', value: 'body() · outputs()' }, { label: 'loops', value: 'items()' }],
    },
    null: {
      visible: [...reads],
      highlight: ['email', 'trig-email'],
      tokens: [{ id: 'n1', edge: 'trig-email', tone: 'ok' }],
      chips: [{ label: "['phone']", value: 'can error if missing', tone: 'fail' }, { label: "?['phone']", value: 'null', tone: 'ok' }, { label: 'fallback', value: 'coalesce()' }],
    },
    functions: {
      visible: [...reads],
      highlight: ['ship'],
      tokens: [{ id: 'f1', edge: 'trig-ship', tone: 'info' }],
      chips: [{ label: 'inner first', value: 'utcNow → addDays → formatDateTime' }, { label: 'result', value: '2026-11-27' }],
    },
    examples: {
      visible: [...reads],
      highlight: ['summary'],
      tokens: [{ id: 'x1', edge: 'trig-summary', tone: 'info' }],
      chips: [{ label: 'toUpper', value: 'CONTOSO BIKES' }, { label: 'first', value: 'WHEEL-26' }, { label: 'if', value: 'normal' }],
    },
    gotchas: {
      visible: [...reads],
      chips: [{ label: 'text', value: "single quotes" }, { label: 'contains()', value: 'case-sensitive', tone: 'warn' }, { label: 'max length', value: '8,192 chars' }],
    },
    params: {
      visible: [...reads, 'params', 'appset', 'params-summary', 'appset-params'],
      highlight: ['params', 'appset', 'appset-params'],
      tokens: [{ id: 'p1', edge: 'appset-params', tone: 'info' }, { id: 'p2', edge: 'params-summary', tone: 'info' }],
      chips: [{ label: 'in workflows', value: '@parameters()' }, { label: 'in parameters.json', value: '@appsetting() only' }],
    },
    recap: {
      visible: [...reads, 'params', 'appset', 'params-summary', 'appset-params'],
      chips: [{ label: 'read', value: 'safely with ?' }, { label: 'configure', value: 'with parameters' }],
    },
  },
  legend: [
    { tone: 'info', label: 'value read' },
    { tone: 'ok', label: 'safe read' },
  ],
};
