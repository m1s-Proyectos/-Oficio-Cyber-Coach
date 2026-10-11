import { TTS_TIMEOUT_MS } from './elevenLabsTts';

/** Límites iniciales de diseño. No son un tope económico del proveedor. */
export const VOICE_HOUR_LIMIT = 10;
export const VOICE_DAY_LIMIT = 30;
export const VOICE_MAX_INFLIGHT = 2;

/** Margen sobre el timeout TTS para no dejar un lease huérfano permanente. */
export const VOICE_LEASE_MS = TTS_TIMEOUT_MS + 5_000;

export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;

export type VoiceLease = {
  id: string;
  expiresAt: number;
};

export type VoiceQuotaState = {
  hourWindowStart: number;
  hourCount: number;
  dayWindowStart: number;
  dayCount: number;
  leases: VoiceLease[];
};

export type VoiceQuotaLimits = {
  hourLimit: number;
  dayLimit: number;
  maxInflight: number;
  leaseMs: number;
};

export const DEFAULT_VOICE_QUOTA_LIMITS: VoiceQuotaLimits = {
  hourLimit: VOICE_HOUR_LIMIT,
  dayLimit: VOICE_DAY_LIMIT,
  maxInflight: VOICE_MAX_INFLIGHT,
  leaseMs: VOICE_LEASE_MS,
};

export function emptyVoiceQuotaState(now: number): VoiceQuotaState {
  return {
    hourWindowStart: hourWindowStart(now),
    hourCount: 0,
    dayWindowStart: dayWindowStart(now),
    dayCount: 0,
    leases: [],
  };
}

export function hourWindowStart(now: number): number {
  return Math.floor(now / HOUR_MS) * HOUR_MS;
}

export function dayWindowStart(now: number): number {
  return Math.floor(now / DAY_MS) * DAY_MS;
}

export function isVoiceEnabled(env: Record<string, string | undefined>): boolean {
  return env.VOICE_ENABLED === 'true';
}

export function pruneLeases(leases: readonly VoiceLease[], now: number): VoiceLease[] {
  return leases.filter((lease) => lease.expiresAt > now);
}

export function rollWindows(state: VoiceQuotaState, now: number): VoiceQuotaState {
  const nextHour = hourWindowStart(now);
  const nextDay = dayWindowStart(now);
  return {
    hourWindowStart: nextHour,
    hourCount: state.hourWindowStart === nextHour ? state.hourCount : 0,
    dayWindowStart: nextDay,
    dayCount: state.dayWindowStart === nextDay ? state.dayCount : 0,
    leases: pruneLeases(state.leases, now),
  };
}

export function applyReserve(
  state: VoiceQuotaState,
  now: number,
  leaseId: string,
  limits: VoiceQuotaLimits = DEFAULT_VOICE_QUOTA_LIMITS,
): { ok: true; state: VoiceQuotaState; leaseId: string } | { ok: false; state: VoiceQuotaState } {
  const rolled = rollWindows(state, now);
  if (
    rolled.hourCount >= limits.hourLimit ||
    rolled.dayCount >= limits.dayLimit ||
    rolled.leases.length >= limits.maxInflight
  ) {
    return { ok: false, state: rolled };
  }
  return {
    ok: true,
    leaseId,
    state: {
      ...rolled,
      hourCount: rolled.hourCount + 1,
      dayCount: rolled.dayCount + 1,
      leases: [...rolled.leases, { id: leaseId, expiresAt: now + limits.leaseMs }],
    },
  };
}

export function applyRelease(
  state: VoiceQuotaState,
  leaseId: string,
  now: number,
): VoiceQuotaState {
  const rolled = rollWindows(state, now);
  return {
    ...rolled,
    leases: rolled.leases.filter((lease) => lease.id !== leaseId),
  };
}

export const QUOTA_SINGLETON = 'global' as const;

export const RATE_LIMITED_MESSAGE = 'Se alcanzó el límite de voz. El texto sigue disponible.';

export type QuotaRowPick<T> =
  { status: 'empty' } | { status: 'one'; row: T } | { status: 'inconsistent'; count: number };

/**
 * Un índice Convex no impone unicidad. Si hay más de un documento `global`,
 * el perímetro falla cerrado en lugar de sumar cupos en filas distintas.
 */
export function pickQuotaRows<T>(rows: readonly T[]): QuotaRowPick<T> {
  if (rows.length === 0) {
    return { status: 'empty' };
  }
  if (rows.length === 1) {
    const row = rows[0];
    if (row === undefined) {
      return { status: 'empty' };
    }
    return { status: 'one', row };
  }
  return { status: 'inconsistent', count: rows.length };
}
