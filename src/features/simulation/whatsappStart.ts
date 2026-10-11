import type { ScenarioCast } from '../../content';

export const FIRST_INCOMING_DELAY_MS = 500;
export const TYPING_DELAY_MS = 800;
export const FOLLOWUP_WAIT_MS = 180;

export type ChatRevealPhase = 'wait' | 'typing' | 'visible';

export type ChatLineTone = 'incoming' | 'outgoing' | 'system';

export interface ChatLine {
  id: string;
  tone: ChatLineTone;
  body: string;
  time: string;
}

export const EMPTY_CAST_DRAFT: ScenarioCast = {
  learner: '',
  relativeName: '',
  relationship: '',
};

export const NOTIFY_INCOMING_BODY = 'Mensaje nuevo';

const TECHNICAL_NOTIFY = 'En el teléfono simulado aparece un aviso';

export function incomingSenderLabel(cast: ScenarioCast): string {
  return cast.relativeName;
}

export function notifyIncomingPreview(cast: ScenarioCast): string {
  return `${cast.relativeName}: ${NOTIFY_INCOMING_BODY}`;
}

export function isTechnicalNotifyNarration(text: string): boolean {
  return text.includes(TECHNICAL_NOTIFY);
}

const BRIEF_OUTGOING: Readonly<Record<string, string>> = {
  'send-200': 'Te los mando ahora.',
  'chat-only': '¿Qué pasó? Cuéntame.',
  'send-200-late': 'Te mando los 200.',
  'back-to-suspect-chat': 'Ok, te escribo aquí.',
  'send-despite-silence': 'Te los envío ya.',
  'send-150': 'Te mando los 150.',
  'back-to-chat-after-pay': 'Sigo por aquí.',
  'send-from-pause': 'Te los mando.',
  'send-after-block': 'Te los mando.',
};

/** Respuesta breve en el hilo. El texto largo queda en los botones de decisión. */
export function briefOutgoingReply(optionId: string): string | null {
  return BRIEF_OUTGOING[optionId] ?? null;
}

export function canChooseAtPhase(phase: ChatRevealPhase): boolean {
  return phase === 'visible';
}

export function contactInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  const first = parts[0];
  if (!first) {
    return '?';
  }
  const second = parts[1];
  if (!second) {
    return first.slice(0, 2).toUpperCase();
  }
  return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}

export function scheduleFirstIncoming(
  onArrive: () => void,
  delayMs = FIRST_INCOMING_DELAY_MS,
  schedule: (fn: () => void, ms: number) => ReturnType<typeof setTimeout> = setTimeout,
  cancel: (id: ReturnType<typeof setTimeout>) => void = clearTimeout,
): () => void {
  return scheduleProgressiveMessage({
    waitMs: delayMs,
    typingMs: 0,
    onTyping: () => undefined,
    onVisible: onArrive,
    schedule,
    cancel,
  });
}

export function scheduleProgressiveMessage(params: {
  waitMs: number;
  typingMs: number;
  onTyping: () => void;
  onVisible: () => void;
  schedule?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
  cancel?: (id: ReturnType<typeof setTimeout>) => void;
}): () => void {
  const schedule = params.schedule ?? setTimeout;
  const cancel = params.cancel ?? clearTimeout;
  const ids: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  const startTyping = () => {
    if (cancelled) {
      return;
    }
    params.onTyping();
    if (params.typingMs <= 0) {
      params.onVisible();
      return;
    }
    ids.push(
      schedule(() => {
        if (!cancelled) {
          params.onVisible();
        }
      }, params.typingMs),
    );
  };

  if (params.waitMs <= 0) {
    startTyping();
  } else {
    ids.push(schedule(startTyping, params.waitMs));
  }

  return () => {
    cancelled = true;
    for (const id of ids) {
      cancel(id);
    }
  };
}
