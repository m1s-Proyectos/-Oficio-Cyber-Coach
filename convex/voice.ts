'use node';

import { v } from 'convex/values';
import { internal } from './_generated/api';
import { action, type ActionCtx } from './_generated/server';
import { synthesizeAdviceAudio, voiceConfigFromProcessEnv } from './lib/voice/synthesizeAdvice';
import type { VoiceQuotaStore } from './lib/voice/voiceQuotaStore';

const synthesizeResult = v.union(
  v.object({
    ok: v.literal(true),
    adviceId: v.string(),
    mimeType: v.literal('audio/mpeg'),
    audioBase64: v.string(),
    cacheHit: v.boolean(),
  }),
  v.object({
    ok: v.literal(false),
    code: v.union(
      v.literal('UNKNOWN_ADVICE'),
      v.literal('TEXT_TOO_LONG'),
      v.literal('DISABLED'),
      v.literal('RATE_LIMITED'),
      v.literal('MISSING_CONFIG'),
      v.literal('PROVIDER_ERROR'),
      v.literal('TIMEOUT'),
      v.literal('EMPTY_AUDIO'),
      v.literal('TOO_LARGE'),
    ),
    message: v.string(),
  }),
);

function convexQuotaStore(ctx: ActionCtx): VoiceQuotaStore {
  return {
    reserve: async (now) => await ctx.runMutation(internal.voiceQuota.reserve, { now }),
    release: async (leaseId, now) => {
      await ctx.runMutation(internal.voiceQuota.release, { leaseId, now });
    },
    snapshot: () => {
      throw new Error('quota snapshot is not available from the action');
    },
  };
}

/**
 * Genera audio MPEG de un consejo educativo fijo.
 * El cliente solo envía adviceId. VOICE_ENABLED y el proveedor viven en Convex.
 * Cerrado por defecto. Sin identidad de usuario (igual que listPublished).
 */
export const synthesizeAdvice = action({
  args: {
    adviceId: v.string(),
  },
  returns: synthesizeResult,
  handler: async (ctx, args) => {
    return await synthesizeAdviceAudio(args.adviceId, {
      env: voiceConfigFromProcessEnv(),
      fetchImpl: fetch,
      quota: convexQuotaStore(ctx),
    });
  },
});
