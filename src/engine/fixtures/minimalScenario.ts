/*
 * Fixture mínimo de la Fase 04. NO es la Simulación A ni la B.
 *
 * Sirve para ejercitar el motor y para una demo local del reproductor.
 * Los puntos son datos de prueba del fixture, no el puntaje oficial del producto.
 * Los guiones de WhatsApp y de la tienda se aprueban en las Fases 05 y 06.
 */

import type { ScenarioDefinition } from '../types';

export const FIXTURE_SLUG = 'fixture-motor';

export const MINIMAL_SCENARIO: ScenarioDefinition = {
  slug: FIXTURE_SLUG,
  version: 0,
  title: 'Un código que llega con prisa',
  fictionNotice:
    'Escenario de prueba del motor. No es un guion oficial ni describe un fraude concreto.',
  initialNodeId: 'start',
  signals: {
    urgency: {
      id: 'urgency',
      label: 'Urgencia para saltarse la comprobación',
      recommendation: 'La prisa no sustituye una verificación por un canal que ya conocías.',
    },
    'same-channel': {
      id: 'same-channel',
      label: 'Seguir solo por el canal que inició el pedido',
      recommendation: 'Confirma por un medio independiente del mensaje que pide el código.',
    },
  },
  nodes: {
    start: {
      id: 'start',
      situation:
        'Recibes un mensaje que pide un código de verificación «ahora mismo». Quien escribe dice que lo necesita para no perder el acceso a una cuenta compartida.',
      prompt: '¿Qué haces?',
      isTerminal: false,
      visibleSignalIds: ['urgency'],
      options: [
        {
          id: 'send-now',
          label: 'Enviar el código de inmediato para no perder tiempo.',
          nextNodeId: 'second-ask',
          evaluation: {
            points: { recognition: 2, verification: 0, containment: 0, recovery: 0 },
            milestoneId: 'fixture-send-now',
            recognizedSignalIds: [],
            overlookedSignalIds: ['urgency', 'same-channel'],
            leavesRoomToCorrect: true,
          },
          feedback: {
            explanation:
              'En esta ficción el código ya salió. Todavía puedes detenerte antes de enviar otro.',
            recommendation: 'No sigas enviando códigos solo porque el primer mensaje tenía prisa.',
          },
        },
        {
          id: 'verify-first',
          label: 'Confirmar el pedido por un canal que ya tenías, no por este mensaje.',
          nextNodeId: 'safe-end',
          evaluation: {
            points: { recognition: 12, verification: 15, containment: 15, recovery: 8 },
            milestoneId: 'fixture-verify-first',
            recognizedSignalIds: ['urgency', 'same-channel'],
            overlookedSignalIds: [],
            leavesRoomToCorrect: false,
          },
          feedback: {
            explanation:
              'Verificaste por otro canal. En la ficción, la persona de confianza no pidió ningún código.',
            recommendation: 'Repite esa pausa cuando un mensaje mezcle urgencia y un secreto.',
          },
        },
      ],
    },
    'second-ask': {
      id: 'second-ask',
      situation:
        'Quien escribió agradece el primer código y pide un segundo «para terminar». La presión aumenta.',
      prompt: '¿Qué haces ahora?',
      isTerminal: false,
      visibleSignalIds: ['urgency', 'same-channel'],
      options: [
        {
          id: 'send-again',
          label: 'Enviar el segundo código. Ya diste el primero.',
          nextNodeId: 'risk-end',
          evaluation: {
            points: { recognition: 0, verification: 0, containment: 0, recovery: 2 },
            milestoneId: 'fixture-send-again',
            recognizedSignalIds: [],
            overlookedSignalIds: ['urgency', 'same-channel'],
            leavesRoomToCorrect: false,
          },
          feedback: {
            explanation:
              'En la ficción enviaste un segundo secreto. Haber pagado o enviado antes no obliga a repetirlo.',
            recommendation: 'Ante una segunda petición, pausa y verifica por otro canal.',
          },
        },
        {
          id: 'stop-and-check',
          label: 'Detenerte y verificar por otro canal antes de enviar nada más.',
          nextNodeId: 'recover-end',
          evaluation: {
            points: { recognition: 10, verification: 12, containment: 10, recovery: 15 },
            milestoneId: 'fixture-stop-and-check',
            recognizedSignalIds: ['urgency', 'same-channel'],
            overlookedSignalIds: [],
            leavesRoomToCorrect: false,
          },
          feedback: {
            explanation:
              'Te detuviste a tiempo. En la ficción, el contacto habitual no había pedido ningún código.',
            recommendation:
              'Un primer envío no obliga a continuar. Verificar sigue siendo posible.',
          },
        },
      ],
    },
    'safe-end': {
      id: 'safe-end',
      situation:
        'Cierre de la rama de verificación. No enviaste el código. El ejercicio termina aquí.',
      prompt: '',
      isTerminal: true,
      visibleSignalIds: ['urgency', 'same-channel'],
      options: [],
    },
    'recover-end': {
      id: 'recover-end',
      situation:
        'Cierre de la rama de recuperación. Enviaste un código y te detuviste ante el segundo.',
      prompt: '',
      isTerminal: true,
      visibleSignalIds: ['urgency', 'same-channel'],
      options: [],
    },
    'risk-end': {
      id: 'risk-end',
      situation:
        'Cierre de la rama de riesgo. En la ficción enviaste dos códigos bajo presión. El ejercicio termina aquí.',
      prompt: '',
      isTerminal: true,
      visibleSignalIds: ['urgency', 'same-channel'],
      options: [],
    },
  },
};
