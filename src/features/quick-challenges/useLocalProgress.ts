import { useCallback, useEffect, useState } from 'react';
import { challenges } from '../../content/quickChallenges';

export const LOCAL_PROGRESS_KEY = 'oficio-learning-progress-v1';

const KNOWN_BADGES = ['first', 'three', 'verifier', 'all'] as const;

export interface LocalProgress {
  version: 1;
  completedChallenges: string[];
  attempts: Record<string, number>;
  earnedXp: number;
  unlockedBadges: string[];
  lastActiveDate: string | null;
  currentStreak: number;
  bestStreak: number;
  firstAnswers: Record<string, boolean>;
}

const EMPTY_PROGRESS: LocalProgress = {
  version: 1,
  completedChallenges: [],
  attempts: {},
  earnedXp: 0,
  unlockedBadges: [],
  lastActiveDate: null,
  currentStreak: 0,
  bestStreak: 0,
  firstAnswers: {},
};

function isChallengeId(id: unknown): id is string {
  return typeof id === 'string' && challenges.some((challenge) => challenge.id === id);
}

function asNonNegativeInt(value: unknown, fallback = 0): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return fallback;
  return Math.floor(value);
}

function localDateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function daysBetween(a: string, b: string) {
  const [ay, am, ad] = a.split('-').map(Number) as [number, number, number];
  const [by, bm, bd] = b.split('-').map(Number) as [number, number, number];
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

function sanitizeAttempts(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const next: Record<string, number> = {};
  for (const [id, count] of Object.entries(value as Record<string, unknown>)) {
    if (!isChallengeId(id)) continue;
    next[id] = asNonNegativeInt(count, 0);
  }
  return next;
}

function sanitizeFirstAnswers(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== 'object') return {};
  const next: Record<string, boolean> = {};
  for (const [id, answer] of Object.entries(value as Record<string, unknown>)) {
    if (!isChallengeId(id) || typeof answer !== 'boolean') continue;
    next[id] = answer;
  }
  return next;
}

export function safeLoadProgress(raw: string | null = null): LocalProgress {
  try {
    const source =
      raw ?? (typeof localStorage === 'undefined' ? null : localStorage.getItem(LOCAL_PROGRESS_KEY));
    const parsed: unknown = JSON.parse(source ?? 'null');
    if (!parsed || typeof parsed !== 'object' || (parsed as { version?: number }).version !== 1) {
      return { ...EMPTY_PROGRESS };
    }
    const value = parsed as Partial<LocalProgress>;
    const completedChallenges = Array.isArray(value.completedChallenges)
      ? value.completedChallenges.filter(isChallengeId)
      : [];
    return {
      ...EMPTY_PROGRESS,
      completedChallenges,
      attempts: sanitizeAttempts(value.attempts),
      firstAnswers: sanitizeFirstAnswers(value.firstAnswers),
      unlockedBadges: Array.isArray(value.unlockedBadges)
        ? value.unlockedBadges.filter(
            (id): id is string => typeof id === 'string' && KNOWN_BADGES.includes(id as never),
          )
        : [],
      earnedXp: asNonNegativeInt(value.earnedXp, 0),
      currentStreak: asNonNegativeInt(value.currentStreak, 0),
      bestStreak: asNonNegativeInt(value.bestStreak, 0),
      lastActiveDate: isDateKey(value.lastActiveDate) ? value.lastActiveDate : null,
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

function updateStreak(progress: LocalProgress): LocalProgress {
  const today = localDateKey();
  if (progress.lastActiveDate === today) return progress;
  const diff = progress.lastActiveDate ? daysBetween(progress.lastActiveDate, today) : 0;
  const currentStreak = !progress.lastActiveDate ? 1 : diff === 1 ? progress.currentStreak + 1 : 1;
  return {
    ...progress,
    lastActiveDate: today,
    currentStreak,
    bestStreak: Math.max(progress.bestStreak, currentStreak),
  };
}

/** Logros: first (≥1), three (≥3), verifier (diario+trabajo), all (los 8). */
export function computeBadges(progress: LocalProgress): string[] {
  const earned: string[] = [];
  if (progress.completedChallenges.length >= 1) earned.push('first');
  if (progress.completedChallenges.length >= 3) earned.push('three');
  if (
    progress.completedChallenges.some((id) => ['package', 'family', 'code'].includes(id)) &&
    progress.completedChallenges.some((id) => ['boss', 'invoice'].includes(id))
  ) {
    earned.push('verifier');
  }
  if (progress.completedChallenges.length === challenges.length) earned.push('all');
  return earned;
}

/**
 * XP motivacional (no es la nota oficial de A–E):
 * - Primera finalización correcta: +100
 * - Primera finalización incorrecta: +60
 * - Repetición de un reto ya completado: +0
 */
export function xpDelta(completedBefore: boolean, correct: boolean): number {
  if (completedBefore) return 0;
  return correct ? 100 : 60;
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(() => safeLoadProgress());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      /* Storage may be disabled; learning still works in memory. */
    }
  }, [progress]);

  const completeChallenge = useCallback((id: string, correct: boolean) => {
    if (!isChallengeId(id)) return;
    setProgress((previous) => {
      const completedBefore = previous.completedChallenges.includes(id);
      const firstAnswers = Object.prototype.hasOwnProperty.call(previous.firstAnswers, id)
        ? previous.firstAnswers
        : { ...previous.firstAnswers, [id]: correct };
      let next: LocalProgress = {
        ...previous,
        completedChallenges: completedBefore
          ? previous.completedChallenges
          : [...previous.completedChallenges, id],
        attempts: { ...previous.attempts, [id]: (previous.attempts[id] ?? 0) + 1 },
        firstAnswers,
        earnedXp: previous.earnedXp + xpDelta(completedBefore, correct),
      };
      next = updateStreak(next);
      next.unlockedBadges = computeBadges(next);
      return next;
    });
  }, []);

  const completedCount = progress.completedChallenges.length;
  const answers = Object.values(progress.firstAnswers);
  const accuracy = answers.length
    ? Math.round((answers.filter(Boolean).length / answers.length) * 100)
    : 0;
  return { progress, completeChallenge, completedCount, accuracy };
}
