import { pts, ZERO_POINTS, type OptionScore } from '../rubricPoints';

/** Rúbrica oficial D (hitos únicos, Fase 05). */
export const CODIGO_OPTION_SCORES: Readonly<Record<string, OptionScore>> = {
  'answer-call': { points: pts(8, 0, 0, 0), milestoneId: 'spot-unexpected' },
  'decline-call': { points: pts(8, 0, 5, 0), milestoneId: 'spot-unexpected' },
  'hang-up': { points: pts(7, 0, 10, 0), milestoneId: 'refuse-otp' },
  'call-official': { points: pts(0, 20, 10, 15), milestoneId: 'official-channel' },
  'call-official-from-sms': { points: pts(0, 20, 10, 0), milestoneId: 'official-channel' },
  dictate: { points: ZERO_POINTS },
  'share-pro': { points: ZERO_POINTS },
  'dictate-from-sms': { points: ZERO_POINTS },
  'callback-same': { points: ZERO_POINTS },
};

export function scoreForCodigoOption(optionId: string): OptionScore {
  return CODIGO_OPTION_SCORES[optionId] ?? { points: ZERO_POINTS };
}
