# Guion Simulación B — `tienda-iphone`

**Estado: Guion narrativo B aprobado (D5, 2026-10-10). No implementado. D1, D2, D3 y D6–D9 siguen pendientes.**

Este documento es el **guion narrativo oficial de la Simulación B**. No es código. No está conectado al motor. D5 **no** autoriza por sí sola implementar la Simulación B ni cierra D1, D2, D3 ni D6–D9.

Slug previsto: `tienda-iphone`.  
Historia: búsqueda y compraventa ficticias de un iPhone 14 a $610, con perfil social inventado, tienda inventada y un cobro extra de $100 atribuido a «aduana».

---

## 1. Estado de aprobación

| Campo | Valor |
| --- | --- |
| Decisión | D5 — opciones exactas y relato de la Simulación B |
| Estado | **D5 APROBADA** (2026-10-10) |
| Fecha de aprobación | 2026-10-10 |
| Alcance | Nodos, opciones, destinos, textos, finales y reglas pedagógicas de **este** archivo |
| Fuera de alcance | Implementación, motor, Convex, puntuación oficial (D3), persistencia de elenco (D2) |

La firma D5 está en la sección 15. **No autoriza código.**

---

## 2. Objetivo de aprendizaje

La persona practica **evaluar un anuncio, un perfil y una tienda en contexto**, **verificar fuera del canal que vende** y **proteger el pago** antes de adelantar dinero. Si ya adelantó, practica **contener un segundo cobro** y conocer pasos de recuperación **sin promesa de reembolso**.

No se enseña a «detectar estafas por el precio». Un precio bajo es una **señal a comprobar**, no una prueba. Un precio alto o una tienda conocida **de esta ficción** tampoco demuestran legitimidad en el mundo real.

**Tono.** No se culpa a quien busca un teléfono asequible ni a quien pagó creyendo aprovechar una oferta. Se evalúa si verifica, si contiene el daño y si conoce los siguientes pasos.

---

## 3. Contexto y elenco

`{{shopperName}}` (predeterminado ficticio: María) ahorró para un iPhone 14. En comercios conocidos **de esta historia** el aparato cuesta unos $1.190. En BuscaYa aparece Lumina Móvil a $610, con muchos comentarios positivos y entrega en siete días. Tú decides con ella.

El elenco es **temporal**: no se persiste. D2 sigue pendiente.

| Clave | Pregunta | Predeterminado (ficticio) | Uso |
| --- | --- | --- | --- |
| `learner` | ¿Cómo te llamas en esta historia? | Alex | Saludos y textos de cierre |
| `shopperName` | ¿Cómo se llama quien busca el teléfono? | María | Relato y pantallas |

Validación propuesta (cuando se implemente, no ahora): no vacío; longitud razonable; sin caracteres de control; no puede parecer un id de nodo u opción.

Sustituir **solo** en textos visibles. **Nunca** en `nodeId`, `optionId`, `nextNodeId`, señales, reglas ni finales. La personalización no altera la lógica.

Importes del ejercicio (fijos, no personalizables):

| Concepto | Importe |
| --- | --- |
| Precio CasaTec (ficción) | $1.190 |
| Precio Lumina Móvil | $610 |
| Pago parcial | $305 |
| Cobro extra «aduana» | $100 |

---

## 4. Aviso de ficción

**Visible en toda la partida, incluidos los finales.**

> Esta historia es un ejercicio ficticio. Nombres, tiendas, importes, perfiles y desenlaces son inventados. No describen un caso real ni predicen cómo ocurren todos los fraudes. No visites tiendas reales a partir de este relato ni envíes dinero, datos bancarios ni credenciales fuera de la simulación.

Recordatorio breve en cada cierre (`result`).

No se usan marcas reales como ejemplos de comercios fraudulentos. No hay enlaces externos funcionales ni medios de pago reales.

---

## 5. Inventario de superficies y marcas ficticias

Las superficies son **presentación**. El motor solo conoce nodos y `optionId`.

| Superficie conceptual | Etiqueta visible | Uso |
| --- | --- | --- |
| `search` | BuscaYa | Resultados y nota de comparación |
| `social` | Muro | Perfil de Lumina Móvil |
| `store` | Lumina Móvil / CasaTec | Catálogo, reseñas, condiciones |
| `pay` | Cartera Simulada | Checkout y protección de pago |
| `result` | Cierre | Nodos terminales |

