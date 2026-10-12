/* eslint-disable react-refresh/only-export-components --
 * Este archivo expone a propósito tanto componentes (`RouterProvider`, `Link`,
 * `Routes`) como helpers (`pathFor`, `useNavigate`, `useCurrentRoute`) que
 * forman la API pública del enrutador. Separarlos en varios archivos
 * fragmentaría la cohesión del módulo sin beneficio real para el prototipo.
 * Es seguro renunciar aquí a Fast Refresh completo porque editar el router
 * provoca de todos modos un recargado lógico de la aplicación.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

/**
 * Mini-enrutador por hash para la Fase 02.
 *
 * Por qué un enrutador propio:
 * - No añade dependencias con vulnerabilidades conocidas (ver informe de Fase 02).
 * - El prototipo tiene pocas rutas y no requiere data loaders ni suspensión.
 * - Hash-based `#/ruta` evita cualquier configuración de servidor estático.
 *
 * Qué NO hace: data loading, suspensión, animaciones. Si la Fase 05+ necesita
 * algo más complejo, se reemplaza este módulo por el enrutador aprobado en el
 * plan maestro, sin tocar las pantallas.
 */

export type RouteName =
  | 'home'
  | 'dashboard'
  | 'simulationCatalog'
  | 'challengeCatalog'
  | 'simulation'
  | 'result'
  | 'challenge'
  | 'notFound';

interface RouteDefinition {
  readonly pattern: string;
  readonly segments: readonly RouteSegment[];
}

type RouteSegment = { kind: 'literal'; value: string } | { kind: 'param'; name: string };

const DEFINITIONS: Readonly<Record<Exclude<RouteName, 'notFound'>, RouteDefinition>> = {
  home: makeDefinition('/'),
  dashboard: makeDefinition('/panel'),
  simulationCatalog: makeDefinition('/laboratorios'),
  challengeCatalog: makeDefinition('/retos'),
  simulation: makeDefinition('/simulaciones/:slug'),
  result: makeDefinition('/simulaciones/:slug/resultado'),
  challenge: makeDefinition('/retos/:slug'),
};

function makeDefinition(pattern: string): RouteDefinition {
  const segments: RouteSegment[] = pattern
    .split('/')
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith(':')
        ? { kind: 'param' as const, name: part.slice(1) }
        : { kind: 'literal' as const, value: part },
    );
  return { pattern, segments };
}

export interface ResolvedRoute {
  name: RouteName;
  params: Readonly<Record<string, string>>;
  path: string;
}

const NOT_FOUND_ROUTE: ResolvedRoute = {
  name: 'notFound',
  params: {},
  path: '/404',
};

function readHashPath(): string {
  if (typeof window === 'undefined') {
    return '/';
  }
  const raw = window.location.hash.replace(/^#/, '');
  if (raw === '' || raw === '/') {
    return '/';
  }
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function matchDefinition(
  name: Exclude<RouteName, 'notFound'>,
  definition: RouteDefinition,
  pathSegments: readonly string[],
): ResolvedRoute | null {
  if (pathSegments.length !== definition.segments.length) {
    return null;
  }
  const params: Record<string, string> = {};
  for (let i = 0; i < definition.segments.length; i += 1) {
    const segment = definition.segments[i];
    const value = pathSegments[i];
    if (segment === undefined || value === undefined) {
      return null;
    }
    if (segment.kind === 'literal') {
      if (segment.value !== value) {
        return null;
      }
    } else {
      params[segment.name] = decodeURIComponent(value);
    }
  }
  return {
    name,
    params,
    path: pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/',
  };
}

function resolvePath(path: string): ResolvedRoute {
  const normalized = path.split('?')[0] ?? '/';
  const segments = normalized.split('/').filter((part) => part.length > 0);
  const names = Object.keys(DEFINITIONS) as Array<Exclude<RouteName, 'notFound'>>;
  for (const name of names) {
    const def = DEFINITIONS[name];
    const match = matchDefinition(name, def, segments);
    if (match) {
      return match;
    }
  }
  return { ...NOT_FOUND_ROUTE, path: normalized };
}

export function pathFor(name: RouteName, params: Record<string, string> = {}): string {
  if (name === 'notFound') {
    return '/404';
  }
  const def = DEFINITIONS[name];
  const parts = def.segments.map((segment) => {
    if (segment.kind === 'literal') {
      return segment.value;
    }
    const value = params[segment.name];
    if (value === undefined || value === '') {
      throw new Error(`Falta el parámetro "${segment.name}" para la ruta "${name}"`);
    }
    return encodeURIComponent(value);
  });
  const joined = parts.join('/');
  return joined === '' ? '/' : `/${joined}`;
}

interface RouterContextValue {
  current: ResolvedRoute;
  navigate: (name: RouteName, params?: Record<string, string> | undefined) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [current, setCurrent] = useState<ResolvedRoute>(() => resolvePath(readHashPath()));

  useEffect(() => {
    function onChange() {
      setCurrent(resolvePath(readHashPath()));
    }
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
  }, []);

  const navigate = useCallback<RouterContextValue['navigate']>((name, params) => {
    const path = pathFor(name, params);
    window.location.hash = path;
    // Reset scroll on route change for sensible defaults.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, []);

  const value = useMemo<RouterContextValue>(() => ({ current, navigate }), [current, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const value = useContext(RouterContext);
  if (!value) {
    throw new Error('useRouter debe usarse dentro de <RouterProvider>');
  }
  return value;
}

export function useNavigate(): RouterContextValue['navigate'] {
  return useRouter().navigate;
}

export function useCurrentRoute(): ResolvedRoute {
  return useRouter().current;
}

/* ---------- Link ---------- */

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  to: RouteName;
  params?: Record<string, string> | undefined;
  children: ReactNode;
  onNavigate?: (() => void) | undefined;
}

export function Link({ to, params, children, onNavigate, ...rest }: LinkProps) {
  const navigate = useNavigate();
  const current = useCurrentRoute();
  const path = pathFor(to, params);
  const isCurrent =
    current.name === to && JSON.stringify(current.params) === JSON.stringify(params ?? {});

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    event.preventDefault();
    navigate(to, params);
    onNavigate?.();
  };

  return (
    <a
      {...rest}
      href={`#${path}`}
      onClick={handleClick}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {children}
    </a>
  );
}

/* ---------- Routes ---------- */

interface RoutesProps {
  elements: Readonly<Record<RouteName, ReactNode>>;
}

export function Routes({ elements }: RoutesProps) {
  const { current } = useRouter();
  return <>{elements[current.name]}</>;
}
