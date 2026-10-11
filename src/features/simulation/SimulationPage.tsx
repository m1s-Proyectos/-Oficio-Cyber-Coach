import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { StatusMessage } from '../../components/StatusMessage';
import { useCurrentRoute } from '../../app/router';
import { getPreventionPack, TIENDA_IPHONE_SLUG, WHATSAPP_FAMILIAR_SLUG } from '../../content';
import { FIXTURE_SLUG, MINIMAL_SCENARIO } from '../../engine';
import { EngineSession } from './EngineSession';
import { PreventionSession } from './PreventionSession';
import { getScenarioPreview, type ScenarioPreview } from './scenarioPreview';
import { TiendaIphoneSession } from './TiendaIphoneSession';
import { WhatsAppFamiliarSession } from './WhatsAppFamiliarSession';

export function SimulationPage() {
  const { params } = useCurrentRoute();
  const slug = params.slug;

  if (!slug) {
    return <MissingSlugState />;
  }

  if (slug === FIXTURE_SLUG) {
    return <EngineSession definition={MINIMAL_SCENARIO} />;
  }

  if (slug === WHATSAPP_FAMILIAR_SLUG) {
    return <WhatsAppFamiliarSession />;
  }

  if (slug === TIENDA_IPHONE_SLUG) {
    return <TiendaIphoneSession />;
  }

  const pack = getPreventionPack(slug);
  if (pack) {
    return <PreventionSession key={pack.slug} pack={pack} />;
  }

  const preview = getScenarioPreview(slug);
  if (!preview) {
    return <UnknownSlugState slug={slug} />;
  }

  return <ScenarioPreviewView preview={preview} slug={slug} />;
}

function ScenarioPreviewView({ preview, slug }: { preview: ScenarioPreview; slug: string }) {
  return (
    <Container size="narrow">
      <Breadcrumbs
        items={[
          { label: 'Inicio', to: 'home' },
          { label: 'Simulaciones', to: 'home' },
          { label: preview.title },
        ]}
      />

      <article className="stack" data-gap="lg" aria-labelledby="scenario-title">
        <header className="stack" data-gap="sm">
          <p className="section-head__eyebrow">{preview.kicker}</p>
          <h1 id="scenario-title" className="section-head__title">
            {preview.title}
          </h1>
          <p className="section-head__subtitle">{preview.summary}</p>
          <div className="row">
            {preview.signals.map((signal) => (
              <Badge key={signal.label} tone={signal.tone}>
                {signal.label}
              </Badge>
            ))}
          </div>
        </header>

        <Alert tone="warning" title="Vista previa de diseño">
          Esta pantalla aún no evalúa las historias oficiales ni guarda tu progreso. El motor ya
          existe en la Fase 04, pero los guiones de WhatsApp y de la tienda se aprueban en las Fases
          05 y 06. Las opciones de abajo siguen siendo una maqueta visual.
        </Alert>

        <section aria-labelledby="message-heading" className="stack" data-gap="sm">
          <h2 id="message-heading" className="section-head__title" style={{ fontSize: '1.25rem' }}>
            Mensaje recibido
          </h2>
          <div className="chat-bubble">
            <p className="chat-bubble__meta">
              {preview.sender.name} · {preview.sender.channel} · {preview.sender.timestamp}
            </p>
            <p className="chat-bubble__body">{preview.message}</p>
          </div>
        </section>

        <section aria-labelledby="options-heading" className="stack" data-gap="sm">
          <h2 id="options-heading" className="section-head__title" style={{ fontSize: '1.25rem' }}>
            {preview.prompt}
          </h2>
          <ul className="decision-list">
            {preview.options.map((option) => (
              <li key={option.key}>
                <div className="decision-option" aria-disabled="true">
                  <span className="decision-option__key" aria-hidden="true">
                    {option.key}
                  </span>
                  <span className="decision-option__text">{option.text}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="section-head__subtitle" style={{ fontSize: '0.9rem' }}>
            Las opciones están desactivadas a propósito. El flujo real se habilita cuando el
            servidor pueda validar la decisión y devolver la siguiente escena.
          </p>
        </section>

        <section aria-labelledby="result-link-heading" className="stack" data-gap="sm">
          <h2
            id="result-link-heading"
            className="section-head__title"
            style={{ fontSize: '1.25rem' }}
          >
            ¿Cómo se verá el resumen?
          </h2>
          <p className="section-head__subtitle">
            Para revisar la pantalla de resultados con datos simulados, abre la vista previa del
            resumen. El cálculo real llega en la Fase 07.
          </p>
          <div className="row">
            <Button as="link" to="result" params={{ slug }} variant="secondary">
              Ver vista previa del resumen
            </Button>
            <Button as="link" to="home" variant="ghost">
              ← Volver al inicio
            </Button>
          </div>
        </section>
      </article>
    </Container>
  );
}

function MissingSlugState() {
  return (
    <Container size="narrow">
      <StatusMessage
        kind="empty"
        title="Falta el escenario"
        description="No se indicó qué simulación cargar. Vuelve al catálogo para elegir una."
        action={
          <Button as="link" to="home" variant="secondary">
            Ir al catálogo
          </Button>
        }
      />
    </Container>
  );
}

function UnknownSlugState({ slug }: { slug: string }) {
  return (
    <Container size="narrow">
      <StatusMessage
        kind="error"
        title={`No encontramos el escenario "${slug}"`}
        description="Los escenarios jugables son WhatsApp, la tienda, empleo con pago previo, código de verificación y supuesto jefe. El fixture del motor usa fixture-motor."
        action={
          <Button as="link" to="home" variant="secondary">
            Volver al catálogo
          </Button>
        }
      />
    </Container>
  );
}
