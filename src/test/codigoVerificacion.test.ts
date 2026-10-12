import { describe, expect, it } from 'vitest';
import { CODIGO_VERIFICACION_PRESENTATION } from '../content/codigoVerificacion/presentation';
import { CODIGO_VERIFICACION_SCENARIO } from '../content/codigoVerificacion/definition';
import { choose, complete, start, validateDefinition } from '../engine';
import type { SessionState } from '../engine';

function mustStart(): SessionState {
  const result = start(CODIGO_VERIFICACION_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function mustChoose(state: SessionState, optionId: string): SessionState {
  const result = choose(state, CODIGO_VERIFICACION_SCENARIO, optionId);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value.state;
}

describe('codigo-verificacion', () => {
  it('valida el grafo y la presentación', () => {
    expect(validateDefinition(CODIGO_VERIFICACION_SCENARIO).ok).toBe(true);
    for (const id of Object.keys(CODIGO_VERIFICACION_SCENARIO.nodes)) {
      expect(CODIGO_VERIFICACION_PRESENTATION[id]).toBeDefined();
    }
  });

  it('ruta segura: colgar y usar el número oficial', () => {
    let state = mustChoose(mustStart(), 'answer-call');
    state = mustChoose(state, 'hang-up');
    state = mustChoose(state, 'call-official');
    expect(state.currentNodeId).toBe('t_safe');
    const closed = complete(state, CODIGO_VERIFICACION_SCENARIO);
    expect(closed.ok).toBe(true);
    expect(CODIGO_VERIFICACION_SCENARIO.nodes.t_safe?.situation).toMatch(
      /Nunca|nunca|secretos|no lo compartas/i,
    );
  });

  it('dictar el código cierra en fuga', () => {
    const leaked = mustChoose(mustChoose(mustStart(), 'answer-call'), 'dictate');
    expect(leaked.currentNodeId).toBe('t_leaked');
  });

  it('rechazar la llamada y no dictar el SMS es seguro', () => {
    const safe = mustChoose(mustChoose(mustStart(), 'decline-call'), 'call-official-from-sms');
    expect(safe.currentNodeId).toBe('t_safe');
  });

  it('devolver la llamada y dictar es riesgo', () => {
    const leaked = mustChoose(mustChoose(mustStart(), 'decline-call'), 'dictate-from-sms');
    expect(leaked.currentNodeId).toBe('t_leaked');
  });
});
