import { Container } from '../components/Container';
import { Link } from './router';

const PHASE_LABEL = 'Fase 02 · Diseño visual y navegación';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <Container size="wide">
        <div className="site-footer__inner">
          <div className="site-footer__cols">
            <div>
              <p className="site-footer__title">Sobre el prototipo</p>
              <p>
                OFICIO Cyber Coach es un proyecto académico para practicar decisiones ante
                escenarios ficticios de fraude digital. Los importes, personajes y pasos de las
                historias son parte del ejercicio: no son estadísticas ni predicciones.
              </p>
            </div>
            <div>
              <p className="site-footer__title">Recorrido</p>
              <ul className="site-footer__list">
                <li>
                  <Link to="home">Inicio</Link>
                </li>
                <li>
                  <Link to="simulation" params={{ slug: 'whatsapp-familiar' }}>
                    Mensaje urgente
                  </Link>
                </li>
                <li>
                  <Link to="simulation" params={{ slug: 'tienda-iphone' }}>
                    Tienda sospechosa
                  </Link>
                </li>
                <li>
                  <Link to="simulation" params={{ slug: 'empleo-pago-previo' }}>
                    Empleo con pago
                  </Link>
                </li>
                <li>
                  <Link to="simulation" params={{ slug: 'codigo-verificacion' }}>
                    Código de verificación
                  </Link>
                </li>
                <li>
                  <Link to="simulation" params={{ slug: 'supuesto-jefe' }}>
                    Supuesto jefe
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="site-footer__title">Documentación</p>
              <ul className="site-footer__list">
                <li>PLAN-MAESTRO.md</li>
                <li>docs/contexto-producto.md</li>
                <li>docs/decisiones.md</li>
              </ul>
            </div>
          </div>
          <hr className="site-footer__divider" />
          <div className="site-footer__legal">
            <span>
              © {year} OFICIO Cyber Coach · {PHASE_LABEL}
            </span>
            <span>
              No se recopilan datos personales. Historias ficticias para fines educativos.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
