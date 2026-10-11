import { MAX_AUDIO_BYTES } from './audioCache';

export const TTS_TIMEOUT_MS = 12_000;

export type VoiceProviderConfig = {
  apiKey: string;
  voiceId: string;
  modelId: string;
};

export type ProviderFailure = {
  code: 'PROVIDER_ERROR' | 'TIMEOUT' | 'EMPTY_AUDIO' | 'TOO_LARGE' | 'MISSING_CONFIG';
  message: string;
};

export function sanitizeProviderMessage(raw: string): string {
  return raw
    .replace(/sk_[A-Za-z0-9]+/g, '[redacted]')
    .replace(/xi-api-key\s*[:=]\s*\S+/gi, 'xi-api-key:[redacted]')
    .replace(/authorization\s*[:=]\s*\S+/gi, 'authorization:[redacted]')
    .slice(0, 180);
}

export function readVoiceProviderConfig(
  env: Record<string, string | undefined>,
): VoiceProviderConfig | { error: ProviderFailure } {
  const apiKey = env.ELEVENLABS_API_KEY?.trim() ?? '';
  const voiceId = env.ELEVENLABS_VOICE_ID?.trim() ?? '';
  const modelId = env.ELEVENLABS_MODEL_ID?.trim() ?? '';
  if (!apiKey || !voiceId || !modelId) {
    return {
      error: {
        code: 'MISSING_CONFIG',
        message: 'Falta configuración de voz en el servidor.',
      },
    };
  }
  return { apiKey, voiceId, modelId };
}

export async function requestElevenLabsMpeg(
  config: VoiceProviderConfig,
  text: string,
  fetchImpl: typeof fetch,
  timeoutMs = TTS_TIMEOUT_MS,
): Promise<{ audio: ArrayBuffer } | { error: ProviderFailure }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(config.voiceId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': config.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: config.modelId,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      await response.text().catch(() => '');
      return {
        error: {
          code: 'PROVIDER_ERROR',
          message: `El proveedor de voz no generó audio (${response.status}).`,
        },
      };
    }

    const audio = await response.arrayBuffer();
    if (audio.byteLength === 0) {
      return { error: { code: 'EMPTY_AUDIO', message: 'El proveedor devolvió audio vacío.' } };
    }
    if (audio.byteLength > MAX_AUDIO_BYTES) {
      return { error: { code: 'TOO_LARGE', message: 'El audio supera el límite permitido.' } };
    }
    return { audio };
  } catch (error) {
    const aborted =
      (error instanceof Error && error.name === 'AbortError') ||
      (typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'AbortError');
    if (aborted) {
      return {
        error: { code: 'TIMEOUT', message: 'La generación de voz superó el tiempo de espera.' },
      };
    }
    return {
      error: { code: 'PROVIDER_ERROR', message: 'No se pudo contactar al proveedor de voz.' },
    };
  } finally {
    clearTimeout(timer);
  }
}
