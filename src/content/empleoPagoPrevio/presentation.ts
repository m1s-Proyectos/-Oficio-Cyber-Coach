import type { PreventionPresentation } from '../preventionTypes';

export type { PreventionPresentation };

export const EMPLEO_PAGO_PREVIO_PRESENTATION: Readonly<Record<string, PreventionPresentation>> = {
  n_inbox: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '09:18',
    subtitle: 'Bandeja',
    from: 'reclutamiento@global-talent-express.com',
    subject: '¡Felicidades! Seleccionado para Asistente Remoto',
  },
  n_offer: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '09:18',
    subtitle: 'Mensaje',
    from: 'reclutamiento@global-talent-express.com',
    subject: '¡Felicidades! Seleccionado para Asistente Remoto',
  },
  n_distract: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '09:20',
    subtitle: 'Releer',
    from: 'reclutamiento@global-talent-express.com',
    subject: '¡Felicidades! Seleccionado para Asistente Remoto',
  },
  n_check: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '09:21',
    subtitle: 'Señal detectada',
    from: 'reclutamiento@global-talent-express.com',
    subject: '¡Felicidades! Seleccionado para Asistente Remoto',
  },
  n_research: {
    surface: 'email',
    appLabel: 'Muro Profesional',
    time: '09:24',
    subtitle: 'Búsqueda independiente',
  },
  t_safe: {
    surface: 'result',
    appLabel: 'Correo Simulado',
    time: '09:25',
    subtitle: 'Cierre educativo',
  },
  t_paid: {
    surface: 'result',
    appLabel: 'Correo Simulado',
    time: '09:25',
    subtitle: 'Cierre educativo',
  },
};
