import type { Scene } from '../../../../lessons/scene-types';

const core = ['alert', 'trigger', 'agent', 'alert-trigger', 'trigger-agent'];
const tools = ['history', 'logs', 'agent-history', 'agent-logs'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'alert', kind: 'appinsights', label: 'Failure alert', x: 110, y: 100 },
    { id: 'trigger', kind: 'trigger', label: 'Alert received', x: 330, y: 100 },
    { id: 'agent', kind: 'llm-agent', label: 'Agent', sublabel: 'instructions', x: 550, y: 100 },
    { id: 'model', kind: 'llm-agent', label: 'Model', sublabel: 'Azure OpenAI', x: 780, y: 100 },
    { id: 'history', kind: 'action', label: 'Get run history', sublabel: 'read-only tool', x: 330, y: 260 },
    { id: 'logs', kind: 'action', label: 'Query logs', sublabel: 'read-only tool', x: 550, y: 260 },
    { id: 'human', kind: 'human', label: 'Ops team', sublabel: 'approval', x: 780, y: 270 },
    { id: 'resubmit', kind: 'action', label: 'Resubmit runs', sublabel: 'after approval', x: 780, y: 420 },
  ],
  edges: [
    { id: 'alert-trigger', from: 'alert', to: 'trigger' },
    { id: 'trigger-agent', from: 'trigger', to: 'agent' },
    { id: 'agent-model', from: 'agent', to: 'model' },
    { id: 'agent-history', from: 'agent', to: 'history' },
    { id: 'agent-logs', from: 'agent', to: 'logs' },
    { id: 'agent-human', from: 'agent', to: 'human', style: 'dashed' },
    { id: 'human-resubmit', from: 'human', to: 'resubmit' },
  ],
  steps: {
    problem: {
      visible: ['alert'],
      failed: ['alert'],
      chips: [{ label: 'failed runs', value: '12', tone: 'fail' }, { label: 'ops team', value: 'reading run history' }],
    },
    types: {
      visible: [...core],
      highlight: ['trigger'],
      tokens: [{ id: 'y1', edge: 'alert-trigger', tone: 'info' }],
      chips: [{ label: 'type', value: 'autonomous' }, { label: 'plan', value: 'Standard (stateful)' }],
    },
    loop: {
      visible: [...core, 'model', 'agent-model'],
      highlight: ['agent', 'model', 'agent-model'],
      tokens: [{ id: 'l1', edge: 'agent-model', tone: 'info' }],
      chips: [{ label: 'loop', value: 'plan → call tool → read' }, { label: 'changes allowed', value: 'none', tone: 'ok' }],
    },
    tools: {
      visible: [...core, 'model', 'agent-model', ...tools],
      highlight: ['history', 'logs'],
      chips: [{ label: 'tools', value: '2' }, { label: 'access', value: 'read-only', tone: 'ok' }],
    },
    investigate: {
      visible: [...core, 'model', 'agent-model', ...tools],
      highlight: ['agent-history', 'agent-logs'],
      tokens: [{ id: 'i1', edge: 'agent-history', tone: 'info' }, { id: 'i2', edge: 'agent-logs', tone: 'info' }, { id: 'i3', edge: 'agent-model', tone: 'info' }],
      chips: [{ label: 'iteration', value: '3' }, { label: 'cause', value: '503 during deploy', tone: 'warn' }],
    },
    propose: {
      visible: [...core, 'model', 'agent-model', ...tools],
      highlight: ['agent'],
      chips: [{ label: 'proposal', value: 'resubmit 12 runs' }, { label: 'duplicates', value: 'none expected', tone: 'ok' }],
    },
    approve: {
      visible: [...core, ...tools, 'human', 'resubmit', 'agent-human', 'human-resubmit'],
      highlight: ['human', 'human-resubmit'],
      tokens: [{ id: 'a1', edge: 'agent-human', tone: 'info' }, { id: 'a2', edge: 'human-resubmit', tone: 'ok' }],
      chips: [{ label: 'approval', value: 'Approved', tone: 'ok' }, { label: 'resubmitted', value: '12 runs', tone: 'ok' }],
    },
    trace: {
      visible: [...core, 'model', 'agent-model', ...tools],
      highlight: ['agent'],
      chips: [{ label: 'agent log', value: 'tool calls · messages' }, { label: 'tokens', value: 'per request' }],
    },
    guardrails: {
      visible: [...core, 'model', 'agent-model', ...tools, 'human', 'resubmit', 'agent-human', 'human-resubmit'],
      highlight: ['human'],
      chips: [{ label: 'tools', value: 'read-only', tone: 'ok' }, { label: 'model auth', value: 'managed identity', tone: 'ok' }],
    },
    recap: {
      visible: [...core, 'model', 'agent-model', ...tools, 'human', 'resubmit', 'agent-human', 'human-resubmit'],
      chips: [{ label: 'agent', value: 'investigates' }, { label: 'human', value: 'decides' }],
    },
  },
  legend: [{ tone: 'info', label: 'agent loop' }, { tone: 'ok', label: 'approved change' }],
};
