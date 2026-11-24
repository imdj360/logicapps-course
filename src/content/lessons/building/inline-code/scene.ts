import type { Scene } from '../../../../lessons/scene-types';

const inline = ['trigger', 'js', 'cs', 'ps', 'trig-js', 'trig-cs', 'trig-ps'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'trigger', kind: 'trigger', label: 'Order lines', sublabel: 'fixed-width', x: 110, y: 240 },
    { id: 'js', kind: 'action', label: 'JavaScript', sublabel: 'Inline Code', x: 380, y: 70 },
    { id: 'cs', kind: 'action', label: 'C# script', sublabel: '.csx', x: 380, y: 180 },
    { id: 'ps', kind: 'action', label: 'PowerShell', sublabel: '.ps1', x: 380, y: 300 },
    { id: 'local', kind: 'action', label: 'Local function', sublabel: '.NET in project', x: 380, y: 420 },
    { id: 'lib', kind: 'storage', label: 'lib/custom', sublabel: 'net472 · net8', x: 720, y: 420 },
    { id: 'azfn', kind: 'hosting-plan', label: 'Azure Function', sublabel: 'separate app', x: 720, y: 240 },
  ],
  edges: [
    { id: 'trig-js', from: 'trigger', to: 'js' },
    { id: 'trig-cs', from: 'trigger', to: 'cs' },
    { id: 'trig-ps', from: 'trigger', to: 'ps' },
    { id: 'trig-local', from: 'trigger', to: 'local' },
    { id: 'local-lib', from: 'local', to: 'lib', style: 'dashed' },
    { id: 'trig-azfn', from: 'trigger', to: 'azfn', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['trigger'],
      highlight: ['trigger'],
      chips: [{ label: 'expressions', value: 'unreadable', tone: 'warn' }],
    },
    options: {
      visible: [...inline, 'local', 'azfn', 'trig-local', 'trig-azfn'],
      highlight: ['js', 'cs', 'ps'],
      chips: [{ label: 'inline', value: 'JS · C# · PowerShell' }, { label: 'or', value: 'local function · Azure Function' }],
    },
    js: {
      visible: [...inline],
      highlight: ['js', 'trig-js'],
      tokens: [{ id: 'j1', edge: 'trig-js', tone: 'info' }],
      chips: [{ label: 'reads', value: 'workflowContext' }, { label: 'Node.js (Standard)', value: '16.x.x' }, { label: 'require()', value: 'not supported', tone: 'warn' }],
    },
    csharp: {
      visible: [...inline],
      highlight: ['cs', 'trig-cs'],
      tokens: [{ id: 'c1', edge: 'trig-cs', tone: 'info' }],
      chips: [{ label: 'available', value: 'Standard only' }, { label: 'entry', value: 'Run(WorkflowContext context)' }, { label: 'runs up to', value: '10 min' }],
    },
    powershell: {
      visible: [...inline],
      highlight: ['ps', 'trig-ps'],
      tokens: [{ id: 'p1', edge: 'trig-ps', tone: 'info' }],
      chips: [{ label: 'return values', value: 'Push-WorkflowOutput', tone: 'ok' }, { label: 'return · Write-Output · Write-Host', value: "don't return", tone: 'fail' }],
    },
    local: {
      visible: [...inline, 'local', 'lib', 'trig-local', 'local-lib'],
      highlight: ['local', 'lib', 'local-lib'],
      tokens: [{ id: 'l1', edge: 'trig-local', tone: 'info' }],
      chips: [{ label: 'targets', value: '.NET Framework · .NET 8' }, { label: 'author on', value: 'VS Code, Windows', tone: 'warn' }],
    },
    azfn: {
      visible: [...inline, 'local', 'azfn', 'trig-local', 'trig-azfn'],
      highlight: ['azfn', 'trig-azfn'],
      tokens: [{ id: 'a1', edge: 'trig-azfn', tone: 'info' }],
      chips: [{ label: 'template', value: 'HTTP trigger' }, { label: 'best for', value: 'own endpoint · shared · own lifecycle · scale' }],
    },
    choose: {
      visible: [...inline, 'local', 'lib', 'azfn', 'trig-local', 'local-lib', 'trig-azfn'],
      chips: [{ label: 'our order', value: 'expressions → inline → local → Azure Function' }],
    },
    limits: {
      visible: [...inline, 'local', 'trig-local'],
      chips: [{ label: 'Standard inline code', value: '≤ 100,000 chars' }, { label: 'C# · PowerShell', value: '10 min · 100 MB' }],
    },
    recap: {
      visible: [...inline, 'local', 'lib', 'azfn', 'trig-local', 'local-lib', 'trig-azfn'],
      chips: [{ label: 'pick', value: 'simplest that stays readable' }],
    },
  },
  legend: [
    { tone: 'info', label: 'data in' },
    { tone: 'ok', label: 'returns' },
    { tone: 'fail', label: "doesn't return" },
  ],
};
