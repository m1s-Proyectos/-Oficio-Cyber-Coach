import { Container } from '../components/Container';
import { Link } from './router';

/**
 * Cabecera principal del sitio.
 * Marca con monograma + enlaces primarios. Se queda pegada arriba con
 * un efecto translúcido para ganar foco de lectura sin perder presencia.
 */
export function PageHeader() {
  return (
    <header className="site-header" role="banner">
      <Container size="wide">
        <div className="site-header__inner">
          <Link to="home" className="brand" aria-label="OFICIO Cyber Coach. Ir al inicio.">
            <span className="brand__mark" aria-hidden="true">
              OC
            </span>
            <span className="brand__wordmark">
              <span className="brand__wordmark-main">OFICIO</span>
              <span className="brand__wordmark-sub">Cyber Coach</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Navegación principal">
            <Link to="home" className="site-nav__link">
              Inicio
            </Link>
            <Link to="challengeCatalog" className="site-nav__link">
              Retos
            </Link>
            <Link to="dashboard" className="site-nav__link">
              Panel
            </Link>
            <Link to="simulation" params={{ slug: 'whatsapp-familiar' }} className="site-nav__link">
              Simulaciones
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
