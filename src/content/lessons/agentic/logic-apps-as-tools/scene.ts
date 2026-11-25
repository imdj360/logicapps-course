import type { Scene } from '../../../../lessons/scene-types';

const core = ['agent', 'mcp', 'w1', 'w2', 'agent-mcp', 'mcp-w1', 'mcp-w2'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'agent', kind: 'llm-agent', label: 'AI agent', sublabel: 'another team', x: 110, y: 240 },
    { id: 'mcp', kind: 'mcp-server', label: 'MCP server', sublabel: 'logic app', x: 380, y: 240 },
    { id: 'w1', kind: 'trigger', label: 'Check stock', sublabel: 'Request · Resp.', x: 680, y: 140 },
    { id: 'w2', kind: 'trigger', label: 'Raise invoice', sublabel: 'Request · Resp.', x: 680, y: 340 },
    { id: 'auth', kind: 'keyvault', label: 'MCP auth', sublabel: 'OAuth or key', x: 380, y: 80 },
    { id: 'foundry', kind: 'llm-agent', label: 'Foundry agent', sublabel: 'preview', x: 110, y: 410 },
    { id: 'apic', kind: 'hosting-plan', label: 'API Center', sublabel: 'MCP server', x: 380, y: 240 },
    { id: 'mconn', kind: 'connector-managed', label: 'Managed conn.', sublabel: '1 action/tool', x: 680, y: 240 },
  ],
  edges: [
    { id: 'agent-mcp', from: 'agent', to: 'mcp' },
    { id: 'mcp-w1', from: 'mcp', to: 'w1' },
    { id: 'mcp-w2', from: 'mcp', to: 'w2' },
    { id: 'auth-mcp', from: 'auth', to: 'mcp', style: 'dashed' },
    { id: 'foundry-w2', from: 'foundry', to: 'w2', style: 'dashed' },
    { id: 'agent-apic', from: 'agent', to: 'apic' },
    { id: 'apic-mconn', from: 'apic', to: 'mconn' },
  ],
  steps: {
    problem: {
      visible: ['agent', 'w1', 'w2'],
      highlight: ['w1', 'w2'],
      chips: [{ label: 'have', value: 'tested workflows' }, { label: 'want', value: 'agents to call them' }],
    },
    mcp: {
      visible: [...core],
      highlight: ['mcp'],
      tokens: [{ id: 'm1', edge: 'agent-mcp', tone: 'info' }, { id: 'm2', edge: 'mcp-w1', tone: 'ok' }],
      chips: [{ label: 'portal', value: 'Agents > MCP servers' }, { label: 'status', value: 'preview', tone: 'warn' }],
    },
    requirements: {
      visible: [...core],
      highlight: ['w1', 'w2'],
      chips: [{ label: 'starts with', value: 'Request trigger' }, { label: 'ends with', value: 'Response' }, { label: 'hosting', value: 'WS plan · ASE v3' }],
    },
    describe: {
      visible: [...core],
      highlight: ['w1'],
      chips: [{ label: 'tool knows', value: 'description + schema' }],
    },
    auth: {
      visible: [...core, 'auth', 'auth-mcp'],
      highlight: ['auth', 'auth-mcp'],
      tokens: [{ id: 'a1', edge: 'auth-mcp', tone: 'info' }],
      chips: [{ label: 'default', value: 'OAuth 2.0 (Easy Auth)' }, { label: 'or', value: 'API key' }],
    },
    transport: {
      visible: [...core],
      highlight: ['agent-mcp'],
      chips: [{ label: 'transports', value: 'Streamable HTTP · SSE' }, { label: 'SSE needs', value: 'VNet + host.json', tone: 'warn' }],
    },
    apicenter: {
      visible: ['agent', 'apic', 'mconn', 'agent-apic', 'apic-mconn'],
      highlight: ['apic', 'mconn'],
      tokens: [{ id: 'ac1', edge: 'agent-apic', tone: 'info' }, { id: 'ac2', edge: 'apic-mconn', tone: 'ok' }],
      chips: [{ label: 'API Center', value: 'one managed connector' }, { label: 'status', value: 'preview', tone: 'warn' }],
    },
    foundry: {
      visible: [...core, 'foundry', 'foundry-w2'],
      highlight: ['foundry', 'foundry-w2'],
      tokens: [{ id: 'f1', edge: 'foundry-w2', tone: 'info' }],
      chips: [{ label: 'Foundry', value: 'model · guardrails' }, { label: 'Logic Apps', value: 'automation layer' }],
    },
    recap: {
      visible: [...core, 'auth', 'foundry', 'auth-mcp', 'foundry-w2'],
      chips: [{ label: 'reuse', value: 'workflows as tools' }],
    },
  },
  legend: [
    { tone: 'info', label: 'tool call / auth' },
    { tone: 'ok', label: 'workflow / action' },
  ],
};
