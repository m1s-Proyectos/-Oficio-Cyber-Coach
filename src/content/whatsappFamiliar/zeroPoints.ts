import type { RubricBreakdown } from '../../engine';

/**
 * Ceros de compatibilidad. La puntuación oficial vive en `scoring.ts`.
 */
export const UNOFFICIAL_ZERO_POINTS: RubricBreakdown = {
  recognition: 0,
  verification: 0,
  containment: 0,
  recovery: 0,
};
