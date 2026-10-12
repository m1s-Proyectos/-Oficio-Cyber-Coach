import { choose } from './engine';
import { fail } from './result';
import type { ChooseSuccess, EngineResult, ScenarioDefinition, SessionState } from './types';

/**
 * Serializa decisiones de **una** sesión.
 * `choose` es puro: dos llamadas con el mismo estado son indistinguibles.
 * Esta puerta recuerda el último paso aceptado (nodo + longitud del historial)
 * sin estado global: cada partida crea la suya. Un ciclo D4 cambia la
 * longitud del historial, así que no se bloquea al volver a un nodo.
 */
export function createChoiceGate() {
  let acceptedStepKey: string | null = null;
  let inFlight = false;

  const stepKeyOf = (state: SessionState): string =>
    `${state.currentNodeId}:${String(state.choices.length)}`;

  return {
    choose(
      state: SessionState,
      definition: ScenarioDefinition,
      optionId: string,
    ): EngineResult<ChooseSuccess> {
      if (inFlight) {
        return fail(
          'ALREADY_CHOSEN_ON_NODE',
          'Ya se eligió una opción en este paso. No se puede elegir otra vez.',
        );
      }

      const stepKey = stepKeyOf(state);
      if (acceptedStepKey === stepKey) {
        return fail(
          'ALREADY_CHOSEN_ON_NODE',
          'Ya se eligió una opción en este paso. No se puede elegir otra vez.',
        );
      }

      inFlight = true;
      try {
        const result = choose(state, definition, optionId);
        if (result.ok) {
          acceptedStepKey = stepKey;
        }
        return result;
      } finally {
        inFlight = false;
      }
    },

    reset(): void {
      acceptedStepKey = null;
      inFlight = false;
    },
  };
}

export type ChoiceGate = ReturnType<typeof createChoiceGate>;
