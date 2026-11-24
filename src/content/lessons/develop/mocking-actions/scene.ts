import type { Scene } from '../../../../lessons/scene-types';

const core = ['test', 'trig', 'api', 'done', 'test-trig', 'trig-api', 'api-done'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'test', kind: 'action', label: 'Unit test', sublabel: 'TestExecutor', x: 110, y: 240 },
    { id: 'trig', kind: 'trigger', label: 'Trigger mock', sublabel: 'queue message', x: 340, y: 240 },
    { id: 'api', kind: 'connector-managed', label: 'Action mock', sublabel: 'external API', x: 580, y: 240 },
    { id: 'done', kind: 'action', label: 'CompleteMessage', sublabel: 'mocked', x: 780, y: 240 },
    { id: 'mockjson', kind: 'storage', label: 'Mock JSON', sublabel: '*-mock.json', x: 340, y: 90 },
    { id: 'scope', kind: 'scope', label: 'Your error path', sublabel: 'example only', x: 580, y: 400 },
    { id: 'result', kind: 'human', label: 'Run status', sublabel: 'Assert', x: 110, y: 420 },
  ],
  edges: [
    { id: 'test-trig', from: 'test', to: 'trig' },
    { id: 'trig-api', from: 'trig', to: 'api' },
    { id: 'api-done', from: 'api', to: 'done' },
    { id: 'json-trig', from: 'mockjson', to: 'trig', style: 'dashed' },
    { id: 'api-scope', from: 'api', to: 'scope', style: 'dashed' },
    { id: 'scope-result', from: 'scope', to: 'result' },
    { id: 'test-result', from: 'test', to: 'result', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['trig', 'api', 'trig-api'],
      chips: [{ label: 'real API', value: 'cannot fail on demand', tone: 'warn' }],
    },
    concepts: {
      visible: [...core],
      highlight: ['trig', 'api'],
      chips: [{ label: 'mock objects', value: 'trigger and actions' }],
    },
    classes: {
      visible: [...core],
      highlight: ['trig', 'api'],
      chips: [{ label: 'trigger', value: '...TriggerMock' }, { label: 'action', value: '...ActionMock' }],
    },
    static: {
      visible: [...core],
      highlight: ['test', 'test-trig'],
      tokens: [{ id: 't1', edge: 'test-trig', tone: 'info' }, { id: 't2', edge: 'trig-api', tone: 'info' }],
      chips: [{ label: 'TestMockDefinition', value: 'trigger + actions' }],
    },
    dynamic: {
      visible: [...core],
      highlight: ['api'],
      tokens: [{ id: 't1', edge: 'trig-api', tone: 'info' }],
      chips: [{ label: 'onGetActionMock', value: 'callback or lambda' }],
    },
    'from-run': {
      visible: [...core, 'mockjson', 'json-trig'],
      highlight: ['mockjson', 'json-trig'],
      tokens: [{ id: 't1', edge: 'json-trig', tone: 'info' }],
      chips: [{ label: 'triggerMocks', value: 'required' }, { label: 'actionMocks', value: 'per action' }],
    },
    failure: {
      visible: [...core, 'scope', 'api-scope'],
      highlight: ['scope', 'api-scope'],
      failed: ['api'],
      tokens: [{ id: 't1', edge: 'api-scope', tone: 'fail' }],
      chips: [{ label: 'status', value: 'Failed', tone: 'fail' }, { label: 'error', value: 'TestErrorInfo', tone: 'fail' }],
    },
    assert: {
      visible: [...core, 'result', 'test-result'],
      highlight: ['result', 'test-result'],
      tokens: [{ id: 't1', edge: 'test-result', tone: 'ok' }],
      chips: [{ label: 'assert', value: 'testRun.Status' }],
    },
    gaps: {
      visible: [...core],
      highlight: ['done'],
      chips: [{ label: 'non-mocked actions', value: 'not supported', tone: 'warn' }, { label: 'mock', value: 'every action on the path' }],
    },
    recap: {
      visible: [...core, 'mockjson', 'json-trig', 'result', 'test-result'],
      chips: [{ label: 'control', value: 'trigger, outputs, failures', tone: 'ok' }],
    },
  },
  legend: [{ tone: 'info', label: 'mock data' }, { tone: 'fail', label: 'simulated failure' }, { tone: 'ok', label: 'assert' }],
};
