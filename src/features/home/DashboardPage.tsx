import { Link } from '../../app/router';
import { Alert } from '../../components/Alert';
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

/**
 * Panel de gamificación de retos rápidos.
 * No sustituye la portada ni la nota educativa oficial de las simulaciones A–E.
 */
export function DashboardPage() {
  const { progress, completedCount, accuracy } = useLocalProgress();
  const pending = challenges.filter(
    (challenge) => !progress.completedChallenges.includes(challenge.id),
  );
  const recommended = (pending.length ? pending : challenges).slice(0, 3);
  const completion =
    challenges.length === 0 ? 0 : Math.round((completedCount / challenges.length) * 100);

  return (
    <>
      <Container size="wide">
        <section className="dashboard-welcome">
          <div>
            <p className="hero__eyebrow">Panel de práctica</p>
            <h1>Tu progreso en los retos rápidos</h1>
            <p>
              Un poco de práctica hoy puede ayudarte a tomar decisiones más seguras mañana. Este
              panel solo refleja los retos breves, no las simulaciones inmersivas.
            </p>
          </div>
          <Button as="link" to="challengeCatalog" variant="secondary">
            Ver todos los retos →
          </Button>
        </section>

        <Alert tone="info" title="Progreso local y motivacional">
          El XP, las rachas y los logros se guardan solo en este navegador (
          <code>oficio-learning-progress-v1</code>
          ). No son una calificación oficial ni reemplazan la evaluación educativa de las
          simulaciones A–E, que se definirá aparte.
        </Alert>

        <section className="dashboard-stats" aria-label="Tu progreso motivacional">
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Retos completados</span>
            <strong>
              {completedCount}
              <small> / {challenges.length}</small>
            </strong>
            <span className="dashboard-stat__hint">Tu práctica acumulada</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">XP motivacional</span>
            <strong>{progress.earnedXp}</strong>
            <span className="dashboard-stat__hint">100 / 60 / 0 según el primer intento</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Precisión inicial</span>
            <strong>{accuracy}%</strong>
            <span className="dashboard-stat__hint">En tu primera respuesta</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat__label">Racha actual</span>
            <strong>
              {progress.currentStreak}
              <small> días</small>
            </strong>
            <span className="dashboard-stat__hint">
              Mejor racha: {progress.bestStreak} · fecha local YYYY-MM-DD
            </span>
          </div>
        </section>

        <div className="dashboard-progress" aria-label={`Progreso total: ${completion}%`}>
          <div>
            <strong>Tu recorrido en retos</strong>
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
            title="Sigue practicando"
            subtitle="Retos breves seleccionados según lo que aún tienes pendiente."
          />
          <div className="quick-challenge-grid">
            {recommended.map((challenge) => {
              const done = progress.completedChallenges.includes(challenge.id);
              return (
              <article
                className={`quick-challenge-card${done ? ' is-done' : ''}`}
                key={challenge.id}
              >
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
              );
            })}
          </div>
          <div className="row">
            <Button as="link" to="challengeCatalog" variant="secondary">
              Ver todos los retos
            </Button>
            <Button as="link" to="home" variant="ghost">
              Volver a la portada
            </Button>
            <Button as="link" to="simulation" params={{ slug: 'whatsapp-familiar' }} variant="ghost">
              Ir a simulaciones
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
            subtitle="Elige un tema. No necesitas conocimientos técnicos."
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
            subtitle="Los logros se desbloquean al completar retos rápidos. Tu avance permanece en este navegador y no forma parte de la nota oficial de A–E."
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
