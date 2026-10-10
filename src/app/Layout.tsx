import type { ReactNode } from 'react';
import { SkipLink } from '../components/SkipLink';
import { PageHeader } from './PageHeader';
import { SiteFooter } from './SiteFooter';

const MAIN_ID = 'main-content';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout global: cabecera + main con skip-link + pie.
 * La región principal recibe tabIndex -1 para que el enlace de salto le
 * entregue el foco sin forzar scroll adicional.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <SkipLink targetId={MAIN_ID} />
      <PageHeader />
      <main id={MAIN_ID} className="app-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
