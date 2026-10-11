import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  VOICE_ADVICE_CATALOG,
  fingerprintText,
  isVoiceAdviceId,
  resolveAdviceText,
} from '../voice/adviceCatalog';
import { ProcessAudioCache, buildAudioCacheKey } from '../voice/audioCache';
import {
  readVoiceProviderConfig,
  requestElevenLabsMpeg,
  sanitizeProviderMessage,
} from '../voice/elevenLabsTts';
import { requestAdviceAudio } from '../voice/requestAdviceAudio';
import { synthesizeAdviceAudio } from '../voice/synthesizeAdvice';
import { MemoryVoiceQuotaStore } from '../../convex/lib/voice/voiceQuotaStore';

const SAMPLE_ENV = {
  VOICE_ENABLED: 'true',
  ELEVENLABS_API_KEY: 'sk_test_not_real',
  ELEVENLABS_VOICE_ID: 'voice_test',
  ELEVENLABS_MODEL_ID: 'model_test',
};

const KNOWN_ID = 'codigo-verificacion:otp-request';

afterEach(() => {
  vi.restoreAllMocks();
});

function mpegResponse(bytes = 32, status = 200): Response {
  return new Response(new Uint8Array(bytes).buffer, {
    status,
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}

describe('catálogo de consejos', () => {
  it('resuelve un identificador permitido', () => {
    expect(isVoiceAdviceId(KNOWN_ID)).toBe(true);
    expect(resolveAdviceText(KNOWN_ID)).toBe(VOICE_ADVICE_CATALOG[KNOWN_ID]);
  });

  it('rechaza un identificador desconocido', () => {
    expect(resolveAdviceText('inventado:x')).toBeNull();
    expect(isVoiceAdviceId('whatsapp-familiar:no-existe')).toBe(false);
  });

  it('no incluye marcadores de elenco', () => {
    for (const text of Object.values(VOICE_ADVICE_CATALOG)) {
      expect(text.includes('{{')).toBe(false);
    }
  });
});

describe('clave de caché', () => {
  it('cambia si cambia el texto, la voz o el modelo', () => {
    const base = {
      adviceId: KNOWN_ID,
      textFingerprint: fingerprintText('uno'),
      voiceId: 'v1',
      modelId: 'm1',
    };
    const same = buildAudioCacheKey(base);
    expect(buildAudioCacheKey({ ...base, textFingerprint: fingerprintText('dos') })).not.toBe(same);
    expect(buildAudioCacheKey({ ...base, voiceId: 'v2' })).not.toBe(same);
    expect(buildAudioCacheKey({ ...base, modelId: 'm2' })).not.toBe(same);
    expect(buildAudioCacheKey(base)).toBe(same);
  });

  it('reutiliza audio almacenado', async () => {
    const cache = new ProcessAudioCache();
    const key = 'k1';
    const factory = vi.fn(async () => new Uint8Array([1, 2, 3]).buffer);
    const first = await cache.getOrCreate(key, factory);
    const second = await cache.getOrCreate(key, factory);
    expect(first.cacheHit).toBe(false);
    expect(second.cacheHit).toBe(true);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(new Uint8Array(second.audio)).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('deduplica solicitudes concurrentes', async () => {
    const cache = new ProcessAudioCache();
    let release: (value: ArrayBuffer) => void = () => undefined;
    const factory = vi.fn(
      () =>
        new Promise<ArrayBuffer>((resolve) => {
          release = resolve;
        }),
    );
    const a = cache.getOrCreate('same', factory);
    const b = cache.getOrCreate('same', factory);
    release(new Uint8Array([9]).buffer);
    const [left, right] = await Promise.all([a, b]);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(left.cacheHit || right.cacheHit).toBe(true);
  });
});

describe('proveedor TTS', () => {
  it('exige clave, voz y modelo', () => {
    const missing = readVoiceProviderConfig({ ELEVENLABS_API_KEY: 'sk_x' });
    expect('error' in missing && missing.error.code).toBe('MISSING_CONFIG');
  });

  it('mapea HTTP fallido sin filtrar secretos', async () => {
    const fetchImpl = vi.fn(async () => new Response('xi-api-key: sk_abc123', { status: 401 }));
    const result = await requestElevenLabsMpeg(
      { apiKey: 'sk_abc123', voiceId: 'v', modelId: 'm' },
      'hola',
      fetchImpl,
    );
    expect('error' in result && result.error.code).toBe('PROVIDER_ERROR');
    if ('error' in result) {
      expect(result.error.message.includes('sk_')).toBe(false);
      expect(result.error.message.includes('xi-api-key')).toBe(false);
    }
  });

  it('trata timeout y audio vacío', async () => {
    const aborting = vi.fn(async (_url: string, init?: RequestInit) => {
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const error = new Error('aborted');
          error.name = 'AbortError';
          reject(error);
        });
      });
    });
    const timed = await requestElevenLabsMpeg(
      { apiKey: 'k', voiceId: 'v', modelId: 'm' },
      'hola',
      aborting as unknown as typeof fetch,
      5,
    );
    expect('error' in timed && timed.error.code).toBe('TIMEOUT');

    const empty = await requestElevenLabsMpeg(
      { apiKey: 'k', voiceId: 'v', modelId: 'm' },
      'hola',
      vi.fn(async () => new Response(new Uint8Array().buffer, { status: 200 })),
    );
    expect('error' in empty && empty.error.code).toBe('EMPTY_AUDIO');
  });

  it('oculta secretos en mensajes', () => {
    const cleaned = sanitizeProviderMessage(
      'bad xi-api-key: sk_ejemplo Authorization: Bearer secreto',
    );
    expect(cleaned.includes('sk_')).toBe(false);
    expect(cleaned.toLowerCase().includes('bearer')).toBe(false);
    expect(cleaned.includes('xi-api-key:[redacted]')).toBe(true);
    expect(cleaned.includes('authorization:[redacted]')).toBe(true);
  });
});

