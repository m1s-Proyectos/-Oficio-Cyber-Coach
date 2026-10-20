import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AdviceNarrationController,
  type BrowserAudio,
  type NarrationHost,
} from '../voice/adviceNarration';
import { resolveFeedbackAdviceId } from '../voice/resolveFeedbackAdvice';
import type { SynthesizeAdviceResult } from '../voice/synthesizeAdvice';

const SAMPLE_MPEG = btoa('ID3fake-mpeg');

function okResult(adviceId: string): SynthesizeAdviceResult {
  return {
    ok: true,
    adviceId,
    mimeType: 'audio/mpeg',
    audioBase64: SAMPLE_MPEG,
    cacheHit: false,
  };
}

function createHost(fetchAdvice: NarrationHost['fetchAdvice'], playImpl?: () => Promise<void>) {
  const revoked: string[] = [];
  const players: BrowserAudio[] = [];
  const host: NarrationHost = {
    fetchAdvice,
    createObjectUrl: () => 'blob:advice',
    revokeObjectUrl: (url) => {
      revoked.push(url);
    },
    createAudio: () => {
      const player: BrowserAudio = {
        currentTime: 0,
        onended: null,
        pause: vi.fn(),
        play: vi.fn(playImpl ?? (() => Promise.resolve())),
      };
      players.push(player);
      return player;
    },
  };
  return { host, revoked, players };
}

describe('resolveFeedbackAdviceId', () => {
  it('vincula la opción OTP al consejo del catálogo', () => {
    expect(resolveFeedbackAdviceId('codigo-verificacion', 'dictate')).toBe(
      'codigo-verificacion:otp-request',
    );
  });

  it('mapea consejos de A y B sin cruzar slugs', () => {
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'send-200')).toBe(
      'whatsapp-familiar:emotional-pressure',
    );
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'open-thread')).toBe(
      'whatsapp-familiar:urgency',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'open-lumina')).toBe('tienda-iphone:low-price');
    expect(resolveFeedbackAdviceId('tienda-iphone', 'open-search')).toBe('tienda-iphone:low-price');
    expect(resolveFeedbackAdviceId('tienda-iphone', 'send-200')).toBeNull();
  });

  it('no inventa un id si la opción está excluida', () => {
    expect(resolveFeedbackAdviceId('codigo-verificacion', 'answer-call')).toBe(
      'codigo-verificacion:unexpected-call',
    );
  });

  it('no usa el catálogo de otro slug', () => {
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'dictate')).toBeNull();
  });
});

