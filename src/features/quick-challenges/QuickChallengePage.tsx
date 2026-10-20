import { useEffect, useRef, useState } from 'react';
import { Link, useCurrentRoute } from '../../app/router';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { challenges } from '../../content/quickChallenges';
import { CompletionCelebration } from './CompletionCelebration';
import { useLocalProgress } from './useLocalProgress';

export function QuickChallengePage() {
  const { params } = useCurrentRoute();
  const challenge = challenges.find((item) => item.id === params.slug);
  const { completeChallenge, progress } = useLocalProgress();
  const [selected, setSelected] = useState<string | null>(null);
  const completedBeforeRef = useRef(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    setSelected(null);
    setShowHint(false);
    setHintIndex(0);
    completedBeforeRef.current = false;
  }, [challenge?.id]);

  if (!challenge) {
    return (
      <Container size="narrow">
        <Alert tone="warning" title="No encontramos este reto">
          Elige una lección del catálogo para continuar.
        </Alert>
        <Link to="challengeCatalog" className="btn" data-variant="primary">
          Volver a los retos
        </Link>
      </Container>
    );
  }

  const answer = challenge.options.find((option) => option.id === selected);
  const correct = selected === challenge.correct;
  const currentIndex = challenges.findIndex((item) => item.id === challenge.id);
  const nextSlug =
    challenges[(currentIndex + 1) % challenges.length]?.id ?? challenges[0]?.id ?? 'package';

  const choose = (id: string) => {
    if (selected) return;
    completedBeforeRef.current = progress.completedChallenges.includes(challenge.id);
    setSelected(id);
    completeChallenge(challenge.id, id === challenge.correct);
  };

  return (
    <Container size="narrow">
      <div className="quick-lesson">
        <div className="quick-lesson__top">
          <Link to="challengeCatalog" className="text-link">
            ← Todos los retos
          </Link>
          <span>
            {challenge.minutes} min · {challenge.difficulty}
          </span>
        </div>
        <p className="hero__eyebrow">{challenge.category}</p>
        <h1>{challenge.title}</h1>
        <p className="quick-lesson__intro">{challenge.intro}</p>

        <ChallengeSceneVisual challenge={challenge} />

        <section className="quick-lesson__question" aria-labelledby="question-title">
          <h2 id="question-title">{challenge.question}</h2>
          <div className="quick-lesson__options">
            {challenge.options.slice(0, 3).map((option, index) => {
              const isCorrect = option.id === challenge.correct;
              const isSelected = selected === option.id;
              const tone =
                selected && isCorrect ? ' correct' : isSelected && !isCorrect ? ' incorrect' : '';

              return (
                <button
                  type="button"
                  key={option.id}
                  className={`quick-lesson__option${tone}`}
                  onClick={() => choose(option.id)}
                  disabled={Boolean(selected)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>
        </section>

        {!selected ? (
          <div className="quick-lesson__hint">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (!showHint) setShowHint(true);
                else setHintIndex((index) => (index + 1) % challenge.hints.length);
              }}
            >
              {showHint ? 'Otra pista' : 'Necesito una pista'}
            </Button>
            {showHint ? <p>{challenge.hints[hintIndex]}</p> : null}
          </div>
        ) : null}

        {selected && answer ? (
          <section className="quick-lesson__feedback" aria-live="polite">
            <CompletionCelebration active={correct && !completedBeforeRef.current} />
            <Alert
              tone={correct ? 'success' : 'info'}
              title={correct ? '¡Buena decisión!' : 'Hay una opción más segura'}
              className={
                correct ? 'quick-lesson__alert quick-lesson__alert--ok' : 'quick-lesson__alert'
              }
            >
              {challenge.explanation}
            </Alert>
            <h2>Señales que conviene observar</h2>
            <ul>
              {challenge.signs.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
            <h2>Qué puedes hacer</h2>
            <ul>
              {challenge.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
            <p className="quick-lesson__takeaway">
              <strong>Qué recordar:</strong> {challenge.takeaway}
            </p>
            {completedBeforeRef.current ? (
              <p className="quick-lesson__saved">
                Este reto ya estaba completado. Tu XP no se duplica.
              </p>
            ) : (
              <p className="quick-lesson__saved">
                Has ganado {correct ? 100 : 60} XP.
              </p>
            )}
            <div className="row">
              <Button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setShowHint(false);
                  completedBeforeRef.current = progress.completedChallenges.includes(challenge.id);
                }}
              >
                Intentarlo otra vez
              </Button>
              <Link
                to="challenge"
                params={{ slug: nextSlug }}
                className="btn"
                data-variant="secondary"
              >
                Siguiente reto →
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </Container>
  );
}

function ChallengeSceneVisual({ challenge }: { challenge: (typeof challenges)[number] }) {
  return (
    <figure className="challenge-scene-image">
      <img
        src={`/images/challenges/${challenge.id}.svg`}
        alt={`Escenario ficticio de ${challenge.title}: ${challenge.scene.body}`}
        width="1200"
        height="680"
        loading="eager"
      />
      <figcaption>Escenario simulado · No interactúa con servicios reales.</figcaption>
    </figure>
  );
}
