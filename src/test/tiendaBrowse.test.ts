import { afterEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_SHOP_DRAFT, isShopCastReady, shopCastFromLearner } from '../content/tiendaCast';
import { resolveAdviceText } from '../voice/adviceCatalog';
import { resolveFeedbackAdviceId } from '../voice/resolveFeedbackAdvice';
import {
  B_VOICE_GAPS,
  B_VOICE_LINKED,
  COMMENTS_REVEAL_MS,
  decisionsForScreen,
  engineOpenForResult,
  FACEBOOK_COMMENTS,
  overlayFeedback,
  RESULTS_BY_QUERY,
  SEARCH_LOAD_MS,
  SEARCH_QUERIES,
  scheduleBrowseDelay,
  screenAfterResult,
} from '../features/simulation/tiendaBrowse';
import { start } from '../engine';
import { TIENDA_IPHONE_SCENARIO } from '../content/tiendaIphone/definition';

afterEach(() => {
  vi.useRealTimers();
});

describe('formulario B', () => {
  it('exige el nombre de quien busca y no pide otro rol', () => {
    expect(isShopCastReady(EMPTY_SHOP_DRAFT)).toBe(false);
    expect(isShopCastReady({ learner: '   ', shopperName: 'María' })).toBe(false);
    expect(isShopCastReady({ learner: 'Ana', shopperName: '' })).toBe(true);
    const cast = shopCastFromLearner('Ana');
    expect(cast.learner).toBe('Ana');
    expect(cast.shopperName).toBe('Ana');
  });
});

describe('consultas y resultados B', () => {
  it('tiene las tres consultas y tres resultados por ruta', () => {
    expect(SEARCH_QUERIES.map((item) => item.id)).toEqual(['cheap', 'official', 'deals']);
    expect(RESULTS_BY_QUERY.cheap).toHaveLength(3);
    expect(RESULTS_BY_QUERY.official).toHaveLength(3);
    expect(RESULTS_BY_QUERY.deals).toHaveLength(3);
    expect(RESULTS_BY_QUERY.deals.some((item) => item.kind === 'facebook')).toBe(true);
    expect(RESULTS_BY_QUERY.official.every((item) => item.source.includes('real') === false)).toBe(
      true,
    );
  });

  it('la ganga abre el muro simulado; oficiales y comparación no', () => {
    expect(engineOpenForResult('facebook')).toBe('open-lumina');
    expect(screenAfterResult('facebook')).toBe('facebook');
    expect(engineOpenForResult('official')).toBe('open-casatec');
    expect(engineOpenForResult('compare')).toBe('open-compare');
    expect(engineOpenForResult('listing')).toBeNull();
  });

  it('los comentarios empiezan ocultos y hay tres ficticios', () => {
    expect(FACEBOOK_COMMENTS).toHaveLength(3);
    expect(decisionsForScreen('facebook')).toHaveLength(3);
  });

  it('las tres decisiones de la publicación usan opciones del grafo actual', () => {
    const ids = decisionsForScreen('facebook').map((item) => item.optionId);
    expect(ids).toEqual(['open-shop', 'search-opinions', 'back-search-profile']);
    const started = start(TIENDA_IPHONE_SCENARIO);
    expect(started.ok).toBe(true);
  });

  it('la retroalimentación cambia según la decisión', () => {
    const risk = overlayFeedback('risk', 'facebook');
    const safe = overlayFeedback('suspect', 'facebook');
    const leave = overlayFeedback('leave', 'facebook');
    expect(risk.explanation.toLowerCase()).toContain('comentarios');
    expect(safe.explanation.toLowerCase()).toContain('bien');
    expect(leave.explanation.toLowerCase()).toContain('salir');
  });

  it('carga y comentarios usan temporizadores cancelables', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const cancel = scheduleBrowseDelay(done, SEARCH_LOAD_MS);
    vi.advanceTimersByTime(SEARCH_LOAD_MS - 1);
    expect(done).not.toHaveBeenCalled();
    cancel();
    vi.advanceTimersByTime(SEARCH_LOAD_MS);
    expect(done).not.toHaveBeenCalled();
    const cancelComments = scheduleBrowseDelay(done, COMMENTS_REVEAL_MS);
    vi.advanceTimersByTime(COMMENTS_REVEAL_MS);
    expect(done).toHaveBeenCalledTimes(1);
    cancelComments();
  });

  it('resuelve voz en decisiones seguras, arriesgadas y de salida', () => {
    expect(resolveFeedbackAdviceId('tienda-iphone', 'open-shop')).toBe(
      'tienda-iphone:review-volume',
    );
    expect(resolveAdviceText('tienda-iphone:review-volume')).toContain('opiniones');
    expect(resolveFeedbackAdviceId('tienda-iphone', 'search-opinions')).toBe(
      'tienda-iphone:own-channel-proof',
    );
    expect(resolveAdviceText('tienda-iphone:own-channel-proof')).toContain('independiente');
    expect(resolveFeedbackAdviceId('tienda-iphone', 'reject-price-after-note')).toBe(
      'tienda-iphone:low-price',
    );
    expect(resolveAdviceText('tienda-iphone:low-price')).toContain('precio');
    expect(resolveFeedbackAdviceId('tienda-iphone', 'open-lumina-informed')).toBe(
      'tienda-iphone:low-price',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'still-lumina')).toBe(
      'tienda-iphone:low-price',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'back-search-profile')).toBe(
      'tienda-iphone:leave-check',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'buy-casatec')).toBe(
      'tienda-iphone:known-channel',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'back-search')).toBe(
      'tienda-iphone:leave-check',
    );
    expect(resolveFeedbackAdviceId('tienda-iphone', 'back-search-note')).toBe(
      'tienda-iphone:leave-check',
    );
  });

  it('el texto narrado corresponde al overlay visible', () => {
    const leaveVoice = resolveAdviceText('tienda-iphone:leave-check');
    const leaveOverlay = overlayFeedback('leave', 'facebook');
    expect(leaveVoice).toBeTruthy();
    expect(leaveOverlay.explanation).toContain('Salir evitó adelantar dinero');
    expect(leaveVoice).toContain('Salir evitó adelantar dinero');
    expect(leaveVoice).toContain('fuera del anuncio');
    const officialVoice = resolveAdviceText('tienda-iphone:known-channel');
    const officialOverlay = overlayFeedback('risk', 'official');
    expect(officialVoice).toBeTruthy();
    expect(officialOverlay.explanation).toContain('precio conocido no sustituye');
    expect(officialVoice).toContain('precio conocido no sustituye');
    expect(B_VOICE_GAPS).toEqual([]);
    expect(overlayFeedback('risk', 'facebook').recommendation).toContain('texto');
    for (const group of Object.values(B_VOICE_LINKED)) {
      for (const item of group) {
        expect(resolveFeedbackAdviceId('tienda-iphone', item.optionId)).toBe(item.adviceId);
        if (item.adviceId) {
          expect(resolveAdviceText(item.adviceId)).toBeTruthy();
        }
      }
    }
  });
});
