import { HomePage } from '../features/home';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
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
 * NO contiene lógica de negocio: la evaluación de decisiones y el cálculo
 * de puntajes llegan en las Fases 04 a 07.
 */
export function App() {
  return (
    <ConvexClientProvider>
      <RouterProvider>
        <Layout>
          <Routes
            elements={{
              home: <HomePage />,
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
