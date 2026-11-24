import { describe, expect, it } from 'vitest';
import { buildCatalog } from './catalog';
import { lessonSchema } from '../lessons/schema';
import type { ModuleDef } from '../data/modules';

const modules: ModuleDef[] = [
  { id: 'foundations', number: '01', title: 'Foundations', lessons: [
    { slug: 'a', title: 'Lesson A' },
    { slug: 'b', title: 'Lesson B' },
  ] },
];

const find = (cat: ReturnType<typeof buildCatalog>, slug: string) =>
  cat.flatMap((m) => m.lessons).find((l) => l.slug === slug)!;

describe('buildCatalog', () => {
  it('marks lessons without content as coming soon', () => {
    const cat = buildCatalog([], { includeDrafts: true, modules });
    expect(find(cat, 'a')).toMatchObject({ status: 'coming-soon', href: null });
  });

  it('hides drafts when drafts are excluded', () => {
    const cat = buildCatalog([{ slug: 'a', reviewStatus: 'draft' }], { includeDrafts: false, modules });
    expect(find(cat, 'a')).toMatchObject({ status: 'coming-soon', href: null });
  });

  it('publishes drafts when drafts are included', () => {
    const cat = buildCatalog([{ slug: 'a', reviewStatus: 'draft' }], { includeDrafts: true, modules });
    expect(find(cat, 'a')).toMatchObject({ status: 'published', href: '/lessons/a/' });
  });

  it('publishes approved lessons regardless of the flag', () => {
    const cat = buildCatalog([{ slug: 'b', reviewStatus: 'approved' }], { includeDrafts: false, modules });
    expect(find(cat, 'b')).toMatchObject({ status: 'published', href: '/lessons/b/' });
  });

  it('throws for content that is not in the module list', () => {
    expect(() => buildCatalog([{ slug: 'ghost', reviewStatus: 'approved' }], { includeDrafts: true, modules }))
      .toThrow(/ghost/);
  });
});

describe('lessonSchema', () => {
  const base = {
    title: 'T', module: 'foundations', order: 1, minutes: 8, level: 'Beginner',
    summary: 'S', youWillLearn: ['x'],
  };

  it('defaults to draft with no related articles', () => {
    const r = lessonSchema.parse(base);
    expect(r.reviewStatus).toBe('draft');
    expect(r.relatedArticles).toEqual([]);
  });

  it('requires lastVerified for approved lessons', () => {
    expect(lessonSchema.safeParse({ ...base, reviewStatus: 'approved' }).success).toBe(false);
    expect(lessonSchema.safeParse({ ...base, reviewStatus: 'approved', lastVerified: '2026-11-24' }).success).toBe(true);
  });

  it('requires at least one learning outcome', () => {
    expect(lessonSchema.safeParse({ ...base, youWillLearn: [] }).success).toBe(false);
  });
});
