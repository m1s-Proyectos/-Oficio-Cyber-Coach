import type { RubricBreakdown } from '../engine';

/** Ceros explícitos para opciones de navegación o sin aporte a la nota. */
export const ZERO_POINTS: RubricBreakdown = {
  recognition: 0,
  verification: 0,
  containment: 0,
  recovery: 0,
};

export function pts(
  recognition: number,
  verification: number,
  containment: number,
  recovery: number,
): RubricBreakdown {
  return { recognition, verification, containment, recovery };
}

export interface OptionScore {
  readonly points: RubricBreakdown;
  readonly milestoneId?: string;
}
