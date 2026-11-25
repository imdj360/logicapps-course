import { motion } from 'motion/react';
import type { Scene } from '../../lessons/scene-types';
import { NodeShape, NODE_H, NODE_W } from './NodeShape';
import { StateChips } from './StateChips';
import { Legend } from './Legend';

interface Props {
  scene: Scene;
  stepId: string;
  playing: boolean;
  reducedMotion: boolean;
  /** Changing this restarts token animations (Replay). */
  replayKey?: number;
}

const EMPTY = { visible: [] as string[], chips: [] };

/** Anything an edge can attach to: a node card, or a group frame (e.g. a scope). */
interface Box { x: number; y: number; hw: number; hh: number }

/** Point where the line from a's centre towards b leaves a's box. */
function anchor(a: Box, b: Box): [number, number] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 0 && dy === 0) return [a.x, a.y];
  const sx = Math.abs(dx) > 0 ? (a.hw + 6) / Math.abs(dx) : Infinity;
  const sy = Math.abs(dy) > 0 ? (a.hh + 6) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return [a.x + dx * s, a.y + dy * s];
}

export function Stage({ scene, stepId, playing, reducedMotion, replayKey = 0 }: Props) {
  const step = scene.steps[stepId] ?? EMPTY;
  const visible = new Set(step.visible);
  const failed = new Set(step.failed ?? []);
  const skipped = new Set(step.skipped ?? []);
  const highlight = new Set(step.highlight ?? []);
  const boxes = new Map<string, Box>([
    ...scene.nodes.map((n): [string, Box] => [n.id, { x: n.x, y: n.y, hw: NODE_W / 2, hh: NODE_H / 2 }]),
    ...(scene.groups ?? []).map((g): [string, Box] => [g.id, { x: g.x + g.w / 2, y: g.y + g.h / 2, hw: g.w / 2 - 6, hh: g.h / 2 - 6 }]),
  ]);
  const [w, h] = scene.viewBox;

  const segment = (edgeId: string) => {
    const e = scene.edges.find((x) => x.id === edgeId);
    const from = e && boxes.get(e.from);
    const to = e && boxes.get(e.to);
    if (!from || !to) return null;
    return { from: anchor(from, to), to: anchor(to, from) };
  };

  const animate = playing && !reducedMotion;

  return (
    <div className="stage">
      <StateChips chips={step.chips} />
      <div className="stage__scroll">
      <svg className="stage__svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Diagram for this step">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" className="edge__head" />
          </marker>
        </defs>
        {(scene.groups ?? []).filter((g) => visible.has(g.id)).map((g) => (
          <g key={g.id} data-group-id={g.id} className={`group${highlight.has(g.id) ? ' group--hl' : ''}`}>
            <rect className="group__box" x={g.x} y={g.y} width={g.w} height={g.h} rx={14} />
            <text className="group__label" x={g.labelAlign === 'end' ? g.x + g.w - 14 : g.x + 14} y={g.y + 20} textAnchor={g.labelAlign === 'end' ? 'end' : 'start'}>{g.label}</text>
          </g>
        ))}
        {scene.edges.filter((e) => visible.has(e.id)).map((e) => {
          const seg = segment(e.id);
          if (!seg) return null;
          const line = (
            <line
              key={e.id}
              data-edge-id={e.id}
              className={`edge${e.style === 'dashed' ? ' edge--dashed' : ''}${highlight.has(e.id) ? ' edge--hl' : ''}`}
              x1={seg.from[0]} y1={seg.from[1]} x2={seg.to[0]} y2={seg.to[1]}
              markerEnd="url(#arrow)"
            />
          );
          if (!e.label) return line;
          const mx = (seg.from[0] + seg.to[0]) / 2;
          const my = (seg.from[1] + seg.to[1]) / 2;
          // Beside mostly-vertical lines, above the others, so the text never sits on the line.
          const vertical = Math.abs(seg.to[0] - seg.from[0]) < Math.abs(seg.to[1] - seg.from[1]);
          return (
            <g key={e.id}>
              {line}
              <text
                className="edge__label" data-edge-label={e.id}
                x={vertical ? mx + 10 : mx} y={vertical ? my + 4 : my - 8}
                textAnchor={vertical ? 'start' : 'middle'}
              >{e.label}</text>
            </g>
          );
        })}
        {scene.nodes.filter((n) => visible.has(n.id)).map((n) => (
          <NodeShape
            key={n.id}
            node={n}
            state={failed.has(n.id) ? 'failed' : skipped.has(n.id) ? 'skipped' : highlight.has(n.id) ? 'highlight' : 'normal'}
          />
        ))}
        {(step.tokens ?? []).map((t, i) => {
          const seg = segment(t.edge);
          if (!seg) return null;
          const common = { 'data-token-id': t.id, 'data-animated': String(animate), className: `token token--${t.tone}`, r: 7 };
          if (!animate) {
            const mx = (seg.from[0] + seg.to[0]) / 2;
            const my = (seg.from[1] + seg.to[1]) / 2;
            return <circle key={t.id} {...common} cx={mx} cy={my} />;
          }
          return (
            <motion.circle
              key={`${t.id}-${stepId}-${replayKey}`}
              {...common}
              initial={{ cx: seg.from[0], cy: seg.from[1], opacity: 0 }}
              animate={{ cx: [seg.from[0], seg.to[0]], cy: [seg.from[1], seg.to[1]], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.6, delay: i * 0.35, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>
      </div>
      <Legend items={scene.legend} />
    </div>
  );
}
