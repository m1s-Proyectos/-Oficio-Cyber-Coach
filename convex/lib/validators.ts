import { v, type Infer } from 'convex/values';

/** Slugs conocidos por el producto (PLAN-MAESTRO, sección 8.3). */
export const scenarioSlug = v.union(v.literal('whatsapp-familiar'), v.literal('tienda-iphone'));
export type ScenarioSlug = Infer<typeof scenarioSlug>;

/** Campos de catálogo de un escenario. La `definition` del guion llega en las Fases 04 a 06. */
export const scenarioFields = {
  slug: scenarioSlug,
  version: v.number(),
  position: v.number(),
  kicker: v.string(),
  title: v.string(),
  summary: v.string(),
  fictionNotice: v.string(),
  published: v.boolean(),
};

export const scenarioDocument = v.object(scenarioFields);
export type ScenarioDocument = Infer<typeof scenarioDocument>;

/** Forma pública que el cliente recibe al listar el catálogo. */
export const scenarioCatalogItem = v.object({
  slug: scenarioSlug,
  version: v.number(),
  kicker: v.string(),
  title: v.string(),
  summary: v.string(),
  fictionNotice: v.string(),
});
export type ScenarioCatalogItem = Infer<typeof scenarioCatalogItem>;
