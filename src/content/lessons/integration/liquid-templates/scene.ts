import type { Scene } from '../../../../lessons/scene-types';

const flow = ['shop', 'liquid', 'crm', 'shop-liquid', 'liquid-crm'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'shop', kind: 'user', label: 'Shop', sublabel: 'flat JSON', x: 110, y: 160 },
    { id: 'liquid', kind: 'connector-builtin', label: 'Liquid', sublabel: 'JSON to JSON', x: 440, y: 160 },
    { id: 'crm', kind: 'user', label: 'CRM', sublabel: 'shaped JSON', x: 780, y: 160 },
    { id: 'template', kind: 'storage', label: 'Artifacts/Maps', sublabel: '.liquid', x: 440, y: 380 },
    { id: 'compose', kind: 'action', label: 'Compose', sublabel: 'simple cases', x: 110, y: 380 },
    { id: 'xml', kind: 'user', label: 'Partner', sublabel: 'XML', x: 780, y: 380 },
  ],
  edges: [
    { id: 'shop-liquid', from: 'shop', to: 'liquid' },
    { id: 'liquid-crm', from: 'liquid', to: 'crm' },
    { id: 'template-liquid', from: 'template', to: 'liquid', style: 'dashed' },
    { id: 'shop-compose', from: 'shop', to: 'compose', style: 'dashed' },
    { id: 'xml-liquid', from: 'xml', to: 'liquid' },
  ],
  steps: {
    problem: {
      visible: [...flow, 'compose', 'shop-compose'],
      highlight: ['shop', 'crm'],
      tokens: [{ id: 'p1', edge: 'shop-liquid', tone: 'info' }],
      chips: [{ label: 'one field', value: 'Compose' }, { label: 'loops · conditions', value: 'Liquid', tone: 'ok' }],
    },
    actions: {
      visible: [...flow],
      highlight: ['liquid'],
      tokens: [{ id: 'a1', edge: 'shop-liquid', tone: 'info' }, { id: 'a2', edge: 'liquid-crm', tone: 'ok' }],
      chips: [{ label: 'formats', value: 'JSON/XML → JSON/text' }, { label: 'inputs', value: 'Content · Source · Name' }],
    },
    template: {
      visible: [...flow, 'template', 'template-liquid'],
      highlight: ['template', 'template-liquid'],
      chips: [{ label: 'input', value: 'content' }, { label: 'file', value: '.liquid' }],
    },
    where: {
      visible: [...flow, 'template', 'template-liquid'],
      highlight: ['template'],
      chips: [{ label: 'Standard', value: 'Artifacts/Maps' }, { label: 'integration account', value: 'optional' }],
    },
    dotliquid: {
      visible: [...flow, 'template', 'template-liquid'],
      highlight: ['liquid'],
      chips: [{ label: 'engine', value: 'DotLiquid 2.0.361' }, { label: 'upcase', value: "doesn't work", tone: 'fail' }, { label: 'Upcase', value: 'works', tone: 'ok' }],
    },
    differences: {
      visible: [...flow, 'template', 'template-liquid'],
      highlight: ['liquid'],
      chips: [{ label: 'json filter', value: 'not implemented', tone: 'warn' }, { label: 'Replace', value: 'regex' }, { label: 'Sort', value: 'text, case-insensitive' }],
    },
    escaping: {
      visible: [...flow],
      highlight: ['liquid-crm'],
      tokens: [{ id: 'e1', edge: 'liquid-crm', tone: 'fail' }],
      chips: [{ label: 'output', value: 'text, parsed as JSON' }, { label: 'backslash', value: "Replace: '\\\\', '\\\\'", tone: 'ok' }],
    },
    xml: {
      visible: [...flow, 'xml', 'xml-liquid'],
      highlight: ['xml', 'xml-liquid'],
      tokens: [{ id: 'x1', edge: 'xml-liquid', tone: 'info' }],
      chips: [{ label: 'XML arrays', value: 'JSONArrayFor' }, { label: 'where compares', value: 'element name' }],
    },
    recap: {
      visible: [...flow, 'template', 'compose', 'xml', 'template-liquid', 'shop-compose', 'xml-liquid'],
      chips: [{ label: 'engine', value: 'DotLiquid' }, { label: 'filters', value: 'Sentence case' }],
    },
  },
  legend: [
    { tone: 'info', label: 'input' },
    { tone: 'ok', label: 'transformed' },
    { tone: 'fail', label: 'breaks' },
  ],
};