Marcas inventadas: **BuscaYa**, **Muro**, **Lumina Móvil**, **CasaTec**, **Cartera Simulada**.

Todo ocurre en el **mismo teléfono simulado**. No son tres cuestionarios independientes.

CasaTec es una opción segura **dentro de esta ficción**. No se afirma que exista ni que sea legítima en el mundo real.

---

## 6. Inventario de señales de riesgo

Una señal **no demuestra** fraude. Sirven para practicar qué conviene comprobar. **No son puntos.** D3 sigue pendiente.

| Id | Etiqueta | Recomendación fija |
| --- | --- | --- |
| `low-price` | Precio muy por debajo del de referencia de la historia | Compara y verifica; el precio solo no prueba ni descarta un problema. |
| `review-volume` | Muchos comentarios positivos en el mismo anuncio | Busca opiniones fuera del canal que vende. |
| `recent-accounts` | Cuentas de comentario recientes | La antigüedad es una pista, no una prueba aislada. |
| `own-channel-proof` | Solo hay elogios en el muro o la tienda | Una fuente independiente no es el propio anuncio. |
| `prepaid-full` | Pago total por adelantado | Pregunta qué protección tiene el medio de pago si el vendedor desaparece. |
| `urgency-stock` | «Quedan pocas unidades» | La prisa no sustituye comprobar condiciones y vendedor. |
| `extra-fee` | Cobro extra inesperado («aduana») | Verifica el motivo por un canal oficial, no solo el chat de la tienda. |
| `store-vanish` | La tienda desaparece en la ficción | Suele llegar tarde; conviene contener el daño y no pagar más. |

Metadatos `reconocidas` / `omitidas` / `corrige` en las tablas = propuesta pedagógica. Compatibles con `EvaluationRule` del motor, **sin** rellenar `points` oficiales.

---

## 7. Grafo narrativo y limitación del motor

Inicio: `n_home`. El motor no personaliza un mismo nodo según el historial de pagos. Por eso hay **tres** nodos de recuperación con el mismo consejo y distinto marco:

| Nodo | Importe adelantado en la ficción |
| --- | --- |
| `n_recover` | $610; no se pagaron los $100 |
| `n_recover_extra` | $610 + $100 |
| `n_recover_half` | $305; no se completó el total ni el extra |

El cobro de $100 **solo** aparece después de un pago **completo** de $610 (`n_paid` → `n_customs`). Quien paga $305 y se detiene **no** ve aduana. Quien paga $305 y luego los $305 restantes entra a `n_paid` (total $610) y **entonces** puede ver el cobro extra.

**Cambios respecto a la propuesta 06.0**

- Se elimina `buy-from-profile` → checkout. Desde el perfil solo se abre la tienda.
- Se añade `leave-informed` hacia `t_safe` en tienda, condiciones y protección de pago.
- Se elimina `n_half` → `n_customs` (el extra no puede aparecer con solo $305).
- `n_independent` obliga a pasar por `n_shop` antes de un cierre informado.
- `n_reviews` incluye `leave-informed-reviews` → `t_safe`.

```
n_home → n_search
n_search → n_profile | n_casatec | n_compare | t_price_reject | n_pause
n_casatec → n_search | t_known | n_profile
n_compare → n_search | n_profile | t_price_reject
n_profile → n_shop | n_independent | n_search
n_independent → n_shop | n_pause
n_shop → n_reviews | n_terms | n_protect | n_checkout | n_pause | n_profile | t_safe
n_reviews → n_shop | n_checkout | n_independent | t_safe
n_terms → n_shop | n_checkout | n_pause | t_safe
n_protect → n_checkout | n_shop | t_safe
n_checkout → n_paid | n_half | n_shop | n_pause
n_half → n_paid | n_recover_half
n_paid → n_customs
n_customs → n_recover_extra | n_recover | n_verify_customs
n_verify_customs → n_recover | n_recover_extra
n_pause → n_search | n_shop | t_paused
n_recover → t_recover
n_recover_extra → t_paid_extra
n_recover_half → t_half_stop
```

---

## 8. Nodos

Convención: cada opción tiene `id` estable, texto, `next`, consecuencia, explicación, recomendación y metadatos de señales. **Terminal** aplica al nodo. Los importes son del ejercicio.

### Nodo `n_home` — terminal: no

**Superficie:** `search` (inicio del teléfono).  
**Situación:** {{shopperName}} lleva meses ahorrando para un iPhone 14. En tiendas conocidas de esta historia cuesta cerca de $1.190. Puede buscar en BuscaYa. Debajo, el aviso de ficción.

