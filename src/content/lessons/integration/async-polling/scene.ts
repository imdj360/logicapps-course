import type { Scene } from '../../../../lessons/scene-types';

const inbound = ['site', 'req', 'resp', 'site-req', 'req-resp', 'resp-site'];
const outbound = ['http', 'api', 'req-http', 'http-api'];

export const scene: Scene = {
  viewBox: [900, 500],
  nodes: [
    { id: 'site', kind: 'user', label: 'Website', sublabel: 'waits', x: 110, y: 240 },
    { id: 'req', kind: 'trigger', label: 'Request', x: 340, y: 240 },
    { id: 'resp', kind: 'action', label: 'Response', sublabel: '200 or 202', x: 340, y: 410 },
    { id: 'http', kind: 'connector-builtin', label: 'HTTP', sublabel: 'async pattern', x: 590, y: 240 },
    { id: 'api', kind: 'user', label: 'Partner API', sublabel: '202 + location', x: 810, y: 240 },
    { id: 'hook', kind: 'action', label: 'HTTP Webhook', sublabel: 'callback URL', x: 590, y: 90 },
  ],
  edges: [
    { id: 'site-req', from: 'site', to: 'req' },
    { id: 'req-resp', from: 'req', to: 'resp' },
    { id: 'resp-site', from: 'resp', to: 'site', style: 'dashed' },
    { id: 'req-http', from: 'req', to: 'http' },
    { id: 'http-api', from: 'http', to: 'api' },
    { id: 'hook-api', from: 'hook', to: 'api', style: 'dashed' },
  ],
  steps: {
    problem: {
      visible: [...inbound, ...outbound],
      highlight: ['site', 'api'],
      tokens: [{ id: 'p1', edge: 'site-req', tone: 'info' }],
      chips: [{ label: 'website', value: 'waiting' }, { label: 'partner', value: 'takes minutes', tone: 'warn' }],
    },
    sync: {
      visible: [...inbound],
      highlight: ['req', 'resp', 'resp-site'],
      tokens: [{ id: 's1', edge: 'site-req', tone: 'info' }, { id: 's2', edge: 'resp-site', tone: 'ok' }],
      chips: [{ label: 'Standard wait', value: '225 s' }, { label: 'too slow', value: '504', tone: 'fail' }, { label: 'all Responses skipped', value: '502', tone: 'fail' }],
    },
    asyncin: {
      visible: [...inbound],
      highlight: ['resp', 'resp-site'],
      tokens: [{ id: 'a1', edge: 'resp-site', tone: 'ok' }],
      chips: [{ label: 'Asynchronous response', value: 'on' }, { label: 'caller gets', value: '202 at once', tone: 'ok' }],
    },
    outbound: {
      visible: [...inbound, ...outbound],
      highlight: ['http', 'http-api'],
      tokens: [
        { id: 'o1', edge: 'http-api', tone: 'info' },
        { id: 'o2', edge: 'http-api', tone: 'info' },
        { id: 'o3', edge: 'http-api', tone: 'ok' },
      ],
      chips: [{ label: 'API answers', value: '202 + location' }, { label: 'action', value: 'polls until non-202' }, { label: 'slow down', value: 'Retry-After' }],
    },
    build: {
      visible: [...outbound, 'req'],
      highlight: ['api'],
      chips: [{ label: 'while running', value: '202 + location' }, { label: 'done', value: '200 + result', tone: 'ok' }, { label: 'first poll', value: 'after 1 s' }],
    },
    nolocation: {
      visible: [...outbound, 'req'],
      highlight: ['http'],
      chips: [{ label: '202, no location', value: 'turn async pattern off', tone: 'warn' }],
    },
    stateless: {
      visible: [...outbound, 'req'],
      highlight: ['http'],
      tokens: [{ id: 'n1', edge: 'http-api', tone: 'info' }],
      chips: [{ label: 'stateless', value: 'returns 202 as-is', tone: 'warn' }, { label: 'polls location', value: 'no' }],
    },
    webhook: {
      visible: [...inbound, ...outbound, 'hook', 'hook-api'],
      highlight: ['hook', 'hook-api'],
      tokens: [{ id: 'w1', edge: 'hook-api', tone: 'ok' }],
      chips: [{ label: 'subscribe', value: 'callback URL' }, { label: 'workflow', value: 'pauses, no polling' }],
    },
    timeouts: {
      visible: [...inbound, ...outbound],
      chips: [{ label: 'HTTP request', value: '225 s default' }, { label: 'stateful run', value: '90 days' }, { label: 'stateless run', value: '5 min', tone: 'warn' }],
    },
    recap: {
      visible: [...inbound, ...outbound, 'hook', 'hook-api'],
      chips: [{ label: 'wait', value: 'Response' }, { label: 'poll', value: '202 + location' }, { label: 'callback', value: 'webhook' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request / poll' },
    { tone: 'ok', label: 'answer' },
    { tone: 'fail', label: 'error' },
  ],
};
