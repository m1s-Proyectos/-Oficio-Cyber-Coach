import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { VOICE_ADVICE_IDS } from '../voice/adviceCatalog';
import { ProcessAudioCache } from '../voice/audioCache';
import { synthesizeAdviceAudio } from '../voice/synthesizeAdvice';
import { DocumentQuotaLedger, MemoryVoiceQuotaStore } from '../../convex/lib/voice/voiceQuotaStore';
import {
  HOUR_MS,
  VOICE_DAY_LIMIT,
  VOICE_HOUR_LIMIT,
  VOICE_LEASE_MS,
  VOICE_MAX_INFLIGHT,
  applyRelease,
  applyReserve,
  dayWindowStart,
  emptyVoiceQuotaState,
  hourWindowStart,
  pickQuotaRows,
} from '../../convex/lib/voice/voiceLimits';

const ENABLED_ENV = {
  VOICE_ENABLED: 'true',
  ELEVENLABS_API_KEY: 'sk_test_not_real',
  ELEVENLABS_VOICE_ID: 'voice_test',
  ELEVENLABS_MODEL_ID: 'model_test',
};

const KNOWN_ID = 'codigo-verificacion:otp-request';
const OTHER_IDS = VOICE_ADVICE_IDS.filter((id) => id !== KNOWN_ID);

