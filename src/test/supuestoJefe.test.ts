import { describe, expect, it } from 'vitest';
import { SUPUESTO_JEFE_PRESENTATION } from '../content/supuestoJefe/presentation';
import { SUPUESTO_JEFE_SCENARIO } from '../content/supuestoJefe/definition';
import { choose, complete, start, validateDefinition } from '../engine';
import type { SessionState } from '../engine';

function mustStart(): SessionState {
  const result = start(SUPUESTO_JEFE_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function mustChoose(state: SessionState, optionId: string): SessionState {
  const result = choose(state, SUPUESTO_JEFE_SCENARIO, optionId);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value.state;
}

describe('supuesto-jefe', () => {
  it('valida el grafo y la presentación', () => {
    expect(validateDefinition(SUPUESTO_JEFE_SCENARIO).ok).toBe(true);
    for (const id of Object.keys(SUPUESTO_JEFE_SCENARIO.nodes)) {
      expect(SUPUESTO_JEFE_PRESENTATION[id]).toBeDefined();
    }
  });

  it('ruta segura: verificar por canal interno', () => {
    let state = mustChoose(mustStart(), 'open-mail');
    state = mustChoose(state, 'verify-internal');
    state = mustChoose(state, 'follow-finance');
    expect(state.currentNodeId).toBe('t_safe');
    const closed = complete(state, SUPUESTO_JEFE_SCENARIO);
    expect(closed.ok).toBe(true);
  });

  it('comprar las tarjetas cierra en pérdida', () => {
    const bought = mustChoose(mustChoose(mustStart(), 'open-mail'), 'buy-cards');
    expect(bought.currentNodeId).toBe('t_bought');
  });

  it('negociar el monto aún puede corregirse', () => {
    let state = mustChoose(mustChoose(mustStart(), 'open-mail'), 'ask-less');
    expect(state.currentNodeId).toBe('n_negotiate');
    state = mustChoose(state, 'verify-after-ask');
    state = mustChoose(state, 'follow-finance');
    expect(state.currentNodeId).toBe('t_safe');
  });
});
