import { useMemo, useRef, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import {
  applyShopCast,
  EMPTY_SHOP_DRAFT,
  isShopCastReady,
  shopCastFromLearner,
  type ShopCast,
} from '../../content/tiendaCast';
import { TIENDA_IPHONE_SCENARIO } from '../../content/tiendaIphone';
import { getCurrent, type Feedback, type SessionState } from '../../engine';
import { EducationalAdvice } from './EducationalAdvice';
import { FacebookListing } from './phone/FacebookListing';
import { PhoneShell } from './phone/PhoneShell';
import { SearchBrowser } from './phone/SearchBrowser';
import { noticeForChoiceFailure } from './sessionChoice';
import {
  COMMENTS_REVEAL_MS,
  decisionsForScreen,
  engineOpenForResult,
  overlayFeedback,
  RESULTS_BY_QUERY,
  SEARCH_LOAD_MS,
  scheduleBrowseDelay,
  screenAfterResult,
  type BrowseScreen,
  type ImmersiveDecision,
  type SearchQuery,
  type SearchQueryId,
  type SearchResult,
} from './tiendaBrowse';
import { createTiendaSessionController, startTiendaSession } from './tiendaSessionChoice';

function backToSearchOption(nodeId: string): string | null {
  if (nodeId === 'n_profile') {
    return 'back-search-profile';
  }
  if (nodeId === 'n_casatec') {
    return 'back-search';
  }
  if (nodeId === 'n_compare') {
    return 'back-search-note';
  }
  return null;
}

export function TiendaIphoneSession() {
  const controllerRef = useRef(createTiendaSessionController());
  const [draft, setDraft] = useState<ShopCast>(EMPTY_SHOP_DRAFT);
  const [cast, setCast] = useState<ShopCast>(EMPTY_SHOP_DRAFT);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<SessionState | null>(null);
  const [screen, setScreen] = useState<BrowseScreen>('empty');
  const [queryId, setQueryId] = useState<SearchQueryId | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [lastOptionId, setLastOptionId] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<{ explanation: string; recommendation: string } | null>(
    null,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);
  const cancelBrowseRef = useRef<(() => void) | null>(null);

  const view = useMemo(() => (state ? getCurrent(state, TIENDA_IPHONE_SCENARIO) : null), [state]);
  const current = view?.ok ? view.value : null;
  const bind = (text: string) => applyShopCast(text, cast);
  const results = queryId && screen === 'results' ? RESULTS_BY_QUERY[queryId] : [];

  const applyEngine = (live: SessionState, optionId: string) => {
    const result = controllerRef.current.applyOption(live, optionId);
    if (!result.ok) {
      const visible = noticeForChoiceFailure(result);
      if (visible) {
        setNotice(visible);
      }
      return null;
    }
    setNotice(null);
    setState(result.state);
    return result;
  };

  const clearBrowseTimer = () => {
    cancelBrowseRef.current?.();
    cancelBrowseRef.current = null;
  };

  const handleStart = () => {
    if (!isShopCastReady(draft)) {
      setStartError('Escribe tu nombre para empezar.');
      return;
    }
    const nextCast = shopCastFromLearner(draft.learner);
    setCast(nextCast);
    setDraft(nextCast);
    clearBrowseTimer();
    setState(startTiendaSession());
    setScreen('empty');
    setQueryId(null);
    setCommentsOpen(false);
    setLastFeedback(null);
    setLastOptionId(null);
    setOverlay(null);
    setNotice(null);
    setStartError(null);
    setStarted(true);
  };

  const runQuery = (query: SearchQuery, fromState: SessionState) => {
    setQueryId(query.id);
    setScreen('loading');
    setCommentsOpen(false);
    setOverlay(null);
    setLastFeedback(null);
    setLastOptionId(null);
    clearBrowseTimer();
    cancelBrowseRef.current = scheduleBrowseDelay(() => {
      let live = fromState;
      if (live.currentNodeId === 'n_home') {
        const opened = applyEngine(live, 'open-search');
        if (!opened) {
          setScreen('empty');
          return;
        }
        live = opened.state;
      }
      setScreen('results');
      cancelBrowseRef.current = null;
    }, SEARCH_LOAD_MS);
  };

  const handleQuery = (query: SearchQuery) => {
    if (!state || choosing) {
      return;
    }
    setChoosing(true);
    try {
      let live = state;
      const back = backToSearchOption(live.currentNodeId);
      if (back) {
        const returned = applyEngine(live, back);
        if (!returned) {
          return;
        }
        live = returned.state;
      }
      runQuery(query, live);
    } finally {
      setChoosing(false);
    }
  };

  const handleOpenResult = (result: SearchResult) => {
    if (!state || choosing) {
      return;
    }
    const optionId = engineOpenForResult(result.kind);
    const nextScreen = screenAfterResult(result.kind);
    if (!optionId || !nextScreen) {
      return;
    }
    setChoosing(true);
    try {
      const applied = applyEngine(state, optionId);
      if (!applied) {
        return;
      }
      setScreen(nextScreen);
      setCommentsOpen(false);
      setOverlay(null);
      setLastFeedback(null);
      setLastOptionId(null);
    } finally {
      setChoosing(false);
    }
  };

  const handleOpenComments = () => {
    clearBrowseTimer();
    cancelBrowseRef.current = scheduleBrowseDelay(() => {
      setCommentsOpen(true);
      cancelBrowseRef.current = null;
    }, COMMENTS_REVEAL_MS);
  };

  const handleDecision = (intent: ImmersiveDecision, optionId: string) => {
    if (!state || choosing) {
      return;
    }
    setChoosing(true);
    try {
      const applied = applyEngine(state, optionId);
      if (!applied) {
        return;
      }
      if (optionId === 'still-lumina' || optionId === 'open-lumina-informed') {
        setScreen('facebook');
        setCommentsOpen(false);
        setOverlay(null);
        setLastFeedback(null);
        setLastOptionId(null);
        return;
      }
      setLastFeedback(applied.feedback);
      setLastOptionId(optionId);
      setOverlay(overlayFeedback(intent, screen));
      setScreen('decided');
    } finally {
      setChoosing(false);
    }
  };

  const handleRestart = () => {
    clearBrowseTimer();
    setDraft(EMPTY_SHOP_DRAFT);
    setCast(EMPTY_SHOP_DRAFT);
    setStarted(false);
    setState(null);
    setScreen('empty');
    setQueryId(null);
    setCommentsOpen(false);
    setLastFeedback(null);
    setLastOptionId(null);
    setOverlay(null);
    setNotice(null);
    setStartError(null);
    setChoosing(false);
    controllerRef.current.restart();
  };

  const decisions = decisionsForScreen(screen);
  const appLabel = screen === 'facebook' ? 'Muro' : screen === 'official' ? 'CasaTec' : 'BuscaYa';
  const subtitle =
    screen === 'facebook'
      ? 'Publicación comercial'
      : screen === 'official'
        ? 'Ficha de referencia'
        : screen === 'compare'
          ? 'Nota para comparar'
          : screen === 'results'
            ? 'Resultados'
            : 'Inicio';

  return (
    <Container size="wide">
      <div className="sim-a">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: 'home' },
            { label: 'Simulaciones', to: 'home' },
            { label: TIENDA_IPHONE_SCENARIO.title },
          ]}
        />

        <div className="sim-a__notice">
          <Alert tone="warning" title="Entorno ficticio">
            {TIENDA_IPHONE_SCENARIO.fictionNotice}
          </Alert>
        </div>

        {notice ? (
          <Alert tone="danger" title="La decisión no se aplicó">
            {notice}
          </Alert>
        ) : null}

        {!started ? (
          <form
            className="phone-cast phone-cast--setup"
            onSubmit={(event) => {
              event.preventDefault();
              handleStart();
            }}
          >
            <h2 className="phone-cast__title">Antes de empezar</h2>
            <p className="phone-cast__hint">
              Has ahorrado $700 para comprar un iPhone. Encuentras distintas ofertas en Internet y
              quieres encontrar una buena opción sin perder tu dinero. El nombre es ficticio y no se
              guarda.
            </p>
            <label>
              Nombre de quien realizará la prueba
              <input
                value={draft.learner}
                onChange={(event) => {
                  setDraft({
                    ...draft,
                    learner: event.target.value,
                    shopperName: event.target.value,
                  });
                }}
                maxLength={40}
                autoComplete="off"
                required
              />
            </label>
            {startError ? <p className="phone-cast__error">{startError}</p> : null}
            <Button type="submit">Empezar simulación</Button>
          </form>
        ) : (
          <div className="phone-stage phone-stage--play">
            <PhoneShell time="16:10" appLabel={appLabel} subtitle={subtitle} variant="default">
              {screen === 'empty' || screen === 'loading' || screen === 'results' ? (
                <SearchBrowser
                  queryId={queryId}
                  results={results}
                  loading={screen === 'loading'}
                  empty={screen === 'empty'}
                  onQuery={handleQuery}
                  onOpenResult={handleOpenResult}
                />
              ) : null}

              {screen === 'facebook' ? (
                <FacebookListing commentsOpen={commentsOpen} onOpenComments={handleOpenComments} />
              ) : null}

              {screen === 'official' ? (
                <div className="phone-panel phone-panel--store">
                  <p>
                    <strong>CasaTec</strong> · iPhone 14 · $1.190
                  </p>
                  <p>
                    Comercio de referencia de esta historia. Retiro en tienda ficticia. No es un
                    comercio real.
                  </p>
                </div>
              ) : null}

              {screen === 'compare' ? (
                <div className="phone-panel phone-panel--search">
                  <p>
                    Precio de referencia en este relato: cerca de $1.190. Mira quién vende,
                    opiniones fuera del anuncio y si el pago te protege.
                  </p>
                </div>
              ) : null}

              {screen === 'decided' && overlay && lastFeedback && lastOptionId ? (
                <EducationalAdvice
                  key={lastOptionId}
                  scenarioSlug={TIENDA_IPHONE_SCENARIO.slug}
                  optionId={lastOptionId}
                  explanation={bind(overlay.explanation)}
                  recommendation={bind(overlay.recommendation)}
                />
              ) : null}

              {decisions.length > 0 && (screen !== 'facebook' || commentsOpen) ? (
                <div className="phone-actions">
                  <p>¿Qué harías en esta situación?</p>
                  {decisions.map((decision) => (
                    <button
                      key={decision.optionId}
                      type="button"
                      disabled={choosing}
                      onClick={() => {
                        handleDecision(decision.intent, decision.optionId);
                      }}
                    >
                      {decision.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {current && screen === 'decided' && current.node.isTerminal ? (
                <p className="search-browser__empty">
                  No hay calificación oficial. D3 sigue pendiente. La compra no se realizó.
                </p>
              ) : null}
            </PhoneShell>
          </div>
        )}

        <div className="row">
          <Button type="button" variant="secondary" onClick={handleRestart}>
            Reiniciar en memoria
          </Button>
          <Button as="link" to="home" variant="ghost">
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </Container>
  );
}
