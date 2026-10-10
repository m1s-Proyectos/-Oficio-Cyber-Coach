import { v } from 'convex/values';
import { query, type QueryCtx } from './_generated/server';
import { scenarioCatalogItem, type ScenarioCatalogItem } from './lib/validators';

/** El catálogo es pequeño y acotado; el límite evita lecturas sin cota. */
const MAX_CATALOG_ITEMS = 20;

async function listPublishedScenarios(ctx: QueryCtx): Promise<ScenarioCatalogItem[]> {
  const docs = await ctx.db
    .query('scenarios')
    .withIndex('by_published_and_position', (q) => q.eq('published', true))
    .take(MAX_CATALOG_ITEMS);

  return docs.map((doc) => ({
    slug: doc.slug,
    version: doc.version,
    kicker: doc.kicker,
    title: doc.title,
    summary: doc.summary,
    fictionNotice: doc.fictionNotice,
  }));
}

/**
 * Catálogo público de simulaciones publicadas. No requiere identidad: el
 * MVP no tiene cuentas y el catálogo no contiene datos de personas usuarias.
 */
export const listPublished = query({
  args: {},
  returns: v.array(scenarioCatalogItem),
  handler: async (ctx) => {
    return await listPublishedScenarios(ctx);
  },
});
