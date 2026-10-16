import { pts, ZERO_POINTS, type OptionScore } from '../rubricPoints';

/** Rúbrica oficial E (hitos únicos, Fase 05). */
export const JEFE_OPTION_SCORES: Readonly<Record<string, OptionScore>> = {
  'open-mail': { points: pts(8, 0, 0, 0), milestoneId: 'spot-personal-mail' },
  'verify-internal': { points: pts(7, 18, 0, 0), milestoneId: 'verify-corp-channel' },
  'verify-after-ask': { points: pts(7, 18, 0, 10), milestoneId: 'verify-corp-channel' },
  'follow-finance': { points: pts(0, 5, 20, 0), milestoneId: 'refuse-gift-cards' },
  'ask-less': { points: pts(3, 0, 0, 0), milestoneId: 'negotiate-under-pressure' },
  'buy-cards': { points: ZERO_POINTS },
  'buy-three': { points: ZERO_POINTS },
  'buy-anyway': { points: ZERO_POINTS },
};

export function scoreForJefeOption(optionId: string): OptionScore {
  return JEFE_OPTION_SCORES[optionId] ?? { points: ZERO_POINTS };
}
