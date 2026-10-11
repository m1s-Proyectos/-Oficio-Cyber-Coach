# Decisiones aprobadas

Registro corto de decisiones de arquitectura ya aprobadas. Las decisiones abiertas viven en `PLAN-MAESTRO.md`, sección 19.

Formato por entrada:

- `YYYY-MM-DD` + título breve.
- Contexto en una línea.
- Decisión tomada.
- Consecuencias relevantes.

---

## 2026-10-10 — Fase 01: fundación técnica React + Vite + TypeScript

- **Contexto.** Primera fase ejecutada tras aprobar `PLAN-MAESTRO.md`. Alcance limitado a la fundación compilable con lint, formato y build.
- **Decisión.** React 18, Vite 5, TypeScript 5 con `strict`, `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`. ESLint 9 en flat config, con `typescript-eslint`, `react-hooks` y `react-refresh`. Prettier 3 integrado vía `eslint-config-prettier`. Un único `package.json` en la raíz. Project references de TypeScript (`tsconfig.app.json` y `tsconfig.node.json`).
- **Consecuencias.** El motor y Convex se instalan en sus respectivas fases, no ahora. El script `npm run check` corre typecheck, lint, format:check y build, y es el que se usa antes de proponer un commit.

## 2026-10-10 — Fase 01: Git local inicializado en `main`

- **Contexto.** Decisión D8 del plan: inicializar Git como parte de la Fase 01.
- **Decisión.** `git init -b main`. Sin remoto. Sin commits en esta ejecución.
- **Consecuencias.** Los dos documentos existentes (`PLAN-MAESTRO.md`, `docs/contexto-producto.md`) quedan preservados como untracked antes de cualquier commit. La creación de commits requiere autorización explícita.

## 2026-10-10 — Fase 01: Convex pospuesto a la Fase 03

- **Contexto.** El plan asigna Convex a la Fase 03.
- **Decisión.** No instalar `convex`, no ejecutar `npx convex dev` ni `npx convex deploy` en la Fase 01. La carpeta `convex/` existe como reserva con un `README.md` que lo explica.
- **Consecuencias.** El reglamento del plan sobre `args`/`returns`, custom functions y auth del servidor aplicará desde la Fase 03.

## 2026-10-10 — Fase 01: sin test runner todavía

- **Contexto.** El plan asigna Vitest a la Fase 04.
- **Decisión.** No instalar Vitest ni ningún otro test runner en la Fase 01. `src/test` queda reservado.
- **Consecuencias.** La aceptación de la Fase 01 se limita a typecheck, lint, format:check y build, tal como pide el plan en la sección 13.

---

## 2026-10-10 — Fase 02: identidad visual propuesta (D7 sigue abierta)

- **Contexto.** El plan dejaba la paleta y tono visual como decisión D7 pendiente. La Fase 02 necesita una propuesta concreta para el prototipo.
- **Decisión.** Paleta semántica con navy profundo (`#1F2A4D`) como primario, ámbar cálido (`#B7801A`) como acento educativo (beacon), teal (`#286F56`) para verificación y rojo apagado (`#99283A`) para alerta usada con moderación. Fondo tipo papel (`#F6F3EC`) en claro y azul-pizarra (`#0D1020`) en oscuro. Tipografía: pila del sistema con `Inter` como primera opción, sin añadir dependencias de web fonts. Todo se expone como custom properties en `src/styles/tokens.css`.
- **Consecuencias.** La identidad queda propuesta en el prototipo visible, no cerrada en el plan maestro. D7 sigue abierta hasta que el equipo la confirme o pida alternativas. Si se cambia, solo se tocan los tokens; los componentes no necesitan refactor.

## 2026-10-10 — Fase 02: enrutamiento con router propio por hash, sin dependencias

