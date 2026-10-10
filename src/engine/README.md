# src/engine

Motor puro de simulaciones (Fase 04). Sin React, sin Convex, sin `Date.now()` para puntuar.

| Archivo                       | Rol                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `types.ts`                    | `ScenarioDefinition`, sesión lógica, rúbrica y resultados.                   |
| `engine.ts`                   | `start`, `getCurrent`, `choose`, `evaluate`, `complete`, `recommend`.        |
| `validate.ts`                 | Comprueba que el grafo sea cerrado y tenga rama de riesgo y de verificación. |
| `fixtures/minimalScenario.ts` | Escenario de prueba. No es WhatsApp ni la tienda del iPhone.                 |

El cliente no envía el nodo destino ni el puntaje. `choose` solo recibe `optionId`.

D1 (cómo se publica el guion) y D2 (sesión en Convex) no se resuelven aquí. Este módulo solo transforma estado en memoria.
