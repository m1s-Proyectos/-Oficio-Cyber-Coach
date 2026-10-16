import type { ScenarioDefinition, ScenarioNode, ScenarioOption } from '../../engine';
import { scoreForCodigoOption } from './scoring';

export const CODIGO_VERIFICACION_SLUG = 'codigo-verificacion';

/**
 * Adaptación educativa (reto-7 de setup.js, no ejecutado):
 * El original es MCQ sobre una llamada bancaria. Aquí hay grafo: contestar,
 * colgar, dictar o llamar al número oficial de la tarjeta ficticia.
 * Banco «Caja Norte» y código 482193 son solo del ejercicio.
 * Enseñanza explícita: nunca compartir un OTP con quien llama o escribe.
 */
export const CODIGO_VERIFICACION_FICTION_NOTICE =
  'Historia ficticia. Caja Norte no es un banco real. El código 482193 es de juguete: no lo copies a un sistema real ni dictes códigos verdaderos.';

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
  const scored = scoreForCodigoOption(id);
  return {
    id,
    label,
    nextNodeId,
    evaluation: {
      points: scored.points,
      recognizedSignalIds,
      overlookedSignalIds,
      leavesRoomToCorrect,
      ...(scored.milestoneId !== undefined ? { milestoneId: scored.milestoneId } : {}),
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

export const CODIGO_VERIFICACION_SCENARIO: ScenarioDefinition = {
  slug: CODIGO_VERIFICACION_SLUG,
  version: 1,
  title: 'El código de verificación',
  fictionNotice: CODIGO_VERIFICACION_FICTION_NOTICE,
  initialNodeId: 'n_ring',
  signals: {
    'unexpected-call': {
      id: 'unexpected-call',
      label: 'Llamada inesperada alertando sobre un supuesto fraude',
      recommendation: 'Cuelga y usa el número oficial que ya tenías.',
    },
    'otp-request': {
      id: 'otp-request',
      label: 'Piden el código enviado por SMS',
      recommendation: 'Nunca compartas un código de verificación con quien llama o escribe.',
    },
    'money-panic': {
      id: 'money-panic',
      label: 'Creación de pánico financiero',
      recommendation: 'La prisa no obliga a dictar el código.',
    },
  },
  nodes: {
    n_ring: node(
      'n_ring',
      'Llamada entrante · Soporte Técnico de Banco. 02:15 p. m. No está en tus contactos de Caja Norte.',
      '¿Qué haces?',
      false,
      ['unexpected-call'],
      [
        option(
          'answer-call',
          'Contestar la llamada',
          'n_call',
          ['unexpected-call'],
          [],
          true,
          'Contestar no obliga a dar el código.',
          'Si piden un SMS, cuelga.',
        ),
        option(
          'decline-call',
          'Rechazar y no hablar con un número desconocido',
          'n_sms',
          ['unexpected-call'],
          [],
          true,
          'Evitar la llamada corta la presión de voz.',
          'Si llegó un SMS, no lo dictes a nadie.',
        ),
      ],
    ),
    n_call: node(
      'n_call',
      '«Hola, le hablamos del departamento de seguridad de su banco. Hemos detectado un acceso no autorizado a su cuenta. Para bloquearlo y asegurar su dinero, dígame el código de 6 dígitos que le acabo de enviar por SMS».',
      '¿Qué debes hacer con el código recibido?',
      false,
      ['unexpected-call', 'otp-request', 'money-panic'],
      [
        option(
          'dictate',
          'Dictarlo rápidamente para evitar que roben el dinero de mi cuenta.',
          't_leaked',
          [],
          ['otp-request', 'money-panic'],
          false,
          'Quien pide el OTP está intentando entrar a la cuenta en ese momento.',
          'Nunca compartas un código de verificación con quien llama o escribe.',
        ),
        option(
          'share-pro',
          'Compartirlo solo porque el operador suena muy profesional y conoce mi nombre completo.',
          't_leaked',
          [],
          ['otp-request'],
          false,
          'El tono profesional no autoriza a entregar la llave de la cuenta.',
          'Los bancos no necesitan que les dictes un código que ellos no enviaron para ti.',
        ),
        option(
          'hang-up',
          'Colgar la llamada. Ningún empleado de banco legítimo solicita códigos de verificación por teléfono.',
          'n_after_hang',
          ['otp-request', 'unexpected-call'],
          [],
          true,
          'Colgar corta el intento de captura del OTP.',
          'Siguiente paso: usar el número oficial de la tarjeta, no el de esta llamada.',
        ),
      ],
    ),
    n_sms: node(
      'n_sms',
      'SMS de Caja Norte (ficción): «482193 es tu código de verificación. No lo compartas con nadie. El banco no te lo pedirá por teléfono.» Este número es de juguete.',
      '¿Qué haces con este código?',
      false,
      ['otp-request'],
      [
        option(
          'call-official-from-sms',
          'Llamar al número oficial al dorso de la tarjeta ficticia',
          't_safe',
          ['otp-request', 'unexpected-call'],
          [],
          false,
          'Un canal que tú ya tenías, no el de la llamada.',
          'Nunca compartas un código de verificación con quien llama o escribe.',
        ),
        option(
          'dictate-from-sms',
          'Devolver la llamada y dictar 482193',
          't_leaked',
          [],
          ['otp-request'],
          false,
          'Devolver la llamada al mismo número entrega el OTP.',
          'El código es personal y secreto.',
        ),
      ],
    ),
    n_after_hang: node(
      'n_after_hang',
      'Colgaste. El SMS ficticio sigue en pantalla: 482193. El texto dice que el banco no pedirá el código por teléfono.',
      '¿Cuál es el siguiente paso seguro?',
      false,
      ['otp-request'],
      [
        option(
          'call-official',
          'Llamar al número oficial al dorso de la tarjeta ficticia',
          't_safe',
          ['otp-request'],
          [],
          false,
          'Verificar por el canal impreso, no por quien acaba de llamar.',
          'Nunca compartas un código de verificación con quien llama o escribe.',
        ),
        option(
          'callback-same',
          'Devolver la llamada al mismo número y dictar el código',
          't_leaked',
          [],
          ['otp-request'],
          false,
          'El mismo canal de la trampa no sirve para verificar.',
          'Usa solo el número que ya tenías en la tarjeta.',
        ),
      ],
    ),
    t_safe: node(
      't_safe',
      'Cierre seguro: no dictaste el código. Los códigos de verificación son personales y secretos. Si alguien te los pide por teléfono o por mensaje, está intentando acceder a tus cuentas. Cuelga y llama al número oficial.',
      '',
      true,
      ['otp-request'],
      [],
    ),
    t_leaked: node(
      't_leaked',
      'En la ficción, quien pidió 482193 entra a la cuenta en ese instante. El OTP es la llave. Nunca lo compartas con quien llama o escribe. Cuelga y usa el número oficial. Este ejercicio no usa códigos reales.',
      '',
      true,
      ['otp-request'],
      [],
    ),
  },
};
