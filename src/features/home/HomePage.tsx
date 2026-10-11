import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { SectionHeading } from '../../components/SectionHeading';
import { PublishedCatalog } from './PublishedCatalog';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Observa la situación',
    body: 'Antes de reaccionar, lee las señales del mensaje, la oferta o la petición. La urgencia no es una prueba.',
  },
  {
    number: '02',
    title: 'Elige una decisión',
    body: 'Comparas rutas posibles: enviar, confiar, verificar o detenerte. Cada camino tiene consecuencias.',
  },
  {
    number: '03',
    title: 'Verifica por otro canal',
    body: 'Un segundo canal independiente del original rompe la trampa. Llama, pregunta, contrasta.',
  },
  {
    number: '04',
    title: 'Aprende y vuelve a intentar',
    body: 'Si algo ya salió mal en la ficción, aún puedes detener el daño y practicar el siguiente paso.',
  },
] as const;

export function HomePage() {
  return (
    <>
      <Container size="wide">
        <section className="hero" aria-labelledby="hero-title">
          <p className="hero__eyebrow">
            <Badge tone="verify">Prototipo Fase 03</Badge>
            Antes de enviar dinero, aprende a verificar
          </p>
          <h1 id="hero-title" className="hero__title">
            Entrena decisiones seguras ante fraudes digitales.
          </h1>
          <p className="hero__lead">
            OFICIO Cyber Coach presenta escenarios ficticios interactivos para que practiques cómo
            reconocer presiones, pedir una segunda señal y detenerte a tiempo. No es una guía legal
            ni una promesa de recuperación: es un espacio de aprendizaje.
          </p>
          <div className="hero__actions">
            <Button as="link" to="simulation" params={{ slug: 'whatsapp-familiar' }} size="lg">
              Comenzar la simulación A
            </Button>
            <Button
              as="link"
              to="simulation"
              params={{ slug: 'tienda-iphone' }}
              variant="secondary"
              size="lg"
            >
              Jugar la simulación B
            </Button>
          </div>
          <div className="hero__disclaimer">
            <Alert tone="warning" title="Historias ficticias con fines educativos">
              Los personajes, importes, plazos y conversaciones son parte del ejercicio. No
              describen un caso real ni predicen cómo ocurrirán todos los fraudes.
            </Alert>
          </div>
        </section>
      </Container>

      <Container size="wide">
        <section className="stack" aria-labelledby="catalog-title" data-gap="lg">
          <SectionHeading
            id="catalog-title"
            eyebrow="Catálogo"
            title="Cinco simulaciones, un mismo motor"
            subtitle="A y B salen del catálogo remoto. Empleo, código y supuesto jefe se recorren en el cliente (reto-2, reto-7 y reto-4 de NoCaigas). Sin puntaje oficial (D3 pendiente)."
          />
          <PublishedCatalog />
        </section>
      </Container>

      <Container size="wide">
        <section className="stack" aria-labelledby="principles-title" data-gap="lg">
          <SectionHeading
            id="principles-title"
            eyebrow="Cómo aprendes"
            title="Cuatro pasos repetidos en cada escenario"
            subtitle="Los principios son los mismos aunque cambie la historia: una presión aparece, tomas una decisión, verificas por otro canal y, si es necesario, retomas el control."
          />
          <div className="grid" data-cols="4">
            {PRINCIPLES.map((principle) => (
              <article key={principle.number} className="principle">
                <span className="principle__number">{principle.number}</span>
                <h3 className="principle__title">{principle.title}</h3>
                <p className="principle__body">{principle.body}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>

      <Container size="wide">
        <section aria-labelledby="status-title">
          <Alert tone="info" title="Estado real del prototipo">
            <p>
              A y B se anuncian desde Convex. Tres escenarios de prevención se cargan en el cliente
              y no se han sembrado en remoto. El motor corre en memoria. Sin puntaje oficial (D3
              pendiente).
            </p>
            <p>
              <Button as="link" to="simulation" params={{ slug: 'fixture-motor' }} variant="ghost">
                Probar el fixture del motor
              </Button>
            </p>
          </Alert>
        </section>
      </Container>
    </>
  );
}
