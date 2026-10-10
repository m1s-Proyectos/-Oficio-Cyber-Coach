import { ConvexProvider, ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';
import { BackendConfiguredContext } from './backendStatus';

function createClient(url: string | undefined): ConvexReactClient | null {
  if (!url) {
    return null;
  }
  try {
    return new ConvexReactClient(url);
  } catch (error) {
    console.error('VITE_CONVEX_URL no es una URL de Convex válida', error);
    return null;
  }
}

const convexClient = createClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return (
      <BackendConfiguredContext.Provider value={false}>
        {children}
      </BackendConfiguredContext.Provider>
    );
  }
  return (
    <BackendConfiguredContext.Provider value={true}>
      <ConvexProvider client={convexClient}>{children}</ConvexProvider>
    </BackendConfiguredContext.Provider>
  );
}