**Pregunta:** ¿Qué haces?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `open-search` | Abrir BuscaYa y buscar «iPhone 14» | `n_search` | Entra al buscador. Aún no paga. | Buscar no es comprar. | Compara anuncios antes de decidir. | — | — | sí |

---

### Nodo `n_search` — terminal: no

**Superficie:** `search`.  
**Resultados ficticios (sin marcar fraude):**

1. CasaTec — iPhone 14 · $1.190 · «comercio conocido de esta historia».  
2. Lumina Móvil — $610 · anuncio destacado · 4,9★ · «entrega en 7 días».  
3. Nota «Cómo comparar un vendedor» (consejos generales; **no** acusa a Lumina).

**Pregunta:** ¿Qué abres?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `open-lumina` | Abrir el perfil de Lumina Móvil en Muro | `n_profile` | Ve el anuncio barato en contexto social. | El precio bajo es una pista, no una prueba. | Mira quién publica y qué dicen fuera del anuncio. | `low-price` | — | sí |
| `open-casatec` | Ver la ficha de CasaTec | `n_casatec` | Contrasta el precio de referencia de la historia. | Comparar no obliga a comprar lo más barato. | Revisa condiciones, no solo el número. | — | — | sí |
| `open-compare` | Leer cómo comparar un vendedor | `n_compare` | Ve criterios generales. | La nota no revela el final de Lumina. | Úsala como lista, no como veredicto. | — | — | sí |
| `reject-price` | No me fío de un precio tan bajo. Terminar aquí. | `t_price_reject` | Termina sin investigar Lumina. | Tratar el precio como prueba cierra mal la evaluación. | El precio alto tampoco demuestra legitimidad. | `low-price` | `review-volume`, `own-channel-proof` | no |
| `pause-search` | No entrar a ningún anuncio todavía | `n_pause` | No paga. No verifica. | Pausar evita un clic precipitado. | El siguiente paso útil es comparar, no solo esperar. | — | — | sí |

---

### Nodo `n_casatec` — terminal: no

**Superficie:** `store` (ficha CasaTec).  
**Situación:** iPhone 14 a $1.190. Retiro en el comercio de **esta** ficción. Sin cobro extra en pantalla. No se afirma que CasaTec exista fuera del ejercicio.

**Pregunta:** ¿Qué haces?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `back-search` | Volver a los resultados | `n_search` | Ciclo con salida. | Puede seguir comparando. | Contrasta más de un anuncio. | — | — | sí |
| `buy-casatec` | Comprar en CasaTec y no seguir el anuncio de $610 | `t_known` | Cierre sin entrar a Lumina. | En este relato evita adelantar a un anuncio no verificado. | En la vida real, verifica también al comercio que elijas. | — | — | no |
| `still-lumina` | Abrir igual el perfil de Lumina Móvil | `n_profile` | Entra a la oferta barata. | Comparar incluye mirar el anuncio, no solo el precio. | Revisa perfil, tienda y protección de pago. | `low-price` | — | sí |

---

### Nodo `n_compare` — terminal: no

**Superficie:** `search`.  
**Texto:** Compara antigüedad del perfil, opiniones **fuera** del anuncio, condiciones de envío y si el medio de pago protege la compra. **No** dice que Lumina sea fraude.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `back-search-note` | Volver a los resultados | `n_search` | Ciclo. | Puede aplicar la lista a un anuncio. | Abre el perfil o CasaTec con esos criterios. | — | — | sí |
| `open-lumina-informed` | Abrir el perfil de Lumina Móvil | `n_profile` | Entra informado. | Leer criterios no sustituye mirar el anuncio. | Aplícalos al perfil y a la tienda. | — | — | sí |
| `reject-price-after-note` | Descartar Lumina por el precio y terminar | `t_price_reject` | Cierre por heurística de precio. | La nota pedía verificar, no rechazar por el número. | Precio bajo ≠ prueba de fraude. Un precio alto tampoco demuestra legitimidad. | `low-price` | `own-channel-proof` | no |

---

### Nodo `n_profile` — terminal: no

**Superficie:** `social`.  
**Perfil «Lumina Móvil» (datos visibles, sin etiqueta «fraude»):** creado hace 3 semanas; 18 comentarios 5★; fotos repetidas; bio «tienda familiar desde 2018».

