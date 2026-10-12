import { useCallback, useEffect, useState } from 'react';
import { challenges } from '../../content/quickChallenges';

const KEY = 'oficio-learning-progress-v1';

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

function localDateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function daysBetween(a: string, b: string) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

function safeLoad(): LocalProgress {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!parsed || typeof parsed !== 'object' || (parsed as { version?: number }).version !== 1) return EMPTY_PROGRESS;
    const value = parsed as Partial<LocalProgress>;
    return {
      ...EMPTY_PROGRESS,
      ...value,
      completedChallenges: Array.isArray(value.completedChallenges) ? value.completedChallenges.filter((id): id is string => typeof id === 'string' && challenges.some((challenge) => challenge.id === id)) : [],
      attempts: value.attempts && typeof value.attempts === 'object' ? value.attempts : {},
      firstAnswers: value.firstAnswers && typeof value.firstAnswers === 'object' ? value.firstAnswers : {},
      unlockedBadges: Array.isArray(value.unlockedBadges) ? value.unlockedBadges : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function updateStreak(progress: LocalProgress): LocalProgress {
  const today = localDateKey();
  if (progress.lastActiveDate === today) return progress;
  const diff = progress.lastActiveDate ? daysBetween(progress.lastActiveDate, today) : 0;
  const currentStreak = !progress.lastActiveDate ? 1 : diff === 1 ? progress.currentStreak + 1 : 1;
  return { ...progress, lastActiveDate: today, currentStreak, bestStreak: Math.max(progress.bestStreak, currentStreak) };
}

function badges(progress: LocalProgress) {
  const earned: string[] = [];
  if (progress.completedChallenges.length >= 1) earned.push('first');
  if (progress.completedChallenges.length >= 3) earned.push('three');
  if (progress.completedChallenges.some((id) => ['package', 'family', 'code'].includes(id)) && progress.completedChallenges.some((id) => ['boss', 'invoice'].includes(id))) earned.push('verifier');
  if (progress.completedChallenges.length === challenges.length) earned.push('all');
  return earned;
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(safeLoad);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* Storage may be disabled; learning still works in memory. */ }
  }, [progress]);

  const completeChallenge = useCallback((id: string, correct: boolean) => {
    setProgress((previous) => {
      const completedBefore = previous.completedChallenges.includes(id);
      const firstAnswers = Object.prototype.hasOwnProperty.call(previous.firstAnswers, id)
        ? previous.firstAnswers
        : { ...previous.firstAnswers, [id]: correct };
      let next: LocalProgress = {
        ...previous,
        completedChallenges: completedBefore ? previous.completedChallenges : [...previous.completedChallenges, id],
        attempts: { ...previous.attempts, [id]: (previous.attempts[id] ?? 0) + 1 },
        firstAnswers,
        earnedXp: previous.earnedXp + (completedBefore ? 0 : correct ? 100 : 60),
      };
      next = updateStreak(next);
      next.unlockedBadges = badges(next);
      return next;
    });
  }, []);

  const completedCount = progress.completedChallenges.length;
  const answers = Object.values(progress.firstAnswers);
  const accuracy = answers.length ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;
  return { progress, completeChallenge, completedCount, accuracy };
}
