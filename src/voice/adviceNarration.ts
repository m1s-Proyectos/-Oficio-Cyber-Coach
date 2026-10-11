import { requestAdviceAudio } from './requestAdviceAudio';
import type { SynthesizeAdviceResult } from './synthesizeAdvice';

export type NarrationStatus =
  'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'blocked' | 'unavailable';

export type NarrationSnapshot = {
  status: NarrationStatus;
  muted: boolean;
  adviceId: string | null;
  message: string | null;
};

export type BrowserAudio = {
  pause: () => void;
  play: () => Promise<void>;
  currentTime: number;
  onended: (() => void) | null;
};

export type NarrationHost = {
  fetchAdvice: (args: { adviceId: string }) => Promise<SynthesizeAdviceResult>;
  createAudio: (src: string) => BrowserAudio;
  createObjectUrl: (data: Blob) => string;
  revokeObjectUrl: (url: string) => void;
};

function bytesFromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export class AdviceNarrationController {
  private epoch = 0;
  private muted = false;
  private status: NarrationStatus = 'idle';
  private adviceId: string | null = null;
  private message: string | null = null;
  private audio: BrowserAudio | null = null;
  private objectUrl: string | null = null;
  private readonly cache = new Map<string, string>();
  private inFlightKey: string | null = null;

  constructor(
    private readonly host: NarrationHost,
    private readonly notify: () => void,
  ) {}

  snapshot(): NarrationSnapshot {
    return {
      status: this.status,
      muted: this.muted,
      adviceId: this.adviceId,
      message: this.message,
    };
  }

  setAdvice(adviceId: string | null): void {
    this.epoch += 1;
    this.stopPlayback();
    this.adviceId = adviceId;
    this.message = null;
    this.status = 'idle';
    this.inFlightKey = null;
    if (adviceId && this.cache.has(adviceId)) {
      this.objectUrl = this.cache.get(adviceId) ?? null;
      this.status = 'ready';
    }
    this.notify();
  }

  play(): void {
    if (this.muted || !this.adviceId) {
      return;
    }
    if (this.status === 'paused' && this.audio) {
      this.resumeCurrent(this.epoch);
      return;
    }
    void this.ensureAudio(this.epoch, true);
  }

  pause(): void {
    if (!this.audio || this.status !== 'playing') {
      return;
    }
    this.audio.pause();
    this.status = 'paused';
    this.notify();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stopPlayback();
      if (this.status === 'playing' || this.status === 'blocked') {
        this.status = 'ready';
      }
      this.notify();
      return;
    }
    this.notify();
  }

  replay(): void {
    if (this.muted || !this.adviceId) {
      return;
    }
    if (this.audio) {
      this.audio.currentTime = 0;
    }
    void this.ensureAudio(this.epoch, true);
  }

  dispose(): void {
    this.epoch += 1;
    this.stopPlayback();
    this.inFlightKey = null;
    for (const url of this.cache.values()) {
      this.host.revokeObjectUrl(url);
    }
    this.cache.clear();
    this.objectUrl = null;
    this.adviceId = null;
    this.status = 'idle';
  }

  private async ensureAudio(epoch: number, autoplay: boolean): Promise<void> {
    const adviceId = this.adviceId;
    if (!adviceId || this.muted || epoch !== this.epoch) {
      return;
    }

    const cached = this.cache.get(adviceId);
    if (cached) {
      this.objectUrl = cached;
      this.status = 'ready';
      this.message = null;
      this.notify();
      if (autoplay) {
        this.playCurrent(epoch);
      }
      return;
    }

    const flightKey = `${epoch}:${adviceId}`;
    if (this.inFlightKey === flightKey) {
      return;
    }
    this.inFlightKey = flightKey;
    this.status = 'loading';
    this.message = null;
    this.notify();

    let result: SynthesizeAdviceResult;
    try {
      result = await requestAdviceAudio(this.host.fetchAdvice, adviceId);
    } catch {
      if (epoch !== this.epoch || this.adviceId !== adviceId) {
        return;
      }
      this.inFlightKey = null;
      this.status = 'unavailable';
      this.message = 'No se pudo contactar el servicio de voz. El texto sigue disponible.';
      this.notify();
      return;
    }
    if (epoch !== this.epoch || this.adviceId !== adviceId) {
      return;
    }
    this.inFlightKey = null;

    if (!result.ok || !result.audioBase64 || result.mimeType !== 'audio/mpeg') {
      this.status = 'unavailable';
      this.message = result.ok
        ? 'El audio no está disponible.'
        : result.message || 'El audio no está disponible.';
      this.notify();
      return;
    }

    try {
      const bytes = bytesFromBase64(result.audioBase64);
      if (bytes.byteLength === 0) {
        this.status = 'unavailable';
        this.message = 'El audio no está disponible.';
        this.notify();
        return;
      }
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const blob = new Blob([copy], { type: 'audio/mpeg' });
      const url = this.host.createObjectUrl(blob);
      this.cache.set(adviceId, url);
      this.objectUrl = url;
      this.status = 'ready';
      this.message = null;
      this.notify();
      if (autoplay && epoch === this.epoch && !this.muted) {
        this.playCurrent(epoch);
      }
    } catch {
      this.status = 'unavailable';
      this.message = 'El audio no está disponible.';
      this.notify();
    }
  }

  private playCurrent(epoch: number): void {
    if (this.muted || epoch !== this.epoch || !this.objectUrl) {
      return;
    }
    this.stopPlayback();
    const element = this.host.createAudio(this.objectUrl);
    this.audio = element;
    this.bindPlayback(element, epoch);
  }

  private resumeCurrent(epoch: number): void {
    if (this.muted || epoch !== this.epoch || !this.audio) {
      return;
    }
    this.bindPlayback(this.audio, epoch);
  }

  private bindPlayback(element: BrowserAudio, epoch: number): void {
    element.onended = () => {
      if (epoch !== this.epoch) {
        return;
      }
      this.status = 'ready';
      this.notify();
    };
    const attempt = element.play();
    void attempt.then(
      () => {
        if (epoch !== this.epoch) {
          element.pause();
          return;
        }
        this.status = 'playing';
        this.message = null;
        this.notify();
      },
      () => {
        if (epoch !== this.epoch) {
          return;
        }
        this.status = 'blocked';
        this.message = 'El navegador pide una pulsación para oír el consejo.';
        this.notify();
      },
    );
  }

  private stopPlayback(): void {
    if (this.audio) {
      this.audio.onended = null;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}
