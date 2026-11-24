import type { Scene } from '../../../../lessons/scene-types';

// The workflow runs in order: Request → HTTP (partner) → Response. The website waits outside it.
const flow = ['wfBox', 'site', 'req', 'http', 'resp', 'site-req', 'req-http', 'http-resp', 'resp-site'];
const partner = ['api', 'http-api'];

export const scene: Scene = {
  viewBox: [900, 500],
  groups: [
    { id: 'wfBox', label: 'Place order · stateful', x: 216, y: 150, w: 640, h: 128 },
  ],
  nodes: [
    { id: 'site', kind: 'user', label: 'Website', sublabel: 'waits', x: 100, y: 410 },
    { id: 'req', kind: 'trigger', label: 'Request', sublabel: 'order in', x: 310, y: 220 },
    { id: 'http', kind: 'connector-builtin', label: 'HTTP', sublabel: 'call partner', x: 535, y: 220 },
    { id: 'resp', kind: 'action', label: 'Response', sublabel: 'to the website', x: 760, y: 220 },
    { id: 'api', kind: 'user', label: 'Partner API', sublabel: 'takes minutes', x: 535, y: 55 },
    { id: 'hook', kind: 'action', label: 'HTTP Webhook', sublabel: 'instead of HTTP', x: 790, y: 55 },
  ],
  edges: [
    { id: 'site-req', from: 'site', to: 'req', label: 'order' },
    { id: 'req-http', from: 'req', to: 'http' },
    { id: 'http-resp', from: 'http', to: 'resp' },
    { id: 'resp-site', from: 'resp', to: 'site', style: 'dashed', label: 'answer' },
    { id: 'http-api', from: 'http', to: 'api', label: 'poll' },
    { id: 'hook-api', from: 'hook', to: 'api', style: 'dashed', label: 'callback' },
  ],
  steps: {
    problem: {
      visible: [...flow, ...partner],
      highlight: ['site', 'api'],
      tokens: [{ id: 'p1', edge: 'site-req', tone: 'info' }, { id: 'p2', edge: 'http-api', tone: 'info' }],
      chips: [{ label: 'website', value: 'waiting' }, { label: 'partner', value: 'takes minutes', tone: 'warn' }],
    },
    sync: {
      visible: [...flow, ...partner],
      highlight: ['site', 'resp', 'resp-site'],
      tokens: [{ id: 's1', edge: 'site-req', tone: 'info' }, { id: 's2', edge: 'req-http', tone: 'info' }, { id: 's3', edge: 'http-resp', tone: 'info' }, { id: 's4', edge: 'resp-site', tone: 'ok' }],
      chips: [{ label: 'website waits for', value: 'the Response action' }, { label: 'Standard limit', value: '225 s, then 504', tone: 'fail' }],
    },
    asyncin: {
      visible: [...flow, ...partner],
      highlight: ['resp', 'resp-site'],
      tokens: [{ id: 'a1', edge: 'site-req', tone: 'info' }, { id: 'a2', edge: 'resp-site', tone: 'ok' }],
      chips: [{ label: 'switch 1 · Response action', value: 'Asynchronous response' }, { label: 'website gets', value: '202 at once', tone: 'ok' }],
    },
    outbound: {
      visible: [...flow, ...partner],
      highlight: ['http', 'api', 'http-api'],
      tokens: [
        { id: 'o1', edge: 'http-api', tone: 'info' },
        { id: 'o2', edge: 'http-api', tone: 'info' },
        { id: 'o3', edge: 'http-api', tone: 'ok' },
      ],
      chips: [{ label: 'switch 2 · HTTP action', value: 'Asynchronous pattern' }, { label: 'partner answers', value: '202 + location' }, { label: 'HTTP action', value: 'polls until done' }],
    },
    build: {
      visible: [...flow, ...partner],
      highlight: ['api'],
      chips: [{ label: 'while running', value: '202 + location' }, { label: 'done', value: '200 + result', tone: 'ok' }, { label: 'first poll', value: 'after 1 s' }],
    },
    nolocation: {
      visible: [...flow, ...partner],
      highlight: ['http'],
      chips: [{ label: '202, no location', value: 'turn async pattern off', tone: 'warn' }],
    },
    stateless: {
      visible: [...flow, ...partner],
      highlight: ['http'],
      tokens: [{ id: 'n1', edge: 'http-api', tone: 'info' }],
      chips: [{ label: 'stateless', value: 'returns 202 as-is', tone: 'warn' }, { label: 'polls location', value: 'no' }],
    },
    webhook: {
      visible: [...flow, ...partner, 'hook', 'hook-api'],
      highlight: ['hook', 'hook-api', 'api'],
      tokens: [{ id: 'w1', edge: 'hook-api', tone: 'ok' }],
      chips: [{ label: 'subscribe', value: 'callback URL' }, { label: 'workflow', value: 'pauses, no polling', tone: 'ok' }],
    },
    timeouts: {
      visible: [...flow, ...partner],
      chips: [{ label: 'HTTP request', value: '225 s (also max)' }, { label: 'stateful run', value: '90 days' }, { label: 'stateless run', value: '5 min', tone: 'warn' }],
    },
    recap: {
      visible: [...flow, ...partner, 'hook', 'hook-api'],
      chips: [{ label: 'wait', value: 'Response' }, { label: 'poll', value: '202 + location' }, { label: 'callback', value: 'webhook' }],
    },
  },
  legend: [
    { tone: 'info', label: 'request / poll' },
    { tone: 'ok', label: 'answer' },
    { tone: 'fail', label: 'error' },
  ],
};