**Pregunta:** ¿Qué haces? **No hay compra desde el perfil.**

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `open-shop` | Abrir la ficha de Lumina Móvil | `n_shop` | Ve catálogo y precio en la tienda. | El muro no es el contrato de compra. | Revisa condiciones y protección de pago. | `review-volume`, `recent-accounts` | — | sí |
| `search-opinions` | Buscar opiniones fuera de este muro | `n_independent` | Sale del canal que vende. | Práctica útil de verificación. | Anota si solo aparecen sus propios posts. | `own-channel-proof` | — | sí |
| `back-search-profile` | Volver a BuscaYa | `n_search` | Ciclo con salida. | Puede contrastar CasaTec u otra nota. | No uses el muro como única prueba. | — | — | sí |

---

### Nodo `n_independent` — terminal: no

**Superficie:** `search`.  
**Situación:** Búsqueda «Lumina Móvil opiniones». Solo aparecen posts de la propia tienda. No hay fuente independiente en este ejercicio. Eso **no** se presenta como veredicto de fraude.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `open-shop-after` | Abrir la tienda para ver precio y condiciones | `n_shop` | Completa las tres superficies. | Ver opiniones no sustituye leer la ficha. | Mira también el pago adelantado. | `own-channel-proof` | — | sí |
| `pause-after-opinions` | Parar y pensar | `n_pause` | No paga. Aún puede abrir la tienda. | Pausar no cierra la investigación. | Un vistazo a la ficha aclara condiciones. | `own-channel-proof` | — | sí |

---

### Nodo `n_shop` — terminal: no

**Superficie:** `store`.  
**Catálogo:** iPhone 14 · $610 · «quedan 4» · más de 15 comentarios · pago total adelantado · envío internacional 7 días.

**Pregunta:** ¿Qué revisas?

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `read-reviews` | Leer los comentarios de la tienda | `n_reviews` | Ve cuentas recientes. | Los elogios del propio sitio no bastan. | Contrasta fuera si puedes. | `review-volume` | — | sí |
| `read-terms` | Leer condiciones de compra y envío | `n_terms` | Ve prepago y aduana a cargo del cliente. | Las letras chicas son parte de la decisión. | Pregunta qué pasa si no llega. | `prepaid-full` | — | sí |
| `check-protect` | Ver si Cartera Simulada protege esta compra | `n_protect` | Ve que no hay protección en este ejercicio. | El medio de pago importa tanto como el precio. | No adelantes si no aceptas ese riesgo. | `prepaid-full` | — | sí |
| `go-checkout` | Ir a pagar $610 ahora | `n_checkout` | Entra al pago. | Aún puede cancelar. | Revisa protección antes de confirmar. | — | `prepaid-full`, `urgency-stock` | sí |
| `pause-shop` | No pagar todavía | `n_pause` | No paga. Investigación a medias. | Pausar no es lo mismo que haber decidido con información. | Puedes volver a la ficha o salir. | `urgency-stock` | — | sí |
| `back-profile` | Volver al perfil en Muro | `n_profile` | Ciclo. | Puede buscar opiniones otra vez. | El perfil no sustituye las condiciones. | — | — | sí |
| `leave-informed-shop` | Salir sin pagar. No voy a adelantar este dinero. | `t_safe` | Cierre seguro. No afirma fraude. | Evita adelantar sin verificación suficiente. | En un caso real, usa canales oficiales tuyos, no este relato. | `prepaid-full`, `low-price` | — | no |

---

### Nodo `n_reviews` — terminal: no

**Superficie:** `store`.  
**Comentarios:** «Llegó en 7 días». Cuentas creadas «hace 8–12 días». Sin etiqueta «falsos».

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `back-shop-reviews` | Volver a la ficha | `n_shop` | Sigue explorando. | Puede leer condiciones o protección. | No decidas solo por el recuento de estrellas. | `recent-accounts` | — | sí |
| `go-checkout-reviews` | Ir a pagar: hay muchos comentarios buenos | `n_checkout` | Confía en el canal que vende. | El volumen de elogios no demuestra entrega. | Busca una fuente independiente. | — | `review-volume`, `recent-accounts` | sí |
| `search-opinions-from-reviews` | Buscar opiniones fuera de la tienda | `n_independent` | Sale del anuncio. | Buena práctica. | Compara con lo que dice la ficha. | `own-channel-proof` | — | sí |
| `leave-informed-reviews` | Salir sin pagar. No voy a adelantar este dinero. | `t_safe` | Cierre seguro tras ver los comentarios. No afirma fraude. | Evita adelantar; los elogios del propio sitio no bastan como prueba. | En un caso real, usa canales oficiales tuyos, no este relato. | `recent-accounts`, `review-volume` | — | no |

