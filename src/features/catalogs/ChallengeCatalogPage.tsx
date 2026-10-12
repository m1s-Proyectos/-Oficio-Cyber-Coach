import { useMemo, useState } from 'react';
import { Link } from '../../app/router';
import { Container } from '../../components/Container';
import { SectionHeading } from '../../components/SectionHeading';
import { challenges } from '../../content/quickChallenges';
import { useLocalProgress } from '../quick-challenges/useLocalProgress';

export function ChallengeCatalogPage() {
  const [query, setQuery] = useState('');
  const { progress } = useLocalProgress();
  const filtered = useMemo(
    () =>
      challenges.filter((item) =>
        `${item.title} ${item.category} ${item.intro} ${item.tags.join(' ')}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <Container size="wide">
      <SectionHeading
        eyebrow="Retos rápidos"
        title="Elige qué quieres practicar"
        subtitle="Lecciones breves, con un máximo de tres opciones por decisión y explicaciones claras."
      />
      <label className="catalog-search">
        <span>Buscar un reto</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. CAPTCHA, compras, mensajes…"
          type="search"
        />
      </label>
      <p className="catalog-count">
        {filtered.length} de {challenges.length} retos
      </p>

      {filtered.length ? (
        <div className="quick-challenge-grid">
          {filtered.map((challenge) => {
            const completed = progress.completedChallenges.includes(challenge.id);


            return (
              <article className="quick-challenge-card catalog-card" key={challenge.id}>
                <div className="quick-challenge-card__meta">
                  <span>{challenge.category}</span>
                  <span>{completed ? '✓ Completado' : `${challenge.minutes} min`}</span>
                </div>
                <div className="challenge-thumb">
                  <img src={`/images/challenges/${challenge.id}.svg`} alt="" loading="lazy" />
                  <span className="challenge-thumb__alert" aria-hidden="true">!</span>
                </div>
                <h2>{challenge.title}</h2>
                <p>{challenge.intro}</p>
                <Link
                  to="challenge"
                  params={{ slug: challenge.id }}
                  className="quick-challenge-card__link"
                >
                  {completed ? 'Practicar de nuevo →' : 'Abrir reto →'}
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="catalog-empty">No encontramos retos con esa búsqueda. Prueba con otra palabra.</p>
      )}
    </Container>
  );
}
