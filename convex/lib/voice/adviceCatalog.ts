/**
 * Catálogo fijo de consejos educativos para TTS (Fase 09.5).
 * Identificadores = slug + señal. El texto es el recommendation del grafo,
 * sin nombres de elenco ni texto libre del cliente.
 */

export const VOICE_ADVICE_CATALOG = {
  'whatsapp-familiar:urgency': 'La prisa no sustituye comprobar por otro canal.',
  'whatsapp-familiar:emotional-pressure':
    'Preocuparse es humano; el afecto no identifica al remitente.',
  'whatsapp-familiar:same-channel': 'Un chat no demuestra quién escribe.',
  'whatsapp-familiar:money-ask': 'Verifica la emergencia antes de transferir.',
  'whatsapp-familiar:second-ask': 'Haber enviado antes no obliga a enviar otra vez.',
  'whatsapp-familiar:silence-ambiguous': 'El silencio no confirma ni descarta el fraude.',
  'whatsapp-familiar:compromised-account': 'Confirma con el número o la persona que ya tenías.',
  'whatsapp-familiar:block-alone':
    'Bloquear puede cortar el contacto; no demuestra que la emergencia sea falsa.',
  'tienda-iphone:low-price':
    'Compara y verifica; el precio solo no prueba ni descarta un problema.',
  'tienda-iphone:review-volume': 'Busca opiniones fuera del canal que vende.',
  'tienda-iphone:recent-accounts': 'La antigüedad es una pista, no una prueba aislada.',
  'tienda-iphone:own-channel-proof': 'Una fuente independiente no es el propio anuncio.',
  'tienda-iphone:prepaid-full':
    'Pregunta qué protección tiene el medio de pago si el vendedor desaparece.',
  'tienda-iphone:urgency-stock': 'La prisa no sustituye comprobar condiciones y vendedor.',
  'tienda-iphone:extra-fee':
    'Verifica el motivo por un canal oficial, no solo el chat de la tienda.',
  'tienda-iphone:store-vanish': 'Suele llegar tarde; conviene contener el daño y no pagar más.',
  'empleo-pago-previo:advance-fee': 'Desconfía de cualquier oferta que pida dinero inicial.',
  'empleo-pago-previo:high-salary': 'Un sueldo alto no prueba que la oferta sea real.',
  'empleo-pago-previo:generic-domain': 'Investiga la empresa por un canal independiente.',
  'codigo-verificacion:unexpected-call': 'Cuelga y usa el número oficial que ya tenías.',
  'codigo-verificacion:otp-request':
    'Nunca compartas un código de verificación con quien llama o escribe.',
  'codigo-verificacion:money-panic': 'La prisa no obliga a dictar el código.',
  'supuesto-jefe:personal-mail': 'Comprueba el dominio corporativo que ya usas en el trabajo.',
  'supuesto-jefe:untraceable-pay': 'Los regalos corporativos no se compran por correo personal.',
  'supuesto-jefe:secret-urgency': 'La autoridad aparente no sustituye el proceso de finanzas.',
} as const;

export type VoiceAdviceId = keyof typeof VOICE_ADVICE_CATALOG;

export const VOICE_ADVICE_IDS = Object.keys(VOICE_ADVICE_CATALOG) as VoiceAdviceId[];

export const MAX_ADVICE_TEXT_CHARS = 280;

export function isVoiceAdviceId(value: string): value is VoiceAdviceId {
  return Object.prototype.hasOwnProperty.call(VOICE_ADVICE_CATALOG, value);
}

export function resolveAdviceText(adviceId: string): string | null {
  if (!isVoiceAdviceId(adviceId)) {
    return null;
  }
  return VOICE_ADVICE_CATALOG[adviceId];
}

export function fingerprintText(text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
