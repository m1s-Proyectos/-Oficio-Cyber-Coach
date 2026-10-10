import { v } from 'convex/values';
import { internalMutation, type MutationCtx } from './_generated/server';
import type { ScenarioDocument } from './lib/validators';
import { SCENARIO_SEED } from './seedData';

type SeedOutcome = 'inserted' | 'updated' | 'unchanged';

function sameContent(existing: ScenarioDocument, seed: ScenarioDocument): boolean {
  return (Object.keys(seed) as Array<keyof ScenarioDocument>).every(
    (key) => existing[key] === seed[key],
  );
}

async function upsertScenario(ctx: MutationCtx, seed: ScenarioDocument): Promise<SeedOutcome> {
  const existing = await ctx.db
    .query('scenarios')
    .withIndex('by_slug', (q) => q.eq('slug', seed.slug))
    .unique();

  if (!existing) {
    await ctx.db.insert('scenarios', seed);
    return 'inserted';
  }
  if (sameContent(existing, seed)) {
    return 'unchanged';
  }
  await ctx.db.patch('scenarios', existing._id, seed);
  return 'updated';
}

/**
 * Siembra idempotente del catálogo ficticio. Interna: solo se ejecuta desde
 * la CLI (`npm run seed`) o desde otras funciones del servidor.
 * Ejecutarla varias veces deja el mismo estado.
 */
export const seedScenarios = internalMutation({
  args: {},
  returns: v.object({
    inserted: v.number(),
    updated: v.number(),
    unchanged: v.number(),
  }),
  handler: async (ctx) => {
    const counts = { inserted: 0, updated: 0, unchanged: 0 };
    for (const seed of SCENARIO_SEED) {
      const outcome = await upsertScenario(ctx, seed);
      counts[outcome] += 1;
    }
    return counts;
  },
});
