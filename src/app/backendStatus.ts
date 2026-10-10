import { createContext, useContext } from 'react';

export const BackendConfiguredContext = createContext(false);

/** `false` cuando falta `VITE_CONVEX_URL`: las vistas muestran un estado de error en lugar de fallar. */
export function useBackendConfigured(): boolean {
  return useContext(BackendConfiguredContext);
}