- **Contexto.** La fase necesita navegación entre portada, reproductor y resumen. El plan prohíbe añadir dependencias por conveniencia. `react-router-dom@6.x` arrastraba dos CVE moderados (open redirect y hidratación SSR, GHSA-wrjc-x8rr-h8h6 y GHSA-337j-9hxr-rhxg) con fix solo en v7, que es cambio mayor fuera del alcance seguro de la Fase 02.
- **Decisión.** Implementar `src/app/router.tsx` con un enrutador propio por `location.hash` (unos 150 LOC) que ofrece `RouterProvider`, `Link`, `useNavigate` y un diccionario `Routes`. Sin dependencias externas. Las rutas disponibles son `home`, `simulation` (`:slug`), `result` (`:slug`) y `notFound`.
- **Consecuencias.** La aplicación sigue con 0 CVE de producción. Si una fase futura necesita data loaders, suspense o rutas anidadas, el enrutador se reemplaza con autorización por el que el plan apruebe, y las pantallas solo cambian la importación de `Link`/`useNavigate`.

## 2026-10-10 — Fase 02: datos de vista previa confinados a `src/features/*`

- **Contexto.** `src/content/README.md` advierte que `src/content` solo recibe definiciones de escenario a partir de los guiones aprobados (Fases 05 y 06). La Fase 02 necesita texto temporal para que la portada y el reproductor se vean con contenido real.
- **Decisión.** Los datos temporales viven junto a la vista que los usa: `src/features/home/scenarioCatalog.ts`, `src/features/simulation/scenarioPreview.ts` y `src/features/results/mockSummary.ts`. Cada archivo abre con un comentario que lo marca como contenido FASE 02 temporal, y las pantallas muestran una `Alert` o `Badge` de «vista previa de diseño».
- **Consecuencias.** `src/content` sigue limpio para los guiones oficiales. Cuando lleguen las Fases 05–07, se elimina el contenido de preview sin tocar los componentes visuales.

## 2026-10-10 — Fase 02: codificación UTF-8 corregida en los archivos modificados

- **Contexto.** Los archivos escritos por el agente en la Fase 01 (`README.md`, `docs/decisiones.md`, `src/app/App.tsx`) habían quedado sin tildes por una conversión al CP1252 de PowerShell.
- **Decisión.** Verificar la codificación con una prueba de ida y vuelta antes de volver a escribir, confirmar que el canal ya conserva UTF-8 y reescribir con tildes correctas los archivos que esta fase toca.
- **Consecuencias.** Los documentos de dirección técnica (`PLAN-MAESTRO.md`, `docs/contexto-producto.md`) siguen sin tocarse. El resto del repositorio usa UTF-8 limpio.

---

## 2026-10-10 — Fase 03: vinculación al proyecto Convex existente

- **Contexto.** El proyecto `oficio-cyber-coach` (equipo `frank-33094`) ya existía en el dashboard, vacío. No había configuración de Convex en el repositorio.
- **Decisión.** Vincular escribiendo `CONVEX_DEPLOYMENT=dev:blissful-kookabura-305` en `.env.local` (no versionado) en lugar de `npx convex dev --configure`, para poder inspeccionar el deployment en modo lectura antes de subir código. La CLI confirmó el destino `frank-33094:oficio-cyber-coach:dev/frank`.
- **Consecuencias.** No se creó otro proyecto ni deployment. Producción (`intent-ocelot-649`) no se tocó. Cada integrante usa su propio deployment de desarrollo del mismo proyecto.

## 2026-10-10 — Fase 03: esquema mínimo con solo `scenarios`

- **Contexto.** La sección 8.2 del plan define `scenarios`, `sessions`, `decisions` y `results`. La Fase 03 pide esquema, validadores, siembra y lectura desde React.
- **Decisión.** Declarar solo `scenarios`, con campos de catálogo (`slug`, `version`, `position`, `kicker`, `title`, `summary`, `fictionNotice`, `published`) e índices `by_slug` y `by_published_and_position`. El campo `definition` del guion se añade cuando exista el tipo `ScenarioDefinition` (Fases 04 a 06). `sessions`, `decisions` y `results` llegan con las fases que los usan.
- **Consecuencias.** No se fija todavía la forma del grafo (D1) ni de la sesión anónima (D2). `version: 0` en la siembra indica que no hay guion aprobado.

## 2026-10-10 — Fase 03: siembra como `internalMutation` idempotente

