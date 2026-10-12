export const SEARCH_LOAD_MS = 420;
export const COMMENTS_REVEAL_MS = 280;

export type SearchQueryId = 'cheap' | 'official' | 'deals';
export type BrowseScreen =
  'empty' | 'loading' | 'results' | 'facebook' | 'official' | 'compare' | 'decided';

export interface SearchQuery {
  id: SearchQueryId;
  label: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  source: string;
  kind: 'facebook' | 'official' | 'compare' | 'listing';
}

export interface SimulatedComment {
  author: string;
  text: string;
}

export const SEARCH_QUERIES: readonly SearchQuery[] = [
  { id: 'cheap', label: 'iPhones baratos en El Salvador' },
  { id: 'official', label: 'Tiendas oficiales de iPhone' },
  { id: 'deals', label: 'Gangas de iPhones en El Salvador' },
];

export const RESULTS_BY_QUERY: Readonly<Record<SearchQueryId, readonly SearchResult[]>> = {
  cheap: [
    {
      id: 'compare-note',
      title: 'Cómo comparar un iPhone usado o de oferta',
      description: 'Lista de esta historia: precio de referencia, vendedor y canal de pago.',
      source: 'guiasim.local · nota educativa',
      kind: 'compare',
    },
    {
      id: 'market-list',
      title: 'iPhone 14 · varias publicaciones',
      description: 'Anuncios mixtos entre $580 y $1.050. Ninguno se presenta como tienda real.',
      source: 'tablon-sim.local · listado',
      kind: 'listing',
    },
    {
      id: 'casatec-ref',
      title: 'CasaTec · iPhone 14 · $1.190',
      description: 'Precio de referencia de este ejercicio. Comercio ficticio de la historia.',
      source: 'casatec-sim.local · ficha',
      kind: 'official',
    },
  ],
  official: [
    {
      id: 'casatec-store',
      title: 'CasaTec · iPhone 14 · $1.190',
      description: 'Retiro en comercio de la ficción. Perfil con más de un año en este relato.',
      source: 'casatec-sim.local · verificado en el ejercicio',
      kind: 'official',
    },
    {
      id: 'ref-price',
      title: 'Precio de referencia en tiendas conocidas de la historia',
      description: 'Cerca de $1.190. Sirve para comparar, no como prueba de un anuncio.',
      source: 'guiasim.local · referencia',
      kind: 'compare',
    },
    {
      id: 'official-note',
      title: 'Señales de verificabilidad en esta historia',
      description: 'Canal propio, condiciones visibles y medio de pago que ya conocías.',
      source: 'guiasim.local · nota',
      kind: 'compare',
    },
  ],
  deals: [
    {
      id: 'lumina-fb',
      title: 'Lumina Móvil vende iPhone 14 · $610',
      description: 'Publicación comercial. Entrega en 7 días. Perfil reciente de esta ficción.',
      source: 'Muro simulado · publicación comercial',
      kind: 'facebook',
    },
    {
      id: 'deal-list',
      title: 'Otras gangas de iPhone 14',
      description: 'Precios entre $490 y $700. Dominios de juguete. No son comercios reales.',
      source: 'ofertas-sim.local · listado',
      kind: 'listing',
    },
    {
      id: 'deal-compare',
      title: 'Por qué un precio muy bajo pide más preguntas',
      description: 'Nota de esta historia. No dice que un anuncio sea fraude.',
      source: 'guiasim.local · nota',
      kind: 'compare',
    },
  ],
};

export const FACEBOOK_COMMENTS: readonly SimulatedComment[] = [
  { author: 'Karla G.', text: 'Me llegó ayer. Tal como en las fotos. 10/10.' },
  { author: 'Luis M.', text: 'Le compré a Lumina y me lo entregaron en una semana. Recomendado.' },
  { author: 'Andrea P.', text: 'Pensé que era mentira por el precio. Sí era original. Gracias!' },
];

export const FACEBOOK_CAPTION =
  'iPhone 14 liberado. Últimas 4 unidades. $610 con envío. Escribe ya, se van hoy.';

export type ImmersiveDecision = 'risk' | 'suspect' | 'leave';

export interface DecisionChoice {
  intent: ImmersiveDecision;
  label: string;
  optionId: string;
}

export function decisionsForScreen(screen: BrowseScreen): readonly DecisionChoice[] {
  if (screen === 'facebook') {
    return [
      { intent: 'risk', label: 'Estoy dispuesto a comprarlo', optionId: 'open-shop' },
      {
        intent: 'suspect',
        label: 'Es demasiado bueno para ser verdad',
        optionId: 'search-opinions',
      },
      {
        intent: 'leave',
        label: 'Me es indiferente; salgo de la página del vendedor',
        optionId: 'back-search-profile',
      },
    ];
  }
  if (screen === 'official') {
    return [
      { intent: 'risk', label: 'Estoy dispuesto a comprarlo aquí', optionId: 'buy-casatec' },
      {
        intent: 'suspect',
        label: 'Es demasiado bueno para ser verdad · quiero ver la oferta de $610',
        optionId: 'still-lumina',
      },
      { intent: 'leave', label: 'Salgo sin comprar', optionId: 'back-search' },
    ];
  }
  if (screen === 'compare') {
    return [
      {
        intent: 'risk',
        label: 'Estoy dispuesto a abrir la oferta de $610',
        optionId: 'open-lumina-informed',
      },
      {
        intent: 'suspect',
        label: 'Es demasiado bueno para ser verdad',
        optionId: 'reject-price-after-note',
      },
      { intent: 'leave', label: 'Salgo y no sigo ningún anuncio', optionId: 'back-search-note' },
    ];
  }
  return [];
}

