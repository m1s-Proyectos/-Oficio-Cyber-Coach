import { DashboardPage, HomePage } from '../features/home';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { ChallengeIndexPage, QuickChallengePage } from '../features/quick-challenges';
import { ResultsPage } from '../features/results';
import { SimulationPage } from '../features/simulation';
import { ConvexClientProvider } from './ConvexClientProvider';
import { Layout } from './Layout';
import { RouterProvider, Routes } from './router';

/**
 * Raíz de la aplicación.
 *
 * Responsabilidades:
 * - Conectar el cliente de Convex (si `VITE_CONVEX_URL` está configurada).
 * - Montar el enrutador por hash.
 * - Aplicar el layout global (cabecera + main + pie, con enlace de salto).
 * - Delegar la pantalla actual al diccionario de rutas.
 *
 * El panel (`#/panel`) es gamificación local de retos rápidos; no altera la
 * portada ni la nota educativa oficial de las simulaciones A–E (Fase 04+).
 */
export function App() {
  return (
    <ConvexClientProvider>
      <RouterProvider>
        <Layout>
          <Routes
            elements={{
              home: <HomePage />,
              dashboard: <DashboardPage />,
              challengeCatalog: <ChallengeIndexPage />,
              challenge: <QuickChallengePage />,
              simulation: <SimulationPage />,
              result: <ResultsPage />,
              notFound: <NotFoundPage />,
            }}
          />
        </Layout>
      </RouterProvider>
    </ConvexClientProvider>
  );
}
