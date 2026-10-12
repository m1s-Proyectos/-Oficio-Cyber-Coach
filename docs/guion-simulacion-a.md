# Guion Simulación A — `whatsapp-familiar`

**Estado: Guion narrativo A aprobado (D4, 2026-10-10). No implementado. D3 y el resto de decisiones siguen pendientes.**

Este documento es el **guion narrativo oficial de la Simulación A**. No es código. No está conectado al motor. No cierra D1, D2, D3 ni D5. El fixture técnico `fixture-motor` no es esta historia. D4 **no** autoriza la Fase 05.

Slug previsto: `whatsapp-familiar`.  
Historia: intento ficticio de suplantación de un familiar por mensajería simulada.

---

## Aprobado

**D4 aprobada el 2026-10-10** por el propietario del producto.

**Alcance.** Guion narrativo de la Simulación A (`whatsapp-familiar`): nodos, opciones, destinos, textos, feedback, finales y reglas pedagógicas de este archivo. No incluye implementación, motor, puntuación oficial ni persistencia de elenco.

**Decisiones incluidas en esta firma**

1. Pausar y bloquear quedan como acciones distintas, con cierres y recomendaciones propias.  
2. Se conservan las ramas de verificación independiente. La ausencia de respuesta no confirma ni descarta la legitimidad del cobro.  
3. Se conserva el ciclo de volver al chat sospechoso, con salidas claras (no es un bucle sin salida).  
4. Los IDs actuales de nodos y opciones son identificadores internos estables.  
5. «Mensajes» es etiqueta visible de la superficie simulada, no una capacidad del motor.  
6. El elenco vive solo en el texto narrativo. Esta aprobación no autoriza persistirlo.  
7. No se aprueban puntos, ponderaciones, umbrales ni calificación. D3 sigue pendiente.  
8. El remitente se nombra con `{{relativeName}}`; no se inventa un apodo adicional.  
9. Tras cualquier pago se conservan los consejos de recuperación, sin promesa de reembolso.  
10. Se conserva el tono no culpabilizante, el aviso de ficción y la recomendación de no enviar más dinero ni compartir códigos.

**Fuera de esta aprobación:** D1, D2, D3, D5–D9; Fase 05; cambios de código.

---

## Objetivos de aprendizaje y aviso de ficción

**Aviso (visible en toda la partida, incluidos los finales).** Esta historia es un ejercicio ficticio. Los nombres, importes, mensajes y desenlaces son parte del entrenamiento. No describen un caso real ni predicen cómo ocurren todos los fraudes.

**Qué debe practicar la persona**

- Reconocer la urgencia emocional y la petición de dinero como señales a comprobar, no como prueba de fraude ni de autenticidad.
- Verificar por un canal independiente del chat que pide el dinero.
- Entender que seguir hablando en la misma cuenta, que el tono “suene bien” o que alguien no conteste una llamada **no demuestran** por sí solos quién escribe.
- Distinguir **prevención** (no enviar hasta verificar), **contención** (parar si ya se envió) y **recuperación** (pasos posteriores, sin promesa de reembolso).
- Si en la ficción ya envió dinero: no pagar más, conservar evidencia, contactar al medio de pago por canales oficiales y avisar al familiar por un medio comprobado.

**Tono.** No se culpa a quien se preocupa por su familiar ni a quien envió dinero creyendo ayudar. Se evalúa si verifica, si contiene el daño y si conoce los siguientes pasos.

No se piden credenciales, datos bancarios ni información personal real.

---

## Variables narrativas (elenco temporal)

Solo se piden datos necesarios para esta historia. Son **ficticios**. La persona podrá elegir sus propios nombres ficticios; si no elige, se usan los predeterminados, también ficticios, y se dice en pantalla.

En esta primera versión el elenco es **temporal**: no se persiste en servidor. D2 sigue pendiente para sesiones y persistencia.

| Clave | Pregunta | Predeterminado (ficticio) | Uso |
| --- | --- | --- | --- |
| `learner` | ¿Cómo te llamas en esta historia? | Alex | Saludos y textos de cierre |
| `relativeName` | ¿Cómo se llama el familiar de la historia? | Diego | Remitente y mensajes |
| `relationship` | ¿Qué es esa persona para ti en la historia? | hijo | “tu {{relationship}}” |

Validación propuesta (cuando se implemente, no ahora): no vacío; longitud razonable; sin caracteres de control; no puede parecer un id de nodo u opción. El default «hijo» es un ejemplo; la persona puede elegir otra relación (hermana, madre, etc.). Eso solo cambia el texto.

