import { WHATSAPP_FAMILIAR_SCENARIO } from '../../content';
import {
  complete,
  createChoiceGate,
  start,
  type EngineErrorCode,
  type Feedback,
  type SessionState,
} from '../../engine';

export type ChoiceFailureReason = 'redundant' | 'invalid' | 'unexpected';

export function startWhatsAppSession(): SessionState {
  const result = start(WHATSAPP_FAMILIAR_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

export interface ApplyChoiceSuccess {
  ok: true;
  state: SessionState;
  feedback: Feedback;
  notice: null;
}

export interface ApplyChoiceFailure {
  ok: false;
  state: SessionState;
  feedback: null;
  notice: string;
  reason: ChoiceFailureReason;
}

export function classifyChoiceError(code: EngineErrorCode): ChoiceFailureReason {
  if (code === 'ALREADY_CHOSEN_ON_NODE' || code === 'SESSION_COMPLETED') {
    return 'redundant';
  }
  if (code === 'UNKNOWN_OPTION' || code === 'OPTION_NOT_IN_NODE') {
    return 'invalid';
  }
  return 'unexpected';
}

/** Texto para la alerta. El clic redundante no debe mostrarse como error. */
export function noticeForChoiceFailure(result: ApplyChoiceFailure): string | null {
  if (result.reason === 'redundant') {
    return null;
  }
  return result.notice;
}

export type ApplyChoiceResult = ApplyChoiceSuccess | ApplyChoiceFailure;

/**
 * Controlador de una partida A. La puerta vive aquí, no en un singleton.
 */
export function createWhatsAppSessionController() {
  const gate = createChoiceGate();
  let choosing = false;

  return {
    isChoosing(): boolean {
      return choosing;
    },

    applyOption(state: SessionState, optionId: string): ApplyChoiceResult {
      if (choosing) {
        return {
          ok: false,
          state,
          feedback: null,
          notice: 'Ya se eligió una opción en este paso. No se puede elegir otra vez.',
          reason: 'redundant',
        };
      }

      choosing = true;
      try {
        const result = gate.choose(state, WHATSAPP_FAMILIAR_SCENARIO, optionId);
        if (!result.ok) {
          return {
            ok: false,
            state,
            feedback: null,
            notice: result.error.message,
            reason: classifyChoiceError(result.error.code),
          };
        }

        let next = result.value.state;
        if (result.value.finished) {
          const closed = complete(next, WHATSAPP_FAMILIAR_SCENARIO);
          if (closed.ok) {
            next = closed.value.state;
          }
        }

        return {
          ok: true,
          state: next,
          feedback: result.value.feedback,
          notice: null,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo aplicar la decisión.';
        return {
          ok: false,
          state,
          feedback: null,
          notice: message,
          reason: 'unexpected',
        };
      } finally {
        choosing = false;
      }
    },

    restart(): SessionState {
      gate.reset();
      choosing = false;
      return startWhatsAppSession();
    },
  };
}

export type WhatsAppSessionController = ReturnType<typeof createWhatsAppSessionController>;
