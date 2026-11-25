import type { Scene } from '../../../../lessons/scene-types';

const core = ['req', 'auto', 'req-auto'];
const all = ['req', 'auto', 'conn', 'human', 'req-auto', 'auto-conn', 'auto-human'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'req', kind: 'user', label: 'Supplier email', sublabel: 'unstructured', x: 110, y: 240 },
    { id: 'fixed', kind: 'action', label: 'Fixed workflow', sublabel: 'known steps', x: 380, y: 420 },
    { id: 'auto', kind: 'llm-agent', label: 'Automation', sublabel: 'picks next step', x: 380, y: 240 },
    { id: 'conn', kind: 'connector-managed', label: 'Connectors', sublabel: '1,400+', x: 680, y: 170 },
    { id: 'human', kind: 'human', label: 'Human approval', sublabel: 'when needed', x: 680, y: 330 },
    { id: 'ai', kind: 'llm-agent', label: 'AI assistant', sublabel: 'prompts', x: 110, y: 100 },
    { id: 'designer', kind: 'action', label: 'Designer', sublabel: 'visual canvas', x: 110, y: 240 },
    { id: 'templates', kind: 'scope', label: 'Templates', sublabel: 'prebuilt start', x: 110, y: 380 },
  ],
  edges: [
    { id: 'req-auto', from: 'req', to: 'auto' },
    { id: 'req-fixed', from: 'req', to: 'fixed', style: 'dashed' },
    { id: 'auto-conn', from: 'auto', to: 'conn' },
    { id: 'auto-human', from: 'auto', to: 'human' },
    { id: 'ai-auto', from: 'ai', to: 'auto' },
    { id: 'designer-auto', from: 'designer', to: 'auto' },
    { id: 'templates-auto', from: 'templates', to: 'auto' },
  ],
  steps: {
    problem: {
      visible: ['req', 'fixed', 'req-fixed'],
      highlight: ['req'],
      chips: [{ label: 'fixed paths', value: 'brittle when conditions change', tone: 'warn' }],
    },
    approach: {
      visible: core,
      highlight: ['auto'],
      tokens: [{ id: 'a1', edge: 'req-auto', tone: 'info' }],
      chips: [{ label: 'you', value: 'describe what to automate' }, { label: 'platform', value: 'reasons, chooses next step' }],
    },
    runtime: {
      visible: all,
      highlight: ['auto'],
      tokens: [{ id: 'r1', edge: 'auto-conn', tone: 'info' }, { id: 'r2', edge: 'auto-human', tone: 'ok' }],
      chips: [{ label: 'approach', value: 'probabilistic, agentic' }, { label: 'last task', value: 'human approval where needed' }],
    },
    pick: {
      visible: [...core, 'fixed', 'req-fixed'],
      highlight: ['auto', 'fixed'],
      chips: [{ label: 'Automation', value: 'variable, decision-loaded' }, { label: 'Standard or Consumption', value: 'stable, predictable' }],
    },
    orchestration: {
      visible: [...core, 'fixed', 'req-fixed'],
      highlight: ['auto', 'fixed'],
      chips: [{ label: 'Automation', value: 'probabilistic' }, { label: 'Standard', value: 'deterministic' }],
    },
    sibling: {
      visible: [...core, 'fixed', 'req-fixed', 'conn', 'auto-conn'],
      highlight: ['auto', 'fixed', 'conn'],
      chips: [{ label: 'shared with Standard', value: 'runtime · connectors · management' }, { label: 'Consumption', value: 'different runtime', tone: 'warn' }],
    },
    compare: {
      visible: [...core, 'fixed', 'req-fixed'],
      highlight: ['auto', 'fixed'],
      chips: [{ label: 'Automation compute', value: 'dedicated, scales to zero' }, { label: 'Standard compute', value: 'dedicated, you manage' }],
    },
    browser: {
      visible: ['ai', 'designer', 'templates', 'auto', 'conn', 'human', 'ai-auto', 'designer-auto', 'templates-auto', 'auto-conn', 'auto-human'],
      highlight: ['ai', 'designer', 'templates'],
      chips: [{ label: 'build · test · monitor', value: 'in your browser' }, { label: 'install', value: 'none for browser use' }],
    },
    preview: {
      visible: all,
      chips: [{ label: 'status', value: 'preview', tone: 'warn' }, { label: 'details', value: 'can change', tone: 'warn' }],
    },
    recap: {
      visible: [...all, 'fixed', 'req-fixed'],
      chips: [{ label: 'Automation', value: 'sibling for unpredictable paths' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request / step' },
    { tone: 'ok', label: 'approval' },
  ],
};
