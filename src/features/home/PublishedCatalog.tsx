import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useBackendConfigured } from '../../app/backendStatus';
import { LOCAL_PLAYABLE_SLUGS, LOCAL_PREVENTION_CATALOG } from '../../content';
import { Button } from '../../components/Button';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ScenarioCard } from '../../components/ScenarioCard';
import { StatusMessage } from '../../components/StatusMessage';

interface CatalogCard {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  position: number;
}

function mergeCatalog(remote: readonly Omit<CatalogCard, 'position'>[]): CatalogCard[] {
  const remoteCards: CatalogCard[] = remote.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
  const seen = new Set(remoteCards.map((item) => item.slug));
  const extras = LOCAL_PREVENTION_CATALOG.filter((item) => !seen.has(item.slug));
  return [...remoteCards, ...extras].sort((a, b) => a.position - b.position);
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
            statusLabel={playable ? 'Simulación jugable' : 'Vista previa de diseño'}
            statusTone={playable ? 'verify' : 'preview'}
            cta={playable ? 'Jugar simulación' : 'Explorar escenario'}
            to="simulation"
            params={{ slug: scenario.slug }}
          />
        );
      })}
    </div>
  );
}

function CatalogFromConvex() {
  const scenarios = useQuery(api.scenarios.listPublished);

  if (scenarios === undefined) {
    return <StatusMessage kind="loading" title="Cargando simulaciones…" />;
  }

  const merged = mergeCatalog(scenarios);

  if (merged.length === 0) {
    return (
      <StatusMessage
        kind="empty"
        title="Todavía no hay simulaciones publicadas"
        description="El catálogo remoto está vacío y no hay escenarios locales. En desarrollo, el seed remoto no está autorizado en esta fase."
      />
    );
  }

  return <CatalogGrid items={merged} />;
}

/** Catálogo remoto más los tres escenarios locales (sin escribir en Convex). */
export function PublishedCatalog() {
  const configured = useBackendConfigured();

  if (!configured) {
    return (
      <div className="stack" data-gap="lg">
        <StatusMessage
          kind="error"
          title="El catálogo remoto no está disponible"
          description="Falta VITE_CONVEX_URL. Las tres simulaciones de prevención siguen jugables en este cliente."
        />
        <CatalogGrid items={LOCAL_PREVENTION_CATALOG} />
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={(retry) => (
        <div className="stack" data-gap="lg">
          <StatusMessage
            kind="error"
            title="No pudimos cargar las simulaciones remotas"
            description="Se muestran las tres de prevención que viven en el cliente. Intenta de nuevo para A y B."
            action={
              <Button type="button" variant="secondary" onClick={retry}>
                Reintentar
              </Button>
            }
          />
          <CatalogGrid items={LOCAL_PREVENTION_CATALOG} />
        </div>
      )}
    >
      <CatalogFromConvex />
    </ErrorBoundary>
  );
}
