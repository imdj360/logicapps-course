import type { Scene } from '../../../../lessons/scene-types';

const tree = ['project', 'app-a', 'app-b', 'wf-a1', 'wf-a2', 'wf-b1', 'p-a', 'p-b', 'a-w1', 'a-w2', 'b-w1'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'owner', kind: 'user', label: 'Project owner', sublabel: 'a property', x: 110, y: 100 },
    { id: 'members', kind: 'user', label: 'Members', sublabel: 'least privilege', x: 110, y: 400 },
    { id: 'project', kind: 'hosting-plan', label: 'Project', sublabel: 'isolated', x: 110, y: 250 },
    { id: 'app-a', kind: 'scope', label: 'order-processing', sublabel: 'application', x: 400, y: 130 },
    { id: 'app-b', kind: 'scope', label: 'daily-reports', sublabel: 'application', x: 400, y: 370 },
    { id: 'wf-a1', kind: 'trigger', label: 'Workflow', sublabel: 'trigger', x: 700, y: 70 },
    { id: 'wf-a2', kind: 'action', label: 'Workflow', sublabel: 'actions', x: 700, y: 190 },
    { id: 'wf-b1', kind: 'trigger', label: 'Workflow', sublabel: 'trigger', x: 700, y: 370 },
  ],
  edges: [
    { id: 'o-p', from: 'owner', to: 'project' },
    { id: 'm-p', from: 'members', to: 'project', style: 'dashed' },
    { id: 'p-a', from: 'project', to: 'app-a' },
    { id: 'p-b', from: 'project', to: 'app-b' },
    { id: 'a-w1', from: 'app-a', to: 'wf-a1' },
    { id: 'a-w2', from: 'app-a', to: 'wf-a2' },
    { id: 'b-w1', from: 'app-b', to: 'wf-b1' },
  ],
  steps: {
    problem: {
      visible: ['wf-a1', 'wf-a2', 'wf-b1'],
      chips: [{ label: 'unrelated work', value: 'should not mix', tone: 'warn' }],
    },
    levels: {
      visible: tree,
      highlight: ['project', 'app-a', 'wf-a1'],
      chips: [{ label: 'levels', value: 'project · application · workflow' }],
    },
    project: {
      visible: ['project', 'p-a', 'p-b', 'app-a', 'app-b'],
      highlight: ['project'],
      chips: [{ label: 'project', value: 'own compute, networking, security' }, { label: 'rule of thumb', value: 'one per team or scenario' }],
    },
    members: {
      visible: ['project', 'owner', 'members', 'o-p', 'm-p'],
      highlight: ['owner', 'members'],
      chips: [{ label: 'project roles', value: 'Reader · Author · Contributor' }, { label: 'owner', value: 'single, cannot be removed' }],
    },
    app: {
      visible: ['project', 'p-a', 'p-b', 'app-a', 'app-b'],
      highlight: ['app-a', 'app-b'],
      chips: [{ label: 'application', value: 'deployable package' }, { label: 'create', value: 'a minute or two', tone: 'warn' }],
    },
    privacy: {
      visible: ['project', 'p-a', 'p-b', 'app-a', 'app-b', 'members', 'm-p'],
      highlight: ['app-a'],
      failed: ['m-p'],
      chips: [{ label: 'by default', value: 'private to the app owner' }, { label: 'app roles', value: 'Reader · Contributor' }],
    },
    workflow: {
      visible: tree,
      highlight: ['wf-a1', 'wf-a2'],
      tokens: [{ id: 'w1', edge: 'a-w1', tone: 'info' }, { id: 'w2', edge: 'a-w2', tone: 'ok' }],
      chips: [{ label: 'workflow', value: 'one trigger, then actions' }, { label: 'needs', value: 'Contributor (or Author)' }],
    },
    standard: {
      visible: tree,
      highlight: ['project', 'app-a'],
      chips: [{ label: 'project', value: 'like a VS Code project' }, { label: 'application', value: 'like a Standard logic app' }],
    },
    author: {
      visible: tree,
      highlight: ['app-a', 'app-b'],
      chips: [{ label: 'author observation', value: 'app = Container App', tone: 'warn' }, { label: 'not in Learn', value: 'may change', tone: 'warn' }],
    },
    recap: {
      visible: [...tree, 'owner', 'o-p'],
      chips: [{ label: 'preview', value: 'details can change', tone: 'warn' }],
    },
  },
  legend: [
    { tone: 'info', label: 'trigger' },
    { tone: 'ok', label: 'action' },
    { tone: 'failed', label: 'not shared' },
  ],
};
