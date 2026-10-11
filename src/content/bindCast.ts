export interface ScenarioCast {
  learner: string;
  relativeName: string;
  relationship: string;
}

/** Predeterminados ficticios del guion A. No se persisten. */
export const DEFAULT_CAST: ScenarioCast = {
  learner: 'Alex',
  relativeName: 'Diego',
  relationship: 'hijo',
};

const PLACEHOLDERS = ['learner', 'relativeName', 'relationship'] as const;

/**
 * Sustituye plantillas solo en texto visible. No toca ids ni destinos.
 */
export function applyCast(template: string, cast: ScenarioCast): string {
  let text = template;
  for (const key of PLACEHOLDERS) {
    text = text.replaceAll(`{{${key}}}`, cast[key]);
  }
  return text;
}

export function sanitizeCastField(value: string, fallback: string): string {
  const cleaned = [...value]
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('');
  const trimmed = cleaned.trim();
  if (trimmed.length === 0 || trimmed.length > 40) {
    return fallback;
  }
  return trimmed;
}

export function sanitizeCast(input: ScenarioCast): ScenarioCast {
  return {
    learner: sanitizeCastField(input.learner, DEFAULT_CAST.learner),
    relativeName: sanitizeCastField(input.relativeName, DEFAULT_CAST.relativeName),
    relationship: sanitizeCastField(input.relationship, DEFAULT_CAST.relationship),
  };
}
