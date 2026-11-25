import { useEffect, useRef, useState } from 'react';
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
// Hit the box edge exactly, then back off a fixed gap along the line, so diagonal
// arrows end as close to the box as straight ones (per-axis padding left them short).
const EDGE_GAP = 4;
function anchor(a: Box, b: Box): [number, number] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return [a.x, a.y];
  const sx = dx !== 0 ? a.hw / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? a.hh / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy) + EDGE_GAP / len;
  return [a.x + dx * s, a.y + dy * s];
}

/**
 * The horizontal span (in viewBox units) a step is about: its highlighted nodes, frames and edge ends,
 * or every visible node when nothing is highlighted. Used to scroll a too-wide diagram on phones.
 */
export function focusRange(scene: Scene, stepId: string): [number, number] | null {
  const step = scene.steps[stepId];
  if (!step) return null;
  const visible = new Set(step.visible);
  const xs: number[] = [];
  const addNode = (id: string) => {
    const n = scene.nodes.find((x) => x.id === id);
    if (n) { xs.push(n.x - NODE_W / 2, n.x + NODE_W / 2); return; }
    const g = (scene.groups ?? []).find((x) => x.id === id);
    if (g) xs.push(g.x, g.x + g.w);
  };
  for (const id of step.highlight ?? []) {
    if (!visible.has(id)) continue;
    const e = scene.edges.find((x) => x.id === id);
    if (e) { addNode(e.from); addNode(e.to); } else addNode(id);
  }
  if (xs.length === 0) for (const n of scene.nodes) if (visible.has(n.id)) addNode(n.id);
  return xs.length ? [Math.min(...xs), Math.max(...xs)] : null;
}

export function Stage({ scene, stepId, playing, reducedMotion, replayKey = 0 }: Props) {
  const step = scene.steps[stepId] ?? EMPTY;
  const visible = new Set(step.visible);
  const failed = new Set(step.failed ?? []);
  const skipped = new Set(step.skipped ?? []);
  const highlight = new Set(step.highlight ?? []);
  const boxes = new Map<string, Box>([
    ...scene.nodes.map((n): [string, Box] => [n.id, { x: n.x, y: n.y, hw: NODE_W / 2, hh: NODE_H / 2 }]),
    ...(scene.groups ?? []).map((g): [string, Box] => [g.id, { x: g.x + g.w / 2, y: g.y + g.h / 2, hw: g.w / 2, hh: g.h / 2 }]),
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

  // Below 700px the diagram keeps a minimum width and scrolls sideways (labels stay legible).
  // Scroll to what this step is about, and say that it scrolls.
  const scroller = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 4);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = scroller.current;
    const range = focusRange(scene, stepId);
    if (!el || !range || el.scrollWidth <= el.clientWidth + 4) return;
    const scale = el.scrollWidth / w;
    const centre = ((range[0] + range[1]) / 2) * scale;
    const left = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, centre - el.clientWidth / 2));
    el.scrollTo?.({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [scene, stepId, w, reducedMotion, overflows]);

  return (
    <div className="stage">
      <StateChips chips={step.chips} />
      <div className="stage__scroll" ref={scroller}>
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
      {overflows && <p className="stage__hint">Swipe sideways to see the whole diagram ↔</p>}
      <Legend items={scene.legend} />
    </div>
  );
}
