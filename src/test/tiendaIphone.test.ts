import { describe, expect, it } from 'vitest';
import { applyShopCast, DEFAULT_SHOP_CAST } from '../content/tiendaCast';
import { TIENDA_IPHONE_SCENARIO } from '../content/tiendaIphone/definition';
import { TIENDA_IPHONE_PRESENTATION } from '../content/tiendaIphone/presentation';
import { UNOFFICIAL_ZERO_POINTS } from '../content/tiendaIphone/zeroPoints';
import { WHATSAPP_FAMILIAR_SCENARIO } from '../content/whatsappFamiliar/definition';
import { choose, complete, start, validateDefinition } from '../engine';
import type { SessionState } from '../engine';

function mustStart(): SessionState {
  const result = start(TIENDA_IPHONE_SCENARIO);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function mustChoose(state: SessionState, optionId: string): SessionState {
  const result = choose(state, TIENDA_IPHONE_SCENARIO, optionId);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value.state;
}

function optionIds(): string[] {
  return Object.values(TIENDA_IPHONE_SCENARIO.nodes).flatMap((node) =>
    node.options.map((option) => option.id),
  );
}

describe('guion B tienda-iphone', () => {
  it('valida el grafo D5', () => {
    const result = validateDefinition(TIENDA_IPHONE_SCENARIO);
    expect(result.ok).toBe(true);
  });

  it('tiene ids únicos y destinos existentes', () => {
    const nodeIds = Object.keys(TIENDA_IPHONE_SCENARIO.nodes);
    expect(new Set(nodeIds).size).toBe(nodeIds.length);
    const ids = optionIds();
    expect(new Set(ids).size).toBe(ids.length);
    for (const node of Object.values(TIENDA_IPHONE_SCENARIO.nodes)) {
      expect(TIENDA_IPHONE_PRESENTATION[node.id]).toBeDefined();
      if (node.isTerminal) {
        expect(node.options).toHaveLength(0);
      } else {
        expect(node.options.length).toBeGreaterThan(0);
      }
      for (const option of node.options) {
        expect(TIENDA_IPHONE_SCENARIO.nodes[option.nextNodeId]).toBeDefined();
      }
    }
  });

  it('no asigna puntos oficiales', () => {
    for (const node of Object.values(TIENDA_IPHONE_SCENARIO.nodes)) {
      for (const option of node.options) {
        expect(option.evaluation.points).toEqual(UNOFFICIAL_ZERO_POINTS);
      }
    }
  });

  it('el extra de $100 solo aparece después de $610', () => {
    let state = mustChoose(mustStart(), 'open-search');
    state = mustChoose(state, 'open-lumina');
    state = mustChoose(state, 'open-shop');
    state = mustChoose(state, 'go-checkout');
    const half = mustChoose(state, 'pay-half');
    expect(half.currentNodeId).toBe('n_half');
    const halfNode = TIENDA_IPHONE_SCENARIO.nodes.n_half;
    expect(halfNode?.options.some((option) => option.nextNodeId === 'n_customs')).toBe(false);
    const stopped = mustChoose(half, 'stop-half');
    expect(stopped.currentNodeId).toBe('n_recover_half');

    const paid = mustChoose(mustChoose(state, 'pay-610'), 'wait-delivery');
    expect(paid.currentNodeId).toBe('n_customs');
  });

  it('completar $305 + $305 llega a aduana y t_recover', () => {
    let state = mustChoose(mustStart(), 'open-search');
    state = mustChoose(state, 'open-lumina');
    state = mustChoose(state, 'open-shop');
    state = mustChoose(state, 'go-checkout');
    state = mustChoose(state, 'pay-half');
    state = mustChoose(state, 'pay-rest');
    expect(state.currentNodeId).toBe('n_paid');
    state = mustChoose(state, 'wait-delivery');
    state = mustChoose(state, 'stop-100');
    state = mustChoose(state, 'ack-recover');
    expect(state.currentNodeId).toBe('t_recover');
    const closed = complete(state, TIENDA_IPHONE_SCENARIO);
    expect(closed.ok).toBe(true);
    if (closed.ok) {
      expect(closed.value.result.total).toBe(0);
    }
  });

  it('permite ciclos y salidas seguras', () => {
    let state = mustChoose(mustStart(), 'open-search');
    state = mustChoose(state, 'open-lumina');
    state = mustChoose(state, 'back-search-profile');
    expect(state.currentNodeId).toBe('n_search');
    state = mustChoose(state, 'open-lumina');
    state = mustChoose(state, 'open-shop');
    state = mustChoose(state, 'leave-informed-shop');
    expect(state.currentNodeId).toBe('t_safe');

    const reviews = mustChoose(
      mustChoose(mustChoose(mustChoose(mustStart(), 'open-search'), 'open-lumina'), 'open-shop'),
      'read-reviews',
    );
    expect(mustChoose(reviews, 'leave-informed-reviews').currentNodeId).toBe('t_safe');
    expect(mustChoose(mustChoose(mustStart(), 'open-search'), 'reject-price').currentNodeId).toBe(
      't_price_reject',
    );
    expect(mustChoose(mustChoose(mustStart(), 'open-search'), 'open-casatec').currentNodeId).toBe(
      'n_casatec',
    );
    expect(
      mustChoose(mustChoose(mustChoose(mustStart(), 'open-search'), 'open-casatec'), 'buy-casatec')
        .currentNodeId,
    ).toBe('t_known');
  });

  it('aplica el elenco solo al texto', () => {
    const text = applyShopCast('{{learner}} ayuda a {{shopperName}}.', {
      ...DEFAULT_SHOP_CAST,
      learner: 'Pat',
      shopperName: 'Nuria',
    });
    expect(text).toBe('Pat ayuda a Nuria.');
    expect(TIENDA_IPHONE_SCENARIO.initialNodeId).toBe('n_home');
    expect(TIENDA_IPHONE_SCENARIO.nodes.n_half?.options[0]?.nextNodeId).toBe('n_paid');
  });

  it('no altera el grafo de A', () => {
    expect(WHATSAPP_FAMILIAR_SCENARIO.initialNodeId).toBe('n_notify');
    expect(WHATSAPP_FAMILIAR_SCENARIO.slug).toBe('whatsapp-familiar');
    expect(TIENDA_IPHONE_SCENARIO.slug).toBe('tienda-iphone');
    expect(Object.keys(WHATSAPP_FAMILIAR_SCENARIO.nodes)).not.toContain('n_customs');
  });
});
