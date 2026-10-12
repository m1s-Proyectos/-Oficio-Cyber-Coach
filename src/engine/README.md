# src/engine

Motor puro de simulaciones. Sin React ni servicios externos.

| Archivo                       | Rol                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `types.ts`                    | `ScenarioDefinition`, sesión lógica, rúbrica y resultados.                   |
| `engine.ts`                   | `start`, `getCurrent`, `choose`, `evaluate`, `complete`, `recommend`.        |
| `validate.ts`                 | Comprueba que el grafo sea cerrado y tenga rama de riesgo y de verificación. |
| `fixtures/minimalScenario.ts` | Escenario de prueba. No es WhatsApp ni la tienda del iPhone.                 |

El cliente no envía el nodo destino ni el puntaje. `choose` solo recibe `optionId`.

El motor valida guiones y transforma estados de sesión en memoria.
