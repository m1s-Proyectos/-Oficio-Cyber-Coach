import { fail, ok } from './result';
import {
  POINTS_PER_DIMENSION,
  RUBRIC_DIMENSIONS,
  type EngineResult,
  type ScenarioDefinition,
  type ScenarioNode,
} from './types';

function isFiniteInteger(value: number): boolean {
  return Number.isInteger(value) && Number.isFinite(value);
}

function collectReachable(definition: ScenarioDefinition): Set<string> {
  const seen = new Set<string>();
  const queue = [definition.initialNodeId];
  while (queue.length > 0) {
    const id = queue.pop();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    const node = definition.nodes[id];
    if (!node) {
      continue;
    }
    for (const option of node.options) {
      queue.push(option.nextNodeId);
    }
  }
  return seen;
}

function nodeErrors(definition: ScenarioDefinition, node: ScenarioNode): string[] {
  const errors: string[] = [];
  const optionIds = new Set<string>();

  if (node.isTerminal && node.options.length > 0) {
    errors.push(`El nodo terminal "${node.id}" no puede ofrecer opciones.`);
  }
  if (!node.isTerminal && node.options.length === 0) {
    errors.push(`El nodo no terminal "${node.id}" debe ofrecer al menos una opción.`);
  }

  for (const signalId of node.visibleSignalIds) {
    if (!definition.signals[signalId]) {
      errors.push(`El nodo "${node.id}" referencia la señal desconocida "${signalId}".`);
    }
  }

  for (const option of node.options) {
    if (optionIds.has(option.id)) {
      errors.push(`El nodo "${node.id}" repite la opción "${option.id}".`);
    }
    optionIds.add(option.id);

    if (!definition.nodes[option.nextNodeId]) {
      errors.push(
        `La opción "${option.id}" del nodo "${node.id}" apunta al nodo inexistente "${option.nextNodeId}".`,
      );
    }

    for (const dimension of RUBRIC_DIMENSIONS) {
      const points = option.evaluation.points[dimension];
      if (!isFiniteInteger(points) || points < 0 || points > POINTS_PER_DIMENSION) {
        errors.push(
          `La opción "${option.id}" tiene puntos inválidos en ${dimension} (${String(points)}).`,
        );
      }
    }

    const milestoneId = option.evaluation.milestoneId;
    if (milestoneId !== undefined) {
      if (typeof milestoneId !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(milestoneId)) {
        errors.push(
          `La opción "${option.id}" tiene milestoneId inválido (${String(milestoneId)}).`,
        );
      }
    }

    for (const signalId of [
      ...option.evaluation.recognizedSignalIds,
      ...option.evaluation.overlookedSignalIds,
    ]) {
      if (!definition.signals[signalId]) {
        errors.push(`La opción "${option.id}" referencia la señal desconocida "${signalId}".`);
      }
    }
  }

  return errors;
}

/**
 * Comprueba que la definición sea un grafo cerrado y determinista.
 * No aprueba D1: solo protege al motor de datos incompletos.
 */
export function validateDefinition(definition: ScenarioDefinition): EngineResult<true> {
  const problems: string[] = [];

  if (definition.slug.trim().length === 0) {
    problems.push('El slug del escenario no puede estar vacío.');
  }
  if (!isFiniteInteger(definition.version) || definition.version < 0) {
    problems.push('La versión del escenario debe ser un entero mayor o igual que 0.');
  }
  if (!definition.nodes[definition.initialNodeId]) {
    return fail(
      'UNKNOWN_INITIAL_NODE',
      `El nodo inicial "${definition.initialNodeId}" no existe en la definición.`,
    );
  }

  for (const node of Object.values(definition.nodes)) {
    problems.push(...nodeErrors(definition, node));
  }

  const reachable = collectReachable(definition);
  let hasRiskBranch = false;
  let hasVerifyBranch = false;

  for (const nodeId of reachable) {
    const node = definition.nodes[nodeId];
    if (!node) {
      continue;
    }
    for (const option of node.options) {
      if (option.evaluation.overlookedSignalIds.length > 0) {
        hasRiskBranch = true;
      }
      if (option.evaluation.recognizedSignalIds.length > 0) {
        hasVerifyBranch = true;
      }
    }
  }

  const terminals = [...reachable].filter((id) => definition.nodes[id]?.isTerminal);
  if (terminals.length === 0) {
    problems.push('Ninguna rama alcanzable termina en un nodo terminal.');
  }
  if (!hasRiskBranch || !hasVerifyBranch) {
    problems.push(
      'La definición debe cubrir al menos una rama de riesgo y una de verificación que sean alcanzables.',
    );
  }

  if (problems.length > 0) {
    return fail('INVALID_DEFINITION', problems.join(' '));
  }
  return ok(true);
}
