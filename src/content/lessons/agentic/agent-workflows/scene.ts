import type { Scene } from '../../../../lessons/scene-types';

const core = ['trigger', 'agent', 'model', 'trig-agent', 'agent-model'];
const tools = ['t1', 't2', 'agent-t1', 'agent-t2'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Complaint in', sublabel: 'any trigger', x: 110, y: 240 },
    { id: 'agent', kind: 'llm-agent', label: 'Agent', sublabel: 'think · act', x: 380, y: 240 },
    { id: 'model', kind: 'llm-agent', label: 'Model', sublabel: 'Azure OpenAI', x: 380, y: 80 },
    { id: 't1', kind: 'action', label: 'Look up order', sublabel: 'tool', x: 680, y: 160 },
    { id: 't2', kind: 'connector-managed', label: 'Draft reply', sublabel: 'tool', x: 680, y: 330 },
    { id: 'fixed', kind: 'action', label: 'Fixed workflow', sublabel: 'known steps', x: 380, y: 420 },
  ],
  edges: [
    { id: 'trig-agent', from: 'trigger', to: 'agent' },
    { id: 'agent-model', from: 'agent', to: 'model' },
    { id: 'agent-t1', from: 'agent', to: 't1' },
    { id: 'agent-t2', from: 'agent', to: 't2' },
    { id: 'trig-fixed', from: 'trigger', to: 'fixed', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['trigger', 'fixed', 'trig-fixed', 'agent', 'trig-agent'],
      highlight: ['agent'],
      chips: [{ label: 'rules', value: 'fixed workflow' }, { label: 'judgement', value: 'agent workflow' }],
    },
    compare: {
      visible: [...core, 'fixed', 'trig-fixed'],
      highlight: ['agent', 'fixed'],
      chips: [{ label: 'fixed', value: 'stable · predictable' }, { label: 'agent', value: 'adapts · unstructured' }],
    },
    loop: {
      visible: [...core, ...tools],
      highlight: ['agent', 'agent-model'],
      tokens: [{ id: 'l1', edge: 'agent-model', tone: 'info' }, { id: 'l2', edge: 'agent-t1', tone: 'ok' }],
      chips: [{ label: 'loop', value: 'think → act → (learn)' }, { label: 'model', value: 'Azure OpenAI (Standard)' }],
    },
    instructions: {
      visible: [...core],
      highlight: ['agent'],
      chips: [{ label: 'instructions', value: 'role · tasks · limits' }, { label: 'advice', value: 'prescriptive, iterate' }],
    },
    tools: {
      visible: [...core, ...tools],
      highlight: ['t1', 't2'],
      tokens: [{ id: 'tt1', edge: 'agent-t1', tone: 'ok' }, { id: 'tt2', edge: 'agent-t2', tone: 'ok' }],
      chips: [{ label: 'tool', value: 'actions, no trigger' }, { label: 'guideline', value: '≤ 10 tools' }],
    },
    types: {
      visible: [...core, ...tools],
      highlight: ['trigger'],
      chips: [{ label: 'autonomous', value: 'any trigger' }, { label: 'conversational', value: 'chat session' }],
    },
    where: {
      visible: [...core, ...tools],
      chips: [{ label: 'Standard', value: 'stateful only' }, { label: 'Consumption', value: 'preview', tone: 'warn' }],
    },
    limits: {
      visible: [...core],
      highlight: ['agent-model'],
      chips: [{ label: 'gpt-4o context', value: '128,000 tokens' }, { label: 'history trimming', value: 'experimental', tone: 'warn' }],
    },
    cost: {
      visible: [...core, ...tools],
      highlight: ['model'],
      chips: [{ label: 'Standard', value: 'pay for model usage' }, { label: 'save tokens', value: 'trim tool results' }],
    },
    recap: {
      visible: [...core, ...tools, 'fixed', 'trig-fixed'],
      chips: [{ label: 'agent', value: 'model + instructions + tools' }],
    },
  },
  legend: [
    { tone: 'info', label: 'to the model' },
    { tone: 'ok', label: 'tool call' },
  ],
};
