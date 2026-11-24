import type { Scene } from '../../../../lessons/scene-types';

const base = ['you', 'assist', 'trig', 'resp', 'you-assist', 'assist-trig', 'trig-resp'];
const agentic = ['agent', 'mcp', 'human', 'trig-agent', 'agent-mcp', 'agent-human'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'you', kind: 'user', label: 'You', sublabel: 'in the browser', x: 110, y: 240 },
    { id: 'assist', kind: 'llm-agent', label: 'AI assistant', sublabel: 'Copilot pane', x: 340, y: 90 },
    { id: 'trig', kind: 'trigger', label: 'HTTP request', sublabel: 'Request trigger', x: 340, y: 240 },
    { id: 'resp', kind: 'action', label: 'Response', sublabel: 'status 200', x: 590, y: 240 },
    { id: 'agent', kind: 'llm-agent', label: 'Agent', sublabel: 'with tools', x: 590, y: 90 },
    { id: 'mcp', kind: 'mcp-server', label: 'MCP server', sublabel: 'tools', x: 790, y: 90 },
    { id: 'human', kind: 'human', label: 'Human approval', sublabel: 'when needed', x: 790, y: 240 },
    { id: 'draft', kind: 'hosting-plan', label: 'Draft · Publish', sublabel: 'saved as draft', x: 340, y: 410 },
    { id: 'mon', kind: 'appinsights', label: 'Monitoring view', sublabel: 'run history', x: 590, y: 410 },
  ],
  edges: [
    { id: 'you-assist', from: 'you', to: 'assist' },
    { id: 'you-trig', from: 'you', to: 'trig', style: 'dashed' },
    { id: 'assist-trig', from: 'assist', to: 'trig' },
    { id: 'trig-resp', from: 'trig', to: 'resp' },
    { id: 'trig-agent', from: 'trig', to: 'agent', style: 'dashed' },
    { id: 'agent-mcp', from: 'agent', to: 'mcp', style: 'dashed' },
    { id: 'agent-human', from: 'agent', to: 'human', style: 'dashed' },
    { id: 'draft-mon', from: 'draft', to: 'mon' },
    { id: 'trig-draft', from: 'trig', to: 'draft' },
  ],
  steps: {
    problem: {
      visible: ['you', 'trig', 'you-trig'],
      highlight: ['you'],
      chips: [{ label: 'goal', value: 'define the logic once' }, { label: 'status', value: 'preview', tone: 'warn' }],
    },
    open: {
      visible: ['you', 'trig', 'you-trig'],
      highlight: ['you'],
      chips: [{ label: 'role needed', value: 'Contributor (or Author)' }, { label: 'then', value: 'Create workflow, Build' }],
    },
    start: {
      visible: ['you', 'assist', 'trig', 'you-assist', 'you-trig', 'assist-trig'],
      highlight: ['assist', 'trig'],
      chips: [{ label: 'start with', value: 'assistant, designer or template' }],
    },
    describe: {
      visible: ['you', 'assist', 'trig', 'resp', 'you-assist', 'assist-trig', 'trig-resp'],
      highlight: ['assist'],
      tokens: [{ id: 'd1', edge: 'you-assist', tone: 'info' }, { id: 'd2', edge: 'assist-trig', tone: 'ok' }],
      chips: [{ label: 'describe', value: 'trigger · actions · results' }, { label: 'then', value: 'Generate' }],
    },
    finish: {
      visible: base,
      highlight: ['trig', 'resp'],
      chips: [{ label: 'you complete', value: 'connections · required fields' }, { label: 'alerts', value: 'fix before testing', tone: 'warn' }],
    },
    build: {
      visible: ['you', 'trig', 'resp', 'you-trig', 'trig-resp'],
      highlight: ['trig', 'resp'],
      tokens: [{ id: 'b1', edge: 'trig-resp', tone: 'ok' }],
      chips: [{ label: 'example trigger', value: 'When an HTTP request is received' }, { label: 'example action', value: 'Response' }],
    },
    agents: {
      visible: [...base, ...agentic],
      highlight: ['agent', 'mcp', 'human'],
      chips: [{ label: 'building blocks', value: 'agents · tools · MCP servers' }, { label: 'diagram', value: 'illustrative only', tone: 'warn' }],
    },
    test: {
      visible: ['trig', 'resp', 'trig-resp', 'draft', 'trig-draft'],
      highlight: ['draft'],
      tokens: [{ id: 't1', edge: 'trig-resp', tone: 'info' }],
      chips: [{ label: 'draft', value: 'saved automatically' }, { label: 'published', value: 'runs in production' }],
    },
    monitor: {
      visible: ['trig', 'resp', 'trig-resp', 'draft', 'mon', 'trig-draft', 'draft-mon'],
      highlight: ['mon'],
      tokens: [{ id: 'm1', edge: 'draft-mon', tone: 'ok' }],
      chips: [{ label: 'per operation', value: 'Output · Input · Properties' }, { label: 'failed', value: 'error message shown' }],
    },
    refine: {
      visible: [...base, 'draft', 'mon', 'trig-draft', 'draft-mon'],
      highlight: ['assist', 'draft'],
      chips: [{ label: 'edit via', value: 'designer · Chat · Code' }, { label: 'ship', value: 'Publish' }],
    },
    recap: {
      visible: [...base, ...agentic, 'draft', 'mon', 'trig-draft', 'draft-mon'],
      chips: [{ label: 'all in', value: 'the browser (preview)', tone: 'warn' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request or test data' },
    { tone: 'ok', label: 'generated or run' },
  ],
};