Sustituir **solo** en textos visibles. **Nunca** en `nodeId`, `optionId`, `nextNodeId`, señales, reglas ni puntuaciones. La personalización no altera la lógica.

---

## Superficies iniciales

| Superficie | Uso |
| --- | --- |
| `notification` | Aviso en el teléfono simulado |
| `messenger` | Hilo con {{relativeName}} |
| `result` | Cierres educativos (nodos terminales) |

No se usa WhatsApp real ni ninguna marca de mensajería como estafadora. Etiqueta visible propuesta: «Mensajes» u otra marca inventada (pregunta D4).

No se diseñan aquí buscador, red social ni tienda (simulación B).

---

## Señales pedagógicas (catálogo de esta historia)

Una señal **no demuestra** por sí sola que exista fraude. Sirven para practicar qué conviene comprobar.

| Id | Etiqueta | Recomendación fija |
| --- | --- | --- |
| `urgency` | Prisa para no pensar | La prisa no sustituye comprobar por otro canal. |
| `emotional-pressure` | Apelar al miedo o al afecto | Preocuparse es humano; el afecto no identifica al remitente. |
| `same-channel` | Seguir solo en el chat que pide el dinero | Un chat no demuestra quién escribe. |
| `money-ask` | Petición inmediata de dinero | Verifica la emergencia antes de transferir. |
| `second-ask` | Segunda petición tras un primer envío | Haber enviado antes no obliga a enviar otra vez. |
| `silence-ambiguous` | Nadie contesta en el canal independiente | El silencio no confirma ni descarta el fraude. |
| `compromised-account` | La cuenta conocida puede estar usada por otra persona | Confirma con el número o la persona que ya tenías. |
| `block-alone` | Bloquear sin verificar | Bloquear puede cortar el contacto; no demuestra que la emergencia sea falsa. |

Los campos `recognizedSignalIds`, `overlookedSignalIds` y `leavesRoomToCorrect` de cada opción son **metadatos propuestos**. Pendientes de compatibilidad con el motor y de D3. **No son puntos.** No se asignan puntuaciones en este documento.

Convención en las tablas: `reconocidas` = `recognizedSignalIds`; `omitidas` = `overlookedSignalIds`; `corrige` = `leavesRoomToCorrect`.

El motor actual espera `feedback: { explanation, recommendation }` y `EvaluationRule.points`. Aquí el feedback se parte en explicación y recomendación. Los puntos oficiales **no se rellenan** (D3 pendiente). Si hace falta un valor técnico solo para validar el esquema, eso se decide después, no en este relato.

---

## Limitación del motor (sin cambiar código)

El motor guarda historial `{ nodeId, optionId }` y no personaliza el texto de un mismo nodo según pagos previos. Por eso hay **dos nodos de recuperación** con el mismo consejo y distinto marco narrativo:

- `n_recover` — en la ficción se enviaron $200 y no $150.
- `n_recover_twice` — en la ficción se enviaron $200 y $150.

Ambos recomiendan lo mismo. Ninguno promete recuperar fondos. **Todas** las ramas con envío pasan por uno de los dos antes de un terminal.

---

## Grafo propuesto

Convención: cada opción tiene `id` estable, texto visible, `next`, consecuencia, feedback (explicación + recomendación) y metadatos de señales. **Terminal** aplica al nodo, no a la opción. Los importes $200 y $150 son del ejercicio.

### Nodo `n_notify` — terminal: no

**Superficie:** `notification`.  
**Situación:** En el teléfono simulado aparece un aviso: «{{relativeName}} · Mensaje nuevo». Debajo, el aviso de ficción.

**Pregunta:** ¿Qué haces?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `open-thread` | Abrir el mensaje | `n_ask200` | Entra al hilo. Aún no ha enviado dinero. | Es un aviso, no una prueba de urgencia real. | Léelo con calma. Aún no tienes que pagar ni responder. | `urgency` | — | sí |

---

### Nodo `n_ask200` — terminal: no

**Superficie:** `messenger`.  
**Mensaje de {{relativeName}} (10:42):**  
«Hola {{learner}}, necesito que me ayudes. Estoy en el hospital y me están cobrando $200. Mándamelos lo más rápido que puedas. Después te explico, no tengo tiempo.»

