export interface QuickChallenge {
  id: string;
  title: string;
  category: string;
  path: string;
  difficulty: string;
  minutes: number;
  intro: string;
  scene: { type: string; sender: string; detail?: string; subject?: string; body: string; footer: string };
  question: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  signs: string[];
  actions: string[];
  hints: string[];
  takeaway: string;
  tags: string[];
}

export const paths = [
  { id: 'daily', title: 'Estafas del día a día', description: 'Mensajes, compras y ofertas que merecen una segunda mirada.', icon: 'messages', color: 'mint', count: 5 },
  { id: 'work', title: 'Engaños en el trabajo', description: 'Protege pagos, cuentas y procesos de tu organización.', icon: 'briefcase', color: 'yellow', count: 2 },
  { id: 'digital', title: 'Trampas digitales', description: 'Reconoce páginas e instrucciones que intentan engañarte.', icon: 'shield', color: 'lavender', count: 1 }
] as const;

export const challenges: QuickChallenge[] = [
  {
    id: 'package', title: 'El paquete retenido', category: 'Estafas cotidianas', path: 'daily', difficulty: 'Fácil', minutes: 3,
    intro: 'Te llega un mensaje inesperado sobre una entrega.',
    scene: { type: 'sms', sender: 'Avisos de entrega', detail: 'Mensaje recibido · 9:41 a. m.', body: 'Tu paquete está retenido. Paga una pequeña tarifa hoy para recibirlo. Confirma tus datos en el enlace.', footer: 'Este mensaje es una simulación educativa.' },
    question: '¿Qué harías antes de pagar?',
    options: [
      { id: 'a', text: 'Abrir el enlace y completar los datos para no perder el paquete.' },
      { id: 'b', text: 'Buscar el sitio oficial del servicio y consultar el envío por separado.' },
      { id: 'c', text: 'Responder al mensaje y pedir que demuestren que es legítimo.' }
    ],
    correct: 'b',
    explanation: 'La urgencia, el pago inesperado y el enlace no verificado son motivos para detenerse. Comprueba el envío mediante una aplicación o página oficial que busques por tu cuenta.',
    signs: ['Te presionan para actuar hoy.', 'Piden un pago inesperado.', 'No has verificado el enlace.'],
    actions: ['No abras el enlace del mensaje.', 'Consulta el envío desde el canal oficial.', 'Si ya pagaste, contacta a tu banco por un canal oficial.'],
    hints: ['Fíjate en qué te pide hacer el mensaje antes de verificar quién lo envió.', 'Puedes comprobar un envío sin usar el enlace que te mandaron.'],
    takeaway: 'Verifica por un canal independiente antes de pagar o compartir datos.',
    tags: ['Urgencia artificial', 'Enlace no verificado', 'Solicitud de dinero']
  },
  {
    id: 'job', title: 'El empleo que exige un pago', category: 'Estafas cotidianas', path: 'daily', difficulty: 'Fácil', minutes: 3,
    intro: 'Una oferta de trabajo parece demasiado buena para dejarla pasar.',
    scene: { type: 'chat', sender: 'Reclutamiento · mensaje ficticio', detail: 'Oferta de empleo', body: '¡Felicidades! Has sido seleccionado. Para reservar tu plaza, paga hoy una cuota de inscripción y capacitación.', footer: 'Ejemplo ficticio. No representa una empresa real.' },
    question: '¿Qué señal merece mayor atención?',
    options: [
      { id: 'a', text: 'La empresa ofrece un salario superior al promedio.' },
      { id: 'b', text: 'Piden dinero por adelantado para garantizar el empleo.' },
      { id: 'c', text: 'La entrevista se realiza por videollamada.' }
    ],
    correct: 'b',
    explanation: 'Pedir dinero por adelantado para asegurar una plaza es una señal de alerta. Verifica la identidad de la empresa por vías independientes y no pagues solo por una promesa.',
    signs: ['Pago anticipado para conseguir el empleo.', 'Presión para pagar hoy.', 'No se ha verificado la identidad de la empresa.'],
    actions: ['Investiga la empresa desde una fuente independiente.', 'No envíes dinero ni documentos sensibles por presión.', 'Consulta a alguien de confianza si tienes dudas.'],
    hints: ['No te centres solo en el salario: observa qué te piden hacer.', 'Una oportunidad laboral no debería depender de un pago urgente sin verificar.'],
    takeaway: 'Una promesa atractiva no sustituye la verificación.',
    tags: ['Solicitud de dinero', 'Urgencia artificial', 'Suplantación de identidad']
  },
  {
    id: 'family', title: 'Un familiar en apuros', category: 'Estafas cotidianas', path: 'daily', difficulty: 'Fácil', minutes: 4,
    intro: 'Recibes un mensaje urgente de alguien que afirma ser de tu familia.',
    scene: { type: 'chat', sender: 'Contacto desconocido', detail: 'Mensaje recibido · ahora', body: 'Estoy en un problema y necesito que me transfieras dinero ya. No me llames, luego te explico. Por favor, es urgente.', footer: 'Situación ficticia para practicar.' },
    question: '¿Cómo puedes comprobar la solicitud?',
    options: [
      { id: 'a', text: 'Transferir el dinero porque parece una emergencia.' },
      { id: 'b', text: 'Pedir un dato personal en el mismo chat y confiar si responde.' },
      { id: 'c', text: 'Contactar al familiar en un número conocido o verificar con otra persona de confianza.' }
    ],
    correct: 'c',
    explanation: 'La urgencia y la petición de secreto pueden usarse para impedir que pienses con calma. Confirma la identidad mediante un canal que ya conozcas, no solo en el chat que inició la petición.',
    signs: ['Urgencia intensa.', 'Te piden que no llames.', 'La identidad aún no se ha confirmado.'],
    actions: ['Llama al número que ya tenías guardado.', 'Consulta con otra persona de confianza.', 'No transfieras dinero hasta verificar.'],
    hints: ['Piensa cómo comprobarías la identidad si el chat no fuera confiable.', 'Usa un canal que no dependa del mensaje que recibiste.'],
    takeaway: 'Ante una emergencia inesperada, confirma la identidad por otra vía.',
    tags: ['Presión emocional', 'Suplantación de identidad', 'Urgencia artificial']
  },
  {
    id: 'boss', title: 'El mensaje del supuesto jefe', category: 'Engaños en el trabajo', path: 'work', difficulty: 'Intermedio', minutes: 4,
    intro: 'Un mensaje parece venir de una persona con autoridad en tu trabajo.',
    scene: { type: 'email', sender: 'Dirección · nombre mostrado no verificado', subject: 'Urgente: compra antes de la reunión', body: 'Necesito que compres tarjetas de regalo y me envíes los códigos antes de la reunión. No hay tiempo para llamadas.', footer: 'Correo ficticio de entrenamiento.' },
    question: '¿Cuál es la respuesta más segura?',
    options: [
      { id: 'a', text: 'Cumplir rápido porque parece una instrucción de un superior.' },
      { id: 'b', text: 'Confirmar la petición por un canal corporativo independiente y seguir el procedimiento.' },
      { id: 'c', text: 'Responder a ese mismo correo preguntando si realmente es tu jefe.' }
    ],
    correct: 'b',
    explanation: 'El nombre mostrado en un mensaje no demuestra la identidad del remitente. Las solicitudes inusuales de dinero o códigos deben verificarse mediante un canal conocido y seguir los procedimientos de la organización.',
    signs: ['Autoridad aparente.', 'Urgencia y secreto.', 'Petición inusual de valor económico.'],
    actions: ['Confirma la solicitud por un canal corporativo conocido.', 'No envíes códigos ni datos de pago.', 'Sigue el proceso de autorización de tu organización.'],
    hints: ['Un nombre familiar en pantalla no confirma quién escribió.', 'La verificación debe usar un canal distinto al mensaje sospechoso.'],
    takeaway: 'La urgencia de una persona con autoridad no elimina la necesidad de verificar.',
    tags: ['Autoridad aparente', 'Urgencia artificial', 'Solicitud de dinero']
  },
  {
    id: 'invoice', title: 'La factura modificada', category: 'Engaños en el trabajo', path: 'work', difficulty: 'Intermedio', minutes: 4,
    intro: 'Una factura conocida llega con nuevos datos bancarios y pide pago hoy.',
    scene: { type: 'email', sender: 'Proveedor · remitente no verificado', subject: 'Actualización de cuenta bancaria', body: 'Hemos cambiado nuestra cuenta. Por favor, realiza el pago a los nuevos datos que aparecen adjuntos antes de finalizar el día.', footer: 'Factura y proveedor completamente ficticios.' },
    question: '¿Qué debes hacer antes de autorizar el pago?',
    options: [
      { id: 'a', text: 'Pagar si el nombre del proveedor coincide.' },
      { id: 'b', text: 'Responder al mismo correo para confirmar los datos.' },
      { id: 'c', text: 'Verificar el cambio con un contacto previamente conocido y seguir el proceso financiero.' }
    ],
    correct: 'c',
    explanation: 'Un cambio inesperado de cuenta bancaria debe verificarse de forma independiente. Si alguien controla el correo, responder al mismo hilo no confirma que los datos sean legítimos.',
    signs: ['Cambio inesperado de datos bancarios.', 'Solicitud de pago urgente.', 'La identidad del remitente no está verificada.'],
    actions: ['Usa un número o contacto previamente registrado.', 'Sigue el proceso interno de aprobación.', 'No uses los nuevos datos hasta confirmar el cambio.'],
    hints: ['Piensa qué ocurriría si alguien hubiera tomado control del correo.', 'No uses el mismo canal cuestionado para verificarlo.'],
    takeaway: 'Los cambios de pago se verifican antes de transferir, no después.',
    tags: ['Cambio de procedimiento', 'Solicitud de dinero', 'Suplantación de identidad']
  },
  {
    id: 'captcha', title: 'El CAPTCHA sospechoso', category: 'Trampas digitales', path: 'digital', difficulty: 'Intermedio', minutes: 4,
    intro: 'Una página dice que necesita comprobar que eres una persona.',
    scene: { type: 'browser', sender: 'Verificación del navegador', subject: 'Un paso más para continuar', body: 'Para completar la verificación, copia una instrucción y pégala en la ventana de comandos de tu equipo.', footer: 'Simulación segura. No hay comandos ejecutables ni enlaces externos.' },
    question: '¿Qué harías?',
    options: [
      { id: 'a', text: 'Ejecutar la instrucción porque la página necesita verificar que soy humano.' },
      { id: 'b', text: 'No ejecutar comandos desconocidos y verificar el sitio por una vía confiable.' },
      { id: 'c', text: 'Ejecutarla si el diseño de la página parece profesional.' }
    ],
    correct: 'b',
    explanation: 'Un CAPTCHA común no necesita que una persona copie comandos desconocidos en una terminal. ClickFix es una técnica de engaño en la que una página induce al usuario a ejecutar instrucciones potencialmente peligrosas.',
    signs: ['La página pide una acción técnica inusual.', 'Solicita pegar instrucciones en una terminal.', 'El diseño profesional no demuestra que sea segura.'],
    actions: ['No copies ni ejecutes la instrucción.', 'Abandona la página si sospechas del engaño.', 'Accede al servicio escribiendo su dirección oficial por tu cuenta.'],
    hints: ['Pregúntate si una verificación normal necesita controlar tu terminal.', 'Una apariencia convincente no hace segura una instrucción desconocida.'],
    takeaway: 'Nunca ejecutes instrucciones desconocidas solo porque una página te lo pide.',
    tags: ['Instrucción técnica sospechosa', 'Suplantación de identidad']
  },
  {
    id: 'code', title: 'El código de verificación', category: 'Estafas cotidianas', path: 'daily', difficulty: 'Fácil', minutes: 3,
    intro: 'Alguien que dice ser soporte técnico te llama inesperadamente.',
    scene: { type: 'chat', sender: 'Supuesto soporte', detail: 'Llamada entrante · ejemplo ficticio', body: 'Para resolver el problema de tu cuenta, dime el código de verificación que acabas de recibir. Soy del equipo de soporte.', footer: 'No introduzcas códigos reales en esta aplicación.' },
    question: '¿Qué debes hacer con el código?',
    options: [
      { id: 'a', text: 'Compartirlo si el interlocutor conoce mi nombre.' },
      { id: 'b', text: 'Compartirlo si la llamada parece profesional.' },
      { id: 'c', text: 'No compartirlo y contactar al servicio por sus canales oficiales si tengo dudas.' }
    ],
    correct: 'c',
    explanation: 'Los códigos pueden permitir acceder a una cuenta o autorizar operaciones. No los compartas con quien te contacta inesperadamente. Si existe un problema, inicia tú el contacto con el servicio oficial.',
    signs: ['El contacto fue inesperado.', 'Pide un código que llegó a tu dispositivo.', 'Su identidad no se ha comprobado.'],
    actions: ['No compartas el código.', 'Finaliza la comunicación si te presionan.', 'Revisa la cuenta desde la aplicación o sitio oficial.'],
    hints: ['Piensa para qué podría servirle ese código a otra persona.', 'Tú puedes iniciar el contacto con el servicio en vez de confiar en la llamada.'],
    takeaway: 'Los códigos de verificación son privados: no los compartas con quien te contacta.',
    tags: ['Solicitud de información sensible', 'Suplantación de identidad']
  },
  {
    id: 'investment', title: 'La inversión perfecta', category: 'Estafas cotidianas', path: 'daily', difficulty: 'Intermedio', minutes: 4,
    intro: 'Una publicación promete ganancias rápidas y garantizadas.',
    scene: { type: 'social', sender: 'Oportunidad de inversión · ejemplo ficticio', detail: 'Publicación patrocinada simulada', body: 'Duplica tu dinero en pocos días. Ganancias garantizadas. Solo quedan unos minutos para entrar. Mira los testimonios de quienes ya ganaron.', footer: 'No es una oferta real ni una recomendación financiera.' },
    question: '¿Qué debería hacerte detenerte a investigar?',
    options: [
      { id: 'a', text: 'La promesa de ganancias garantizadas junto con presión para invertir rápido.' },
      { id: 'b', text: 'El uso de gráficos profesionales.' },
      { id: 'c', text: 'Que otras personas comenten que ganaron dinero.' }
    ],
    correct: 'a',
    explanation: 'Las ganancias garantizadas, la presión temporal y los testimonios difíciles de verificar son señales de alerta. No prueban por sí solas que algo sea fraudulento, pero justifican investigar de forma independiente y actuar con prudencia.',
    signs: ['Promesas extraordinarias.', 'Presión para decidir de inmediato.', 'Testimonios que podrían ser difíciles de verificar.'],
    actions: ['No transfieras dinero por presión.', 'Comprueba quién ofrece la inversión y si está autorizado.', 'Busca información independiente y desconfía de las garantías de ganancias.'],
    hints: ['Fíjate en la promesa y en cuánto tiempo te dan para decidir.', 'Un gráfico o testimonio no demuestra que una inversión sea legítima.'],
    takeaway: 'No existe una ganancia garantizada solo porque una publicación lo afirme.',
    tags: ['Urgencia artificial', 'Promesa extraordinaria', 'Presión emocional']
  }
]