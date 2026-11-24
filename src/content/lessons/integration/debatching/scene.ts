import type { Scene } from '../../../../lessons/scene-types';

const split = ['partner', 'trig', 'r1', 'r2', 'r3', 'partner-trig', 'trig-r1', 'trig-r2', 'trig-r3'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'partner', kind: 'user', label: 'Partner', sublabel: '500 orders', x: 110, y: 240 },
    { id: 'trig', kind: 'trigger', label: 'Request', sublabel: 'Split on', x: 380, y: 240 },
    { id: 'r1', kind: 'action', label: 'Run: order 1', x: 660, y: 100 },
    { id: 'r2', kind: 'action', label: 'Run: order 2', x: 660, y: 240 },
    { id: 'r3', kind: 'action', label: 'Run: order 500', x: 660, y: 380 },
    { id: 'each', kind: 'scope', label: 'For each', sublabel: 'one run', x: 380, y: 420 },
  ],
  edges: [
    { id: 'partner-trig', from: 'partner', to: 'trig' },
    { id: 'trig-r1', from: 'trig', to: 'r1' },
    { id: 'trig-r2', from: 'trig', to: 'r2' },
    { id: 'trig-r3', from: 'trig', to: 'r3' },
    { id: 'partner-each', from: 'partner', to: 'each', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['partner', 'each', 'partner-each'],
      highlight: ['each'],
      tokens: [{ id: 'p1', edge: 'partner-each', tone: 'info' }],
      chips: [{ label: 'For each', value: '500 items, one run' }, { label: 'our concern', value: 'one failure, whole run', tone: 'warn' }],
    },
    spliton: {
      visible: [...split],
      highlight: ['trig'],
      tokens: [{ id: 's1', edge: 'trig-r1', tone: 'ok' }, { id: 's2', edge: 'trig-r2', tone: 'ok' }, { id: 's3', edge: 'trig-r3', tone: 'ok' }],
      chips: [{ label: 'setting', value: 'Split on' }, { label: 'result', value: 'one run per item' }],
    },
    which: {
      visible: [...split],
      highlight: ['trig'],
      chips: [{ label: 'supported', value: 'Request · HTTP · Service Bus' }, { label: 'needs', value: 'array in, array out' }],
    },
    scope: {
      visible: [...split],
      highlight: ['r2'],
      chips: [{ label: 'outside properties', value: 'not directly' }, { label: 'outside the array', value: 'use ?', tone: 'warn' }],
    },
    response: {
      visible: [...split],
      highlight: ['partner-trig', 'partner'],
      tokens: [{ id: 'r1t', edge: 'partner-trig', tone: 'info' }],
      chips: [{ label: 'with Response', value: '202 Accepted at once', tone: 'warn' }],
    },
    limits: {
      visible: [...split],
      chips: [{ label: 'max items', value: '100,000' }, { label: 'with concurrency', value: '100', tone: 'warn' }],
    },
    vs: {
      visible: [...split, 'each', 'partner-each'],
      chips: [{ label: 'split', value: 'items stand alone' }, { label: 'loop', value: 'items belong together' }],
    },
    recap: {
      visible: [...split, 'each', 'partner-each'],
      chips: [{ label: 'Split on', value: 'one run per item' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request' },
    { tone: 'ok', label: 'separate run' },
  ],
};