**Pregunta:** ¿Qué haces?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `send-200` | Enviar los $200 ahora. Es mi {{relationship}} y podría estar en peligro. | `n_after_200` | En la ficción el dinero sale. La preocupación es comprensible. | Enviar por miedo no comprueba quién escribe. | Aún puedes detenerte antes de un segundo pago y verificar por otro canal. | — | `urgency`, `emotional-pressure`, `same-channel`, `money-ask` | sí |
| `chat-only` | Preguntar por este mismo chat qué pasó y decidir después. | `n_chat` | Sigue en el mismo canal. | Una respuesta convincente en este hilo no demuestra identidad. | Si quieres comprobar, usa el número de siempre u otra persona de confianza. | `urgency` | `same-channel` | sí |
| `verify-now` | Llamar al número de siempre o escribir por otro medio que ya tenías. | `n_call` | Sale del chat que pide el dinero. | Un canal independiente es la práctica segura. Una emergencia puede ser real; por eso se verifica. | No asumas fraude ni autenticidad hasta comprobar. | `urgency`, `same-channel`, `money-ask`, `emotional-pressure` | — | sí |
| `pause` | No enviar nada todavía. Parar y pensar. | `n_pause` | No ha enviado. Aún no ha verificado. | Pausar evita un pago precipitado. No equivale a verificar. | El siguiente paso seguro es comprobar por otro medio. | `urgency` | `same-channel` | sí |
| `block-now` | Bloquear este contacto y no responder. | `n_block` | Corta el hilo. No ha enviado. No ha verificado. | Bloquear puede detener mensajes. No prueba que la emergencia sea falsa. | Si te preocupa que sea real, verifica por un canal independiente. | `urgency`, `block-alone` | `same-channel` | sí |

---

### Nodo `n_chat` — terminal: no

**Superficie:** `messenger`.  
**Mensaje (misma cuenta):**  
«Soy yo, {{relativeName}}. Te juro que es el hospital. ¿No te acuerdas de lo del domingo? No puedo hablar. Solo transfiere los $200 a esta cuenta. Confía en mí.»

El dato íntimo es **parte de la ficción**. Enseña que el mismo chat puede sonar convincente. No es verificación independiente.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `send-200-late` | Enviar los $200: respondió como mi {{relationship}}. | `n_after_200` | Entra a la rama del segundo pedido. | Acertar un detalle en este chat no identifica al remitente. | La verificación útil ocurre fuera de este hilo. | — | `same-channel`, `money-ask`, `emotional-pressure` | sí |
| `verify-after-chat` | Dejar este chat y verificar por otro canal. | `n_call` | Sale a verificación. | Cambiar de canal es lo que interrumpe la trampa del relato. | Usa un número o persona que ya tenías, no un dato nuevo de este chat. | `same-channel` | — | sí |
| `pause-after-chat` | No enviar. Parar y pensar. | `n_pause` | No envía. | Bien: no pagaste solo porque el tono sonó familiar. | Comprueba fuera de este hilo. | `urgency` | — | sí |
| `block-after-chat` | Bloquear y no seguir el hilo. | `n_block` | Corta el contacto. No envía. | Bloquear no sustituye preguntar por otro medio si te preocupa una emergencia. | Verifica cuando puedas, sin reabrir este chat como prueba. | `block-alone` | — | sí |

---

### Nodo `n_call` — terminal: no

**Superficie:** `messenger` (panel de “otra llamada / otro chat”, no el hilo sospechoso).  
**Situación:** Intentas el número habitual de {{relativeName}} o el medio que ya tenías. **No contestan.** No hay buzón útil. El silencio **no confirma ni descarta** el fraude en esta historia.

**Pregunta:** ¿Qué haces con esa falta de respuesta?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `contact-other` | Escribir o llamar a otra persona de confianza por un canal que ya tenía. | `n_other` | Sigue la verificación independiente. | Un segundo contacto conocido no es el chat que pide el dinero. | Pregunta si {{relativeName}} está bien y si pidió dinero. | `silence-ambiguous`, `same-channel` | — | sí |
| `pause-while-verifying` | No enviar. Esperar y no decidir aún. | `n_pause` | No paga. La verificación queda a medias. | No enviar mientras nadie confirma es razonable. | El silencio no es una respuesta. Sigue intentando otro contacto de confianza. | `silence-ambiguous`, `urgency` | — | sí |
| `back-to-suspect-chat` | Volver al chat y seguir preguntando ahí. | `n_chat` | Regresa al mismo canal. | Volver al hilo sospechoso **no** es verificación independiente. Quien controla esa cuenta puede seguir improvisando. | Si quieres comprobar, usa otro número u otra persona. | — | `same-channel`, `silence-ambiguous` | sí |
| `send-despite-silence` | Enviar los $200: no contestó, debe ser urgente. | `n_after_200` | En la ficción paga $200. | Interpretar el silencio como prueba de emergencia es una suposición. | El silencio no identifica al remitente. | — | `silence-ambiguous`, `money-ask` | sí |

