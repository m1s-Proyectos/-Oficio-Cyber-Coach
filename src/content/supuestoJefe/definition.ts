import type { ScenarioDefinition, ScenarioNode, ScenarioOption } from '../../engine';
import { UNOFFICIAL_ZERO_POINTS } from './zeroPoints';

export const SUPUESTO_JEFE_SLUG = 'supuesto-jefe';

/**
 * Adaptación educativa (reto-4 de setup.js, no ejecutado):
 * MCQ original → grafo con compra, negociación débil y verificación por
 * Canal Oficina (nombre ficticio para Slack/Teams del original).
 * Se conservan Gmail, 5 tarjetas de $100, confidencialidad y takeaway.
 */
export const SUPUESTO_JEFE_FICTION_NOTICE =
  'Historia ficticia. El director, Gmail y las tarjetas no pertenecen a una empresa real. No compres ni envíes códigos. No se piden credenciales.';

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

export const SUPUESTO_JEFE_SCENARIO: ScenarioDefinition = {
  slug: SUPUESTO_JEFE_SLUG,
  version: 1,
  title: 'El supuesto jefe',
  fictionNotice: SUPUESTO_JEFE_FICTION_NOTICE,
  initialNodeId: 'n_inbox',
  signals: {
    'personal-mail': {
      id: 'personal-mail',
      label: 'Correo externo (Gmail) para suplantar a un ejecutivo',
      recommendation: 'Comprueba el dominio corporativo que ya usas en el trabajo.',
    },
    'untraceable-pay': {
      id: 'untraceable-pay',
      label: 'Tarjetas de regalo u otro pago difícil de rastrear',
      recommendation: 'Los regalos corporativos no se compran por correo personal.',
    },
    'secret-urgency': {
      id: 'secret-urgency',
      label: 'Urgencia extrema y pedido de confidencialidad',
      recommendation: 'La autoridad aparente no sustituye el proceso de finanzas.',
    },
  },
  nodes: {
    n_inbox: node(
      'n_inbox',
      '{{learner}} recibe un correo de director.ejecutivo.corp@gmail.com. Asunto: «URGENTE: Solicitud confidencial de tarjetas de regalo».',
      '¿Qué haces?',
      false,
      ['personal-mail'],
      [
        option(
          'open-mail',
          'Abrir el correo',
          'n_request',
          ['personal-mail'],
          [],
          true,
          'Leer permite ver el pedido. Aún no compras.',
          'Mira el dominio y si piden un canal informal de pago.',
        ),
      ],
    ),
    n_request: node(
      'n_request',
      'Hola. Estoy en una reunión con inversores muy importantes y necesito sorprenderlos con unos obsequios corporativos. Por favor, compra 5 tarjetas de regalo digitales de $100 USD cada una y envíame los códigos por este medio antes de las 2:00 p. m. Te lo reembolsaré el lunes.',
      '¿Cuál es la respuesta más segura?',
      false,
      ['personal-mail', 'untraceable-pay', 'secret-urgency'],
      [
        option(
          'buy-cards',
          'Comprar las tarjetas rápidamente para cumplir con la solicitud del director.',
          't_bought',
          [],
          ['personal-mail', 'untraceable-pay', 'secret-urgency'],
          false,
          'En la ficción se gastan $500 y no hay reembolso.',
          'Un directivo real usa canales institucionales, no Gmail personal.',
        ),
        option(
          'verify-internal',
          'Confirmar la petición por un canal corporativo interno (Canal Oficina o llamada directa) y seguir el proceso financiero oficial.',
          'n_verify',
          ['personal-mail', 'untraceable-pay', 'secret-urgency'],
          [],
          true,
          'Verificar por el canal que ya conocías, no por este Gmail.',
          'Consulta también administración o finanzas.',
        ),
        option(
          'ask-less',
          'Responder al correo preguntando si el monto puede ser menor debido al presupuesto.',
          'n_negotiate',
          [],
          ['personal-mail', 'untraceable-pay'],
          true,
          'Negociar el monto sigue dentro del mismo canal fraudulento.',
          'Aún puedes verificar por Canal Oficina.',
        ),
      ],
    ),
    n_negotiate: node(
      'n_negotiate',
      'Respondes al Gmail. Contestan: «Hazlo por 3 tarjetas si hace falta, pero antes de las 2:00. No hables con nadie, es confidencial.»',
      '¿Cómo sigues?',
      false,
      ['secret-urgency', 'untraceable-pay'],
      [
        option(
          'buy-three',
          'Comprar tres tarjetas para cumplir a medias',
          't_bought',
          [],
          ['untraceable-pay', 'secret-urgency'],
          false,
          'Bajar el monto no valida al remitente.',
          'La autoridad aparente no sustituye el proceso formal.',
        ),
        option(
          'verify-after-ask',
          'Dejar este hilo y confirmar en Canal Oficina',
          'n_verify',
          ['personal-mail', 'secret-urgency'],
          [],
          true,
          'Cambiar de canal es el hábito seguro.',
          'Pregunta en el medio interno que ya usabas.',
        ),
      ],
    ),
    n_verify: node(
      'n_verify',
      'En Canal Oficina (ficción del Slack o Teams del original) el director real está en otra reunión y no pidió tarjetas. Finanzas confirma: los obsequios pasan por proveedor homologado, nunca por Gmail personal.',
      '¿Qué haces?',
      false,
      ['personal-mail', 'untraceable-pay'],
      [
        option(
          'follow-finance',
          'Seguir el proceso oficial y no comprar',
          't_safe',
          ['personal-mail', 'untraceable-pay', 'secret-urgency'],
          [],
          false,
          'La verificación interna evitó el gasto.',
          'La urgencia no sustituye la autorización formal.',
        ),
        option(
          'buy-anyway',
          'Comprar las cinco tarjetas por si acaso',
          't_bought',
          [],
          ['untraceable-pay'],
          false,
          'Ignorar el canal interno deja el dinero en un medio no rastreable.',
          'No se promete recuperar los $500.',
        ),
      ],
    ),
    t_safe: node(
      't_safe',
      'Cierre seguro: no compraste. La autoridad aparente y la urgencia no sustituyen los procedimientos formales. Verifica siempre por un canal corporativo conocido.',
      '',
      true,
      ['personal-mail'],
      [],
    ),
    t_bought: node(
      't_bought',
      'En la ficción compraste tarjetas y enviaste los códigos por Gmail. No hay reembolso el lunes. No se garantiza recuperar el dinero. Próxima vez: Canal Oficina y finanzas, nunca el correo personal del supuesto jefe.',
      '',
      true,
      ['untraceable-pay'],
      [],
    ),
  },
};