---

### Nodo `n_terms` — terminal: no

**Superficie:** `store`.  
**Texto:** Pago total por adelantado. Sin devolución. «Gestión de aduana a cargo del cliente».

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `back-shop-terms` | Volver a la ficha | `n_shop` | Ciclo. | Puede ver protección de pago. | El prepago aumenta la exposición. | `prepaid-full` | — | sí |
| `go-checkout-terms` | Aceptar y ir a pagar | `n_checkout` | Acepta prepago. | Leer no equivale a estar protegido. | Comprueba Cartera Simulada. | — | `prepaid-full` | sí |
| `pause-terms` | No pagar todavía | `n_pause` | No paga. | Puede volver. | — | `prepaid-full` | — | sí |
| `leave-informed-terms` | No pagar y terminar tras leer las condiciones | `t_safe` | Cierre informado. | Evita exposición innecesaria; no «prueba» fraude. | Conserva la duda hasta verificar fuera. | `prepaid-full` | — | no |

---

### Nodo `n_protect` — terminal: no

**Superficie:** `pay`.  
**Texto de Cartera Simulada:** «Esta compra no incluye protección si el vendedor no entrega.» No se piden datos bancarios reales.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `go-checkout-unprotected` | Seguir al pago sin esa protección | `n_checkout` | Acepta el riesgo del relato. | Adelantar sin protección deja pocas opciones si no llega. | Aún puedes cancelar en el checkout. | — | `prepaid-full` | sí |
| `back-shop-protect` | Volver a la ficha | `n_shop` | Ciclo. | Puede releer condiciones. | — | `prepaid-full` | — | sí |
| `leave-informed-protect` | No pagar y terminar: no hay protección | `t_safe` | Cierre seguro. | Evitar el adelanto es contención preventiva. | No se afirma que la tienda sea fraude; se evita un riesgo que no aceptas. | `prepaid-full` | — | no |

---

### Nodo `n_checkout` — terminal: no

**Superficie:** `pay`.  
**Situación:** Confirmar un pago **ficticio**. Botones de historia. Sin formularios de tarjeta ni cuentas reales.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pay-610` | Pagar $610 ahora | `n_paid` | En la ficción sale $610. | El pago completo adelantado es el de mayor exposición. | Aún puedes detener un segundo cobro. | — | `prepaid-full` | sí |
| `pay-half` | Pagar $305 ahora y el resto después | `n_half` | En la ficción sale $305. | La mitad también es dinero adelantado. | La tienda puede exigir el resto para «reservar». | — | `prepaid-full` | sí |
| `cancel-checkout` | Volver a la ficha sin pagar | `n_shop` | No paga. | Cancelar es posible hasta confirmar. | Revisa otra vez condiciones o protección. | — | — | sí |
| `stop-checkout` | Salir sin pagar | `n_pause` | No paga. No es `t_safe` (aún no cierra informado). | Puede retomar o irse. | Si ya revisaste, puedes terminar desde la ficha o la protección. | — | — | sí |

---

### Nodo `n_half` — terminal: no

**Superficie:** `pay`.  
**Situación:** «Solo reservamos el iPhone con el pago total.» Ya hay **$305** adelantados. **No** aparece el mensaje de aduana.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pay-rest` | Pagar los $305 restantes (total $610) | `n_paid` | El total pasa a $610. Recién entonces puede haber cobro extra. | Completar el total no garantiza entrega. | El siguiente cobro, si aparece, hay que verificarlo aparte. | — | `prepaid-full` | sí |
| `stop-half` | No enviar más. Quedarme con lo ya pagado en la ficción | `n_recover_half` | En la ficción ya adelantó $305. Pasa a los pasos de contención. No se recupera ese importe. | Haber pagado una parte no obliga a completar. | Contén el daño; no se promete recuperar los $305. | `prepaid-full` | — | no |

---

### Nodo `n_paid` — terminal: no

