import { useMemo, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import {
  complete,
  choose,
  getCurrent,
  start,
  type Feedback,
  type ScenarioDefinition,
  type SessionState,
  type SimulationResult,
} from '../../engine';

function requireStart(definition: ScenarioDefinition): SessionState {
  const result = start(definition);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
}

/**
 * Reproductor mínimo del motor. Solo se usa con el fixture de la Fase 04.
 * No calcula puntajes de las historias oficiales ni persiste la sesión.
 */
export function EngineSession({ definition }: { definition: ScenarioDefinition }) {
  const [state, setState] = useState<SessionState>(() => requireStart(definition));
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const view = useMemo(() => getCurrent(state, definition), [definition, state]);
  const current = view.ok ? view.value : null;

  const handleChoose = (optionId: string) => {
    const result = choose(state, definition, optionId);
    if (!result.ok) {
      setNotice(result.error.message);
      return;
    }
    setNotice(null);
    setLastFeedback(result.value.feedback);
    setState(result.value.state);
  };

  const handleComplete = () => {
    const result = complete(state, definition);
    if (!result.ok) {
      setNotice(result.error.message);
      return;
    }
    setNotice(null);
    setState(result.value.state);
  };

  const handleRestart = () => {
    setState(requireStart(definition));
    setLastFeedback(null);
    setNotice(null);
  };

  return (
    <Container size="narrow">
      <Breadcrumbs
        items={[
          { label: 'Inicio', to: 'home' },
          { label: 'Simulaciones', to: 'home' },
          { label: definition.title },
        ]}
      />

      <article className="stack" data-gap="lg" aria-labelledby="scenario-title">
        <header className="stack" data-gap="sm">
          <p className="section-head__eyebrow">Fixture del motor · no es un guion oficial</p>
          <h1 id="scenario-title" className="section-head__title">
            {definition.title}
          </h1>
          <div className="row">
            <Badge tone="preview">Fase 04</Badge>
            <Badge tone="info">Sesión en memoria</Badge>
          </div>
        </header>

        <Alert tone="warning" title="Escenario de prueba">
          {definition.fictionNotice} Las historias de WhatsApp y de la tienda siguen en vista
          previa. Este recorrido solo demuestra transiciones y un desglose del fixture.
        </Alert>

        {notice ? (
          <Alert tone="danger" title="La decisión no se aplicó">
            {notice}
          </Alert>
        ) : null}

        {current ? (
          <section aria-labelledby="situation-heading" className="stack" data-gap="sm">
            <h2
              id="situation-heading"
              className="section-head__title"
              style={{ fontSize: '1.25rem' }}
            >
              Situación
            </h2>
            <div className="chat-bubble">
              <p className="chat-bubble__body">{current.node.situation}</p>
            </div>
          </section>
        ) : null}

        {lastFeedback ? (
          <Alert tone="info" title="Después de tu decisión">
            <p>{lastFeedback.explanation}</p>
            <p>{lastFeedback.recommendation}</p>
          </Alert>
        ) : null}

        {current && !current.node.isTerminal && state.status === 'active' ? (
          <section aria-labelledby="options-heading" className="stack" data-gap="sm">
            <h2
              id="options-heading"
              className="section-head__title"
              style={{ fontSize: '1.25rem' }}
            >
              {current.node.prompt}
            </h2>
            <ul className="decision-list">
              {current.options.map((option, index) => (
                <li key={option.id}>
                  <button
                    type="button"
                    className="decision-option"
                    onClick={() => {
                      handleChoose(option.id);
                    }}
                  >
                    <span className="decision-option__key" aria-hidden="true">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="decision-option__text">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {current?.node.isTerminal && state.status === 'active' ? (
          <div className="row">
            <Button type="button" onClick={handleComplete}>
              Cerrar el ejercicio
            </Button>
          </div>
        ) : null}

        {state.result ? <FixtureResult result={state.result} /> : null}

        <div className="row">
          <Button type="button" variant="secondary" onClick={handleRestart}>
            Reiniciar el fixture
          </Button>
          <Button as="link" to="home" variant="ghost">
            ← Volver al inicio
          </Button>
        </div>
      </article>
    </Container>
  );
}

function FixtureResult({ result }: { result: SimulationResult }) {
  return (
    <section aria-labelledby="fixture-result-heading" className="stack" data-gap="sm">
      <h2
        id="fixture-result-heading"
        className="section-head__title"
        style={{ fontSize: '1.25rem' }}
      >
        Desglose del fixture
      </h2>
      <p className="section-head__subtitle">
        Estos números salen de las reglas del escenario de prueba, no de las historias oficiales. El
        puntaje oficial se calculará en el servidor en la Fase 07.
      </p>
      <p>
        Total del fixture: <strong>{result.total}</strong>
      </p>
      <ul>
        <li>Reconocimiento: {result.breakdown.recognition}</li>
        <li>Verificación: {result.breakdown.verification}</li>
        <li>Contención: {result.breakdown.containment}</li>
        <li>Recuperación: {result.breakdown.recovery}</li>
      </ul>
      {result.recommendations.length > 0 ? (
        <ul>
          {result.recommendations.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
