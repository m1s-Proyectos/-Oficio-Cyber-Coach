import { describe, expect, it } from 'vitest';
import { applyCast, DEFAULT_CAST } from '../content/bindCast';
import { WHATSAPP_FAMILIAR_SCENARIO } from '../content/whatsappFamiliar/definition';
import { choose, complete, evaluate, start, validateDefinition } from '../engine';
import type { SessionState } from '../engine';

function mustStart(): SessionState {
  const result = start(WHATSAPP_FAMILIAR_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function mustChoose(state: SessionState, optionId: string): SessionState {
  const result = choose(state, WHATSAPP_FAMILIAR_SCENARIO, optionId);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value.state;
}

describe('guion A whatsapp-familiar', () => {
  it('valida el grafo D4', () => {
    const result = validateDefinition(WHATSAPP_FAMILIAR_SCENARIO);
    expect(result.ok).toBe(true);
  });

  it('declara hitos o ceros en cada opción puntuable', () => {
    const scored = Object.values(WHATSAPP_FAMILIAR_SCENARIO.nodes).flatMap((node) =>
      node.options.filter((option) =>
        Object.values(option.evaluation.points).some((value) => value > 0),
      ),
    );
    expect(scored.length).toBeGreaterThan(0);
    for (const option of scored) {
      expect(option.evaluation.milestoneId).toMatch(/^[a-z][a-z0-9-]{0,63}$/);
    }
  });

  it('solo ofrece $150 después de un envío de $200', () => {
    const startState = mustStart();
    expect(startState.currentNodeId).toBe('n_notify');
    const ask = mustChoose(startState, 'open-thread');
    expect(ask.currentNodeId).toBe('n_ask200');
    const afterPay = mustChoose(ask, 'send-200');
    expect(afterPay.currentNodeId).toBe('n_after_200');
    const askNode = WHATSAPP_FAMILIAR_SCENARIO.nodes.n_ask200;
    expect(askNode?.options.some((option) => option.id === 'send-150')).toBe(false);
  });

  it('lleva send-150 por recuperación y cierra t_paid_twice', () => {
    let state = mustChoose(mustChoose(mustStart(), 'open-thread'), 'send-200');
    state = mustChoose(state, 'send-150');
    expect(state.currentNodeId).toBe('n_recover_twice');
    state = mustChoose(state, 'ack-recover-twice');
    expect(state.currentNodeId).toBe('t_paid_twice');
    const closed = complete(state, WHATSAPP_FAMILIAR_SCENARIO);
    expect(closed.ok).toBe(true);
    if (closed.ok) {
      expect(closed.value.result.total).toBeGreaterThan(0);
      expect(closed.value.result.total).toBeLessThanOrEqual(100);
      expect(closed.value.state.status).toBe('completed');
    }
  });

  it('permite el ciclo de volver al chat y salir a verificación sin inflar hitos', () => {
    let state = mustChoose(mustChoose(mustStart(), 'open-thread'), 'verify-now');
    expect(state.currentNodeId).toBe('n_call');
    state = mustChoose(state, 'back-to-suspect-chat');
    expect(state.currentNodeId).toBe('n_chat');
    state = mustChoose(state, 'verify-after-chat');
    expect(state.currentNodeId).toBe('n_call');
    const afterLoop = evaluate(state, WHATSAPP_FAMILIAR_SCENARIO);
    state = mustChoose(state, 'contact-other');
    expect(state.currentNodeId).toBe('n_other');
    state = mustChoose(state, 'warn-and-end');
    expect(state.currentNodeId).toBe('t_safe');
    const closed = complete(state, WHATSAPP_FAMILIAR_SCENARIO);
    expect(closed.ok).toBe(true);
    if (closed.ok) {
      // open-thread + verify-independent (una vez) + confirm-other + refuse-transfer
      expect(closed.value.result.breakdown.verification).toBe(25);
      expect(closed.value.result.total).toBe(65);
      expect(afterLoop.breakdown.verification).toBe(15);
    }
  });

  it('distingue pausar y bloquear', () => {
    const paused = mustChoose(mustChoose(mustStart(), 'open-thread'), 'pause');
    expect(paused.currentNodeId).toBe('n_pause');
    const left = mustChoose(paused, 'leave-paused');
    expect(left.currentNodeId).toBe('t_paused');

    const blocked = mustChoose(mustChoose(mustStart(), 'open-thread'), 'block-now');
    expect(blocked.currentNodeId).toBe('n_block');
    const stayed = mustChoose(blocked, 'stay-blocked');
    expect(stayed.currentNodeId).toBe('t_blocked');
  });

  it('aplica el elenco solo al texto', () => {
    const text = applyCast('Hola {{learner}}, escribe {{relativeName}} tu {{relationship}}.', {
      ...DEFAULT_CAST,
      learner: 'María',
      relativeName: 'Andrea',
      relationship: 'hermana',
    });
    expect(text).toBe('Hola María, escribe Andrea tu hermana.');
    expect(WHATSAPP_FAMILIAR_SCENARIO.initialNodeId).toBe('n_notify');
    expect(WHATSAPP_FAMILIAR_SCENARIO.nodes.n_ask200?.options[0]?.nextNodeId).toBe('n_after_200');
  });
});