---

### Nodo `n_other` — terminal: no

**Superficie:** `messenger` (otro contacto).  
**Situación:** Hablas con otra persona de confianza por un medio que ya tenías. Te dicen que {{relativeName}} está bien y **no** pidió dinero. Dentro de la ficción, la cuenta de mensajería conocida estaba comprometida. Eso es el desenlace de **este** ejercicio, no una regla de todos los casos reales.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `warn-and-end` | Avisar a {{relativeName}} por el canal que sí comprobé y no enviar dinero. | `t_safe` | No enviaste. Cierre de la rama segura. | Verificaste fuera del chat que pedía el pago. | Avisa por el medio comprobado. No uses este ejercicio como garantía de todos los casos reales. | `compromised-account` | — | no |

---

### Nodo `n_after_200` — terminal: no

**Solo se llega aquí si se enviaron $200** (`send-200`, `send-200-late`, `send-from-pause`, `send-despite-silence` o `send-after-block`). `back-to-chat-after-pay` también regresa a este nodo, pero no es el primer envío: ya hubo $200.  
**Superficie:** `messenger`.  
**Mensaje:** «Ya me llegó. De verdad, gracias. Ahora me piden $150 más para el tratamiento. Por favor, no me dejes aquí.»

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `send-150` | Enviar también los $150. | `n_recover_twice` | En la ficción sale un segundo pago. **Pasa por recuperación.** | Un segundo cobro urgente es señal para parar, no para repetir. Haber ayudado no obliga a seguir. | Deja de enviar y mira los pasos de contención. Nadie garantiza un reembolso. | — | `second-ask`, `emotional-pressure` | no |
| `stop-after-200` | No enviar más. Ver qué se puede hacer ahora. | `n_recover` | No envía el segundo monto. | Haber pagado una vez no obliga a seguir. | Prioriza no ampliar el daño y usar canales oficiales del medio de pago. | `second-ask` | — | sí |
| `verify-after-200` | Verificar ahora por teléfono u otra persona de confianza. | `n_call_after_pay` | Verifica tarde, pero verifica. | Todavía puedes comprobar quién pedía el dinero. | Usa un canal independiente, no este mismo chat. | `same-channel`, `second-ask` | — | sí |

---

### Nodo `n_call_after_pay` — terminal: no

**Superficie:** canal independiente.  
**Situación:** Ya enviaste $200 en la ficción. Llamas o escribes al número habitual. **No contestan.** El silencio no confirma ni descarta el fraude.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `contact-other-after-pay` | Contactar a otra persona de confianza por un canal independiente. | `n_other_after_pay` | Sigue la verificación. | El segundo contacto no es el chat del cobro. | Pregunta si {{relativeName}} pidió dinero. | `silence-ambiguous` | — | sí |
| `recover-while-silent` | No enviar más y pasar a los pasos de ahora. | `n_recover` | Contiene el daño sin el segundo pago. | No hace falta “resolver” el silencio para dejar de pagar. | Conserva evidencia y usa el canal oficial del medio de pago. | `second-ask`, `silence-ambiguous` | — | sí |
| `back-to-chat-after-pay` | Volver al chat que pide los $150. | `n_after_200` | El segundo pedido sigue visible. | Regresar a ese hilo no verifica. | Si pagas otra vez, el ejercicio te llevará a recuperación, no a un reembolso. | — | `same-channel` | sí |

---

### Nodo `n_other_after_pay` — terminal: no

**Situación:** Otra persona de confianza confirma que {{relativeName}} está bien y no pidió dinero. En la ficción, la cuenta estaba comprometida. **Ya enviaste $200.**

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `recover-informed` | Dejar de pagar y ver qué se puede hacer ahora. | `n_recover` | Recuperación educativa, sin segundo envío. | Descubrirlo tarde aún permite no enviar más. | Sigue los pasos. Este entrenamiento no promete reembolso. | `compromised-account` | — | no |

---

### Nodo `n_pause` — terminal: no

