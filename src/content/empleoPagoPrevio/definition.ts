import type { ScenarioDefinition, ScenarioNode, ScenarioOption } from '../../engine';
import { UNOFFICIAL_ZERO_POINTS } from './zeroPoints';

export const EMPLEO_PAGO_PREVIO_SLUG = 'empleo-pago-previo';

/**
 * Adaptación educativa (reto-2 de setup.js, no ejecutado):
 * El original es una pregunta de opción múltiple. Aquí se convierte en grafo
 * con ruta segura, distracciones A/C y consecuencia si se pagan los $35.
 * Se conservan remitente, asunto, salario $2.500, cuota $35, señales y
 * takeaway. Marca y dominio se tratan como ficción del ejercicio.
 */
export const EMPLEO_PAGO_PREVIO_FICTION_NOTICE =
  'Historia ficticia. Global Talent Express, el correo y el puesto no existen. No pagues, no envíes datos reales ni visites el dominio del relato.';

function option(
  id: string,
  label: string,
  nextNodeId: string,
  recognizedSignalIds: readonly string[],
  overlookedSignalIds: readonly string[],
  leavesRoomToCorrect: boolean,
  explanation: string,
  recommendation: string,
): ScenarioOption {
  return {
    id,
    label,
    nextNodeId,
    evaluation: {
      points: UNOFFICIAL_ZERO_POINTS,
      recognizedSignalIds,
      overlookedSignalIds,
      leavesRoomToCorrect,
    },
    feedback: { explanation, recommendation },
  };
}

function node(
  id: string,
  situation: string,
  prompt: string,
  isTerminal: boolean,
  visibleSignalIds: readonly string[],
  options: readonly ScenarioOption[],
): ScenarioNode {
  return { id, situation, prompt, isTerminal, visibleSignalIds, options };
}

