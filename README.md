# OFICIO Cyber Coach

Plataforma educativa para reconocer señales de fraude digital y practicar decisiones seguras en escenarios ficticios.

Este repositorio contiene el prototipo navegable del producto, conectado a un backend Convex de desarrollo. Incluye simulaciones jugables (WhatsApp, iPhone, prevención), motor de simulación con 150 tests, sistema de voz TTS (ElevenLabs) y chat educativo. Consulta `PLAN-MAESTRO.md` para el alcance oficial de cada fase y `docs/contexto-producto.md` para la dirección educativa.

> **Aviso.** Todas las historias que llegarán al producto son ficticias. No son estadísticas de mercado ni predicciones sobre un fraude concreto. No se piden datos personales reales para completar una simulación.

---

## Estado actual

**Estado actual (oct 2026):** simulaciones jugables completas con motor de simulación, sistema de voz TTS y chat educativo. 150 tests pasan. Build operativo. Pendiente: corregir formato Prettier en 2 archivos y actualizar PLAN-MAESTRO.

| Pieza                                                                       | Estado                                                                                                           |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Repositorio Git                                                             | Rama `main`, 8 commits, sincronizado con `origin/main`                                                            |
| React 18 + Vite 5 + TypeScript estricto                                     | Configurado y operativo                                                                                          |
| ESLint 9 (flat config) y Prettier 3                                         | Configurados. Prettier falla en 2 archivos (`HomePage.tsx`, `components.css`)                                    |
| Scripts npm (`typecheck`, `lint`, `format:check`, `test`, `build`, `check`) | Operativos                                                                                                       |
| Identidad visual                                                            | Paleta navy + ámbar + teal, tipografía del sistema. Decisión D7 pendiente de confirmación formal.                |
| Enrutamiento                                                                | Router propio por hash, sin dependencias externas                                                                |
| Portada, reproductor y resumen                                              | Navegables con contenido real (simulaciones completas)                                                          |
| Convex                                                                      | `convex@1.46`. Tabla `scenarios`, query `listPublished`, siembra ficticia, funciones de voz. Solo desarrollo.   |
| Motor de simulaciones                                                       | `src/engine`. Determinista. 150 tests en 16 archivos. Sin persistencia de sesión.                                |
| Simulación A (WhatsApp)                                                     | Completa y jugable (`whatsapp-familiar`)                                                                         |
| Simulación B (iPhone)                                                       | Completa y jugable (`tienda-iphone`)                                                                             |
| Simulaciones de prevención                                                  | 3 escenarios jugables: `empleo-pago-previo`, `codigo-verificacion`, `supuesto-jefe`                              |
| Sistema de voz (TTS)                                                        | ElevenLabs integrado en cliente y servidor. Catálogo de consejos, caché de audio, cuotas.                        |
| Chat educativo                                                              | Consejos A-E con narración por voz y feedback post-simulación                                                    |
| Coach de IA                                                                 | No integrado                                                                                                     |

---

## Requisitos

- Node.js 20.19 o superior. Probado con 24.14.0.
- npm 10 o superior. Probado con 11.9.0.
- Git 2.30 o superior. Probado con 2.53.0.

Opcional, para que el agente de IA del equipo recupere la documentación antes de implementar: Linkly AI con su aplicación de escritorio, CLI y skill `linkly-ai`. No es un requisito del producto, no se importa en runtime y no se publica. Instrucciones oficiales: https://linkly.ai/docs/es/agent-setup.md.

---

## Puesta en marcha

```bash
npm install
```

### Primera vez: vincular el proyecto Convex existente

El proyecto Convex ya existe (`oficio-cyber-coach`, equipo `frank-33094`). **No crees otro.**

1. Inicia sesión en la CLI, si no lo has hecho en este equipo: `npx convex login` (abre el navegador).
2. Copia `.env.example` como `.env.local` y sustituye los valores de ejemplo por los de **tu** deployment de desarrollo de `oficio-cyber-coach` (nombre y URL visibles en el dashboard del deployment). Cada integrante tiene su propio deployment de desarrollo dentro del mismo proyecto.
   Alternativa guiada: `npx convex dev --configure existing --team frank-33094 --project oficio-cyber-coach`.
3. Sube el esquema y las funciones al deployment de desarrollo: `npm run convex:dev` (se queda vigilando cambios; `Ctrl+C` para salir).
4. Carga el catálogo ficticio: `npm run seed`. Es idempotente: ejecutarlo de nuevo no duplica documentos.

### Día a día

En dos terminales:

```bash
npm run convex:dev   # sincroniza convex/ con tu deployment de desarrollo
npm run dev          # interfaz
```

El comando `npm run dev` arranca Vite en `http://localhost:5173/`. El prototipo se abre en la portada; usa los enlaces del header o del catálogo para navegar. El enrutador es por hash: la URL se verá como `http://localhost:5173/#/simulaciones/whatsapp-familiar`.

