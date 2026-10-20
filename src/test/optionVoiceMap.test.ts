import { describe, expect, it } from 'vitest';
import {
  CODIGO_VERIFICACION_SCENARIO,
  EMPLEO_PAGO_PREVIO_SCENARIO,
  SUPUESTO_JEFE_SCENARIO,
  TIENDA_IPHONE_SCENARIO,
  WHATSAPP_FAMILIAR_SCENARIO,
} from '../content';
import type { ScenarioDefinition } from '../engine';
import { isVoiceAdviceId } from '../voice/adviceCatalog';
import { OPTION_VOICE_MAP, optionVoiceKey } from '../voice/optionVoiceMap';
import { resolveFeedbackAdviceId } from '../voice/resolveFeedbackAdvice';

const PLAYABLE: readonly ScenarioDefinition[] = [
  WHATSAPP_FAMILIAR_SCENARIO,
  TIENDA_IPHONE_SCENARIO,
  EMPLEO_PAGO_PREVIO_SCENARIO,
  CODIGO_VERIFICACION_SCENARIO,
  SUPUESTO_JEFE_SCENARIO,
];

function collectOptionKeys(definition: ScenarioDefinition): string[] {
  return Object.values(definition.nodes).flatMap((node) =>
    node.options.map((option) => optionVoiceKey(definition.slug, option.id)),
  );
}

const realKeys = PLAYABLE.flatMap(collectOptionKeys);
const mapKeys = Object.keys(OPTION_VOICE_MAP);
const assigned = Object.values(OPTION_VOICE_MAP).filter((value) => value !== null);
const excluded = Object.values(OPTION_VOICE_MAP).filter((value) => value === null);

describe('OPTION_VOICE_MAP', () => {
  it('cubre exactamente las 114 opciones reales, sin duplicados', () => {
    expect(new Set(realKeys).size).toBe(realKeys.length);
    expect(realKeys).toHaveLength(114);
    expect(mapKeys).toHaveLength(114);
    expect([...mapKeys].sort()).toEqual([...realKeys].sort());
  });

  it('asigna un consejo existente a las 114 opciones', () => {
    expect(assigned).toHaveLength(114);
    expect(excluded).toHaveLength(0);
  });

  it('solo apunta a identificadores existentes del catálogo', () => {
    for (const value of assigned) {
      expect(value === null || isVoiceAdviceId(value)).toBe(true);
    }
  });
});

describe('resolveFeedbackAdviceId', () => {
  it('resuelve send-200 a emotional-pressure', () => {
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'send-200')).toBe(
      'whatsapp-familiar:emotional-pressure',
    );
  });

  it('resuelve mark-salary a advance-fee', () => {
    expect(resolveFeedbackAdviceId('empleo-pago-previo', 'mark-salary')).toBe(
      'empleo-pago-previo:advance-fee',
    );
  });

  it('conserva las tres asociaciones OTP', () => {
    expect(resolveFeedbackAdviceId('codigo-verificacion', 'dictate')).toBe(
      'codigo-verificacion:otp-request',
    );
    expect(resolveFeedbackAdviceId('codigo-verificacion', 'call-official-from-sms')).toBe(
      'codigo-verificacion:otp-request',
    );
    expect(resolveFeedbackAdviceId('codigo-verificacion', 'call-official')).toBe(
      'codigo-verificacion:otp-request',
    );
  });

  it('separa el mismo option.id en escenarios distintos', () => {
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'leave-paused')).toBe(
      'whatsapp-familiar:urgency',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'leave-paused')).toBe(
      'tienda-iphone:leave-check',
    );
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'ack-recover')).toBe(
      'whatsapp-familiar:second-ask',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'ack-recover')).toBe(
      'tienda-iphone:store-vanish',
    );
  });

  it('devuelve null para exclusiones y para claves desconocidas', () => {
    expect(resolveFeedbackAdviceId('codigo-verificacion', 'answer-call')).toBe(
      'codigo-verificacion:unexpected-call',
    );
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'option-inventada')).toBeNull();
    expect(resolveFeedbackAdviceId('escenario-inventado', 'send-200')).toBeNull();
  });
});
