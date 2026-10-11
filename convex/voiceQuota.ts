import { v } from 'convex/values';
import type { MutationCtx } from './_generated/server';
import { internalMutation } from './_generated/server';
import {
  QUOTA_SINGLETON,
  RATE_LIMITED_MESSAGE,
  applyRelease,
  applyReserve,
  emptyVoiceQuotaState,
  pickQuotaRows,
  type VoiceQuotaState,
} from './lib/voice/voiceLimits';

function toState(doc: {
  hourWindowStart: number;
  hourCount: number;
  dayWindowStart: number;
  dayCount: number;
  leases: Array<{ id: string; expiresAt: number }>;
}): VoiceQuotaState {
  return {
    hourWindowStart: doc.hourWindowStart,
    hourCount: doc.hourCount,
    dayWindowStart: doc.dayWindowStart,
    dayCount: doc.dayCount,
    leases: doc.leases,
  };
}

function fromState(state: VoiceQuotaState) {
  return {
    hourWindowStart: state.hourWindowStart,
    hourCount: state.hourCount,
    dayWindowStart: state.dayWindowStart,
    dayCount: state.dayCount,
    leases: state.leases,
  };
}

/**
 * Lee como máximo dos filas del intervalo `by_singleton == global`.
 * Ese intervalo forma parte del read set de OCC: un insert concurrente
 * en la misma clave invalida y reintenta la mutación.
 * Si aún así hay más de una fila, se falla cerrado (sin reserva).
 * `release` no inserta: una tabla vacía no crea singleton al liberar.
 */
async function loadExistingRows(ctx: MutationCtx) {
  return await ctx.db
    .query('voiceQuota')
    .withIndex('by_singleton', (q) => q.eq('singleton', QUOTA_SINGLETON))
    .take(2);
}

export const reserve = internalMutation({
  args: { now: v.number() },
  returns: v.union(
    v.object({ ok: v.literal(true), leaseId: v.string() }),
    v.object({
      ok: v.literal(false),
      code: v.literal('RATE_LIMITED'),
      message: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const rows = await loadExistingRows(ctx);
    const pick = pickQuotaRows(rows);
    if (pick.status === 'inconsistent') {
      return { ok: false as const, code: 'RATE_LIMITED' as const, message: RATE_LIMITED_MESSAGE };
    }

    let doc = pick.status === 'one' ? pick.row : null;
    if (doc === null) {
      const blank = emptyVoiceQuotaState(args.now);
      const id = await ctx.db.insert('voiceQuota', {
        singleton: QUOTA_SINGLETON,
        ...fromState(blank),
      });
      doc = await ctx.db.get(id);
      if (!doc) {
        return { ok: false as const, code: 'RATE_LIMITED' as const, message: RATE_LIMITED_MESSAGE };
      }
    }

    const leaseId = `lease-${args.now}-${doc._id}-${doc.hourCount}-${doc.leases.length}`;
    const result = applyReserve(toState(doc), args.now, leaseId);
    await ctx.db.patch(doc._id, fromState(result.state));
    if (!result.ok) {
      return { ok: false as const, code: 'RATE_LIMITED' as const, message: RATE_LIMITED_MESSAGE };
    }
    return { ok: true as const, leaseId: result.leaseId };
  },
});

export const release = internalMutation({
  args: { leaseId: v.string(), now: v.number() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const rows = await loadExistingRows(ctx);
    const pick = pickQuotaRows(rows);
    if (pick.status !== 'one') {
      return null;
    }
    await ctx.db.patch(
      pick.row._id,
      fromState(applyRelease(toState(pick.row), args.leaseId, args.now)),
    );
    return null;
  },
});
