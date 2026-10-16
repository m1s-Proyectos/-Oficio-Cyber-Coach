import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { SectionHeading } from '../../components/SectionHeading';
import { StatusMessage } from '../../components/StatusMessage';
import { useCurrentRoute } from '../../app/router';
import { LOCAL_PLAYABLE_SLUGS, TIENDA_IPHONE_SLUG, WHATSAPP_FAMILIAR_SLUG } from '../../content';
import { getMockSummary, type MockSummary } from './mockSummary';

export function ResultsPage() {
  const { params } = useCurrentRoute();
  const slug = params.slug;

  if (!slug) {
    return (
      <Container size="narrow">
        <StatusMessage
          kind="empty"
          title="Falta el escenario"
          description="No se indicó de qué simulación mostrar el resumen."
          action={
            <Button as="link" to="home" variant="secondary">
              Ir al inicio
            </Button>
          }
        />
      </Container>
    );
  }

  if (
    slug === WHATSAPP_FAMILIAR_SLUG ||
    slug === TIENDA_IPHONE_SLUG ||
    LOCAL_PLAYABLE_SLUGS.has(slug)
  ) {
    const which =
      slug === WHATSAPP_FAMILIAR_SLUG ? 'A' : slug === TIENDA_IPHONE_SLUG ? 'B' : 'de prevención';
    return (
      <Container size="narrow">
        <StatusMessage
          kind="empty"
          title="El cierre vive en el teléfono simulado"
          description={`La nota oficial de la Simulación ${which} se muestra al cerrar un final en el reproductor. Si saliste antes, el ejercicio queda incompleto y no hay nota. La sesión aún no se guarda en el servidor.`}
          action={
            <Button as="link" to="simulation" params={{ slug }} variant="secondary">
              {`Abrir la simulación ${which}`}
            </Button>
          }
        />
      </Container>
    );
  }

  const summary = getMockSummary(slug);
  if (!summary) {
    return (
      <Container size="narrow">
        <StatusMessage
          kind="error"
          title={`No encontramos resumen para "${slug}"`}
          description="Los resúmenes de vista previa solo existen para los dos escenarios del catálogo."
          action={
            <Button as="link" to="home" variant="secondary">
              Volver al inicio
            </Button>
          }
        />
      </Container>
    );
  }

  return <SummaryView summary={summary} slug={slug} />;
}

function SummaryView({ summary, slug }: { summary: MockSummary; slug: string }) {
  const percent = (summary.totalScore / summary.totalMax) * 100;
  return (
    <Container size="narrow">
      <Breadcrumbs
        items={[
          { label: 'Inicio', to: 'home' },
          { label: summary.scenarioTitle, to: 'simulation', params: { slug } },
          { label: 'Resumen' },
        ]}
      />

      <article className="stack" data-gap="lg" aria-labelledby="results-title">
        <SectionHeading
          id="results-title"
          eyebrow="Resumen de la simulación"
          title={summary.scenarioTitle}
          subtitle={summary.reading}
        />

        <Alert tone="warning" title="Vista previa de diseño">
          Esta pantalla muestra la plantilla del resumen. Los números y recomendaciones son
          simulados; la aritmética real se calcula en el servidor desde la Fase 07.
        </Alert>

        <section aria-labelledby="score-heading">
          <h2 id="score-heading" className="sr-only">
            Puntuación global
          </h2>
          <div className="score">
            <span className="score__label">Puntuación global (previsualización)</span>
            <span className="score__value">
              {summary.totalScore}
              <span style={{ fontSize: '1.25rem', color: 'var(--color-ink-muted)' }}>
                {' '}
                / {summary.totalMax}
              </span>
            </span>
            <Badge tone="preview">Resultado simulado</Badge>
          </div>
        </section>

        <section aria-labelledby="rubric-heading" className="stack" data-gap="sm">
          <h2 id="rubric-heading" className="section-head__title" style={{ fontSize: '1.25rem' }}>
            Desglose por dimensión
          </h2>
          <div className="rubric-grid">
            {summary.dimensions.map((dimension) => {
              const dimensionPercent = (dimension.value / dimension.max) * 100;
              return (
                <article key={dimension.key} className="rubric-item">
                  <p className="rubric-item__label">{dimension.label}</p>
                  <p className="rubric-item__value">
                    {dimension.value}
                    <span style={{ fontSize: '1rem', color: 'var(--color-ink-muted)' }}>
                      {' '}
                      / {dimension.max}
                    </span>
                  </p>
                  <div
                    className="rubric-bar"
                    role="progressbar"
                    aria-valuenow={dimension.value}
                    aria-valuemin={0}
                    aria-valuemax={dimension.max}
                    aria-label={`${dimension.label}: ${dimension.value} de ${dimension.max}`}
                  >
                    <span className="rubric-bar__fill" style={{ width: `${dimensionPercent}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
          <p className="section-head__subtitle" style={{ fontSize: '0.9rem' }}>
            Lectura global del prototipo: {Math.round(percent)}% del máximo.
          </p>
        </section>

        <section aria-labelledby="reco-heading" className="stack" data-gap="sm">
          <h2 id="reco-heading" className="section-head__title" style={{ fontSize: '1.25rem' }}>
            Qué llevarse de este ejercicio
          </h2>
          <ul className="stack" data-gap="sm">
            {summary.recommendations.map((text) => (
              <li key={text} className="card" data-variant="muted">
                {text}
              </li>
            ))}
          </ul>
        </section>

        <div className="row">
          <Button as="link" to="simulation" params={{ slug }} variant="secondary">
            Volver al reproductor
          </Button>
          <Button as="link" to="home" variant="ghost">
            Ir al inicio
          </Button>
        </div>
      </article>
    </Container>
  );
}
