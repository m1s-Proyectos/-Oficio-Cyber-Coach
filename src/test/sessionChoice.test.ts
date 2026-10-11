import { describe, expect, it } from 'vitest';
import { WHATSAPP_FAMILIAR_SCENARIO } from '../content/whatsappFamiliar/definition';
import {
  createWhatsAppSessionController,
  noticeForChoiceFailure,
  startWhatsAppSession,
} from '../features/simulation/sessionChoice';

describe('createWhatsAppSessionController (controlador A)', () => {
  it('dos clics sobre el mismo estado no generan dos transiciones', () => {
    const controller = createWhatsAppSessionController();
    const state = startWhatsAppSession();
    const first = controller.applyOption(state, 'open-thread');
    const second = controller.applyOption(state, 'open-thread');
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (first.ok) {
      expect(first.state.currentNodeId).toBe('n_ask200');
      expect(first.state.choices).toHaveLength(1);
    }
    if (!second.ok) {
      expect(second.state.currentNodeId).toBe('n_notify');
      expect(second.reason).toBe('redundant');
      expect(noticeForChoiceFailure(second)).toBeNull();
    }
    expect(controller.isChoosing()).toBe(false);
  });

  it('permite el ciclo D4 de volver al chat y verificar de nuevo', () => {
    const controller = createWhatsAppSessionController();
    let state = startWhatsAppSession();
    const steps = [
      'open-thread',
      'verify-now',
      'back-to-suspect-chat',
      'verify-after-chat',
    ] as const;
    for (const optionId of steps) {
      const result = controller.applyOption(state, optionId);
      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }
      state = result.state;
    }
    expect(state.currentNodeId).toBe('n_call');
    expect(state.choices.filter((choice) => choice.nodeId === 'n_call')).toHaveLength(1);
  });

  it('rechaza una opción inválida y no deja el controlador bloqueado', () => {
    const controller = createWhatsAppSessionController();
    const state = startWhatsAppSession();
    const failed = controller.applyOption(state, 'no-existe');
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.reason).toBe('invalid');
      expect(noticeForChoiceFailure(failed)).toMatch(/no existe/);
    }
    expect(controller.isChoosing()).toBe(false);
    const retry = controller.applyOption(state, 'open-thread');
    expect(retry.ok).toBe(true);
    if (retry.ok) {
      expect(retry.state.currentNodeId).toBe('n_ask200');
    }
  });

  it('trata una opción de otro nodo como inválida visible', () => {
    const controller = createWhatsAppSessionController();
    const failed = controller.applyOption(startWhatsAppSession(), 'send-200');
    expect(failed.ok).toBe(false);
    if (!failed.ok) {
      expect(failed.reason).toBe('invalid');
      expect(noticeForChoiceFailure(failed)).toMatch(/no pertenece/);
    }
  });

  it('sesiones independientes no comparten el bloqueo', () => {
    const alpha = createWhatsAppSessionController();
    const beta = createWhatsAppSessionController();
    const first = alpha.applyOption(startWhatsAppSession(), 'open-thread');
    const other = beta.applyOption(startWhatsAppSession(), 'open-thread');
    expect(first.ok).toBe(true);
    expect(other.ok).toBe(true);
  });

  it('reiniciar permite una partida nueva en el mismo controlador', () => {
    const controller = createWhatsAppSessionController();
    const opened = controller.applyOption(startWhatsAppSession(), 'open-thread');
    expect(opened.ok).toBe(true);
    const fresh = controller.restart();
    expect(fresh.currentNodeId).toBe(WHATSAPP_FAMILIAR_SCENARIO.initialNodeId);
    expect(fresh.choices).toHaveLength(0);
    const again = controller.applyOption(fresh, 'open-thread');
    expect(again.ok).toBe(true);
  });

  it('cierra un terminal de A sin dejar choosing activo', () => {
    const controller = createWhatsAppSessionController();
    let state = startWhatsAppSession();
    for (const optionId of ['open-thread', 'pause', 'leave-paused'] as const) {
      const result = controller.applyOption(state, optionId);
      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }
      state = result.state;
    }
    expect(state.currentNodeId).toBe('t_paused');
    expect(state.status).toBe('completed');
    expect(controller.isChoosing()).toBe(false);
    const afterEnd = controller.applyOption(state, 'open-thread');
    expect(afterEnd.ok).toBe(false);
    if (!afterEnd.ok) {
      expect(afterEnd.reason).toBe('redundant');
      expect(noticeForChoiceFailure(afterEnd)).toBeNull();
    }
  });
});
