# Plan maestro — NoCaigas · OFICIO Cyber Coach

## Objetivo

Enseñar a personas sin formación técnica a reconocer señales de fraude digital mediante retos breves y laboratorios narrativos. La experiencia debe ser accesible, respetuosa, fácil de usar y segura por defecto.

## Arquitectura actual

- **React + TypeScript + Vite**: aplicación de una sola página.
- **Router local por hash**: navegación compatible con hosting estático.
- **Motor determinista** (`src/engine`): valida escenarios y transiciones de simulación en memoria.
- **Contenido versionado** (`src/content`): guiones y catálogos tipados como código.
- **Progreso local**: `localStorage` para XP, rachas, intentos, precisión inicial y logros.
- **Temas**: claro, oscuro y sistema; la preferencia se guarda localmente.
- **Voz opcional**: `SpeechSynthesis` del navegador, sin API externa ni credenciales.
- **Pruebas**: Vitest para las reglas del motor y los escenarios.

No hay backend, Convex, autenticación, servicios de voz externos ni variables de entorno requeridas. La app puede ejecutarse y desplegarse como sitio estático.

## Experiencia educativa

### Retos rápidos

Ocho retos de decisión única con escenarios ficticios, pistas opcionales, explicación, señales de alerta, acciones recomendadas y una conclusión práctica.

### Laboratorios narrativos

- Mensaje urgente de un supuesto familiar.
- Compra de un teléfono con una oferta sospechosa.
- Oferta laboral que exige un pago previo.
- Solicitud de código de verificación.
- Suplantación de una persona con autoridad en el trabajo.

Cada laboratorio debe indicar claramente que es ficticio, no solicitar datos reales y evitar culpabilizar a quien se equivoca.

## Principios de ingeniería

1. Mantener módulos pequeños y responsabilidades claras.
2. Evitar dependencias externas si la experiencia puede funcionar localmente.
3. Mantener los escenarios como datos tipados y validar el grafo antes de ejecutarlo.
4. No confiar en XP o estadísticas locales como mecanismo de certificación o protección contra manipulación.
5. Proteger accesibilidad, contraste, foco visible, navegación por teclado y diseño adaptable.
6. No incluir claves, tokens ni datos personales en el repositorio.

## Limitaciones conocidas

- El progreso solo existe en el navegador actual; no hay cuenta ni sincronización.
- El usuario puede editar los datos locales, por lo que las puntuaciones son motivacionales.
- La síntesis de voz depende del navegador y de las voces instaladas.
- La aplicación no analiza mensajes reales ni detecta fraude automáticamente.
- Antes de venderla se necesitan pruebas en navegadores y móviles reales, revisión de accesibilidad, validación de contenido con usuarios y una evaluación comercial/legal del producto.

## Próximos pasos recomendados

1. Instalar dependencias y ejecutar `npm run check` en un entorno con acceso al registro npm.
2. Corregir cualquier hallazgo de compilación, tipos, lint o pruebas.
3. Hacer pruebas de usabilidad con personas de distintas edades y niveles de alfabetización digital.
4. Ampliar laboratorios con escenarios revisados y retroalimentación experta.
5. Evaluar si las cuentas, sincronización o panel corporativo son realmente necesarios antes de introducir backend.
