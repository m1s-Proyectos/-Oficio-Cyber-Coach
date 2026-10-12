import { TIENDA_IPHONE_SCENARIO } from '../../content/tiendaIphone';
import { complete, createChoiceGate, start, type Feedback, type SessionState } from '../../engine';
import {
  classifyChoiceError,
  type ApplyChoiceResult,
  type ChoiceFailureReason,
} from './sessionChoice';

export function startTiendaSession(): SessionState {
  const result = start(TIENDA_IPHONE_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

export function createTiendaSessionController() {
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
          reason: 'redundant' satisfies ChoiceFailureReason,
        };
      }

      choosing = true;
      try {
        const result = gate.choose(state, TIENDA_IPHONE_SCENARIO, optionId);
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
          const closed = complete(next, TIENDA_IPHONE_SCENARIO);
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
      return startTiendaSession();
    },
  };
}

export type { Feedback };