function mpegResponse(bytes = 16): Response {
  return new Response(new Uint8Array(bytes).buffer, {
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}

describe('interruptor VOICE_ENABLED', () => {
  it('permanece deshabilitado por defecto', async () => {
    const fetchImpl = vi.fn();
    const quota = new MemoryVoiceQuotaStore();
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: {
        ELEVENLABS_API_KEY: 'sk_test_not_real',
        ELEVENLABS_VOICE_ID: 'voice_test',
        ELEVENLABS_MODEL_ID: 'model_test',
      },
      fetchImpl,
      quota,
      cache: new ProcessAudioCache(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('DISABLED');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(quota.snapshot().hourCount).toBe(0);
  });

  it('VOICE_ENABLED=1 u otro valor no habilita el proveedor', async () => {
    const fetchImpl = vi.fn();
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: { ...ENABLED_ENV, VOICE_ENABLED: '1' },
      fetchImpl,
      quota: new MemoryVoiceQuotaStore(),
      cache: new ProcessAudioCache(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('DISABLED');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('catálogo cerrado', () => {
  it('un consejo desconocido no provoca peticiones externas', async () => {
    const fetchImpl = vi.fn();
    const quota = new MemoryVoiceQuotaStore();
    const result = await synthesizeAdviceAudio('inventado:x', {
      env: ENABLED_ENV,
      fetchImpl,
      quota,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('UNKNOWN_ADVICE');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(quota.snapshot().hourCount).toBe(0);
  });

  it('rechaza texto libre y URLs como adviceId', async () => {
    const fetchImpl = vi.fn();
    for (const adviceId of [
      'https://ejemplo.test/audio',
      'Dime este texto largo para narrar',
      'whatsapp-familiar:otp-request',
    ]) {
      const result = await synthesizeAdviceAudio(adviceId, {
        env: ENABLED_ENV,
        fetchImpl,
        quota: new MemoryVoiceQuotaStore(),
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe('UNKNOWN_ADVICE');
      }
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('cuotas de síntesis real', () => {
  it('una petición válida bajo el límite continúa si la voz está habilitada', async () => {
    const fetchImpl = vi.fn(async () => mpegResponse());
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota: new MemoryVoiceQuotaStore(),
      cache: new ProcessAudioCache(),
    });
    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('las respuestas desde caché no consumen cuota', async () => {
    const fetchImpl = vi.fn(async () => mpegResponse());
    const quota = new MemoryVoiceQuotaStore();
    const cache = new ProcessAudioCache();
    const first = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota,
      cache,
    });
    const second = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota,
      cache,
    });
    expect(first.ok && first.cacheHit).toBe(false);
    expect(second.ok && second.cacheHit).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(quota.snapshot().hourCount).toBe(1);
    expect(quota.snapshot().dayCount).toBe(1);
  });

  it('el último cupo horario no se reserva dos veces en paralelo', async () => {
    const fetchImpl = vi.fn(async () => mpegResponse());
    const quota = new MemoryVoiceQuotaStore();
    const now = 1_700_000_000_000;
    for (let index = 0; index < VOICE_HOUR_LIMIT - 1; index += 1) {
      const filled = await synthesizeAdviceAudio(VOICE_ADVICE_IDS[index] ?? KNOWN_ID, {
        env: ENABLED_ENV,
        fetchImpl,
        quota,
        cache: new ProcessAudioCache(),
        now,
      });
      expect(filled.ok).toBe(true);
    }
    const racing = [KNOWN_ID, OTHER_IDS[0] ?? KNOWN_ID];
    const results = await Promise.all(
      racing.map((adviceId) =>
        synthesizeAdviceAudio(adviceId, {
          env: ENABLED_ENV,
          fetchImpl,
          quota,
          cache: new ProcessAudioCache(),
          now,
        }),
      ),
    );
    expect(results.filter((item) => item.ok)).toHaveLength(1);
    expect(results.filter((item) => !item.ok && item.code === 'RATE_LIMITED')).toHaveLength(1);
    expect(fetchImpl).toHaveBeenCalledTimes(VOICE_HOUR_LIMIT);
    expect(quota.snapshot().hourCount).toBe(VOICE_HOUR_LIMIT);
  });

  it('el límite diario persiste entre instancias simuladas', async () => {
    const fetchImpl = vi.fn(async () => mpegResponse());
    const firstStore = new MemoryVoiceQuotaStore();
    const now = HOUR_MS * 24 + 60_000;
    for (let index = 0; index < VOICE_DAY_LIMIT; index += 1) {
      const adviceId = VOICE_ADVICE_IDS[index % VOICE_ADVICE_IDS.length] ?? KNOWN_ID;
      const result = await synthesizeAdviceAudio(adviceId, {
        env: ENABLED_ENV,
        fetchImpl,
        quota: firstStore,
        cache: new ProcessAudioCache(),
        now: now + Math.floor(index / VOICE_HOUR_LIMIT) * HOUR_MS,
      });
      expect(result.ok).toBe(true);
    }
    const restarted = new MemoryVoiceQuotaStore(firstStore.snapshot());
    const blocked = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota: restarted,
      cache: new ProcessAudioCache(),
      now,
    });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.code).toBe('RATE_LIMITED');
    }
    expect(fetchImpl).toHaveBeenCalledTimes(VOICE_DAY_LIMIT);
  });

  it('nunca hay más de dos llamadas simultáneas al proveedor', async () => {
    let active = 0;
    let peak = 0;
    const fetchImpl = vi.fn(async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => {
        setTimeout(resolve, 40);
      });
      active -= 1;
      return mpegResponse();
    });
    const quota = new MemoryVoiceQuotaStore();
    const now = 1_700_000_000_000;
    const results = await Promise.all(
      [KNOWN_ID, OTHER_IDS[0] ?? KNOWN_ID, OTHER_IDS[1] ?? KNOWN_ID].map((adviceId) =>
        synthesizeAdviceAudio(adviceId, {
          env: ENABLED_ENV,
          fetchImpl,
          quota,
          cache: new ProcessAudioCache(),
          now,
        }),
      ),
    );
    expect(peak).toBeLessThanOrEqual(2);
    expect(results.filter((item) => item.ok)).toHaveLength(2);
    expect(results.some((item) => !item.ok && item.code === 'RATE_LIMITED')).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('errores y timeouts liberan los permisos de concurrencia', async () => {
    const failing = vi.fn(async () => new Response('xi-api-key: sk_abc123', { status: 500 }));
    const quota = new MemoryVoiceQuotaStore();
    const now = 1_700_000_000_000;
    const failed = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl: failing,
      quota,
      cache: new ProcessAudioCache(),
      now,
    });
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.code).toBe('PROVIDER_ERROR');
      expect(failed.message.includes('sk_')).toBe(false);
      expect(failed.message.toLowerCase().includes('xi-api-key')).toBe(false);
    }
    expect(quota.snapshot().leases).toHaveLength(0);

    const aborting = vi.fn(async (_url: string, init?: RequestInit) => {
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const error = new Error('aborted');
          error.name = 'AbortError';
          reject(error);
        });
      });
    });
    const timed = await synthesizeAdviceAudio(OTHER_IDS[0] ?? KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl: aborting as unknown as typeof fetch,
      quota,
      cache: new ProcessAudioCache(),
      timeoutMs: 5,
      now,
    });
    expect(timed.ok).toBe(false);
    if (!timed.ok) {
      expect(timed.code).toBe('TIMEOUT');
    }
    expect(quota.snapshot().leases).toHaveLength(0);

    const okFetch = vi.fn(async () => mpegResponse());
    const recovered = await Promise.all(
      [0, 1].map((index) =>
        synthesizeAdviceAudio(OTHER_IDS[index + 2] ?? KNOWN_ID, {
          env: ENABLED_ENV,
          fetchImpl: okFetch,
          quota,
          cache: new ProcessAudioCache(),
          now,
        }),
      ),
    );
    expect(recovered.every((item) => item.ok)).toBe(true);
    expect(okFetch).toHaveBeenCalledTimes(2);
  });

  it('los límites agotados no producen llamadas adicionales', async () => {
    const fetchImpl = vi.fn(async () => mpegResponse());
    const quota = new MemoryVoiceQuotaStore();
    const now = 1_700_000_000_000;
    for (let index = 0; index < VOICE_HOUR_LIMIT; index += 1) {
      await synthesizeAdviceAudio(VOICE_ADVICE_IDS[index] ?? KNOWN_ID, {
        env: ENABLED_ENV,
        fetchImpl,
        quota,
        cache: new ProcessAudioCache(),
        now,
      });
    }
    const blocked = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota,
      cache: new ProcessAudioCache(),
      now,
    });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.code).toBe('RATE_LIMITED');
    }
    expect(fetchImpl).toHaveBeenCalledTimes(VOICE_HOUR_LIMIT);
  });
});

