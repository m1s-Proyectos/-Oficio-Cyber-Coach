import { Button } from '../../components/Button';
import { useBackendConfigured } from '../../app/backendStatus';
import type { VoiceAdviceId } from '../../voice/adviceCatalog';
import { resolveFeedbackAdviceId } from '../../voice/resolveFeedbackAdvice';
import { useAdviceNarration } from '../../voice/useAdviceNarration';

export function EducationalAdvice({
  scenarioSlug,
  optionId,
  explanation,
  recommendation,
}: {
  scenarioSlug: string;
  optionId: string;
  explanation: string;
  recommendation: string;
}) {
  const adviceId = resolveFeedbackAdviceId(scenarioSlug, optionId);
  const configured = useBackendConfigured();

  return (
    <aside className="phone-narration" aria-label="Consejo educativo">
      <details key={optionId} className="phone-narration__text">
        <summary>Leer el consejo</summary>
        <p>
          <strong>Qué implica:</strong> {explanation}
        </p>
        <p>
          <strong>Siguiente hábito:</strong> {recommendation}
        </p>
      </details>
      {adviceId ? (
        configured ? (
          <ConnectedNarrationControls key={optionId} adviceId={adviceId} />
        ) : (
          <NarrationControls
            statusLabel="Voz no configurada"
            detail="El texto del consejo sigue disponible. No se pide audio en este entorno."
            canPlay={false}
            canPause={false}
            canReplay={false}
            muted={false}
            hideMute
          />
        )
      ) : null}
    </aside>
  );
}

function ConnectedNarrationControls({ adviceId }: { adviceId: VoiceAdviceId }) {
  const narration = useAdviceNarration(adviceId);

  const playing = narration.status === 'playing';
  const canPlay =
    !narration.muted &&
    narration.status !== 'loading' &&
    narration.status !== 'unavailable' &&
    !playing;
  const canPause = playing;
  const canReplay = !narration.muted && narration.status !== 'loading';

  const statusLabel = narration.muted
    ? 'Voz silenciada'
    : narration.status === 'loading'
      ? 'Cargando voz'
      : playing
        ? 'Reproduciendo'
        : narration.status === 'paused'
          ? 'En pausa'
          : narration.status === 'blocked'
            ? 'Pulsa para oír'
            : narration.status === 'unavailable'
              ? 'Voz no disponible'
              : narration.status === 'ready'
                ? 'Listo para oír'
                : 'Consejo con voz';

  return (
    <NarrationControls
      statusLabel={statusLabel}
      detail={narration.message}
      canPlay={canPlay}
      canPause={canPause}
      canReplay={canReplay}
      muted={narration.muted}
      onPlay={() => {
        narration.play();
      }}
      onPause={() => {
        narration.pause();
      }}
      onReplay={() => {
        narration.replay();
      }}
      onMute={() => {
        narration.setMuted(!narration.muted);
      }}
    />
  );
}

function NarrationControls({
  statusLabel,
  detail,
  canPlay,
  canPause,
  canReplay,
  muted,
  hideMute,
  onPlay,
  onPause,
  onReplay,
  onMute,
}: {
  statusLabel: string;
  detail: string | null;
  canPlay: boolean;
  canPause: boolean;
  canReplay: boolean;
  muted: boolean;
  hideMute?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onReplay?: () => void;
  onMute?: () => void;
}) {
  return (
    <div className="phone-narration__controls" role="group" aria-label="Narración del consejo">
      <p className="phone-narration__status" aria-live="polite">
        {statusLabel}
      </p>
      {detail ? <p className="phone-narration__detail">{detail}</p> : null}
      <div className="phone-narration__actions">
        {canPause ? (
          <Button type="button" variant="ghost" size="sm" onClick={onPause}>
            Pausar
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" onClick={onPlay} disabled={!canPlay}>
            Reproducir
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onReplay} disabled={!canReplay}>
          Repetir
        </Button>
        {hideMute ? null : (
          <Button type="button" variant="ghost" size="sm" onClick={onMute}>
            {muted ? 'Activar voz' : 'Silenciar'}
          </Button>
        )}
      </div>
    </div>
  );
}
