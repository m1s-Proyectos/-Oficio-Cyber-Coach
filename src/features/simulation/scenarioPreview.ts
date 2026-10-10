/*
 * Vista previa del reproductor de escenarios — FASE 02 (temporal).
 *
 * Datos ficticios usados exclusivamente para mostrar cómo se verá el
 * reproductor. Las opciones aquí NO se evalúan, NO se puntúan y NO
 * desencadenan transiciones. El motor real llega en la Fase 04 y los guiones
 * finales en las Fases 05 y 06.
 *
 * Resumen tomado de `docs/contexto-producto.md`.
 */

export interface PreviewOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  /** Nota puramente visual para el prototipo. No afecta a cálculos. */
  previewNote?: string;
}

export interface PreviewSignal {
  label: string;
  tone: 'beacon' | 'alert' | 'info' | 'verify';
}

export interface ScenarioPreview {
  slug: 'whatsapp-familiar' | 'tienda-iphone';
  kicker: string;
  title: string;
  summary: string;
  sender: {
    name: string;
    channel: string;
    timestamp: string;
  };
  message: string;
  prompt: string;
  options: readonly PreviewOption[];
  signals: readonly PreviewSignal[];
}

const WHATSAPP: ScenarioPreview = {
  slug: 'whatsapp-familiar',
  kicker: 'Simulación A · WhatsApp · Entrenamiento ficticio',
  title: 'Un mensaje urgente de madrugada',
  summary:
    'Recibes un mensaje que parece venir de un familiar cercano. La cuenta podría estar ' +
    'comprometida y la persona al otro lado presiona para que envíes dinero sin confirmar.',
  sender: {
    name: 'Familiar · Mensaje recibido',
    channel: 'WhatsApp',
    timestamp: '10:42 a. m.',
  },
  message:
    'Hola, necesito que me ayudes por favor. Estoy en el hospital y me están cobrando $200. ' +
    'Necesito que me los mandes lo más rápido posible. Después te explico, por favor, no tengo tiempo.',
  prompt: '¿Qué harías en esta situación? Selecciona una opción para continuar la historia.',
  options: [
    {
      key: 'A',
      text: 'Enviar los $200 inmediatamente. Es mi familiar y podría estar en peligro.',
    },
    {
      key: 'B',
      text: 'Preguntar por WhatsApp qué pasó y enviar el dinero si responde correctamente.',
    },
    {
      key: 'C',
      text: 'Llamar a mi familiar al número habitual o contactar a otra persona de confianza para verificar la emergencia.',
    },
    {
      key: 'D',
      text: 'Bloquear el contacto inmediatamente sin comprobar nada.',
    },
  ],
  signals: [
    { label: 'Urgencia emocional', tone: 'alert' },
    { label: 'Canal único de contacto', tone: 'beacon' },
    { label: 'Petición inmediata de dinero', tone: 'beacon' },
  ],
};

const TIENDA_IPHONE: ScenarioPreview = {
  slug: 'tienda-iphone',
  kicker: 'Simulación B · Compra en línea · Entrenamiento ficticio',
  title: 'La oferta del iPhone a $610',
  summary:
    'María ahorró para un iPhone 14. En línea aparece una tienda que lo ofrece por mucho menos ' +
    'que los comercios físicos y promete entrega rápida. ¿Cuándo conviene detenerse a verificar?',
  sender: {
    name: 'Tienda en línea · Publicación ficticia',
    channel: 'Red social',
    timestamp: 'Hoy',
  },
  message:
    'iPhone 14 por $610. Entrega internacional en 7 días. Clientes satisfechos. ¡Aprovecha ' +
    'antes de que se agote! Más de 15 comentarios positivos avalan a la tienda.',
  prompt: 'María tiene que decidir cómo proceder. ¿Qué le recomendarías?',
  options: [
    {
      key: 'A',
      text: 'Comprar inmediatamente: hay muchos comentarios positivos y el precio es atractivo.',
    },
    {
      key: 'B',
      text: 'Depositar la mitad ahora y pagar el resto cuando llegue el teléfono.',
    },
    {
      key: 'C',
      text: 'Investigar la identidad de la tienda, contrastar opiniones independientes y verificar la protección del pago antes de decidir.',
    },
    {
      key: 'D',
      text: 'Descartar automáticamente cualquier producto cuyo precio sea inferior al de una tienda física.',
    },
  ],
  signals: [
    { label: 'Precio muy por debajo del mercado del escenario', tone: 'beacon' },
    { label: 'Reseñas sin fuente independiente', tone: 'beacon' },
    { label: 'Pago completo por adelantado', tone: 'alert' },
  ],
};

const PREVIEWS = {
  'whatsapp-familiar': WHATSAPP,
  'tienda-iphone': TIENDA_IPHONE,
} satisfies Record<ScenarioPreview['slug'], ScenarioPreview>;

export function getScenarioPreview(slug: string): ScenarioPreview | null {
  if (slug === 'whatsapp-familiar' || slug === 'tienda-iphone') {
    return PREVIEWS[slug];
  }
  return null;
}
