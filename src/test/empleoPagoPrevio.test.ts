import { describe, expect, it } from 'vitest';
import { EMPLEO_PAGO_PREVIO_PRESENTATION } from '../content/empleoPagoPrevio/presentation';
import { EMPLEO_PAGO_PREVIO_SCENARIO } from '../content/empleoPagoPrevio/definition';
import { UNOFFICIAL_ZERO_POINTS } from '../content/empleoPagoPrevio/zeroPoints';
import { choose, complete, start, validateDefinition } from '../engine';
import type { SessionState } from '../engine';

function mustStart(): SessionState {
  const result = start(EMPLEO_PAGO_PREVIO_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function mustChoose(state: SessionState, optionId: string): SessionState {
  const result = choose(state, EMPLEO_PAGO_PREVIO_SCENARIO, optionId);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value.state;
}

describe('empleo-pago-previo', () => {
  it('valida el grafo y cubre cada nodo en presentación', () => {
    expect(validateDefinition(EMPLEO_PAGO_PREVIO_SCENARIO).ok).toBe(true);
    for (const id of Object.keys(EMPLEO_PAGO_PREVIO_SCENARIO.nodes)) {
      expect(EMPLEO_PAGO_PREVIO_PRESENTATION[id]).toBeDefined();
    }
  });

  it('no asigna puntos oficiales', () => {
    for (const node of Object.values(EMPLEO_PAGO_PREVIO_SCENARIO.nodes)) {
      for (const option of node.options) {
        expect(option.evaluation.points).toEqual(UNOFFICIAL_ZERO_POINTS);
      }
    }
  });

  it('ruta segura: detectar el cobro y no pagar', () => {
    let state = mustChoose(mustStart(), 'open-offer');
    state = mustChoose(state, 'mark-fee');
    state = mustChoose(state, 'refuse-pay');
    expect(state.currentNodeId).toBe('t_safe');
    const closed = complete(state, EMPLEO_PAGO_PREVIO_SCENARIO);
    expect(closed.ok).toBe(true);
  });

  it('ruta de riesgo: pagar $35 desde la oferta', () => {
    const paid = mustChoose(mustChoose(mustStart(), 'open-offer'), 'pay-35');
    expect(paid.currentNodeId).toBe('t_paid');
  });

  it('la distracción del salario puede corregirse', () => {
    let state = mustChoose(mustChoose(mustStart(), 'open-offer'), 'mark-salary');
    expect(state.currentNodeId).toBe('n_distract');
    state = mustChoose(state, 'now-see-fee');
    state = mustChoose(state, 'research-firm');
    state = mustChoose(state, 'refuse-after-research');
    expect(state.currentNodeId).toBe('t_safe');
  });
});