**Superficie:** `messenger` (pausa, sin pago).  
**Situación:** No has enviado dinero. Pausar significa **no transferir mientras evalúas**. No es lo mismo que bloquear ni que verificar.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `verify-from-pause` | Verificar ahora por otro canal. | `n_call` | Entra a la verificación (puede no haber respuesta). | La pausa más la comprobación es la secuencia buscada. | Si no contestan, no asumas el resultado: prueba otro contacto de confianza. | `same-channel` | — | sí |
| `send-from-pause` | Enviar los $200 igual. | `n_after_200` | Entra a la rama de envío y al pedido de $150. | La duda era una señal. Enviar cierra esa ventana. | Si ya pagaste en la ficción, aún puedes no enviar el segundo monto. | — | `money-ask` | sí |
| `block-from-pause` | Bloquear el contacto. | `n_block` | Distinto de solo pausar. | Bloquear corta mensajes; no demuestra que no hubiera emergencia. | Completa la verificación si todavía te preocupa. | `block-alone` | — | sí |
| `leave-paused` | Cerrar el ejercicio sin enviar y sin verificar. | `t_paused` | No pagó; tampoco comprobó. | No enviaste: evitas un pago precipitado. Queda pendiente verificar. | En una situación parecida, comprueba por otro canal, por si la emergencia fuera real. | `urgency` | `same-channel` | no |

---

### Nodo `n_block` — terminal: no

**Situación:** Bloqueaste el contacto del teléfono simulado. Eso puede **detener el hilo**. No demuestra que la emergencia sea falsa. No sustituye la verificación independiente. No es lo mismo que pausar (pausar = no enviar mientras piensas; bloquear = cortar ese canal).

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `verify-after-block` | Verificar igual por un canal independiente. | `n_call` | Verifica sin reabrir el chat como prueba. | Bloquear y verificar pueden ir juntos. | Usa el número de siempre u otra persona de confianza. | `block-alone`, `same-channel` | — | sí |
| `stay-blocked` | Dejarlo bloqueado y terminar sin verificar. | `t_blocked` | No pagó. No comprobó la emergencia. | Cortaste el contacto. Aún no sabes, en la lógica del ejercicio, si alguien cercano necesitaba ayuda. | Si te queda la duda, verifica por otro medio, no por el chat bloqueado. | `block-alone` | `same-channel` | no |
| `send-after-block` | Desbloquear y enviar los $200. | `n_after_200` | En la ficción paga. | Volver a pagar desde el mismo relato no verifica. | Si envías, el ejercicio te enseñará a contener un segundo cobro. | — | `money-ask`, `block-alone` | sí |

---

### Nodo `n_recover` — terminal: no

**Situación:** En la ficción ya salieron **$200**. No se pide otro pago aquí. Quien llega aquí **no** envió los $150 (o eligió contenerse tras el silencio / la comprobación tardía).

Texto educativo (sin culpar):

1. No envíes más dinero a quien escribió en ese chat.  
2. Contacta **cuanto antes** al proveedor del medio de pago o al banco por sus **canales oficiales** (app o número que ya tenías, no un enlace ni un dato del chat).  
3. Conserva mensajes, hora, monto y comprobantes como evidencia.  
4. Contacta a tu {{relationship}} por el medio que sí puedes comprobar.  
5. Valora denunciar ante las autoridades competentes cuando corresponda. **Una denuncia no garantiza** que el caso se resuelva ni que recuperes el dinero.  
6. **Este entrenamiento no puede prometer que recuperarás el dinero.** Ni el proveedor ni esta app pueden asegurarlo.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ack-recover` | Entendido. Terminar el ejercicio. | `t_recover` | Cierre de recuperación (un pago). | Priorizaste no ampliar el daño. | Los pasos reales quedan fuera de esta app. | — | — | no |

---

### Nodo `n_recover_twice` — terminal: no

**Situación:** En la ficción salieron **$200 y $150**. Mismos consejos que `n_recover`, con el marco de un segundo cobro. No se promete reembolso.

Texto educativo (sin culpar):

1. No envíes un tercer pago ni “gastos extra” que lleguen por el mismo chat.  
2. Contacta **cuanto antes** al proveedor del medio de pago por canales oficiales.  
3. Conserva evidencia de **ambos** envíos y de los mensajes.  
4. Contacta a {{relativeName}} por un canal independiente.  
5. Valora la denuncia cuando corresponda, sin esperar que eso recupere los fondos.  
6. **Nadie en este ejercicio puede prometer que recuperarás el dinero.**

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ack-recover-twice` | Entendido. Terminar el ejercicio. | `t_paid_twice` | Cierre tras dos pagos ficticios. | El patrón del segundo cobro era una señal para parar. | Aplica los mismos pasos de contención. No hay promesa de reembolso. | `second-ask` | — | no |

---

## Nodos terminales (textos completos)

Cada terminal usa superficie `result`, recuerda que la situación era ficticia y declara `options: []`.

### Nodo `t_safe` — terminal: sí · `options: []`

