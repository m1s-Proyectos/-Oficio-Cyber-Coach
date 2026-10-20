import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PREVENTION_PACKS } from '../content';
import {
  createBoundSessionController,
  startBoundSession,
} from '../features/simulation/preventionChoice';
import { resolveFeedbackAdviceId } from '../voice/resolveFeedbackAdvice';

describe('experiencia de narración A–E', () => {
  it('A, B y C–E usan el control compartido y no el bloque amarillo permanente', () => {
    const files = [
      'src/features/simulation/WhatsAppFamiliarSession.tsx',
      'src/features/simulation/TiendaIphoneSession.tsx',
      'src/features/simulation/PreventionSession.tsx',
    ];
    for (const file of files) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      expect(source.includes('EducationalAdvice')).toBe(true);
      expect(source.includes('phone-feedback')).toBe(false);
      expect(
        source.includes('explanation={bind(lastFeedback.explanation)}') ||
          source.includes('explanation={bind(overlay.explanation)}'),
      ).toBe(true);
    }
  });

  it('el control de voz solo existe si hay consejo asociado', () => {
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'open-thread')).toBe(
      'whatsapp-familiar:urgency',
    );
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'send-200')).toBe(
      'whatsapp-familiar:emotional-pressure',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'open-search')).toBe('tienda-iphone:low-price');
    expect(resolveFeedbackAdviceId('tienda-iphone', 'open-lumina')).toBe('tienda-iphone:low-price');
    const ui = readFileSync(
      resolve(process.cwd(), 'src/features/simulation/EducationalAdvice.tsx'),
      'utf8',
    );
    expect(ui.includes('{adviceId ? (')).toBe(true);
    expect(ui.includes('Leer el consejo')).toBe(true);
    expect(ui.includes('key={optionId}')).toBe(true);
    expect(resolveFeedbackAdviceId('whatsapp-familiar', 'chat-only')).toBe(
      resolveFeedbackAdviceId('whatsapp-familiar', 'verify-after-chat'),
    );
  });

  it('C–E conservan texto de consejo y reinician sin residuales', () => {
    for (const pack of Object.values(PREVENTION_PACKS)) {
      const controller = createBoundSessionController(pack.definition);
      const start = startBoundSession(pack.definition);
      const firstOption = pack.definition.nodes[start.currentNodeId]?.options[0];
      expect(firstOption).toBeDefined();
      if (!firstOption) {
        continue;
      }
      const moved = controller.applyOption(start, firstOption.id);
      expect(moved.ok).toBe(true);
      if (moved.ok) {
        expect(moved.feedback.explanation.length).toBeGreaterThan(0);
        expect(moved.feedback.recommendation.length).toBeGreaterThan(0);
      }
      const fresh = controller.restart();
      expect(fresh.currentNodeId).toBe(pack.definition.initialNodeId);
      expect(fresh.choices).toHaveLength(0);
    }
  });

  it('el control pide solo adviceId, no nombres ni conversación', () => {
    const request = readFileSync(resolve(process.cwd(), 'src/voice/requestAdviceAudio.ts'), 'utf8');
    const hook = readFileSync(resolve(process.cwd(), 'src/voice/useAdviceNarration.ts'), 'utf8');
    expect(request.includes('adviceId')).toBe(true);
    expect(request.includes('relativeName')).toBe(false);
    expect(hook.includes('learner')).toBe(false);
    expect(hook.includes('relativeName')).toBe(false);
  });
});
