import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { scenarioFields } from './lib/validators';

/**
 * Catálogo publicado (`scenarios`) más el singleton de cuotas de voz.
 * `sessions`, `decisions` y `results` siguen pendientes de D1/D2.
 */
export default defineSchema({
  scenarios: defineTable(scenarioFields)
    .index('by_slug', ['slug'])
    .index('by_published_and_position', ['published', 'position']),
  voiceQuota: defineTable({
    singleton: v.literal('global'),
    hourWindowStart: v.number(),
    hourCount: v.number(),
    dayWindowStart: v.number(),
    dayCount: v.number(),
    leases: v.array(v.object({ id: v.string(), expiresAt: v.number() })),
    // Índice de lookup. No es UNIQUE; la mutación usa take(2) y falla cerrado.
  }).index('by_singleton', ['singleton']),
});
