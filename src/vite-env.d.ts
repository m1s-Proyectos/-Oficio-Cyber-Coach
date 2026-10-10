/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL pública del deployment de Convex. Ver `.env.example`. */
  readonly VITE_CONVEX_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
