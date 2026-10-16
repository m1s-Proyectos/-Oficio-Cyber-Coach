import { fail, ok } from './result';
import {
  POINTS_PER_DIMENSION,
  RUBRIC_DIMENSIONS,
  type ChooseSuccess,
  type CompleteSuccess,
  type CurrentView,
  type EngineResult,
  type ScenarioDefinition,
  type ScenarioNode,
  type SessionState,
  type SimulationResult,
} from './types';
import { validateDefinition } from './validate';

function cloneState(state: SessionState): SessionState {
  return {
    scenarioSlug: state.scenarioSlug,
    scenarioVersion: state.scenarioVersion,
    status: state.status,
    currentNodeId: state.currentNodeId,
    choices: state.choices.map((choice) => ({ ...choice })),
    result: state.result
      ? {
          breakdown: { ...state.result.breakdown },
          total: state.result.total,
          attendedSignalIds: [...state.result.attendedSignalIds],
          overlookedSignalIds: [...state.result.overlookedSignalIds],
          recommendations: [...state.result.recommendations],
        }
      : null,
  };
}

function getNode(definition: ScenarioDefinition, nodeId: string): EngineResult<ScenarioNode> {
  const node = definition.nodes[nodeId];
  if (!node) {
    return fail('UNKNOWN_NODE', `El nodo "${nodeId}" no existe en este escenario.`);
  }
  return ok(node);
}

export function start(definition: ScenarioDefinition): EngineResult<SessionState> {
  const valid = validateDefinition(definition);
  if (!valid.ok) {
    return valid;
  }

  return ok({
    scenarioSlug: definition.slug,
    scenarioVersion: definition.version,
    status: 'active',
    currentNodeId: definition.initialNodeId,
    choices: [],
    result: null,
  });
}

export function getCurrent(
  state: SessionState,
  definition: ScenarioDefinition,
): EngineResult<CurrentView> {
  const nodeResult = getNode(definition, state.currentNodeId);
  if (!nodeResult.ok) {
    return nodeResult;
  }
  return ok({
    node: nodeResult.value,
    options: nodeResult.value.options,
  });
}

export function choose(
  state: SessionState,
  definition: ScenarioDefinition,
  optionId: string,
): EngineResult<ChooseSuccess> {
  if (state.status === 'completed') {
    return fail('SESSION_COMPLETED', 'Esta sesión ya está cerrada. No admite más decisiones.');
  }
  // Solo el paso actual: el grafo A puede volver a un nodo (ciclo con salida).
  const lastChoice = state.choices[state.choices.length - 1];
  if (lastChoice?.nodeId === state.currentNodeId) {
    return fail(
      'ALREADY_CHOSEN_ON_NODE',
      'Ya se eligió una opción en este paso. No se puede elegir otra vez.',
    );
  }

  const nodeResult = getNode(definition, state.currentNodeId);
  if (!nodeResult.ok) {
    return nodeResult;
  }

  const option = nodeResult.value.options.find((item) => item.id === optionId);
  if (!option) {
    const existsAnywhere = Object.values(definition.nodes).some((node) =>
      node.options.some((item) => item.id === optionId),
    );
    return fail(
      existsAnywhere ? 'OPTION_NOT_IN_NODE' : 'UNKNOWN_OPTION',
      existsAnywhere
        ? `La opción "${optionId}" no pertenece al nodo actual.`
        : `La opción "${optionId}" no existe en este escenario.`,
    );
  }

  const nextResult = getNode(definition, option.nextNodeId);
  if (!nextResult.ok) {
    return nextResult;
  }

  const nextState: SessionState = {
    ...cloneState(state),
    currentNodeId: option.nextNodeId,
    choices: [...state.choices, { nodeId: state.currentNodeId, optionId: option.id }],
  };

  return ok({
    state: nextState,
    feedback: option.feedback,
    finished: nextResult.value.isTerminal,
  });
}

function clampDimension(value: number): number {
  if (value < 0) {
    return 0;
  }
  if (value > POINTS_PER_DIMENSION) {
    return POINTS_PER_DIMENSION;
  }
  return value;
}

export function evaluate(state: SessionState, definition: ScenarioDefinition): SimulationResult {
  const breakdown = {
    recognition: 0,
    verification: 0,
    containment: 0,
    recovery: 0,
  };
  const attended = new Set<string>();
  const overlooked = new Set<string>();
  const awardedMilestones = new Set<string>();

  for (const choice of state.choices) {
    const node = definition.nodes[choice.nodeId];
    const option = node?.options.find((item) => item.id === choice.optionId);
    if (!option) {
      continue;
    }

    for (const signalId of option.evaluation.recognizedSignalIds) {
      attended.add(signalId);
    }
    for (const signalId of option.evaluation.overlookedSignalIds) {
      overlooked.add(signalId);
    }

    const milestoneId = option.evaluation.milestoneId;
    if (typeof milestoneId === 'string' && milestoneId.length > 0) {
      if (awardedMilestones.has(milestoneId)) {
        continue;
      }
      awardedMilestones.add(milestoneId);
    }

    for (const dimension of RUBRIC_DIMENSIONS) {
      breakdown[dimension] += option.evaluation.points[dimension];
    }
  }

  for (const signalId of attended) {
    overlooked.delete(signalId);
  }

  for (const dimension of RUBRIC_DIMENSIONS) {
    breakdown[dimension] = clampDimension(breakdown[dimension]);
  }

  const total = RUBRIC_DIMENSIONS.reduce((sum, dimension) => sum + breakdown[dimension], 0);
  const recommendations = [...overlooked]
    .map((signalId) => definition.signals[signalId]?.recommendation)
    .filter((text): text is string => typeof text === 'string' && text.length > 0);

  return {
    breakdown,
    total,
    attendedSignalIds: [...attended],
    overlookedSignalIds: [...overlooked],
    recommendations,
  };
}

export function recommend(
  result: SimulationResult,
  definition: ScenarioDefinition,
): readonly string[] {
  return result.overlookedSignalIds
    .map((signalId) => definition.signals[signalId]?.recommendation)
    .filter((text): text is string => typeof text === 'string' && text.length > 0);
}

export function complete(
  state: SessionState,
  definition: ScenarioDefinition,
): EngineResult<CompleteSuccess> {
  if (state.result) {
    const frozen = cloneState(state);
    return ok({
      state: frozen,
      result: frozen.result as SimulationResult,
      created: false,
    });
  }

  const nodeResult = getNode(definition, state.currentNodeId);
  if (!nodeResult.ok) {
    return nodeResult;
  }
  if (!nodeResult.value.isTerminal) {
    return fail(
      'NOT_TERMINAL',
      'Solo se puede cerrar la sesión cuando el nodo actual es terminal.',
    );
  }

  const result = evaluate(state, definition);
  const nextState: SessionState = {
    ...cloneState(state),
    status: 'completed',
    result,
  };

  return ok({
    state: nextState,
    result,
    created: true,
  });
}