**Superficie:** `store`.  
**Situación:** «Pago de $610 recibido. Entrega en 7 días.» Quienes llegaron por `pay-610` o por `pay-rest` tienen el **mismo** total. Un solo nodo basta (el motor no necesita distinguir el camino).

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `wait-delivery` | Esperar la fecha de entrega | `n_customs` | Aparece el cobro extra. | La espera no verifica al vendedor. | Si piden más dinero, comprueba el motivo fuera de su chat. | `prepaid-full` | — | sí |

---

### Nodo `n_customs` — terminal: no

**Superficie:** `store` (chat de Lumina).  
**Mensaje:** «El pedido está retenido en aduana. Transfiere $100 para liberarlo.»

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pay-100` | Pagar los $100 | `n_recover_extra` | Total ficción: $610 + $100. | Haber pagado $610 no obliga a pagar otra vez. | Para y verifica; no se promete recuperar. | — | `extra-fee` | no |
| `stop-100` | No pagar los $100 | `n_recover` | Se quedan $610; no el extra. | Contener el segundo cobro es el aprendizaje clave. | Conserva evidencia y usa el canal oficial del medio de pago. | `extra-fee` | — | no |
| `verify-customs` | Comprobar la «aduana» fuera de este chat | `n_verify_customs` | Sale del canal que cobra. | Verificación independiente. | No uses un enlace que te mande la tienda. | `extra-fee`, `own-channel-proof` | — | sí |

---

### Nodo `n_verify_customs` — terminal: no

**Superficie:** `search`.  
**Situación:** Consulta ficticia al «sitio de envíos» **de esta historia**. No hay retención a ese nombre. El silencio o la contradicción **no** legitiman el cobro ni «demuestran» todos los fraudes reales.

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `recover-after-verify` | No pagar los $100 | `n_recover` | $610 adelantados; extra evitado. | Verificar y parar es contención. | Sigue los pasos de recuperación sin esperar milagro. | `extra-fee` | — | no |
| `pay-100-anyway` | Pagar los $100 igual | `n_recover_extra` | $610 + $100. | Verificar y luego pagar igual no cancela el extra. | Aún aplican los pasos de contención. | — | `extra-fee` | no |

---

### Nodo `n_pause` — terminal: no

**Superficie:** `result` (panel de pausa) / continuidad del teléfono.  
**Situación:** No pagar (más). No equivale a «ya es fraude».

| id | Texto | Destino | Consecuencia | Explicación | Recomendación | reconocidas | omitidas | corrige |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `resume-search` | Volver a BuscaYa | `n_search` | Ciclo. | Puede comparar otra vez. | — | — | — | sí |
| `resume-shop` | Abrir la ficha de Lumina Móvil | `n_shop` | Abre la ficha, la haya visitado o no. | Completar la ficha ayuda a decidir. | Desde la ficha puedes terminar informado. | — | — | sí |
| `leave-paused` | Salir sin pagar y sin terminar de verificar | `t_paused` | Cierre intermedio. | Pausar evitó un pago; no completó la comprobación. | Si vuelves a un anuncio real, verifica fuera de este ejercicio. | — | — | no |

---

### Nodos de recuperación — terminal: no

**Superficie:** `result` (consejo previo al cierre).  
Mismo paquete, distinto marco de importes:

1. No envíes más dinero por el chat de la tienda.  
2. Conserva conversaciones y comprobantes **ficticios** de este ejercicio.  
3. Contacta **Cartera Simulada** por el canal que **tú** ya tenías como oficial en la historia, no por un enlace de Lumina.  
4. Valora denunciar por las vías de tu entorno real **sin usar este relato como prueba**.  
5. **No se garantiza** recuperar el dinero.

| Nodo | Marco | Única opción | Destino |
| --- | --- | --- | --- |
| `n_recover` | En la ficción se pagaron $610 y no los $100 | `ack-recover` — Entendido | `t_recover` |
| `n_recover_extra` | Se pagaron $610 y $100. En la ficción la tienda «cierra» y desaparece el logotipo | `ack-recover-extra` — Entendido | `t_paid_extra` |
| `n_recover_half` | Se pagaron $305 y no el resto ni el extra | `ack-recover-half` — Entendido | `t_half_stop` |

---

### Terminales — `options: []`

**Superficie:** `result`. Aviso de ficción. Sin promesa de reembolso.

#### `t_safe`

{{learner}}, {{shopperName}} no adelantó dinero a Lumina Móvil. Revisó la tienda o las condiciones de pago y eligió no exponerse. Eso **no prueba** que la tienda sea fraude: evita un riesgo que no pudo verificar. En un caso real, usa tus propios canales oficiales.

#### `t_known`

{{shopperName}} eligió CasaTec **de esta ficción** ($1.190) y no persiguió los $610. CasaTec no es un comercio real ni una garantía del mundo real. El aprendizaje: no hace falta perseguir el precio más bajo.

#### `t_paused`

Salió sin pagar y sin terminar de verificar. Pausar evitó un adelanto. El siguiente paso útil, fuera de este ejercicio, es comparar vendedor, opiniones independientes y protección de pago.

#### `t_price_reject`

Descartó la oferta **solo** porque $610 es más barato que $1.190. Un precio bajo no demuestra fraude. Un precio alto no demuestra legitimidad. La práctica útil es verificar, no usar el precio como veredicto.

#### `t_recover`

Pagó **$610**. No pagó los **$100**. Pasos de contención (arriba). Sin promesa de recuperar los $610.

#### `t_paid_extra`

Pagó **$610 + $100**. En la ficción la tienda desaparece (`store-vanish`). Mismos pasos. Sin promesa de recuperar $710.

#### `t_half_stop`

Pagó **$305**. No completó los $610 ni pagó $100. Mismos pasos sobre **$305**. Este cierre **no** dice que pagó $610.

---

## 9. Rutas principales

| Ruta | Superficies | Pagos | Final |
| --- | --- | --- | --- |
| Investigar y no pagar | buscador + muro + tienda (reseñas, condiciones y/o protección) | $0 | `t_safe` |
| CasaTec | buscador + ficha CasaTec | $0 a Lumina | `t_known` |
| Rechazo por precio | buscador (a veces nota) | $0 | `t_price_reject` |
| Pausa | las que haya abierto | $0 | `t_paused` |
| Pago total, para en aduana | + tienda + pago | $610 | `t_recover` |
| Pago total + $100 | + aduana | $710 | `t_paid_extra` |
| Mitad y para | checkout parcial | $305 | `t_half_stop` |
| Mitad + resto + para en aduana | | $610 | `t_recover` |
| Mitad + resto + $100 | | $710 | `t_paid_extra` |

**Salidas tempranas justificadas**

- `t_known`: eligió no entrar a Lumina.  
- `t_price_reject`: heurística de precio (opción D del contexto de producto). El cierre corrige esa heurística.  
- `t_paused`: no completó la investigación.

**Mínimos del plan maestro:** comprar; investigar; verificar protección; pagar o no los $100 — cubiertos.

---

## 10. Tabla de finales, cantidades y contención

| Final | A Lumina | Extra $100 | Contención | Reembolso |
| --- | --- | --- | --- | --- |
| `t_safe` | $0 | no | No adelantó | no aplica |
| `t_known` | $0 | no | Eligió otra opción de la ficción | no aplica |
| `t_paused` | $0 | no | Pausó sin verificar del todo | no aplica |
| `t_price_reject` | $0 | no | Heurística de precio (a corregir en el texto) | no aplica |
| `t_recover` | $610 | no | No más pagos; evidencia; canal oficial ficticio | **no se promete** |
| `t_paid_extra` | $610 | sí ($100) | Igual; tienda desaparece en la ficción | **no se promete** |
| `t_half_stop` | $305 | no | No completar ni pagar extra | **no se promete** |

---

## 11. Reglas de personalización

Puede cambiar: `learner`, `shopperName` y redacción de situación/pregunta/etiquetas visibles.

No puede cambiar: ids de nodos u opciones; destinos; conjunto de opciones de un nodo; señales; condiciones de finales; importes; resultados evaluativos.

El elenco no se persiste en esta versión.

---

## 12. Privacidad y seguridad

- Identidades, empresas y pagos **inventados**.  
- No pedir credenciales, contraseñas, datos bancarios ni información personal real.  
- No almacenar datos personales como requisito.  
- No inducir a visitar páginas sospechosas reales ni a pagar fuera de la simulación.  
- Aviso de ficción visible.  
- Compatible con `ScenarioDefinition`: cada opción lleva `nextNodeId`; el cliente no elige el destino.  
- Superficies nuevas = mapa de presentación (como «Mensajes» en A). No exigen cambiar `choose` ni `choiceGate`.  
- Puntos oficiales: no se definen. Si al implementar hace falta un valor técnico de esquema, usar ceros no oficiales (como A), no D3.

---

## 13. Decisiones pendientes e implicaciones

| # | Estado | ¿Afecta este borrador? |
| --- | --- | --- |
| D1 | Pendiente | No. El relato cabe en grafo embebido en memoria, como A. |
| D2 | Pendiente | No para redactar. Sí para persistir sesión o elenco. |
| D3 | Pendiente | No se asignan puntos ni umbrales. |
| D4 | Aprobada (guion A) | No cambia B. |
| **D5** | **Aprobada (2026-10-10)** | Guion narrativo de este archivo. **No** autoriza implementar B. |
| D6 | Pendiente | Nombres del equipo; no el relato. |
| D7 | Pendiente | Paleta de BuscaYa/Muro/Lumina al implementar UI. |
| D8 | Hecho en la práctica (hay Git) | No el relato. El plan no las declara cerradas aquí. |
| D9 | Pendiente | Linkly; no el producto B. |

**Decisiones incluidas en D5** (detalle en la sección 15): ids; salidas `leave-informed-*` (tienda, reseñas, condiciones, protección) → `t_safe`; sin compra desde el perfil; CasaTec y rechazo por precio como finales sin Lumina; $100 solo tras $610; elenco temporal; marcas ficticias; sin puntos oficiales.

---

## 14. Lista de verificación de coherencia

Comprobada de forma documental sobre **este** texto:

- [x] IDs de nodo únicos.  
- [x] IDs de opción únicos en el documento.  
- [x] Todo destino de opción existe como nodo.  
- [x] Terminales con `options: []`.  
- [x] No terminales con al menos una opción y salida.  
- [x] Ciclos (`search` ↔ `casatec` / `profile` / `shop` / `pause`) con salida (pagar, `t_safe`, `t_known`, `t_price_reject`, `t_paused`).  
- [x] $305 solo en `n_half` / `n_recover_half` / `t_half_stop`.  
- [x] $610 en `n_paid` y ramas posteriores.  
- [x] $100 solo desde `n_customs` / `n_verify_customs` hacia `n_recover_extra`.  
- [x] No hay `n_half` → `n_customs`.  
- [x] Perfil no salta a checkout.  
- [x] `t_safe` desde tienda, reseñas, condiciones y protección.  
- [x] CasaTec no exige Lumina.  
- [x] Precio bajo no se afirma como prueba de fraude.  
- [x] Ningún final promete reembolso.  
- [x] Personalización solo en textos.  
- [x] Compatible con `ScenarioDefinition` + presentación aparte.  
- [x] D1, D2, D3 y D6–D9 no se marcan aprobadas. D5 está firmada en la sección 15.

`resume-shop` abre la ficha de Lumina Móvil (la haya visitado o no). Una sola pausa; no se duplica el nodo.

---

## 15. Registro de aprobación D5

**D5 aprobada el 2026-10-10** por el propietario del producto, al autorizar la Fase 06.3 (ajustes editoriales y firma documental).

**Alcance.** Guion narrativo de la Simulación B (`tienda-iphone`): nodos, opciones, destinos, textos, feedback, finales y reglas pedagógicas de este archivo. No incluye implementación, motor, puntuación oficial ni persistencia de elenco.

**Decisiones incluidas en esta firma**

1. Se conservan los identificadores de nodos y opciones de este archivo, incluido `leave-informed-reviews`.  
2. Las salidas `leave-informed-*` desde tienda, reseñas, condiciones y protección llegan a `t_safe`. Detenerse no se presenta como prueba de fraude.  
3. No existe compra directa desde el perfil: el perfil abre la ficha de Lumina Móvil.  
4. CasaTec (`t_known`) es un final válido **dentro de esta ficción**, sin entrar a Lumina.  
5. El rechazo temprano por precio (`t_price_reject`) es un final válido. El cierre enseña que el precio no demuestra fraude ni legitimidad.  
6. El cobro extra de $100 solo aparece después de un total de $610. El pago parcial de $305 tiene contención y cierre propios.  
7. Elenco temporal: `learner` y `shopperName` (predeterminado María). No se persiste. No altera ids, destinos ni finales.  
8. Etiquetas visibles: BuscaYa, Muro, Lumina Móvil, CasaTec, Cartera Simulada.  
9. No se aprueban puntos, ponderaciones, umbrales ni calificación. D3 sigue pendiente.  
10. Se conserva el tono no culpabilizante, el aviso de ficción y la ausencia de promesa de reembolso.

**Fuera de esta aprobación:** D1, D2, D3, D6–D9; implementación de B; cambios de código; Convex; deploy.
