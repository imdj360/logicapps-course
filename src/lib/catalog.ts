import type { ModuleDef } from '../data/modules';
import { withBase } from './paths';

export interface LessonEntry { slug: string; reviewStatus: 'draft' | 'approved' }
export interface CatalogLesson { slug: string; title: string; status: 'published' | 'coming-soon'; href: string | null }
export interface CatalogModule { id: string; number: string; title: string; lessons: CatalogLesson[] }

export function buildCatalog(
  lessons: LessonEntry[],
  opts: { includeDrafts: boolean; modules: ModuleDef[]; base?: string },
): CatalogModule[] {
  const known = new Set(opts.modules.flatMap((m) => m.lessons.map((l) => l.slug)));
  const unknown = lessons.find((l) => !known.has(l.slug));
  if (unknown) throw new Error(`Lesson "${unknown.slug}" has content but is not listed in MODULES`);

  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  return opts.modules.map((m) => ({
    id: m.id,
    number: m.number,
    title: m.title,
    lessons: m.lessons.map(({ slug, title }) => {
      const entry = bySlug.get(slug);
      const published = !!entry && (entry.reviewStatus === 'approved' || opts.includeDrafts);
      return { slug, title, status: published ? 'published' : 'coming-soon', href: published ? withBase(`/lessons/${slug}/`, opts.base ?? '/') : null };
    }),
  }));
}

export interface NextLesson { href: string; title: string; moduleNumber: string; moduleTitle: string; newModule: boolean }

/** The next published lesson in guide order after `slug`, skipping lessons that aren't published. */
export function nextLesson(catalog: CatalogModule[], slug: string): NextLesson | null {
  const flat = catalog.flatMap((m) => m.lessons.map((l) => ({ ...l, mod: m })));
  const i = flat.findIndex((l) => l.slug === slug);
  if (i < 0) return null;
  const next = flat.slice(i + 1).find((l) => l.status === 'published' && l.href);
  if (!next) return null;
  return { href: next.href!, title: next.title, moduleNumber: next.mod.number, moduleTitle: next.mod.title, newModule: next.mod.id !== flat[i].mod.id };
}
