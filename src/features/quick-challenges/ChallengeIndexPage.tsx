import { Link } from '../../app/router';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { SectionHeading } from '../../components/SectionHeading';
import { challenges } from '../../content/quickChallenges';
import { useLocalProgress } from './useLocalProgress';

/** Catálogo mínimo de retos rápidos. No sustituye el catálogo Convex ni la nota A–E. */
export function ChallengeIndexPage() {
  const { progress } = useLocalProgress();

  return (
    <Container size="wide">
      <SectionHeading
        eyebrow="Retos rápidos"
        title="Elige qué quieres practicar"
        subtitle="Lecciones breves, independientes de las simulaciones A–E. El progreso se guarda solo en este navegador."
      />
      <Alert tone="info" title="Progreso motivacional (local)">
        El XP y los logros viven en <code>oficio-learning-progress-v1</code> y no constituyen la
        calificación oficial de las simulaciones A–E.
      </Alert>
      <p className="catalog-count">
        {progress.completedChallenges.length} de {challenges.length} completados ·{' '}
        {progress.earnedXp} XP motivacional ·{' '}
        <Link to="dashboard" className="text-link">
          Ver panel
        </Link>
      </p>
      <div className="row" style={{ marginBottom: '1rem' }}>
        <Button as="link" to="dashboard" variant="secondary" size="sm">
          Abrir panel de práctica
        </Button>
      </div>
      <div className="quick-challenge-grid">
        {challenges.map((challenge) => {
          const done = progress.completedChallenges.includes(challenge.id);
          return (
            <article
              key={challenge.id}
              className={`quick-challenge-card${done ? ' is-done' : ''}`}
            >
              <div className="quick-challenge-card__meta">
                <span>{challenge.category}</span>
                <span>
                  {challenge.minutes} min · {challenge.difficulty}
                  {done ? ' · Hecho' : ''}
                </span>
              </div>
              <h3>{challenge.title}</h3>
              <p>{challenge.intro}</p>
              <Link
                to="challenge"
                params={{ slug: challenge.id }}
                className="quick-challenge-card__link"
              >
                {done ? 'Repasar reto →' : 'Empezar reto →'}
              </Link>
            </article>
          );
        })}
      </div>
    </Container>
  );
}
