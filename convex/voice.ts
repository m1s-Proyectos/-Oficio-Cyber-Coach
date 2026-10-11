'use node';

import { v } from 'convex/values';
import { action } from './_generated/server';
import { synthesizeAdviceAudio, voiceConfigFromProcessEnv } from './lib/voice/synthesizeAdvice';

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
      v.literal('MISSING_CONFIG'),
      v.literal('PROVIDER_ERROR'),
      v.literal('TIMEOUT'),
      v.literal('EMPTY_AUDIO'),
      v.literal('TOO_LARGE'),
    ),
    message: v.string(),
  }),
);

/**
 * Genera audio MPEG de un consejo educativo fijo.
 * El cliente solo envía adviceId. La clave vive en el entorno del servidor Convex.
 * Sin identidad de usuario: el MVP no tiene cuentas (igual que listPublished).
 */
export const synthesizeAdvice = action({
  args: {
    adviceId: v.string(),
  },
  returns: synthesizeResult,
  handler: async (_ctx, args) => {
    return await synthesizeAdviceAudio(args.adviceId, {
      env: voiceConfigFromProcessEnv(),
      fetchImpl: fetch,
    });
  },
});
