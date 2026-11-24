import type { ModuleDef } from '../data/modules';

export interface LessonEntry { slug: string; reviewStatus: 'draft' | 'approved' }
export interface CatalogLesson { slug: string; title: string; status: 'published' | 'coming-soon'; href: string | null }
export interface CatalogModule { id: string; number: string; title: string; lessons: CatalogLesson[] }

export function buildCatalog(
  lessons: LessonEntry[],
  opts: { includeDrafts: boolean; modules: ModuleDef[] },
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
      return { slug, title, status: published ? 'published' : 'coming-soon', href: published ? `/lessons/${slug}/` : null };
    }),
  }));
}
