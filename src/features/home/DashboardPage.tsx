import { Link } from '../../app/router';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { SectionHeading } from '../../components/SectionHeading';
import { challenges, paths } from '../../content/quickChallenges';
import { useLocalProgress } from '../quick-challenges/useLocalProgress';

const ACHIEVEMENTS = [
  { id: 'first', title: 'Primer paso', description: 'Completa tu primer reto.' },
  { id: 'three', title: 'En marcha', description: 'Completa tres retos.' },
  {
    id: 'verifier',
    title: 'Verificador',
    description: 'Practica en la vida diaria y en el trabajo.',
  },
  { id: 'all', title: 'Criterio digital', description: 'Completa todos los retos rápidos.' },
] as const;

export function DashboardPage() {
  const { progress, completedCount, accuracy } = useLocalProgress();
  const pending = challenges.filter(
    (challenge) => !progress.completedChallenges.includes(challenge.id),
  );
  const recommended = (pending.length ? pending : challenges).slice(0, 3);
  const completion = Math.round((completedCount / challenges.length) * 100);

  return (
    <>
      <Container size="wide">
        <section className="dashboard-welcome">
          <div>
            <p className="hero__eyebrow">TU ESPACIO DE APRENDIZAJE</p>
            <h1>¡Vamos paso a paso!</h1>
            <p>
              Un poco de práctica hoy puede ayudarte a tomar decisiones más seguras mañana.
            </p>
          </div>
          <Button as="link" to="challengeCatalog" variant="secondary">
            Ver todos los retos →
          </Button>
        </section>

        <section className="dashboard-stats" aria-label="Tu progreso">
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Retos completados</span>
            <strong>
              {completedCount}<small> / {challenges.length}</small>
            </strong>
            <span className="dashboard-stat__hint">Tu práctica acumulada</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">XP ganados</span>
            <strong>{progress.earnedXp}</strong>
            <span className="dashboard-stat__hint">Por tomar decisiones seguras</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Precisión inicial</span>
            <strong>{accuracy}%</strong>
            <span className="dashboard-stat__hint">En tu primera respuesta</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Racha actual</span>
            <strong>
              {progress.currentStreak}<small> días</small>
            </strong>
            <span className="dashboard-stat__hint">Vuelve a practicar mañana</span>
          </div>
        </section>

        <div className="dashboard-progress" aria-label={`Progreso total: ${completion}%`}>
          <div>
            <strong>Tu recorrido</strong>
            <span>{completion}% completado</span>
          </div>
          <div className="dashboard-progress__track">
            <span style={{ width: `${completion}%` }} />
          </div>
        </div>
      </Container>

      <Container size="wide">
        <section className="stack" data-gap="md" aria-labelledby="recommended-title">
          <SectionHeading
            id="recommended-title"
            eyebrow="Recomendado para ti"
            title="Sigue aprendiendo"
            subtitle="Retos breves seleccionados según lo que aún tienes pendiente."
          />
          <div className="quick-challenge-grid">
            {recommended.map((challenge) => (
              <article className="quick-challenge-card" key={challenge.id}>
                <div className="quick-challenge-card__meta">
                  <span>{challenge.category}</span>
                  <span>{challenge.minutes} min</span>
                </div>
                <h3>{challenge.title}</h3>
                <p>{challenge.intro}</p>
                <Link
                  to="challenge"
                  params={{ slug: challenge.id }}
                  className="quick-challenge-card__link"
                >
                  Practicar reto →
                </Link>
              </article>
            ))}
          </div>
          <div className="row">
            <Button as="link" to="challengeCatalog" variant="secondary">
              Ver todos los retos
            </Button>
            <Button as="link" to="simulationCatalog" variant="secondary">
              Explorar laboratorios
            </Button>
          </div>
        </section>
      </Container>

      <Container size="wide">
        <section className="stack" data-gap="md" aria-labelledby="paths-title">
          <SectionHeading
            id="paths-title"
            eyebrow="Rutas sugeridas"
            title="¿Qué quieres aprender hoy?"
            subtitle="Elige un tema que te interese. No necesitas conocimientos técnicos."
          />
          <div className="quick-challenge-grid">
            {paths.map((path) => (
              <article className="quick-challenge-card" key={path.id}>
                <div className="quick-challenge-card__meta">
                  <span>Ruta de aprendizaje</span>
                  <span>{path.count} retos</span>
                </div>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <Link to="challengeCatalog" className="quick-challenge-card__link">
                  Explorar esta ruta →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </Container>

      <Container size="wide">
        <section className="stack" data-gap="md" aria-labelledby="achievements-title">
          <SectionHeading
            id="achievements-title"
            eyebrow="Logros"
            title="Cada práctica cuenta"
            subtitle="Los logros se desbloquean al completar retos rápidos. Tu avance permanece en este navegador."
          />
          <div className="achievement-row">
            {ACHIEVEMENTS.map((badge) => {
              const unlocked = progress.unlockedBadges.includes(badge.id);
              return (
                <article
                  className={`achievement-card${unlocked ? ' is-unlocked' : ''}`}
                  key={badge.id}
                >
                  <span className="achievement-card__icon" aria-hidden="true">
                    {unlocked ? '✓' : '◇'}
                  </span>
                  <div>
                    <strong>{badge.title}</strong>
                    <p>{unlocked ? 'Logro desbloqueado' : badge.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Container>
    </>
  );
}
