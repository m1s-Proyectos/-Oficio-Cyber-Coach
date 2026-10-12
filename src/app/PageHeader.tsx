import { Container } from '../components/Container';
import { Link } from './router';
import { useThemePreference } from './ThemeProvider';

/**
 * Cabecera principal del sitio.
 * Marca con monograma + enlaces primarios. Se queda pegada arriba con
 * un efecto translúcido para ganar foco de lectura sin perder presencia.
 */
export function PageHeader() {
  const { theme, setTheme } = useThemePreference();
  return (
    <header className="site-header" role="banner">
      <Container size="wide">
        <div className="site-header__inner">
          <Link to="home" className="brand" aria-label="NoCaigas · OFICIO Cyber Coach. Ir al inicio.">
            <span className="brand__mark" aria-hidden="true">
              OC
            </span>
            <span className="brand__wordmark">
              <span className="brand__wordmark-main">NoCaigas</span>
              <span className="brand__wordmark-sub">OFICIO · Cyber Coach</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Navegación principal">
            <Link to="home" className="site-nav__link">
              Inicio
            </Link>
            <Link to="dashboard" className="site-nav__link">
              Mi panel
            </Link>
            <Link to="simulationCatalog" className="site-nav__link">
              Laboratorios
            </Link>
            <Link to="challengeCatalog" className="site-nav__link">
              Retos
            </Link>
          </nav>
          <label className="theme-control">
            <span className="theme-control__label">Apariencia</span>
            <select aria-label="Preferencia de apariencia" value={theme} onChange={(event) => setTheme(event.target.value as 'system' | 'light' | 'dark')}>
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </label>
        </div>
      </Container>
    </header>
  );
}
