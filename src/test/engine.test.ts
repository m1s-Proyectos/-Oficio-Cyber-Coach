import { describe, expect, it } from 'vitest';
import { complete, choose, evaluate, getCurrent, recommend, start } from '../engine/engine';
import { MINIMAL_SCENARIO } from '../engine/fixtures/minimalScenario';
import type { ScenarioDefinition, SessionState } from '../engine/types';
import { validateDefinition } from '../engine/validate';

function mustStart(): SessionState {
  const result = start(MINIMAL_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function mustChoose(state: SessionState, optionId: string): SessionState {
  const result = choose(state, MINIMAL_SCENARIO, optionId);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value.state;
}

function mutate(patch: (definition: ScenarioDefinition) => ScenarioDefinition): ScenarioDefinition {
  return patch(structuredClone(MINIMAL_SCENARIO));
}

describe('validateDefinition', () => {
  it('acepta el fixture mínimo', () => {
    const result = validateDefinition(MINIMAL_SCENARIO);
    expect(result.ok).toBe(true);
  });

  it('rechaza un nodo inicial inexistente', () => {
    const definition = mutate((item) => ({ ...item, initialNodeId: 'no-existe' }));
    const result = validateDefinition(definition);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('UNKNOWN_INITIAL_NODE');
    }
  });

  it('rechaza una transición hacia un nodo que no existe', () => {
    const definition = mutate((item) => {
      const startNode = item.nodes.start;
      if (!startNode) {
        return item;
      }
      const [first, ...rest] = startNode.options;
      if (!first) {
        return item;
      }
      return {
        ...item,
        nodes: {
          ...item.nodes,
          start: {
            ...startNode,
            options: [{ ...first, nextNodeId: 'hueco' }, ...rest],
          },
        },
      };
    });
    const result = validateDefinition(definition);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_DEFINITION');
    }
  });

  it('rechaza un escenario sin rama de verificación', () => {
    const definition = mutate((item) => ({
      ...item,
      nodes: Object.fromEntries(
        Object.entries(item.nodes).map(([id, node]) => [
          id,
          {
            ...node,
            options: node.options.map((option) => ({
              ...option,
              evaluation: { ...option.evaluation, recognizedSignalIds: [] },
            })),
          },
        ]),
      ),
    }));
    const result = start(definition);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_DEFINITION');
    }
  });
});

describe('start y getCurrent', () => {
  it('abre la sesión en el nodo inicial y no revela nodos futuros', () => {
    const state = mustStart();
    expect(state.status).toBe('active');
    expect(state.currentNodeId).toBe('start');
    expect(state.choices).toEqual([]);
    expect(state.result).toBeNull();

    const view = getCurrent(state, MINIMAL_SCENARIO);
    expect(view.ok).toBe(true);
    if (view.ok) {
      expect(view.value.node.id).toBe('start');
      expect(view.value.options.map((option) => option.id)).toEqual(['send-now', 'verify-first']);
    }
  });
});

describe('choose', () => {
  it('avanza por la transición del guion, no por un destino inyectado', () => {
    const first = choose(mustStart(), MINIMAL_SCENARIO, 'verify-first');
    expect(first.ok).toBe(true);
    if (first.ok) {
      expect(first.value.state.currentNodeId).toBe('safe-end');
      expect(first.value.finished).toBe(true);
      expect(first.value.feedback.explanation.length).toBeGreaterThan(0);
    }
  });

  it('no cambia el estado si la opción no existe', () => {
    const state = mustStart();
    const result = choose(state, MINIMAL_SCENARIO, 'no-existe');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('UNKNOWN_OPTION');
    }
    expect(state.currentNodeId).toBe('start');
    expect(state.choices).toHaveLength(0);
  });

  it('rechaza una opción que pertenece a otro nodo', () => {
    const result = choose(mustStart(), MINIMAL_SCENARIO, 'send-again');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('OPTION_NOT_IN_NODE');
    }
  });

  it('no permite elegir dos veces en el mismo paso', () => {
    const afterFirst = mustChoose(mustStart(), 'send-now');
    const replayed: SessionState = { ...afterFirst, currentNodeId: 'start' };
    const result = choose(replayed, MINIMAL_SCENARIO, 'verify-first');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('ALREADY_CHOSEN_ON_NODE');
    }
  });

  it('rechaza decisiones cuando la sesión está cerrada', () => {
    const finished = mustChoose(mustStart(), 'verify-first');
    const closed = complete(finished, MINIMAL_SCENARIO);
    expect(closed.ok).toBe(true);
    if (!closed.ok) {
      return;
    }
    const result = choose(closed.value.state, MINIMAL_SCENARIO, 'send-now');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('SESSION_COMPLETED');
    }
  });
});

describe('evaluate, complete y recommend', () => {
  it('produce el mismo desglose para la misma secuencia', () => {
    const first = evaluate(mustChoose(mustStart(), 'verify-first'), MINIMAL_SCENARIO);
    const second = evaluate(mustChoose(mustStart(), 'verify-first'), MINIMAL_SCENARIO);
    expect(first).toEqual(second);
    expect(first.total).toBe(50);
    expect(first.breakdown).toEqual({
      recognition: 12,
      verification: 15,
      containment: 15,
      recovery: 8,
    });
  });

  it('distingue la rama de riesgo de la de recuperación', () => {
    const risk = evaluate(
      mustChoose(mustChoose(mustStart(), 'send-now'), 'send-again'),
      MINIMAL_SCENARIO,
    );
    const recover = evaluate(
      mustChoose(mustChoose(mustStart(), 'send-now'), 'stop-and-check'),
      MINIMAL_SCENARIO,
    );
    expect(risk.total).toBe(4);
    expect(recover.total).toBe(49);
    expect(risk.overlookedSignalIds).toContain('urgency');
    expect(recover.attendedSignalIds).toContain('urgency');
  });

  it('no cierra una sesión que aún no está en un nodo terminal', () => {
    const result = complete(mustStart(), MINIMAL_SCENARIO);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NOT_TERMINAL');
    }
  });

  it('el segundo cierre no crea otro resultado', () => {
    const terminal = mustChoose(mustStart(), 'verify-first');
    const first = complete(terminal, MINIMAL_SCENARIO);
    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }
    const second = complete(first.value.state, MINIMAL_SCENARIO);
    expect(second.ok).toBe(true);
    if (!second.ok) {
      return;
    }
    expect(first.value.created).toBe(true);
    expect(second.value.created).toBe(false);
    expect(second.value.result).toEqual(first.value.result);
    expect(second.value.state.status).toBe('completed');
  });

  it('devuelve solo textos ya escritos para las señales no atendidas', () => {
    const result = evaluate(
      mustChoose(mustChoose(mustStart(), 'send-now'), 'send-again'),
      MINIMAL_SCENARIO,
    );
    const texts = recommend(result, MINIMAL_SCENARIO);
    expect(texts).toEqual(result.recommendations);
    expect(texts.every((text) => text.length > 0)).toBe(true);
  });
});
