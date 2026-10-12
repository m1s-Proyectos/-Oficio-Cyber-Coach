/**
 * Metadatos de catálogo que viven en el cliente.
 *
 * Catálogo local de escenarios de prevención; no requiere servicios externos.
 */

export interface LocalCatalogEntry {
  slug: string;
  position: number;
  kicker: string;
  title: string;
  summary: string;
  playable: boolean;
}

export const LOCAL_PREVENTION_CATALOG: readonly LocalCatalogEntry[] = [
  {
    slug: 'empleo-pago-previo',
    position: 3,
    kicker: 'Prevención · Empleo',
    title: 'El empleo que exige un pago',
    summary:
      'Un correo felicita por un puesto remoto y pide $35 para el kit de trabajo. Practica cómo detectar un cobro anticipado y verificar la oferta por otro canal.',
    playable: true,
  },
  {
    slug: 'codigo-verificacion',
    position: 4,
    kicker: 'Prevención · Identidad',
    title: 'El código de verificación',
    summary:
      'Una llamada dice ser del banco y pide el código de 6 dígitos que acaba de llegar por SMS. El hábito seguro es no compartirlo nunca y colgar.',
    playable: true,
  },
  {
    slug: 'supuesto-jefe',
    position: 5,
    kicker: 'Prevención · Trabajo',
    title: 'El supuesto jefe',
    summary:
      'Un correo personal pide cinco tarjetas de regalo de $100 con urgencia. Verifica por un canal corporativo conocido antes de comprar o transferir.',
    playable: true,
  },
];

export const LOCAL_PLAYABLE_SLUGS: ReadonlySet<string> = new Set([
  'tienda-iphone',
  ...LOCAL_PREVENTION_CATALOG.map((entry) => entry.slug),
]);
