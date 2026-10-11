import { afterEach, describe, expect, it, vi } from 'vitest';
import { isCastReady } from '../content/bindCast';
import { WHATSAPP_FAMILIAR_SCENARIO } from '../content/whatsappFamiliar/definition';
import { start } from '../engine';
import {
  briefOutgoingReply,
  canChooseAtPhase,
  contactInitials,
  EMPTY_CAST_DRAFT,
  FIRST_INCOMING_DELAY_MS,
  FOLLOWUP_WAIT_MS,
  incomingSenderLabel,
  isTechnicalNotifyNarration,
  NOTIFY_INCOMING_BODY,
  notifyIncomingPreview,
  scheduleFirstIncoming,
  scheduleProgressiveMessage,
  TYPING_DELAY_MS,
} from '../features/simulation/whatsappStart';

afterEach(() => {
  vi.useRealTimers();
});

describe('inicio personalizado simulación A', () => {
  it('exige los tres campos; espacios no cuentan', () => {
    expect(isCastReady(EMPTY_CAST_DRAFT)).toBe(false);
    expect(
      isCastReady({
        learner: '   ',
        relativeName: 'Diego',
        relationship: 'hijo',
      }),
    ).toBe(false);
    expect(
      isCastReady({
        learner: 'Ana',
        relativeName: '',
        relationship: 'hermana',
      }),
    ).toBe(false);
    expect(
      isCastReady({
        learner: 'Ana',
        relativeName: 'Marta',
        relationship: '  ',
      }),
    ).toBe(false);
    expect(
      isCastReady({
        learner: 'Ana',
        relativeName: 'Marta',
        relationship: 'hermana',
      }),
    ).toBe(true);
  });

  it('el remitente usa el nombre elegido y no la narración técnica', () => {
    const situation = WHATSAPP_FAMILIAR_SCENARIO.nodes.n_notify?.situation ?? '';
    expect(isTechnicalNotifyNarration(situation)).toBe(true);
    expect(isTechnicalNotifyNarration(NOTIFY_INCOMING_BODY)).toBe(false);
    expect(
      incomingSenderLabel({ learner: 'Ana', relativeName: 'Marta', relationship: 'hermana' }),
    ).toBe('Marta');
    expect(
      notifyIncomingPreview({ learner: 'Ana', relativeName: 'Marta', relationship: 'hermana' }),
    ).toBe('Marta: Mensaje nuevo');
  });

  it('el primer mensaje llega a los 500 ms y el motor sigue en n_notify', () => {
    vi.useFakeTimers();
    const started = start(WHATSAPP_FAMILIAR_SCENARIO);
    expect(started.ok).toBe(true);
    if (started.ok) {
      expect(started.value.currentNodeId).toBe('n_notify');
    }

    const arrived = vi.fn();
    const cancel = scheduleFirstIncoming(arrived);
    expect(arrived).not.toHaveBeenCalled();
    vi.advanceTimersByTime(FIRST_INCOMING_DELAY_MS - 1);
    expect(arrived).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(arrived).toHaveBeenCalledTimes(1);
    cancel();
  });

  it('al reiniciar cancela el temporizador y no deja llegadas duplicadas', () => {
    vi.useFakeTimers();
    const arrived = vi.fn();
    const cancelFirst = scheduleFirstIncoming(arrived);
    vi.advanceTimersByTime(200);
    cancelFirst();
    vi.advanceTimersByTime(500);
    expect(arrived).not.toHaveBeenCalled();

    const cancelSecond = scheduleFirstIncoming(arrived);
    vi.advanceTimersByTime(FIRST_INCOMING_DELAY_MS);
    expect(arrived).toHaveBeenCalledTimes(1);
    cancelSecond();
    vi.advanceTimersByTime(FIRST_INCOMING_DELAY_MS);
    expect(arrived).toHaveBeenCalledTimes(1);
  });
});

describe('chat progresivo simulación A', () => {
  it('las decisiones solo se habilitan cuando el mensaje ya es visible', () => {
    expect(canChooseAtPhase('wait')).toBe(false);
    expect(canChooseAtPhase('typing')).toBe(false);
    expect(canChooseAtPhase('visible')).toBe(true);
  });

  it('las respuestas del chat son breves y no copian la etiqueta de decisión', () => {
    const longSend = 'Enviar los $200 ahora. Es mi {{relationship}} y podría estar en peligro.';
    expect(briefOutgoingReply('open-thread')).toBeNull();
    expect(briefOutgoingReply('send-200')).toBe('Te los mando ahora.');
    expect(briefOutgoingReply('chat-only')).toBe('¿Qué pasó? Cuéntame.');
    expect(briefOutgoingReply('send-200')?.includes(longSend)).toBe(false);
    expect((briefOutgoingReply('send-200') ?? '').length).toBeLessThan(40);
  });

  it('el avatar usa las iniciales del familiar', () => {
    expect(contactInitials('Marta')).toBe('MA');
    expect(contactInitials('Luis Pérez')).toBe('LP');
  });

  it('espera 500 ms, muestra escritura y luego el mensaje', () => {
    vi.useFakeTimers();
    const onTyping = vi.fn();
    const onVisible = vi.fn();
    const cancel = scheduleProgressiveMessage({
      waitMs: FIRST_INCOMING_DELAY_MS,
      typingMs: TYPING_DELAY_MS,
      onTyping,
      onVisible,
    });

    vi.advanceTimersByTime(FIRST_INCOMING_DELAY_MS - 1);
    expect(onTyping).not.toHaveBeenCalled();
    expect(onVisible).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onTyping).toHaveBeenCalledTimes(1);
    expect(onVisible).not.toHaveBeenCalled();
    vi.advanceTimersByTime(TYPING_DELAY_MS);
    expect(onVisible).toHaveBeenCalledTimes(1);
    cancel();
  });

  it('un mensaje siguiente espera un pulso, escribe y no se duplica si se cancela', () => {
    vi.useFakeTimers();
    const onTyping = vi.fn();
    const onVisible = vi.fn();
    const cancel = scheduleProgressiveMessage({
      waitMs: FOLLOWUP_WAIT_MS,
      typingMs: TYPING_DELAY_MS,
      onTyping,
      onVisible,
    });
    vi.advanceTimersByTime(FOLLOWUP_WAIT_MS);
    expect(onTyping).toHaveBeenCalledTimes(1);
    cancel();
    vi.advanceTimersByTime(TYPING_DELAY_MS);
    expect(onVisible).not.toHaveBeenCalled();

    const cancelNext = scheduleProgressiveMessage({
      waitMs: FOLLOWUP_WAIT_MS,
      typingMs: TYPING_DELAY_MS,
      onTyping,
      onVisible,
    });
    vi.advanceTimersByTime(FOLLOWUP_WAIT_MS + TYPING_DELAY_MS);
    expect(onVisible).toHaveBeenCalledTimes(1);
    cancelNext();
    vi.advanceTimersByTime(FOLLOWUP_WAIT_MS + TYPING_DELAY_MS);
    expect(onVisible).toHaveBeenCalledTimes(1);
  });
});