**Narrativa.** {{learner}}, en este ejercicio no enviaste dinero. Llamaste o escribiste por un medio que ya tenías. Cuando {{relativeName}} no contestó, no tomaste el silencio como prueba. Hablaste con otra persona de confianza. En **esta** historia te confirmaron que {{relativeName}} estaba bien y que la cuenta de mensajería conocida estaba siendo usada por otra persona.

**Cierre educativo.** La práctica útil fue salir del chat que pedía $200. Preocuparte por tu {{relationship}} era comprensible. Lo que cambió el desenlace del ejercicio fue comprobar por otro canal, no “adivinar” por el tono o la ortografía.

**Aviso de ficción.** Esto era un entrenamiento. Un caso real puede ser distinto: a veces hay una emergencia verdadera; a veces el silencio dura más; a veces no hay un segundo familiar disponible.

**Resumen de decisiones.** En este cierre no transferiste. Completaste una verificación independiente (pudo empezar al abrir el aviso, desde una pausa o después de bloquear), no tomaste el silencio como prueba y usaste un contacto de confianza fuera del chat que pedía el dinero.

**Recomendación.** Si algo parecido te inquieta fuera de la app: usa un número o persona que ya tenías; no envíes dinero solo porque el chat insiste; no trates una sola señal como prueba definitiva.

---

### Nodo `t_paused` — terminal: sí · `options: []`

**Narrativa.** {{learner}}, cerraste el ejercicio sin enviar los $200. Pausaste: no transferiste mientras pensabas. No llegaste a comprobar, en la ficción, si tu {{relationship}} estaba bien.

**Cierre educativo.** No enviar bajo presión evita un daño inmediato. Pausar no es lo mismo que verificar ni que bloquear. Si la emergencia fuera real, alguien de confianza sigue sin enterarse por un canal que tú controlas. Si fuera un impostor, el chat puede seguir ahí cuando reabras el hilo.

**Aviso de ficción.** No enviaste dinero de verdad. Este final no dice que “te salvaste” ni que “abandonaste a tu familia”. Solo muestra el hábito de frenar y la pieza que faltó: comprobar aparte.

**Resumen de decisiones.** No pagaste. No completaste una verificación independiente. No bloqueaste (esa rama tiene otro final).

**Recomendación.** En una situación parecida, el siguiente paso es el número de siempre u otra persona de confianza. No uses el mismo chat como única prueba. No hace falta decidir en un minuto.

---

### Nodo `t_blocked` — terminal: sí · `options: []`

**Narrativa.** {{learner}}, bloqueaste el contacto del teléfono simulado y no enviaste dinero. El hilo dejó de llegar. Eso no te dijo, dentro de la historia, si {{relativeName}} necesitaba ayuda o si otra persona usaba esa cuenta.

**Cierre educativo.** Bloquear puede detener la presión del chat. No demuestra que la emergencia sea falsa. No sustituye llamar o escribir por otro medio. No es lo mismo que pausar: al pausar dejas el canal abierto y evitas el pago; al bloquear cortas ese canal y aún puedes (o no) verificar.

**Aviso de ficción.** Ejercicio inventado. Bloquear no es “malo” ni “la solución completa”. Es una herramienta de contención del contacto, no una prueba.

**Resumen de decisiones.** No pagaste. Cortaste el contacto. No verificaste con {{relativeName}} ni con otra persona de confianza.

**Recomendación.** Si te queda la duda, comprueba por un canal independiente. Si no quieres reabrir el chat bloqueado, usa otro número o a otra persona. Sigue sin enviar dinero hasta tener esa comprobación.

---

### Nodo `t_recover` — terminal: sí · `options: []`

**Narrativa.** {{learner}}, en la ficción enviaste $200 porque creíste ayudar a tu {{relationship}}. No enviaste los $150. Después viste los pasos de contención: no pagar más, canal oficial del medio de pago, evidencia, aviso por un medio independiente y, si corresponde, valorar una denuncia.

**Cierre educativo.** Querer ayudar no es un fallo moral. El aprendizaje es verificar antes cuando puedas, y si el dinero ya salió, **contener** el segundo cobro. Prevención, contención y recuperación son etapas distintas.

**Aviso de ficción.** No perdiste dinero real. Este final **no promete** que un banco, una app o una denuncia recuperen fondos. Tampoco afirma que en la vida real “habrías sido estafado” de la misma forma.

**Resumen de decisiones.** Hubo un envío ficticio de $200. No hubo segundo envío. Pasaste por la etapa de recuperación educativa.

**Recomendación.** Recuerda la lista: no envíes más; usa el canal oficial que ya tenías; guarda evidencia; habla con tu familiar por otro medio; denuncia solo como opción, sin esperar un desenlace garantizado.

---

