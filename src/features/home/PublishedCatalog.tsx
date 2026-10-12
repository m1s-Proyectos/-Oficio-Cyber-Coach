import { LOCAL_PLAYABLE_SLUGS, LOCAL_PREVENTION_CATALOG } from '../../content';
import { ScenarioCard } from '../../components/ScenarioCard';

interface CatalogCard {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  position: number;
}

function CatalogGrid({ items }: { items: readonly CatalogCard[] }) {
  return (
    <div className="grid" data-cols="2">
      {items.map((scenario) => {
        const playable = LOCAL_PLAYABLE_SLUGS.has(scenario.slug);
        return (
          <ScenarioCard
            key={scenario.slug}
            kicker={scenario.kicker}
            title={scenario.title}
            description={scenario.summary}
            statusLabel={playable ? 'Laboratorio interactivo' : 'Vista previa'}
            statusTone={playable ? 'verify' : 'preview'}
            cta={playable ? 'Iniciar laboratorio' : 'Explorar escenario'}
            to="simulation"
            params={{ slug: scenario.slug }}
          />
        );
      })}
    </div>
  );
}

/** Catálogo completamente local; no necesita conexión ni configuración externa. */
export function PublishedCatalog() {
  const items = LOCAL_PREVENTION_CATALOG.map((item) => ({
    slug: item.slug,
    kicker: item.kicker,
    title: item.title,
    summary: item.summary,
    position: item.position,
  }));
  const core = [
    {
      slug: 'whatsapp-familiar',
      position: 1,
      kicker: 'Laboratorio · Ingeniería social',
      title: '¿Y si realmente fuera mi familiar?',
      summary: 'Un mensaje urgente pide dinero. Practica cómo comprobar la identidad antes de actuar.',
    },
    {
      slug: 'tienda-iphone',
      position: 2,
      kicker: 'Laboratorio · Compras online',
      title: 'La oferta del iPhone',
      summary: 'Investiga una oferta llamativa y decide cuándo detener un pago sospechoso.',
    },
  ];
  return <CatalogGrid items={[...core, ...items].sort((a, b) => a.position - b.position)} />;
}
