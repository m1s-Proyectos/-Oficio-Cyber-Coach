import {
  CODIGO_VERIFICACION_PRESENTATION,
  CODIGO_VERIFICACION_SCENARIO,
  CODIGO_VERIFICACION_SLUG,
} from './codigoVerificacion';
import {
  EMPLEO_PAGO_PREVIO_PRESENTATION,
  EMPLEO_PAGO_PREVIO_SCENARIO,
  EMPLEO_PAGO_PREVIO_SLUG,
} from './empleoPagoPrevio';
import type { PreventionPresentation } from './preventionTypes';
import {
  SUPUESTO_JEFE_PRESENTATION,
  SUPUESTO_JEFE_SCENARIO,
  SUPUESTO_JEFE_SLUG,
} from './supuestoJefe';
import type { ScenarioDefinition } from '../engine';

export interface PreventionContentPack {
  slug: string;
  definition: ScenarioDefinition;
  presentation: Readonly<Record<string, PreventionPresentation>>;
}

export const PREVENTION_PACKS: Readonly<Record<string, PreventionContentPack>> = {
  [EMPLEO_PAGO_PREVIO_SLUG]: {
    slug: EMPLEO_PAGO_PREVIO_SLUG,
    definition: EMPLEO_PAGO_PREVIO_SCENARIO,
    presentation: EMPLEO_PAGO_PREVIO_PRESENTATION,
  },
  [CODIGO_VERIFICACION_SLUG]: {
    slug: CODIGO_VERIFICACION_SLUG,
    definition: CODIGO_VERIFICACION_SCENARIO,
    presentation: CODIGO_VERIFICACION_PRESENTATION,
  },
  [SUPUESTO_JEFE_SLUG]: {
    slug: SUPUESTO_JEFE_SLUG,
    definition: SUPUESTO_JEFE_SCENARIO,
    presentation: SUPUESTO_JEFE_PRESENTATION,
  },
};

export function getPreventionPack(slug: string): PreventionContentPack | undefined {
  return PREVENTION_PACKS[slug];
}
