import { useMemo, useState } from 'react';
import { Link } from '../../app/router';
import { Container } from '../../components/Container';
import { SectionHeading } from '../../components/SectionHeading';
import { LOCAL_PLAYABLE_SLUGS, LOCAL_PREVENTION_CATALOG } from '../../content';

const labs = [
  {
    slug: 'whatsapp-familiar',
    kicker: 'Ingeniería social',
    title: '¿Y si realmente fuera mi familiar?',
    summary:
      'Un mensaje urgente pide dinero. Practica cómo comprobar la identidad antes de actuar.',
  },
  {
    slug: 'tienda-iphone',
    kicker: 'Compras online',
    title: 'La oferta del iPhone',
    summary:
      'Investiga una oferta llamativa y decide cuándo detener un pago sospechoso.',
  },
  ...LOCAL_PREVENTION_CATALOG.map((item) => ({
    slug: item.slug,
    kicker: item.kicker.replace('Prevención · ', ''),
    title: item.title,
    summary: item.summary,
  })),
];

export function SimulationCatalogPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      labs.filter((item) =>
        `${item.title} ${item.kicker} ${item.summary}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <Container size="wide">
      <SectionHeading
        eyebrow="Laboratorios inmersivos"
        title="Practica antes de que ocurra"
        subtitle="Simulaciones más profundas en las que tus decisiones cambian el curso de la historia."
      />
      <label className="catalog-search">
        <span>Buscar un laboratorio</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. WhatsApp, empleo, tienda…"
          type="search"
        />
      </label>
      <p className="catalog-count">
        {filtered.length} de {labs.length} laboratorios
      </p>

      {filtered.length ? (
        <div className="grid" data-cols="2">
          {filtered.map((lab) => {
            const playable = LOCAL_PLAYABLE_SLUGS.has(lab.slug);
            return (
              <article className="scenario-card lab-catalog-card" key={lab.slug}>
                <div className="lab-card-art" aria-hidden="true">
                  <div className="lab-card-art__phone">
                    <span>●</span>
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="lab-card-art__badge">{lab.kicker}</span>
                </div>
                <div className="lab-catalog-card__body">
                  <p className="scenario-card__kicker">LABORATORIO · {lab.kicker}</p>
                  <h2 className="scenario-card__title">{lab.title}</h2>
                  <p className="lab-catalog-card__description">{lab.summary}</p>
                  <Link
                    to="simulation"
                    params={{ slug: lab.slug }}
                    className="btn"
                    data-variant="primary"
                  >
                    {playable ? 'Iniciar laboratorio →' : 'Explorar escenario →'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="catalog-empty">
          No encontramos laboratorios con esa búsqueda. Prueba con otra palabra.
        </p>
      )}
    </Container>
  );
}
