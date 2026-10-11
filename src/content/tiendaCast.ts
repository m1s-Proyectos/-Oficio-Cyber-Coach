export interface ShopCast {
  learner: string;
  shopperName: string;
}

export const DEFAULT_SHOP_CAST: ShopCast = {
  learner: 'Alex',
  shopperName: 'María',
};

const PLACEHOLDERS = ['learner', 'shopperName'] as const;

/** Sustituye plantillas solo en texto visible. No toca ids ni destinos. */
export function applyShopCast(template: string, cast: ShopCast): string {
  let text = template;
  for (const key of PLACEHOLDERS) {
    text = text.replaceAll(`{{${key}}}`, cast[key]);
  }
  return text;
}

function sanitizeField(value: string, fallback: string): string {
  const cleaned = [...value]
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('');
  const trimmed = cleaned.trim();
  if (trimmed.length === 0 || trimmed.length > 40) {
    return fallback;
  }
  return trimmed;
}

export function sanitizeShopCast(input: ShopCast): ShopCast {
  return {
    learner: sanitizeField(input.learner, DEFAULT_SHOP_CAST.learner),
    shopperName: sanitizeField(input.shopperName, DEFAULT_SHOP_CAST.shopperName),
  };
}

/** El participante es quien busca. No se pide otro nombre. */
export function isShopCastReady(input: ShopCast): boolean {
  const trimmed = input.learner.trim();
  return trimmed.length > 0 && trimmed.length <= 40;
}

export function shopCastFromLearner(learner: string): ShopCast {
  const name = sanitizeField(learner, DEFAULT_SHOP_CAST.learner);
  return { learner: name, shopperName: name };
}

export const EMPTY_SHOP_DRAFT: ShopCast = {
  learner: '',
  shopperName: '',
};
