import { Button } from '../../components/Button';
import { useBackendConfigured } from '../../app/backendStatus';
import type { Feedback } from '../../engine';
import { resolveFeedbackAdviceId } from '../../voice/resolveFeedbackAdvice';
import { useAdviceNarration } from '../../voice/useAdviceNarration';

export function AdviceVoiceBar({
  scenarioSlug,
  feedback,
}: {
  scenarioSlug: string;
  feedback: Feedback;
}) {
  const adviceId = resolveFeedbackAdviceId(scenarioSlug, feedback);
  const configured = useBackendConfigured();

  if (!configured) {
    return (
      <VoiceChrome
        muted={false}
        statusLabel="Voz no configurada"
        detail={
          adviceId
            ? 'El texto sigue visible. Falta el backend de voz en este entorno.'
            : 'Este hábito no tiene narración en el catálogo.'
        }
        canReplay={false}
        onMute={() => undefined}
        onReplay={() => undefined}
        hideMute
      />
    );
  }

  return <ConnectedVoiceBar adviceId={adviceId} />;
}

function ConnectedVoiceBar({ adviceId }: { adviceId: ReturnType<typeof resolveFeedbackAdviceId> }) {
  const narration = useAdviceNarration(adviceId);

  if (!adviceId) {
    return (
      <VoiceChrome
        muted={narration.muted}
        statusLabel={narration.muted ? 'Voz silenciada' : 'Sin narración para este hábito'}
        detail="El consejo escrito no coincide con un identificador del catálogo de voz."
        canReplay={false}
        onMute={() => {
          narration.setMuted(!narration.muted);
        }}
        onReplay={() => undefined}
      />
    );
  }

  const statusLabel = narration.muted
    ? 'Voz silenciada'
    : narration.status === 'loading'
      ? 'Cargando voz'
      : narration.status === 'playing'
        ? 'Reproduciendo'
        : narration.status === 'blocked'
          ? 'Voz lista'
          : narration.status === 'unavailable'
            ? 'Voz no disponible'
            : 'Voz activada';

  return (
    <VoiceChrome
      muted={narration.muted}
      statusLabel={statusLabel}
      detail={narration.message}
      canReplay={!narration.muted && narration.status !== 'loading'}
      onMute={() => {
        narration.setMuted(!narration.muted);
      }}
      onReplay={() => {
        narration.replay();
      }}
    />
  );
}

function VoiceChrome({
  muted,
  statusLabel,
  detail,
  canReplay,
  hideMute,
  onMute,
  onReplay,
}: {
  muted: boolean;
  statusLabel: string;
  detail: string | null;
  canReplay: boolean;
  hideMute?: boolean;
  onMute: () => void;
  onReplay: () => void;
}) {
  return (
    <div className="phone-voice" role="group" aria-label="Narración del consejo">
      <p className="phone-voice__status">
        <span>{statusLabel}</span>
      </p>
      {detail ? <p className="phone-voice__detail">{detail}</p> : null}
      <div className="phone-voice__actions">
        {hideMute ? null : (
          <Button type="button" variant="ghost" size="sm" onClick={onMute}>
            {muted ? 'Activar voz' : 'Silenciar'}
          </Button>
        )}
        {canReplay ? (
          <Button type="button" variant="ghost" size="sm" onClick={onReplay}>
            Reproducir consejo
          </Button>
        ) : null}
      </div>
    </div>
  );
}
