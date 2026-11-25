import type { Scene } from '../../../../lessons/scene-types';

const fwd = ['orch', 'stock', 'pay', 'courier', 'orch-stock', 'orch-pay', 'orch-courier'];
const comp = ['refund', 'release', 'orch-refund', 'orch-release'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'orch', kind: 'scope', label: 'Order workflow', sublabel: 'in charge', x: 120, y: 250 },
    { id: 'stock', kind: 'action', label: 'Reserve stock', sublabel: 'compensable', x: 450, y: 55 },
    { id: 'pay', kind: 'action', label: 'Charge card', sublabel: 'compensable', x: 450, y: 135 },
    { id: 'courier', kind: 'action', label: 'Book courier', sublabel: 'fails', x: 450, y: 215 },
    { id: 'refund', kind: 'action', label: 'Refund card', sublabel: 'compensation', x: 760, y: 300 },
    { id: 'release', kind: 'action', label: 'Release stock', sublabel: 'compensation', x: 760, y: 380 },
    { id: 'human', kind: 'human', label: 'Operator', sublabel: 'last resort', x: 760, y: 460 },
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
      chips: [{ label: 'committed', value: 'stock, payment' }, { label: 'rollback', value: 'not possible', tone: 'fail' }],
    },
    idea: {
      visible: [...fwd, ...comp],
      failed: ['courier'],
      tokens: [{ id: 's1', edge: 'orch-refund', tone: 'ok' }, { id: 's2', edge: 'orch-release', tone: 'ok' }],
      chips: [{ label: 'undo with', value: 'the opposite step' }],
    },
    kinds: {
      visible: [...fwd],
      highlight: ['stock', 'pay'],
      chips: [{ label: 'before pivot', value: 'compensable' }, { label: 'after pivot', value: 'retryable' }],
    },
    flow: {
      visible: [...fwd, ...comp],
      failed: ['courier'],
      tokens: [
        { id: 'f1', edge: 'orch-stock', tone: 'info' },
        { id: 'f2', edge: 'orch-pay', tone: 'info' },
        { id: 'f3', edge: 'orch-courier', tone: 'fail' },
        { id: 'f4', edge: 'orch-refund', tone: 'ok' },
        { id: 'f5', edge: 'orch-release', tone: 'ok' },
      ],
      chips: [{ label: '1-2', value: 'stock, card done' }, { label: '3', value: 'courier fails', tone: 'fail' }, { label: '4', value: 'refund, release' }],
    },
    build: {
      visible: [...fwd, ...comp],
      failed: ['courier'],
      highlight: ['orch', 'refund', 'release'],
      tokens: [{ id: 'c1', edge: 'orch-refund', tone: 'ok' }, { id: 'c2', edge: 'orch-release', tone: 'ok' }],
      chips: [{ label: 'Try scope', value: 'the 3 steps' }, { label: 'Catch scope', value: 'Has failed, Has timed out' }],
    },
    orchestration: {
      visible: [...fwd],
      highlight: ['orch'],
      chips: [{ label: 'orchestration', value: 'one boss' }, { label: 'choreography', value: 'events, no boss' }],
    },
    fails: {
      visible: [...fwd, ...comp, 'human', 'orch-human'],
      failed: ['refund'],
      highlight: ['human'],
      chips: [{ label: 'compensations', value: 'idempotent, resumable' }, { label: 'last resort', value: 'alert a person', tone: 'warn' }],
    },
    gap: {
      visible: [...fwd, ...comp],
      failed: ['courier'],
      chips: [{ label: 'meanwhile', value: 'data briefly wrong', tone: 'warn' }],
    },
    when: {
      visible: [...fwd, ...comp],
      chips: [{ label: 'use', value: 'multi-service operations' }, { label: 'skip when', value: 'tightly coupled' }],
    },
    recap: {
      visible: [...fwd, ...comp, 'human', 'orch-human'],
      chips: [{ label: 'no rollback', value: 'compensate' }],
    },
  },
  legend: [{ tone: 'info', label: 'forward step' }, { tone: 'ok', label: 'compensation' }, { tone: 'failed', label: 'failed step' }],
};
