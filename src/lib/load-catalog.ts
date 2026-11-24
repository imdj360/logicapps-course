import { getCollection } from 'astro:content';
import { getModules, includeFixtures } from '../data/modules';
import { buildCatalog, type CatalogModule } from './catalog';

export async function loadCatalog(): Promise<CatalogModule[]> {
  const entries = await getCollection('lessons');
  return buildCatalog(
    entries.map((e) => ({ slug: e.id, reviewStatus: e.data.reviewStatus })),
    { includeDrafts: import.meta.env.DEV, modules: getModules(includeFixtures(import.meta.env)) },
  );
}

export const publishedSlugs = (catalog: CatalogModule[]) =>
  catalog.flatMap((m) => m.lessons).filter((l) => l.status === 'published').map((l) => l.slug);