- **Contexto.** Hace falta un catálogo ficticio reproducible sin exponer escritura al cliente.
- **Decisión.** `convex/seed.ts` hace upsert por `slug` a partir de `convex/seedData.ts`. Se ejecuta con `npm run seed`. Devuelve `inserted`, `updated` y `unchanged`.
- **Consecuencias.** Ejecutarla varias veces deja el mismo estado. El cliente no puede invocarla.

## 2026-10-10 — Fase 03: `convex/_generated/` se versiona

- **Contexto.** El `.gitignore` de la Fase 01 ignoraba `convex/_generated/`. La CLI indica que ese código debe versionarse porque sin él el proyecto no compila.
- **Decisión.** Quitar `convex/_generated/` del `.gitignore` y excluirlo de Prettier. ESLint ya lo ignoraba.
- **Consecuencias.** `npm run check` funciona en un clon limpio sin acceso a Convex. Tras cambiar `convex/`, hay que volver a generar (lo hace `npm run convex:dev`).

---

## 2026-10-10 — Fase 04: motor puro en memoria; D1 y D2 siguen abiertas

- **Contexto.** El plan asigna a la Fase 04 un motor determinista y Vitest. D1 (grafo embebido frente a nueve tablas) y D2 (sesión anónima en Convex) siguen sin aprobación formal.
- **Decisión.** Implementar `src/engine` como biblioteca pura que consume un `ScenarioDefinition` en memoria. No persistir `definition` en Convex. No crear tablas `sessions`, `decisions` ni `results`. El fixture `fixture-motor` no es un guion oficial.
- **Consecuencias.** El motor ya cubre start, choose, evaluate y complete. La persistencia y la publicación del grafo esperan D1 y D2. El puntaje que se ve en el fixture no es el oficial del producto.

## 2026-10-10 — Fase 04: Vitest 2.1.9, sin subir Vite

- **Contexto.** El plan pide Vitest en esta fase. Vitest 5 corrige avisos de `@vitest/mocker` y `tinypool`, pero exige Vite 6 o superior, cambio mayor no autorizado.
- **Decisión.** Instalar `vitest@2.1.9`, compatible con `vite@5.4.21`. Añadir `npm test` a `npm run check`.
- **Consecuencias.** Las pruebas del motor corren en Node. La vulnerabilidad de Vite/esbuild y los avisos de desarrollo de Vitest 2 quedan documentados, no resueltos.

---

## 2026-10-10 — Dirección de producto: inmersión y personalización (no cierra D1–D9)

- **Contexto.** El propietario estableció que todas las simulaciones, actuales y futuras, deben poder ser experiencias inmersivas y personalizadas en un entorno digital ficticio, no un cuestionario de botones. La arquitectura debe ser común.
- **Decisión registrada.** Se documenta el principio en este archivo y en `PLAN-MAESTRO.md`, sección 2. Un motor determinista, un teléfono simulado, superficies reutilizables, definiciones de escenario y variables narrativas. La personalización no altera ids, destinos ni puntajes. Las acciones son `optionId` del guion. Entornos ficticios, sin servicios reales.
- **Consecuencias.** Esto **no** aprueba D1, D2, D3, D4, D5, D6, D7, D8 ni D9. **No** autoriza implementar el teléfono, `src/content` de A o B, ni cambiar Convex. El guion A se redacta como borrador aparte (`docs/guion-simulacion-a.md`) y espera D4.

---

## 2026-10-10 — Fase 09.7.1: interruptor y cuotas persistidas de voz

- **Contexto.** `voice:synthesizeAdvice` es una action pública sin identidad. El catálogo cerrado no limita gasto. `@convex-dev/ratelimiter` no está instalado y exige `convex.config.ts` más codegen con `npx convex dev`, fuera de este alcance local.
- **Decisión.** Interruptor `VOICE_ENABLED` (solo `true` habilita; cerrado por defecto). Cuota global en tabla `voiceQuota` (singleton) con mutaciones internas transaccionales: 10 síntesis reales/hora, 30/día, 2 leases concurrentes con caducidad `TTS_TIMEOUT_MS + 5s`. Se cuenta el cache miss que entra a la factory del proveedor. El cliente no cambia límites.
- **Consecuencias.** Las ventanas fijas permiten ráfaga al resetear. No es un tope económico. El perímetro real en Convex requiere desplegar esquema y mutaciones (no hecho aquí). Un isolate puede perder un `release` si la action muere; el lease caduca. Sin identidad, la cuota es global al deployment, no por usuario. D2 sigue abierta.

