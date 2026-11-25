import type { Scene } from '../../../../lessons/scene-types';

const exposeCore = ['ext-agent', 'mcp-srv', 'w1', 'w2', 'ext-mcp', 'mcp-w1', 'mcp-w2'];
const callCore = ['la-agent', 'mcp-conn', 'rem-mcp', 'la-conn', 'conn-rem'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    // Problem overview (two directions, non-overlapping rows)
    { id: 'prob-ext', kind: 'llm-agent', label: 'External agent', sublabel: 'calls your app', x: 140, y: 140 },
    { id: 'prob-la', kind: 'llm-agent', label: 'Agent Loop', sublabel: 'your Logic App', x: 140, y: 340 },
    { id: 'prob-rem', kind: 'mcp-server', label: 'Remote MCP', sublabel: 'external tools', x: 680, y: 340 },

    // Expose side (Logic App = MCP server)
    { id: 'ext-agent', kind: 'llm-agent', label: 'External agent', sublabel: 'VS Code · AI', x: 110, y: 240 },
    { id: 'mcp-srv', kind: 'mcp-server', label: 'MCP server', sublabel: 'Standard app', x: 380, y: 240 },
    { id: 'w1', kind: 'trigger', label: 'Check stock', sublabel: 'Request · Resp.', x: 680, y: 140 },
    { id: 'w2', kind: 'trigger', label: 'Raise invoice', sublabel: 'Request · Resp.', x: 680, y: 340 },
    { id: 'auth', kind: 'keyvault', label: 'MCP auth', sublabel: 'OAuth or key', x: 380, y: 80 },
    { id: 'apic', kind: 'hosting-plan', label: 'API Center', sublabel: 'MCP server', x: 380, y: 140 },
    { id: 'mconn', kind: 'connector-managed', label: 'Managed conn.', sublabel: '1 action/tool', x: 680, y: 140 },
    { id: 'foundry', kind: 'llm-agent', label: 'Foundry agent', sublabel: 'preview', x: 380, y: 340 },

    // Call side (Logic App = MCP client)
    { id: 'la-agent', kind: 'llm-agent', label: 'Agent Loop', sublabel: 'Logic App', x: 110, y: 240 },
    { id: 'mcp-conn', kind: 'connector-builtin', label: 'MCP connector', sublabel: 'MCP client', x: 420, y: 240 },
    { id: 'rem-mcp', kind: 'mcp-server', label: 'Remote MCP', sublabel: 'external tools', x: 740, y: 240 },
    { id: 'cli-auth', kind: 'keyvault', label: 'Auth & filter', sublabel: 'Allowed Tools', x: 420, y: 85 },

    // Chain both (Logic App -> MCP connector -> Logic App MCP server -> workflow)
    { id: 'chain-la', kind: 'llm-agent', label: 'Agent app', sublabel: 'Agent Loop', x: 95, y: 240 },
    { id: 'chain-conn', kind: 'connector-builtin', label: 'MCP connector', sublabel: 'client', x: 325, y: 240 },
    { id: 'chain-srv', kind: 'mcp-server', label: 'Domain app', sublabel: 'MCP server', x: 565, y: 240 },
    { id: 'chain-wf', kind: 'trigger', label: 'Check stock', sublabel: 'workflow tool', x: 800, y: 240 },
  ],
  edges: [
    // Problem overview edges
    { id: 'prob-expose', from: 'prob-ext', to: 'w1', style: 'dashed', label: 'expose' },
    { id: 'prob-call', from: 'prob-la', to: 'prob-rem', style: 'dashed', label: 'call' },

    // Expose edges
    { id: 'ext-mcp', from: 'ext-agent', to: 'mcp-srv', label: 'MCP' },
    { id: 'mcp-w1', from: 'mcp-srv', to: 'w1' },
    { id: 'mcp-w2', from: 'mcp-srv', to: 'w2' },
    { id: 'auth-mcp', from: 'auth', to: 'mcp-srv', style: 'dashed' },
    { id: 'ext-apic', from: 'ext-agent', to: 'apic' },
    { id: 'apic-mconn', from: 'apic', to: 'mconn' },
    { id: 'foundry-w2', from: 'foundry', to: 'w2', style: 'dashed' },

    // Call edges
    { id: 'la-conn', from: 'la-agent', to: 'mcp-conn', label: 'tool call' },
    { id: 'conn-rem', from: 'mcp-conn', to: 'rem-mcp', label: 'list · call' },
    { id: 'cliauth-conn', from: 'cli-auth', to: 'mcp-conn', style: 'dashed' },

    // Chain both edges
    { id: 'ch-1', from: 'chain-la', to: 'chain-conn' },
    { id: 'ch-2', from: 'chain-conn', to: 'chain-srv', label: 'MCP' },
    { id: 'ch-3', from: 'chain-srv', to: 'chain-wf' },
  ],
  steps: {
    problem: {
      visible: ['prob-ext', 'w1', 'prob-expose', 'prob-la', 'prob-rem', 'prob-call'],
      highlight: ['prob-expose', 'prob-call'],
      tokens: [
        { id: 'p1', edge: 'prob-expose', tone: 'info' },
        { id: 'p2', edge: 'prob-call', tone: 'ok' },
      ],
      chips: [
        { label: 'expose', value: 'Logic App as MCP server' },
        { label: 'call', value: 'Logic App as MCP client' },
      ],
    },
    expose: {
      visible: [...exposeCore],
      highlight: ['mcp-srv'],
      tokens: [
        { id: 'e1', edge: 'ext-mcp', tone: 'info' },
        { id: 'e2', edge: 'mcp-w1', tone: 'ok' },
      ],
      chips: [
        { label: 'direction', value: 'expose workflows', tone: 'ok' },
        { label: 'portal', value: 'Agents > MCP servers' },
        { label: 'status', value: 'preview', tone: 'warn' },
      ],
    },
    requirements: {
      visible: [...exposeCore],
      highlight: ['w1', 'w2'],
      chips: [
        { label: 'starts with', value: 'Request trigger' },
        { label: 'ends with', value: 'Response' },
        { label: 'tool clarity', value: 'description + schema' },
      ],
    },
    auth: {
      visible: [...exposeCore, 'auth', 'auth-mcp'],
      highlight: ['auth', 'auth-mcp', 'ext-mcp'],
      tokens: [{ id: 'a1', edge: 'auth-mcp', tone: 'info' }],
      chips: [
        { label: 'auth', value: 'OAuth (Easy Auth) · key' },
        { label: 'transport', value: 'Streamable HTTP · SSE' },
      ],
    },
    apicenter: {
      visible: ['ext-agent', 'apic', 'mconn', 'ext-apic', 'apic-mconn', 'foundry', 'w2', 'foundry-w2'],
      highlight: ['apic', 'foundry'],
      tokens: [
        { id: 'ac1', edge: 'ext-apic', tone: 'info' },
        { id: 'ac2', edge: 'apic-mconn', tone: 'ok' },
        { id: 'f1', edge: 'foundry-w2', tone: 'ok' },
      ],
      chips: [
        { label: 'API Center', value: '1 managed connector' },
        { label: 'Foundry', value: 'calls workflow directly' },
      ],
    },
    call: {
      visible: [...callCore],
      highlight: ['mcp-conn'],
      tokens: [
        { id: 'c1', edge: 'la-conn', tone: 'info' },
        { id: 'c2', edge: 'conn-rem', tone: 'info' },
      ],
      chips: [
        { label: 'direction', value: 'call remote MCP', tone: 'ok' },
        { label: 'how', value: 'MCP connector in Agent Loop' },
      ],
    },
    discover: {
      visible: [...callCore],
      highlight: ['mcp-conn', 'rem-mcp'],
      tokens: [
        { id: 'd1', edge: 'la-conn', tone: 'info' },
        { id: 'd2', edge: 'conn-rem', tone: 'ok' },
      ],
      chips: [
        { label: 'discover', value: 'tools/list at runtime' },
        { label: 'invoke', value: 'tools/call dynamically' },
      ],
    },
    filter: {
      visible: [...callCore, 'cli-auth', 'cliauth-conn'],
      highlight: ['cli-auth', 'cliauth-conn'],
      tokens: [{ id: 'fl1', edge: 'cliauth-conn', tone: 'ok' }],
      chips: [
        { label: 'auth', value: 'API key · OAuth token' },
        { label: 'scope', value: 'Allowed Tools', tone: 'ok' },
      ],
    },
    both: {
      visible: ['chain-la', 'chain-conn', 'chain-srv', 'chain-wf', 'ch-1', 'ch-2', 'ch-3'],
      highlight: ['chain-conn', 'chain-srv'],
      tokens: [
        { id: 'b1', edge: 'ch-1', tone: 'info' },
        { id: 'b2', edge: 'ch-2', tone: 'info' },
        { id: 'b3', edge: 'ch-3', tone: 'ok' },
      ],
      chips: [
        { label: 'agent team', value: 'calls via MCP connector' },
        { label: 'domain team', value: 'exposes MCP server' },
      ],
    },
    recap: {
      visible: ['chain-la', 'chain-conn', 'chain-srv', 'chain-wf', 'ch-1', 'ch-2', 'ch-3'],
      chips: [
        { label: 'expose', value: 'Standard MCP server' },
        { label: 'call', value: 'Agent Loop MCP connector' },
      ],
    },
  },
  legend: [
    { tone: 'info', label: 'MCP request / auth' },
    { tone: 'ok', label: 'tool / schema' },
  ],
};
