import type { ScenarioDocument } from './lib/validators';

/*
 * Siembra ficticia mínima del catálogo (Fase 03).
 *
 * Solo metadatos de catálogo resumidos de `docs/contexto-producto.md`. No es
 * el guion: nodos, opciones y puntos se aprueban en `docs/guion-simulacion-a.md`
 * y `docs/guion-simulacion-b.md` antes de las Fases 05 y 06. `version: 0`
 * indica que todavía no hay guion aprobado.
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
    version: 0,
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
];
