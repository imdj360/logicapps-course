import type { Scene } from '../../../../lessons/scene-types';

const handoff = ['triage', 'refund', 'sales', 'triage-refund', 'triage-sales'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'chat', kind: 'human', label: 'Customer', sublabel: 'chat', x: 110, y: 240 },
    { id: 'triage', kind: 'llm-agent', label: 'Service agent', sublabel: 'handoff tools', x: 380, y: 240 },
    { id: 'refund', kind: 'llm-agent', label: 'Refund agent', sublabel: 'refund tools', x: 680, y: 130 },
    { id: 'sales', kind: 'llm-agent', label: 'Sales agent', sublabel: 'order tools', x: 680, y: 350 },
    { id: 'a1', kind: 'llm-agent', label: 'Extract', sublabel: 'chain 1', x: 230, y: 420 },
    { id: 'a2', kind: 'llm-agent', label: 'Format', sublabel: 'chain 2', x: 450, y: 420 },
  ],
  edges: [
    { id: 'chat-triage', from: 'chat', to: 'triage' },
    { id: 'triage-refund', from: 'triage', to: 'refund' },
    { id: 'triage-sales', from: 'triage', to: 'sales' },
    { id: 'a1-a2', from: 'a1', to: 'a2' },
  ],
  steps: {
    problem: {
      visible: ['chat', 'triage', 'chat-triage'],
      highlight: ['triage'],
      chips: [{ label: 'one agent', value: 'too many tools', tone: 'warn' }, { label: 'status', value: 'patterns in preview' }],
    },
    benefits: {
      visible: ['chat', 'chat-triage', ...handoff],
      highlight: ['refund', 'sales'],
      chips: [{ label: 'gain', value: 'focus · isolation · checkpoints' }],
    },
    chain: {
      visible: ['a1', 'a2', 'a1-a2'],
      highlight: ['a1-a2'],
      tokens: [{ id: 'c1', edge: 'a1-a2', tone: 'ok' }],
      chips: [{ label: 'pattern', value: 'prompt chaining' }, { label: 'between steps', value: 'validation gates' }],
    },
    routing: {
      visible: ['chat', 'chat-triage', ...handoff],
      highlight: ['triage'],
      tokens: [{ id: 'r1', edge: 'triage-refund', tone: 'info' }],
      chips: [{ label: 'pattern', value: 'routing' }, { label: 'first step', value: 'classify' }],
    },
    handoff: {
      visible: ['chat', 'chat-triage', ...handoff],
      highlight: ['triage-refund', 'triage-sales'],
      tokens: [{ id: 'h1', edge: 'triage-refund', tone: 'ok' }, { id: 'h2', edge: 'triage-sales', tone: 'ok' }],
      chips: [{ label: 'pattern', value: 'handoff' }, { label: 'keeps', value: 'full conversation' }],
    },
    parallel: {
      visible: ['chat', 'chat-triage', ...handoff, 'a1', 'a2', 'a1-a2'],
      chips: [{ label: 'parallel', value: 'sectioning · voting' }, { label: 'complex', value: 'orchestrator · evaluator' }],
    },
    choose: {
      visible: ['chat', 'chat-triage', ...handoff, 'a1', 'a2', 'a1-a2'],
      chips: [{ label: 'start', value: 'simplest that fits', tone: 'ok' }],
    },
    recap: {
      visible: ['chat', 'chat-triage', ...handoff, 'a1', 'a2', 'a1-a2'],
      chips: [{ label: 'split', value: 'by specialty' }],
    },
  },
  legend: [
    { tone: 'info', label: 'classified' },
    { tone: 'ok', label: 'handed over' },
  ],
};
