# Decisiones vigentes

## Aplicación local-first

- La aplicación se ejecuta completamente en el navegador; no requiere backend, Convex, cuentas ni configuración de entorno.
- React + TypeScript + Vite mantienen una base única para los retos y los laboratorios.
- Los guiones y reglas se versionan en el repositorio y el motor determinista valida las transiciones localmente.
- XP, rachas, precisión inicial y logros se guardan en `localStorage`. Son métricas motivacionales, no datos certificados ni resistentes a manipulación.
- La preferencia de tema es `system`, `light` o `dark`, y se guarda localmente.
- La narración utiliza la síntesis de voz del navegador. No se envía texto a un proveedor externo.
- No se incorporarán servicios de red hasta que exista una necesidad concreta validada por usuarios.

## Criterios de calidad

- No pedir contraseñas, códigos OTP ni datos bancarios reales.
- Marcar cada simulación como ficticia.
- Mantener accesibilidad por teclado, foco visible, contraste y diseño adaptable.
- Antes de cualquier lanzamiento comercial, ejecutar typecheck, lint, pruebas y build en un entorno con dependencias instaladas; hacer pruebas de usabilidad y revisión de contenido.
