import type { Scene } from '../../../../lessons/scene-types';

const core = ['caller', 'easy', 'wf', 'caller-easy', 'easy-wf'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'caller', kind: 'user', label: 'Caller', sublabel: 'Entra token', x: 110, y: 240 },
    { id: 'easy', kind: 'keyvault', label: 'Easy Auth', sublabel: 'checks token', x: 380, y: 240 },
    { id: 'wf', kind: 'trigger', label: 'Workflow', sublabel: 'Request trigger', x: 660, y: 240 },
    { id: 'entra', kind: 'keyvault', label: 'Entra ID', sublabel: 'app reg.', x: 380, y: 80 },
    { id: 'sas', kind: 'user', label: 'Copied URL', sublabel: 'SAS signature', x: 110, y: 410 },
    { id: 'claims', kind: 'action', label: 'Parse claims', sublabel: 'roles · scopes', x: 660, y: 410 },
  ],
  edges: [
    { id: 'caller-easy', from: 'caller', to: 'easy' },
    { id: 'easy-wf', from: 'easy', to: 'wf' },
    { id: 'entra-easy', from: 'entra', to: 'easy', style: 'dashed' },
    { id: 'sas-wf', from: 'sas', to: 'wf', style: 'dashed' },
    { id: 'sas-easy', from: 'sas', to: 'easy', style: 'dashed' },
    { id: 'wf-claims', from: 'wf', to: 'claims' },
  ],
  steps: {
    problem: {
      visible: ['sas', 'wf', 'sas-wf'],
      highlight: ['sas'],
      tokens: [{ id: 'p1', edge: 'sas-wf', tone: 'fail' }],
      chips: [{ label: 'SAS URL', value: 'anyone with it can call', tone: 'warn' }],
    },
    what: {
      visible: [...core],
      highlight: ['easy'],
      tokens: [{ id: 'w1', edge: 'caller-easy', tone: 'info' }, { id: 'w2', edge: 'easy-wf', tone: 'ok' }],
      chips: [{ label: 'runs', value: 'before your workflow' }, { label: 'code needed', value: 'none' }],
    },
    checks: {
      visible: [...core],
      highlight: ['easy', 'caller-easy'],
      chips: [{ label: 'checks', value: 'token audience' }, { label: 'wrong audience', value: '401', tone: 'fail' }, { label: 'by default', value: 'authn, not authz', tone: 'warn' }],
    },
    setup: {
      visible: [...core, 'entra', 'entra-easy'],
      highlight: ['entra', 'entra-easy'],
      chips: [{ label: 'portal', value: 'Settings > Authentication' }, { label: 'accounts', value: 'single tenant' }],
    },
    request: {
      visible: [...core, 'sas', 'sas-easy'],
      highlight: ['wf'],
      chips: [{ label: 'Microsoft Learn docs', value: 'one sentence + a blog', tone: 'warn' }, { label: 'SAS', value: 'can stay on' }],
    },
    chat: {
      visible: [...core, 'entra', 'entra-easy'],
      highlight: ['easy'],
      chips: [{ label: 'agent chat', value: 'Require auth · 302' }, { label: 'role', value: 'Azure Contributor' }],
    },
    mcp: {
      visible: [...core, 'entra', 'entra-easy'],
      highlight: ['entra'],
      chips: [{ label: 'scope', value: 'user_impersonation' }, { label: 'audience', value: 'api://<id>/ (slash!)', tone: 'warn' }],
    },
    identity: {
      visible: [...core, 'claims', 'wf-claims'],
      highlight: ['claims', 'wf-claims'],
      tokens: [{ id: 'i1', edge: 'wf-claims', tone: 'ok' }],
      chips: [{ label: 'header', value: 'X-MS-CLIENT-PRINCIPAL' }],
    },
    troubleshoot: {
      visible: [...core],
      chips: [{ label: '401 invalid_token', value: 'audience mismatch' }, { label: '403', value: 'maybe workflow not found' }],
    },
    recap: {
      visible: [...core, 'entra', 'claims', 'entra-easy', 'wf-claims'],
      chips: [{ label: 'callers prove', value: 'who they are' }],
    },
  },
  legend: [{ tone: 'info', label: 'request with token' }, { tone: 'ok', label: 'allowed' }, { tone: 'fail', label: 'risk / rejected' }],
};
