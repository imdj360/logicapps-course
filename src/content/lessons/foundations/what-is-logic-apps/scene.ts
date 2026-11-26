import type { Scene } from '../../../../lessons/scene-types';

// Problem: a clerk does it by hand. Then Microsoft's overview example as one framed workflow.
const byHand = ['p-site', 'p-clerk', 'p-erp', 'p-rev', 'p-site-clerk', 'p-clerk-erp', 'p-clerk-rev'];
const wf = ['wfBox', 'site', 'trig', 'site-trig'];
const steps = ['cond', 'create', 'review', 'trig-cond', 'cond-create', 'cond-review'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'wfBox', label: 'Order workflow', x: 210, y: 70, w: 670, h: 300 },
  ],
  nodes: [
    { id: 'p-site', kind: 'user', label: 'Website', sublabel: 'orders in', x: 110, y: 240 },
    { id: 'p-clerk', kind: 'human', label: 'Order clerk', sublabel: 'by hand', x: 400, y: 240 },
    { id: 'p-erp', kind: 'user', label: 'ERP', sublabel: 'typed in', x: 720, y: 140 },
    { id: 'p-rev', kind: 'human', label: 'Reviewer', sublabel: 'big orders', x: 720, y: 340 },
    { id: 'site', kind: 'user', label: 'Website', sublabel: 'places order', x: 100, y: 220 },
    { id: 'trig', kind: 'trigger', label: 'Order received', sublabel: 'Request trigger', x: 310, y: 220 },
    { id: 'cond', kind: 'condition', label: 'Over limit?', sublabel: 'Condition', x: 520, y: 220 },
    { id: 'create', kind: 'connector-builtin', label: 'Create order', sublabel: 'HTTP to ERP', x: 760, y: 140 },
    { id: 'review', kind: 'connector-managed', label: 'Ask for review', sublabel: 'Outlook email', x: 760, y: 300 },
    { id: 'json', kind: 'storage', label: 'workflow.json', sublabel: 'definition', x: 545, y: 440 },
    { id: 'cons', kind: 'hosting-plan', label: 'Consumption', sublabel: '1 workflow', x: 330, y: 440 },
    { id: 'std', kind: 'hosting-plan', label: 'Standard', sublabel: 'many workflows', x: 650, y: 440 },
  ],
  edges: [
    { id: 'p-site-clerk', from: 'p-site', to: 'p-clerk' },
    { id: 'p-clerk-erp', from: 'p-clerk', to: 'p-erp' },
    { id: 'p-clerk-rev', from: 'p-clerk', to: 'p-rev', style: 'dashed' },
    { id: 'site-trig', from: 'site', to: 'trig', label: 'order' },
    { id: 'trig-cond', from: 'trig', to: 'cond' },
    { id: 'cond-create', from: 'cond', to: 'create', label: 'under' },
    { id: 'cond-review', from: 'cond', to: 'review', label: 'over' },
    { id: 'wf-json', from: 'wfBox', to: 'json', style: 'dashed', label: 'saved as' },
    { id: 'cons-std', from: 'cons', to: 'std', label: 'redesigned' },
  ],
  steps: {
    problem: {
      visible: [...byHand],
      highlight: ['p-clerk'],
      tokens: [{ id: 'p1', edge: 'p-site-clerk', tone: 'info' }, { id: 'p2', edge: 'p-clerk-erp', tone: 'info' }],
      chips: [{ label: 'every order', value: 'typed by hand' }, { label: 'clerk away', value: 'orders wait', tone: 'warn' }],
    },
    idea: {
      visible: [...wf, ...steps],
      highlight: ['wfBox'],
      tokens: [{ id: 'i1', edge: 'site-trig', tone: 'info' }, { id: 'i2', edge: 'trig-cond', tone: 'info' }, { id: 'i3', edge: 'cond-create', tone: 'ok' }],
      chips: [{ label: 'code', value: 'little or none' }, { label: 'hosting · scaling', value: 'managed by Azure', tone: 'ok' }],
    },
    trigger: {
      visible: [...wf],
      highlight: ['trig', 'site-trig'],
      tokens: [{ id: 't1', edge: 'site-trig', tone: 'info' }],
      chips: [{ label: 'every workflow', value: 'exactly one trigger' }, { label: 'here', value: 'When an HTTP request is received' }],
    },
    actions: {
      visible: [...wf, ...steps],
      highlight: ['cond', 'create', 'review'],
      tokens: [{ id: 'a1', edge: 'trig-cond', tone: 'info' }, { id: 'a2', edge: 'cond-create', tone: 'ok' }, { id: 'a3', edge: 'cond-review', tone: 'ok' }],
      chips: [{ label: 'after the trigger', value: 'one or more actions' }, { label: 'example', value: 'from the overview' }],
    },
    connectors: {
      visible: [...wf, ...steps],
      highlight: ['create', 'review'],
      chips: [{ label: 'prebuilt', value: '1,400+ connectors' }, { label: 'built-in', value: 'runs on the runtime', tone: 'ok' }, { label: 'managed', value: 'Microsoft-hosted proxy' }],
    },
    definition: {
      visible: [...wf, ...steps, 'json', 'wf-json'],
      highlight: ['json', 'wf-json'],
      chips: [{ label: 'build in', value: 'designer · portal or VS Code' }, { label: 'saved as', value: 'JSON definition' }],
    },
    history: {
      visible: [...wf, ...steps, 'cons', 'std', 'cons-std'],
      highlight: ['cons', 'std', 'cons-std'],
      chips: [{ label: '2016', value: 'Logic Apps GA (multitenant)' }, { label: '2021', value: 'Standard GA (single-tenant)', tone: 'ok' }, { label: 'runtime', value: 'Azure Functions extension' }],
    },
    resources: {
      visible: [...wf, ...steps, 'cons', 'std'],
      highlight: ['std'],
      chips: [{ label: 'Consumption', value: 'one workflow · pay per run' }, { label: 'Standard', value: 'many workflows · plan', tone: 'ok' }, { label: 'this guide', value: 'Standard-first' }],
    },
    when: {
      visible: [...wf, ...steps],
      chips: [{ label: 'Logic Apps', value: 'designer-first' }, { label: 'Functions', value: 'code-first' }, { label: 'delivery', value: 'at least once', tone: 'warn' }],
    },
    recap: {
      visible: [...wf, ...steps, 'json', 'wf-json'],
      chips: [{ label: 'workflow', value: 'trigger + actions' }, { label: 'next', value: 'where it runs' }],
    },
  },
  legend: [
    { tone: 'info', label: 'order moving' },
    { tone: 'ok', label: 'path taken' },
  ],
};
