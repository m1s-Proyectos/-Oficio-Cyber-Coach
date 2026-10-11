import { useMemo, useRef, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import {
  applyShopCast,
  DEFAULT_SHOP_CAST,
  sanitizeShopCast,
  type ShopCast,
} from '../../content/tiendaCast';
import { TIENDA_IPHONE_PRESENTATION, TIENDA_IPHONE_SCENARIO } from '../../content/tiendaIphone';
import { getCurrent, type Feedback, type SessionState } from '../../engine';
import { EducationalAdvice } from './EducationalAdvice';
import { PhoneShell } from './phone/PhoneShell';
import { noticeForChoiceFailure } from './sessionChoice';
import { createTiendaSessionController, startTiendaSession } from './tiendaSessionChoice';

function surfaceSubtitle(thread: string): string {
  switch (thread) {
    case 'home':
      return 'Inicio';
    case 'results':
      return 'Resultados';
    case 'note':
      return 'Nota para comparar';
    case 'casatec':
      return 'Ficha de producto';
    case 'profile':
      return 'Lumina Móvil';
    case 'shop':
      return 'iPhone 14 · $610';
    case 'reviews':
      return 'Comentarios';
    case 'terms':
      return 'Condiciones';
    case 'protect':
      return 'Protección de compra';
    case 'checkout':
      return 'Pago ficticio';
    case 'half':
      return 'Pago parcial';
    case 'paid':
      return 'Pedido';
    case 'customs':
      return 'Mensaje de la tienda';
    case 'verify':
      return 'Envíos de esta historia';
    case 'pause':
      return 'Sin adelanto extra';
    case 'recover':
      return 'Pasos de contención';
    case 'close':
      return 'Cierre educativo';
    default:
      return 'Simulado';
  }
}

function surfaceClass(surface: string): string {
  if (surface === 'social') {
    return 'phone-panel phone-panel--social';
  }
  if (surface === 'store') {
    return 'phone-panel phone-panel--store';
  }
  if (surface === 'pay') {
    return 'phone-panel phone-panel--pay';
  }
  if (surface === 'result') {
    return 'phone-result';
  }
  return 'phone-panel phone-panel--search';
}

export function TiendaIphoneSession() {
  const controllerRef = useRef(createTiendaSessionController());
  const [draft, setDraft] = useState<ShopCast>(DEFAULT_SHOP_CAST);
  const [cast, setCast] = useState<ShopCast>(DEFAULT_SHOP_CAST);
  const [state, setState] = useState<SessionState>(() => startTiendaSession());
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [lastOptionId, setLastOptionId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);

  const view = useMemo(() => getCurrent(state, TIENDA_IPHONE_SCENARIO), [state]);
  const current = view.ok ? view.value : null;
  const presentation = current ? TIENDA_IPHONE_PRESENTATION[current.node.id] : undefined;

  const bind = (text: string) => applyShopCast(text, cast);

  const handleChoose = (optionId: string) => {
    setChoosing(true);
    try {
      const result = controllerRef.current.applyOption(state, optionId);
      if (!result.ok) {
        const visible = noticeForChoiceFailure(result);
        if (visible) {
          setNotice(visible);
        }
        return;
      }
      setNotice(null);
      setLastFeedback(result.feedback);
      setLastOptionId(optionId);
      setState(result.state);
    } finally {
      setChoosing(false);
    }
  };

  const handleRestart = () => {
    setCast(sanitizeShopCast(draft));
    setState(controllerRef.current.restart());
    setLastFeedback(null);
    setLastOptionId(null);
    setNotice(null);
    setChoosing(false);
  };

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

        <div className="phone-stage">
          <form
            className="phone-cast"
            onSubmit={(event) => {
              event.preventDefault();
              setCast(sanitizeShopCast(draft));
            }}
          >
            <h2 className="phone-cast__title">Nombres de esta historia</h2>
            <p className="phone-cast__hint">
              Son ficticios y solo cambian el texto. No se guardan. Predeterminados: Alex y María.
            </p>
            <label>
              Tu nombre en el ejercicio
              <input
                value={draft.learner}
                onChange={(event) => {
                  setDraft({ ...draft, learner: event.target.value });
                }}
                maxLength={40}
                autoComplete="off"
              />
            </label>
            <label>
              Quien busca el teléfono
              <input
                value={draft.shopperName}
                onChange={(event) => {
                  setDraft({ ...draft, shopperName: event.target.value });
                }}
                maxLength={40}
                autoComplete="off"
              />
            </label>
            <Button type="submit" variant="secondary">
              Usar estos nombres en los textos
            </Button>
          </form>

          {current && presentation ? (
            <PhoneShell
              time={presentation.time}
              appLabel={presentation.appLabel}
              subtitle={surfaceSubtitle(presentation.thread)}
            >
              <div className={surfaceClass(presentation.surface)}>
                {presentation.surface === 'result' ? <h2>Cierre del ejercicio</h2> : null}
                <p>{bind(current.node.situation)}</p>
                {current.node.isTerminal ? (
                  <p>
                    No hay calificación oficial. D3 sigue pendiente. Este cierre no es un puntaje.
                  </p>
                ) : null}
              </div>

              {lastFeedback && lastOptionId ? (
                <EducationalAdvice
                  scenarioSlug={TIENDA_IPHONE_SCENARIO.slug}
                  optionId={lastOptionId}
                  explanation={bind(lastFeedback.explanation)}
                  recommendation={bind(lastFeedback.recommendation)}
                />
              ) : null}

              {!current.node.isTerminal && state.status === 'active' ? (
                <div className="phone-actions">
                  <p>{bind(current.node.prompt)}</p>
                  {current.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      disabled={choosing}
                      onClick={() => {
                        handleChoose(option.id);
                      }}
                    >
                      {bind(option.label)}
                    </button>
                  ))}
                </div>
              ) : null}
            </PhoneShell>
          ) : null}
        </div>

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
