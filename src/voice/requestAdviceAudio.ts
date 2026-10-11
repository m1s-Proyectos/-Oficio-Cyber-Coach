import { isVoiceAdviceId } from './adviceCatalog';
import type { SynthesizeAdviceResult } from './synthesizeAdvice';

/**
 * Acceso tipado para fases posteriores. No reproduce audio ni toca la UI.
 */
export async function requestAdviceAudio(
  run: (args: { adviceId: string }) => Promise<SynthesizeAdviceResult>,
  adviceId: string,
): Promise<SynthesizeAdviceResult> {
  if (!isVoiceAdviceId(adviceId)) {
    return { ok: false, code: 'UNKNOWN_ADVICE', message: 'Consejo no autorizado.' };
  }
  return await run({ adviceId });
}
