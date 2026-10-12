# NoCaigas · OFICIO Cyber Coach

Plataforma frontend-only para practicar criterio digital mediante retos cortos y laboratorios interactivos de ciberseguridad. El proyecto combina la identidad visual y la progresión de NoCaigas con los escenarios inmersivos y el motor determinista de OFICIO Cyber Coach.

## Requisitos

- Node.js 20.19 o superior
- npm

## Ejecutar en local

```bash
npm install
npm run dev
```

Vite mostrará una URL local, normalmente `http://localhost:5173`.

## Comprobar el proyecto

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Qué incluye

- Retos rápidos educativos con pistas, explicaciones, señales de alerta y acciones recomendadas.
- Laboratorios inmersivos: suplantación de un familiar, compra en línea, oferta laboral con pago previo, solicitud de código de verificación y supuesto jefe.
- Motor de simulaciones determinista que valida decisiones y calcula resultados en el navegador.
- XP, rachas, precisión inicial, progreso y logros.
- Preferencias de apariencia claro, oscuro y sistema.
- Narración opcional con la síntesis de voz del navegador; no necesita API externa.
- Persistencia local en `localStorage`; no hay cuentas ni transmisión de datos personales.
- Navegación por teclado, estados accesibles y diseño adaptable.

## Alcance y límites

- No hay backend, Convex, autenticación ni sincronización entre dispositivos.
- El progreso vive en el navegador actual y puede borrarse al limpiar los datos del sitio.
- Como todo cálculo se realiza en el cliente, XP y estadísticas son motivacionales, no verificaciones resistentes a manipulación.
- Los escenarios son ficticios. La aplicación no analiza mensajes reales ni detecta fraude en tiempo real.
- La voz depende de las capacidades y voces instaladas en el navegador/dispositivo.
