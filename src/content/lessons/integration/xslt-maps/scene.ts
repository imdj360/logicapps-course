import type { Scene } from '../../../../lessons/scene-types';

const flow = ['partner', 'transform', 'erp', 'partner-transform', 'transform-erp'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'partner', kind: 'user', label: 'Partner', sublabel: 'their XML', x: 110, y: 110 },
    { id: 'validate', kind: 'connector-builtin', label: 'Validate XML', sublabel: 'against .xsd', x: 330, y: 110 },
    { id: 'transform', kind: 'connector-builtin', label: 'Transform XML', sublabel: 'XSLT map', x: 560, y: 110 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'our XML', x: 790, y: 110 },
    { id: 'maps', kind: 'storage', label: 'Artifacts/Maps', sublabel: '.xslt', x: 560, y: 280 },
    { id: 'schemas', kind: 'storage', label: 'Schemas', sublabel: 'Artifacts · xsd', x: 330, y: 280 },
    { id: 'dm', kind: 'human', label: 'Data Mapper', sublabel: 'VS Code', x: 110, y: 410 },
    { id: 'lml', kind: 'storage', label: 'MapDefinitions', sublabel: '.lml', x: 330, y: 410 },
    { id: 'dmx', kind: 'connector-builtin', label: 'Data Mapper XSLT', sublabel: 'Transform using', x: 790, y: 280 },
    { id: 'asm', kind: 'action', label: '.NET assembly', sublabel: 'lib/custom', x: 790, y: 410 },
  ],
  edges: [
    { id: 'partner-transform', from: 'partner', to: 'transform' },
    { id: 'partner-validate', from: 'partner', to: 'validate' },
    { id: 'validate-transform', from: 'validate', to: 'transform' },
    { id: 'transform-erp', from: 'transform', to: 'erp' },
    { id: 'maps-transform', from: 'maps', to: 'transform', style: 'dashed' },
    { id: 'schemas-validate', from: 'schemas', to: 'validate', style: 'dashed' },
    { id: 'dm-lml', from: 'dm', to: 'lml' },
    { id: 'lml-maps', from: 'lml', to: 'maps' },
    { id: 'maps-dmx', from: 'maps', to: 'dmx', style: 'dashed' },
    { id: 'asm-maps', from: 'asm', to: 'maps', style: 'dashed' },
    { id: 'dm-schemas', from: 'dm', to: 'schemas', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...flow],
      highlight: ['partner', 'erp'],
      tokens: [{ id: 'p1', edge: 'partner-transform', tone: 'info' }],
      chips: [{ label: 'partner', value: 'their schema' }, { label: 'ERP', value: 'our schema' }],
    },
    transform: {
      visible: [...flow],
      highlight: ['transform'],
      tokens: [{ id: 't1', edge: 'partner-transform', tone: 'info' }, { id: 't2', edge: 'transform-erp', tone: 'ok' }],
      chips: [{ label: 'connector', value: 'XML Operations' }, { label: 'inputs', value: 'Content · Map Source · Map' }],
    },
    where: {
      visible: [...flow, 'maps', 'maps-transform'],
      highlight: ['maps', 'maps-transform'],
      chips: [{ label: 'Standard maps', value: 'Artifacts/Maps' }, { label: 'integration account', value: 'not needed', tone: 'ok' }, { label: 'B2B (AS2, X12)', value: 'still needs one', tone: 'warn' }],
    },
    versions: {
      visible: [...flow, 'maps', 'maps-transform'],
      highlight: ['maps'],
      chips: [{ label: 'XSLT', value: '1.0 · 2.0 · 3.0' }, { label: 'map size', value: 'no limit (Standard)', tone: 'ok' }],
    },
    datamapper: {
      visible: [...flow, 'maps', 'schemas', 'dm', 'dm-schemas', 'maps-transform'],
      highlight: ['dm', 'schemas', 'dm-schemas'],
      chips: [{ label: 'schemas', value: 'XSD or JSON' }, { label: 'runs on', value: 'VS Code, Windows', tone: 'warn' }, { label: 'test', value: 'sample data panel' }],
    },
    files: {
      visible: [...flow, 'maps', 'schemas', 'dm', 'lml', 'dm-lml', 'lml-maps', 'dm-schemas'],
      highlight: ['lml', 'maps', 'dm-lml', 'lml-maps'],
      tokens: [{ id: 'f1', edge: 'dm-lml', tone: 'info' }, { id: 'f2', edge: 'lml-maps', tone: 'ok' }],
      chips: [{ label: 'definition', value: '.lml' }, { label: 'runs', value: 'generated .xslt' }],
    },
    action: {
      visible: [...flow, 'maps', 'dm', 'lml', 'dmx', 'dm-lml', 'lml-maps', 'maps-dmx', 'maps-transform'],
      highlight: ['dmx', 'maps-dmx'],
      tokens: [{ id: 'a1', edge: 'maps-dmx', tone: 'ok' }],
      chips: [{ label: 'Data Mapper map', value: 'Transform using Data Mapper XSLT', tone: 'ok' }, { label: 'other maps', value: 'Transform XML' }],
    },
    code: {
      visible: [...flow, 'maps', 'asm', 'asm-maps', 'maps-transform'],
      highlight: ['asm', 'asm-maps'],
      tokens: [{ id: 'c1', edge: 'asm-maps', tone: 'info' }],
      chips: [{ label: 'map calls', value: '.NET assembly' }, { label: 'Standard', value: '.NET Framework · .NET 8' }],
    },
    validate: {
      visible: [...flow, 'validate', 'schemas', 'partner-validate', 'validate-transform', 'schemas-validate'],
      highlight: ['validate', 'schemas-validate'],
      tokens: [{ id: 'v1', edge: 'partner-validate', tone: 'info' }, { id: 'v2', edge: 'validate-transform', tone: 'ok' }],
      chips: [{ label: 'action', value: 'Validate XML' }, { label: 'bad input', value: 'fails early', tone: 'ok' }],
    },
    recap: {
      visible: [...flow, 'validate', 'maps', 'schemas', 'dm', 'lml', 'dmx', 'asm', 'partner-validate', 'validate-transform', 'maps-transform', 'schemas-validate', 'dm-lml', 'lml-maps', 'maps-dmx', 'asm-maps', 'dm-schemas'],
      chips: [{ label: 'hand-written', value: 'Transform XML' }, { label: 'Data Mapper', value: 'its own action' }],
    },
  },
  legend: [
    { tone: 'info', label: 'message / build' },
    { tone: 'ok', label: 'transformed / valid' },
  ],
};