> **Nota de seguridad en desarrollo.** El servidor Vite 5 actual tiene un aviso de vulnerabilidad en el chain de `esbuild` que solo afecta al servidor de desarrollo cuando se visita un sitio malicioso en la misma sesión del navegador. **No expongas el dev server a redes públicas** (`host: 0.0.0.0`, túneles, VPNs públicas). El `npm run build` produce artefactos sin esa superficie de ataque.

---

## Scripts disponibles

| Script                 | Qué hace                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo (Vite).                                                                            |
| `npm run build`        | Comprueba tipos y produce `dist/` listo para servir estáticamente.                                        |
| `npm run preview`      | Sirve el `dist/` generado para una revisión rápida.                                                       |
| `npm run typecheck`    | `tsc -b`. Falla ante cualquier error de tipos.                                                            |
| `npm run lint`         | ESLint sobre `src/` y los archivos de configuración.                                                      |
| `npm run lint:fix`     | ESLint con correcciones automáticas.                                                                      |
| `npm run format`       | Prettier escribe el formato.                                                                              |
| `npm run format:check` | Prettier comprueba el formato sin modificar.                                                              |
| `npm test`             | Vitest: invariantes del motor sobre el fixture.                                                           |
| `npm run check`        | typecheck + lint + format:check + test + build. Es el comando que debe pasar antes de proponer un commit. |
| `npm run convex:dev`   | `convex dev`: genera tipos y sincroniza `convex/` con el deployment de **desarrollo**.                    |
| `npm run seed`         | Ejecuta la mutación interna `seed:seedScenarios` en el deployment de desarrollo.                          |

---

## Rutas del prototipo

El router propio vive en `src/app/router.tsx` y usa `location.hash` para evitar configuración de servidor. Rutas disponibles:

| Nombre interno | URL (hash)                       | Pantalla                                       |
| -------------- | -------------------------------- | ---------------------------------------------- |
| `home`         | `#/`                             | Portada: hero, catálogo y principios.          |
| `simulation`   | `#/simulaciones/:slug`           | Reproductor placeholder del escenario `:slug`. |
| `result`       | `#/simulaciones/:slug/resultado` | Vista previa del resumen simulado.             |
| `notFound`     | cualquier otra ruta              | Pantalla de error 404.                         |

Los `:slug` admitidos son `whatsapp-familiar`, `tienda-iphone`, `empleo-pago-previo`, `codigo-verificacion` y `supuesto-jefe`. Cualquier otro `:slug` muestra un estado de error con enlace al catálogo.

---

## Identidad visual (propuesta Fase 02)

- **Paleta.** Navy profundo (`#1F2A4D`) para autoridad y confianza, ámbar cálido (`#B7801A`) como acento educativo, teal (`#286F56`) para acciones de verificación segura y rojo apagado (`#99283A`) para alertas moderadas. Fondos cálidos tipo papel (`#F6F3EC`) en modo claro y azul-pizarra (`#0D1020`) en modo oscuro.
- **Tipografía.** Pila de sistema (`Inter` si está instalada, con `-apple-system`, `Segoe UI`, `Roboto` de respaldo). Sin dependencias de web fonts.
- **Espaciado y radios.** Escala de 0.25rem documentada en `src/styles/tokens.css`.
- **Modo oscuro.** Se activa con `prefers-color-scheme: dark` y comparte los mismos tokens semánticos.
- **Accesibilidad.** Enlace de salto al contenido principal, foco visible, roles semánticos (`header`, `main`, `nav`, `footer`, `article`, `section`), `aria-current="page"` en navegación activa y respeto de `prefers-reduced-motion`.

Esta paleta y tono siguen siendo una **propuesta**. La decisión D7 del `PLAN-MAESTRO` se cierra cuando el equipo confirme (o pida alternativas) a partir del prototipo visible.

---

## Estructura del proyecto

