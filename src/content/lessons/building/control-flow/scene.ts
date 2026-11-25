import type { Scene } from '../../../../lessons/scene-types';

const start = ['trigger', 'cond', 'trig-cond'];
const branch = ['expr', 'sw', 'cond-expr', 'cond-sw'];
const region = ['eu', 'def', 'sw-eu', 'sw-def'];
const lines = ['loop', 'stock', 'total', 'sw-loop', 'loop-stock', 'loop-total'];

export const scene: Scene = {
  viewBox: [900, 500],
  // Only the nested-loops step uses these frames: a loop inside a loop, and the child-workflow alternative.
  groups: [
    { id: 'outerLoop', label: 'For each order', x: 40, y: 40, w: 820, h: 240 },
    { id: 'innerLoop', label: 'For each line · always sequential', x: 80, y: 90, w: 470, h: 170 },
    { id: 'childBox', label: 'Instead: a child workflow per line', x: 40, y: 320, w: 820, h: 160 },
  ],
  nodes: [
    { id: 'nstock', kind: 'connector-builtin', label: 'Reserve stock', sublabel: 'one line', x: 315, y: 190 },
    { id: 'ntotal', kind: 'action', label: 'Order total', sublabel: 'after the lines', x: 720, y: 190 },
    { id: 'ninvoke', kind: 'action', label: 'Invoke workflow', sublabel: 'per line', x: 240, y: 410 },
    { id: 'nchild', kind: 'trigger', label: 'Child workflow', sublabel: 'Reserve stock', x: 640, y: 410 },
    { id: 'trigger', kind: 'trigger', label: 'Order received', x: 100, y: 90 },
    { id: 'cond', kind: 'condition', label: 'Express?', sublabel: 'Condition', x: 300, y: 90 },
    { id: 'expr', kind: 'action', label: 'Priority ship', sublabel: 'True path', x: 520, y: 90 },
    { id: 'until', kind: 'scope', label: 'Until ready', sublabel: 'label printed', x: 770, y: 90 },
    { id: 'sw', kind: 'condition', label: 'Region', sublabel: 'Switch', x: 300, y: 250 },
    { id: 'eu', kind: 'action', label: 'EU carrier', sublabel: 'case EU', x: 520, y: 250 },
    { id: 'def', kind: 'action', label: 'Other carrier', sublabel: 'default', x: 770, y: 250 },
    { id: 'scope', kind: 'scope', label: 'Fulfil', sublabel: 'Scope', x: 100, y: 410 },
    { id: 'loop', kind: 'scope', label: 'For each line', sublabel: 'parallel · 20', x: 300, y: 410 },
    { id: 'stock', kind: 'connector-builtin', label: 'Reserve stock', x: 520, y: 410 },
    { id: 'total', kind: 'action', label: 'Order total', sublabel: 'variable', x: 770, y: 410 },
  ],
  edges: [
    { id: 'trig-cond', from: 'trigger', to: 'cond' },
    { id: 'cond-expr', from: 'cond', to: 'expr' },
    { id: 'cond-sw', from: 'cond', to: 'sw' },
    { id: 'expr-until', from: 'expr', to: 'until' },
    { id: 'sw-eu', from: 'sw', to: 'eu' },
    { id: 'sw-def', from: 'sw', to: 'def', style: 'dashed' },
    { id: 'sw-loop', from: 'sw', to: 'loop' },
    { id: 'loop-stock', from: 'loop', to: 'stock' },
    { id: 'loop-total', from: 'loop', to: 'total', style: 'dashed' },
    { id: 'scope-loop', from: 'scope', to: 'loop', style: 'dashed' },
    { id: 'nstock-ntotal', from: 'nstock', to: 'ntotal' },
    { id: 'ninvoke-nchild', from: 'ninvoke', to: 'nchild', label: 'runs in parallel' },
  ],
  steps: {
    problem: {
      visible: [...start, ...branch, ...region, ...lines],
      chips: [{ label: 'express?', value: 'some' }, { label: 'carrier', value: 'by region' }, { label: 'lines', value: 'many per order' }],
    },
    condition: {
      visible: [...start, ...branch],
      highlight: ['cond', 'cond-expr', 'expr'],
      tokens: [{ id: 'c1', edge: 'trig-cond', tone: 'info' }, { id: 'c2', edge: 'cond-expr', tone: 'ok' }],
      chips: [{ label: 'paths', value: 'True · False' }, { label: 'path not taken', value: 'Skipped', tone: 'warn' }],
    },
    switch: {
      visible: [...start, ...branch, ...region],
      highlight: ['sw', 'sw-eu', 'eu'],
      tokens: [{ id: 's1', edge: 'cond-sw', tone: 'info' }, { id: 's2', edge: 'sw-eu', tone: 'ok' }],
      chips: [{ label: 'compares', value: 'equality only' }, { label: 'cases', value: 'unique · static' }, { label: 'max cases', value: '25' }],
    },
    foreach: {
      visible: [...start, ...branch, ...region, ...lines],
      highlight: ['loop', 'loop-stock', 'stock'],
      tokens: [
        { id: 'f1', edge: 'loop-stock', tone: 'info' },
        { id: 'f2', edge: 'loop-stock', tone: 'info' },
        { id: 'f3', edge: 'loop-stock', tone: 'info' },
      ],
      chips: [{ label: 'default', value: 'parallel, 20' }, { label: 'range', value: '1–50' }, { label: 'items (default)', value: '100,000 · stateless 100' }],
    },
    variables: {
      visible: [...start, ...branch, ...region, ...lines],
      highlight: ['total', 'loop-total'],
      tokens: [{ id: 'v1', edge: 'loop-total', tone: 'fail' }, { id: 'v2', edge: 'loop-total', tone: 'fail' }],
      chips: [{ label: 'declare', value: 'top level only' }, { label: 'parallel + Increment', value: 'unpredictable', tone: 'fail' }, { label: 'fix', value: 'parallelism 1', tone: 'ok' }],
    },
    nested: {
      visible: ['outerLoop', 'innerLoop', 'childBox', 'nstock', 'ntotal', 'ninvoke', 'nchild', 'nstock-ntotal', 'ninvoke-nchild'],
      highlight: ['innerLoop', 'nchild'],
      tokens: [{ id: 'nl1', edge: 'nstock-ntotal', tone: 'info' }, { id: 'nl2', edge: 'ninvoke-nchild', tone: 'ok' }, { id: 'nl3', edge: 'ninvoke-nchild', tone: 'ok' }],
      chips: [{ label: 'nested For each', value: 'always sequential', tone: 'warn' }, { label: 'need parallel?', value: 'child workflow' }],
    },
    until: {
      visible: [...start, ...branch, 'until', 'expr-until'],
      highlight: ['until', 'expr-until'],
      tokens: [{ id: 'u1', edge: 'expr-until', tone: 'info' }],
      chips: [{ label: 'checks', value: 'after the body' }, { label: 'default', value: '60 loops · 1 hour' }, { label: 'stateless', value: 'max 100 · 5 min', tone: 'warn' }],
    },
    scope: {
      visible: [...start, ...branch, ...region, ...lines, 'scope', 'scope-loop'],
      highlight: ['scope', 'scope-loop', 'loop', 'stock'],
      failed: ['stock'],
      chips: [{ label: 'any action fails', value: 'scope Failed', tone: 'fail' }, { label: 'check', value: "actions('Fulfil')" }],
    },
    limits: {
      visible: [...start, ...branch, ...region, ...lines, 'until', 'expr-until', 'scope', 'scope-loop'],
      chips: [{ label: 'actions', value: '≤ 500' }, { label: 'nesting depth', value: '≤ 8' }, { label: 'Terminate in loops', value: 'not allowed', tone: 'warn' }],
    },
    recap: {
      visible: [...start, ...branch, ...region, ...lines, 'until', 'expr-until', 'scope', 'scope-loop'],
      chips: [{ label: 'choose', value: 'Condition · Switch' }, { label: 'repeat', value: 'For each · Until' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data moving' },
    { tone: 'ok', label: 'path taken' },
    { tone: 'fail', label: 'conflict / failure' },
  ],
};
