import type { PreventionPresentation } from '../preventionTypes';

export const SUPUESTO_JEFE_PRESENTATION: Readonly<Record<string, PreventionPresentation>> = {
  n_inbox: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '13:10',
    subtitle: 'Bandeja',
    from: 'director.ejecutivo.corp@gmail.com',
    subject: 'URGENTE: Solicitud confidencial de tarjetas de regalo',
  },
  n_request: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '13:10',
    subtitle: 'Mensaje',
    from: 'director.ejecutivo.corp@gmail.com',
    subject: 'URGENTE: Solicitud confidencial de tarjetas de regalo',
  },
  n_negotiate: {
    surface: 'email',
    appLabel: 'Correo Simulado',
    time: '13:22',
    subtitle: 'Respuesta',
    from: 'director.ejecutivo.corp@gmail.com',
    subject: 'Re: URGENTE: Solicitud confidencial de tarjetas de regalo',
  },
  n_verify: {
    surface: 'email',
    appLabel: 'Canal Oficina',
    time: '13:25',
    subtitle: 'Canal interno conocido',
  },
  t_safe: {
    surface: 'result',
    appLabel: 'Canal Oficina',
    time: '13:28',
    subtitle: 'Cierre educativo',
  },
  t_bought: {
    surface: 'result',
    appLabel: 'Correo Simulado',
    time: '13:28',
    subtitle: 'Cierre educativo',
  },
};
