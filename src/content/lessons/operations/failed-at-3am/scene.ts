import type { Scene } from '../../../../lessons/scene-types';

const path = ['phone', 'trig', 'run', 'act', 'phone-trig', 'trig-run', 'run-act'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'phone', kind: 'human', label: 'On-call', sublabel: '03:00', x: 110, y: 240 },
    { id: 'trig', kind: 'trigger', label: 'Trigger history', sublabel: 'step 1', x: 330, y: 240 },
    { id: 'run', kind: 'storage', label: 'Run history', sublabel: 'step 2', x: 560, y: 240 },
    { id: 'act', kind: 'connector-managed', label: 'Failed action', sublabel: 'step 3', x: 790, y: 240 },
    { id: 'storage', kind: 'storage', label: 'Storage account', sublabel: 'step 4', x: 560, y: 410 },
    { id: 'resubmit', kind: 'action', label: 'Resubmit', sublabel: 'after the fix', x: 790, y: 90 },
  ],
  edges: [
    { id: 'phone-trig', from: 'phone', to: 'trig' },
    { id: 'trig-run', from: 'trig', to: 'run' },
    { id: 'run-act', from: 'run', to: 'act' },
    { id: 'run-storage', from: 'run', to: 'storage', style: 'dashed' },
    { id: 'act-resubmit', from: 'act', to: 'resubmit' },
  ],
  steps: {
    problem: {
      visible: ['phone'],
      highlight: ['phone'],
      chips: [{ label: 'alert', value: 'Runs Failure Rate', tone: 'fail' }, { label: 'order', value: 'trigger → run → action → platform' }],
    },
    trigger: {
      visible: ['phone', 'trig', 'phone-trig'],
      highlight: ['trig'],
      tokens: [{ id: 't1', edge: 'phone-trig', tone: 'info' }],
      chips: [{ label: 'Failed', value: 'open Outputs', tone: 'fail' }, { label: 'Skipped', value: 'no run, not an error' }, { label: 'Succeeded', value: 'go to run history', tone: 'ok' }],
    },
    run: {
      visible: ['phone', 'trig', 'run', 'phone-trig', 'trig-run'],
      highlight: ['run'],
      tokens: [{ id: 'r1', edge: 'trig-run', tone: 'info' }],
      chips: [{ label: 'per step', value: 'inputs · outputs · error' }],
    },
    action: {
      visible: [...path],
      failed: ['act'],
      tokens: [{ id: 'a1', edge: 'run-act', tone: 'fail' }],
      chips: [{ label: '401', value: 'credentials' }, { label: '429', value: 'throttling' }, { label: '5xx', value: 'their side' }],
    },
    platform: {
      visible: [...path, 'storage', 'run-storage'],
      failed: ['storage'],
      highlight: ['run-storage'],
      chips: [{ label: 'error', value: 'Cannot reach host runtime', tone: 'fail' }, { label: 'check', value: 'storage · endpoints · DNS' }],
    },
    fix: {
      visible: [...path, 'resubmit', 'act-resubmit'],
      highlight: ['resubmit', 'act-resubmit'],
      tokens: [{ id: 'f1', edge: 'act-resubmit', tone: 'ok' }],
      chips: [{ label: 'reruns', value: 'same version, same inputs' }, { label: 'watch for', value: 'duplicates', tone: 'warn' }],
    },
    after: {
      visible: [...path, 'resubmit', 'act-resubmit'],
      chips: [{ label: 'improve one thing', value: 'catch · idempotency · health' }, { label: 'SLA', value: 'Maximum Burst ≥ 2' }],
    },
    recap: {
      visible: [...path, 'storage', 'resubmit', 'run-storage', 'act-resubmit'],
      chips: [{ label: 'order', value: 'trigger → run → action → platform' }],
    },
  },
  legend: [
    { tone: 'info', label: 'checking' },
    { tone: 'ok', label: 'fixed' },
    { tone: 'fail', label: 'failure' },
  ],
};
