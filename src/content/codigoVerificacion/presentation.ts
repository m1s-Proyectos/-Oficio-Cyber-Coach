import type { PreventionPresentation } from '../empleoPagoPrevio/presentation';

export const CODIGO_VERIFICACION_PRESENTATION: Readonly<Record<string, PreventionPresentation>> = {
  n_ring: {
    surface: 'call',
    appLabel: 'Teléfono',
    time: '14:15',
    subtitle: 'Llamada entrante',
    caller: 'Soporte Técnico de Banco',
  },
  n_call: {
    surface: 'call',
    appLabel: 'Teléfono',
    time: '14:15',
    subtitle: 'En curso',
    caller: 'Soporte Técnico de Banco',
  },
  n_sms: {
    surface: 'sms',
    appLabel: 'Mensajes',
    time: '14:15',
    subtitle: 'Caja Norte · SMS',
    smsCode: '482193',
  },
  n_after_hang: {
    surface: 'sms',
    appLabel: 'Mensajes',
    time: '14:16',
    subtitle: 'Después de colgar',
    smsCode: '482193',
  },
  t_safe: {
    surface: 'result',
    appLabel: 'Teléfono',
    time: '14:18',
    subtitle: 'Cierre educativo',
  },
  t_leaked: {
    surface: 'result',
    appLabel: 'Teléfono',
    time: '14:18',
    subtitle: 'Cierre educativo',
  },
};
