import type { ScenarioDocument } from './lib/validators';

/*
 * Siembra ficticia mínima del catálogo (Fase 03).
 *
 * Solo metadatos de catálogo. No incluye el grafo. `whatsapp-familiar`
 * permanece en `version: 0`. `tienda-iphone` usa `version: 1` (guion D5
 * jugable en el cliente). Esta siembra no se aplica sola: hace falta
 * `npm run seed` en el entorno de desarrollo, no autorizado en esta fase.
 */

export const SCENARIO_SEED: readonly ScenarioDocument[] = [
  {
    slug: 'whatsapp-familiar',
    version: 0,
    position: 1,
    kicker: 'Simulación A · Ingeniería social',
    title: '¿Y si realmente fuera mi familiar?',
    summary:
      'Un mensaje urgente llega por WhatsApp pidiendo $200 para una emergencia médica. ' +
      'Practica cómo verificar la identidad antes de enviar dinero bajo presión emocional.',
    fictionNotice:
      'Historia ficticia. Los personajes, importes y mensajes son parte del ejercicio.',
    published: true,
  },
  {
    slug: 'tienda-iphone',
    version: 1,
    position: 2,
    kicker: 'Simulación B · Compra en línea',
    title: 'El iPhone de $610 que parecía una oportunidad única',
    summary:
      'Una tienda en línea ofrece el teléfono a casi la mitad del precio y promete entrega ' +
      'en siete días. Decide cuándo investigar y cuándo detener un pago extra inesperado.',
    fictionNotice:
      'Historia ficticia. La tienda, los comentarios y los importes son parte del ejercicio.',
    published: true,
  },
  /*
   * Pendiente remoto (Fase 09.2): no ejecutar seed.
   * Los tres slugs ya son jugables en el cliente (LOCAL_PREVENTION_CATALOG).
   *
   * { slug: 'empleo-pago-previo', version: 1, position: 3, ... }
   * { slug: 'codigo-verificacion', version: 1, position: 4, ... }
   * { slug: 'supuesto-jefe', version: 1, position: 5, ... }
   */
];
