import { HomePage } from '../features/home';
import { DashboardPage } from '../features/home/DashboardPage';
import { ChallengeCatalogPage } from '../features/catalogs/ChallengeCatalogPage';
import { SimulationCatalogPage } from '../features/catalogs/SimulationCatalogPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { ResultsPage } from '../features/results';
import { QuickChallengePage } from '../features/quick-challenges/QuickChallengePage';
import { SimulationPage } from '../features/simulation';
import { Layout } from './Layout';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider, Routes } from './router';

/**
 * Raíz de la aplicación.
 *
 * Responsabilidades:
 * - Mantener el enrutador y layout desacoplados de la lógica educativa.
 * - Montar el enrutador por hash.
 * - Aplicar el layout global (cabecera + main + pie, con enlace de salto).
 * - Delegar la pantalla actual al diccionario de rutas.
 *
 * NO contiene lógica de negocio: la evaluación de decisiones y el cálculo
 * de puntajes viven en el motor local de simulaciones.
 */
export function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <Layout>
          <Routes
            elements={{
              home: <HomePage />,
              dashboard: <DashboardPage />,
              simulationCatalog: <SimulationCatalogPage />,
              challengeCatalog: <ChallengeCatalogPage />,
              simulation: <SimulationPage />,
              challenge: <QuickChallengePage />,
              result: <ResultsPage />,
              notFound: <NotFoundPage />,
            }}
          />
        </Layout>
      </RouterProvider>
    </ThemeProvider>
  );
}
