/** Caché en memoria del proceso. Se pierde al reiniciar el isolate. */

export const MAX_CACHE_ENTRIES = 64;
export const MAX_AUDIO_BYTES = 1_500_000;

export function buildAudioCacheKey(parts: {
  adviceId: string;
  textFingerprint: string;
  voiceId: string;
  modelId: string;
}): string {
  return [parts.adviceId, parts.textFingerprint, parts.voiceId, parts.modelId].join('|');
}

export class ProcessAudioCache {
  private readonly entries = new Map<string, ArrayBuffer>();
  private readonly inflight = new Map<string, Promise<ArrayBuffer>>();

  constructor(private readonly maxEntries = MAX_CACHE_ENTRIES) {}

  get(key: string): ArrayBuffer | undefined {
    const hit = this.entries.get(key);
    if (!hit) {
      return undefined;
    }
    this.entries.delete(key);
    this.entries.set(key, hit);
    return hit;
  }

  set(key: string, audio: ArrayBuffer): void {
    if (this.entries.has(key)) {
      this.entries.delete(key);
    }
    this.entries.set(key, audio);
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) {
        break;
      }
      this.entries.delete(oldest);
    }
  }

  async getOrCreate(
    key: string,
    factory: () => Promise<ArrayBuffer>,
  ): Promise<{
    audio: ArrayBuffer;
    cacheHit: boolean;
  }> {
    const existing = this.get(key);
    if (existing) {
      return { audio: existing, cacheHit: true };
    }

    const pending = this.inflight.get(key);
    if (pending) {
      return { audio: await pending, cacheHit: true };
    }

    const created = factory().then((audio) => {
      this.set(key, audio);
      return audio;
    });
    this.inflight.set(key, created);
    try {
      const audio = await created;
      return { audio, cacheHit: false };
    } finally {
      this.inflight.delete(key);
    }
  }

  size(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
    this.inflight.clear();
  }
}

export const processAudioCache = new ProcessAudioCache();