export function overlayFeedback(
  intent: ImmersiveDecision,
  screen: BrowseScreen,
): {
  explanation: string;
  recommendation: string;
} {
  if (intent === 'suspect') {
    return {
      explanation:
        'Bien: un precio muy por debajo de la referencia de esta historia pide preguntas, no prisa. Los elogios del mismo anuncio no identifican al vendedor.',
      recommendation:
        'Compara el precio de referencia y busca un canal que ya conocieras. El texto sigue disponible si la voz no suena.',
    };
  }
  if (intent === 'leave') {
    return {
      explanation:
        'Salir evitó adelantar dinero en este ejercicio. Aún puedes mejorar cómo evalúas la próxima oferta.',
      recommendation:
        'Antes de una compra futura, mira quién vende, qué dicen fuera del anuncio y si el pago te protege. No envíes dinero sin comprobar.',
    };
  }
  if (screen === 'official') {
    return {
      explanation:
        'En esta ficción CasaTec es el comercio de referencia, no un anuncio de ganga. Aun así, un precio conocido no sustituye verificar el canal.',
      recommendation:
        'En la vida real, confirma el comercio por un medio que ya tenías. Esta simulación no realiza compras.',
    };
  }
  return {
    explanation:
      'Querer comprar es comprensible. Los comentarios positivos de la misma publicación pueden ser inventados. Un perfil reciente y un precio de $610 frente a $1.190 son pistas, no pruebas aisladas.',
    recommendation:
      'No envíes dinero ni datos de pago. Verifica al vendedor por un canal independiente. El texto del consejo sigue disponible si la voz no suena. En este ejercicio la compra no se realiza.',
  };
}

export interface BVoiceLink {
  optionId: string;
  adviceId: string | null;
  showsAdvice: boolean;
}

/**
 * Decisiones inmersivas y su ID compatible.
 * still-lumina y open-lumina-informed no muestran consejo: pasan al muro.
 */
export const B_VOICE_LINKED: Readonly<Record<ImmersiveDecision, readonly BVoiceLink[]>> = {
  risk: [
    { optionId: 'open-shop', adviceId: 'tienda-iphone:review-volume', showsAdvice: true },
    { optionId: 'buy-casatec', adviceId: 'tienda-iphone:known-channel', showsAdvice: true },
    { optionId: 'open-lumina-informed', adviceId: 'tienda-iphone:low-price', showsAdvice: false },
  ],
  suspect: [
    { optionId: 'search-opinions', adviceId: 'tienda-iphone:own-channel-proof', showsAdvice: true },
    { optionId: 'still-lumina', adviceId: 'tienda-iphone:low-price', showsAdvice: false },
    { optionId: 'reject-price-after-note', adviceId: 'tienda-iphone:low-price', showsAdvice: true },
  ],
  leave: [
    {
      optionId: 'back-search-profile',
      adviceId: 'tienda-iphone:leave-check',
      showsAdvice: true,
    },
    { optionId: 'back-search', adviceId: 'tienda-iphone:leave-check', showsAdvice: true },
    { optionId: 'back-search-note', adviceId: 'tienda-iphone:leave-check', showsAdvice: true },
  ],
};

/** Huecos de voz de la UI inmersiva: ninguno tras 10.8. */
export const B_VOICE_GAPS: readonly string[] = [];

export function engineOpenForResult(kind: SearchResult['kind']): string | null {
  if (kind === 'facebook') {
    return 'open-lumina';
  }
  if (kind === 'official') {
    return 'open-casatec';
  }
  if (kind === 'compare') {
    return 'open-compare';
  }
  return null;
}

export function screenAfterResult(kind: SearchResult['kind']): BrowseScreen | null {
  if (kind === 'facebook') {
    return 'facebook';
  }
  if (kind === 'official') {
    return 'official';
  }
  if (kind === 'compare') {
    return 'compare';
  }
  return null;
}

export function scheduleBrowseDelay(
  onDone: () => void,
  delayMs: number,
  schedule: (fn: () => void, ms: number) => ReturnType<typeof setTimeout> = setTimeout,
  cancel: (id: ReturnType<typeof setTimeout>) => void = clearTimeout,
): () => void {
  const id = schedule(onDone, delayMs);
  return () => {
    cancel(id);
  };
}
