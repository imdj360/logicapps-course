import type { NodeKind, SceneNode } from '../../lessons/scene-types';

export const NODE_W = 156;
export const NODE_H = 60;

export const KIND_TONE: Record<NodeKind, string> = {
  trigger: 'info',
  action: 'info',
  scope: 'info',
  condition: 'info',
  'connector-builtin': 'ok',
  'connector-managed': 'ok',
  servicebus: 'warn',
  storage: 'neutral',
  'hosting-plan': 'neutral',
  appinsights: 'neutral',
  keyvault: 'neutral',
  'llm-agent': 'agent',
  'mcp-server': 'agent',
  human: 'accent',
  user: 'accent',
};

const GLYPHS: Record<NodeKind, string> = {
  trigger: 'M1.5 -7 L-4 1 H0 L-1.5 7 L4 -1 H0 Z',
  action: 'M-4 -5 L5 0 L-4 5 Z',
  scope: 'M-6 -5 H6 V5 H-6 Z M-3 -2 H3 V2 H-3 Z',
  condition: 'M0 -6 L6 0 L0 6 L-6 0 Z',
  'connector-builtin': 'M-5 -2 H5 V2 H-5 Z M-2 -6 V-2 M2 -6 V-2 M0 2 V6',
  'connector-managed': 'M-6 2 A4 4 0 0 1 -3 -5 A5 5 0 0 1 5 -3 A3.5 3.5 0 0 1 5 4 H-4 A3 3 0 0 1 -6 2 Z',
  servicebus: 'M-6 -4 H6 V4 H-6 Z M-2 -4 V4 M2 -4 V4',
  storage: 'M-5 -4 A5 2 0 0 0 5 -4 A5 2 0 0 0 -5 -4 V4 A5 2 0 0 0 5 4 V-4',
  'hosting-plan': 'M-6 -5 H6 V-1 H-6 Z M-6 1 H6 V5 H-6 Z',
  appinsights: 'M-6 5 L-2 -1 L1 2 L6 -5',
  keyvault: 'M-2 -2 A3 3 0 1 1 1 1 L6 6 M3 3 L5 1',
  'llm-agent': 'M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z',
  'mcp-server': 'M-6 -3 H6 M-6 3 H6 M-3 -6 V6 M3 -6 V6',
  human: 'M0 -2 A3 3 0 1 1 0.01 -2 Z M-5 6 A5 4 0 0 1 5 6',
  user: 'M-6 -5 H6 V3 H-6 Z M-3 6 H3',
};

const FILLED = new Set<NodeKind>(['trigger', 'action', 'condition', 'llm-agent']);

interface Props {
  node: SceneNode;
  state: 'normal' | 'highlight' | 'failed' | 'skipped';
}

export function NodeShape({ node, state }: Props) {
  const tone = state === 'failed' ? 'fail' : KIND_TONE[node.kind];
  const x = node.x - NODE_W / 2;
  const y = node.y - NODE_H / 2;
  return (
    <g data-node-id={node.id} data-state={state} className={`node node--${tone}${state === 'highlight' ? ' node--hl' : ''}${state === 'skipped' ? ' node--skipped' : ''}`}>
      <rect className="node__card" x={x} y={y} width={NODE_W} height={NODE_H} rx={10} />
      <rect className="node__chip" x={x + 10} y={node.y - 14} width={28} height={28} rx={7} />
      <path
        className={FILLED.has(node.kind) ? 'node__glyph node__glyph--fill' : 'node__glyph'}
        d={GLYPHS[node.kind]}
        transform={`translate(${x + 24} ${node.y})`}
      />
      <text className="node__label" x={x + 46} y={node.sublabel ? node.y - 3 : node.y + 4}>{node.label}</text>
      {node.sublabel && <text className="node__sub" x={x + 46} y={node.y + 13}>{node.sublabel}</text>}
      {state === 'failed' && (
        <g transform={`translate(${x + NODE_W - 4} ${y + 4})`} className="node__badge">
          <circle r={8} />
          <path d="M-3 -3 L3 3 M3 -3 L-3 3" />
        </g>
      )}
    </g>
  );
}
