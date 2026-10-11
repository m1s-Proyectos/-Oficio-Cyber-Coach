import { useMemo, useRef, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import {
  applyCast,
  DEFAULT_CAST,
  sanitizeCast,
  WHATSAPP_FAMILIAR_PRESENTATION,
  WHATSAPP_FAMILIAR_SCENARIO,
  type ScenarioCast,
} from '../../content';
import { getCurrent, type Feedback, type SessionState } from '../../engine';
import { AdviceVoiceBar } from './AdviceVoiceBar';
import { PhoneShell } from './phone/PhoneShell';
import {
  createWhatsAppSessionController,
  noticeForChoiceFailure,
  startWhatsAppSession,
} from './sessionChoice';

function threadSubtitle(thread: string, cast: ScenarioCast): string {
  switch (thread) {
    case 'lock':
      return 'Pantalla de aviso';
    case 'suspect':
      return cast.relativeName;
    case 'call':
      return `Número habitual de ${cast.relativeName}`;
    case 'other':
      return 'Otra persona de confianza';
    case 'pause':
      return 'Pausa · sin envío';
    case 'block':
      return 'Contacto bloqueado';
    case 'recover':
      return 'Pasos después del envío';
    case 'close':
      return 'Cierre educativo';
    default:
      return 'Mensajes';
  }
}

export function WhatsAppFamiliarSession() {
  const controllerRef = useRef(createWhatsAppSessionController());
  const [draft, setDraft] = useState<ScenarioCast>(DEFAULT_CAST);
  const [cast, setCast] = useState<ScenarioCast>(DEFAULT_CAST);
  const [state, setState] = useState<SessionState>(() => startWhatsAppSession());
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);

  const view = useMemo(() => getCurrent(state, WHATSAPP_FAMILIAR_SCENARIO), [state]);
  const current = view.ok ? view.value : null;
  const presentation = current ? WHATSAPP_FAMILIAR_PRESENTATION[current.node.id] : undefined;

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
      setState(result.state);
    } finally {
      setChoosing(false);
    }
  };

  const handleRestart = () => {
    const nextCast = sanitizeCast(draft);
    setCast(nextCast);
    setState(controllerRef.current.restart());
    setLastFeedback(null);
    setNotice(null);
    setChoosing(false);
  };

  const applyNames = () => {
    setCast(sanitizeCast(draft));
  };

  return (
    <Container size="wide">
      <div className="sim-a">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: 'home' },
            { label: 'Simulaciones', to: 'home' },
            { label: WHATSAPP_FAMILIAR_SCENARIO.title },
          ]}
        />

        <div className="sim-a__notice">
          <Alert tone="warning" title="Entorno ficticio">
            {WHATSAPP_FAMILIAR_SCENARIO.fictionNotice} La app se llama «Mensajes». No es un servicio
            real y no pide datos bancarios ni contraseñas.
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
              applyNames();
            }}
          >
            <h2 className="phone-cast__title">Nombres de esta historia</h2>
            <p className="phone-cast__hint">
              Son ficticios y solo cambian el texto. No se guardan. Predeterminados: Alex, Diego,
              hijo.
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
              Nombre del familiar
              <input
                value={draft.relativeName}
                onChange={(event) => {
                  setDraft({ ...draft, relativeName: event.target.value });
                }}
                maxLength={40}
                autoComplete="off"
              />
            </label>
            <label>
              Relación (hijo, hermana…)
              <input
                value={draft.relationship}
                onChange={(event) => {
                  setDraft({ ...draft, relationship: event.target.value });
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
              subtitle={threadSubtitle(presentation.thread, cast)}
            >
              {presentation.surface === 'notification' ? (
                <div className="phone-lock">
                  <p className="phone-lock__time">{presentation.time}</p>
                  <div className="phone-lock__card">
                    <p className="phone-lock__app">{presentation.appLabel}</p>
                    <p>{bind(current.node.situation)}</p>
                  </div>
                </div>
              ) : null}

              {presentation.surface === 'messenger' ? (
                <div className="phone-thread">
                  <div
                    className="phone-bubble"
                    data-tone={presentation.thread === 'suspect' ? 'incoming' : 'system'}
                  >
                    <span className="phone-bubble__time">{presentation.time}</span>
                    {bind(current.node.situation)}
                  </div>
                </div>
              ) : null}

              {presentation.surface === 'result' ? (
                <div className="phone-result">
                  <h2>Cierre del ejercicio</h2>
                  <p>{bind(current.node.situation)}</p>
                  <p>
                    No hay calificación oficial. D3 sigue pendiente. Este cierre no es un puntaje.
                  </p>
                </div>
              ) : null}

              {lastFeedback ? (
                <div className="phone-feedback">
                  <p>
                    <strong>Qué implica:</strong> {bind(lastFeedback.explanation)}
                  </p>
                  <p>
                    <strong>Siguiente hábito:</strong> {bind(lastFeedback.recommendation)}
                  </p>
                  <AdviceVoiceBar
                    scenarioSlug={WHATSAPP_FAMILIAR_SCENARIO.slug}
                    feedback={lastFeedback}
                  />
                </div>
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
