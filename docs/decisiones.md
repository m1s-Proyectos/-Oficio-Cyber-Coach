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
