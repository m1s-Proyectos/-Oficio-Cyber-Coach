# OFICIO Cyber Coach — Plan maestro

Documento de dirección técnica. Cursor y los dos integrantes deben tratarlo como la fuente de alcance, fases y decisiones del proyecto.

**Estado:** Fase 00 cerrada en borrador, pendiente de tu revisión.  
**No comenzar la Fase 01** hasta que lo indiques de forma explícita. Aprobar este documento no autoriza las fases siguientes.

---

## 0. Cómo usar este documento

1. Identifica la fase actual en la sección [Estado del proyecto](#1-estado-del-proyecto).
2. Lee solo el alcance de esa fase.
3. Implementa únicamente lo aprobado.
4. Prueba, corrige y resume.
5. Espera aprobación explícita antes de la fase siguiente.

Una aprobación de fase no autoriza las posteriores. Si una fase crece demasiado, se divide en subfases y se valida una antes de seguir.

Al iniciar cada fase, la respuesta debe incluir:

1. Número y nombre de la fase.
2. Objetivo.
3. Qué se va a modificar.
4. Qué no se va a modificar.
5. Cómo se verificará el resultado.

Al terminar:

1. Qué se implementó realmente.
2. Archivos creados y modificados.
3. Pruebas ejecutadas y sus resultados.
4. Problemas pendientes.
5. Criterios de aceptación cumplidos y no cumplidos.
6. Riesgos o decisiones que requieren atención.
7. Próximo paso propuesto, sin ejecutarlo.

No declares una prueba exitosa si no se ejecutó y se comprobó su resultado.

---

## 1. Estado del proyecto

Auditoría de solo lectura del directorio de trabajo, 10 de octubre de 2026.

| Hecho | Resultado |
| --- | --- |
| Carpeta del proyecto | Vacía antes de este archivo. No había código, configuración, requisitos adicionales ni documentación previa. |
| Git | No hay repositorio. `git` 2.53.0 está instalado en el sistema. |
| Node.js | v24.14.0. Hay `npx`. El gestor previsto es npm. |
| Requisitos funcionales | Los de este plan, tomados de la dirección técnica que entregaste. No hay otra propuesta en la carpeta. |
| Código | Ninguno. Este archivo es documentación, no la aplicación. |

**Fase actual:** 00 — Descubrimiento y planificación.  
**Siguiente fase, solo cuando lo pidas:** 01 — Fundación.

### Lo que este archivo no hace

- No instala dependencias.
- No crea React, Vite ni Convex.
- No despliega nada.
- No hace commits ni pushes.

---

## 2. Propósito del producto

OFICIO Cyber Coach es una plataforma educativa para reconocer señales de fraude digital y practicar decisiones seguras en escenarios ficticios interactivos.

Debe enseñar a:

- Identificar señales de riesgo.
- Evitar actuar bajo presión.
- Verificar información por canales independientes.
- Comprender las consecuencias potenciales de una decisión.
- Saber qué medidas tomar si ya se compartieron datos o se envió dinero.

No se limita a historias estáticas ni a un cuestionario de opción múltiple. Cada simulación presenta escenario, decisiones, consecuencias, explicaciones y una oportunidad de aprendizaje.

### Experiencia inmersiva y personalizable (dirección de producto)

**Todas las simulaciones presentes y futuras deben poder ser inmersivas y personalizables.** La persona participa en una historia dentro de un entorno digital ficticio —por ejemplo mensajería, buscador, perfil social o tienda simulada—, toma decisiones y observa consecuencias. No es un rasgo exclusivo de la Simulación A.

La arquitectura prevista reutiliza un motor determinista, un teléfono simulado compartido, superficies visuales reutilizables, definiciones de escenario y una capa de personalización narrativa. No se construye una aplicación independiente por historia.

Reglas de esta dirección:

- La personalización puede cambiar nombres y textos visibles. No puede cambiar identificadores de nodos, destinos, transiciones, reglas ni puntuaciones.
- Cada clic (resultado de búsqueda, perfil, botón) es una opción prevista del guion (`optionId`). No hay navegación arbitraria a sitios externos.
- No se usan cuentas reales, mensajes reales, compras, pagos, contraseñas ni fotografías personales.
- Los entornos se marcan como ficticios.
- Las simulaciones A y B comparten arquitectura; cada una entra en código solo con su guion aprobado (D4 y D5).

Esta sección registra la dirección. **No autoriza implementar** el teléfono, el elenco, la Fase 05 ni la Fase 06. Las decisiones D1–D9 de la sección 19 siguen pendientes salvo las que ya hayas aprobado por escrito.

### Límites educativos obligatorios

- Las consecuencias son ficción del escenario. No se presentan como predicción de todos los fraudes ni como estadísticas de mercado.
- Un mensaje urgente no demuestra fraude. La lección es verificar antes de enviar dinero.
- Un precio bajo no demuestra fraude.
- Comentarios positivos no demuestran que una tienda sea legítima.
- Cuentas recientes son una señal para investigar, no una prueba definitiva.
- Un pago adicional inesperado se verifica por vías independientes.
- No se promete recuperar el dinero perdido.
- No se culpa a la víctima.

Los importes, plazos y sucesos ($200, $150, $610, $1,200, $100, siete días, quince comentarios) son elementos ficticios del escenario.

---

## 3. Stack aprobado

### Incluido

| Capa | Elección |
| --- | --- |
| Interfaz | React, Vite, TypeScript |
| Presentación | Responsive, accesible por teclado y lector de pantalla, componentes reutilizables |
| Backend y datos | Convex: queries, mutations y actions solo cuando hagan falta |
| Calidad | ESLint, formato compatible, pruebas unitarias del motor y pruebas de funciones críticas |
| Control de versiones | Git |
| Paquetes | npm |
| Documentación | Markdown en el repositorio |

### Excluido del MVP salvo aprobación nueva

FastAPI u otro backend, otro framework de interfaz, autenticación de usuarios, pagos, analítica externa, una segunda base de datos, y cualquier servicio no exigido por el MVP.

La IA educativa queda reservada a la Fase 08. Las fases 01–07 usan reglas deterministas.

---

## 4. Linkly AI como práctica de calidad

Linkly AI no es una dependencia del producto. No se importa en React ni en Convex, y la aplicación desplegada no lo necesita para funcionar.

Sirve para que el agente y los integrantes recuperen este plan, las decisiones ya tomadas y la documentación del repositorio antes de escribir código. La skill de Linkly enseña el orden correcto: buscar, revisar el esquema del resultado y leer solo los fragmentos que importan.

### Regla de trabajo con la skill

En cada fase, antes de implementar:

1. Leer la sección de esa fase en `PLAN-MAESTRO.md`.
2. Si Linkly está instalado, indexada esta carpeta y la skill cargada, invocar la recuperación con `use linkly-ai` para contrastar requisitos y decisiones previas.
3. Si Linkly no está disponible, leer el archivo directamente. La ausencia de Linkly no bloquea el producto; sí debe quedar dicha en el resumen de la fase.
4. No usar la recuperación como sustituto de pruebas, tipos ni validación del servidor.
5. No indexar `.env`, claves, secretos ni datos personales reales.

### Estado real de la instalación (no verificado como completo)

Sondeo en esta máquina:

| Comprobación | Resultado |
| --- | --- |
| Archivo `~/.linkly/port` | No existe |
| `GET /health` | Inalcanzable |
| CLI `linkly` | No instalada |
| Skills `linkly-ai` | No instaladas |

Interpretación de la guía oficial: la aplicación de escritorio no está instalada o nunca se inició. El siguiente paso de Linkly es manual (Paso 1 de la guía). Hasta que `/health` responda 200 y `doc_count` sea mayor que 0, no se instala la CLI ni la skill, y no se declara la cadena como funcionando.

Cuando la aplicación esté en marcha, conviene añadir esta carpeta del proyecto en Ajustes → Carpetas para que el plan y la documentación posterior queden indexados. Los documentos de ejemplo de Linkly bastan para probar la herramienta; no sustituyen este plan.

### Lo que Linkly no decide

- No puntúa simulaciones.
- No autoriza saltarse una fase.
- No sustituye los criterios de aceptación de este documento.

---

## 5. Requisitos

### 5.1 Funcionales del MVP

1. La persona puede ver una portada que explica el propósito educativo y que los escenarios son ficticios.
2. Puede elegir la Simulación A o la Simulación B.
3. Puede recorrer un escenario por decisiones. Cada paso muestra la situación, las opciones válidas en ese punto y, tras elegir, la consecuencia y la explicación.
4. El motor reutilizable cubre las dos historias. No hay una página con lógica duplicada por historia.
5. El servidor valida la opción. La interfaz no elige el puntaje ni puede forzar una transición que el servidor no acepte.
6. Al terminar, hay un resumen con resultado, explicaciones y recomendaciones.
7. Si la persona ya avanzó por una rama de riesgo, puede reconocer la señal y cambiar de conducta en un paso posterior cuando el guion lo permita.
8. Las explicaciones esenciales existen aunque la IA no esté integrada.

#### Simulación A — familiar que pide dinero por WhatsApp

Historia ficticia: un mensaje parece venir de un familiar. La cuenta está comprometida. Pide $200 con urgencia por una situación médica en un hospital.

El diseño de contenido debe cubrir, como mínimo, decisiones de este tipo:

- Enviar los $200 de inmediato.
- Seguir solo por el chat y confiar en las respuestas.
- Verificar con el número habitual del familiar u otro contacto de confianza.
- Interrumpir el contacto y evaluar antes de actuar.

Si en la ficción se envía el dinero, puede aparecer una petición adicional de $150. La rama segura enseña la verificación independiente y revela, dentro de la historia, que la cuenta estaba comprometida.

Las opciones exactas, el orden de los nodos y los puntos de cada decisión **no están cerrados**. Se diseñan y se aprueban antes de codificar la Simulación A. No se inventan como si ya fueran el guion definitivo.

#### Simulación B — tienda sospechosa del iPhone 14

Historia ficticia: María ahorró para un iPhone 14. Una tienda en línea lo ofrece a $610; comercios físicos de la historia lo ofrecen alrededor de $1,200. Hay más de quince comentarios positivos y una promesa de entrega en siete días. María deposita el total. En la fecha prevista, la tienda alega un problema de aduanas y pide $100 más. Más adelante se observa que varias cuentas de comentarios positivos parecen recientes. La tienda queda abandonada y desaparece su logotipo.

El diseño de contenido debe permitir decidir, como mínimo:

- Si confiar en los comentarios y comprar.
- Si investigar identidad, reseñas y condiciones.
- Si verificar la protección del medio de pago y las condiciones de entrega antes de decidir.
- Si pagar los $100 adicionales o detenerse y verificar esa petición.

Misma regla: el guion nodo a nodo y la puntuación se aprueban en el diseño de contenido, antes de implementar la Fase 06.

### 5.2 No funcionales

- TypeScript estricto. Evitar `any`.
- Validación de argumentos y tipos de retorno en las funciones públicas de Convex.
- Autorización explícita en todo dato que no sea público. En el MVP no hay cuentas; el acceso a una sesión privada se hace con un identificador no adivinable, comprobado en el servidor.
- Datos ficticios por defecto. Minimización: no pedir nombre real, teléfono, correo, documentos ni datos bancarios.
- Secretos fuera del repositorio. Separación entre desarrollo (`npx convex dev`) y producción (`npx convex deploy` solo con autorización).
- Errores claros para la persona usuaria, sin filtrar detalles internos.
- Evitar duplicar un resultado final si la misma sesión se confirma dos veces.
- Accesible por teclado y lector de pantalla. Adaptable a móvil.
- Estados de carga, vacío, éxito y error.
- Puntuación reproducible: la misma secuencia de decisiones produce el mismo resultado.
- Motor determinista en las fases 04–07. La IA de la Fase 08 no puede ser la fuente del puntaje oficial.

---

## 6. Arquitectura propuesta

Recomendación para aprobar en esta revisión. Si la cambias, se actualiza este archivo antes de la Fase 01.

### 6.1 Principio

Tres capas, con una sola dirección de dependencia:

```text
Contenido (guion versionado)
        ↓
Motor puro (TypeScript, sin React ni Convex)
        ↓
Convex (validación, sesión, persistencia)
        ↓
React (presentación; no calcula el puntaje oficial)
```

El motor es una biblioteca pura. Las pruebas unitarias lo ejercitan sin navegador y sin red. Convex comprueba que la opción pertenece al nodo actual, aplica el motor y guarda la decisión. React muestra lo que el servidor devuelve.

### 6.2 Por qué no una página por historia

Las dos simulaciones comparten el mismo ciclo: iniciar, leer el paso, validar una opción, transicionar, registrar, evaluar y cerrar. Duplicar ese ciclo en dos pantallas haría divergir puntuaciones y reglas. Cada historia es un `Scenario` distinto consumido por el mismo motor y la misma pantalla de simulación.

### 6.3 Contenido como código, publicación en Convex

**Recomendación:** el guion vive en TypeScript versionado en Git, con un tipo `ScenarioDefinition` validado. Convex recibe una copia mediante una mutación interna de siembra. Así el guion se revisa en pull requests y las pruebas leen el mismo objeto que producción.

**Alternativa descartada para el MVP:** editar el guion solo en el dashboard de Convex. Es más difícil de revisar y de probar.

**Alternativa descartada:** nueve tablas para nodos, opciones, transiciones y señales desde el día uno. Con dos escenarios pequeños y acotados, el grafo se carga siempre junto. Partirlo ahora añade joins sin un beneficio claro. Si más adelante hay escenarios grandes o señales compartidas entre historias, se extraen tablas.

### 6.4 Sesiones sin cuentas

El MVP no incluye autenticación. Hace falta igual impedir que el cliente invente transiciones.

**Recomendación:**

- Al iniciar, el servidor crea `SimulationSession` y devuelve un identificador de Convex, que no es predecible.
- El navegador lo guarda en `localStorage` solo para reanudar esa sesión en el mismo aparato.
- Cada mutación recibe ese id. El servidor carga la sesión, comprueba que sigue activa y que la opción existe en el nodo actual.
- El cliente no envía el id del siguiente nodo ni el puntaje.
- No hay perfil, correo ni nombre real.

**Alternativa:** guardar todo el progreso solo en el navegador. Se rechaza porque la interfaz podría alterar el puntaje y no habría una comprobación de servidor, que es un requisito.

**Alternativa:** cuentas de usuario. Se rechaza en el MVP porque no está justificada por los requisitos. Puede evaluarse después del demo si hace falta progreso entre dispositivos.

### 6.5 IA (solo Fase 08)

Un servicio posterior puede explicar señales, responder preguntas educativas del escenario y sugerir verificaciones, con tono empático.

No puede:

- Fijar el puntaje oficial.
- Garantizar que una tienda o una persona es legítima.
- Inventar hechos de la historia.
- Prometer recuperar dinero.
- Dar asesoría financiera personalizada.
- Pedir contraseñas, PIN, OTP o credenciales bancarias.
- Exponer datos privados.
- Anular las reglas del motor.

Las claves del proveedor quedan en el servidor (variables de Convex, nunca en el cliente ni en Git). Si la IA falla, se muestran las explicaciones ya escritas en el guion.

---

## 7. Estructura de carpetas propuesta

Se crea en la Fase 01 solo el esqueleto y las herramientas. Las carpetas de motor, contenido y Convex se reservan y se rellenan en su fase.

```text
PLAN-MAESTRO.md
README.md
package.json
tsconfig.json
vite.config.ts
eslint.config.js
index.html
.gitignore
public/
src/
  main.tsx
  app/                 layout, rutas, proveedores
  components/          UI reutilizable
  features/
    home/
    simulation/        pantalla única del reproductor
    results/
  content/             guiones tipados (fases 05 y 06)
  engine/              motor puro (fase 04)
  styles/
  test/
convex/
  schema.ts
  scenarios.ts
  sessions.ts
  lib/
docs/
  decisiones.md        registro corto de decisiones de arquitectura
  guion-simulacion-a.md
  guion-simulacion-b.md
```

`docs/decisiones.md` empieza vacío en la Fase 01 y solo recibe decisiones ya aprobadas.

---

## 8. Modelo conceptual de datos

Los nombres siguientes son el modelo recomendado. No hace falta persistir cada uno como tabla.

### 8.1 Dentro del escenario (contenido, un documento lógico por historia)

| Concepto | Rol |
| --- | --- |
| `Scenario` | Id estable, título, resumen, aviso de ficción, versión del guion, id del nodo inicial. |
| `ScenarioNode` | Paso actual: texto de la situación, si es terminal, señales visibles en ese paso. |
| `ScenarioOption` | Decisión ofrecida en un nodo. Id estable. No lleva el puntaje calculado para que el cliente lo aplique por su cuenta. |
| `ScenarioTransition` | Opción + nodo destino. En el MVP la transición es determinista: una opción conduce a un solo nodo. |
| `RiskSignal` | Señal enseñable (urgencia, canal único, precio anómalo, reseñas no verificadas, pago extra). Catálogo pequeño reutilizado por los nodos. |
| `EvaluationRule` | Efecto verificable de una opción: etiquetas de rúbrica y peso. Vive en el servidor junto al guion, no en el componente visual. |
| `Feedback` | Explicación educativa de esa decisión, más la recomendación asociada. |

### 8.2 En Convex (runtime)

| Tabla | Campos esenciales | Índices |
| --- | --- | --- |
| `scenarios` | `slug`, `version`, `definition` validada, `published` | `by_slug` |
| `sessions` | `scenarioSlug`, `scenarioVersion`, `status` (`active` \| `completed`), `currentNodeId`, `startedAt` | `by_status` solo si hace falta operación interna |
| `decisions` | `sessionId`, `nodeId`, `optionId`, `createdAt`, índice de paso | `by_session` |
| `results` | `sessionId`, desglose de rúbrica, recomendaciones, `createdAt` | `by_session` |

`sessionId` en decisiones y resultados es el id de Convex de la sesión. Una sesión completada tiene como máximo un resultado. La mutación de cierre debe ser idempotente.

No se guardan mensajes de chat libres, nombres reales ni importes introducidos por la persona. Los importes del guion son constantes del escenario.

### 8.3 Lo que el cliente puede enviar

- `scenarioSlug` conocido (`whatsapp-familiar`, `tienda-iphone`), al iniciar.
- `sessionId` que el servidor emitió, al continuar.
- `optionId` que pertenece al nodo actual.

Cualquier otro campo de control (nodo destino, puntos, `completed: true`) se ignora porque no forma parte de los argumentos validados.

---

## 9. Motor reutilizable

Módulo puro en `src/engine`. Sin `Date.now()` para puntuar. Sin acceso a la red. Sin JSX.

### Operaciones

| Operación | Entrada | Salida | Regla |
| --- | --- | --- | --- |
| `start` | definición del escenario | nodo inicial, sesión lógica nueva | Falla si el nodo inicial no existe. |
| `getCurrent` | estado + definición | nodo y opciones válidas | No incluye nodos futuros. |
| `choose` | estado + `optionId` | nuevo estado, feedback, si terminó | Rechaza opciones ajenas al nodo, sesiones cerradas e ids desconocidos. |
| `evaluate` | historial de opciones + reglas | desglose y total | Función pura. Mismas decisiones, mismo resultado. |
| `complete` | estado evaluable | `SimulationResult` | Solo si el nodo es terminal. |
| `recommend` | resultado + señales | textos ya escritos en el guion | No genera texto libre en las fases 04–07. |

### Invariantes que las pruebas deben fijar

- No se puede saltar de nodo.
- No se puede elegir dos veces en el mismo paso de la misma sesión.
- Una sesión `completed` rechaza decisiones nuevas.
- Repetir el cierre no crea un segundo resultado.
- Una opción desconocida no cambia el estado.
- El cliente no puede inyectar un nodo destino.
- Cada historia publicada cubre al menos una rama de riesgo y una rama de verificación, y ambas terminan.

### Sesión lógica

```text
scenarioSlug
scenarioVersion
status
currentNodeId
choices: { nodeId, optionId }[]
```

Convex persiste ese estado. El motor no conoce Convex.

---

## 10. Puntuación y evaluación

Marco propuesto. **Los números y el guion fino quedan pendientes de aprobación** en el diseño de contenido (antes de las fases 05 y 06). El motor no debe publicar un puntaje inventado.

### 10.1 Rúbrica común (0–100)

Cuatro dimensiones, 25 puntos cada una, para que las dos historias sean comparables:

| Dimensión | Qué observa |
| --- | --- |
| Reconocimiento | La decisión trata la señal como algo a comprobar. |
| Verificación | Hay un canal independiente del mensaje o de la tienda. |
| Contención | No se envía dinero ni un pago extra solo por la presión del escenario. |
| Recuperación | Ante un paso ya arriesgado, la persona se detiene, verifica o busca ayuda. No se exige perfección desde el primer clic. |

Cada opción declara, en datos:

- puntos por dimensión (enteros, dentro del margen de esa dimensión);
- señales que la decisión reconoce o pasa por alto;
- si la transición sigue abierta a corregir el rumbo.

El total es la suma. No hay puntaje negativo. No hay bonificación oculta en la interfaz.

### 10.2 Lectura del resultado

Umbrales propuestos, también pendientes de tu confirmación:

| Total | Lectura |
| --- | --- |
| 0–39 | Conviene volver a practicar la verificación antes de actuar. |
| 40–69 | Hay señales reconocidas y también pasos todavía expuestos. |
| 70–100 | La secuencia priorizó verificar y contener el daño. |

El texto del resultado describe la secuencia concreta. No dice que la persona "habría sido estafada" en la vida real. Dice qué ocurrió en la ficción y qué práctica conviene repetir.

### 10.3 Recomendaciones

Salen de piezas escritas de antemano, asociadas a señales no atendidas. Ejemplos de tipo de consejo, no de guion cerrado:

- Verificar por el número o contacto que ya se tenía, no por el chat que pide el dinero.
- Desconfiar de la urgencia como motivo para saltarse la comprobación.
- Contrastar identidad de la tienda, historial de las reseñas y protección del pago.
- Ante un cobro extra no anunciado, pausar y confirmar por un canal distinto.
- Si el dinero ya se envió en la historia: dejar de pagar, conservar capturas de la ficción como hábito, y orientar a contactar al medio de pago y a una persona de confianza. Sin prometer reembolso.

### 10.4 Lo que no entra en el puntaje

- Tiempo de lectura.
- Número de clics.
- Opinión de un modelo de IA.
- Datos personales. No se piden.

---

## 11. Diseño visual (se implementa en la Fase 02)

En la Fase 00 no hay pantallas. Criterios para cuando se diseñe:

- Identidad sobria, de producto educativo. Legible, con contraste suficiente, sin estética genérica de "dashboard de IA".
- Aviso visible de que el caso es ficticio.
- Una columna de lectura en el paso de simulación. Opciones como acciones claras, no como un examen.
- El feedback aparece después de decidir, en la misma simulación, antes de continuar.
- Portada, reproductor y resumen comparten layout y navegación.
- Hasta la Fase 03, la portada puede usar datos temporales, etiquetados como temporales en el código, y no debe simular que ya está conectada a Convex.

La paleta, la tipografía y el nombre visual definitivo pueden confirmarse al abrir la Fase 02. No bloquean este plan.

---

## 12. Seguridad y privacidad

| Tema | Decisión |
| --- | --- |
| Datos de prueba y de guion | Solo ficticios. |
| Datos que pide el producto | Ningún dato personal para completar una simulación. |
| Validación | `args` y `returns` en funciones públicas de Convex. |
| Autorización | Quien posee el `sessionId` puede leer y continuar esa sesión. No hay listados públicos de sesiones ajenas. |
| Integridad del juego | El servidor recalcula nodo y puntaje. |
| Idempotencia | Un solo resultado por sesión. |
| Secretos | Fuera de Git. `.env.local` en `.gitignore`. |
| Entornos | `npx convex dev` en desarrollo. `npx convex deploy` solo con autorización explícita para producción. |
| Errores | Mensaje útil, sin volcar el documento interno ni trazas al cliente. |
| IA futura | Sin credenciales de la persona usuaria. Sin puntaje delegado al modelo. Degradación al texto fijo. |
| Linkly | Indexa documentación del proyecto. No indexa secretos. No forma parte del runtime. |

Convex no vuelve segura una función por estar en Convex. Cada función pública que lea una sesión debe comprobar el id y el estado.

---

## 13. Plan de pruebas

| Fase | Prueba | Hecho cuando |
| --- | --- | --- |
| 01 | `npm run typecheck`, `npm run lint`, `npm run build` | Los tres terminan sin error. |
| 02 | Recorrido manual de portada y estados vacío, carga y error con datos temporales | Navegación por teclado y viewport estrecho comprobados. |
| 03 | Consulta de escenarios de siembra desde la app en dev | El cliente muestra datos que salen de Convex, no del arreglo temporal. |
| 04 | Vitest del motor: ramas, rechazos, puntaje reproducible, cierre idempotente | La suite cubre los invariantes de la sección 9. |
| 05 | Recorrido de todas las ramas previstas de la Simulación A | Cada final tiene feedback y la rama segura muestra la cuenta comprometida dentro de la ficción. |
| 06 | Igual para la Simulación B, incluida la petición de $100 | Se puede comprar, investigar, pagar el extra o detenerse. |
| 07 | Misma secuencia, mismo resumen | El número no se calcula en React. |
| 08 | IA caída o sin clave | El resumen determinista sigue visible. El modelo no cambia el puntaje. |
| 09 | Regresión de ramas, accesibilidad básica, entradas inválidas | Lista de fallos en cero o aceptada por ti. |
| 10 | App desplegada y guion de demo | Un jurado puede completar las dos simulaciones sin cuentas. |

Herramienta prevista para el motor: Vitest. Pruebas de funciones Convex con el ejecutor que encaje al configurar el proyecto en la Fase 03 o 04, sin añadir un framework de más si Vitest y el cliente de pruebas de Convex bastan.

No se usan nombres, teléfonos ni correos reales en fixtures.

---

## 14. Fases

Orden fijo. Una fase por ejecución.

### Fase 00 — Descubrimiento y planificación

- **Objetivo:** auditar el entorno y dejar este plan para revisión.
- **Incluye:** requisitos, arquitectura, carpetas, modelo, motor, puntuación, pruebas, seguridad, riesgos, criterios y reparto.
- **Excluye:** código de aplicación, dependencias, Git (salvo que lo pidas), Convex, Linkly más allá del sondeo.
- **Archivos:** `PLAN-MAESTRO.md`.
- **Pruebas:** inspección del directorio y sondeo de Linkly. No hay suite todavía.
- **Aceptación:** el plan está en la carpeta, distingue hechos de propuestas, lista decisiones abiertas y no empieza la Fase 01.
- **Reparto:** revisión conjunta.

### Fase 01 — Fundación

- **Objetivo:** proyecto React + Vite + TypeScript compilable, con lint, formato, scripts y README.
- **Incluye:** esqueleto de carpetas, `strict`, `.gitignore`, script de verificación, nota de cómo ejecutar en local.
- **Excluye:** simulaciones, Convex, diseño final, IA, autenticación.
- **Pruebas:** typecheck, lint, build.
- **Aceptación:** los tres comandos pasan y el README dice cómo arrancar y cómo no desplegar a producción.
- **Reparto:** Integrante B inicializa el repo y las herramientas. Integrante A revisa que la estructura de `src/` deje sitio claro a las pantallas. Uno solo toca `package.json` y la configuración.

### Fase 02 — Diseño visual

- **Objetivo:** identidad, layout, navegación, portada y componentes base con datos temporales etiquetados.
- **Excluye:** motor real, Convex, guiones definitivos, puntaje oficial.
- **Pruebas:** recorrido manual de portada, navegación, estados y teclado. Viewport de escritorio y de móvil.
- **Aceptación:** se puede recorrer la cáscara sin consola rota y sin aparentar que el backend ya responde.
- **Reparto:** Integrante A. Integrante B no edita componentes visuales en paralelo.

### Fase 03 — Convex

- **Objetivo:** esquema, validadores, siembra ficticia mínima y lectura desde React en un deployment de desarrollo.
- **Excluye:** motor completo, ambas historias terminadas, deploy de producción, auth.
- **Pruebas:** la portada o una vista de catálogo muestra los dos slugs servidos por Convex. Funciones públicas con `args` y `returns`.
- **Aceptación:** `npx convex dev` refleja el esquema y el cliente distingue carga, éxito y error.
- **Reparto:** Integrante B. Integrante A solo conecta la lectura en los componentes ya creados, en archivos acordados.

### Fase 04 — Motor de simulaciones

- **Objetivo:** motor puro, transiciones, reglas y pruebas. Un escenario mínimo de fixture, no las historias finales.
- **Excluye:** copiar el guion completo de A y B, IA, pulido visual.
- **Pruebas:** Vitest de los invariantes.
- **Aceptación:** una opción ilegal no avanza; una secuencia fija produce el mismo desglose.
- **Reparto:** Integrante B. Integrante A revisa el tipo que la pantalla necesitará consumir.

### Fase 05 — Simulación A

- **Objetivo:** guion aprobado de WhatsApp, todas las ramas previstas, feedback y recomendaciones de esa historia.
- **Excluye:** Simulación B, IA, deploy.
- **Pruebas:** cada rama termina y la verificación independiente revela la cuenta comprometida dentro de la ficción.
- **Aceptación:** no queda una opción que no tenga nodo destino ni feedback.
- **Reparto:** los dos cierran el guion en `docs/guion-simulacion-a.md` antes de codificar. B carga datos y reglas. A integra la pantalla única.

### Fase 06 — Simulación B

- **Objetivo:** guion de la tienda, compra, investigación, pago extra y detención.
- **Excluye:** cambiar el motor salvo un defecto demostrado, IA, deploy.
- **Pruebas:** mismas que A, más la bifurcación de los $100.
- **Aceptación:** ninguna rama enseña que el precio bajo o las reseñas positivas bastan como prueba.
- **Reparto:** igual que la Fase 05, con `docs/guion-simulacion-b.md`.

### Fase 07 — Resultados

- **Objetivo:** resumen final, desglose, explicaciones y recomendaciones desde el servidor.
- **Excluye:** IA, cuentas de usuario, rankings públicos.
- **Pruebas:** repetir la misma sesión de decisiones produce el mismo resumen; el cierre doble no duplica el resultado.
- **Aceptación:** React no suma puntos por su cuenta.
- **Reparto:** B en la mutación de cierre. A en la pantalla de resumen.

### Fase 08 — Coach de IA

- **Objetivo:** evaluar e integrar explicación educativa con límites, secreto en servidor y caída al texto fijo.
- **Excluye:** puntaje delegado al modelo, asesoría financiera, petición de credenciales.
- **Pruebas:** sin clave o con fallo de red, el resumen de la Fase 07 sigue completo. El puntaje no cambia.
- **Aceptación:** los límites de la sección 6.5 se cumplen en la implementación, no solo en el texto.
- **Reparto:** B en la action y el secreto. A en el panel de pregunta, con estado de error.

### Fase 09 — QA y endurecimiento

- **Objetivo:** pruebas, accesibilidad, seguridad, consistencia y experiencia.
- **Excluye:** funciones nuevas no necesarias para el demo.
- **Pruebas:** regresión de ramas, entradas inválidas, teclado, móvil.
- **Aceptación:** lista de defectos acordada, sin fallos abiertos que impidan completar las dos historias.
- **Reparto:** A en interfaz. B en servidor. Revisión cruzada del contrato.

### Fase 10 — Despliegue y demo

- **Objetivo:** producción autorizada, entornos separados y guion de demostración para el jurado.
- **Excluye:** nuevas mecánicas.
- **Pruebas:** recorrer las dos simulaciones en la URL desplegada.
- **Aceptación:** documento corto de demo: qué mostrar, qué decir sobre la ficción, qué no prometer.
- **Reparto:** B en Convex producción. A en el guion de demo y el recorrido visual. Tú autorizas el deploy.

---

## 15. Reparto entre dos integrantes

| Integrante A | Integrante B |
| --- | --- |
| Diseño visual y experiencia | Modelo Convex y funciones |
| Componentes React | Motor, transiciones y reglas |
| Navegación y accesibilidad | Pruebas de motor y de servidor |
| Integración de pantallas | Siembra de escenarios y, en la Fase 08, el servicio de IA |
| Comprobación visual | Integración de servicios |

Los dos revisan el contrato entre pantalla y servidor, los guiones y el resumen. No editan a la vez el mismo archivo. El orden dentro de cada fase indica quién entra primero.

Los nombres reales de las dos personas no están en el material disponible. Sustituid "Integrante A" y "Integrante B" cuando los confirméis.

---

## 16. Estándar de calidad

No se da por terminada una fase porque una captura se vea bien.

- Los botones hacen lo que dicen.
- Las ramas que el guion promete existen y terminan.
- El puntaje es reproducible.
- Los argumentos se validan.
- Los errores tienen estado visible.
- No hay lógica de negocio dentro de componentes.
- No hay datos ficticios sueltos fuera de `content/` o de la siembra.
- No hay dependencias sin un uso en la fase actual.
- No hay comentarios que tapen código incompleto.
- Una interfaz con datos temporales no se presenta como conectada.

Si hay dos opciones técnicas, se elige la más simple que cumpla este plan y se anota en `docs/decisiones.md`.

---

## 17. Git

Antes de cambios fuertes: ver el estado, no descartar trabajo existente, no borrar archivos ni limpiar el repo, no tocar archivos de entorno, no usar comandos destructivos sin autorización.

Al cerrar una fase: revisar el diff, resumir, comprobar las pruebas de esa fase, proponer un mensaje de commit y esperar. No hay commit, push ni deploy sin tu autorización.

Este directorio todavía no es un repositorio. Inicializar Git puede formar parte de la Fase 01 si lo apruebas. No se hace en la Fase 00.

---

## 18. Riesgos

| Riesgo | Efecto | Mitigación |
| --- | --- | --- |
| Cerrar puntajes dentro del código antes de aprobar el guion | Hay que rehacer ramas y tests | Fases 05 y 06 empiezan por el markdown del guion aprobado. |
| Duplicar lógica en dos páginas | Reglas distintas por historia | Una pantalla, un motor, dos definiciones. |
| Puntaje en el cliente | Se puede manipular | `evaluate` solo en servidor, a partir del historial guardado. |
| Alcance de auth, pagos o analítica | Retrasa el demo | Excluidos hasta una fase nueva que tú apruebes. |
| IA que inventa o puntúa | Mensaje educativo falso | Fase 08 tardía, con texto fijo de reserva. |
| Carpeta sin Git | Pérdida de trabajo | Git en la Fase 01, commits solo cuando los pidas. |
| Linkly sin instalar | El agente no puede usar la skill todavía | Leer este archivo directo. No bloquear el producto. |
| Guion que afirma "siempre es fraude" | Enseña una regla falsa | Revisión conjunta con los límites de la sección 2. |
| Convex en producción por error | Datos o esquema en vivo | Prohibido `npx convex deploy` sin autorización. |

---

## 19. Decisiones pendientes

Hace falta tu respuesta antes de implementar lo que cada una afecta. Ninguna impide dejar escrito este plan. Las marcadas como bloqueantes sí impiden empezar la fase indicada.

| # | Decisión | Recomendación | Bloquea |
| --- | --- | --- | --- |
| D1 | Modelo de contenido: grafo embebido y versionado, no nueve tablas | Aprobar la sección 6.3 y 8 | Fase 03 |
| D2 | Sesión anónima con id de Convex, sin cuentas | Aprobar la sección 6.4 | Fase 03 |
| D3 | Rúbrica 4 × 25 y umbrales 40 / 70 | Ajustar números si quieres otra escala | Guion de las fases 05 y 06 |
| D4 | Opciones exactas y puntos de la Simulación A | Redactar `docs/guion-simulacion-a.md` y aprobarlo | Fase 05 |
| D5 | Opciones exactas y puntos de la Simulación B | Igual, archivo B | Fase 06 |
| D6 | Nombres de los dos integrantes | Confirmar para el reparto | No bloquea la Fase 01 |
| D7 | Paleta y tono visual | Definir al abrir la Fase 02 | Fase 02 |
| D8 | ¿Inicializar Git en la Fase 01? | Sí | Fase 01, si quieres historial desde el primer commit |
| D9 | Linkly: instalar aplicación, luego CLI y skill con consentimiento aparte | Seguir la guía oficial, sin saltar el Paso 1 | Solo la práctica de recuperación, no el producto |

No hay más requisitos ocultos. Lo que no está en este archivo no forma parte del MVP.

---

## 20. Criterios de aceptación de la Fase 00

- [x] El directorio se inspeccionó. Estaba vacío y sin Git.
- [x] Los requisitos salen de tu dirección técnica. Lo no especificado queda en la sección 19.
- [x] Hay arquitectura, carpetas, modelo, motor, puntuación, pruebas, seguridad, riesgos, aceptación y reparto.
- [x] Linkly queda como práctica de calidad, con el sondeo real y sin declararlo instalado.
- [x] No hay aplicación, dependencias ni deploy.
- [ ] Tú apruebas este documento o pides cambios.

---

## 21. Próximo paso

Esperar tu revisión.

Cuando quieras construir, el mensaje debe nombrar la fase. Por ejemplo: empezar la Fase 01. Eso no incluye la Fase 02 ni el resto.

Para completar Linkly, el Paso 1 es manual y va en la respuesta que acompaña a este archivo. La CLI y la skill se instalan después, cada una con un consentimiento distinto, porque descargan código desde la red.
