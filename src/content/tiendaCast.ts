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
