import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { lessonSchema } from '../lessons/schema';
import type { Scene } from '../lessons/scene-types';

const sources = import.meta.glob<string>('./lessons/*/*/index.mdx', { query: '?raw', import: 'default', eager: true });
const scenes = import.meta.glob<{ scene: Scene }>('./lessons/*/*/scene.ts', { eager: true });

const LAUNCH_LESSONS = ['follow-an-order', 'where-logic-apps-run', 'resubmitting-runs', 'agentic-triage'];

interface ParsedStep { id: string; name: string; tag?: string; body: string }

function parseLesson(source: string) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(source);
  if (!fm) throw new Error('missing frontmatter');
  const body = source.slice(fm[0].length).replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const steps: ParsedStep[] = [...body.matchAll(/<Step\s+([^>]*)>([\s\S]*?)<\/Step>/g)].map((m) => {
    const attr = (k: string) => new RegExp(`${k}="([^"]*)"`).exec(m[1])?.[1];
    return { id: attr('id') ?? '', name: attr('name') ?? '', tag: attr('tag'), body: m[2] };
  });
  return { frontmatter: parse(fm[1]), steps, body };
}

const entries = Object.entries(sources)
  .filter(([path]) => !path.includes('/_fixture/'))
  .map(([path, source]) => {
    const slug = path.split('/').at(-2)!;
    const sceneMod = Object.entries(scenes).find(([p]) => p.endsWith(`/${slug}/scene.ts`))?.[1];
    return { slug, path, ...parseLesson(source), scene: sceneMod?.scene };
  });

describe('launch lessons exist', () => {
  it.each(LAUNCH_LESSONS)('%s has content', (slug) => {
    expect(entries.map((e) => e.slug)).toContain(slug);
  });
});

describe.each(entries)('lesson $slug', ({ frontmatter, steps, body, scene }) => {
  it('has valid frontmatter', () => {
    expect(lessonSchema.safeParse(frontmatter).success).toBe(true);
  });

  it('has 8–12 steps ending in a RECAP', () => {
    expect(steps.length).toBeGreaterThanOrEqual(8);
    expect(steps.length).toBeLessThanOrEqual(12);
    expect(steps.at(-1)?.tag).toBe('RECAP');
    expect(steps[0]?.tag).toBe('PROBLEM');
  });

  it('has unique, named steps', () => {
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
    for (const s of steps) expect(s.name.length).toBeGreaterThan(0);
  });

  it('has a scene whose steps match the MDX steps', () => {
    expect(scene).toBeDefined();
    expect(Object.keys(scene!.steps).sort()).toEqual(steps.map((s) => s.id).sort());
  });

  it('only references nodes and edges that exist', () => {
    const nodeIds = new Set(scene!.nodes.map((n) => n.id));
    const edgeIds = new Set(scene!.edges.map((e) => e.id));
    for (const e of scene!.edges) {
      expect(nodeIds, `edge ${e.id}.from`).toContain(e.from);
      expect(nodeIds, `edge ${e.id}.to`).toContain(e.to);
    }
    for (const [id, st] of Object.entries(scene!.steps)) {
      for (const v of [...st.visible, ...(st.highlight ?? []), ...(st.failed ?? [])]) {
        expect(nodeIds.has(v) || edgeIds.has(v), `step ${id}: ${v}`).toBe(true);
      }
      for (const t of st.tokens ?? []) expect(edgeIds, `step ${id} token ${t.id}`).toContain(t.edge);
    }
  });

  it('keeps node labels short enough for the card', () => {
    for (const n of scene!.nodes) expect(n.label.length, n.label).toBeLessThanOrEqual(16);
    for (const n of scene!.nodes) if (n.sublabel) expect(n.sublabel.length, n.sublabel).toBeLessThanOrEqual(15);
  });

  it('keeps nodes inside the view box', () => {
    const [w, h] = scene!.viewBox;
    for (const n of scene!.nodes) {
      expect(n.x - 78, n.id).toBeGreaterThanOrEqual(0);
      expect(n.x + 78, n.id).toBeLessThanOrEqual(w);
      expect(n.y - 30, n.id).toBeGreaterThanOrEqual(0);
      expect(n.y + 30, n.id).toBeLessThanOrEqual(h);
    }
  });

  it('lists 3–5 learning outcomes', () => {
    expect(frontmatter.youWillLearn.length).toBeGreaterThanOrEqual(3);
    expect(frontmatter.youWillLearn.length).toBeLessThanOrEqual(5);
  });

  it('does not name any product', () => {
    expect(body).not.toMatch(/LogicAppsHub|Lens/);
  });

  it('ships as a draft until Daniel approves it', () => {
    expect(['draft', 'approved']).toContain(frontmatter.reviewStatus ?? 'draft');
  });
});
