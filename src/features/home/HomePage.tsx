import { Button } from '../../components/Button';
import { Container } from '../../components/Container';

export function HomePage() {
  return (
    <Container size="wide">
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-hero__copy">
          <p className="hero__eyebrow">ENTRENAMIENTO DE CRITERIO DIGITAL</p>
          <h1 id="hero-title" className="hero__title">
            Internet está lleno de trampas. Aprende a reconocerlas.
          </h1>
          <p className="hero__lead">
            Practica con situaciones cotidianas, detecta señales de alerta y aprende a protegerte
            antes de actuar.
          </p>
          <div className="row">
            <Button as="link" to="dashboard" size="lg">
              Empezar a aprender →
            </Button>
          </div>
          <p className="hero__note">Sin registro · A tu ritmo · Escenarios ficticios y seguros</p>
        </div>

        <div
          className="hero-phone-art"
          role="img"
          aria-label="Ilustración de un teléfono con alertas de posibles estafas"
        >
          <div className="hero-phone-art__glow" />
          <div className="hero-phone-art__phone">
            <div className="hero-phone-art__notch" />
            <div className="hero-phone-art__status">
              <span>9:41</span>
              <span>● ● ▰</span>
            </div>
            <div className="hero-phone-art__app">
              <span className="hero-phone-art__app-icon">!</span>
              <div>
                <strong>Centro de alertas</strong>
                <small>Protege tu información</small>
              </div>
            </div>
            <div className="hero-phone-art__alert hero-phone-art__alert--red">
              <span>⚠</span>
              <div>
                <strong>Mensaje sospechoso</strong>
                <small>Te piden pagar de inmediato</small>
              </div>
            </div>
            <div className="hero-phone-art__alert hero-phone-art__alert--amber">
              <span>↗</span>
              <div>
                <strong>Enlace no verificado</strong>
                <small>Comprueba antes de abrir</small>
              </div>
            </div>
            <div className="hero-phone-art__safe">
              <span>✓</span>
              <div>
                <strong>Haz una pausa</strong>
                <small>Verifica por otra vía</small>
              </div>
            </div>
          </div>
          <div className="hero-float hero-float--left">
            <span>!</span>
            <div>
              <strong>Detente</strong>
              <small>La urgencia es una señal</small>
            </div>
          </div>
          <div className="hero-float hero-float--right">
            <span>✓</span>
            <div>
              <strong>Verifica</strong>
              <small>Decide con calma</small>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-benefits" aria-label="Cómo funciona NoCaigas">
        <article>
          <span aria-hidden="true">01</span>
          <h2>Reconoce las señales</h2>
          <p>
            Aprende a identificar presión, suplantación y solicitudes sospechosas en ejemplos
            cotidianos.
          </p>
        </article>
        <article>
          <span aria-hidden="true">02</span>
          <h2>Practica sin riesgos</h2>
          <p>Resuelve situaciones ficticias y descubre las consecuencias de cada decisión.</p>
        </article>
        <article>
          <span aria-hidden="true">03</span>
          <h2>Construye criterio</h2>
          <p>
            Recibe explicaciones claras que puedes aplicar antes de compartir datos o enviar dinero.
          </p>
        </article>
      </section>

      <p className="landing-disclaimer">
        NoCaigas es una herramienta educativa. Sus escenarios son ficticios y no sustituyen el
        asesoramiento profesional ante un incidente real.
      </p>
    </Container>
  );
}
