/*
 * Resumen simulado para la pantalla de resultados — FASE 02 (temporal).
 *
 * Visualiza cómo se verá el desglose por dimensiones de la rúbrica propuesta
 * Los números aquí son de demostración y solo enseñan la plantilla visual.
 */

export interface MockRubricDimension {
  key: 'reconocimiento' | 'verificacion' | 'contencion' | 'recuperacion';
  label: string;
  value: number;
  max: number;
  tone: 'beacon' | 'verify' | 'info' | 'alert';
}

export interface MockSummary {
  slug: 'whatsapp-familiar' | 'tienda-iphone';
  scenarioTitle: string;
  totalScore: number;
  totalMax: number;
  reading: string;
  dimensions: readonly MockRubricDimension[];
  recommendations: readonly string[];
}

const BASE_RECOMMENDATIONS = [
  'Verifica por un canal distinto al que envió el mensaje antes de transferir dinero.',
  'Si ya enviaste el pago en la ficción, contacta al proveedor del medio de pago y a una persona de confianza. No se promete recuperar el dinero.',
  'Un precio bajo o unos comentarios positivos no demuestran por sí solos que una tienda sea legítima.',
] as const;

const MOCKS = {
  'whatsapp-familiar': {
    slug: 'whatsapp-familiar',
    scenarioTitle: 'Un mensaje urgente de madrugada',
    totalScore: 55,
    totalMax: 100,
    reading:
      'Las decisiones reconocieron la urgencia como señal, pero quedaron pasos aún expuestos. ' +
      'Vuelve a intentarlo priorizando la verificación independiente.',
    dimensions: [
      { key: 'reconocimiento', label: 'Reconocimiento', value: 18, max: 25, tone: 'beacon' },
      { key: 'verificacion', label: 'Verificación', value: 10, max: 25, tone: 'info' },
      { key: 'contencion', label: 'Contención', value: 15, max: 25, tone: 'verify' },
      { key: 'recuperacion', label: 'Recuperación', value: 12, max: 25, tone: 'alert' },
    ],
    recommendations: BASE_RECOMMENDATIONS,
  },
  'tienda-iphone': {
    slug: 'tienda-iphone',
    scenarioTitle: 'La oferta del iPhone a $610',
    totalScore: 62,
    totalMax: 100,
    reading:
      'Hubo señales reconocidas y verificación parcial. El pago extra inesperado seguía siendo ' +
      'un punto crítico donde conviene detenerse por un canal independiente.',
    dimensions: [
      { key: 'reconocimiento', label: 'Reconocimiento', value: 20, max: 25, tone: 'beacon' },
      { key: 'verificacion', label: 'Verificación', value: 15, max: 25, tone: 'info' },
      { key: 'contencion', label: 'Contención', value: 14, max: 25, tone: 'verify' },
      { key: 'recuperacion', label: 'Recuperación', value: 13, max: 25, tone: 'alert' },
    ],
    recommendations: BASE_RECOMMENDATIONS,
  },
} satisfies Record<MockSummary['slug'], MockSummary>;

export function getMockSummary(slug: string): MockSummary | null {
  if (slug === 'whatsapp-familiar' || slug === 'tienda-iphone') {
    return MOCKS[slug];
  }
  return null;
}
