/*
 * Catálogo de vista previa para la portada — FASE 02 (temporal).
 *
 * Es la lista mínima necesaria para que la portada muestre dos tarjetas que
 * llevan al reproductor placeholder. NO es la definición de escenarios: la
 * `ScenarioDefinition` real llega en las Fases 05 y 06 a partir de los guiones
 * aprobados en `docs/guion-simulacion-a.md` y `docs/guion-simulacion-b.md`.
 *
 * Textos resumidos de `docs/contexto-producto.md`.
 */

import type { RouteName } from '../../app/router';

export interface ScenarioCatalogEntry {
  slug: 'whatsapp-familiar' | 'tienda-iphone';
  kicker: string;
  title: string;
  description: string;
  statusLabel: string;
  route: RouteName;
}

export const SCENARIO_CATALOG: readonly ScenarioCatalogEntry[] = [
  {
    slug: 'whatsapp-familiar',
    kicker: 'Simulación A · Ingeniería social',
    title: '¿Y si realmente fuera mi familiar?',
    description:
      'Un mensaje urgente llega por WhatsApp pidiendo $200 para una emergencia médica. ' +
      'Practica cómo verificar la identidad antes de enviar dinero bajo presión emocional.',
    statusLabel: 'Vista previa de diseño',
    route: 'simulation',
  },
  {
    slug: 'tienda-iphone',
    kicker: 'Simulación B · Compra en línea',
    title: 'El iPhone de $610 que parecía una oportunidad única',
    description:
      'Una tienda en línea ofrece el teléfono a casi la mitad del precio y promete entrega ' +
      'en siete días. Decide cuándo investigar y cuándo detener un pago extra inesperado.',
    statusLabel: 'Vista previa de diseño',
    route: 'simulation',
  },
] as const;
