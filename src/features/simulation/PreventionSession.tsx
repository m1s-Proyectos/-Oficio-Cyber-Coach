import { useMemo, useRef, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { applyCast, DEFAULT_CAST, sanitizeCast, type ScenarioCast } from '../../content';
import type { PreventionPresentation } from '../../content/preventionTypes';
import {
  getCurrent,
  type Feedback,
  type ScenarioDefinition,
  type SessionState,
} from '../../engine';
import { EducationalAdvice } from './EducationalAdvice';
import { PhoneShell } from './phone/PhoneShell';
import {
  createBoundSessionController,
  noticeForChoiceFailure,
  startBoundSession,
} from './preventionChoice';

export interface PreventionPack {
  definition: ScenarioDefinition;
  presentation: Readonly<Record<string, PreventionPresentation>>;
}

export function PreventionSession({ pack }: { pack: PreventionPack }) {
  const { definition, presentation: map } = pack;
  const controllerRef = useRef(createBoundSessionController(definition));
  const [draft, setDraft] = useState<ScenarioCast>(DEFAULT_CAST);
  const [cast, setCast] = useState<ScenarioCast>(DEFAULT_CAST);
  const [state, setState] = useState<SessionState>(() => startBoundSession(definition));
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [lastOptionId, setLastOptionId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);

  const view = useMemo(() => getCurrent(state, definition), [state, definition]);
  const current = view.ok ? view.value : null;
  const presentation = current ? map[current.node.id] : undefined;
  const bind = (text: string) => applyCast(text, cast);

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
    setCast(sanitizeCast(draft));
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
            { label: definition.title },
          ]}
        />

        <div className="sim-a__notice">
          <Alert tone="warning" title="Entorno ficticio">
            {definition.fictionNotice} No se piden contraseñas, OTP reales ni datos bancarios.
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
              setCast(sanitizeCast(draft));
            }}
          >
            <h2 className="phone-cast__title">Nombre de esta historia</h2>
            <p className="phone-cast__hint">
              Es ficticio y solo cambia el texto. No se guarda. Predeterminado: Alex.
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
            <Button type="submit" variant="secondary">
              Usar este nombre en los textos
            </Button>
          </form>

          {current && presentation ? (
            <PhoneShell
              time={presentation.time}
              appLabel={presentation.appLabel}
              subtitle={presentation.subtitle}
            >
              {presentation.surface === 'email' ? (
                <div className="phone-panel phone-panel--search phone-email">
                  {presentation.from ? (
                    <p className="phone-email__meta">
                      <strong>De:</strong> {presentation.from}
                    </p>
                  ) : null}
                  {presentation.subject ? (
                    <p className="phone-email__meta">
                      <strong>Asunto:</strong> {presentation.subject}
                    </p>
                  ) : null}
                  <p>{bind(current.node.situation)}</p>
                </div>
              ) : null}

              {presentation.surface === 'call' ? (
                <div className="phone-call">
                  <p className="phone-call__label">Llamada simulada</p>
                  <p className="phone-call__who">{presentation.caller ?? 'Desconocido'}</p>
                  <p>{bind(current.node.situation)}</p>
                </div>
              ) : null}

              {presentation.surface === 'sms' ? (
                <div className="phone-thread">
                  <div className="phone-bubble" data-tone="incoming">
                    <span className="phone-bubble__time">{presentation.time}</span>
                    {bind(current.node.situation)}
                  </div>
                  {presentation.smsCode ? (
                    <p className="phone-sms-code" aria-label="Código ficticio del ejercicio">
                      {presentation.smsCode}
                      <span>Código de juguete. No lo uses fuera de este ejercicio.</span>
                    </p>
                  ) : null}
                </div>
              ) : null}

              {presentation.surface === 'result' ? (
                <div className="phone-result">
                  <h2>Cierre del ejercicio</h2>
                  <p>{bind(current.node.situation)}</p>
                  <p>No hay calificación oficial. D3 sigue pendiente.</p>
                </div>
              ) : null}

              {lastFeedback && lastOptionId ? (
                <EducationalAdvice
                  scenarioSlug={definition.slug}
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