describe('inicialización del singleton', () => {
  it('crea una sola fila cuando la tabla está vacía', async () => {
    const ledger = new DocumentQuotaLedger();
    expect(ledger.rowCount()).toBe(0);
    const reserved = await ledger.reserve(1_700_000_000_000);
    expect(reserved.ok).toBe(true);
    expect(ledger.rowCount()).toBe(1);
    expect(ledger.snapshot().hourCount).toBe(1);
  });

  it('serializa dos reservas concurrentes sobre tabla vacía en una sola fila', async () => {
    const ledger = new DocumentQuotaLedger();
    const now = 1_700_000_000_000;
    const results = await Promise.all([ledger.reserve(now), ledger.reserve(now)]);
    expect(results.filter((item) => item.ok)).toHaveLength(2);
    expect(ledger.rowCount()).toBe(1);
    expect(ledger.snapshot().hourCount).toBe(2);
  });

  it('falla cerrado si detecta documentos duplicados', async () => {
    const fetchImpl = vi.fn(async () => mpegResponse());
    const ledger = new DocumentQuotaLedger();
    ledger.seedDuplicateEmptyRows();
    expect(pickQuotaRows([{ id: 'a' }, { id: 'b' }]).status).toBe('inconsistent');
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota: ledger,
      cache: new ProcessAudioCache(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('RATE_LIMITED');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(ledger.rowCount()).toBe(2);
    expect(ledger.snapshot().hourCount).toBe(0);
  });
});

describe('invariantes de límites (unidad, no OCC remoto)', () => {
  it('pickQuotaRows distingue vacío, uno e inconsistente', () => {
    expect(pickQuotaRows([]).status).toBe('empty');
    expect(pickQuotaRows([{ id: 'solo' }]).status).toBe('one');
    expect(pickQuotaRows([{ id: 'a' }, { id: 'b' }]).status).toBe('inconsistent');
  });

  it('release es idempotente y no crea filas sobre ledger vacío', async () => {
    const quota = new MemoryVoiceQuotaStore();
    const now = 1_700_000_000_000;
    const reserved = await quota.reserve(now);
    expect(reserved.ok).toBe(true);
    if (!reserved.ok) {
      return;
    }
    await quota.release(reserved.leaseId, now);
    await quota.release(reserved.leaseId, now);
    await quota.release('lease-inexistente', now);
    expect(quota.snapshot().leases).toHaveLength(0);

    const ledger = new DocumentQuotaLedger();
    expect(ledger.rowCount()).toBe(0);
    await ledger.release('nada', now);
    expect(ledger.rowCount()).toBe(0);
  });

  it('la ventana horaria UTC se reinicia sin borrar el cupo del día', () => {
    const now = hourWindowStart(HOUR_MS * 48 + 1_000);
    let state = emptyVoiceQuotaState(now);
    for (let index = 0; index < VOICE_HOUR_LIMIT; index += 1) {
      const reserved = applyReserve(state, now, `h-${index}`);
      expect(reserved.ok).toBe(true);
      state = applyRelease(reserved.state, `h-${index}`, now);
    }
    const blocked = applyReserve(state, now, 'h-extra');
    expect(blocked.ok).toBe(false);
    const nextHour = applyReserve(blocked.state, now + HOUR_MS, 'h-siguiente');
    expect(nextHour.ok).toBe(true);
    expect(nextHour.state.hourCount).toBe(1);
    expect(nextHour.state.dayCount).toBe(VOICE_HOUR_LIMIT + 1);
    expect(nextHour.state.dayWindowStart).toBe(dayWindowStart(now));
  });

  it('un fallo del almacén no llama al proveedor', async () => {
    const fetchImpl = vi.fn();
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      cache: new ProcessAudioCache(),
      quota: {
        reserve: async () => {
          throw new Error('almacén no disponible');
        },
        release: async () => undefined,
        snapshot: () => emptyVoiceQuotaState(0),
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('PROVIDER_ERROR');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('applyRelease no altera contadores hora/día', () => {
    const now = 1_700_000_000_000;
    const reserved = applyReserve(emptyVoiceQuotaState(now), now, 'lease-a');
    expect(reserved.ok).toBe(true);
    const released = applyRelease(reserved.state, 'lease-a', now);
    expect(released.hourCount).toBe(1);
    expect(released.dayCount).toBe(1);
    expect(released.leases).toHaveLength(0);
  });
});

describe('leases', () => {
  it('un lease caducado deja de ocupar concurrencia', async () => {
    const quota = new MemoryVoiceQuotaStore();
    const now = 1_700_000_000_000;
    const first = await quota.reserve(now);
    const second = await quota.reserve(now);
    const blocked = await quota.reserve(now);
    expect(first.ok && second.ok).toBe(true);
    expect(blocked.ok).toBe(false);
    expect(quota.snapshot().leases).toHaveLength(VOICE_MAX_INFLIGHT);
    const afterTtl = await quota.reserve(now + VOICE_LEASE_MS + 1);
    expect(afterTtl.ok).toBe(true);
    expect(quota.snapshot().leases).toHaveLength(1);
  });
});

describe('camino de producción', () => {
  it('sin almacén de cuota no llama al proveedor ni inventa memoria', async () => {
    const fetchImpl = vi.fn();
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      cache: new ProcessAudioCache(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('RATE_LIMITED');
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('la action no importa ni instancia MemoryVoiceQuotaStore', () => {
    const source = readFileSync(resolve(process.cwd(), 'convex/voice.ts'), 'utf8');
    expect(source.includes('MemoryVoiceQuotaStore')).toBe(false);
    expect(source.includes('convexQuotaStore(ctx)')).toBe(true);
    expect(source.includes('internal.voiceQuota.reserve')).toBe(true);
    const synth = readFileSync(
      resolve(process.cwd(), 'convex/lib/voice/synthesizeAdvice.ts'),
      'utf8',
    );
    expect(synth.includes('MemoryVoiceQuotaStore')).toBe(false);
    expect(synth.includes('deps.quota == null')).toBe(true);
  });
});

describe('superficie cliente y mapa', () => {
  it('el consejo escrito se conserva en EducationalAdvice', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/features/simulation/PreventionSession.tsx'),
      'utf8',
    );
    expect(source.includes('EducationalAdvice')).toBe(true);
    expect(source.includes('explanation={bind(lastFeedback.explanation)}')).toBe(true);
    expect(source.includes('phone-feedback')).toBe(false);
  });

  it('no filtra secretos en mensajes de error', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('Authorization: Bearer sk_secreto', { status: 401 }),
    );
    const result = await synthesizeAdviceAudio(KNOWN_ID, {
      env: ENABLED_ENV,
      fetchImpl,
      quota: new MemoryVoiceQuotaStore(),
      cache: new ProcessAudioCache(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(JSON.stringify(result).includes('sk_')).toBe(false);
      expect(JSON.stringify(result).toLowerCase().includes('bearer')).toBe(false);
    }
  });
});
