import type { Scene } from '../../../../lessons/scene-types';

const handoff = ['triage', 'refund', 'sales', 'triage-refund', 'triage-sales'];
const chain = ['a1', 'a2', 'a3', 'a1-a2', 'a2-a3'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'chat', kind: 'human', label: 'Customer', sublabel: 'chat', x: 110, y: 200 },
    { id: 'solo', kind: 'llm-agent', label: 'Service agent', sublabel: 'all jobs', x: 380, y: 200 },
    { id: 'triage', kind: 'llm-agent', label: 'Service agent', sublabel: 'handoff tools', x: 380, y: 200 },
    { id: 'refund', kind: 'llm-agent', label: 'Refund agent', sublabel: 'refund tools', x: 680, y: 100 },
    { id: 'sales', kind: 'llm-agent', label: 'Sales agent', sublabel: 'order tools', x: 680, y: 280 },
    { id: 'router', kind: 'condition', label: 'Classifier', sublabel: 'routes once', x: 380, y: 200 },
    { id: 'billing', kind: 'llm-agent', label: 'Billing agent', sublabel: 'billing prompts', x: 680, y: 100 },
    { id: 'support', kind: 'llm-agent', label: 'Support agent', sublabel: 'support prompts', x: 680, y: 280 },
    { id: 'a1', kind: 'llm-agent', label: 'Extract', sublabel: 'chain 1', x: 160, y: 430 },
    { id: 'a2', kind: 'llm-agent', label: 'Format', sublabel: 'chain 2', x: 450, y: 430 },
    { id: 'a3', kind: 'llm-agent', label: 'Sort', sublabel: 'chain 3', x: 740, y: 430 },
    { id: 'orch', kind: 'llm-agent', label: 'Orchestrator', sublabel: 'plans subtasks', x: 240, y: 240 },
    { id: 'w1', kind: 'llm-agent', label: 'Worker A', sublabel: 'subtask 1', x: 640, y: 100 },
    { id: 'w2', kind: 'llm-agent', label: 'Worker B', sublabel: 'subtask 2', x: 640, y: 240 },
    { id: 'w3', kind: 'llm-agent', label: 'Worker C', sublabel: 'subtask 3', x: 640, y: 380 },
  ],
  edges: [
    { id: 'chat-solo', from: 'chat', to: 'solo' },
    { id: 'chat-triage', from: 'chat', to: 'triage' },
    { id: 'triage-refund', from: 'triage', to: 'refund' },
    { id: 'triage-sales', from: 'triage', to: 'sales' },
    { id: 'chat-router', from: 'chat', to: 'router' },
    { id: 'router-billing', from: 'router', to: 'billing', label: 'billing' },
    { id: 'router-support', from: 'router', to: 'support', label: 'tech' },
    { id: 'a1-a2', from: 'a1', to: 'a2', label: 'validate' },
    { id: 'a2-a3', from: 'a2', to: 'a3', label: 'validate' },
    { id: 'orch-w1', from: 'orch', to: 'w1' },
    { id: 'orch-w2', from: 'orch', to: 'w2' },
    { id: 'orch-w3', from: 'orch', to: 'w3' },
  ],
  steps: {
    problem: {
      visible: ['chat', 'solo', 'chat-solo'],
      highlight: ['solo'],
      chips: [{ label: 'one agent', value: 'too many jobs', tone: 'warn' }, { label: 'status', value: 'patterns in preview' }],
    },
    benefits: {
      visible: ['chat', 'chat-triage', ...handoff],
      highlight: ['refund', 'sales'],
      chips: [{ label: 'gain', value: 'focus · isolation · checkpoints' }],
    },
    chain: {
      visible: chain,
      highlight: ['a1-a2', 'a2-a3'],
      tokens: [{ id: 'c1', edge: 'a1-a2', tone: 'ok' }, { id: 'c2', edge: 'a2-a3', tone: 'ok' }],
      chips: [{ label: 'pattern', value: 'prompt chaining' }, { label: 'between steps', value: 'validation gates' }],
    },
    routing: {
      visible: ['chat', 'router', 'billing', 'support', 'chat-router', 'router-billing', 'router-support'],
      highlight: ['router', 'router-billing'],
      tokens: [{ id: 'r0', edge: 'chat-router', tone: 'info' }, { id: 'r1', edge: 'router-billing', tone: 'info' }],
      chips: [{ label: 'pattern', value: 'routing' }, { label: 'first step', value: 'classify' }],
    },
    handoff: {
      visible: ['chat', 'chat-triage', ...handoff],
      highlight: ['triage-refund', 'triage-sales'],
      tokens: [{ id: 'h1', edge: 'triage-refund', tone: 'ok' }, { id: 'h2', edge: 'triage-sales', tone: 'ok' }],
      chips: [{ label: 'pattern', value: 'handoff' }, { label: 'keeps', value: 'full conversation' }],
    },
    parallel: {
      visible: ['orch', 'w1', 'w2', 'w3', 'orch-w1', 'orch-w2', 'orch-w3'],
      highlight: ['orch', 'w1', 'w2', 'w3'],
      tokens: [{ id: 'p1', edge: 'orch-w1', tone: 'info' }, { id: 'p2', edge: 'orch-w2', tone: 'info' }, { id: 'p3', edge: 'orch-w3', tone: 'info' }],
      chips: [{ label: 'parallel', value: 'sectioning · voting' }, { label: 'complex', value: 'orchestrator · evaluator' }],
    },
    choose: {
      visible: ['chat', 'chat-triage', ...handoff, ...chain],
      chips: [{ label: 'start', value: 'simplest that fits', tone: 'ok' }],
    },
    recap: {
      visible: ['chat', 'chat-triage', ...handoff, ...chain],
      chips: [{ label: 'split', value: 'by specialty' }],
    },
  },
  legend: [
    { tone: 'info', label: 'routed / fan-out' },
    { tone: 'ok', label: 'chained / handoff' },
  ],
};
