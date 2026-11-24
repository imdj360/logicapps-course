import type { Scene } from '../../../../lessons/scene-types';

const flow = ['retailer', 'as2', 'x12', 'map', 'erp', 'retailer-as2', 'as2-x12', 'x12-map', 'map-erp'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'retailer', kind: 'user', label: 'Retailer', sublabel: 'X12 over AS2', x: 100, y: 240 },
    { id: 'as2', kind: 'connector-builtin', label: 'AS2 Decode', sublabel: 'MDN', x: 280, y: 240 },
    { id: 'x12', kind: 'connector-builtin', label: 'Decode X12', sublabel: 'TA1 · 997', x: 460, y: 240 },
    { id: 'map', kind: 'action', label: 'Transform', sublabel: 'XSLT map', x: 640, y: 240 },
    { id: 'erp', kind: 'user', label: 'ERP', sublabel: 'its XML', x: 810, y: 240 },
    { id: 'ia', kind: 'storage', label: 'Integration acct', sublabel: 'partners', x: 370, y: 410 },
    { id: 'bad', kind: 'action', label: 'badMessages', sublabel: 'alert', x: 460, y: 80 },
  ],
  edges: [
    { id: 'retailer-as2', from: 'retailer', to: 'as2' },
    { id: 'as2-x12', from: 'as2', to: 'x12' },
    { id: 'x12-map', from: 'x12', to: 'map' },
    { id: 'map-erp', from: 'map', to: 'erp' },
    { id: 'ia-as2', from: 'ia', to: 'as2', style: 'dashed' },
    { id: 'ia-x12', from: 'ia', to: 'x12', style: 'dashed' },
    { id: 'x12-bad', from: 'x12', to: 'bad', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: ['retailer', 'erp'],
      chips: [{ label: 'in', value: 'X12 850 over AS2' }, { label: 'out', value: 'ERP XML' }],
    },
    account: {
      visible: ['retailer', 'erp', 'ia'],
      highlight: ['ia'],
      chips: [{ label: 'holds', value: 'partners · agreements · certs' }, { label: 'Free tier', value: 'no SLA', tone: 'warn' }],
    },
    partners: {
      visible: ['retailer', 'ia'],
      highlight: ['ia'],
      chips: [{ label: 'host', value: 'you' }, { label: 'guest', value: 'the retailer' }],
    },
    as2: {
      visible: [...flow.slice(0, 2), 'retailer-as2', 'ia', 'ia-as2'],
      highlight: ['as2'],
      tokens: [{ id: 'a1', edge: 'retailer-as2', tone: 'info' }],
      chips: [{ label: 'checks', value: 'decrypt · signature · duplicates' }, { label: 'reply', value: 'MDN' }],
    },
    x12: {
      visible: ['retailer', 'as2', 'x12', 'bad', 'retailer-as2', 'as2-x12', 'x12-bad', 'ia', 'ia-x12'],
      highlight: ['x12'],
      tokens: [{ id: 'x1', edge: 'as2-x12', tone: 'info' }, { id: 'x2', edge: 'x12-bad', tone: 'fail' }],
      chips: [{ label: 'split', value: 'goodMessages · badMessages' }, { label: 'acks', value: 'TA1 · 997' }],
    },
    transform: {
      visible: [...flow],
      highlight: ['map', 'map-erp'],
      tokens: [{ id: 't1', edge: 'map-erp', tone: 'ok' }],
      chips: [{ label: 'map', value: 'XSLT · Data Mapper' }],
    },
    outbound: {
      visible: [...flow],
      highlight: ['as2', 'x12'],
      chips: [{ label: 'out', value: 'Encode X12 · AS2 Encode' }, { label: 'EDIFACT acks', value: 'CONTRL' }],
    },
    tracking: {
      visible: [...flow, 'ia'],
      chips: [{ label: 'B2B tracking', value: 'preview, Premium + ADX', tone: 'warn' }],
    },
    recap: {
      visible: [...flow, 'ia', 'bad', 'ia-as2', 'ia-x12', 'x12-bad'],
      chips: [{ label: 'flow', value: 'decode → validate → transform' }],
    },
  },
  legend: [{ tone: 'info', label: 'EDI in' }, { tone: 'ok', label: 'to ERP' }, { tone: 'fail', label: 'rejected' }],
};