---

## 2026-10-10 — Fase 09.7.3: inicialización del singleton y cuota obligatoria

- **Contexto.** La auditoría 09.7.2 señaló que un índice `by_singleton` no es una restricción UNIQUE y que `synthesizeAdviceAudio` podía crear un `MemoryVoiceQuotaStore` si faltaba `quota`.
- **Decisión.** `reserve` lee `take(2)` del intervalo `by_singleton == global`. Cero filas: inserta en la misma mutación. Una fila: reserva sobre ella. Dos o más: `RATE_LIMITED` sin incrementar. `release` no inserta. OCC de Convex trata ese intervalo de índice como clave de conflicto (docs + jamwt: invalidación por solape de rango). La action inyecta siempre el almacén Convex; sin `quota` no hay `fetch` ni almacén en memoria.
- **Consecuencias.** Los tests de ledger modelan la política, no demuestran OCC remoto. Sigue haciendo falta validar `take(2)` e inserts concurrentes en Convex de desarrollo, con voz apagada. Los tipos de `api.d.ts` se dejaron alineados a mano; el codegen oficial espera una fase autorizada.

---

## 2026-10-10 — Fases 09.7.4–09.7.8: validación en desarrollo y dictamen

- **Contexto.** Tras 09.7.3, el perímetro de voz debía comprobarse en Convex de desarrollo sin encender ElevenLabs.
- **Resultado.** En `blissful-kookabura-305` (no en producción `intent-ocelot-649`): esquema `voiceQuota` publicado; `synthesizeAdvice` pública; `reserve`/`release` internas. Con cero variables remotas, un id de catálogo devolvió `DISABLED` y un id inválido `UNKNOWN_ADVICE`, sin filas de cuota ni `fetch` al proveedor. Dos `reserve` concurrentes con capacidad libre tuvieron éxito sobre un solo singleton; los `leaseId` quedaron serializados (`…-2-0` y `…-3-1`). La liberación fue idempotente. Contadores al cierre de 09.7.7: hora/día 4/4, leases vacíos. Pruebas locales 123/123. Dictamen 09.7.8: preparado para **proponer** TTS de prueba, no para activarlo.
- **Pendiente.** Último cupo horario remoto, inicialización concurrente con tabla vacía, trazas OCC del dashboard. La action pública no tiene identidad; la cuota es global.

---

## 2026-10-10 — Procedimiento reversible de TTS de prueba (no ejecutado)

- **Contexto.** Hace falta un recetario mínimo para una fase futura autorizada. Esta entrada **no** habilita la voz ni configura claves.
- **Procedimiento (solo desarrollo `blissful-kookabura-305`).**
  1. Confirmar destino y que `VOICE_ENABLED` no es `true`.
  2. Configurar en Convex (nunca `VITE_*`) clave, voz y modelo de ElevenLabs, y `VOICE_ENABLED=true`, el tiempo mínimo.
  3. Invocar `voice:synthesizeAdvice` una vez con `codigo-verificacion:otp-request`. Opcional: una segunda id, `whatsapp-familiar:urgency`.
  4. Repetir el mismo `adviceId` y comprobar `cacheHit: true` sin nuevo gasto de cuota de síntesis real.
  5. Leer `voiceQuota`: un documento, `hourCount`/`dayCount` incrementados solo por cache miss, leases vacíos tras el `release`.
  6. Quitar de inmediato `VOICE_ENABLED`. Valorar quitar también las claves del proveedor.
  7. No tocar producción. No commitear secretos. No dejar `VOICE_ENABLED=true`.
- **Consecuencias.** El gasto lo factura el proveedor. La cuota global no autoriza por usuario. Revertir es quitar las variables del deployment de desarrollo.
