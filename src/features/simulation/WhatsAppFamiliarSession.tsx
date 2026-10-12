import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import {
  applyCast,
  isCastReady,
  sanitizeCast,
  WHATSAPP_FAMILIAR_PRESENTATION,
  WHATSAPP_FAMILIAR_SCENARIO,
  type ScenarioCast,
} from '../../content';
import { getCurrent, type Feedback, type SessionState } from '../../engine';
import { EducationalAdvice } from './EducationalAdvice';
import { CompletionCelebration } from '../../components/CompletionCelebration';
import { ChatThread } from './phone/ChatThread';
import { PhoneShell } from './phone/PhoneShell';
import {
  createWhatsAppSessionController,
  noticeForChoiceFailure,
  startWhatsAppSession,
} from './sessionChoice';
import {
  briefOutgoingReply,
  canChooseAtPhase,
  contactInitials,
  EMPTY_CAST_DRAFT,
  FIRST_INCOMING_DELAY_MS,
  FOLLOWUP_WAIT_MS,
  incomingSenderLabel,
  NOTIFY_INCOMING_BODY,
  scheduleProgressiveMessage,
  TYPING_DELAY_MS,
  type ChatLine,
  type ChatRevealPhase,
} from './whatsappStart';

function threadSubtitle(thread: string, cast: ScenarioCast): string {
  switch (thread) {
    case 'lock':
    case 'suspect':
      return `${cast.relativeName} · ${cast.relationship}`;
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
  const [draft, setDraft] = useState<ScenarioCast>(EMPTY_CAST_DRAFT);
  const [cast, setCast] = useState<ScenarioCast>(EMPTY_CAST_DRAFT);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<SessionState | null>(null);
  const [revealPhase, setRevealPhase] = useState<ChatRevealPhase>('wait');
  const [lines, setLines] = useState<ChatLine[]>([]);
  const revealedNodeRef = useRef<string | null>(null);
  const inflightNodeRef = useRef<string | null>(null);
  const lineSeqRef = useRef(0);
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [lastOptionId, setLastOptionId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);

  const view = useMemo(
    () => (state ? getCurrent(state, WHATSAPP_FAMILIAR_SCENARIO) : null),
    [state],
  );
  const current = view?.ok ? view.value : null;
  const presentation = current ? WHATSAPP_FAMILIAR_PRESENTATION[current.node.id] : undefined;
  const atNotify = current?.node.id === 'n_notify';
  const isSuspectChat = presentation?.surface === 'messenger' && presentation.thread === 'suspect';
  const showChatThread = Boolean(atNotify || isSuspectChat);
  const currentNodeId = current?.node.id;
  const currentSituation = current?.node.situation;
  const presentationTime = presentation?.time;

  const bind = (text: string) => applyCast(text, cast);

  const pushLine = (tone: ChatLine['tone'], body: string, time: string) => {
    lineSeqRef.current += 1;
    const id = `${tone}-${lineSeqRef.current}`;
    setLines((prev) => [...prev, { id, tone, body, time }]);
  };

  useEffect(() => {
    if (!started || !currentNodeId || !currentSituation || !presentationTime) {
      return undefined;
    }
    const nodeId = currentNodeId;
    if (revealedNodeRef.current === nodeId) {
      return undefined;
    }

    const situation = applyCast(currentSituation, cast);
    const time = presentationTime;

    if (atNotify || isSuspectChat) {
      inflightNodeRef.current = nodeId;
      setRevealPhase('wait');
      const cancel = scheduleProgressiveMessage({
        waitMs: atNotify ? FIRST_INCOMING_DELAY_MS : FOLLOWUP_WAIT_MS,
        typingMs: TYPING_DELAY_MS,
        onTyping: () => {
          if (inflightNodeRef.current === nodeId) {
            setRevealPhase('typing');
          }
        },
        onVisible: () => {
          if (inflightNodeRef.current !== nodeId) {
            return;
          }
          revealedNodeRef.current = nodeId;
          inflightNodeRef.current = null;
          pushLine('incoming', atNotify ? NOTIFY_INCOMING_BODY : situation, time);
          setRevealPhase('visible');
        },
      });
      return () => {
        cancel();
        if (revealedNodeRef.current !== nodeId) {
          inflightNodeRef.current = null;
        }
      };
    }

    revealedNodeRef.current = nodeId;
    setRevealPhase('visible');
    return undefined;
  }, [started, currentNodeId, currentSituation, presentationTime, atNotify, isSuspectChat, cast]);

  const handleStart = () => {
    if (!isCastReady(draft)) {
      setStartError('Escribe los tres nombres para empezar.');
      return;
    }
    const nextCast = sanitizeCast(draft);
    setCast(nextCast);
    setState(startWhatsAppSession());
    setRevealPhase('wait');
    setLines([]);
    revealedNodeRef.current = null;
    inflightNodeRef.current = null;
    lineSeqRef.current = 0;
    setLastFeedback(null);
    setLastOptionId(null);
    setNotice(null);
    setStartError(null);
    setStarted(true);
  };

  const handleChoose = (optionId: string) => {
    if (!state) {
      return;
    }
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
      const nextPres = WHATSAPP_FAMILIAR_PRESENTATION[result.state.currentNodeId];
      const nextIsSuspect = nextPres?.surface === 'messenger' && nextPres.thread === 'suspect';
      if (isSuspectChat && nextIsSuspect) {
        const brief = briefOutgoingReply(optionId);
        if (brief) {
          pushLine('outgoing', brief, presentation?.time ?? '10:42');
        }
      }
      setRevealPhase(nextIsSuspect ? 'wait' : 'visible');
      setState(result.state);
    } finally {
      setChoosing(false);
    }
  };

  const handleRestart = () => {
    setDraft(EMPTY_CAST_DRAFT);
    setCast(EMPTY_CAST_DRAFT);
    setStarted(false);
    setState(null);
    setRevealPhase('wait');
    setLines([]);
    revealedNodeRef.current = null;
    inflightNodeRef.current = null;
    lineSeqRef.current = 0;
    setLastFeedback(null);
    setLastOptionId(null);
    setNotice(null);
    setStartError(null);
    setChoosing(false);
    controllerRef.current.restart();
  };

  return (
    <Container size="wide">
      <CompletionCelebration active={Boolean(current?.node.isTerminal)} />
      <div className="sim-a">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: 'home' },
            { label: 'Laboratorios', to: 'simulationCatalog' },
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
              Estos nombres son ficticios y solo se usan en esta historia. No se guardan. Los tres
              campos son obligatorios.
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
                required
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
                required
              />
            </label>
            <label>
              Relación familiar
              <input
                value={draft.relationship}
                onChange={(event) => {
                  setDraft({ ...draft, relationship: event.target.value });
                }}
                maxLength={40}
                autoComplete="off"
                required
                placeholder="hijo, hermana, padre…"
              />
            </label>
            {startError ? <p className="phone-cast__error">{startError}</p> : null}
            <Button type="submit">Empezar simulación</Button>
          </form>
        ) : current && presentation && state ? (
          <div className="phone-stage phone-stage--play">
            <PhoneShell
              time={presentation.time}
              appLabel={presentation.appLabel}
              subtitle={threadSubtitle(presentation.thread, cast)}
              variant={showChatThread ? 'chat' : 'default'}
              contactName={incomingSenderLabel(cast)}
              contactInitials={contactInitials(cast.relativeName)}
              headerStatus={
                revealPhase === 'typing'
                  ? 'escribiendo…'
                  : threadSubtitle(presentation.thread, cast)
              }
            >
              {showChatThread ? (
                <ChatThread
                  lines={lines}
                  typing={revealPhase === 'typing'}
                  senderName={incomingSenderLabel(cast)}
                />
              ) : null}

              {!showChatThread && presentation.surface === 'messenger' ? (
                <div className="phone-thread">
                  <div className="phone-bubble" data-tone="system">
                    <span className="phone-bubble__time">{presentation.time}</span>
                    {bind(current.node.situation)}
                  </div>
                </div>
              ) : null}

              {!atNotify && presentation.surface === 'notification' ? (
                <div className="phone-lock">
                  <p className="phone-lock__time">{presentation.time}</p>
                  <div className="phone-lock__card">
                    <p className="phone-lock__app">{presentation.appLabel}</p>
                    <p>{bind(current.node.situation)}</p>
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

              {lastFeedback && lastOptionId ? (
                <EducationalAdvice
                  scenarioSlug={WHATSAPP_FAMILIAR_SCENARIO.slug}
                  optionId={lastOptionId}
                  explanation={bind(lastFeedback.explanation)}
                  recommendation={bind(lastFeedback.recommendation)}
                />
              ) : null}

              {!current.node.isTerminal &&
              state.status === 'active' &&
              canChooseAtPhase(revealPhase) ? (
                <div className="phone-actions">
                  <p>{bind(current.node.prompt)}</p>
                  {current.options.slice(0, 3).map((option) => (
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
          </div>
        ) : null}

        <div className="row">
          <Button type="button" variant="secondary" onClick={handleRestart}>
            Reiniciar en memoria
          </Button>
          <Button as="link" to="simulationCatalog" variant="ghost">
            ← Todos los laboratorios
          </Button>
        </div>
      </div>
    </Container>
  );
}
