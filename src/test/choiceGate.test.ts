import { describe, expect, it } from 'vitest';
import { createChoiceGate } from '../engine/choiceGate';
import { choose, start } from '../engine/engine';
import { MINIMAL_SCENARIO } from '../engine/fixtures/minimalScenario';

function mustStart() {
  const result = start(MINIMAL_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

describe('createChoiceGate (motor)', () => {
  it('rechaza dos elecciones sobre el mismo estado inicial', () => {
    const gate = createChoiceGate();
    const state = mustStart();
    const first = gate.choose(state, MINIMAL_SCENARIO, 'send-now');
    const second = gate.choose(state, MINIMAL_SCENARIO, 'verify-first');
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (second.ok === false) {
      expect(second.error.code).toBe('ALREADY_CHOSEN_ON_NODE');
    }
    if (first.ok) {
      expect(first.value.state.currentNodeId).toBe('second-ask');
      expect(first.value.state.choices).toHaveLength(1);
    }
  });

  it('no comparte el bloqueo entre puertas independientes', () => {
    const left = createChoiceGate();
    const right = createChoiceGate();
    const a = mustStart();
    const b = mustStart();
    expect(left.choose(a, MINIMAL_SCENARIO, 'send-now').ok).toBe(true);
    expect(right.choose(b, MINIMAL_SCENARIO, 'verify-first').ok).toBe(true);
  });

  it('tras un fallo permite reintentar el mismo paso', () => {
    const gate = createChoiceGate();
    const state = mustStart();
    const failed = gate.choose(state, MINIMAL_SCENARIO, 'no-existe');
    expect(failed.ok).toBe(false);
    const retry = gate.choose(state, MINIMAL_SCENARIO, 'send-now');
    expect(retry.ok).toBe(true);
  });

  it('sigue rechazando opciones de otro nodo', () => {
    const gate = createChoiceGate();
    const state = mustStart();
    const result = gate.choose(state, MINIMAL_SCENARIO, 'send-again');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('OPTION_NOT_IN_NODE');
    }
  });

  it('reset libera el paso para una sesión nueva', () => {
    const gate = createChoiceGate();
    const first = mustStart();
    expect(gate.choose(first, MINIMAL_SCENARIO, 'send-now').ok).toBe(true);
    gate.reset();
    const second = mustStart();
    expect(gate.choose(second, MINIMAL_SCENARIO, 'verify-first').ok).toBe(true);
  });

  it('el choose puro del motor no recuerda llamadas previas (contrato)', () => {
    const state = mustStart();
    expect(choose(state, MINIMAL_SCENARIO, 'send-now').ok).toBe(true);
    expect(choose(state, MINIMAL_SCENARIO, 'verify-first').ok).toBe(true);
  });
});