describe('synthesizeAdviceAudio', () => {
  it('rechaza ids desconocidos sin llamar al proveedor', async () => {
    const fetchImpl = vi.fn();
    const result = await synthesizeAdviceAudio('nope', { env: SAMPLE_ENV, fetchImpl });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('UNKNOWN_ADVICE');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('genera y reutiliza audio', async () => {
    const cache = new ProcessAudioCache();
    const fetchImpl = vi.fn(async () => mpegResponse(16));
    const quota = new MemoryVoiceQuotaStore();
    const first = await synthesizeAdviceAudio(KNOWN_ID, {
      env: SAMPLE_ENV,
      fetchImpl,
      cache,
      quota,
    });
    const second = await synthesizeAdviceAudio(KNOWN_ID, {
      env: SAMPLE_ENV,
      fetchImpl,
      cache,
      quota,
    });
    expect(first.ok && first.cacheHit).toBe(false);
    expect(second.ok && second.cacheHit).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    if (first.ok) {
      expect(first.mimeType).toBe('audio/mpeg');
      expect(first.audioBase64.length).toBeGreaterThan(0);
    }
  });

  it('invalida caché si cambia la voz', async () => {
    const cache = new ProcessAudioCache();
    const fetchImpl = vi.fn(async () => mpegResponse(8));
    const quota = new MemoryVoiceQuotaStore();
    await synthesizeAdviceAudio(KNOWN_ID, { env: SAMPLE_ENV, fetchImpl, cache, quota });
    await synthesizeAdviceAudio(KNOWN_ID, {
      env: { ...SAMPLE_ENV, ELEVENLABS_VOICE_ID: 'otra' },
      fetchImpl,
      cache,
      quota,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

describe('requestAdviceAudio', () => {
  it('bloquea ids no catalogados antes del runner', async () => {
    const run = vi.fn();
    const result = await requestAdviceAudio(run, 'libre');
    expect(result.ok).toBe(false);
    expect(run).not.toHaveBeenCalled();
  });
});

describe('imports de Convex', () => {
  it('la action no importa desde fuera de convex/', () => {
    const source = readFileSync(resolve(process.cwd(), 'convex/voice.ts'), 'utf8');
    expect(source.includes('../src/')).toBe(false);
    expect(source.includes("from './lib/voice/synthesizeAdvice'")).toBe(true);
  });

  it('el catálogo de src/voice es un reexporto del módulo de Convex', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/voice/adviceCatalog.ts'), 'utf8');
    expect(source.includes("from '../../convex/lib/voice/adviceCatalog'")).toBe(true);
    expect(source.includes('VOICE_ADVICE_CATALOG = {')).toBe(false);
  });
});
