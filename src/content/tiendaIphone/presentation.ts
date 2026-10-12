export type ShopSurface = 'search' | 'social' | 'store' | 'pay' | 'result';

export type ShopThread =
  | 'home'
  | 'results'
  | 'note'
  | 'casatec'
  | 'profile'
  | 'shop'
  | 'reviews'
  | 'terms'
  | 'protect'
  | 'checkout'
  | 'half'
  | 'paid'
  | 'customs'
  | 'verify'
  | 'pause'
  | 'recover'
  | 'close';

export interface ShopNodePresentation {
  surface: ShopSurface;
  thread: ShopThread;
  appLabel: string;
  time: string;
}

const TIME = '16:10';

function P(surface: ShopSurface, thread: ShopThread, appLabel: string): ShopNodePresentation {
  return { surface, thread, appLabel, time: TIME };
}

export const TIENDA_IPHONE_PRESENTATION: Readonly<Record<string, ShopNodePresentation>> = {
  n_home: P('search', 'home', 'BuscaYa'),
  n_search: P('search', 'results', 'BuscaYa'),
  n_compare: P('search', 'note', 'BuscaYa'),
  n_independent: P('search', 'results', 'BuscaYa'),
  n_verify_customs: P('search', 'verify', 'BuscaYa'),
  n_profile: P('social', 'profile', 'Muro'),
  n_casatec: P('store', 'casatec', 'CasaTec'),
  n_shop: P('store', 'shop', 'Lumina Móvil'),
  n_reviews: P('store', 'reviews', 'Lumina Móvil'),
  n_terms: P('store', 'terms', 'Lumina Móvil'),
  n_paid: P('store', 'paid', 'Lumina Móvil'),
  n_customs: P('store', 'customs', 'Lumina Móvil'),
  n_protect: P('pay', 'protect', 'Cartera Simulada'),
  n_checkout: P('pay', 'checkout', 'Cartera Simulada'),
  n_half: P('pay', 'half', 'Cartera Simulada'),
  n_pause: P('result', 'pause', 'Pausa'),
  n_recover: P('result', 'recover', 'Después del pago'),
  n_recover_extra: P('result', 'recover', 'Después del pago'),
  n_recover_half: P('result', 'recover', 'Después del pago'),
  t_safe: P('result', 'close', 'Cierre'),
  t_known: P('result', 'close', 'Cierre'),
  t_paused: P('result', 'close', 'Cierre'),
  t_price_reject: P('result', 'close', 'Cierre'),
  t_recover: P('result', 'close', 'Cierre'),
  t_paid_extra: P('result', 'close', 'Cierre'),
  t_half_stop: P('result', 'close', 'Cierre'),
};
