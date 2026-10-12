import { describe, expect, it } from 'vitest';
import { TIENDA_IPHONE_SCENARIO } from '../content/tiendaIphone/definition';
import { noticeForChoiceFailure } from '../features/simulation/sessionChoice';
import { createWhatsAppSessionController } from '../features/simulation/sessionChoice';
import {
  createTiendaSessionController,
  startTiendaSession,
} from '../features/simulation/tiendaSessionChoice';

describe('createTiendaSessionController', () => {
  it('dos clics sobre el mismo estado no generan dos transiciones', () => {
    const controller = createTiendaSessionController();
    const state = startTiendaSession();
    const first = controller.applyOption(state, 'open-search');
    const second = controller.applyOption(state, 'open-search');
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (first.ok) {
      expect(first.state.currentNodeId).toBe('n_search');
    }
    if (!second.ok) {
      expect(second.state.currentNodeId).toBe('n_home');
      expect(second.reason).toBe('redundant');
      expect(noticeForChoiceFailure(second)).toBeNull();
    }
  });

  it('reinicia en el nodo inicial', () => {
    const controller = createTiendaSessionController();
    let state = startTiendaSession();
    const moved = controller.applyOption(state, 'open-search');
    expect(moved.ok).toBe(true);
    state = controller.restart();
    expect(state.currentNodeId).toBe(TIENDA_IPHONE_SCENARIO.initialNodeId);
    expect(state.choices).toHaveLength(0);
    const again = controller.applyOption(state, 'open-search');
    expect(again.ok).toBe(true);
  });

  it('no comparte transiciones con el controlador de A', () => {
    const a = createWhatsAppSessionController();
    const b = createTiendaSessionController();
    const aState = a.applyOption(a.restart(), 'open-thread');
    const bState = b.applyOption(b.restart(), 'open-search');
    expect(aState.ok).toBe(true);
    expect(bState.ok).toBe(true);
    if (aState.ok) {
      expect(aState.state.currentNodeId).toBe('n_ask200');
    }
    if (bState.ok) {
      expect(bState.state.currentNodeId).toBe('n_search');
    }
  });
});