describe('AdviceNarrationController', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('no pide síntesis si la clave de opción es desconocida', async () => {
    const fetchAdvice = vi.fn();
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice(resolveFeedbackAdviceId('whatsapp-familiar', 'no-existe'));
    await Promise.resolve();
    expect(fetchAdvice).not.toHaveBeenCalled();
  });

  it('no pide síntesis si no hay adviceId', async () => {
    const fetchAdvice = vi.fn();
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice(null);
    await Promise.resolve();
    expect(fetchAdvice).not.toHaveBeenCalled();
  });

  it('setAdvice no pide audio hasta reproducir', async () => {
    const fetchAdvice = vi.fn(async () => okResult('codigo-verificacion:otp-request'));
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    await Promise.resolve();
    expect(fetchAdvice).not.toHaveBeenCalled();
    expect(controller.snapshot().status).toBe('idle');
  });

  it('un solo fetch ante play y replay del mismo id en vuelo', async () => {
    let finish!: (value: SynthesizeAdviceResult) => void;
    const fetchAdvice = vi.fn(
      () =>
        new Promise<SynthesizeAdviceResult>((resolve) => {
          finish = resolve;
        }),
    );
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    controller.replay();
    expect(fetchAdvice).toHaveBeenCalledTimes(1);
    finish(okResult('codigo-verificacion:otp-request'));
    await Promise.resolve();
    await Promise.resolve();
  });

  it('reproduce, pausa y repite sin lanzar', async () => {
    const { host, players } = createHost(async () => okResult('codigo-verificacion:otp-request'));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.pause();
    expect(controller.snapshot().status).toBe('paused');
    expect(players[0]?.pause).toHaveBeenCalled();
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.replay();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    expect(players[0]?.currentTime).toBe(0);
  });

  it('silenciar detiene el audio', async () => {
    const { host, players } = createHost(async () => okResult('codigo-verificacion:otp-request'));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.setMuted(true);
    expect(players[0]?.pause).toHaveBeenCalled();
    expect(controller.snapshot().muted).toBe(true);
  });

  it('una respuesta antigua no se reproduce tras cambiar de consejo', async () => {
    const resolvers: Array<(value: SynthesizeAdviceResult) => void> = [];
    const fetchAdvice = vi.fn(
      () =>
        new Promise<SynthesizeAdviceResult>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const { host, players } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    controller.setAdvice('codigo-verificacion:money-panic');
    resolvers[0]?.(okResult('codigo-verificacion:otp-request'));
    await Promise.resolve();
    await Promise.resolve();
    expect(players.length).toBe(0);
    controller.play();
    resolvers[1]?.(okResult('codigo-verificacion:money-panic'));
    await vi.waitFor(() => {
      expect(players.length).toBe(1);
    });
  });

  it('DISABLED y RATE_LIMITED no lanzan y dejan unavailable', async () => {
    for (const code of ['DISABLED', 'RATE_LIMITED'] as const) {
      const { host } = createHost(async () => ({
        ok: false,
        code,
        message: 'La voz no se reproduce. El texto sigue disponible.',
      }));
      const controller = new AdviceNarrationController(host, () => undefined);
      controller.setAdvice('codigo-verificacion:otp-request');
      controller.play();
      await vi.waitFor(() => {
        expect(controller.snapshot().status).toBe('unavailable');
      });
    }
  });

  it('un fallo de Convex no lanza y deja el estado unavailable', async () => {
    const { host } = createHost(async () => ({
      ok: false,
      code: 'MISSING_CONFIG',
      message: 'Falta configuración de voz en el servidor.',
    }));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('unavailable');
    });
    expect(controller.snapshot().message).toContain('configuración');
  });

  it('un rechazo de red no deja la narración cargando', async () => {
    const { host } = createHost(async () => {
      throw new Error('network failure');
    });
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('unavailable');
    });
    expect(controller.snapshot().message).toContain('texto sigue disponible');
  });

  it('audio.play rechazado pasa a blocked y replay reintenta', async () => {
    let allowPlay = false;
    const { host, players } = createHost(
      async () => okResult('codigo-verificacion:otp-request'),
      () => (allowPlay ? Promise.resolve() : Promise.reject(new Error('NotAllowedError'))),
    );
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('blocked');
    });
    allowPlay = true;
    controller.replay();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    expect(players.length).toBeGreaterThan(1);
  });

  it('audio vacío no lanza', async () => {
    const { host } = createHost(async () => ({
      ok: true,
      adviceId: 'codigo-verificacion:otp-request',
      mimeType: 'audio/mpeg',
      audioBase64: '',
      cacheHit: false,
    }));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('unavailable');
    });
  });

  it('dispose revoca URLs y limpia al cambiar de consejo', async () => {
    const { host, revoked } = createHost(async () => okResult('codigo-verificacion:otp-request'));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.setAdvice(null);
    expect(controller.snapshot().status).toBe('idle');
    controller.dispose();
    expect(revoked).toEqual(['blob:advice']);
  });

  it('reutiliza la caché de sesión sin segundo fetch', async () => {
    const fetchAdvice = vi.fn(async () => okResult('codigo-verificacion:otp-request'));
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.setAdvice(null);
    controller.setAdvice('codigo-verificacion:otp-request');
    expect(controller.snapshot().status).toBe('ready');
    controller.play();
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    expect(fetchAdvice).toHaveBeenCalledTimes(1);
  });
});