### Nodo `t_paid_twice` — terminal: sí · `options: []`

**Narrativa.** {{learner}}, en la ficción enviaste $200 y luego $150 porque el mismo chat siguió pidiendo ayuda. Es comprensible haber querido no “dejar plantado” a tu {{relationship}}. Después pasaste por la misma lista de recuperación, aplicada a **dos** pagos.

**Cierre educativo.** El segundo cobro urgente es un patrón de práctica: haber enviado una vez no obliga a enviar otra. Ni el tono, ni el “ya me llegó”, ni los $150 “del tratamiento” demuestran identidad.

**Aviso de ficción.** Importes inventados. **No se promete recuperar** $200, $150 ni la suma. Una denuncia o un reclamo al proveedor pueden ser pasos útiles; no son una solución asegurada.

**Resumen de decisiones.** Dos envíos ficticios. Etapa de recuperación vista. No hay más opciones en este cierre.

**Recomendación.** Para en el siguiente cobro. Conserva evidencia de ambos movimientos. Contacta al medio de pago por un canal oficial. Avisa a {{relativeName}} por un medio independiente. No envíes “gastos extra” que lleguen por el mismo hilo.

---

## Cobertura (validación manual)

Comprobaciones:

- Cada `next` existe como nodo de este documento.  
- No hay nodos inaccesibles: todos se alcanzan desde `n_notify`.  
- Todo camino llega a un terminal (`t_safe`, `t_paused`, `t_blocked`, `t_recover`, `t_paid_twice`).  
- Hay ciclos **con** salida (`n_call` ↔ `n_chat`, `n_call` ↔ `n_pause`, `n_call_after_pay` ↔ `n_after_200`, `n_block` → `n_call`). No hay bucle sin opción de terminar.  
- El pedido de $150 solo existe en `n_after_200`, y `n_after_200` solo se alcanza tras un envío de $200.  
- Toda rama con pago pasa por `n_recover` o `n_recover_twice`.  
- Los cinco terminales tienen texto completo y `options: []`.  
- El elenco no cambia ids ni destinos.

| Desde | Opción | Hacia | Terminal de esa rama |
| --- | --- | --- | --- |
| `n_notify` | `open-thread` | `n_ask200` | sigue |
| `n_ask200` | `send-200` | `n_after_200` | → recuperación |
| `n_ask200` | `chat-only` | `n_chat` | sigue |
| `n_ask200` | `verify-now` | `n_call` | sigue (silencio) |
| `n_ask200` | `pause` | `n_pause` | sigue |
| `n_ask200` | `block-now` | `n_block` | sigue |
| `n_chat` | `send-200-late` | `n_after_200` | → recuperación |
| `n_chat` | `verify-after-chat` | `n_call` | sigue |
| `n_chat` | `pause-after-chat` | `n_pause` | sigue |
| `n_chat` | `block-after-chat` | `n_block` | sigue |
| `n_call` | `contact-other` | `n_other` | → `t_safe` |
| `n_call` | `pause-while-verifying` | `n_pause` | sigue |
| `n_call` | `back-to-suspect-chat` | `n_chat` | sigue (ciclo con salida) |
| `n_call` | `send-despite-silence` | `n_after_200` | → recuperación |
| `n_other` | `warn-and-end` | `t_safe` | sí |
| `n_after_200` | `send-150` | `n_recover_twice` | → `t_paid_twice` |
| `n_after_200` | `stop-after-200` | `n_recover` | → `t_recover` |
| `n_after_200` | `verify-after-200` | `n_call_after_pay` | → `t_recover` (si no vuelve al chat y paga $150) |
| `n_call_after_pay` | `contact-other-after-pay` | `n_other_after_pay` | → `t_recover` |
| `n_call_after_pay` | `recover-while-silent` | `n_recover` | → `t_recover` |
| `n_call_after_pay` | `back-to-chat-after-pay` | `n_after_200` | ciclo; $150 o recuperación |
| `n_other_after_pay` | `recover-informed` | `n_recover` | → `t_recover` |
| `n_pause` | `verify-from-pause` | `n_call` | sigue |
| `n_pause` | `send-from-pause` | `n_after_200` | → recuperación |
| `n_pause` | `block-from-pause` | `n_block` | sigue |
| `n_pause` | `leave-paused` | `t_paused` | sí |
| `n_block` | `verify-after-block` | `n_call` | sigue |
| `n_block` | `stay-blocked` | `t_blocked` | sí |
| `n_block` | `send-after-block` | `n_after_200` | → recuperación |
| `n_recover` | `ack-recover` | `t_recover` | sí |
| `n_recover_twice` | `ack-recover-twice` | `t_paid_twice` | sí |