export const EMPLEO_PAGO_PREVIO_SCENARIO: ScenarioDefinition = {
  slug: EMPLEO_PAGO_PREVIO_SLUG,
  version: 1,
  title: 'El empleo que exige un pago',
  fictionNotice: EMPLEO_PAGO_PREVIO_FICTION_NOTICE,
  initialNodeId: 'n_inbox',
  signals: {
    'advance-fee': {
      id: 'advance-fee',
      label: 'Cobros previos para acceder a una oferta laboral',
      recommendation: 'Desconfía de cualquier oferta que pida dinero inicial.',
    },
    'high-salary': {
      id: 'high-salary',
      label: 'Salarios atractivos con requisitos mínimos de experiencia',
      recommendation: 'Un sueldo alto no prueba que la oferta sea real.',
    },
    'generic-domain': {
      id: 'generic-domain',
      label: 'Correo de un dominio genérico o poco verificable',
      recommendation: 'Investiga la empresa por un canal independiente.',
    },
  },
  nodes: {
    n_inbox: node(
      'n_inbox',
      '{{learner}} tiene un correo nuevo de reclutamiento@global-talent-express.com. Asunto: «¡Felicidades! Seleccionado para Asistente Remoto».',
      '¿Qué haces?',
      false,
      ['generic-domain'],
      [
        option(
          'open-offer',
          'Abrir el correo',
          'n_offer',
          ['generic-domain'],
          [],
          true,
          'Leer no obliga a pagar.',
          'Fíjate si piden dinero para contratarte.',
        ),
        option(
          'leave-unread',
          'No abrir un correo de un dominio que no reconoces',
          't_safe',
          ['generic-domain'],
          [],
          false,
          'Evitar el clic es una forma de contención.',
          'Si te interesa un empleo, verifica la empresa por un canal que tú ya conocías.',
        ),
      ],
    ),
    n_offer: node(
      'n_offer',
      'Estimado candidato, su perfil ha sido seleccionado para el puesto de Asistente Administrativo Remoto con un salario de $2,500 USD mensuales. Para formalizar su contrato y reservar su kit de trabajo, debe cubrir una cuota única de $35 USD por gastos de envío y alta en sistema.',
      '¿Qué señal merece mayor atención?',
      false,
      ['advance-fee', 'high-salary', 'generic-domain'],
      [
        option(
          'mark-salary',
          'La empresa ofrece un salario superior al promedio del mercado.',
          'n_distract',
          ['high-salary'],
          ['advance-fee'],
          true,
          'El sueldo alto es una pista, no la señal más grave.',
          'Revisa si te piden pagar para que te contraten.',
        ),
        option(
          'mark-fee',
          'Solicitan dinero por adelantado para garantizar la contratación y el kit de trabajo.',
          'n_check',
          ['advance-fee'],
          [],
          true,
          'Ninguna empresa legítima exige pagar por adelantado para conseguir el trabajo.',
          'El dinero de un empleo legítimo fluye hacia ti, no al revés.',
        ),
        option(
          'mark-video',
          'La entrevista inicial se realiza mediante una videollamada grabada.',
          'n_distract',
          [],
          ['advance-fee'],
          true,
          'Una videollamada no explica el cobro de $35.',
          'La señal que más importa es el pago previo.',
        ),
        option(
          'pay-35',
          'Pagar los $35 para reservar el kit y el alta',
          't_paid',
          [],
          ['advance-fee', 'generic-domain'],
          false,
          'En la ficción el cobro no produce un contrato.',
          'No se promete recuperar los $35. Verifica antes de pagar.',
        ),
      ],
    ),
    n_distract: node(
      'n_distract',
      'Esa observación no es la más útil. El correo sigue pidiendo $35 para formalizar el contrato y el kit.',
      '¿Cómo continúas?',
      false,
      ['advance-fee'],
      [
        option(
          'now-see-fee',
          'Ahora sí: el cobro anticipado es la alerta',
          'n_check',
          ['advance-fee'],
          [],
          true,
          'Corregir a tiempo sigue siendo posible.',
          'Investiga la empresa o cierra sin pagar.',
        ),
        option(
          'pay-after-distract',
          'Pagar los $35 de todos modos',
          't_paid',
          [],
          ['advance-fee'],
          false,
          'Pagar confirma el riesgo que el cobro anticipado señalaba.',
          'No se promete recuperar el dinero.',
        ),
      ],
    ),
    n_check: node(
      'n_check',
      'Las solicitudes de pagos anticipados vinculados a una contratación son una señal clara de alerta. Aún no has pagado.',
      '¿Qué haces?',
      false,
      ['advance-fee'],
      [
        option(
          'research-firm',
          'Investigar la empresa en un canal profesional que tú ya usabas',
          'n_research',
          ['advance-fee', 'generic-domain'],
          [],
          true,
          'Un segundo canal independiente del correo original.',
          'Busca reputación; no uses solo los enlaces del mensaje.',
        ),
        option(
          'refuse-pay',
          'No pagar y terminar el ejercicio',
          't_safe',
          ['advance-fee'],
          [],
          false,
          'Desconfiar de un cobro inicial es el hábito seguro.',
          'Si la oferta fuera real, no pediría $35 para contratarte.',
        ),
        option(
          'pay-after-check',
          'Pagar los $35 aunque desconfíes',
          't_paid',
          [],
          ['advance-fee'],
          false,
          'Reconocer la señal no basta si igual adelantas el dinero.',
          'No se promete recuperar los $35.',
        ),
      ],
    ),
    n_research: node(
      'n_research',
      'En Muro Profesional (ficción) no hay oficina, contratos ni reseñas independientes de Global Talent Express. Solo aparecen anuncios parecidos que también piden un «kit».',
      '¿Qué decides?',
      false,
      ['advance-fee', 'generic-domain'],
      [
        option(
          'refuse-after-research',
          'No pagar. Cerrar sin enviar dinero',
          't_safe',
          ['advance-fee', 'generic-domain'],
          [],
          false,
          'Verificar por otro canal evitó el cobro.',
          'Desconfía de cualquier oferta que requiera dinero inicial.',
        ),
        option(
          'pay-after-research',
          'Pagar los $35 igual',
          't_paid',
          [],
          ['advance-fee'],
          false,
          'La verificación no se usó para detener el pago.',
          'No se promete recuperar los $35.',
        ),
      ],
    ),
    t_safe: node(
      't_safe',
      'Cierre seguro: no pagaste. Las solicitudes de pagos anticipados vinculados a una contratación son una señal clara de alerta. El dinero de un trabajo legítimo no se cobra al candidato.',
      '',
      true,
      ['advance-fee'],
      [],
    ),
    t_paid: node(
      't_paid',
      'En la ficción pagaste $35 y no llegó kit ni contrato. No se garantiza recuperar el dinero. Próxima vez: investiga la empresa por un canal independiente y no adelantes pagos para que te contraten.',
      '',
      true,
      ['advance-fee'],
      [],
    ),
  },
};
