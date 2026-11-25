import type { Scene } from '../../../../lessons/scene-types';

const core = ['user', 'agent', 'model', 'user-agent', 'agent-model'];
const tools = ['read', 'write', 'agent-read', 'agent-write'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'user', kind: 'human', label: 'Caller', sublabel: 'user / app', x: 110, y: 240 },
    { id: 'agent', kind: 'llm-agent', label: 'Agent', sublabel: 'agent loop', x: 380, y: 240 },
    { id: 'model', kind: 'llm-agent', label: 'Model', sublabel: 'Azure OpenAI', x: 380, y: 80 },
    { id: 'read', kind: 'action', label: 'Read tool', sublabel: 'read-only', x: 680, y: 150 },
    { id: 'write', kind: 'action', label: 'Write tool', sublabel: 'changes data', x: 680, y: 330 },
    { id: 'mock', kind: 'action', label: 'Compose (mock)', sublabel: 'fake result', x: 680, y: 240 },
    { id: 'human', kind: 'human', label: 'Approver', sublabel: 'checkpoint', x: 680, y: 450 },
    { id: 'log', kind: 'appinsights', label: 'Agent log', sublabel: 'tools · tokens', x: 110, y: 420 },
  ],
  edges: [
    { id: 'user-agent', from: 'user', to: 'agent' },
    { id: 'agent-model', from: 'agent', to: 'model' },
    { id: 'agent-read', from: 'agent', to: 'read' },
    { id: 'agent-write', from: 'agent', to: 'write', style: 'dashed' },
    { id: 'agent-mock', from: 'agent', to: 'mock', style: 'dashed' },
    { id: 'write-human', from: 'write', to: 'human', style: 'dashed' },
    { id: 'agent-log', from: 'agent', to: 'log', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...core, ...tools],
      highlight: ['write'],
      chips: [{ label: 'agent chooses', value: 'which tool' }, { label: 'risk', value: 'the wrong one', tone: 'warn' }],
    },
    identity: {
      visible: [...core],
      highlight: ['model', 'agent-model'],
      chips: [{ label: 'identity', value: 'system-assigned MI' }, { label: 'role', value: 'Cognitive Services OpenAI User' }],
    },
    callers: {
      visible: [...core],
      highlight: ['user', 'user-agent'],
      tokens: [{ id: 'c1', edge: 'user-agent', tone: 'info' }],
      chips: [{ label: 'portal test', value: 'developer key' }, { label: 'production', value: 'Easy Auth (preview)', tone: 'ok' }],
    },
    tools: {
      visible: [...core, ...tools],
      highlight: ['read', 'agent-read'],
      tokens: [{ id: 't1', edge: 'agent-read', tone: 'ok' }],
      chips: [{ label: 'start with', value: 'read-only tools', tone: 'ok' }, { label: 'writes', value: 'explicit confirmation' }],
    },
    human: {
      visible: [...core, ...tools, 'human', 'write-human'],
      highlight: ['human', 'write-human'],
      tokens: [{ id: 'h1', edge: 'write-human', tone: 'info' }],
      chips: [{ label: 'built-in gate', value: 'not documented', tone: 'warn' }, { label: 'so', value: 'design the checkpoint' }],
    },
    test: {
      visible: [...core, 'mock', 'agent-mock'],
      highlight: ['mock', 'agent-mock'],
      tokens: [{ id: 'te1', edge: 'agent-mock', tone: 'ok' }],
      chips: [{ label: 'design with', value: 'Compose · mocked results' }],
    },
    observe: {
      visible: [...core, ...tools, 'log', 'agent-log'],
      highlight: ['log', 'agent-log'],
      tokens: [{ id: 'o1', edge: 'agent-log', tone: 'info' }],
      chips: [{ label: 'per iteration', value: 'messages · tools · tokens' }],
    },
    cost: {
      visible: [...core, 'log', 'agent-log'],
      highlight: ['model'],
      chips: [{ label: 'cost driver', value: 'tokens' }, { label: 'tools', value: '~10 guideline' }],
    },
    recap: {
      visible: [...core, ...tools, 'human', 'log', 'write-human', 'agent-log'],
      chips: [{ label: 'agent', value: 'inside the lines' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request / log' },
    { tone: 'ok', label: 'allowed' },
  ],
};
