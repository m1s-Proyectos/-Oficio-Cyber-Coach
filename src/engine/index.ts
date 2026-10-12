export { complete, choose, evaluate, getCurrent, recommend, start } from './engine';
export { createChoiceGate } from './choiceGate';
export type { ChoiceGate } from './choiceGate';
export { MINIMAL_SCENARIO, FIXTURE_SLUG } from './fixtures/minimalScenario';
export { validateDefinition } from './validate';
export type {
  Choice,
  ChooseSuccess,
  CompleteSuccess,
  CurrentView,
  EngineError,
  EngineErrorCode,
  EngineResult,
  EvaluationRule,
  Feedback,
  RiskSignal,
  RubricBreakdown,
  RubricDimension,
  ScenarioDefinition,
  ScenarioNode,
  ScenarioOption,
  SessionState,
  SessionStatus,
  SimulationResult,
} from './types';
export { POINTS_PER_DIMENSION, RUBRIC_DIMENSIONS } from './types';
