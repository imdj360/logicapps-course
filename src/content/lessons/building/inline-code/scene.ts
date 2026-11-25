import type { Scene } from '../../../../lessons/scene-types';

// One workflow, one code step. Each step swaps in a different kind of code at the same place.
const wf = ['wfBox', 'trig', 'create'];
const slot = (id: string) => [id, `trig-${id}`, `${id}-create`];
const palette = ['paletteBox', 'pjs', 'pcs', 'pps', 'plocal', 'pazfn'];
const kinds = ['code', 'js', 'cs', 'ps', 'local', 'azfn'];

export const scene: Scene = {
  viewBox: [900, 520],
  groups: [
    { id: 'wfBox', label: 'Parse partner orders', x: 60, y: 70, w: 800, h: 160 },
    { id: 'paletteBox', label: 'Pick one for the code step', x: 60, y: 270, w: 800, h: 240 },
  ],
  nodes: [
    { id: 'trig', kind: 'trigger', label: 'Request', sublabel: 'order lines', x: 170, y: 155 },
    { id: 'code', kind: 'action', label: 'Code step', sublabel: 'your choice', x: 450, y: 155 },
    { id: 'js', kind: 'action', label: 'JavaScript code', sublabel: 'Inline Code', x: 450, y: 155 },
    { id: 'cs', kind: 'action', label: 'C# script code', sublabel: '.csx file', x: 450, y: 155 },
    { id: 'ps', kind: 'action', label: 'PowerShell code', sublabel: '.ps1 file', x: 450, y: 155 },
    { id: 'local', kind: 'action', label: 'Local function', sublabel: 'in this app', x: 450, y: 155 },
    { id: 'azfn', kind: 'hosting-plan', label: 'Azure Function', sublabel: 'separate app', x: 450, y: 155 },
    { id: 'create', kind: 'connector-builtin', label: 'Create order', sublabel: 'HTTP', x: 730, y: 155 },
    { id: 'lib', kind: 'storage', label: 'lib/custom', sublabel: 'net472 · net8', x: 450, y: 340 },
    { id: 'pjs', kind: 'action', label: 'JavaScript', sublabel: 'inline', x: 170, y: 340 },
    { id: 'pcs', kind: 'action', label: 'C# script', sublabel: 'inline', x: 450, y: 340 },
    { id: 'pps', kind: 'action', label: 'PowerShell', sublabel: 'inline', x: 730, y: 340 },
    { id: 'plocal', kind: 'action', label: 'Local function', sublabel: '.NET in project', x: 310, y: 455 },
    { id: 'pazfn', kind: 'hosting-plan', label: 'Azure Function', sublabel: 'separate app', x: 590, y: 455 },
  ],
  edges: [
    ...kinds.flatMap((k) => [
      { id: `trig-${k}`, from: 'trig', to: k },
      { id: `${k}-create`, from: k, to: 'create' },
    ]),
    { id: 'lib-local', from: 'lib', to: 'local', style: 'dashed' as const },
  ],
  steps: {
    problem: {
      visible: [...wf, ...slot('code')],
      highlight: ['code'],
      tokens: [{ id: 'p1', edge: 'trig-code', tone: 'info' }],
      chips: [{ label: 'order lines', value: 'fixed-width text' }, { label: 'with expressions', value: 'unreadable', tone: 'warn' }],
    },
    options: {
      visible: [...wf, ...slot('code'), ...palette],
      highlight: ['code', 'pjs', 'pcs', 'pps', 'plocal', 'pazfn'],
      chips: [{ label: 'inline', value: 'JavaScript · C# · PowerShell' }, { label: 'or', value: 'local function · Azure Function' }],
    },
    js: {
      visible: [...wf, ...slot('js')],
      highlight: ['js'],
      tokens: [{ id: 'j1', edge: 'trig-js', tone: 'info' }, { id: 'j2', edge: 'js-create', tone: 'ok' }],
      chips: [{ label: 'reads', value: 'workflowContext' }, { label: 'Node.js (Standard)', value: '16.x.x' }, { label: 'require()', value: 'not supported', tone: 'warn' }],
    },
    csharp: {
      visible: [...wf, ...slot('cs')],
      highlight: ['cs'],
      tokens: [{ id: 'c1', edge: 'trig-cs', tone: 'info' }, { id: 'c2', edge: 'cs-create', tone: 'ok' }],
      chips: [{ label: 'available', value: 'Standard only' }, { label: 'entry', value: 'Run(WorkflowContext context)' }, { label: 'runs up to', value: '10 min' }],
    },
    powershell: {
      visible: [...wf, ...slot('ps')],
      highlight: ['ps'],
      tokens: [{ id: 'ps1', edge: 'trig-ps', tone: 'info' }, { id: 'ps2', edge: 'ps-create', tone: 'ok' }],
      chips: [{ label: 'return values', value: 'Push-WorkflowOutput', tone: 'ok' }, { label: 'return · Write-Output · Write-Host', value: 'do not return', tone: 'fail' }],
    },
    local: {
      visible: [...wf, ...slot('local'), 'lib', 'lib-local'],
      highlight: ['local', 'lib', 'lib-local'],
      tokens: [{ id: 'l1', edge: 'trig-local', tone: 'info' }, { id: 'l2', edge: 'local-create', tone: 'ok' }],
      chips: [{ label: 'targets', value: '.NET Framework · .NET 8' }, { label: 'author on', value: 'VS Code, Windows', tone: 'warn' }],
    },
    azfn: {
      visible: [...wf, ...slot('azfn')],
      highlight: ['azfn'],
      tokens: [{ id: 'a1', edge: 'trig-azfn', tone: 'info' }, { id: 'a2', edge: 'azfn-create', tone: 'ok' }],
      chips: [{ label: 'template', value: 'HTTP trigger' }, { label: 'best for', value: 'own endpoint · shared · own lifecycle · scale' }],
    },
    choose: {
      visible: [...wf, ...slot('code'), ...palette],
      highlight: ['code'],
      chips: [{ label: 'our order', value: 'expressions → inline → local → Azure Function' }],
    },
    limits: {
      visible: [...wf, ...slot('code'), 'paletteBox', 'pjs', 'pcs', 'pps'],
      highlight: ['pjs', 'pcs', 'pps'],
      chips: [{ label: 'Standard inline code', value: '≤ 100,000 chars' }, { label: 'C# · PowerShell', value: '10 min · 100 MB' }],
    },
    recap: {
      visible: [...wf, ...slot('code'), ...palette],
      chips: [{ label: 'pick', value: 'simplest that stays readable' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data in' },
    { tone: 'ok', label: 'result out' },
    { tone: 'fail', label: 'does not return' },
  ],
};
