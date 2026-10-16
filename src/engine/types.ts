/**
 * Tipos del motor de simulación (Fase 04).
 *
 * Representan el grafo en memoria que consume el motor. No son tablas de
 * Convex: D1 (cómo se publica el guion) y D2 (sesión persistida) siguen
 * abiertas. El motor no conoce React ni Convex.
 *
 * Las puntuaciones viajan en los datos del escenario. El motor solo las
 * suma. Los números de las historias oficiales se aprueban en las Fases 05 y 06.
 */

export const RUBRIC_DIMENSIONS = [
  'recognition',
  'verification',
  'containment',
  'recovery',
] as const;

export type RubricDimension = (typeof RUBRIC_DIMENSIONS)[number];

/** Máximo por dimensión según el marco propuesto del plan (sección 10.1). */
export const POINTS_PER_DIMENSION = 25;

export interface RubricBreakdown {
  recognition: number;
  verification: number;
  containment: number;
  recovery: number;
}

export interface Choice {
  nodeId: string;
  optionId: string;
}

export type SessionStatus = 'active' | 'completed';

/**
 * Estado lógico de una partida. Convex lo persistirá cuando D2 se apruebe.
 * El motor solo lo transforma en memoria.
 */
export interface SessionState {
  scenarioSlug: string;
  scenarioVersion: number;
  status: SessionStatus;
  currentNodeId: string;
  choices: readonly Choice[];
  result: SimulationResult | null;
}

export interface RiskSignal {
  id: string;
  label: string;
  /** Texto fijo. El motor no genera recomendaciones libres. */
  recommendation: string;
}

export interface EvaluationRule {
  points: RubricBreakdown;
  /**
   * Hito educativo único (rúbrica A–E aprobada, Fase 04/05).
   * Si está presente, los `points` solo se acreditan la primera vez que aparece
   * en `state.choices`. Sin hito, los puntos se suman en cada elección (p. ej. fixture).
   */
  milestoneId?: string;
  recognizedSignalIds: readonly string[];
  overlookedSignalIds: readonly string[];
  leavesRoomToCorrect: boolean;
}

export interface Feedback {
  explanation: string;
  recommendation: string;
}

export interface ScenarioOption {
  id: string;
  label: string;
  /** Destino fijado en el guion. El cliente no puede enviarlo. */
  nextNodeId: string;
  evaluation: EvaluationRule;
  feedback: Feedback;
}

export interface ScenarioNode {
  id: string;
  situation: string;
  prompt: string;
  isTerminal: boolean;
  visibleSignalIds: readonly string[];
  options: readonly ScenarioOption[];
}

export interface ScenarioDefinition {
  slug: string;
  version: number;
  title: string;
  fictionNotice: string;
  initialNodeId: string;
  nodes: Readonly<Record<string, ScenarioNode>>;
  signals: Readonly<Record<string, RiskSignal>>;
}

export interface CurrentView {
  node: ScenarioNode;
  options: readonly ScenarioOption[];
}

export interface SimulationResult {
  breakdown: RubricBreakdown;
  total: number;
  attendedSignalIds: readonly string[];
  overlookedSignalIds: readonly string[];
  recommendations: readonly string[];
}

export type EngineErrorCode =
  | 'INVALID_DEFINITION'
  | 'UNKNOWN_INITIAL_NODE'
  | 'UNKNOWN_NODE'
  | 'UNKNOWN_OPTION'
  | 'OPTION_NOT_IN_NODE'
  | 'SESSION_COMPLETED'
  | 'ALREADY_CHOSEN_ON_NODE'
  | 'NOT_TERMINAL';

export interface EngineError {
  code: EngineErrorCode;
  message: string;
}

export type EngineResult<T> = { ok: true; value: T } | { ok: false; error: EngineError };

export interface ChooseSuccess {
  state: SessionState;
  feedback: Feedback;
  finished: boolean;
}

export interface CompleteSuccess {
  state: SessionState;
  result: SimulationResult;
  created: boolean;
}