```
PLAN-MAESTRO.md           Dirección técnica y fases oficiales.
README.md                 Este archivo.
docs/
  contexto-producto.md    Fuente de producto (historias y límites educativos).
  decisiones.md           Registro corto de decisiones aprobadas.
package.json              Dependencias y scripts.
tsconfig*.json            Project references con TypeScript estricto.
vite.config.ts            Configuración mínima de Vite.
eslint.config.js          Flat config de ESLint 9.
.prettierrc.json          Reglas de Prettier.
.editorconfig             Normalización de editor.
.gitignore                Ignora dependencias, builds, entorno y artefactos de Convex.
.gitattributes            Finales de línea normalizados a LF.
index.html                Entrada HTML servida por Vite.
public/                   Activos estáticos.
src/
  main.tsx                Punto de entrada de React.
  vite-env.d.ts           Tipos del cliente Vite.
  app/
    App.tsx               Raíz: cliente Convex + enrutador + layout.
    ConvexClientProvider.tsx  Crea el cliente a partir de VITE_CONVEX_URL.
    backendStatus.ts      Hook useBackendConfigured.
    Layout.tsx            Cabecera + main + pie, con skip-link.
    PageHeader.tsx        Cabecera con marca y navegación.
    SiteFooter.tsx        Pie con aviso de ficción y recorrido.
    router.tsx            Router propio por hash.
    index.ts              Barrel de exportaciones.
  components/             Componentes reutilizables (Button, Card, Alert, etc.).
  features/
    home/                 Portada; PublishedCatalog.tsx lee el catálogo de Convex.
    simulation/           Reproductor placeholder (motor real en Fases 04-06).
    results/              Vista previa del resumen (cálculo real en Fase 07).
    not-found/            Pantalla 404.
  content/                Guiones tipados, catálogo local, cast de personajes.
  engine/                 Motor puro: tipos, transiciones, evaluación, choice gate y fixtures.
  voice/                  TTS ElevenLabs: síntesis, caché, catálogo de consejos, cuotas.
  styles/
    tokens.css            Design tokens (colores, tipografía, espaciado).
    global.css            Reset + base.
    components.css        Estilos de componentes compartidos.
  test/                   16 archivos, 150 tests (Vitest).
convex/                   Esquema, query del catálogo y siembra (ver convex/README.md).
  _generated/             Tipos generados por la CLI. Se versionan.
.env.example              Variables necesarias, con valores ficticios.
```

---

## Convenciones y calidad

- TypeScript estricto. `any` prohibido por ESLint. Imports de tipos marcados con `type`.
- Componentes sin lógica de negocio. El puntaje y las transiciones viven en el motor y en Convex, nunca en React (ver `PLAN-MAESTRO.md`, secciones 6 y 10).
- Datos ficticios etiquetados como temporales mientras no los sirva Convex. Los archivos de vista previa (`scenarioPreview.ts`, `mockSummary.ts`) llevan un comentario inicial que lo advierte. `scenarioCatalog.ts` ya no se importa desde la Fase 03.
- Funciones públicas de Convex con validadores `args` y `returns`. La siembra es una `internalMutation`, no accesible desde el cliente.
- No introducir autenticación, pagos, analítica externa, IA ni otra base de datos sin autorización explícita y actualización del plan maestro.

Antes de proponer un commit, ejecutar:

```bash
npm run check
```

Un commit nunca se crea automáticamente. Siempre se espera autorización explícita.

---

## Variables de entorno

Viven en `.env.local` (no versionado). `.env.example` muestra la forma con valores ficticios.

| Variable               | Quién la usa         | Qué es                                                                    |
| ---------------------- | -------------------- | ------------------------------------------------------------------------- |
| `CONVEX_DEPLOYMENT`    | CLI de Convex        | Deployment de desarrollo al que se sincroniza `convex/` (`dev:<nombre>`). |
| `VITE_CONVEX_URL`      | Cliente React (Vite) | URL pública del deployment (`https://<nombre>.convex.cloud`).             |
| `VITE_CONVEX_SITE_URL` | Nadie todavía        | URL de HTTP actions. La escribe la CLI.                                   |

Estas tres variables no son secretos, pero no se publican archivos `.env*` reales. La credencial de la CLI la guarda `npx convex login` fuera del repositorio. Si falta `VITE_CONVEX_URL` o no es válida, la portada muestra «El catálogo no está disponible» en lugar de fallar.

La voz se ejecuta en Convex, no en Vite ni en Vercel. Configura en cada deployment de Convex:

- `VOICE_ENABLED=true`
- `ELEVENLABS_API_KEY` (secreto)
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_MODEL_ID`

No uses el prefijo `VITE_` para esas variables. La clave privada nunca debe estar en Vercel ni en el bundle del navegador. En desarrollo se pueden administrar con `npx convex env set`; para producción, usa el panel del deployment de producción de Convex cuando se autorice ese despliegue.

---

## Despliegue y producción

`vercel.json` compila con Vite, sirve `dist/` y aplica cabeceras compatibles con Convex y reproducción desde URLs `blob:`. El router usa hash, por lo que una recarga mantiene el documento raíz sin depender de rewrites.

Preparación de un despliegue posterior:

1. Desplegar primero el backend a un deployment **de producción de Convex** mediante el flujo autorizado del proyecto.
2. Configurar allí las cuatro variables privadas de voz indicadas arriba.
3. Configurar en Vercel únicamente `VITE_CONVEX_URL` con la URL pública de ese deployment de producción.
4. Ejecutar `npm run build` y publicar `dist/` mediante la integración de Vercel.

No asumas que Vercel comparte variables con Convex: son servicios y paneles distintos. No ejecutes `npx convex deploy` durante desarrollo; `npx convex dev` usa el deployment de desarrollo.

---

## Documentación de referencia

- `PLAN-MAESTRO.md`: alcance técnico, fases 00 a 10, criterios de aceptación, riesgos y decisiones pendientes.
- `docs/contexto-producto.md`: historias ficticias, límites educativos y el propósito de cada simulación.
- `docs/decisiones.md`: registro corto de decisiones ya aprobadas.
