import type { Feedback } from '../engine';
import { VOICE_ADVICE_CATALOG, VOICE_ADVICE_IDS, type VoiceAdviceId } from './adviceCatalog';

/**
 * Solo empareja si el texto del recuadro coincide exactamente con un consejo
 * del catálogo de ese slug. Si no hay una coincidencia única, no hay audio.
 */
export function resolveFeedbackAdviceId(
  scenarioSlug: string,
  feedback: Feedback,
): VoiceAdviceId | null {
  const prefix = `${scenarioSlug}:`;
  const matches = VOICE_ADVICE_IDS.filter((id) => {
    if (!id.startsWith(prefix)) {
      return false;
    }
    const text = VOICE_ADVICE_CATALOG[id];
    return text === feedback.recommendation || text === feedback.explanation;
  });
  return matches.length === 1 ? (matches[0] ?? null) : null;
}
