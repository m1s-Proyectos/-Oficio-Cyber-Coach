import { defineSchema, defineTable } from 'convex/server';
import { scenarioFields } from './lib/validators';

/**
 * Esquema inicial (Fase 03). Solo `scenarios`: las tablas `sessions`,
 * `decisions` y `results` de la sección 8.2 del plan se añaden en las fases
 * que las usan (04 y 07), cuando sus campos estén cerrados.
 */
export default defineSchema({
  scenarios: defineTable(scenarioFields)
    .index('by_slug', ['slug'])
    .index('by_published_and_position', ['published', 'position']),
});