Entradas a `n_after_200` (único lugar del $150): `send-200`, `send-200-late`, `send-from-pause`, `send-despite-silence`, `send-after-block`, `back-to-chat-after-pay` (regreso, no es el primer envío).

Ramas mínimas del plan:

- Notificación: `n_notify`.  
- Pedido $200: `n_ask200`.  
- Enviar / chat / verificar / pausar / bloquear: opciones de `n_ask200`.  
- $150 solo tras $200: `n_after_200`.  
- Parar tras el primer envío: `stop-after-200`.  
- Familiar no responde: `n_call` y `n_call_after_pay`.  
- Otro contacto y cuenta comprometida (ficción): `n_other`, `n_other_after_pay`.  
- Recuperación sin promesa de reembolso: `n_recover`, `n_recover_twice`.  
- Salida al pausar o abandonar: `t_paused`.  
- Salida al bloquear sin verificar: `t_blocked`.

---

## Casos límite narrativos

- Si no rellena el elenco: Alex / Diego / hijo, dichos como ficticios.  
- Pausar y bloquear son nodos distintos (`n_pause`, `n_block`) con finales distintos (`t_paused`, `t_blocked`).  
- No hay chat libre: solo las opciones de las tablas.  
- No se piden cuentas bancarias reales, contraseñas ni fotos.  
- No se afirma que un caso real se comporte siempre como este relato.

---

## Pendientes que el documento no puede cerrar solo

- D3: puntos, umbrales y si `leavesRoomToCorrect` entra en la rúbrica.  
- El motor exige `EvaluationRule.points` (0–25) para validar un escenario: **no se inventan aquí**.  
- Elenco, `view`/`surface` y plantillas `{{…}}` no existen aún en `ScenarioDefinition`: extensión pequeña o capa de presentación, no decidida.  
- D1 (dónde vive el grafo) y D2 (sesión / persistencia del elenco).  
- Implementación del teléfono simulado (Fase 05), no este archivo.

---

## Pendiente de D3

**No se asignan puntos oficiales, ponderaciones ni umbrales en este borrador.**

El motor ya puede sumar cuatro dimensiones (reconocimiento, verificación, contención, recuperación) **si** D3 se aprueba. Cualquier número futuro es propuesta no aprobada.

Antes de puntuar por opción habría que decidir, entre otras cosas: si `open-thread` suma 0; cómo se trata `leave-paused` frente a `stay-blocked`; si `send-from-pause` y `send-despite-silence` pesan igual que `send-200`; si la recuperación tras pagar puntúa en «recuperación» aunque falle la contención.

Umbrales 0–39 / 40–69 / 70–100 del plan maestro: **pendientes**. Este guion no los usa.

---

## Preguntas para la revisión D4

Responde estas para poder firmar el documento. No se asumen las respuestas.

1. ¿Aceptas los ids de nodo y de opción de este grafo (incluidos `n_call`, `n_other`, `n_block`, `n_recover_twice`, `t_blocked`), o quieres otros nombres?  
2. ¿Confirmas que **pausar** y **bloquear** deben existir ambas, con `t_paused` y `t_blocked`?  
3. ¿La falta de respuesta debe quedarse como `n_call` / `n_call_after_pay` (cuatro y tres opciones) o quieres menos clics?  
4. ¿Te parece bien que volver al chat sospechoso sea una opción explícita (para enseñar que no verifica), aunque cree un ciclo con salida?  
5. ¿El remitente se llama siempre {{relativeName}} o también un apodo?  
6. ¿La etiqueta de la app simulada puede ser «Mensajes» (sin imitar una marca real)?  
7. ¿Confirmas que el elenco no se guarda en servidor en la primera versión? (D2 sigue abierta.)  
8. Cuando apruebes D3: ¿los puntos van en una tabla aparte, sin mezclarlos con este relato?  
9. ¿Falta o sobra alguna rama respecto a `docs/contexto-producto.md`?  
10. **D4:** aprobada el 2026-10-10 (sección «Aprobado»). No autoriza implementar la Fase 05.

---

## Relación con otras decisiones

| Decisión | Estado en este archivo |
| --- | --- |
| D1 | No se decide aquí. |
| D2 | No se decide aquí. Elenco temporal, no persistido. |
| D3 | Pendiente. Sin puntos oficiales. |
| D4 | Aprobada el 2026-10-10. Guion narrativo A. No incluye Fase 05 ni puntuación. |
| D5 | No aplica (simulación B). |
| D6–D9 | No se deciden aquí. |
