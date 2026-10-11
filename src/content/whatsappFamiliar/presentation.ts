export type PhoneSurface = 'notification' | 'messenger' | 'result';

export type ThreadKind =
  'lock' | 'suspect' | 'call' | 'other' | 'pause' | 'block' | 'recover' | 'close';

export interface NodePresentation {
  surface: PhoneSurface;
  thread: ThreadKind;
  /** Etiqueta visible de la app ficticia. No es un tipo del motor. */
  appLabel: 'Mensajes';
  time: string;
}

const M = (thread: ThreadKind, surface: PhoneSurface = 'messenger'): NodePresentation => ({
  surface,
  thread,
  appLabel: 'Mensajes',
  time: '10:42',
});

export const WHATSAPP_FAMILIAR_PRESENTATION: Readonly<Record<string, NodePresentation>> = {
  n_notify: M('lock', 'notification'),
  n_ask200: M('suspect'),
  n_chat: M('suspect'),
  n_call: M('call'),
  n_other: M('other'),
  n_after_200: M('suspect'),
  n_call_after_pay: M('call'),
  n_other_after_pay: M('other'),
  n_pause: M('pause'),
  n_block: M('block'),
  n_recover: M('recover'),
  n_recover_twice: M('recover'),
  t_safe: M('close', 'result'),
  t_paused: M('pause', 'result'),
  t_blocked: M('block', 'result'),
  t_recover: M('recover', 'result'),
  t_paid_twice: M('recover', 'result'),
};
