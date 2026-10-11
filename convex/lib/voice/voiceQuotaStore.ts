import {
  RATE_LIMITED_MESSAGE,
  applyRelease,
  applyReserve,
  emptyVoiceQuotaState,
  pickQuotaRows,
  type VoiceQuotaState,
} from './voiceLimits';

export type QuotaReserveOk = { ok: true; leaseId: string };
export type QuotaReserveErr = { ok: false; code: 'RATE_LIMITED'; message: string };
export type QuotaReserveResult = QuotaReserveOk | QuotaReserveErr;

export type VoiceQuotaStore = {
  reserve: (now: number) => Promise<QuotaReserveResult>;
  release: (leaseId: string, now: number) => Promise<void>;
  snapshot: () => VoiceQuotaState;
};

export const RATE_LIMITED: QuotaReserveErr = {
  ok: false,
  code: 'RATE_LIMITED',
  message: RATE_LIMITED_MESSAGE,
};

function cloneState(state: VoiceQuotaState): VoiceQuotaState {
  return {
    ...state,
    leases: state.leases.map((lease) => ({ ...lease })),
  };
}

/**
 * Almacén en memoria con cola serializada, para tests unitarios.
 * No es el perímetro de producción y no demuestra OCC de Convex.
 */
export class MemoryVoiceQuotaStore implements VoiceQuotaStore {
  private state: VoiceQuotaState;
  private queue: Promise<void> = Promise.resolve();

  constructor(initial?: VoiceQuotaState) {
    this.state = initial ?? emptyVoiceQuotaState(0);
  }

  snapshot(): VoiceQuotaState {
    return cloneState(this.state);
  }

  async reserve(now: number): Promise<QuotaReserveResult> {
    return await this.serialize(() => {
      const leaseId = `lease-${now}-${Math.random().toString(36).slice(2, 10)}`;
      const result = applyReserve(this.state, now, leaseId);
      this.state = result.state;
      if (!result.ok) {
        return RATE_LIMITED;
      }
      return { ok: true, leaseId: result.leaseId };
    });
  }

  async release(leaseId: string, now: number): Promise<void> {
    await this.serialize(() => {
      this.state = applyRelease(this.state, leaseId, now);
    });
  }

  private serialize<T>(fn: () => T): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}

export type QuotaLedgerRow = {
  id: string;
  state: VoiceQuotaState;
};

/**
 * Modelo de la tabla `voiceQuota`: 0, 1 o N documentos `global`.
 * Con `serializeInits: true` (por defecto) una sola fila se crea ante
 * reservas concurrentes sobre tabla vacía (análogo a un reintento OCC).
 * Con `serializeInits: false` se puede forzar el estado inconsistente
 * para comprobar el fallo cerrado; no representa Convex.
 */
export class DocumentQuotaLedger implements VoiceQuotaStore {
  private rows: QuotaLedgerRow[] = [];
  private nextId = 1;
  private queue: Promise<void> = Promise.resolve();
  private readonly serializeInits: boolean;

  constructor(options?: { serializeInits?: boolean; rows?: QuotaLedgerRow[] }) {
    this.serializeInits = options?.serializeInits ?? true;
    this.rows = options?.rows?.map((row) => ({ id: row.id, state: cloneState(row.state) })) ?? [];
  }

  rowCount(): number {
    return this.rows.length;
  }

  snapshot(): VoiceQuotaState {
    const pick = pickQuotaRows(this.rows);
    if (pick.status !== 'one') {
      return emptyVoiceQuotaState(0);
    }
    return cloneState(pick.row.state);
  }

  async reserve(now: number): Promise<QuotaReserveResult> {
    const run = async () => {
      const pick = pickQuotaRows(this.rows);
      if (pick.status === 'inconsistent') {
        return RATE_LIMITED;
      }
      if (pick.status === 'empty') {
        this.rows.push({
          id: `row-${this.nextId}`,
          state: emptyVoiceQuotaState(now),
        });
        this.nextId += 1;
      }
      const current = pickQuotaRows(this.rows);
      if (current.status !== 'one') {
        return RATE_LIMITED;
      }
      const leaseId = `lease-${now}-${current.row.id}-${Math.random().toString(36).slice(2, 10)}`;
      const result = applyReserve(current.row.state, now, leaseId);
      current.row.state = result.state;
      if (!result.ok) {
        return RATE_LIMITED;
      }
      return { ok: true as const, leaseId: result.leaseId };
    };

    if (this.serializeInits) {
      return await this.serialize(run);
    }
    return await run();
  }

  async release(leaseId: string, now: number): Promise<void> {
    const run = () => {
      const pick = pickQuotaRows(this.rows);
      if (pick.status !== 'one') {
        return;
      }
      pick.row.state = applyRelease(pick.row.state, leaseId, now);
    };
    if (this.serializeInits) {
      await this.serialize(run);
      return;
    }
    run();
  }

  seedDuplicateEmptyRows(): void {
    this.rows = [
      { id: 'dup-a', state: emptyVoiceQuotaState(0) },
      { id: 'dup-b', state: emptyVoiceQuotaState(0) },
    ];
  }

  private serialize<T>(fn: () => T | Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}
