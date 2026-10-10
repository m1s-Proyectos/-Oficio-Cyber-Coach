import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useBackendConfigured } from '../../app/backendStatus';
import { Button } from '../../components/Button';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ScenarioCard } from '../../components/ScenarioCard';
import { StatusMessage } from '../../components/StatusMessage';

function CatalogFromConvex() {
  const scenarios = useQuery(api.scenarios.listPublished);

  if (scenarios === undefined) {
    return <StatusMessage kind="loading" title="Cargando simulaciones…" />;
  }

  if (scenarios.length === 0) {
    return (
      <StatusMessage
        kind="empty"
        title="Todavía no hay simulaciones publicadas"
        description="El catálogo está vacío en este entorno. En desarrollo, ejecuta npm run seed para cargar los escenarios ficticios."
      />
    );
  }

  return (
    <div className="grid" data-cols="2">
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.slug}
          kicker={scenario.kicker}
          title={scenario.title}
          description={scenario.summary}
          statusLabel="Vista previa de diseño"
          statusTone="preview"
          to="simulation"
          params={{ slug: scenario.slug }}
        />
      ))}
    </div>
  );
}

/** Catálogo de la portada servido por Convex, con estados de carga, vacío y error. */
export function PublishedCatalog() {
  const configured = useBackendConfigured();

  if (!configured) {
    return (
      <StatusMessage
        kind="error"
        title="El catálogo no está disponible"
        description="Falta la configuración del servidor (VITE_CONVEX_URL). Consulta la sección «Puesta en marcha» del README."
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={(retry) => (
        <StatusMessage
          kind="error"
          title="No pudimos cargar las simulaciones"
          description="Ocurrió un problema al consultar el servidor. Inténtalo de nuevo en unos segundos."
          action={
            <Button type="button" variant="secondary" onClick={retry}>
              Reintentar
            </Button>
          }
        />
      )}
    >
      <CatalogFromConvex />
    </ErrorBoundary>
  );
}
