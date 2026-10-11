import { MAX_ADVICE_TEXT_CHARS, fingerprintText, resolveAdviceText } from './adviceCatalog';
import { buildAudioCacheKey, processAudioCache, type ProcessAudioCache } from './audioCache';
import {
  readVoiceProviderConfig,
  requestElevenLabsMpeg,
  type ProviderFailure,
  type VoiceProviderConfig,
} from './elevenLabsTts';
import { isVoiceEnabled } from './voiceLimits';
import type { VoiceQuotaStore } from './voiceQuotaStore';

export type SynthesizeAdviceOk = {
  ok: true;
  adviceId: string;
  mimeType: 'audio/mpeg';
  audioBase64: string;
  cacheHit: boolean;
};

export type SynthesizeAdviceErr = {
  ok: false;
  code: 'UNKNOWN_ADVICE' | 'TEXT_TOO_LONG' | 'DISABLED' | 'RATE_LIMITED' | ProviderFailure['code'];
  message: string;
};

export type SynthesizeAdviceResult = SynthesizeAdviceOk | SynthesizeAdviceErr;

export type SynthesizeAdviceDeps = {
  env: Record<string, string | undefined>;
  fetchImpl: typeof fetch;
  cache?: ProcessAudioCache;
  /** Obligatorio antes de hablar con el proveedor. Los tests lo inyectan. */
  quota?: VoiceQuotaStore | null;
  now?: number;
  timeoutMs?: number;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunk) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
  }
  return btoa(binary);
}

export async function synthesizeAdviceAudio(
  adviceId: string,
  deps: SynthesizeAdviceDeps,
): Promise<SynthesizeAdviceResult> {
  const text = resolveAdviceText(adviceId);
  if (text === null) {
    return { ok: false, code: 'UNKNOWN_ADVICE', message: 'Consejo no autorizado.' };
  }
  if (text.length > MAX_ADVICE_TEXT_CHARS) {
    return { ok: false, code: 'TEXT_TOO_LONG', message: 'El consejo supera el límite de texto.' };
  }

  if (!isVoiceEnabled(deps.env)) {
    return {
      ok: false,
      code: 'DISABLED',
      message: 'La voz está desactivada. El texto sigue disponible.',
    };
  }

  const config = readVoiceProviderConfig(deps.env);
  if ('error' in config) {
    return { ok: false, code: config.error.code, message: config.error.message };
  }

  if (deps.quota == null) {
    return {
      ok: false,
      code: 'RATE_LIMITED',
      message: 'No se pudo reservar cuota de voz. El texto sigue disponible.',
    };
  }

  const cache = deps.cache ?? processAudioCache;
  const quota = deps.quota;
  const now = deps.now ?? Date.now();
  const key = buildAudioCacheKey({
    adviceId,
    textFingerprint: fingerprintText(text),
    voiceId: config.voiceId,
    modelId: config.modelId,
  });

  try {
    const { audio, cacheHit } = await cache.getOrCreate(key, async () => {
      const reserved = await quota.reserve(now);
      if (!reserved.ok) {
        throw reserved;
      }
      try {
        const generated = await requestElevenLabsMpeg(config, text, deps.fetchImpl, deps.timeoutMs);
        if ('error' in generated) {
          throw generated.error;
        }
        return generated.audio;
      } finally {
        await quota.release(reserved.leaseId, deps.now ?? Date.now());
      }
    });

    return {
      ok: true,
      adviceId,
      mimeType: 'audio/mpeg',
      audioBase64: arrayBufferToBase64(audio),
      cacheHit,
    };
  } catch (error) {
    if (isTypedFailure(error)) {
      return { ok: false, code: error.code, message: error.message };
    }
    return { ok: false, code: 'PROVIDER_ERROR', message: 'No se pudo generar el audio.' };
  }
}

function isTypedFailure(
  value: unknown,
): value is ProviderFailure | { code: 'RATE_LIMITED'; message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as { code: unknown }).code === 'string' &&
    typeof (value as { message: unknown }).message === 'string'
  );
}

export function voiceConfigFromProcessEnv(): Record<string, string | undefined> {
  return {
    VOICE_ENABLED: process.env.VOICE_ENABLED,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
    ELEVENLABS_MODEL_ID: process.env.ELEVENLABS_MODEL_ID,
  };
}

export type { VoiceProviderConfig };
