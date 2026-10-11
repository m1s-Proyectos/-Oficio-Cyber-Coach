import { afterEach, describe, expect, it, vi } from 'vitest';
import { VOICE_ADVICE_CATALOG } from '../voice/adviceCatalog';
import {
  AdviceNarrationController,
  type BrowserAudio,
  type NarrationHost,
} from '../voice/adviceNarration';
import { resolveFeedbackAdviceId } from '../voice/resolveFeedbackAdvice';
import type { SynthesizeAdviceResult } from '../voice/synthesizeAdvice';

const OTP_TEXT = VOICE_ADVICE_CATALOG['codigo-verificacion:otp-request'];
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
  it('vincula el feedback cuyo texto es el consejo del catálogo', () => {
    expect(
      resolveFeedbackAdviceId('codigo-verificacion', {
        explanation: 'Cualquier explicación de la opción',
        recommendation: OTP_TEXT,
      }),
    ).toBe('codigo-verificacion:otp-request');
  });

  it('no inventa un id si el recuadro no coincide', () => {
    expect(
      resolveFeedbackAdviceId('codigo-verificacion', {
        explanation: 'Contestar no obliga a dar el código.',
        recommendation: 'Si piden un SMS, cuelga.',
      }),
    ).toBeNull();
  });

  it('no usa el catálogo de otro slug', () => {
    expect(
      resolveFeedbackAdviceId('whatsapp-familiar', {
        explanation: OTP_TEXT,
        recommendation: OTP_TEXT,
      }),
    ).toBeNull();
  });
});

describe('AdviceNarrationController', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('no pide síntesis si no hay adviceId', async () => {
    const fetchAdvice = vi.fn();
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice(null);
    await Promise.resolve();
    expect(fetchAdvice).not.toHaveBeenCalled();
  });

  it('un solo fetch ante setAdvice repetido del mismo id en vuelo', async () => {
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
    controller.replay();
    expect(fetchAdvice).toHaveBeenCalledTimes(1);
    finish(okResult('codigo-verificacion:otp-request'));
    await Promise.resolve();
    await Promise.resolve();
  });

  it('silenciar detiene el audio', async () => {
    const { host, players } = createHost(async () => okResult('codigo-verificacion:otp-request'));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
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
    controller.setAdvice('codigo-verificacion:money-panic');
    resolvers[0]?.(okResult('codigo-verificacion:otp-request'));
    await Promise.resolve();
    await Promise.resolve();
    expect(players.length).toBe(0);
    resolvers[1]?.(okResult('codigo-verificacion:money-panic'));
    await vi.waitFor(() => {
      expect(players.length).toBe(1);
    });
  });

  it('un fallo de Convex no lanza y deja el estado unavailable', async () => {
    const { host } = createHost(async () => ({
      ok: false,
      code: 'MISSING_CONFIG',
      message: 'Falta configuración de voz en el servidor.',
    }));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('unavailable');
    });
    expect(controller.snapshot().message).toContain('configuración');
  });

  it('audio.play rechazado pasa a blocked y replay reintenta', async () => {
    let allowPlay = false;
    const { host, players } = createHost(
      async () => okResult('codigo-verificacion:otp-request'),
      () => (allowPlay ? Promise.resolve() : Promise.reject(new Error('NotAllowedError'))),
    );
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
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
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('unavailable');
    });
  });

  it('dispose revoca URLs', async () => {
    const { host, revoked } = createHost(async () => okResult('codigo-verificacion:otp-request'));
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.dispose();
    expect(revoked).toContain('blob:advice');
  });

  it('reutiliza la caché de sesión sin segundo fetch', async () => {
    const fetchAdvice = vi.fn(async () => okResult('codigo-verificacion:otp-request'));
    const { host } = createHost(fetchAdvice);
    const controller = new AdviceNarrationController(host, () => undefined);
    controller.setAdvice('codigo-verificacion:otp-request');
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    controller.setAdvice(null);
    controller.setAdvice('codigo-verificacion:otp-request');
    await vi.waitFor(() => {
      expect(controller.snapshot().status).toBe('playing');
    });
    expect(fetchAdvice).toHaveBeenCalledTimes(1);
  });
});
