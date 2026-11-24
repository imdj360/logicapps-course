import type { Scene } from '../../../../lessons/scene-types';

const fwd = ['orch', 'stock', 'pay', 'courier', 'orch-stock', 'orch-pay', 'orch-courier'];
const comp = ['refund', 'release', 'orch-refund', 'orch-release'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'orch', kind: 'scope', label: 'Orchestrator', sublabel: 'stateful flow', x: 120, y: 240 },
    { id: 'stock', kind: 'action', label: 'Reserve stock', sublabel: 'compensable', x: 440, y: 80 },
    { id: 'pay', kind: 'action', label: 'Charge card', sublabel: 'compensable', x: 440, y: 200 },
    { id: 'courier', kind: 'action', label: 'Book courier', sublabel: 'fails', x: 440, y: 320 },
    { id: 'refund', kind: 'action', label: 'Refund card', sublabel: 'compensation', x: 760, y: 200 },
    { id: 'release', kind: 'action', label: 'Release stock', sublabel: 'compensation', x: 760, y: 80 },
    { id: 'human', kind: 'human', label: 'Operator', sublabel: 'last resort', x: 760, y: 420 },
  ],
  edges: [
    { id: 'orch-stock', from: 'orch', to: 'stock' },
    { id: 'orch-pay', from: 'orch', to: 'pay' },
    { id: 'orch-courier', from: 'orch', to: 'courier' },
    { id: 'orch-refund', from: 'orch', to: 'refund', style: 'dashed' },
    { id: 'orch-release', from: 'orch', to: 'release', style: 'dashed' },
    { id: 'orch-human', from: 'orch', to: 'human', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...fwd],
      failed: ['courier'],
      chips: [{ label: 'committed', value: 'stock · payment' }, { label: 'rollback', value: 'not possible', tone: 'fail' }],
    },
    saga: {
      visible: [...fwd, ...comp],
      failed: ['courier'],
      tokens: [{ id: 's1', edge: 'orch-refund', tone: 'ok' }, { id: 's2', edge: 'orch-release', tone: 'ok' }],
      chips: [{ label: 'undo with', value: 'compensating steps' }],
    },
    types: {
      visible: [...fwd],
      highlight: ['stock', 'pay'],
      chips: [{ label: 'kinds', value: 'compensable · pivot · retryable' }],
    },
    orchestration: {
      visible: [...fwd],
      highlight: ['orch'],
      chips: [{ label: 'our design', value: 'Logic Apps orchestrates' }, { label: 'alternative', value: 'choreography' }],
    },
    compensate: {
      visible: [...fwd, ...comp],
      failed: ['courier'],
      highlight: ['refund', 'release'],
      tokens: [{ id: 'c1', edge: 'orch-refund', tone: 'ok' }, { id: 'c2', edge: 'orch-release', tone: 'ok' }],
      chips: [{ label: 'Catch scope', value: 'compensate completed steps' }],
    },
    fails: {
      visible: [...fwd, ...comp, 'human', 'orch-human'],
      failed: ['refund'],
      highlight: ['human'],
      chips: [{ label: 'compensations', value: 'idempotent · resumable' }, { label: 'last resort', value: 'alert a person', tone: 'warn' }],
    },
    when: {
      visible: [...fwd, ...comp],
      chips: [{ label: 'use', value: 'multi-service operations' }, { label: 'skip', value: 'if retries suffice' }],
    },
    recap: {
      visible: [...fwd, ...comp, 'human', 'orch-human'],
      chips: [{ label: 'no rollback', value: 'compensate' }],
    },
  },
  legend: [{ tone: 'ok', label: 'compensation' }, { tone: 'failed', label: 'failed step' }],
};
