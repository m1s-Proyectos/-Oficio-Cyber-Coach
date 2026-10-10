# convex/

Backend de OFICIO Cyber Coach (desde la Fase 03).

| Archivo             | Contenido                                                      |
| ------------------- | -------------------------------------------------------------- |
| `schema.ts`         | Esquema. Por ahora solo la tabla `scenarios` (catálogo).       |
| `lib/validators.ts` | Validadores compartidos (`scenarioSlug`, campos del catálogo). |
| `scenarios.ts`      | Query pública `listPublished`, con `args` y `returns`.         |
| `seedData.ts`       | Catálogo ficticio mínimo. No es el guion de las simulaciones.  |
| `seed.ts`           | Mutación interna idempotente `seedScenarios`.                  |
| `_generated/`       | Código generado por la CLI. Se versiona; no se edita a mano.   |

Las tablas `sessions`, `decisions` y `results` (PLAN-MAESTRO, sección 8.2) llegan con las Fases 04 y 07.

Desarrollo: `npx convex dev`. Producción (`npx convex deploy`) solo con autorización explícita.
