import type { EngineError, EngineErrorCode, EngineResult } from './types';

export function ok<T>(value: T): EngineResult<T> {
  return { ok: true, value };
}

export function fail<T>(code: EngineErrorCode, message: string): EngineResult<T> {
  const error: EngineError = { code, message };
  return { ok: false, error };
}
