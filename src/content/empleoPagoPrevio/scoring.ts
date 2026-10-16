import { pts, ZERO_POINTS, type OptionScore } from '../rubricPoints';

/** Rúbrica oficial C (hitos únicos, Fase 05). Recovery acotada en grafo corto. */
export const EMPLEO_OPTION_SCORES: Readonly<Record<string, OptionScore>> = {
  'open-offer': { points: pts(8, 0, 0, 0), milestoneId: 'spot-domain' },
  'leave-unread': { points: pts(8, 0, 20, 0), milestoneId: 'refuse-unread' },
  'mark-salary': { points: pts(5, 0, 0, 0), milestoneId: 'spot-high-salary' },
  'mark-fee': { points: pts(12, 0, 0, 0), milestoneId: 'spot-advance-fee' },
  'mark-video': { points: ZERO_POINTS },
  'now-see-fee': { points: pts(12, 0, 0, 5), milestoneId: 'spot-advance-fee' },
  'research-firm': { points: pts(0, 15, 0, 0), milestoneId: 'research-employer' },
  'refuse-pay': { points: pts(0, 5, 20, 0), milestoneId: 'refuse-fee' },
  'refuse-after-research': { points: pts(0, 5, 20, 0), milestoneId: 'refuse-fee' },
  'pay-35': { points: ZERO_POINTS },
  'pay-after-distract': { points: ZERO_POINTS },
  'pay-after-check': { points: ZERO_POINTS },
  'pay-after-research': { points: ZERO_POINTS },
};

export function scoreForEmpleoOption(optionId: string): OptionScore {
  return EMPLEO_OPTION_SCORES[optionId] ?? { points: ZERO_POINTS };
}
