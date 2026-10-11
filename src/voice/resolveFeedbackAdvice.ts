import { isVoiceAdviceId, type VoiceAdviceId } from './adviceCatalog';
import { OPTION_VOICE_MAP, optionVoiceKey } from './optionVoiceMap';

/**
 * Resuelve el consejo de voz por slug + option.id.
 * Claves desconocidas o valores no autorizados → null (sin síntesis).
 */
export function resolveFeedbackAdviceId(
  scenarioSlug: string,
  optionId: string,
): VoiceAdviceId | null {
  const mapped = OPTION_VOICE_MAP[optionVoiceKey(scenarioSlug, optionId)];
  if (mapped === undefined || mapped === null) {
    return null;
  }
  return isVoiceAdviceId(mapped) ? mapped : null;
}
