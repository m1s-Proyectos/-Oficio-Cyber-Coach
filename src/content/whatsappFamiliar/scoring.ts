import { pts, ZERO_POINTS, type OptionScore } from '../rubricPoints';

/**
 * Rúbrica oficial A (hitos únicos, Fase 05).
 * Navegación / pagos arriesgados: sin hito y 0 puntos.
 */
export const WHATSAPP_OPTION_SCORES: Readonly<Record<string, OptionScore>> = {
  'open-thread': { points: pts(8, 0, 0, 0), milestoneId: 'spot-urgency' },
  'chat-only': { points: pts(3, 0, 0, 0), milestoneId: 'spot-urgency-chat' },
  pause: { points: pts(5, 0, 3, 0), milestoneId: 'pause-think' },
  'pause-after-chat': { points: pts(5, 0, 3, 0), milestoneId: 'pause-think' },
  'pause-while-verifying': { points: pts(5, 5, 5, 0), milestoneId: 'pause-while-verifying' },
  'block-now': { points: pts(5, 0, 5, 0), milestoneId: 'block-alone-aware' },
  'block-after-chat': { points: pts(5, 0, 5, 0), milestoneId: 'block-alone-aware' },
  'block-from-pause': { points: pts(5, 0, 5, 0), milestoneId: 'block-alone-aware' },
  'verify-now': { points: pts(5, 15, 0, 0), milestoneId: 'verify-independent' },
  'verify-after-chat': { points: pts(5, 15, 0, 0), milestoneId: 'verify-independent' },
  'verify-from-pause': { points: pts(5, 15, 0, 0), milestoneId: 'verify-independent' },
  'verify-after-block': { points: pts(5, 15, 0, 0), milestoneId: 'verify-independent' },
  'verify-after-200': { points: pts(5, 15, 0, 0), milestoneId: 'verify-independent' },
  'contact-other': { points: pts(2, 10, 0, 0), milestoneId: 'confirm-other-channel' },
  'contact-other-after-pay': { points: pts(2, 10, 0, 0), milestoneId: 'confirm-other-channel' },
  'warn-and-end': { points: pts(0, 0, 25, 0), milestoneId: 'refuse-transfer' },
  'leave-paused': { points: pts(5, 0, 10, 0), milestoneId: 'abandon-pause' },
  'stay-blocked': { points: pts(5, 0, 8, 0), milestoneId: 'abandon-block' },
  'stop-after-200': { points: pts(0, 0, 5, 10), milestoneId: 'stop-second-ask' },
  'recover-while-silent': { points: pts(0, 0, 5, 10), milestoneId: 'stop-second-ask' },
  'recover-informed': { points: pts(0, 0, 0, 15), milestoneId: 'recover-steps' },
  'ack-recover': { points: pts(0, 0, 0, 15), milestoneId: 'recover-steps' },
  'ack-recover-twice': { points: pts(0, 0, 0, 5), milestoneId: 'recover-paid-twice' },
  'send-200': { points: ZERO_POINTS },
  'send-200-late': { points: ZERO_POINTS },
  'send-despite-silence': { points: ZERO_POINTS },
  'send-from-pause': { points: ZERO_POINTS },
  'send-after-block': { points: ZERO_POINTS },
  'send-150': { points: ZERO_POINTS },
  'back-to-suspect-chat': { points: ZERO_POINTS },
  'back-to-chat-after-pay': { points: ZERO_POINTS },
};

export function scoreForWhatsAppOption(optionId: string): OptionScore {
  return WHATSAPP_OPTION_SCORES[optionId] ?? { points: ZERO_POINTS };
}
